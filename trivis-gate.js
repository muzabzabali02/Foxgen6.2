/**
 * FoxGEN Pro license gate — premium liquid glass + Iconsax-style 3D icons
 */
(function () {
  if (window.__TRIVIS_V8_GATE__) return;
  window.__TRIVIS_V8_GATE__ = true;

  function status(cb) {
    try {
      chrome.runtime.sendMessage({ type: "TRIVIS_STATUS" }, function (r) {
        if (chrome.runtime.lastError) {
          chrome.storage.local.get(["trivis_lic_ok", "trivis_license_key", "trivis_lic_expires"], function (s) {
            var ok = !!(s && (s.trivis_lic_ok === true || s.trivis_lic_ok === "1") && s.trivis_license_key);
            if (ok && s.trivis_lic_expires) {
              var t = Date.parse(s.trivis_lic_expires);
              if (t && Date.now() > t) ok = false;
            }
            cb(ok);
          });
          return;
        }
        cb(!!(r && r.ok));
      });
    } catch (_) {
      cb(false);
    }
  }

  function removeGate() {
    var g = document.getElementById("zokys-pro-gate");
    if (!g) return;
    g.classList.add("vx-gate-out");
    setTimeout(function () {
      if (g && g.parentNode) g.remove();
    }, 420);
  }

  function showGate() {
    if (document.getElementById("zokys-pro-gate")) return;
    var root = document.createElement("div");
    root.id = "zokys-pro-gate";

    // Iconsax-style bold SVGs with gradient for 3D premium feel
    var iconShield = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="tg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffedd5"/><stop offset="100%" stop-color="#f97316"/></linearGradient></defs><path d="M12 2L4 5.5v5.8c0 4.7 3.1 9.1 8 10.2 4.9-1.1 8-5.5 8-10.2V5.5L12 2z" fill="url(#tg1)" opacity=".95"/><path d="M12 2L4 5.5v5.8c0 4.7 3.1 9.1 8 10.2 4.9-1.1 8-5.5 8-10.2V5.5L12 2z" stroke="#fb923c" stroke-width="1.2" fill="none"/></svg>';
    var iconKey = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15.5 8.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" stroke="url(#tg2)" stroke-width="1.8"/><path d="M12 12v7m0 0l-2.5-2.5M12 19l2.5-2.5" stroke="url(#tg2)" stroke-width="1.8" stroke-linecap="round"/><defs><linearGradient id="tg2" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffedd5"/><stop offset="1" stop-color="#f97316"/></linearGradient></defs></svg>';
    var iconLock = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2.5" stroke="#f97316" stroke-width="1.6" fill="rgba(249,115,22,.12)"/><path d="M8 11V8a4 4 0 018 0v3" stroke="#fb923c" stroke-width="1.6" stroke-linecap="round"/></svg>';
    var iconCopy = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2" stroke="#fb923c" stroke-width="1.6"/><path d="M5 15V6a2 2 0 012-2h9" stroke="#f97316" stroke-width="1.6" stroke-linecap="round"/></svg>';
    var iconArrow = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    root.innerHTML =
      "<style>" +
      "#zokys-pro-gate{position:fixed!important;inset:0!important;z-index:2147483647!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;-webkit-tap-highlight-color:transparent!important;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif!important;background:#050508!important;color:#f4f4f5!important;isolation:isolate!important;animation:vxGateIn .5s cubic-bezier(.22,1,.36,1) both!important;}" +
      "#zokys-pro-gate:before{content:'';position:absolute;inset:0;pointer-events:none;background:" +
        "radial-gradient(ellipse 80% 50% at 50% -10%,rgba(249,115,22,.22),transparent 55%)," +
        "radial-gradient(ellipse 60% 40% at 85% 80%,rgba(139,92,246,.12),transparent 50%)," +
        "radial-gradient(ellipse 50% 35% at 10% 70%,rgba(251,146,60,.08),transparent 45%);}" +
      "#zokys-pro-gate:after{content:'';position:absolute;inset:0;pointer-events:none;background-image:url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\");opacity:.5;}" +
      "#zokys-pro-gate.vx-gate-out{animation:vxGateOut .38s ease forwards!important;}" +
      "@keyframes vxGateIn{from{opacity:0}to{opacity:1}}@keyframes vxGateOut{to{opacity:0}}" +
      "@keyframes vxContentIn{from{opacity:0;transform:translateY(18px) scale(.97);filter:blur(6px)}to{opacity:1;transform:none;filter:none}}" +
      "@keyframes vxLogoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}" +
      "@keyframes vxPulse{0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,.45)}70%{box-shadow:0 0 0 14px rgba(249,115,22,0)}}" +
      "@keyframes vxShine{0%{transform:translateX(-120%) skewX(-18deg)}100%{transform:translateX(220%) skewX(-18deg)}}" +
      "#zokys-pro-gate .wrap{position:relative;width:min(400px,92vw);padding:36px 32px 28px;border-radius:28px;" +
        "background:linear-gradient(165deg,rgba(24,16,40,.92),rgba(12,8,22,.96));" +
        "border:1px solid rgba(249,115,22,.28);" +
        "box-shadow:0 0 0 1px rgba(255,255,255,.04) inset,0 32px 80px -20px rgba(0,0,0,.85),0 0 60px -10px rgba(249,115,22,.25);" +
        "backdrop-filter:blur(40px) saturate(1.4);-webkit-backdrop-filter:blur(40px) saturate(1.4);" +
        "animation:vxContentIn .55s cubic-bezier(.22,1,.36,1) .08s both;overflow:hidden;}" +
      "#zokys-pro-gate .wrap:before{content:'';position:absolute;top:0;left:-40%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);animation:vxShine 4.5s ease-in-out infinite;pointer-events:none;}" +
      "#zokys-pro-gate .logo-wrap{display:flex;justify-content:center;margin-bottom:18px;}" +
      "#zokys-pro-gate .logo{width:84px;height:84px;border-radius:22px;overflow:hidden;position:relative;" +
        "box-shadow:0 12px 40px rgba(249,115,22,.35),0 0 0 1px rgba(251,146,60,.35);" +
        "animation:vxLogoFloat 4s ease-in-out infinite;}" +
      "#zokys-pro-gate .logo img{width:100%;height:100%;object-fit:cover;display:block;}" +
      "#zokys-pro-gate .logo:after{content:'';position:absolute;inset:0;border-radius:22px;box-shadow:inset 0 1px 0 rgba(255,255,255,.15);pointer-events:none;}" +
      "#zokys-pro-gate h2{margin:0 0 6px;text-align:center;font-size:28px;font-weight:900;letter-spacing:.12em;" +
        "background:linear-gradient(135deg,#f5f3ff 0%,#fb923c 45%,#f97316 100%);" +
        "-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}" +
      "#zokys-pro-gate .sub{text-align:center;font-size:11px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;" +
        "color:rgba(196,181,253,.55);margin-bottom:26px;}" +
      "#zokys-pro-gate .field{position:relative;margin-bottom:14px;}" +
      "#zokys-pro-gate .field input{width:100%;height:52px;padding:0 48px 0 18px;border-radius:16px;border:1px solid rgba(249,115,22,.25);" +
        "background:rgba(255,255,255,.04);color:#f4f4f5;font-size:14px;font-weight:600;letter-spacing:.04em;" +
        "outline:none;transition:border .2s,box-shadow .2s,background .2s;box-sizing:border-box;}" +
      "#zokys-pro-gate .field input::placeholder{color:rgba(196,181,253,.35);font-weight:500;letter-spacing:.06em;}" +
      "#zokys-pro-gate .field input:focus{border-color:rgba(249,115,22,.55);background:rgba(249,115,22,.06);" +
        "box-shadow:0 0 0 4px rgba(249,115,22,.12),0 0 24px rgba(249,115,22,.15);}" +
      "#zokys-pro-gate .field .copy{position:absolute;right:10px;top:50%;transform:translateY(-50%);width:34px;height:34px;" +
        "border-radius:10px;border:none;background:rgba(249,115,22,.12);display:flex;align-items:center;justify-content:center;" +
        "cursor:pointer;transition:background .15s,transform .15s;}" +
      "#zokys-pro-gate .field .copy:hover{background:rgba(249,115,22,.25);transform:translateY(-50%) scale(1.05);}" +
      "#zokys-pro-gate .btn{position:relative;width:100%;height:54px;border:none;border-radius:16px;cursor:pointer;" +
        "font-size:13px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#fff;" +
        "background:linear-gradient(135deg,#ea580c 0%,#f97316 45%,#fb923c 100%);" +
        "box-shadow:0 8px 28px rgba(249,115,22,.4),inset 0 1px 0 rgba(255,255,255,.2);" +
        "display:flex;align-items:center;justify-content:center;gap:10px;overflow:hidden;transition:transform .15s,box-shadow .2s;}" +
      "#zokys-pro-gate .btn:hover{transform:translateY(-1px);box-shadow:0 12px 36px rgba(249,115,22,.5),inset 0 1px 0 rgba(255,255,255,.25);}" +
      "#zokys-pro-gate .btn:active{transform:translateY(0);}" +
      "#zokys-pro-gate .btn.loading{opacity:.7;pointer-events:none;}" +
      "#zokys-pro-gate .btn .lbl{position:relative;z-index:1;}" +
      "#zokys-pro-gate .btn .arr{position:relative;z-index:1;display:flex;}" +
      "#zokys-pro-gate .msg{min-height:22px;margin:14px 0 0;text-align:center;font-size:12px;font-weight:700;letter-spacing:.04em;" +
        "color:rgba(196,181,253,.5);transition:color .2s;}" +
      "#zokys-pro-gate .msg.err{color:#fb7185;}" +
      "#zokys-pro-gate .msg.ok{color:#4ade80;}" +
      "#zokys-pro-gate .foot{margin-top:22px;display:flex;align-items:center;justify-content:center;gap:8px;" +
        "font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(249,115,22,.45);}" +
      "#zokys-pro-gate .foot svg{opacity:.7;}" +
      "#zokys-pro-gate .shake{animation:vxShake .42s ease;}" +
      "@keyframes vxShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}" +
      "</style>" +
      '<div class="wrap">' +
        '<div class="logo-wrap"><div class="logo"><img alt="FoxGEN Pro" src="' +
          (chrome.runtime.getURL ? chrome.runtime.getURL("assets/icon128.png") : "") +
        '"/></div></div>' +
        '<h2>FoxGEN Pro</h2>' +
        '<p class="sub">ENTER LICENSE KEY · any prefix</p>' +
        '<div class="field">' +
          '<input id="zokys-gate-key" placeholder="FOXGEN-XXX-XXX" autocomplete="off" spellcheck="false"/>' +
          '<button type="button" class="copy" id="zokys-gate-paste" title="Paste">' + iconCopy + "</button>" +
        "</div>" +
        '<button type="button" class="btn" id="zokys-gate-btn">' +
          '<span class="lbl">ACTIVATE LICENSE</span><span class="arr">' + iconArrow + "</span>" +
        "</button>" +
        '<div class="msg" id="zokys-gate-msg"></div>' +
        '<div class="foot">' + iconLock + "<span>SECURED · ENCRYPTED · VX</span></div>" +
      "</div>";

    document.documentElement.appendChild(root);

    var input = document.getElementById("zokys-gate-key");
    var btn = document.getElementById("zokys-gate-btn");
    var msg = document.getElementById("zokys-gate-msg");
    var wrap = root.querySelector(".wrap");
    var pasteBtn = document.getElementById("zokys-gate-paste");

    pasteBtn.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(function (t) {
          if (t) input.value = t.trim();
        }).catch(function () {});
      }
    });

    function setLoading(on) {
      btn.disabled = !!on;
      btn.classList.toggle("loading", !!on);
      btn.querySelector(".lbl").textContent = on ? "VERIFYING…" : "ACTIVATE LICENSE";
    }

    function activate() {
      var key = (input.value || "").trim();
      if (!key) {
        msg.className = "msg err";
        msg.textContent = "ENTER A LICENSE KEY";
        wrap.classList.remove("shake");
        void wrap.offsetWidth;
        wrap.classList.add("shake");
        return;
      }
      setLoading(true);
      msg.className = "msg";
      msg.textContent = "VERIFYING…";
      try {
        chrome.runtime.sendMessage({ type: "TRIVIS_VALIDATE", key: key }, function (r) {
          setLoading(false);
          if (chrome.runtime.lastError) {
            msg.className = "msg err";
            msg.textContent = chrome.runtime.lastError.message || "NETWORK ERROR";
            wrap.classList.remove("shake");
            void wrap.offsetWidth;
            wrap.classList.add("shake");
            return;
          }
          if (r && r.ok) {
            msg.className = "msg ok";
            msg.textContent = "ACTIVATED";
            setTimeout(removeGate, 420);
          } else {
            msg.className = "msg err";
            msg.textContent = (r && (r.error || r.message)) || "INVALID KEY";
            wrap.classList.remove("shake");
            void wrap.offsetWidth;
            wrap.classList.add("shake");
          }
        });
      } catch (e) {
        setLoading(false);
        msg.className = "msg err";
        msg.textContent = "EXTENSION ERROR";
      }
    }

    btn.addEventListener("click", activate);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") activate();
    });
  }

  function boot() {
    try {
      chrome.storage.local.get(["trivis_lic_ok", "trivis_license_key"], function (s) {
        if (s && (s.trivis_lic_ok === true || s.trivis_lic_ok === "1") && s.trivis_license_key) {
          removeGate();
          return;
        }
        status(function (ok) {
          if (ok) removeGate();
          else setTimeout(function () {
            status(function (ok2) { if (ok2) removeGate(); else showGate(); });
          }, 600);
        });
      });
    } catch (_) {
      status(function (ok) { if (ok) removeGate(); else showGate(); });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  try {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area !== "local") return;
      if (changes.trivis_lic_ok || changes.trivis_license_key || changes.trivis_lic_expires) {
        status(function (ok) {
          if (ok) removeGate();
          else showGate();
        });
      }
    });
  } catch (_) {}
})();
