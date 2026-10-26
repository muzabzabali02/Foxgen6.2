/**
 * FoxGEN Pro send loader — rocket pad → ignition → liftoff
 * API unchanged: window.__zokysSendAnimShow(title, sub) / __zokysSendAnimHide()
 */
(function () {
  if (window.__zokysSendAnimV3__) return;
  window.__zokysSendAnimV3__ = true;
  if (!/lovable\.dev/i.test(location.hostname || "")) return;

  var hideTimer = null;
  var phaseTimer = null;

  function css() {
    if (document.getElementById("zokys-rocket-css")) return;
    var st = document.createElement("style");
    st.id = "zokys-rocket-css";
    st.textContent = [
      "#zokys-rocket-overlay{position:fixed;inset:0;z-index:2147483645;display:flex;align-items:center;justify-content:center;",
      "background:radial-gradient(ellipse 70% 50% at 50% 75%,rgba(124,45,18,.22),transparent 55%),rgba(4,2,12,.42);",
      "backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);",
      "opacity:0;pointer-events:none;transition:opacity .4s ease;overflow:hidden}",
      "#zokys-rocket-overlay.on{opacity:1;pointer-events:auto}",
      "#zokys-rocket-overlay.lift-off .rocket-stage{animation:trRocketLaunch .95s cubic-bezier(.2,.8,.2,1) forwards}",
      "#zokys-rocket-overlay.lift-off .flame{animation:trFlameBoost .95s ease-out forwards}",
      "#zokys-rocket-overlay.lift-off .smoke-cloud{animation:trSmokeBurst .9s ease-out forwards}",
      "#zokys-rocket-overlay.lift-off .pad-glow{opacity:0;transition:opacity .4s}",

      /* card */
      "#zokys-rocket-overlay .rk-box{position:relative;display:flex;flex-direction:column;align-items:center;",
      "padding:8px 28px 26px;border-radius:28px;min-width:220px;",
      "background:linear-gradient(165deg,rgba(22,10,42,.9),rgba(8,4,18,.94));",
      "border:1px solid rgba(249,115,22,.32);",
      "box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 50px rgba(234,88,12,.18),inset 0 1px 0 rgba(255,255,255,.06);",
      "backdrop-filter:blur(20px)}",

      /* scene */
      "#zokys-rocket-overlay .rk-scene{position:relative;width:160px;height:170px;margin:4px 0 6px;overflow:visible}",

      /* ground / pad */
      "#zokys-rocket-overlay .pad{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);",
      "width:110px;height:14px;border-radius:8px;",
      "background:linear-gradient(180deg,#3b1d6e,#1a0a30);",
      "box-shadow:0 0 20px rgba(249,115,22,.35),0 4px 12px rgba(0,0,0,.5);z-index:2}",
      "#zokys-rocket-overlay .pad:before{content:'';position:absolute;left:12%;right:12%;top:-3px;height:3px;border-radius:2px;",
      "background:linear-gradient(90deg,transparent,#f97316,transparent);opacity:.7}",
      "#zokys-rocket-overlay .pad-glow{position:absolute;left:50%;bottom:0;transform:translateX(-50%);",
      "width:90px;height:40px;border-radius:50%;background:radial-gradient(ellipse,rgba(192,38,255,.45),transparent 70%);",
      "filter:blur(8px);z-index:1;animation:trPadPulse 1.4s ease-in-out infinite}",

      /* rocket body */
      "#zokys-rocket-overlay .rocket-stage{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);",
      "width:36px;height:78px;z-index:5;transform-origin:50% 100%}",
      "#zokys-rocket-overlay .rocket{position:relative;width:36px;height:78px}",
      /* nose */
      "#zokys-rocket-overlay .rk-nose{position:absolute;left:50%;top:0;transform:translateX(-50%);",
      "width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;",
      "border-bottom:22px solid #ffedd5;filter:drop-shadow(0 0 6px rgba(233,213,255,.5))}",
      "#zokys-rocket-overlay .rk-nose:after{content:'';position:absolute;left:-6px;top:14px;",
      "width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;",
      "border-bottom:10px solid #fb923c}",
      /* body */
      "#zokys-rocket-overlay .rk-body{position:absolute;left:50%;top:18px;transform:translateX(-50%);",
      "width:22px;height:42px;border-radius:4px 4px 2px 2px;",
      "background:linear-gradient(180deg,#f5f3ff 0%,#fdba74 35%,#ea580c 100%);",
      "box-shadow:inset -3px 0 6px rgba(0,0,0,.25),inset 3px 0 4px rgba(255,255,255,.35),0 0 12px rgba(249,115,22,.4)}",
      "#zokys-rocket-overlay .rk-window{position:absolute;left:50%;top:28px;transform:translateX(-50%);",
      "width:10px;height:10px;border-radius:50%;",
      "background:radial-gradient(circle at 35% 35%,#e0f2fe,#38bdf8 60%,#0369a1);",
      "box-shadow:0 0 8px rgba(56,189,248,.6),inset 0 0 2px #fff}",
      "#zokys-rocket-overlay .rk-fin-l,#zokys-rocket-overlay .rk-fin-r{position:absolute;bottom:0;width:0;height:0;",
      "border-bottom:16px solid #6d28d9}",
      "#zokys-rocket-overlay .rk-fin-l{left:-2px;border-right:12px solid transparent}",
      "#zokys-rocket-overlay .rk-fin-r{right:-2px;border-left:12px solid transparent}",
      "#zokys-rocket-overlay .rk-stripe{position:absolute;left:2px;right:2px;top:38px;height:3px;",
      "background:linear-gradient(90deg,#f97316,#f0abfc,#f97316);border-radius:1px;opacity:.9}",

      /* engine flame */
      "#zokys-rocket-overlay .flame{position:absolute;left:50%;bottom:-6px;transform:translateX(-50%);",
      "width:18px;height:28px;z-index:4;transform-origin:50% 0%;",
      "background:linear-gradient(180deg,#fff7ed 0%,#fb923c 25%,#ef4444 55%,#ea580c 100%);",
      "border-radius:0 0 50% 50% / 0 0 60% 60%;",
      "filter:blur(.4px);box-shadow:0 8px 20px rgba(239,68,68,.55);",
      "animation:trFlameFlicker .12s ease-in-out infinite alternate}",
      "#zokys-rocket-overlay .flame:before{content:'';position:absolute;left:50%;top:2px;transform:translateX(-50%);",
      "width:10px;height:16px;border-radius:0 0 50% 50%;",
      "background:linear-gradient(180deg,#fff,#fde68a 40%,#f97316)}",

      /* smoke on pad */
      "#zokys-rocket-overlay .smoke-cloud{position:absolute;left:50%;bottom:4px;transform:translateX(-50%);",
      "width:120px;height:36px;z-index:3;pointer-events:none}",
      "#zokys-rocket-overlay .smoke{position:absolute;bottom:0;border-radius:50%;",
      "background:radial-gradient(circle,rgba(196,181,253,.55),rgba(124,45,18,.15) 60%,transparent);",
      "filter:blur(4px);animation:trSmokeRise 1.8s ease-out infinite}",
      "#zokys-rocket-overlay .smoke.s1{left:8%;width:28px;height:22px;animation-delay:0s}",
      "#zokys-rocket-overlay .smoke.s2{left:28%;width:36px;height:26px;animation-delay:.25s}",
      "#zokys-rocket-overlay .smoke.s3{left:48%;width:32px;height:24px;animation-delay:.1s}",
      "#zokys-rocket-overlay .smoke.s4{left:68%;width:30px;height:22px;animation-delay:.35s}",

      /* text */
      "#zokys-rocket-overlay .rk-t{font:800 12px Inter,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;",
      "background:linear-gradient(120deg,#fff 20%,#e879f9 80%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;",
      "background-clip:text;text-align:center}",
      "#zokys-rocket-overlay .rk-s{margin-top:7px;font:500 11px Inter,system-ui;color:rgba(233,213,255,.62);text-align:center;max-width:200px;line-height:1.35}",
      "#zokys-rocket-overlay .rk-dots::after{content:'';animation:trDots 1.15s steps(4,end) infinite}",

      /* keyframes */
      "@keyframes trPadPulse{0%,100%{opacity:.55;transform:translateX(-50%) scale(1)}50%{opacity:.9;transform:translateX(-50%) scale(1.08)}}",
      "@keyframes trFlameFlicker{from{transform:translateX(-50%) scaleY(1) scaleX(1)}to{transform:translateX(-50%) scaleY(1.15) scaleX(.92)}}",
      "@keyframes trSmokeRise{0%{opacity:0;transform:translateY(6px) scale(.7)}30%{opacity:.7}100%{opacity:0;transform:translateY(-18px) scale(1.3)}}",
      "@keyframes trRocketLaunch{0%{transform:translateX(-50%) translateY(0) scale(1)}15%{transform:translateX(-50%) translateY(2px) scale(1.02)}",
      "40%{transform:translateX(-50%) translateY(-40px) scale(1)}100%{transform:translateX(-50%) translateY(-280px) scale(.55);opacity:0}}",
      "@keyframes trFlameBoost{0%{height:28px;opacity:1}30%{height:48px}100%{height:70px;opacity:.3;filter:blur(2px)}}",
      "@keyframes trSmokeBurst{0%{opacity:1;transform:translateX(-50%) scale(1)}100%{opacity:0;transform:translateX(-50%) scale(2.2) translateY(-10px)}}",
      "@keyframes trDots{0%{content:''}25%{content:'.'}50%{content:'..'}75%{content:'...'}}"
    ].join("");
    (document.head || document.documentElement).appendChild(st);
  }

  function buildHTML() {
    return (
      '<div class="rk-box">' +
        '<div class="rk-scene">' +
          '<div class="pad-glow"></div>' +
          '<div class="smoke-cloud">' +
            '<div class="smoke s1"></div><div class="smoke s2"></div>' +
            '<div class="smoke s3"></div><div class="smoke s4"></div>' +
          "</div>" +
          '<div class="rocket-stage">' +
            '<div class="rocket">' +
              '<div class="rk-nose"></div>' +
              '<div class="rk-body"></div>' +
              '<div class="rk-window"></div>' +
              '<div class="rk-stripe"></div>' +
              '<div class="rk-fin-l"></div><div class="rk-fin-r"></div>' +
            "</div>" +
            '<div class="flame"></div>' +
          "</div>" +
          '<div class="pad"></div>' +
        "</div>" +
        '<div class="rk-t"></div>' +
        '<div class="rk-s"></div>' +
      "</div>"
    );
  }

  window.__zokysSendAnimShow = function (title, sub) {
    css();
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    if (phaseTimer) {
      clearTimeout(phaseTimer);
      phaseTimer = null;
    }

    var el = document.getElementById("zokys-rocket-overlay");
    if (!el) {
      el = document.createElement("div");
      el.id = "zokys-rocket-overlay";
      el.innerHTML = buildHTML();
      document.documentElement.appendChild(el);
    } else {
      el.classList.remove("lift-off");
      // reset rocket position by re-mounting stage if needed
      var stage = el.querySelector(".rocket-stage");
      if (stage) {
        stage.style.animation = "none";
        void stage.offsetWidth;
        stage.style.animation = "";
      }
    }

    var t = title || "Preparing launch";
    var s = sub || "Arming systems · verifying license";
    // map old titles to rocket flavour
    if (/sending/i.test(t)) t = "Ignition sequence";
    if (/loading method/i.test(t)) t = "Fueling engines";
    if (/zokys/i.test(s)) s = s.replace(/FoxGEN Pro/gi, "FoxGEN Pro");
    if (/securing send/i.test(s)) s = "Verifying license · arming systems";
    if (/secure fetch/i.test(s)) s = "Secure uplink · loading payload";

    el.querySelector(".rk-t").innerHTML = t + '<span class="rk-dots"></span>';
    el.querySelector(".rk-s").textContent = s;

    requestAnimationFrame(function () {
      el.classList.add("on");
      el.classList.remove("lift-off");
    });
  };

  window.__zokysSendAnimHide = function () {
    var el = document.getElementById("zokys-rocket-overlay");
    if (!el) return;

    // trigger liftoff, then fade overlay
    el.classList.add("lift-off");
    if (phaseTimer) clearTimeout(phaseTimer);
    phaseTimer = setTimeout(function () {
      el.classList.remove("on");
      hideTimer = setTimeout(function () {
        try {
          el.classList.remove("lift-off");
          el.remove();
        } catch (_) {}
      }, 420);
    }, 780);
  };
})();
