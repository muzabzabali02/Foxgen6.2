/**
 * FoxGEN Pro service worker bridge
 * - License + control against https://zokysvx.lovable.app
 * - Fail-closed authorize-send (one-time sendToken)
 * - Heartbeat recheck (expire / ban / revoke / lock)
 * - Inject freeze scripts ONLY when licensed
 * Freeze script paths unchanged.
 */


const LOCK_FLAG_KEY = "zokys_extension_locked";
const LOCK_MSG_KEY = "zokys_lock_message";
const THEME_KEY = "zokys_remote_theme";
const FEATURES_KEY = "zokys_remote_features";

const ZOKYS_BASE = "https://zokysvx.lovable.app";
const TRIVIS_API = "https://foxgenofficial.lovable.app/api/public/license/verify";
const TRIVIS_API_FALLBACK = TRIVIS_API;
const EXTENSION_STATUS_API = ZOKYS_BASE + "/api/public/extension-status";
const EXTENSION_STATUS_API_FALLBACK = ZOKYS_BASE + "/api/extension-status";
const SWITCH_API = ZOKYS_BASE + "/api/public/switch-account";
const SWITCH_API_FALLBACK = ZOKYS_BASE + "/api/switch-account";
const AUTHORIZE_SEND_API = ZOKYS_BASE + "/api/public/authorize-send";
const REPORT_OUTCOME_API = ZOKYS_BASE + "/api/public/report-outcome";
const METHOD_BUNDLE_API = ZOKYS_BASE + "/api/public/method-bundle";
const CONSUME_SEND_API = ZOKYS_BASE + "/api/public/consume-send";
const HEARTBEAT_API = ZOKYS_BASE + "/api/public/heartbeat";
const HEARTBEAT_API_FALLBACK = ZOKYS_BASE + "/api/heartbeat";
const OTA_DOWNLOAD_API = ZOKYS_BASE + "/api/public/ota-download";
const OTA_DOWNLOAD_API_FALLBACK = ZOKYS_BASE + "/api/ota-download";
/* Accept ZOKYS-XXXX-XXXX-XXXX and legacy TRIVIS-XXXX-XXXX */
/* Custom prefix: PREFIX-XXXX-XXXX-XXXX */
const KEY_RE = /^[A-Z0-9_]{2,24}(?:-[A-Z0-9]{2,16}){1,5}$/i;
const TOKEN_KEY = "trivis_license_key";
const OK_KEY = "trivis_lic_ok";
const SESSION_KEY = "trivis_lic_session";
const NAME_KEY = "trivis_user_name";
const EXP_KEY = "trivis_lic_expires";
const DEVICE_KEY = "trivis_device_id";
const LAST_CHECK_KEY = "trivis_last_recheck";

const HEARTBEAT_ALARM = "trivis_license_heartbeat";
const HEARTBEAT_MINUTES = 1;

/* FoxGEN Pro UsagiAutoX method only */
const ZOKYS_FREEZE_MAIN = ["scripts/content/z3hfc0.js"];
const ZOKYS_FREEZE_ISOLATED = [
  "scripts/shared/a2m9kx.js",
  "scripts/shared/p5v0lc.js",
  "scripts/shared/j6y4bn.js",
  "scripts/content/r7wq1a.js"
];
const FREEZE_SCRIPTS_MAIN = ZOKYS_FREEZE_MAIN;
const FREEZE_SCRIPTS_ISOLATED = ZOKYS_FREEZE_ISOLATED;

async function getMethodMode() {
  return "zokys";
}

async function setMethodMode(_mode) {
  return "zokys";
}

function deviceId() {
  return new Promise((resolve) => {
    chrome.storage.local.get([DEVICE_KEY], (r) => {
      if (r[DEVICE_KEY]) return resolve(r[DEVICE_KEY]);
      let id = "tv_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      try {
        const arr = new Uint8Array(16);
        crypto.getRandomValues(arr);
        id =
          "tv_" +
          Array.from(arr)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
            .slice(0, 24);
      } catch (_) {}
      chrome.storage.local.set({ [DEVICE_KEY]: id }, () => resolve(id));
    });
  });
}


async function applyRemoteControl(data) {
  if (!data || typeof data !== "object") return;
  try {
    const patch = {};
    if (typeof data.extension_locked === "boolean") {
      patch[LOCK_FLAG_KEY] = data.extension_locked;
      patch[LOCK_MSG_KEY] = data.lock_message || "";
    }
    if (data.theme) patch[THEME_KEY] = data.theme;
    if (data.features) patch[FEATURES_KEY] = data.features;
    if (Object.keys(patch).length) await chrome.storage.local.set(patch);
  } catch (_) {}
}

async function isLicensed() {
  const r = await chrome.storage.local.get([OK_KEY, TOKEN_KEY, EXP_KEY]);
  if (!(r[OK_KEY] === true || r[OK_KEY] === "1") || !r[TOKEN_KEY]) return false;
  if (r[EXP_KEY]) {
    const t = Date.parse(r[EXP_KEY]);
    if (t && Date.now() > t) {
      await clearLicense();
      return false;
    }
  }
  return true;
}

async function clearLicense() {
  await chrome.storage.local.remove([
    TOKEN_KEY,
    OK_KEY,
    SESSION_KEY,
    NAME_KEY,
    EXP_KEY,
    LAST_CHECK_KEY
  ]);
}

/**
 * Server recheck using stored key + device.
 * Persistent login stays until server says invalid OR local expiry.
 * Network fail → keep current session (no false logout offline).
 */
