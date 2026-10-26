/**
 * FoxGEN Pro chat send — attach txt, wait until ready, single auto-send click.
 * No full-screen animation.
 */
(function () {
  "use strict";
  if (window.__zokysChatSendV31__) return;
  window.__zokysChatSendV31__ = true;
  if (!/lovable\.dev/i.test(location.hostname || "")) return;

  var SHORT = "prompt.intxt";
  var sendingLock = false;

  function scrubDuplicateUserBubbles() { return; /* disabled in 6.20: caused screen shaking */
    try {
      var nodes = document.querySelectorAll(
        '[data-message],[class*="message"],[class*="Message"],article,[role="log"] > div, [class*="chat"] [class*="group"], [class*="bubble"]'
      );
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (!el || (el.closest && (el.closest("#zokys-vx-root") || el.closest("#trivis-vx-root")))) continue;
        var t = (el.innerText || el.textContent || "").trim();
        if (!t) continue;
        /* NEVER hide UsagiAutoX or real file chips */
        if (/UsagiAutoX/i.test(t)) continue;
        if (el.querySelector && el.querySelector('[class*="file"],[class*="attach"],[class*="chip"]')) continue;
        /* Hide only pure text dummies */
        var isDummy =
          /Send by FoxGEN Pro|Send by REMAX|completetxt\.task|readtxt&complete|Read txt file and complete task/i.test(t) ||
          /\[BUILD MODE|\[PLAN MODE/i.test(t) ||
          /^prompt\.intxt$/i.test(t);
        if (isDummy && t.length < 220) {
          try {
            el.style.setProperty("display", "none", "important");
            el.setAttribute("data-zokys-dup-hide", "1");
          } catch (_) {}
        }
      }
    } catch (_) {}
  }

  function startDedupeWatch(ms) {
    var end = Date.now() + (ms || 8000);
    var iv = setInterval(function () {
      scrubDuplicateUserBubbles();
      if (Date.now() > end) clearInterval(iv);
    }, 400);
    setTimeout(scrubDuplicateUserBubbles, 800);
    setTimeout(scrubDuplicateUserBubbles, 2000);
    setTimeout(scrubDuplicateUserBubbles, 4000);
  }


  var extraFiles = [];

  function findComposer() {
    var sels = [
      'textarea[placeholder*="Ask" i]',
      'textarea[placeholder*="Build" i]',
      'textarea[placeholder*="Message" i]',
      'textarea[placeholder*="Lovable" i]',
      "form textarea",
      '[contenteditable="true"]'
    ];
    for (var i = 0; i < sels.length; i++) {
      var nodes = document.querySelectorAll(sels[i]);
      for (var j = 0; j < nodes.length; j++) {
        var n = nodes[j];
        if (n.closest && n.closest("#zokys-vx-root")) continue;
        var r = n.getBoundingClientRect();
        if (r.width > 80 && r.height > 16) return n;
      }
    }
    return null;
  }

  function setComposerText(el, text) {
    if (!el) return;
    try { el.focus(); } catch (_) {}
    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
      try {
        var desc =
          Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value") ||
          Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
        if (desc && desc.set) desc.set.call(el, text);
        else el.value = text;
      } catch (_) {
        el.value = text;
      }
      try {
        if (el._valueTracker) el._valueTracker.setValue("");
      } catch (_) {}
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      try {
        document.execCommand("selectAll", false, null);
        document.execCommand("insertText", false, text);
      } catch (_) {
        el.textContent = text;
        el.dispatchEvent(new InputEvent("input", { bubbles: true, data: text, inputType: "insertText" }));
      }
    }
  }

  function findFileInput() {
    var inputs = document.querySelectorAll('input[type="file"]');
    var best = null;
    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      if (el.closest && (el.closest("#zokys-vx-root") || el.closest("#trivis-vx-root") || el.id === "vx-chat-file")) continue;
      if (el.id && /vx-chat|zokys|trivis/i.test(el.id)) continue;
      /* Prefer visible / composer-adjacent inputs */
      var r = el.getBoundingClientRect();
      if (r.width > 0 || r.height > 0 || el.offsetParent !== null) {
        return el;
      }
      if (!best) best = el;
    }
    return best;
  }

  function isSendEnabled(btn) {
    if (!btn) return false;
    if (btn.disabled) return false;
    if (btn.getAttribute("aria-disabled") === "true") return false;
    var r = btn.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function findSendButton(composer) {
    var root = (composer && composer.closest("form")) || (composer && composer.parentElement) || document;
    var btns = root.querySelectorAll("button");
    var i, b, t, al;
    for (i = 0; i < btns.length; i++) {
      b = btns[i];
      if (b.closest && b.closest("#zokys-vx-root")) continue;
      al = (b.getAttribute("aria-label") || "").toLowerCase();
      t = (b.textContent || "").trim().toLowerCase();
      if (al.indexOf("send") !== -1 || t === "send") return b;
    }
    // circular send near composer (arrow up)
    btns = document.querySelectorAll("button");
    for (i = 0; i < btns.length; i++) {
      b = btns[i];
      if (b.closest && b.closest("#zokys-vx-root")) continue;
      al = (b.getAttribute("aria-label") || "").toLowerCase();
      if (al.indexOf("send") !== -1) return b;
      var r = b.getBoundingClientRect();
      if (!composer) continue;
      var cr = composer.getBoundingClientRect();
      if (r.width >= 28 && r.width <= 48 && r.height >= 28 && r.height <= 48) {
        if (Math.abs(r.bottom - cr.bottom) < 80 && r.left > cr.left) return b;
      }
    }
    return null;
  }

  function attachFiles(files) {
    try {
      if (!files || !files.length) return false;
      var dt = new DataTransfer();
      for (var i = 0; i < files.length; i++) {
        try { dt.items.add(files[i]); } catch (_) {}
      }
      var ok = false;
      var inputs = document.querySelectorAll('input[type="file"]');
      for (var j = 0; j < inputs.length; j++) {
        var input = inputs[j];
        if (input.closest && (input.closest("#zokys-vx-root") || input.closest("#trivis-vx-root"))) continue;
        if (input.id === "vx-chat-file") continue;
        try {
          input.files = dt.files;
          input.dispatchEvent(new Event("change", { bubbles: true }));
          input.dispatchEvent(new Event("input", { bubbles: true }));
          try {
            input.dispatchEvent(new Event("blur", { bubbles: true }));
          } catch (_) {}
          ok = true;
          break;
        } catch (_) {}
      }
      var composer = findComposer();
      var target = (composer && (composer.closest("form") || composer.parentElement)) || document.body;
      ["dragenter", "dragover", "drop"].forEach(function (type) {
        try {
          var ev = new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: dt });
          target.dispatchEvent(ev);
          if (composer) composer.dispatchEvent(ev);
        } catch (_) {}
      });
      return ok || true;
    } catch (e) {
      return false;
    }
  }

  function fileChipVisible() {
    var nodes = document.querySelectorAll("button, div, span, a");
    for (var i = 0; i < Math.min(nodes.length, 300); i++) {
      var el = nodes[i];
      if (el.closest && el.closest("#zokys-vx-root")) continue;
      var t = (el.textContent || "").trim();
      if (/zokys-task\.txt|promptin-.*\.txt|REMAX94.*\.txt/i.test(t) || (/\.txt/i.test(t) && t.length < 48)) {
        var r = el.getBoundingClientRect();
        if (r.width > 0 && r.bottom > window.innerHeight * 0.4) return true;
      }
    }
    return false;
  }

  function sleep(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }

  async function waitForSendReady(composer, timeoutMs) {
    var start = Date.now();
    var clicked = false;
    while (Date.now() - start < timeoutMs) {
      var btn = findSendButton(composer);
      if (btn && isSendEnabled(btn)) {
        // prefer waiting a beat after file chip if possible
        if (fileChipVisible() || Date.now() - start > 900) {
          if (!clicked) {
            try {
              btn.click();
              clicked = true;
              await sleep(400);
              try {
                setComposerText(composer, "");
              } catch (_) {}
              return true;
            } catch (_) {}
          }
        }
      }
      await sleep(200);
    }
    // last attempt once
    if (!clicked) {
      var b2 = findSendButton(composer);
      if (b2) {
        try {
          b2.click();
          return true;
        } catch (_) {}
      }
    }
    return clicked;
  }

  window.__zokysAttachExtraFiles = function (fileList) {
    if (!fileList || !fileList.length) return;
    for (var i = 0; i < fileList.length; i++) {
      try {
        var f = fileList[i];
        if (f) extraFiles.push(f);
      } catch (_) {}
    }
    try {
      window.__zokysExtraFileCount = extraFiles.length;
    } catch (_) {}
  };
  window.__zokysClearExtraFiles = function () {
    extraFiles = [];
    try { window.__zokysExtraFileCount = 0; } catch (_) {}
  };
  window.__zokysGetExtraFileNames = function () {
    return extraFiles.map(function (f) { return f && f.name ? f.name : "file"; });
  };

  window.__zokysClickStop = function () {
    var clicked = false;
    function tryClick(b) {
      if (!b || (b.closest && b.closest("#zokys-vx-root"))) return;
      try {
        b.click();
        clicked = true;
      } catch (_) {}
      try {
        b.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
        clicked = true;
      } catch (_) {}
    }
    var btns = document.querySelectorAll("button,[role='button'],[aria-label]");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      var al = ((b.getAttribute("aria-label") || "") + " " + (b.getAttribute("title") || "") + " " + (b.textContent || "")).toLowerCase().trim();
      if (/stop generating|stop|cancel|abort|halt/i.test(al) && al.length < 48) tryClick(b);
    }
    try {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", code: "Escape", keyCode: 27, bubbles: true }));
    } catch (_) {}
    return clicked;
  };

  /* Keep hammering stop for a few seconds when user requests stop */
  window.__zokysForceStopBurst = function () {
    var n = 0;
    var iv = setInterval(function () {
      window.__zokysClickStop();
      n++;
      if (n >= 8) clearInterval(iv);
    }, 280);
  };

  window.__zokysSetLovableMode = function (mode) {
    var want = mode === "plan" ? /^plan$/i : /^build$/i;
    var nodes = document.querySelectorAll("button, [role='menuitem'], [role='option']");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.closest && el.closest("#zokys-vx-root")) continue;
      var t = (el.textContent || "").trim();
      if (want.test(t)) {
        try {
          el.click();
          return true;
        } catch (_) {}
      }
    }
    return false;
  };


  function fetchMethodBundle(sendToken) {
    return new Promise(function (resolve) {
      try {
        chrome.runtime.sendMessage({ type: "FOXGEN_METHOD_BUNDLE", sendToken: sendToken }, function (res) {
          if (chrome.runtime.lastError) {
            resolve({ ok: false, error: chrome.runtime.lastError.message });
            return;
          }
          resolve(res || { ok: false, error: "no_response" });
        });
      } catch (e) {
        resolve({ ok: false, error: String(e && e.message || e) });
      }
    });
  }

  function injectMethodPayload(code) {
    if (!code || typeof code !== "string") return Promise.resolve(false);
    return new Promise(function (resolve) {
      try {
        chrome.runtime.sendMessage({ type: "FOXGEN_INJECT_METHOD", payload: code }, function (res) {
          if (chrome.runtime.lastError) {
            resolve(false);
            return;
          }
          resolve(!!(res && res.ok));
        });
      } catch (e) {
        resolve(false);
      }
    });
  }

  function authorizeSendOrThrow() {
    return new Promise(function (resolve) {
      try {
        chrome.runtime.sendMessage({ type: "FOXGEN_AUTHORIZE_SEND", action: "chat_send" }, function (res) {
          if (chrome.runtime.lastError) {
            resolve({ ok: true, sendToken: null, soft: true, error: chrome.runtime.lastError.message });
            return;
          }
          if (!res || !res.ok) {
            resolve({ ok: true, sendToken: null, soft: true, error: (res && res.error) || "authorize_soft" });
            return;
          }
          resolve(res);
        });
      } catch (e) {
        resolve({ ok: true, sendToken: null, soft: true });
      }
    });
  }

  function reportOutcome(sendToken, signal, promptLength) {
    if (!sendToken) return;
    try {
      chrome.runtime.sendMessage(
        {
          type: "FOXGEN_REPORT_OUTCOME",
          sendToken: sendToken,
          signal: signal || "unknown",
          promptLength: typeof promptLength === "number" ? promptLength : undefined
        },
        function () {}
      );
    } catch (_) {}
  }

  function watchOutcome(sendToken, promptLength) {
    if (!sendToken) return;
    var done = false;
    var BAD = /for the code present|here is the (full )?code below|please think step-by-step in order to resolve/i;
    var started = Date.now();
    var iv = setInterval(function () {
      if (done) return;
      if (Date.now() - started > 120000) {
        done = true;
        clearInterval(iv);
        reportOutcome(sendToken, "unknown", promptLength);
        return;
      }
      try {
        var nodes = document.querySelectorAll(
          '[data-message],[class*="message"],[class*="Message"],article,[role="log"] > div'
        );
        for (var i = Math.max(0, nodes.length - 8); i < nodes.length; i++) {
          var t = (nodes[i].innerText || nodes[i].textContent || "").trim();
          if (!t || t.length < 40) continue;
          if (BAD.test(t) || t.length > 3500) {
            done = true;
            clearInterval(iv);
            reportOutcome(sendToken, "dump", promptLength);
            return;
          }
        }
        /* heuristic ok: assistant replied with modest length and no bad pattern after 8s */
        if (Date.now() - started > 8000) {
          var last = "";
          for (var j = nodes.length - 1; j >= Math.max(0, nodes.length - 6); j--) {
            last = (nodes[j].innerText || nodes[j].textContent || "").trim();
            if (last.length > 60) break;
          }
          if (last && !BAD.test(last) && last.length < 3500) {
            /* look for thinking finished markers */
            if (/task|done|fixed|updated|implemented|complete/i.test(last) || Date.now() - started > 25000) {
              done = true;
              clearInterval(iv);
              reportOutcome(sendToken, "ok", promptLength);
            }
          }
        }
      } catch (_) {}
    }, 1200);
    /* hard cap report unknown at 90s if still open */
    setTimeout(function () {
      if (done) return;
      done = true;
      clearInterval(iv);
      reportOutcome(sendToken, "unknown", promptLength);
    }, 90000);
  }


  function methodHealthCheck() {
    return new Promise(function (resolve) {
      try {
        chrome.runtime.sendMessage({ type: "FOXGEN_METHOD_HEALTH" }, function (res) {
          if (chrome.runtime.lastError) {
            resolve({ ok: false, healthy: false });
            return;
          }
          resolve(res || { ok: false, healthy: false });
        });
      } catch (e) {
        resolve({ ok: false, healthy: false });
      }
    });
  }

  function ensureFreezeOnce() {
    return new Promise(function (resolve) {
      try {
        chrome.runtime.sendMessage({ type: "FOXGEN_ENSURE_FREEZE" }, function () {
          setTimeout(function () {
            chrome.runtime.sendMessage({ type: "FOXGEN_REINJECT" }, function () {
              setTimeout(resolve, 1800);
            });
          }, 300);
        });
      } catch (e) {
        resolve();
      }
    });
  }

  function reinjectMethod() {
    return new Promise(function (resolve) {
      try {
        chrome.runtime.sendMessage({ type: "FOXGEN_REINJECT" }, function (res) {
          resolve(res || { ok: false });
        });
      } catch (e) {
        resolve({ ok: false });
      }
    });
  }

  function getAntiProtectOn() {
    return new Promise(function (resolve) {
      try {
        chrome.storage.local.get(["zokys_antiprotect_on"], function (s) {
          /* default OFF — authorize server optional; method must still send */
          if (!s || s.zokys_antiprotect_on === undefined || s.zokys_antiprotect_on === null) {
            resolve(false);
            return;
          }
          resolve(!!s.zokys_antiprotect_on);
        });
      } catch (e) {
        resolve(false);
      }
    });
  }

  async function antiProtectPipeline(updateAnim) {
    var steps = [];
    try {
      if (updateAnim) updateAnim("ANTIPROTECT", "Server verify · one-time token");
    } catch (_) {}
    var auth = await authorizeSendOrThrow();
    steps.push("authorize_ok");

    try {
      if (updateAnim) updateAnim("ANTIPROTECT", "Method health check");
    } catch (_) {}
    var health = await methodHealthCheck();
    if (!health || !health.healthy) {
      steps.push("health_fail");
      try {
        if (updateAnim) updateAnim("ANTIPROTECT", "Method missing · re-injecting");
      } catch (_) {}
      await reinjectMethod();
      await new Promise(function (r) { setTimeout(r, 700); });
      health = await methodHealthCheck();
      if (!health || !health.healthy) {
        await ensureFreezeOnce();
        await new Promise(function (r) { setTimeout(r, 400); });
        health = await methodHealthCheck();
      }
      steps.push(health && health.healthy ? "reinject_ok" : "reinject_soft");
    } else {
      steps.push("health_ok");
      await ensureFreezeOnce();
    }

    try {
      chrome.storage.local.set({
        zokys_ap_last_check: Date.now(),
        zokys_ap_last_ok: !!(health && health.healthy),
        zokys_ap_last_steps: steps.join(",")
      });
    } catch (_) {}

    return { auth: auth, health: health, steps: steps };
  }

  window.__zokysChatSendTxt = async function (userText, opts) {
    opts = opts || {};
    if (!userText || !String(userText).trim()) return false;
    if (!/\/projects\//i.test(location.pathname || "")) return false;
    if (sendingLock) return false;
    sendingLock = true;
    var releaseLock = function () {
      setTimeout(function () { sendingLock = false; }, 2500);
    };

    var lockState = await new Promise(function (res) {
      try {
        chrome.storage.local.get(["zokys_ota_force", "zokys_extension_locked", "zokys_admin_lock"], function (s) {
          res({
            ota: !!(s && s.zokys_ota_force === true),
            locked: !!(s && (s.zokys_extension_locked === true || s.zokys_admin_lock === true))
          });
        });
      } catch (e) { res({ ota: false, locked: false }); }
    });
    if (lockState.ota) {
      try { alert("Update required — enter license key on the update screen to download the new extension."); } catch (_) {}
      releaseLock();
      return false;
    }
    if (lockState.locked) {
      try { alert("Extension locked by admin. Wait until the lock switch is turned OFF."); } catch (_) {}
      releaseLock();
      return false;
    }

    /* Cooldown first — no token burn, no anim if blocked */
    var blocked = await new Promise(function (res) {
      if (typeof window.__zokysChatLimitBlocked === "function") {
        window.__zokysChatLimitBlocked(function (b) { res(!!b); });
      } else res(false);
    });
    if (blocked) { releaseLock(); return false; }

    var apOn = await getAntiProtectOn();
    try {
      if (typeof window.__zokysSendAnimShow === "function") {
        window.__zokysSendAnimShow(
          apOn ? "ANTIPROTECT PIPELINE" : "Sending prompt…",
          apOn ? "Verify · health · arm systems" : "Direct send · AntiProtect off"
        );
      }
    } catch (_) {}

    var auth = null;
    var sendToken = null;

    if (apOn) {
      /* Full AntiProtect: authorize → health → reinject if needed → send */
      try {
        var pipe = await antiProtectPipeline(function (title, sub) {
          try {
            if (typeof window.__zokysSendAnimShow === "function") {
              window.__zokysSendAnimShow(title, sub);
            }
          } catch (_) {}
        });
        auth = pipe && pipe.auth;
      } catch (err) {
        try {
          if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide();
        } catch (_) {}
        try {
          console.warn("[FoxGEN Pro] AntiProtect soft:", err && err.message);
        } catch (_) {}
        auth = { ok: true, sendToken: null, soft: true };
      }
      sendToken = auth && auth.sendToken;
      try { await ensureFreezeOnce(); } catch (_) {}
    } else {
      try {
        auth = await authorizeSendOrThrow();
      } catch (err) {
        auth = { ok: true, sendToken: null, soft: true };
      }
      sendToken = auth && auth.sendToken;
      try {
        await ensureFreezeOnce();
      } catch (_) {}
    }

    try {
      if (sendToken) sessionStorage.setItem("zokys_last_send_token", sendToken);
    } catch (_) {}
    await sleep(600);

    /* Server method bundle (optional — TXT path continues if missing) */
    if (sendToken) {
      try {
        if (typeof window.__zokysSendAnimShow === "function") {
          window.__zokysSendAnimShow("Loading method…", "Secure uplink · loading payload");
        }
      } catch (_) {}
      try {
        var bundle = await fetchMethodBundle(sendToken);
        if (bundle && bundle.ok && bundle.payload) {
          await injectMethodPayload(bundle.payload);
          await sleep(400);
        }
      } catch (_) {}
    }

    var mode = opts.mode || "build";
    var body = String(userText);
    if (mode === "plan") {
      body = "[PLAN MODE — discuss and plan only, do not implement code yet]\n\n" + body;
    } else {
      body = "[BUILD MODE — implement changes in the project]\n\n" + body;
    }

    var fname = "promptin-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7) + ".txt";
    var taskFile = new File([body], fname, { type: "text/plain" });
    var files = [taskFile].concat(extraFiles || []);
    extraFiles = [];

    attachFiles(files);
    /* Single attach only — double attach caused duplicate file chips in chat */
    await sleep(files.length > 1 ? 1100 : 650);

    var composer = findComposer();
    if (!composer) {
      try { if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide(); } catch (_) {}
      releaseLock();
      return false;
    }

    try {
      localStorage.setItem("zokys_pending_trigger", "1");
      localStorage.setItem("zokys_last_task", body);
      window.postMessage({ type: "TRIVIS_STASH_TASK", task: body }, "*");
    } catch (_) {}
    setComposerText(composer, SHORT);
    await sleep(400);

    if (opts.autoSend === false) {
      releaseLock();
      return true;
    }

    // Wait until Lovable send is actually available, then one click
    var ok = false;
    try {
      ok = await waitForSendReady(composer, 12000);
      /* clear composer so a second bubble is not queued */
      try {
        setComposerText(composer, "");
      } catch (_) {}
      if (ok && typeof window.__zokysChatLimitRecordSend === "function") {
        window.__zokysChatLimitRecordSend(function () {});
      }
      if (ok) {
        try {
          startDedupeWatch(10000);
        } catch (_) {}
      }
      if (ok && sendToken) {
        try {
          watchOutcome(sendToken, body.length);
        } catch (_) {}
      }
    } finally {
      try {
        if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide();
      } catch (_) {}
      releaseLock();
    }
    return !!ok;
  };
})();
