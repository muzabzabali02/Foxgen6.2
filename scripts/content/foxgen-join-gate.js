/* FoxGEN Pro — premium mandatory WhatsApp Channel + Community join gate */
(function () {
  "use strict";
  if (window.__foxgenJoinGate) return;
  window.__foxgenJoinGate = true;

  var KEY = "foxgen_join_v1";
  var REQUIRED = [
    { id: "wa_channel", icon: "📢", label: "Follow WhatsApp Channel", sub: "Updates, new versions & free keys", url: "https://whatsapp.com/channel/0029VbDK6SHKLaHn5vxOQa0v" },
    { id: "wa_community", icon: "👥", label: "Join WhatsApp Community", sub: "Support & discussion with members", url: "https://chat.whatsapp.com/KvOy0Fw8IWL0NGwc5zVTxf" }
  ];
  var LINKS = [
    ["✈️", "Telegram", "https://t.me/foxgenofficial"],
    ["💬", "TG Group", "https://t.me/lovableunlimitedfoxgen"],
    ["📘", "Facebook", "https://www.facebook.com/share/18PfyFqPJ3/"],
    ["▶️", "YouTube", "https://youtube.com/@mirza-p7x6s"],
    ["🌐", "Website", "https://nextgen.lovableunlimitedc.workers.dev"],
    ["🛟", "Support", "https://wa.me/917699355860"]
  ];

  var CSS = [
    "@keyframes fxg-in{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}",
    "@keyframes fxg-glow{0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,.55)}50%{box-shadow:0 0 0 10px rgba(34,211,238,0)}}",
    "@keyframes fxg-spin{to{transform:rotate(360deg)}}",
    "@keyframes fxg-shine{from{background-position:200% 0}to{background-position:-200% 0}}",
    "#foxgen-join-gate{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:radial-gradient(1200px 600px at 20% 0%,rgba(34,211,238,.18),transparent 60%),radial-gradient(900px 500px at 100% 100%,rgba(59,130,246,.2),transparent 60%),rgba(2,6,18,.92);backdrop-filter:blur(14px)}",
    "#foxgen-join-gate *{box-sizing:border-box}",
    ".fxg-wrap{position:relative;width:min(460px,92vw);border-radius:26px;padding:1.5px;background:conic-gradient(from 0deg,#22d3ee,#3b82f6,#a855f7,#22d3ee);animation:fxg-in .5s cubic-bezier(.2,.8,.2,1)}",
    ".fxg-card{max-height:88vh;overflow:auto;border-radius:25px;padding:28px 24px 22px;background:linear-gradient(165deg,#0c1a33 0%,#070f20 60%,#050a16 100%);color:#e6f6ff;scrollbar-width:none}",
    ".fxg-card::-webkit-scrollbar{display:none}",
    ".fxg-logo{position:relative;width:84px;height:84px;margin:0 auto 14px;border-radius:24px;padding:3px;background:linear-gradient(135deg,#22d3ee,#3b82f6);animation:fxg-glow 2.6s infinite}",
    ".fxg-logo img{width:100%;height:100%;border-radius:21px;object-fit:cover;background:#081226;display:block}",
    ".fxg-title{text-align:center;font-size:25px;font-weight:900;letter-spacing:.02em;background:linear-gradient(90deg,#fff,#7dd3fc,#fff);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:fxg-shine 6s linear infinite}",
    ".fxg-badge{display:block;width:max-content;margin:8px auto 0;padding:4px 12px;border-radius:999px;font-size:10.5px;font-weight:800;letter-spacing:.18em;color:#67e8f9;background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.35)}",
    ".fxg-desc{text-align:center;font-size:13px;line-height:1.6;color:#9fb6cc;margin:14px 6px 18px}",
    ".fxg-step{display:flex;align-items:center;gap:12px;padding:13px 14px;margin:10px 0;border-radius:16px;text-decoration:none;color:#e6f6ff;background:linear-gradient(135deg,rgba(34,211,238,.09),rgba(59,130,246,.06));border:1px solid rgba(34,211,238,.28);transition:transform .2s,border-color .2s,background .2s}",
    ".fxg-step:hover{transform:translateY(-2px);border-color:rgba(34,211,238,.7)}",
    ".fxg-step.done{background:linear-gradient(135deg,rgba(16,185,129,.16),rgba(34,211,238,.06));border-color:rgba(16,185,129,.6)}",
    ".fxg-ic{flex:0 0 42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;background:rgba(255,255,255,.06)}",
    ".fxg-tx{flex:1;min-width:0}.fxg-tx b{display:block;font-size:14px;font-weight:800}.fxg-tx span{font-size:11.5px;color:#8ba3bb}",
    ".fxg-st{font-size:10.5px;font-weight:800;letter-spacing:.08em;padding:4px 9px;border-radius:999px;color:#fbbf24;background:rgba(251,191,36,.12)}",
    ".fxg-step.done .fxg-st{color:#34d399;background:rgba(52,211,153,.14)}",
    ".fxg-prog{height:6px;border-radius:99px;background:rgba(255,255,255,.07);margin:16px 0 4px;overflow:hidden}.fxg-prog i{display:block;height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,#22d3ee,#3b82f6);transition:width .4s}",
    ".fxg-pl{font-size:11px;color:#7f97ad;text-align:right}",
    ".fxg-btn{width:100%;margin-top:14px;padding:15px;border:0;border-radius:15px;font-weight:900;font-size:14.5px;letter-spacing:.12em;cursor:not-allowed;background:#16213a;color:#556680;transition:all .25s}",
    ".fxg-btn.on{cursor:pointer;color:#fff;background:linear-gradient(90deg,#06b6d4,#3b82f6,#06b6d4);background-size:200% 100%;animation:fxg-shine 3s linear infinite;box-shadow:0 10px 30px -8px rgba(34,211,238,.7)}",
    ".fxg-btn.on:hover{transform:translateY(-1px)}",
    ".fxg-sep{display:flex;align-items:center;gap:10px;margin:20px 0 10px;font-size:10.5px;font-weight:800;letter-spacing:.2em;color:#5f7a94}.fxg-sep:before,.fxg-sep:after{content:'';flex:1;height:1px;background:rgba(148,163,184,.18)}",
    ".fxg-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}",
    ".fxg-lk{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px;border-radius:12px;text-decoration:none;font-size:11.5px;font-weight:700;color:#cbd5e1;background:rgba(255,255,255,.03);border:1px solid rgba(148,163,184,.14);transition:all .2s}",
    ".fxg-lk:hover{border-color:rgba(34,211,238,.5);color:#fff;background:rgba(34,211,238,.07)}.fxg-lk em{font-style:normal;font-size:17px}",
    ".fxg-foot{text-align:center;font-size:10.5px;color:#4f6680;margin-top:16px;letter-spacing:.05em}"
  ].join("");

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function save(state, cb) { var o = {}; o[KEY] = state; chrome.storage.local.set(o, cb); }

  function showGate(state) {
    if (document.getElementById("foxgen-join-gate")) return;
    var st = el("style"); st.textContent = CSS;
    var ov = el("div"); ov.id = "foxgen-join-gate"; ov.appendChild(st);
    var wrap = el("div", "fxg-wrap"), card = el("div", "fxg-card");

    var logo = el("div", "fxg-logo"), img = document.createElement("img");
    try { img.src = chrome.runtime.getURL("assets/icon128.png"); } catch (e) {}
    img.alt = "FoxGEN Pro"; logo.appendChild(img); card.appendChild(logo);
    card.appendChild(el("div", "fxg-title", "FoxGEN PRO"));
    card.appendChild(el("span", "fxg-badge", "PREMIUM · v6.20"));
    card.appendChild(el("div", "fxg-desc", "Welcome! Complete the 2 quick steps below to unlock your extension."));

    var prog = el("div", "fxg-prog", "<i></i>"), pl = el("div", "fxg-pl");
    var cont = el("button", "fxg-btn", "🔒 START EXTENSION");

    function refresh() {
      var n = REQUIRED.filter(function (r) { return state[r.id]; }).length;
      var ok = n === REQUIRED.length;
      prog.firstChild.style.width = (n / REQUIRED.length * 100) + "%";
      pl.textContent = n + " / " + REQUIRED.length + " completed";
      cont.disabled = !ok;
      cont.className = "fxg-btn" + (ok ? " on" : "");
      cont.textContent = ok ? "🚀 START EXTENSION" : "🔒 START EXTENSION";
    }

    REQUIRED.forEach(function (r) {
      var a = el("a", "fxg-step");
      a.href = r.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      function paint() {
        a.className = "fxg-step" + (state[r.id] ? " done" : "");
        a.innerHTML = '<div class="fxg-ic">' + (state[r.id] ? "✅" : r.icon) + '</div><div class="fxg-tx"><b>' + r.label + "</b><span>" + r.sub + '</span></div><div class="fxg-st">' + (state[r.id] ? "DONE" : "REQUIRED") + "</div>";
      }
      paint();
      a.addEventListener("click", function () { state[r.id] = true; save(state); paint(); refresh(); });
      card.appendChild(a);
    });

    card.appendChild(prog); card.appendChild(pl);
    cont.addEventListener("click", function () {
      if (cont.disabled) return;
      state.done = true;
      save(state, function () { location.reload(); });
    });
    card.appendChild(cont);

    card.appendChild(el("div", "fxg-sep", "OFFICIAL LINKS"));
    var grid = el("div", "fxg-grid");
    LINKS.forEach(function (l) {
      var a = el("a", "fxg-lk", "<em>" + l[0] + "</em>" + l[1]);
      a.href = l[2]; a.target = "_blank"; a.rel = "noopener noreferrer";
      grid.appendChild(a);
    });
    card.appendChild(grid);
    card.appendChild(el("div", "fxg-foot", "© FoxGEN Official · Premium Lovable Assistant"));

    refresh();
    wrap.appendChild(card); ov.appendChild(wrap);
    (document.body || document.documentElement).appendChild(ov);
  }

  chrome.storage.local.get(KEY, function (r) {
    var state = (r && r[KEY]) || {};
    if (!state.done) {
      if (document.body) showGate(state);
      else document.addEventListener("DOMContentLoaded", function () { showGate(state); });
    }
  });
})();