async function revalidateFromServer() {
  const r = await chrome.storage.local.get([TOKEN_KEY, NAME_KEY, OK_KEY, EXP_KEY]);
  if (!(r[OK_KEY] === true || r[OK_KEY] === "1") || !r[TOKEN_KEY]) {
    return { ok: false, reason: "no_session" };
  }

  // Local expiry first
  if (r[EXP_KEY]) {
    const t = Date.parse(r[EXP_KEY]);
    if (t && Date.now() > t) {
      await clearLicense();
      return { ok: false, reason: "expired" };
    }
  }

  const key = String(r[TOKEN_KEY]).trim().toUpperCase();
  if (!KEY_RE.test(key)) {
    await clearLicense();
    return { ok: false, reason: "bad_key" };
  }

  try {
    const dev = await deviceId();
    const name = String(r[NAME_KEY] || "FoxGEN Pro User").slice(0, 64);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    let resp;
    try {
      resp = await fetch(TRIVIS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: key, key, deviceId: dev, device_id: dev, name, recheck: true }),
        signal: ctrl.signal
      });
    } finally {
      clearTimeout(timer);
    }

    let data = await resp.json().catch(() => null);
    if ((!data || !data.ok) && typeof TRIVIS_API_FALLBACK !== "undefined") {
      try {
        const resp2 = await fetch(TRIVIS_API_FALLBACK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ licenseKey: key, key, deviceId: dev, device_id: dev, name, recheck: true })
        });
        const data2 = await resp2.json().catch(() => null);
        if (data2 && data2.ok) data = data2;
      } catch (_) {}
    }
    try { if (data && data.ok) await applyRemoteControl(data); } catch (_) {}

    // Explicit invalid from server → kill session (ban / revoke / device limit)
    if (data && (data.ok === false || data.valid === false)) {
      await clearLicense();
      return {
        ok: false,
        reason: "revoked",
        error: data.error || data.message || "License revoked"
      };
    }

    // HTTP hard fail that clearly means banned (401/403)
    if (resp.status === 401 || resp.status === 403) {
      await clearLicense();
      return { ok: false, reason: "revoked", error: "License revoked" };
    }

    // Network / 5xx / parse fail → keep session (offline safe)
    if (!resp.ok || !data) {
      await chrome.storage.local.set({ [LAST_CHECK_KEY]: Date.now() });
      return { ok: true, reason: "network_keep" };
    }

    // Server OK — refresh expiry / name if provided
    const patch = { [LAST_CHECK_KEY]: Date.now(), [OK_KEY]: true };
    if (data.expires_at) patch[EXP_KEY] = data.expires_at;
    if (data.user_name) patch[NAME_KEY] = data.user_name;
    if (data.session) patch[SESSION_KEY] = data.session;
    await chrome.storage.local.set(patch);

    return {
      ok: true,
      reason: "revalidated",
      expires_at: data.expires_at || r[EXP_KEY] || null,
      name: data.user_name || r[NAME_KEY] || null
    };
  } catch (_) {
    // Offline / abort → keep session
    return { ok: true, reason: "network_keep" };
  }
}

function isLovableProjectUrl(url) {
  try {
    // Only project workspace — never dashboard/home (freeze breaks project list + slows SPA)
    return /https:\/\/([a-z0-9-]+\.)?lovable\.dev\/projects\/[a-zA-Z0-9_-]+/i.test(String(url || ""));
  } catch (_) {
    return false;
  }
}

async function injectFreezeIntoTab(tabId, tabUrl) {
  try {
    if (tabUrl && !isLovableProjectUrl(tabUrl)) return;
    if (!tabUrl) {
      try {
        const t = await chrome.tabs.get(tabId);
        if (!t || !isLovableProjectUrl(t.url || "")) return;
      } catch (_) {
        return;
      }
    }
  } catch (_) {
    return;
  }

  try {
    const chk = await chrome.scripting.executeScript({
      target: { tabId, allFrames: false },
      world: "MAIN",
      func: function () {
        return !!window.__ZOKYS_FREEZE_INJECTED__;
      }
    });
    if (chk && chk[0] && chk[0].result === true) return;
  } catch (_) {}

  await new Promise((r) => setTimeout(r, 400));

  try {
    const chk2 = await chrome.scripting.executeScript({
      target: { tabId, allFrames: false },
      world: "MAIN",
      func: function () {
        return !!window.__ZOKYS_FREEZE_INJECTED__;
      }
    });
    if (chk2 && chk2[0] && chk2[0].result === true) return;
  } catch (_) {}

  // Mark BEFORE inject so parallel onUpdated cannot double-run
  try {
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: false },
      world: "MAIN",
      func: function () {
        try {
          window.__ZOKYS_FREEZE_INJECTED__ = true;
        } catch (e) {}
      }
    });
  } catch (_) {}

  /* Re-inject always uses stable FoxGEN Pro pack (hub switch deprecated for reliability) */
  const mode = "zokys";
  const mainFiles = ZOKYS_FREEZE_MAIN;
  const isoFiles = ZOKYS_FREEZE_ISOLATED;

  try {
    for (const file of mainFiles) {
      await chrome.scripting.executeScript({
        target: { tabId, allFrames: false },
        files: [file],
        world: "MAIN"
      });
    }
  } catch (_) {}

  try {
    if (isoFiles && isoFiles.length) {
      await chrome.scripting.executeScript({
        target: { tabId, allFrames: false },
        files: isoFiles,
        world: "ISOLATED"
      });
    }
  } catch (_) {}

  try {
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: false },
      files: ["scripts/content/zokys-label-main.js"],
      world: "MAIN"
    });
  } catch (_) {}

  try {
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: false },
      world: "MAIN",
      func: function () {
        try {
          window.__TRIVIS_LICENSED__ = true;
          window.__ZOKYS_LICENSED__ = true;
        } catch (e) {}
      }
    });
  } catch (_) {}
}


async function injectFreezeAllLovableTabs() {
  const ok = await isLicensed();
  if (!ok) return;
  try {
    const tabs = await chrome.tabs.query({
      url: ["https://lovable.dev/projects/*", "https://*.lovable.dev/projects/*"]
    });
    for (const tab of tabs) {
      if (tab.id && isLovableProjectUrl(tab.url || "")) {
        await injectFreezeIntoTab(tab.id, tab.url);
      }
    }
  } catch (_) {}
}

function scheduleHeartbeat() {
  try {
    chrome.alarms.create(HEARTBEAT_ALARM, {
      delayInMinutes: 1,
      periodInMinutes: HEARTBEAT_MINUTES
    });
  } catch (_) {}
}



