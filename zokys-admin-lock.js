/**
 * FoxGEN Pro Admin Global Lock — full lock until admin turns switch OFF
 * (Separate from OTA force-update download screen)
 */
(function () {
  "use strict";
  if (window.__zokysAdminLockUI1__) return;
  window.__zokysAdminLockUI1__ = true;
  if (!/lovable\.dev/i.test(location.hostname || "")) return;

  var ROOT_ID = "zokys-admin-lock";

  function removeUi() {
    var el = document.getElementById(ROOT_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function showUi(message) {
    removeUi();
    var root = document.createElement("div");
    root.id = ROOT_ID;
    root.innerHTML =
      '<style>' +
      '#' + ROOT_ID + '{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;' +
      'padding:20px;font-family:Inter,-apple-system,BlinkMacSystemFont,system-ui,sans-serif;' +
      'background:radial-gradient(ellipse at 30% 20%,rgba(127,29,29,.35),transparent 50%),' +
      'radial-gradient(ellipse at 70% 80%,rgba(124,45,18,.4),transparent 45%),rgba(5,3,10,.94);' +
      'backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);}' +
      '#' + ROOT_ID + ' .card{position:relative;width:min(380px,94vw);padding:32px 26px 26px;border-radius:26px;text-align:center;' +
      'background:linear-gradient(165deg,rgba(40,12,20,.98),rgba(12,8,22,.98));' +
      'border:1px solid rgba(248,113,113,.28);box-shadow:0 0 0 1px rgba(255,255,255,.04),0 28px 70px rgba(0,0,0,.6),0 0 60px rgba(249,115,22,.12);' +
      'overflow:hidden;animation:zkLockIn .45s cubic-bezier(.22,1,.36,1) both;}' +
      '@keyframes zkLockIn{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}' +
      '#' + ROOT_ID + ' .card:before{content:"";position:absolute;inset:-40% -20% auto;height:70%;' +
      'background:radial-gradient(circle,rgba(239,68,68,.2),transparent 65%);pointer-events:none;}' +
      '#' + ROOT_ID + ' .orb{position:absolute;border-radius:50%;filter:blur(30px);opacity:.5;pointer-events:none;}' +
      '#' + ROOT_ID + ' .orb.a{width:120px;height:120px;top:-30px;right:-20px;background:rgba(249,115,22,.35);}' +
      '#' + ROOT_ID + ' .orb.b{width:90px;height:90px;bottom:10px;left:-20px;background:rgba(239,68,68,.25);}' +
      '#' + ROOT_ID + ' .icon-wrap{position:relative;width:72px;height:72px;margin:0 auto 16px;border-radius:22px;' +
      'display:flex;align-items:center;justify-content:center;font-size:32px;' +
      'background:linear-gradient(145deg,rgba(127,29,29,.5),rgba(124,45,18,.45));' +
      'border:1px solid rgba(252,165,165,.3);box-shadow:0 12px 32px rgba(127,29,29,.35);' +
      'animation:zkPulse 2.2s ease-in-out infinite;}' +
      '@keyframes zkPulse{0%,100%{box-shadow:0 12px 32px rgba(127,29,29,.35)}50%{box-shadow:0 12px 40px rgba(249,115,22,.45)}}' +
      '#' + ROOT_ID + ' .badge{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;margin-bottom:12px;' +
      'font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;' +
      'color:#fecaca;background:rgba(127,29,29,.35);border:1px solid rgba(248,113,113,.35);}' +
      '#' + ROOT_ID + ' h2{position:relative;margin:0 0 10px;font-size:24px;font-weight:900;letter-spacing:.08em;' +
      'background:linear-gradient(100deg,#fecaca,#ffedd5,#fdba74);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}' +
      '#' + ROOT_ID + ' .msg{position:relative;margin:0 0 18px;font-size:13px;line-height:1.55;color:rgba(254,226,226,.82);font-weight:600;}' +
      '#' + ROOT_ID + ' .hint{position:relative;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:rgba(196,181,253,.45);margin-bottom:18px;}' +
      '#' + ROOT_ID + ' .btn{position:relative;border:none;cursor:pointer;padding:12px 22px;border-radius:14px;font-weight:800;font-size:12px;' +
      'letter-spacing:.1em;text-transform:uppercase;color:#fff;' +
      'background:linear-gradient(135deg,#7f1d1d,#ea580c);box-shadow:0 10px 28px rgba(127,29,29,.35);}' +
      '#' + ROOT_ID + ' .btn:active{transform:scale(.98);}' +
      '#' + ROOT_ID + ' .foot{margin-top:16px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(249,115,22,.4);}' +
      '</style>' +
      '<div class="card">' +
      '<div class="orb a"></div><div class="orb b"></div>' +
      '<div class="icon-wrap">🔒</div>' +
      '<div class="badge">ADMIN LOCK</div>' +
      '<h2>EXTENSION LOCKED</h2>' +
      '<p class="msg"></p>' +
      '<div class="hint">Wait for admin to unlock · features paused</div>' +
      '<button type="button" class="btn" id="zokys-admin-lock-ok">Understood</button>' +
      '<div class="foot">FoxGEN Pro · Remote Control</div>' +
      '</div>';

    root.querySelector(".msg").textContent =
      message || "Admin has locked all extensions. Everything stays paused until the lock switch is turned OFF.";
    document.documentElement.appendChild(root);
    var btn = root.querySelector("#zokys-admin-lock-ok");
    if (btn) {
      btn.onclick = function () {
        /* Dismiss visual only — lock state remains; UI returns on refresh/poll */
        removeUi();
        setTimeout(refresh, 4000);
      };
    }
  }

  function refresh() {
    try {
      chrome.storage.local.get(
        ["zokys_extension_locked", "zokys_lock_message", "zokys_ota_force", "zokys_admin_lock"],
        function (s) {
          var ota = !!(s && s.zokys_ota_force === true);
          /* OTA screen owns the UI when force update is on */
          if (ota) {
            removeUi();
            return;
          }
          var locked = !!(s && (s.zokys_extension_locked === true || s.zokys_admin_lock === true));
          if (locked) {
            showUi(s.zokys_lock_message || "");
          } else {
            removeUi();
          }
        }
      );
    } catch (_) {}
  }

  refresh();
  setTimeout(refresh, 600);
  setTimeout(refresh, 2000);
  setTimeout(refresh, 5000);

  try {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area !== "local") return;
      if (
        changes.zokys_extension_locked ||
        changes.zokys_lock_message ||
        changes.zokys_ota_force ||
        changes.zokys_admin_lock
      ) {
        refresh();
      }
    });
  } catch (_) {}

  try {
    chrome.runtime.onMessage.addListener(function (msg) {
      if (!msg) return;
      if (msg.type === "FOXGEN_LOCK_STATE") {
        if (msg.locked && !msg.ota) {
          /* check ota flag before show */
          chrome.storage.local.get(["zokys_ota_force"], function (s) {
            if (s && s.zokys_ota_force) return;
            showUi(msg.message || "");
          });
        } else if (!msg.locked) {
          removeUi();
        }
      }
    });
  } catch (_) {}
})();
