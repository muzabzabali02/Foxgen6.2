/**
 * FoxGEN Pro OTA Force Update Lock
 * When admin publishes update → extension locks + key + download UI
 */
(function () {
  "use strict";
  if (window.__zokysOtaLock1__) return;
  window.__zokysOtaLock1__ = true;
  if (!/lovable\.dev/i.test(location.hostname || "")) return;

  var ROOT_ID = "zokys-ota-lock";

  function removeUi() {
    var el = document.getElementById(ROOT_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function showUi(info) {
    info = info || {};
    removeUi();
    var ver = info.latest_version || info.version || "";
    var msg = info.update_message || info.message || "A new extension version is available. Enter your license key to download.";
    var cur = info.current_version || "";

    var root = document.createElement("div");
    root.id = ROOT_ID;
    root.innerHTML =
      '<style>' +
      '#' + ROOT_ID + '{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;' +
      'padding:20px;font-family:Inter,-apple-system,BlinkMacSystemFont,system-ui,sans-serif;background:rgba(5,5,8,.92);' +
      'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}' +
      '#' + ROOT_ID + ' .card{position:relative;width:min(400px,94vw);padding:28px 24px 22px;border-radius:24px;' +
      'background:linear-gradient(165deg,rgba(24,16,40,.98),rgba(10,8,18,.98));' +
      'border:1px solid rgba(249,115,22,.35);box-shadow:0 0 0 1px rgba(255,255,255,.04),0 24px 64px rgba(0,0,0,.55),0 0 48px rgba(249,115,22,.18);' +
      'overflow:hidden;}' +
      '#' + ROOT_ID + ' .card:before{content:"";position:absolute;top:-40%;left:-20%;width:70%;height:80%;' +
      'background:radial-gradient(circle,rgba(249,115,22,.22),transparent 70%);pointer-events:none;}' +
      '#' + ROOT_ID + ' .badge{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;' +
      'font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;' +
      'color:#f5e9ff;background:rgba(249,115,22,.2);border:1px solid rgba(251,146,60,.35);margin-bottom:14px;}' +
      '#' + ROOT_ID + ' h2{margin:0 0 8px;font-size:22px;font-weight:900;letter-spacing:.06em;color:#faf5ff;}' +
      '#' + ROOT_ID + ' .sub{margin:0 0 18px;font-size:13px;line-height:1.5;color:rgba(226,212,255,.7);}' +
      '#' + ROOT_ID + ' .meta{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;}' +
      '#' + ROOT_ID + ' .pill{font-size:11px;font-weight:700;padding:6px 10px;border-radius:10px;' +
      'background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:rgba(233,213,255,.85);}' +
      '#' + ROOT_ID + ' .field{margin-bottom:12px;}' +
      '#' + ROOT_ID + ' input{width:100%;height:50px;box-sizing:border-box;padding:0 16px;border-radius:14px;' +
      'border:1px solid rgba(249,115,22,.3);background:rgba(0,0,0,.35);color:#fff;font-size:14px;font-weight:600;' +
      'letter-spacing:.04em;outline:none;}' +
      '#' + ROOT_ID + ' input:focus{border-color:rgba(251,146,60,.7);box-shadow:0 0 0 3px rgba(249,115,22,.15);}' +
      '#' + ROOT_ID + ' .btn{width:100%;height:52px;border:none;border-radius:14px;cursor:pointer;font-size:13px;font-weight:800;' +
      'letter-spacing:.12em;text-transform:uppercase;color:#fff;' +
      'background:linear-gradient(135deg,#ea580c,#f97316 45%,#fb923c);' +
      'box-shadow:0 10px 28px rgba(234,88,12,.4);transition:transform .15s,opacity .15s;}' +
      '#' + ROOT_ID + ' .btn:active{transform:scale(.98);}' +
      '#' + ROOT_ID + ' .btn:disabled{opacity:.55;cursor:wait;}' +
      '#' + ROOT_ID + ' .msg{min-height:20px;margin-top:12px;text-align:center;font-size:12px;font-weight:700;color:rgba(196,181,253,.55);}' +
      '#' + ROOT_ID + ' .msg.err{color:#fb7185;}' +
      '#' + ROOT_ID + ' .msg.ok{color:#4ade80;}' +
      '#' + ROOT_ID + ' .foot{margin-top:16px;text-align:center;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:rgba(249,115,22,.45);}' +
      '</style>' +
      '<div class="card">' +
      '<div class="badge">🔒 UPDATE REQUIRED</div>' +
      '<h2>New Version Live</h2>' +
      '<p class="sub"></p>' +
      '<div class="meta"></div>' +
      '<div class="field"><input id="zokys-ota-key" type="text" placeholder="FOXGEN-XXX-XXX" autocomplete="off" spellcheck="false"/></div>' +
      '<button type="button" class="btn" id="zokys-ota-dl"><span class="lbl">Verify & Download</span></button>' +
      '<div class="msg" id="zokys-ota-msg"></div>' +
      '<div class="foot">FoxGEN Pro · Secure OTA</div>' +
      '</div>';

    root.querySelector(".sub").textContent = msg;
    var meta = root.querySelector(".meta");
    if (ver) {
      var p = document.createElement("span");
      p.className = "pill";
      p.textContent = "Latest · v" + ver;
      meta.appendChild(p);
    }
    if (cur) {
      var p2 = document.createElement("span");
      p2.className = "pill";
      p2.textContent = "Yours · v" + cur;
      meta.appendChild(p2);
    }

    document.documentElement.appendChild(root);

    // Prefill saved key
    try {
      chrome.storage.local.get(["trivis_license_key"], function (s) {
        var inp = document.getElementById("zokys-ota-key");
        if (inp && s && s.trivis_license_key) inp.value = s.trivis_license_key;
      });
    } catch (_) {}

    var btn = document.getElementById("zokys-ota-dl");
    var msgEl = document.getElementById("zokys-ota-msg");
    var inp = document.getElementById("zokys-ota-key");

    function setMsg(t, cls) {
      msgEl.className = "msg" + (cls ? " " + cls : "");
      msgEl.textContent = t || "";
    }

    btn.addEventListener("click", function () {
      var key = (inp.value || "").trim();
      if (!key) {
        setMsg("Enter your license key", "err");
        return;
      }
      btn.disabled = true;
      btn.querySelector(".lbl").textContent = "Verifying…";
      setMsg("Checking license on server…");
      try {
        chrome.runtime.sendMessage({ type: "FOXGEN_OTA_DOWNLOAD", key: key }, function (res) {
          btn.disabled = false;
          btn.querySelector(".lbl").textContent = "Verify & Download";
          if (chrome.runtime.lastError) {
            setMsg(chrome.runtime.lastError.message || "Extension error", "err");
            return;
          }
          if (!res || !res.ok || !res.download_url) {
            setMsg((res && (res.error || res.message)) || "Key invalid or download unavailable", "err");
            return;
          }
          setMsg("Verified · starting download…", "ok");
          try {
            // Trigger download
            var a = document.createElement("a");
            a.href = res.download_url;
            a.download = res.filename || ("FOXGEN_v" + (ver || "latest") + ".zip");
            a.target = "_blank";
            a.rel = "noopener";
            document.documentElement.appendChild(a);
            a.click();
            a.remove();
          } catch (e) {
            try { window.open(res.download_url, "_blank"); } catch (_) {}
          }
          setMsg("Download started. Remove old extension → Load unpacked new zip.", "ok");
        });
      } catch (e) {
        btn.disabled = false;
        btn.querySelector(".lbl").textContent = "Verify & Download";
        setMsg("Extension error", "err");
      }
    });

    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") btn.click();
    });
  }

  function refresh() {
    try {
      chrome.storage.local.get(
        ["zokys_ota_force", "zokys_ota_version", "zokys_ota_message", "zokys_ota_current", "zokys_extension_locked"],
        function (s) {
          if (s && s.zokys_ota_force === true) {
            showUi({
              latest_version: s.zokys_ota_version || "",
              update_message: s.zokys_ota_message || "",
              current_version: s.zokys_ota_current || "",
              message: s.zokys_ota_message || ""
            });
          } else {
            removeUi();
          }
        }
      );
    } catch (_) {}
  }

  refresh();
  setTimeout(refresh, 800);
  setTimeout(refresh, 2500);

  try {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area !== "local") return;
      if (changes.zokys_ota_force || changes.zokys_ota_version || changes.zokys_ota_message) {
        refresh();
      }
    });
  } catch (_) {}

  try {
    chrome.runtime.onMessage.addListener(function (msg) {
      if (!msg) return;
      if (msg.type === "FOXGEN_OTA_STATE") {
        if (msg.force) {
          showUi({
            latest_version: msg.latest_version || "",
            update_message: msg.update_message || msg.message || "",
            current_version: msg.current_version || ""
          });
        } else removeUi();
      }
    });
  } catch (_) {}
})();