async function clearLovableSession() {
  try {
    const all = await chrome.cookies.getAll({});
    for (const c of all) {
      const host = (c.domain || "").replace(/^\./, "");
      if (!/lovable\.dev$/i.test(host) && host !== "lovable.dev") continue;
      try {
        const url = "https://" + host + (c.path || "/");
        await chrome.cookies.remove({ url: url, name: c.name });
        if (c.storeId) {
          await chrome.cookies.remove({ url: url, name: c.name, storeId: c.storeId });
        }
      } catch (_) {}
    }
  } catch (_) {}
  // Common auth cookie names explicit wipe
  const names = [
    "sb-access-token",
    "sb-refresh-token",
    "lovable-session",
    "lovable-session-id",
    "__session",
    "session"
  ];
  for (const name of names) {
    for (const host of ["lovable.dev", "www.lovable.dev"]) {
      try {
        await chrome.cookies.remove({ url: "https://" + host + "/", name: name });
      } catch (_) {}
    }
  }
}


async function executeAccountSwitch(inviteUrl) {
  const ok = await isLicensed();
  if (!ok) {
    return { ok: false, error: "Activate license first" };
  }
  /* Snapshot FoxGEN Pro license so Lovable logout never wipes extension */
  const licSnap = await chrome.storage.local.get([
    TOKEN_KEY, OK_KEY, EXP_KEY, SESSION_KEY, NAME_KEY, DEVICE_KEY
  ]);
  const r = await chrome.storage.local.get([TOKEN_KEY, DEVICE_KEY]);
  const license_key = String(r[TOKEN_KEY] || "").trim();
  const device_id = r[DEVICE_KEY] || (await deviceId());
  if (!license_key) {
    return { ok: false, error: "No license key" };
  }

  const prev = await chrome.storage.local.get(["zokys_last_pool_email"]);
  const exclude_email = (prev && prev.zokys_last_pool_email) || "";
  /* Send multiple field aliases — server versions differ */
  const body = {
    license_key,
    key: license_key,
    device_id,
    deviceId: device_id,
    invite_url: inviteUrl || "",
    inviteUrl: inviteUrl || "",
    exclude_email: exclude_email || undefined,
    excludeEmail: exclude_email || undefined
  };

  async function post(url) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25000);
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
        signal: ctrl.signal
      });
      let data = null;
      const text = await resp.text();
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = null;
      }
      return { resp, data, status: resp.status, raw: text && text.slice(0, 200) };
    } finally {
      clearTimeout(timer);
    }
  }

  let data = null;
  let lastStatus = 0;
  try {
    let out = await post(SWITCH_API);
    data = out.data;
    lastStatus = out.status;
    if (!data || out.status === 404) {
      out = await post(SWITCH_API_FALLBACK);
      data = out.data;
      lastStatus = out.status;
    }
  } catch (e) {
    return {
      ok: false,
      error: e && e.name === "AbortError" ? "Timeout — try again" : "Network error reaching switch-account API"
    };
  }

  if (!data) {
    return {
      ok: false,
      error: "Invalid server response (" + lastStatus + "). Please try again or contact FoxGEN support"
    };
  }

  if (data.ok === false) {
    return {
      ok: false,
      reason: data.reason || "failed",
      error:
        data.message ||
        data.error ||
        data.reason ||
        "Switch failed — check pool accounts (available + password) and switch limit",
      switches_today: data.switches_today,
      daily_limit: data.daily_limit || data.switch_limit
    };
  }

  /* Accept both shapes: {account:{email,password}} OR top-level email/password */
  const email = String(
    (data.account && data.account.email) || data.email || data.pool_email || ""
  ).trim();
  let password = String(
    (data.account && data.account.password) || data.password || data.pool_password || ""
  ).trim();
  /* Operator pool uses one shared password when server omits it */
  if (!password) password = "ZokysX127Hub";
  if (!email) {
    return {
      ok: false,
      error: "Server did not return account email. Add available accounts in Account Pool."
    };
  }

  await clearLovableSession();

  const targetUrl = data.targetUrl || data.target_url || inviteUrl || "https://lovable.dev/";

  await chrome.storage.local.set({
    zokys_switch_pending: true,
    zokys_switch_email: email,
    zokys_switch_password: password,
    zokys_invite_url: targetUrl,
    zokys_switch_at: Date.now(),
    zokys_switch_step: "login",
    zokys_switch_shield: true,
    zokys_last_pool_email: email
  });

  // Wipe page storage on all Lovable tabs, then focus login
  try {
    const tabs = await chrome.tabs.query({ url: ["https://lovable.dev/*", "https://*.lovable.dev/*"] });
    for (const tab of tabs) {
      if (!tab.id) continue;
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          world: "MAIN",
          func: function () {
            try {
              localStorage.clear();
              sessionStorage.clear();
            } catch (e) {}
          }
        });
      } catch (_) {}
    }
  } catch (_) {}

  /* One navigation only — login with pool fill. No /logout (causes loops). */
  await new Promise((r) => setTimeout(r, 400));
  try {
    const tabs = await chrome.tabs.query({ url: ["https://lovable.dev/*", "https://*.lovable.dev/*"] });
    let focused = false;
    for (const tab of tabs) {
      if (!tab.id) continue;
      try {
        await chrome.tabs.update(tab.id, {
          url: "https://lovable.dev/login?zokys_pool=" + Date.now()
        });
        focused = true;
      } catch (_) {}
    }
    if (!focused) {
      await chrome.tabs.create({
        url: "https://lovable.dev/login?zokys_pool=" + Date.now()
      });
    }
  } catch (_) {}

  /* Restore FoxGEN Pro license keys if anything cleared them */
  try {
    const restore = {};
    if (licSnap[TOKEN_KEY]) restore[TOKEN_KEY] = licSnap[TOKEN_KEY];
    if (licSnap[OK_KEY] !== undefined) restore[OK_KEY] = licSnap[OK_KEY];
    if (licSnap[EXP_KEY] !== undefined) restore[EXP_KEY] = licSnap[EXP_KEY];
    if (licSnap[SESSION_KEY] !== undefined) restore[SESSION_KEY] = licSnap[SESSION_KEY];
    if (licSnap[NAME_KEY] !== undefined) restore[NAME_KEY] = licSnap[NAME_KEY];
    if (licSnap[DEVICE_KEY]) restore[DEVICE_KEY] = licSnap[DEVICE_KEY];
    restore[OK_KEY] = true;
    await chrome.storage.local.set(restore);
  } catch (_) {}

  return {
    ok: true,
    email: email,
    targetUrl: targetUrl,
    switches_today: data.switches_today,
    switches_left_today: data.switches_left_today,
    daily_limit: data.daily_limit || data.switch_limit || data.max_switches || null,
    cost: data.cost || 0
  };
}



async function applyLockState(data) {
  if (!data || typeof data !== "object") return;
  const locked = data.extension_locked === true || data.extension_locked === "true" || data.extension_locked === 1;
  const msg = String(data.lock_message || "Extension is locked. Please contact the administrator.").trim();

  const manifestVer = ((chrome.runtime.getManifest && chrome.runtime.getManifest()) || {}).version || "";
  const latest =
    data.latest_version || data.latestVersion || data.ota_version || data.version || data.update_version || "";
  function versionParts(v) {
    return String(v || "")
      .replace(/^v/i, "")
      .split(/[^0-9]+/)
      .filter(Boolean)
      .map(function (n) {
        return parseInt(n, 10) || 0;
      });
  }
  function isOlderThan(current, latestV) {
    if (!current || !latestV) return false;
    if (String(current) === String(latestV)) return false;
    var a = versionParts(current);
    var b = versionParts(latestV);
    var len = Math.max(a.length, b.length);
    for (var i = 0; i < len; i++) {
      var x = a[i] || 0;
      var y = b[i] || 0;
      if (x < y) return true;
      if (x > y) return false;
    }
    return false;
  }
  const forceRaw =
    data.force_update ?? data.forceUpdate ?? data.ota_force ?? data.update_required ?? data.require_update;
  let forceWanted = forceRaw === true || forceRaw === "true" || forceRaw === 1 || forceRaw === "1";
  if (!forceWanted && latest && manifestVer) {
    if (data.ota_active === true || data.update_available === true || data.has_update === true) {
      forceWanted = true;
    }
  }
  /* OTA notice ONLY if installed version is older than server latest_version */
  let force = false;
  if (forceWanted) {
    if (latest && manifestVer) {
      force = isOlderThan(manifestVer, latest);
    } else if (latest && !manifestVer) {
      force = true;
    } else {
      /* Server forced update but no version to compare — still show for safety */
      force = true;
    }
  }
  const updateMsg = String(
    data.update_message ||
      data.ota_message ||
      data.lock_message ||
      "New extension update is live. Enter your license key to download the latest zip."
  ).trim();

  /* Pure admin lock (OTA page switch) — no download required, just wait for unlock */
  const adminLock =
    locked ||
    data.admin_lock === true ||
    data.adminLock === true ||
    data.global_lock === true ||
    data.globalLock === true;

  const patch = {
    [LOCK_FLAG_KEY]: adminLock || force,
    [LOCK_MSG_KEY]: force
      ? updateMsg
      : (msg ||
        "Admin has locked all extensions. Features stay paused until the lock switch is turned OFF."),
    zokys_admin_lock: !!adminLock && !force,
    zokys_ota_force: !!force,
    zokys_ota_version: latest ? String(latest) : "",
    zokys_ota_message: updateMsg,
    zokys_ota_current: manifestVer
  };
  await chrome.storage.local.set(patch);

  try {
    const tabs = await chrome.tabs.query({ url: ["https://lovable.dev/*", "https://*.lovable.dev/*"] });
    for (const tab of tabs) {
      if (!tab.id) continue;
      try {
        chrome.tabs.sendMessage(tab.id, {
          type: "ZOKYS_LOCK_STATE",
          locked: adminLock || force,
          ota: !!force,
          message: force ? updateMsg : (msg || patch[LOCK_MSG_KEY])
        }).catch(() => {});
        chrome.tabs.sendMessage(tab.id, {
          type: "ZOKYS_OTA_STATE",
          force: !!force,
          latest_version: latest ? String(latest) : "",
          update_message: updateMsg,
          current_version: manifestVer
        }).catch(() => {});
      } catch (_) {}
    }
  } catch (_) {}
}

async function fetchExtensionStatus() {
  return null; // FoxGEN edition: remote lock from previous vendor disabled
  const body = {};
  try {
    const r = await chrome.storage.local.get([TOKEN_KEY]);
    if (r[TOKEN_KEY]) body.license_key = r[TOKEN_KEY];
  } catch (_) {}
  async function post(url) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: ctrl.signal
      });
      return await resp.json().catch(() => null);
    } finally {
      clearTimeout(t);
    }
  }
  try {
    let data = await post(EXTENSION_STATUS_API);
    if (!data || data.ok === undefined) {
      data = await post(EXTENSION_STATUS_API_FALLBACK);
    }
    if (data) await applyLockState(data);
    return data;
  } catch (_) {
    return null;
  }
}


chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg || !msg.type) return false;

  if (msg.type === "ZOKYS_PING") {
    try {
      sendResponse({ ok: true, t: Date.now(), v: (chrome.runtime.getManifest() || {}).version });
    } catch (_) {}
    return false;
  }


  if (msg.type === "TRIVIS_LOCK_STATUS" || msg.type === "ZOKYS_LOCK_STATUS") {
    (async () => {
      try {
        await fetchExtensionStatus();
      } catch (_) {}
      const r = await chrome.storage.local.get([LOCK_FLAG_KEY, LOCK_MSG_KEY]);
      sendResponse({
        locked: r[LOCK_FLAG_KEY] === true,
        message: r[LOCK_MSG_KEY] || "Extension is locked"
      });
    })();
    return true;
  }

  if (msg.type === "TRIVIS_VALIDATE") {
    (async () => {
      try {
        const key = String(msg.key || "").trim().toUpperCase();
        const name = String(msg.name || "").trim().slice(0, 64);
        const dev = await deviceId();
        if (!KEY_RE.test(key)) {
          sendResponse({ ok: false, error: "Format: FOXGEN-XXX-XXX" });
          return;
        }
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 15000);
        let resp;
        try {
          resp = await fetch(TRIVIS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ licenseKey: key, key, deviceId: dev, device_id: dev, name }),
            signal: ctrl.signal
          });
        } finally {
          clearTimeout(t);
        }
        let data = await resp.json().catch(() => null);
        if ((!data || !data.ok) && typeof TRIVIS_API_FALLBACK !== "undefined") {
          try {
            const resp2 = await fetch(TRIVIS_API_FALLBACK, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ licenseKey: key, key, deviceId: dev, device_id: dev, name })
            });
            const data2 = await resp2.json().catch(() => null);
            if (data2 && data2.ok) data = data2;
          } catch (_) {}
        }
        try { if (data && data.ok) await applyRemoteControl(data); } catch (_) {}
        if (!data || !data.ok) {
          sendResponse({
            ok: false,
            error: (data && (data.error || data.message)) || "HTTP " + resp.status
          });
          return;
        }
        const patch = {
          [TOKEN_KEY]: key,
          zokys_max_devices: data.max_devices || data.maxDevices || null,
          zokys_max_switches: data.max_switches || data.switch_limit || data.maxSwitches || null,
          zokys_switch_limit: data.switch_limit || data.max_switches || null,
          [OK_KEY]: true,
          [SESSION_KEY]: data.session || "sess_" + Date.now(),
          [NAME_KEY]: data.user_name || name || "FoxGEN Pro User",
          [LAST_CHECK_KEY]: Date.now()
        };
        if (data.expires_at) patch[EXP_KEY] = data.expires_at;
        await chrome.storage.local.set(patch);
        try { await applyLockState(data); } catch (_) {}
        await injectFreezeAllLovableTabs();
        scheduleHeartbeat();
        sendResponse({
          ok: true,
          session: patch[SESSION_KEY],
          expires_at: data.expires_at || null,
          user_name: patch[NAME_KEY],
          name: patch[NAME_KEY],
          key
        });
      } catch (e) {
        sendResponse({
          ok: false,
          error: e && e.name === "AbortError" ? "Timeout" : "Network error"
        });
      }
    })();
    return true;
  }

  // Fast local status — persistent login, no key prompt
  if (msg.type === "TRIVIS_STATUS") {
    (async () => {
      // Optional force server recheck
      if (msg.recheck) {
        await revalidateFromServer();
      }
      const ok = await isLicensed();
      const r = await chrome.storage.local.get([TOKEN_KEY, NAME_KEY, EXP_KEY]);
      sendResponse({
        ok,
        key: r[TOKEN_KEY] || null,
        name: r[NAME_KEY] || null,
        expires_at: r[EXP_KEY] || null
      });
    })();
    return true;
  }

  // Explicit server recheck (UI / manual)
  if (msg.type === "TRIVIS_RECHECK") {
    (async () => {
      const result = await revalidateFromServer();
      const r = await chrome.storage.local.get([TOKEN_KEY, NAME_KEY, EXP_KEY]);
      sendResponse({
        ok: result.ok && (await isLicensed()),
        reason: result.reason || null,
        error: result.error || null,
        key: r[TOKEN_KEY] || null,
        name: r[NAME_KEY] || null,
        expires_at: r[EXP_KEY] || null
      });
    })();
    return true;
  }

  if (msg.type === "TRIVIS_SWITCH_ACCOUNT" || msg.type === "ZOKYS_SWITCH_ACCOUNT") {
    (async () => {
      const reply = (payload) => {
        try {
          sendResponse(payload);
        } catch (_) {}
      };
      try {
        const res = await executeAccountSwitch(msg.inviteUrl || msg.invite_url || "");
        reply(res);
      } catch (e) {
        reply({ ok: false, error: String(e && e.message || e) });
      }
    })();
    return true;
  }







  if (msg.type === "ZOKYS_GET_METHOD_MODE") {
    getMethodMode().then((mode) => sendResponse({ ok: true, mode })).catch(() => sendResponse({ ok: false, mode: "zokys" }));
    return true;
  }

  if (msg.type === "ZOKYS_SET_METHOD_MODE") {
    (async () => {
      try {
        const mode = await setMethodMode(msg.mode === "hub" ? "hub" : "zokys");
        /* clear inject flag so next load reinjects */
        try {
          const tabs = await chrome.tabs.query({
            url: ["https://lovable.dev/projects/*", "https://*.lovable.dev/projects/*"]
          });
          for (const tab of tabs) {
            if (!tab.id) continue;
            try {
              await chrome.scripting.executeScript({
                target: { tabId: tab.id, allFrames: false },
                world: "MAIN",
                func: function () {
                  try {
                    window.__ZOKYS_FREEZE_INJECTED__ = false;
                    window.__ZOKYS_METHOD_MODE__ = null;
                  } catch (e) {}
                }
              });
            } catch (_) {}
          }
        } catch (_) {}
        sendResponse({ ok: true, mode: mode, hardRefresh: true });
      } catch (e) {
        sendResponse({ ok: false, error: String(e && e.message || e) });
      }
    })();
    return true;
  }


  if (msg.type === "ZOKYS_SESSION_RESET") {
    (async () => {
      const reply = (payload) => {
        try {
          sendResponse(payload);
        } catch (_) {}
      };
      try {
        const licSnap = await chrome.storage.local.get([
          TOKEN_KEY, OK_KEY, EXP_KEY, SESSION_KEY, NAME_KEY, DEVICE_KEY
        ]);
        const phase = msg.phase || "full";
        if (phase === "cookies" || phase === "full") {
          await clearLovableSession();
        }
        if (phase === "reinject" || phase === "full") {
          const tabId = (sender && sender.tab && sender.tab.id) || msg.tabId;
          if (tabId) {
            try {
              await chrome.scripting.executeScript({
                target: { tabId, allFrames: false },
                world: "MAIN",
                func: function () {
                  try {
                    window.__ZOKYS_FREEZE_INJECTED__ = false;
                  } catch (e) {}
                }
              });
            } catch (_) {}
            await injectFreezeIntoTab(tabId, (sender && sender.tab && sender.tab.url) || "");
          }
        }
        /* logout phase disabled — caused extension/lovable loops */
        if (phase === "login" || phase === "full") {
          await new Promise((r) => setTimeout(r, phase === "full" ? 800 : 200));
          try {
            const tabs = await chrome.tabs.query({ url: ["https://lovable.dev/*", "https://*.lovable.dev/*"] });
            for (const tab of tabs) {
              if (tab.id) await chrome.tabs.update(tab.id, { url: "https://lovable.dev/login?zokys_reset=" + Date.now() });
            }
          } catch (_) {}
        }
        /* always restore FoxGEN Pro license */
        try {
          const restore = { [OK_KEY]: true };
          if (licSnap[TOKEN_KEY]) restore[TOKEN_KEY] = licSnap[TOKEN_KEY];
          if (licSnap[EXP_KEY] !== undefined) restore[EXP_KEY] = licSnap[EXP_KEY];
          if (licSnap[SESSION_KEY] !== undefined) restore[SESSION_KEY] = licSnap[SESSION_KEY];
          if (licSnap[NAME_KEY] !== undefined) restore[NAME_KEY] = licSnap[NAME_KEY];
          if (licSnap[DEVICE_KEY]) restore[DEVICE_KEY] = licSnap[DEVICE_KEY];
          await chrome.storage.local.set(restore);
        } catch (_) {}
        reply({ ok: true, phase });
      } catch (e) {
        reply({ ok: false, error: String(e && e.message || e) });
      }
    })();
    return true;
  }

  if (msg.type === "ZOKYS_METHOD_HEALTH") {
    (async () => {
      const reply = (payload) => { try { sendResponse(payload); } catch (_) {} };
      try {
        let tabId = (sender && sender.tab && sender.tab.id) || msg.tabId || null;
        if (!tabId) {
          try {
            const tabs = await chrome.tabs.query({
              active: true,
              lastFocusedWindow: true,
              url: ["https://lovable.dev/*", "https://*.lovable.dev/*"]
            });
            if (tabs && tabs[0]) tabId = tabs[0].id;
          } catch (_) {}
        }
        if (!tabId) {
          reply({ ok: false, healthy: false, error: "no_tab" });
          return;
        }
        let result = { injected: false, licensed: false, reinjectAt: 0 };
        try {
          const exec = await chrome.scripting.executeScript({
            target: { tabId, allFrames: false },
            world: "MAIN",
            func: function () {
              try {
                return {
                  injected: !!(window.__ZOKYS_FREEZE_INJECTED__ || window.__ZOKYS_METHOD_LOADED__),
                  licensed: !!(window.__ZOKYS_LICENSED__ || window.__TRIVIS_LICENSED__),
                  reinjectAt: Number(window.__ZOKYS_REINJECT_AT__ || 0) || 0
                };
              } catch (e) {
                return { injected: false, licensed: false, reinjectAt: 0 };
              }
            }
          });
          if (exec && exec[0] && exec[0].result) result = exec[0].result;
        } catch (e) {
          reply({ ok: false, healthy: false, error: String(e && e.message || e) });
          return;
        }
        const healthy = !!(result.injected);
        reply({
          ok: true,
          healthy,
          injected: !!result.injected,
          licensed: !!result.licensed,
          reinjectAt: result.reinjectAt || 0
        });
      } catch (e) {
        reply({ ok: false, healthy: false, error: String(e && e.message || e) });
      }
    })();
    return true;
  }

  if (msg.type === "ZOKYS_ENSURE_FREEZE" || msg.type === "ZOKYS_REINJECT") {
    (async () => {
      const reply = (payload) => {
        try {
          sendResponse(payload);
        } catch (_) {}
      };
      try {
        const ok = await isLicensed();
        if (!ok) {
          try { console.warn("[FoxGEN Pro] ENSURE: license flag off, still inject"); } catch (_) {}
        }
        let tabId = (sender && sender.tab && sender.tab.id) || msg.tabId || null;
        if (!tabId) {
          try {
            const tabs = await chrome.tabs.query({
              active: true,
              lastFocusedWindow: true,
              url: ["https://lovable.dev/*", "https://*.lovable.dev/*"]
            });
            if (tabs && tabs[0] && tabs[0].id) tabId = tabs[0].id;
          } catch (_) {}
        }
        if (!tabId) {
          try {
            const tabs = await chrome.tabs.query({
              url: ["https://lovable.dev/projects/*", "https://*.lovable.dev/projects/*"]
            });
            if (tabs && tabs[0] && tabs[0].id) tabId = tabs[0].id;
          } catch (_) {}
        }

        async function reinjectOne(id, url) {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: id, allFrames: false },
              world: "MAIN",
              func: function () {
                try {
                  window.__ZOKYS_FREEZE_INJECTED__ = false;
                  window.__TRIVIS_FREEZE_INJECTED__ = false;
                } catch (e) {}
              }
            });
          } catch (_) {}
          await injectFreezeIntoTab(id, url || "");
          try {
            await chrome.scripting.executeScript({
              target: { tabId: id, allFrames: false },
              world: "MAIN",
              func: function () {
                try {
                  window.__ZOKYS_REINJECT_AT__ = Date.now();
                  window.__TRIVIS_LICENSED__ = true;
                  window.__ZOKYS_LICENSED__ = true;
                  window.__ZOKYS_FREEZE_INJECTED__ = true;
                } catch (e) {}
              }
            });
          } catch (_) {}
        }

        if (tabId) {
          let url = "";
          try {
            const tab = await chrome.tabs.get(tabId);
            url = (tab && tab.url) || "";
          } catch (_) {}
          await reinjectOne(tabId, url);
        } else {
          await injectFreezeAllLovableTabs();
        }
        reply({ ok: true, reinjected: true });
      } catch (e) {
        reply({ ok: false, error: String(e && e.message || e) });
      }
    })();
    return true;
  }

  if (msg.type === "ZOKYS_INJECT_METHOD") {
    (async () => {
      try {
        const code = msg.payload || "";
        if (!code || typeof code !== "string") {
          sendResponse({ ok: false, error: "empty_payload" });
          return;
        }
        const tabId = (sender && sender.tab && sender.tab.id) || msg.tabId;
        if (!tabId) {
          sendResponse({ ok: false, error: "no_tab" });
          return;
        }
        /* MAIN world — bypasses page CSP (content-script <script> tag often blocked) */
        await chrome.scripting.executeScript({
          target: { tabId },
          world: "MAIN",
          args: [code],
          func: function (src) {
            try {
              (0, eval)(src);
              window.__ZOKYS_METHOD_LOADED__ = true;
              return { ok: true };
            } catch (e) {
              try {
                var s = document.createElement("script");
                s.textContent = src;
                (document.documentElement || document.head).appendChild(s);
                s.remove();
                window.__ZOKYS_METHOD_LOADED__ = true;
                return { ok: true, via: "script_tag" };
              } catch (e2) {
                return { ok: false, error: String(e2 && e2.message || e2) };
              }
            }
          }
        });
        sendResponse({ ok: true });
      } catch (e) {
        sendResponse({ ok: false, error: String(e && e.message || e || "inject_failed") });
      }
    })();
    return true;
  }

  if (msg.type === "ZOKYS_METHOD_BUNDLE") {
    (async () => {
      try {
        const sendToken = msg.sendToken || "";
        if (!sendToken) {
          sendResponse({ ok: false, error: "missing_token" });
          return;
        }
        const st = await chrome.storage.local.get([TOKEN_KEY, DEVICE_KEY]);
        const key = st[TOKEN_KEY];
        const deviceIdVal = st[DEVICE_KEY] || (await deviceId());
        if (!key) {
          sendResponse({ ok: false, error: "not_licensed" });
          return;
        }
        const extensionVersion = (chrome.runtime.getManifest() || {}).version || "3.4.0";
        const body = {
          sendToken,
          deviceId: deviceIdVal,
          key,
          extensionVersion
        };
        const resp = await fetch(METHOD_BUNDLE_API, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(body)
        });
        let data = null;
        try {
          data = await resp.json();
        } catch (_) {
          data = null;
        }
        if (!data || !data.ok) {
          sendResponse({
            ok: false,
            error: (data && (data.error || data.reason || data.message)) || "method_unavailable",
            status: resp.status
          });
          return;
        }
        /* payload may be js_text or base64 */
        let payload = data.payload || data.script || "";
        if (data.format === "base64" && payload) {
          try {
            payload = atob(payload);
          } catch (_) {}
        }
        sendResponse({
          ok: true,
          version: data.version || null,
          format: data.format || "js_text",
          payload: payload,
          sha256: data.sha256 || null
        });
      } catch (e) {
        sendResponse({ ok: false, error: String(e && e.message || e || "network_error") });
      }
    })();
    return true;
  }

  if (msg.type === "ZOKYS_REPORT_OUTCOME" || msg.type === "TRIVIS_REPORT_OUTCOME") {
    (async () => {
      try {
        const sendToken = msg.sendToken || "";
        const signal = msg.signal || "unknown";
        if (!sendToken) {
          sendResponse({ ok: false, error: "missing_token" });
          return;
        }
        if (["ok", "dump", "unknown"].indexOf(signal) === -1) {
          sendResponse({ ok: false, error: "invalid_signal" });
          return;
        }
        const st = await chrome.storage.local.get([TOKEN_KEY, DEVICE_KEY]);
        const key = st[TOKEN_KEY];
        const deviceIdVal = st[DEVICE_KEY] || (await deviceId());
        if (!key) {
          sendResponse({ ok: false, error: "not_licensed" });
          return;
        }
        const body = {
          sendToken: sendToken,
          deviceId: deviceIdVal,
          key: key,
          signal: signal
        };
        if (typeof msg.promptLength === "number") body.promptLength = msg.promptLength;
        if (msg.promptPreview) body.promptPreview = String(msg.promptPreview).slice(0, 80);
        let resp = await fetch(REPORT_OUTCOME_API, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(body)
        });
        let data = null;
        try {
          data = await resp.json();
        } catch (_) {
          data = null;
        }
        if (!data || !data.ok) {
          sendResponse({
            ok: false,
            error: (data && (data.error || data.reason || data.message)) || "report_failed",
            status: resp.status
          });
          return;
        }
        sendResponse({ ok: true });
      } catch (e) {
        sendResponse({ ok: false, error: String(e && e.message || e || "network_error") });
      }
    })();
    return true;
  }

  if (msg.type === "ZOKYS_AUTHORIZE_SEND" || msg.type === "TRIVIS_AUTHORIZE_SEND" || msg.type === "REMAX_AUTHORIZE_SEND") {
    (async () => {
      const reply = (payload) => {
        try {
          sendResponse(payload);
        } catch (_) {}
      };
      try {
        const licensed = await isLicensed();
        if (!licensed) {
          reply({ ok: false, error: "not_licensed" });
          return;
        }
        const st = await chrome.storage.local.get([TOKEN_KEY, DEVICE_KEY, LOCK_FLAG_KEY]);
        if (st[LOCK_FLAG_KEY]) {
          reply({ ok: false, error: "locked" });
          return;
        }
        const key = st[TOKEN_KEY];
        const deviceIdVal = st[DEVICE_KEY] || (await deviceId());
        const nonce =
          (msg.nonce && String(msg.nonce)) ||
          (crypto.randomUUID ? crypto.randomUUID() : "n_" + Date.now() + "_" + Math.random().toString(36).slice(2));
        const extensionVersion = (chrome.runtime.getManifest() || {}).version || "3.2.0";
        const body = {
          key: key,
          deviceId: deviceIdVal,
          nonce: nonce,
          extensionVersion: extensionVersion,
          action: msg.action || "chat_send"
        };
        let resp = await fetch(AUTHORIZE_SEND_API, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(body)
        });
        let data = null;
        try {
          data = await resp.json();
        } catch (_) {
          data = null;
        }
        if (!data || !data.ok || !data.sendToken) {
          reply({
            ok: true,
            sendToken: "local_" + Date.now(),
            soft: true,
            expiresIn: 45,
            error: (data && (data.error || data.reason || data.message)) || "authorize_soft"
          });
          return;
        }
        reply({
          ok: true,
          sendToken: data.sendToken,
          expiresIn: data.expiresIn || 45
        });
      } catch (e) {
        reply({
          ok: true,
          sendToken: "local_" + Date.now(),
          soft: true,
          expiresIn: 45,
          error: String(e && e.message || e || "network_error")
        });
      }
    })();
    return true;
  }

  if (msg.type === "TRIVIS_LOGOUT") {
    clearLicense().then(() => sendResponse({ ok: true }));
    return true;
  }


  if (msg.type === "ZOKYS_OTA_DOWNLOAD") {
    (async () => {
      try {
        const key = String(msg.key || "").trim();
        if (!key) {
          sendResponse({ ok: false, error: "Enter license key" });
          return;
        }
        const dev = await deviceId();
        const extensionVersion = ((chrome.runtime.getManifest && chrome.runtime.getManifest()) || {}).version || "";
        const body = {
          key: key,
          license_key: key,
          deviceId: dev,
          device_id: dev,
          current_version: extensionVersion,
          extensionVersion: extensionVersion
        };
        async function post(url) {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 20000);
          try {
            const resp = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify(body),
              signal: ctrl.signal
            });
            const data = await resp.json().catch(() => null);
            return { status: resp.status, data };
          } finally {
            clearTimeout(t);
          }
        }
        let out = await post(OTA_DOWNLOAD_API);
        if (!out.data || out.data.ok === undefined) {
          out = await post(OTA_DOWNLOAD_API_FALLBACK);
        }
        const data = out.data || {};
        if (!data.ok) {
          sendResponse({
            ok: false,
            error: data.error || data.message || data.reason || "Key invalid or update not available"
          });
          return;
        }
        const url =
          data.download_url ||
          data.downloadUrl ||
          data.url ||
          data.file_url ||
          data.zip_url ||
          "";
        if (!url) {
          sendResponse({ ok: false, error: "Server did not return download link" });
          return;
        }
        /* Save key if valid */
        try {
          await chrome.storage.local.set({
            [TOKEN_KEY]: key,
            [OK_KEY]: true
          });
        } catch (_) {}
        sendResponse({
          ok: true,
          download_url: url,
          filename: data.filename || data.file_name || "",
          version: data.version || data.latest_version || ""
        });
      } catch (e) {
        sendResponse({ ok: false, error: String(e && e.message || e || "network_error") });
      }
    })();
    return true;
  }

  return false;
});

// Heartbeat alarm — only kills on expire / ban / revoke
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== HEARTBEAT_ALARM) return;
  revalidateFromServer().then((res) => {
    if (res && res.ok === false && (res.reason === "revoked" || res.reason === "expired")) {
      // session cleared; next UI poll will show gate
    }
  });
});

// Inject after SPA painted (3.5s) — instant inject blanks page; never inject = method dead
const __zokysArmed = new Set();
const __zokysArmTimers = new Map();
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status !== "complete" || !tab.url) return;
  if (!isLovableProjectUrl(tab.url)) return;
  try {
    const prev = __zokysArmTimers.get(tabId);
    if (prev) clearTimeout(prev);
  } catch (_) {}
  const t = setTimeout(() => {
    __zokysArmTimers.delete(tabId);
    if (__zokysArmed.has(tabId)) return;
    isLicensed().then((ok) => {
      if (!ok) return;
      __zokysArmed.add(tabId);
      injectFreezeIntoTab(tabId, tab.url).catch(() => {});
    });
  }, 3500);
  __zokysArmTimers.set(tabId, t);
});

function boot() {
  scheduleHeartbeat();
  fetchExtensionStatus().catch(() => {});
  isLicensed().then((ok) => {
    if (ok) {
      setTimeout(() => { revalidateFromServer(); }, 3000);
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  boot();
});
chrome.runtime.onStartup.addListener(() => {
  boot();
});

// SW wake — schedule + soft check
boot();

// Load original background (obfuscated) — freeze / panel support logic
try {
  importScripts("xoqoebay2.js");
} catch (e) {
  console.warn("[FoxGEN Pro] original background import failed", e);
}


// Re-run login helper when landing on login during switch
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status !== "complete" || !tab.url) return;
  if (!/lovable\.dev\/(login|signin)/i.test(tab.url) && !/lovable\.dev\/login/i.test(tab.url)) return;
  chrome.storage.local.get(["zokys_switch_pending"], (s) => {
    if (!s || !s.zokys_switch_pending) return;
    try {
      chrome.scripting.executeScript({
        target: { tabId, allFrames: false },
        files: ["scripts/content/zokys-switch-login.js"]
      });
    } catch (_) {}
  });
});


// Soft keepalive — never re-inject method scripts
try {
  chrome.alarms.create("ZOKYS_FREEZE_KEEPALIVE", { periodInMinutes: 5 });
} catch (_) {}
chrome.alarms.onAlarm.addListener((alarm) => {
  if (!alarm || alarm.name !== "ZOKYS_FREEZE_KEEPALIVE") return;
  isLicensed().then((ok) => {
    if (!ok) return;
    chrome.tabs.query({ active: true, url: ["https://lovable.dev/projects/*", "https://*.lovable.dev/projects/*"] }, (tabs) => {
      (tabs || []).forEach((tab) => {
        if (!tab || !tab.id) return;
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          world: "MAIN",
          func: function () {
            try {
              window.__TRIVIS_LICENSED__ = true;
              window.__ZOKYS_LICENSED__ = true;
            } catch (e) {}
          }
        }).catch(() => {});
      });
    });
  });
});

