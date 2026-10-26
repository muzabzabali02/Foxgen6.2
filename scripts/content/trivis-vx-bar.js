/**
 * FoxGEN Pro — premium liquid glass liquid glass dock (UI only; page-ws untouched)
 */
(function () {
  "use strict";
  if (window.__TRIVIS_VX_BAR_V9__) return;
  window.__TRIVIS_VX_BAR_V9__ = true;

  const LINKS = {
    discord: "https://t.me/foxgenofficial",
    telegram: "https://t.me/foxgenofficial",
    youtube: "https://t.me/foxgenofficial",
    instagram: "https://t.me/foxgenofficial"
  };
  const PLANS = [
    { price: "$5", label: "10 days", id: "10d", devices: "3 devices", tag: "POPULAR", feats: ["Fix path active", "3 max devices", "Priority support"], hot: true },
    { price: "$9", label: "25 days", id: "25d", devices: "5 devices", tag: "PRO", feats: ["Fix path active", "5 max devices", "Fast support"] },
    { price: "$14", label: "40 days", id: "40d", devices: "Custom devices", tag: "MAX", feats: ["Fix path active", "Custom max devices", "VIP support"] },
    { price: "$25", label: "3 months", id: "pres", devices: "Pro Reseller", tag: "PRO RESELLER", feats: ["VIP admin panel", "Unlimited license keys", "Full source + setup", "Commission 0%"] }
  ];
  const LANGS = [
    { id: "en", label: "English", sub: "Global · Standard" },
    { id: "hi", label: "हिन्दी", sub: "Hindi · भारत" },
    { id: "es", label: "Español", sub: "Spanish · España" },
    { id: "ar", label: "العربية", sub: "Arabic · الشرق الأوسط" }
  ];

  let lang = "en", light = false, expanded = false; /* theme locked purple */
  let root, panel, bodyEl, pos = null, dragState = null;

  const I18N = {
    en: {
      license: "LICENSE", time: "TIME REMAINING", status: "STATUS", sync: "PROJECT SYNC",
      syncOk: "Project successfully synced", syncNo: "Project not synced",
      shop: "Shop", support: "Support", valid: "Valid", expired: "Expired", none: "No license",
      logout: "Logout", copy: "Copy", connected: "Connected", appTitle: "FoxGEN Pro",
      appDesc: "License hub, points & extension tools. Android app coming soon.",
      download: "Download App", demo: "Demo — app not released yet", buy: "Buy now",
      follow: "Follow", join: "Join server", subscribe: "Subscribe", joinTg: "Join now"
    },
    hi: {
      license: "लाइसेंस", time: "बाकी समय", status: "स्थिति", sync: "प्रोजेक्ट सिंक",
      syncOk: "Project successfully synced", syncNo: "Project not synced",
      shop: "शॉप", support: "सपोर्ट", valid: "सक्रिय", expired: "समाप्त", none: "कोई लाइसेंस नहीं",
      logout: "लॉगआउट", copy: "कॉपी", connected: "कनेक्टेड", appTitle: "ट्रिव्हिस ऐप",
      appDesc: "लाइसेंस और एक्सटेंशन। ऐप जल्द।", download: "ऐप डाउनलोड", demo: "डेमो — ऐप नहीं",
      buy: "खरीदें", follow: "फॉलो", join: "जॉइन", subscribe: "सब्सक्राइब", joinTg: "जॉइन"
    }
  };
  function t(k) { return (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k; }

  function cssText() {
    return `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@500;600;700;800&display=swap');

#zokys-vx-root {
  all: initial;
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2147483646;
  --zk-accent: #06b6d4;
  --zk-accent-light: #fb923c;
  --zk-accent-glow: rgba(168, 85, 247, 0.45);
  --zk-cyan: #38bdf8;
  --zk-cyan-glow: rgba(56, 189, 248, 0.4);
  --zk-emerald: #34d399;
  --zk-emerald-glow: rgba(52, 211, 153, 0.4);
  --zk-rose: #f43f5e;
  --zk-rose-glow: rgba(244, 63, 94, 0.4);
}

#zokys-vx-root * {
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent !important;
  tap-highlight-color: transparent !important;
  outline: none !important;
}

#zokys-vx-panel {
  pointer-events: auto;
  position: fixed;
  left: 20px;
  bottom: 24px;
  width: min(380px, calc(100vw - 28px));
  max-height: 88vh;
  color: #f8fafc;
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: radial-gradient(135% 120% at 50% -15%, rgba(46, 20, 84, 0.85) 0%, rgba(18, 12, 36, 0.94) 52%, rgba(7, 5, 14, 0.98) 100%) !important;
  backdrop-filter: blur(50px) saturate(220%) !important;
  -webkit-backdrop-filter: blur(50px) saturate(220%) !important;
  border: 1px solid rgba(192, 132, 252, 0.3) !important;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 1px 0 rgba(255, 255, 255, 0.35) inset,
    0 30px 80px -15px rgba(0, 0, 0, 0.88),
    0 0 45px -8px rgba(168, 85, 247, 0.38) !important;
  transition: width .38s cubic-bezier(.16,1,.3,1), border-radius .34s cubic-bezier(.16,1,.3,1), box-shadow .34s cubic-bezier(.16,1,.3,1), transform .3s cubic-bezier(.16,1,.3,1) !important;
  will-change: transform, left, top;
}

#zokys-vx-panel::before {
  content: "";
  position: absolute;
  top: -25%;
  left: -20%;
  width: 75%;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.42), transparent 70%);
  filter: blur(35px);
  pointer-events: none;
  z-index: 0;
  animation: zkGlowOrbA 14s ease-in-out infinite alternate;
}

#zokys-vx-panel::after {
  content: "";
  position: absolute;
  bottom: -20%;
  right: -20%;
  width: 70%;
  height: 170px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.28), transparent 70%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
  animation: zkGlowOrbB 16s ease-in-out infinite alternate;
}

@keyframes zkGlowOrbA {
  0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  100% { transform: translate(40px, 30px) scale(1.18); opacity: 0.85; }
}

@keyframes zkGlowOrbB {
  0% { transform: translate(0, 0) scale(1); opacity: 0.45; }
  100% { transform: translate(-35px, -25px) scale(1.15); opacity: 0.75; }
}

#zokys-vx-panel.minimized {
  width: auto !important;
  max-width: calc(100vw - 24px);
  border-radius: 22px !important;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.12) inset,
    0 16px 45px rgba(0, 0, 0, 0.75),
    0 0 28px rgba(168, 85, 247, 0.35) !important;
}

#zokys-vx-panel.minimized #zokys-vx-header {
  border-bottom: 0 !important;
  padding: 8px 10px !important;
  border-radius: 22px !important;
  background: transparent !important;
}

#zokys-vx-panel.minimized #zokys-vx-body {
  display: none !important;
}

#zokys-vx-panel.dragging {
  transition: none !important;
  transform: scale(1.03) !important;
  box-shadow: 0 35px 90px rgba(0,0,0,.9), 0 0 50px rgba(6,182,212,.45) !important;
}

/* === HEADER DOCK === */
#zokys-vx-header {
  position: relative;
  z-index: 4;
  display: flex !important;
  align-items: center !important;
  gap: 6px;
  padding: 10px 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09) !important;
  backdrop-filter: blur(16px);
  user-select: none;
  cursor: grab;
  touch-action: none;
}

#zokys-vx-header:active {
  cursor: grabbing;
}

.vx-brand-icon {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 6px 0 0 !important;
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
  margin-right: 2px !important;
}

.vx-brand-icon img {
  width: 26px !important;
  height: 26px !important;
  border-radius: 9px !important;
  object-fit: cover !important;
  border: 1.5px solid rgba(192, 132, 252, 0.5) !important;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
  animation: zkLogoPulse 4s ease-in-out infinite alternate !important;
}

@keyframes zkLogoPulse {
  0% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(6,182,212,.6)); }
  100% { transform: scale(1.05); filter: drop-shadow(0 0 16px rgba(217,70,239,.8)); }
}

/* Tab Icon Buttons */
.vx-ibtn {
  all: unset;
  cursor: pointer;
  position: relative;
  z-index: 5;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(226, 232, 240, 0.65);
  background: transparent;
  border: 1px solid transparent;
  transition: transform .22s cubic-bezier(.16,1,.3,1), color .2s ease, background .2s ease, border-color .2s ease, box-shadow .22s ease !important;
}

.vx-ibtn:hover, .vx-ibtn:focus {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-2px) scale(1.08) !important;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25), 0 0 14px rgba(168, 85, 247, 0.3) !important;
}

.vx-ibtn:active {
  transform: scale(0.92) !important;
}

.vx-ibtn.active-sky {
  color: #ffffff !important;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.38), rgba(99, 102, 241, 0.28)) !important;
  border: 1px solid rgba(192, 132, 252, 0.5) !important;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
}

.vx-ibtn.active-sky::after {
  content: "";
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #fb923c, #38bdf8);
  box-shadow: 0 0 8px #fb923c;
}

.vx-ibtn svg {
  width: 19px;
  height: 19px;
  pointer-events: none;
  transition: transform .25s ease;
}

.vx-ibtn:hover svg {
  transform: scale(1.08);
}

/* === BODY WRAPPER === */
#zokys-vx-body {
  position: relative;
  z-index: 2;
  padding: 14px 14px 18px;
  overflow: auto;
  max-height: min(72vh, 560px);
}

#zokys-vx-body::-webkit-scrollbar {
  width: 5px;
}
#zokys-vx-body::-webkit-scrollbar-track {
  background: transparent;
}
#zokys-vx-body::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.25);
  border-radius: 999px;
}
#zokys-vx-body::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.45);
}

.vx-sheet {
  animation: zkSheetIn .36s cubic-bezier(.16,1,.3,1) both !important;
}

@keyframes zkSheetIn {
  from { opacity: 0; transform: translateY(14px) scale(.97); filter: blur(4px); }
  to { opacity: 1; transform: none; filter: none; }
}

/* === TOOLS / FEATURES SCREEN === */
.zk-dev-box {
  text-align: center;
  padding: 15px 14px;
  margin-bottom: 12px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(56, 189, 248, 0.12) 100%);
  border: 1px solid rgba(192, 132, 252, 0.32);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;
}

.zk-dev-box::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  animation: zkShimmerSweep 5s infinite;
  pointer-events: none;
}

@keyframes zkShimmerSweep {
  0% { transform: translateX(0); }
  35%, 100% { transform: translateX(400%); }
}

.zk-dev-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #fb923c;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(168, 85, 247, 0.18);
  border: 1px solid rgba(168, 85, 247, 0.35);
  margin-bottom: 8px;
}

.zk-dev-badge .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px #34d399;
  animation: zkPulse 1.8s infinite;
}

.zk-dev-title {
  font-family: 'Outfit', 'Inter', sans-serif;
  font-size: 19px;
  font-weight: 900;
  letter-spacing: .12em;
  background: linear-gradient(100deg, #ffffff 0%, #cffafe 40%, #38bdf8 75%, #ffffff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: zkHoloText 6s linear infinite;
  margin: 0;
}

@keyframes zkHoloText {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

.zk-dev-sub {
  font-size: 11px;
  color: rgba(226, 232, 240, 0.65);
  margin-top: 4px;
  font-weight: 500;
}

/* Auto Approval Card */
.vx-feat-card {
  padding: 14px 16px;
  border-radius: 20px;
  margin-bottom: 12px;
  background: linear-gradient(145deg, rgba(32, 18, 62, 0.72) 0%, rgba(16, 10, 34, 0.88) 100%);
  border: 1px solid rgba(168, 85, 247, 0.3);
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.vx-aa-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.vx-aa-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.vx-aa-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(56, 189, 248, 0.15));
  border: 1px solid rgba(192, 132, 252, 0.4);
  color: #fb923c;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.3);
  flex-shrink: 0;
}

.vx-aa-meta .t {
  font-size: 13.5px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: .01em;
}

.vx-aa-meta .s {
  font-size: 10.5px;
  color: rgba(226, 232, 240, 0.6);
  margin-top: 2px;
  font-weight: 500;
}

.vx-toggle {
  position: relative;
  width: 52px;
  height: 30px;
  border-radius: 999px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: background .3s cubic-bezier(.22,1,.36,1), border-color .3s, box-shadow .3s;
  flex-shrink: 0;
}

.vx-toggle .knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffffff, #d4d4d8);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: transform .3s cubic-bezier(.22,1,.36,1), background .3s;
}

.vx-toggle.on {
  background: linear-gradient(135deg, #059669, #10b981) !important;
  border-color: rgba(52, 211, 153, 0.7) !important;
  box-shadow: 0 0 18px rgba(16, 185, 129, 0.55), inset 0 0 8px rgba(52, 211, 153, 0.4) !important;
}

.vx-toggle.on .knob {
  transform: translateX(22px);
  background: linear-gradient(145deg, #ecfdf5, #a7f3d0);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.vx-aa-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .04em;
  color: rgba(226, 232, 240, 0.5);
  transition: color .3s;
}

.vx-aa-status.on {
  color: #34d399 !important;
}

.vx-aa-status .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
}

.vx-aa-status.on .status-dot {
  background: #34d399;
  box-shadow: 0 0 10px #34d399;
  animation: zkPulse 1.8s infinite;
}

/* Feature Action Buttons (3D sculpted glass) */
.vx-fbtn {
  all: unset;
  cursor: pointer;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  width: 100% !important;
  margin-bottom: 9px !important;
  padding: 12px 14px !important;
  border-radius: 18px !important;
  box-sizing: border-box !important;
  background: linear-gradient(145deg, rgba(34, 18, 64, 0.65) 0%, rgba(16, 10, 32, 0.88) 100%) !important;
  border: 1px solid rgba(168, 85, 247, 0.25) !important;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  transform: translateY(0);
  transition: transform .22s cubic-bezier(.16,1,.3,1), box-shadow .22s ease, border-color .22s ease, background .22s ease !important;
  position: relative;
  overflow: hidden;
}

.vx-fbtn:hover {
  transform: translateY(-2.5px) scale(1.012) !important;
  border-color: rgba(192, 132, 252, 0.6) !important;
  background: linear-gradient(145deg, rgba(46, 24, 88, 0.8) 0%, rgba(22, 14, 44, 0.95) 100%) !important;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.45),
    0 0 24px rgba(168, 85, 247, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}

.vx-fbtn:active {
  transform: translateY(1px) scale(0.98) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

.vx-fbtn .fi {
  width: 40px;
  height: 40px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform .25s ease, box-shadow .25s ease;
}

.vx-fbtn:hover .fi {
  transform: scale(1.08);
}

.vx-fbtn .fi svg {
  width: 22px;
  height: 22px;
}

/* Color thematic icon badges */
.fi-wm {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.28), rgba(56, 189, 248, 0.12));
  border: 1px solid rgba(56, 189, 248, 0.45);
  color: #38bdf8;
  box-shadow: 0 0 16px rgba(56, 189, 248, 0.25);
}
.fi-cloud {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.15));
  border: 1px solid rgba(129, 140, 248, 0.45);
  color: #a5b4fc;
  box-shadow: 0 0 16px rgba(99, 102, 241, 0.25);
}
.fi-new {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.28), rgba(245, 158, 11, 0.15));
  border: 1px solid rgba(251, 113, 133, 0.45);
  color: #fda4af;
  box-shadow: 0 0 16px rgba(244, 63, 94, 0.25);
}
.fi-dl {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(217, 70, 239, 0.15));
  border: 1px solid rgba(192, 132, 252, 0.45);
  color: #cffafe;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.25);
}
.fi-app {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.28), rgba(6, 182, 212, 0.15));
  border: 1px solid rgba(52, 211, 153, 0.45);
  color: #6ee7b7;
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.25);
}

.vx-fbtn .fl {
  display: flex !important;
  flex-direction: column !important;
  gap: 3px !important;
  text-align: left !important;
  flex: 1 !important;
  min-width: 0 !important;
}

.vx-fbtn .fl-top {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 8px !important;
  width: 100% !important;
}

.vx-fbtn .fl b {
  font-size: 13px !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  letter-spacing: .01em !important;
}

.vx-fbtn .fl span {
  font-size: 11px !important;
  font-weight: 500 !important;
  color: rgba(226, 232, 240, 0.68) !important;
  line-height: 1.35 !important;
  white-space: normal !important;
  word-break: break-word !important;
}

.vx-tag {
  display: inline-flex !important;
  align-items: center !important;
  font-size: 9px !important;
  font-weight: 900 !important;
  letter-spacing: .08em !important;
  text-transform: uppercase !important;
  padding: 2px 8px !important;
  border-radius: 999px !important;
  background: rgba(168, 85, 247, 0.2) !important;
  border: 1px solid rgba(192, 132, 252, 0.45) !important;
  color: #f5f3ff !important;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.25) !important;
  flex-shrink: 0 !important;
}

.vx-fbtn .fr-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.vx-fbtn .zk-pill-tag {
  font-size: 8.5px;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(248, 250, 252, 0.8);
}

.vx-fbtn .zk-arrow-slide {
  color: rgba(255, 255, 255, 0.35);
  transition: transform .2s ease, color .2s ease;
}

.vx-fbtn:hover .zk-arrow-slide {
  transform: translateX(4px);
  color: #fb923c;
}

/* === WELCOME SCREEN === */
.zk-welcome {
  position: relative;
  padding: 10px 4px 6px;
  overflow: hidden;
  text-align: center;
}

.zk-welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .16em;
  padding: 5px 14px;
  border-radius: 999px;
  margin-bottom: 14px;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.32), rgba(185, 28, 28, 0.2));
  border: 1px solid rgba(192, 132, 252, 0.4);
  box-shadow: 0 0 20px rgba(147, 51, 234, 0.25);
  color: #cffafe;
}

.zk-welcome-badge .zk-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px #34d399;
  animation: zkPulse 1.8s infinite;
}

.zk-welcome-title {
  font-family: 'Outfit', 'Inter', sans-serif;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: .02em;
  margin-bottom: 8px;
  background: linear-gradient(110deg, #ffffff 0%, #ddd6fe 45%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 16px rgba(168, 85, 247, 0.4));
}

.zk-welcome-line {
  width: 64px;
  height: 3px;
  margin: 0 auto 14px;
  border-radius: 999px;
  background: linear-gradient(90deg, #06b6d4, #38bdf8);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.6);
}

.zk-welcome-text {
  font-size: 12px;
  line-height: 1.6;
  color: rgba(226, 232, 240, 0.75);
  margin-bottom: 18px;
  padding: 0 6px;
}

/* === 3D SOCIAL CARDS (Welcome & Social Hub) === */
.zk-welcome-hints {
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
  text-align: left !important;
  margin-bottom: 16px !important;
}

.zk-soc-card {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  padding: 12px 14px;
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(28, 16, 48, 0.75), rgba(14, 8, 28, 0.92)) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  display: flex !important;
  align-items: center !important;
  gap: 13px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
  transition: transform .26s cubic-bezier(.34,1.56,.64,1), border-color .22s ease, box-shadow .24s ease !important;
}

.zk-soc-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 10% 50%, rgba(255,255,255,0.06), transparent 60%);
  pointer-events: none;
  opacity: 0;
  transition: opacity .25s ease;
}

.zk-soc-card:hover {
  transform: translateY(-3px) scale(1.015) !important;
}

.zk-soc-card:hover::before {
  opacity: 1;
}

.zk-soc-card:active {
  transform: translateY(-1px) scale(0.99) !important;
}

/* Discord Theming */
.zk-soc-discord {
  border-color: rgba(88, 101, 242, 0.28) !important;
}
.zk-soc-discord:hover {
  border-color: rgba(88, 101, 242, 0.7) !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 24px rgba(88, 101, 242, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}

/* Telegram Theming */
.zk-soc-telegram {
  border-color: rgba(34, 158, 217, 0.28) !important;
}
.zk-soc-telegram:hover {
  border-color: rgba(34, 158, 217, 0.7) !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 24px rgba(34, 158, 217, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}

/* Instagram Theming */
.zk-soc-instagram {
  border-color: rgba(225, 48, 108, 0.28) !important;
}
.zk-soc-instagram:hover {
  border-color: rgba(225, 48, 108, 0.7) !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 24px rgba(225, 48, 108, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}

/* 3D Icon Elements with Depth, Inset Gloss & Ambient Glow */
.zk-3d-ico {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0;
  transition: transform .28s cubic-bezier(.34,1.56,.64,1) !important;
}

.zk-soc-card:hover .zk-3d-ico {
  transform: scale(1.1) rotate(-3deg) !important;
}

/* Discord 3D Badge */
.zk-3d-ico-discord {
  background: linear-gradient(145deg, #7289da 0%, #5865F2 52%, #3c45a5 100%) !important;
  border: 1px solid rgba(199, 210, 254, 0.45) !important;
  box-shadow: 0 8px 22px rgba(88, 101, 242, 0.55), inset 0 2px 3px rgba(255, 255, 255, 0.55), inset 0 -3px 4px rgba(20, 25, 90, 0.6) !important;
}

/* Telegram 3D Badge */
.zk-3d-ico-telegram {
  background: linear-gradient(145deg, #38bdf8 0%, #229ED9 52%, #0284c7 100%) !important;
  border: 1px solid rgba(186, 230, 253, 0.45) !important;
  box-shadow: 0 8px 22px rgba(34, 158, 217, 0.55), inset 0 2px 3px rgba(255, 255, 255, 0.55), inset 0 -3px 4px rgba(2, 60, 95, 0.6) !important;
}

/* Instagram 3D Badge */
.zk-3d-ico-instagram {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%) !important;
  border: 1px solid rgba(254, 205, 211, 0.45) !important;
  box-shadow: 0 8px 22px rgba(214, 36, 159, 0.55), inset 0 2px 3px rgba(255, 255, 255, 0.55), inset 0 -3px 4px rgba(70, 10, 50, 0.6) !important;
}

.zk-3d-ico svg {
  width: 22px !important;
  height: 22px !important;
  display: block !important;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45)) !important;
}

/* Text and Titles - Strict Column Layout */
.zk-soc-info {
  flex: 1;
  min-width: 0;
  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
}

.zk-soc-info b {
  display: block !important;
  font-size: 13.5px !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  line-height: 1.25 !important;
  letter-spacing: -0.01em;
}

.zk-soc-info span {
  display: block !important;
  font-size: 11px !important;
  color: rgba(226, 232, 240, 0.65) !important;
  line-height: 1.35 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* Action Tags / Pills */
.zk-soc-pill {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 5px 10px !important;
  border-radius: 999px !important;
  font-size: 10px !important;
  font-weight: 800 !important;
  letter-spacing: 0.06em !important;
  flex-shrink: 0 !important;
  transition: all .2s ease !important;
}

.zk-soc-pill-discord {
  background: rgba(88, 101, 242, 0.18) !important;
  border: 1px solid rgba(88, 101, 242, 0.45) !important;
  color: #c7d2fe !important;
}
.zk-soc-card:hover .zk-soc-pill-discord {
  background: #5865f2 !important;
  color: #ffffff !important;
  box-shadow: 0 0 14px rgba(88, 101, 242, 0.6) !important;
}

.zk-soc-pill-telegram {
  background: rgba(34, 158, 217, 0.18) !important;
  border: 1px solid rgba(34, 158, 217, 0.45) !important;
  color: #bae6fd !important;
}
.zk-soc-card:hover .zk-soc-pill-telegram {
  background: #229ed9 !important;
  color: #ffffff !important;
  box-shadow: 0 0 14px rgba(34, 158, 217, 0.6) !important;
}

.zk-soc-pill-instagram {
  background: rgba(225, 48, 108, 0.18) !important;
  border: 1px solid rgba(225, 48, 108, 0.45) !important;
  color: #fecdd3 !important;
}
.zk-soc-card:hover .zk-soc-pill-instagram {
  background: linear-gradient(135deg, #d6249f, #fd5949) !important;
  color: #ffffff !important;
  box-shadow: 0 0 14px rgba(214, 36, 159, 0.6) !important;
}

.zk-welcome-cta {
  all: unset;
  cursor: pointer;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  width: 100% !important;
  box-sizing: border-box !important;
  padding: 14px 18px !important;
  border-radius: 16px !important;
  font-size: 13px !important;
  font-weight: 800 !important;
  letter-spacing: .04em !important;
  color: #ffffff !important;
  background: linear-gradient(135deg, #ea580c 0%, #06b6d4 50%, #ec4899 100%) !important;
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
  transition: transform .2s ease, box-shadow .2s ease, filter .2s ease !important;
  position: relative;
  overflow: hidden;
}

.zk-welcome-cta:hover {
  transform: translateY(-2px) scale(1.015) !important;
  filter: brightness(1.08) !important;
  box-shadow: 0 14px 38px rgba(124, 58, 237, 0.6), 0 0 24px rgba(236, 72, 153, 0.35) !important;
}

.zk-welcome-cta:active {
  transform: translateY(1px) scale(0.98) !important;
}

/* === LICENSE SCREEN === */
.vx-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  margin-bottom: 10px;
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(32, 18, 64, 0.65), rgba(16, 10, 32, 0.85));
  border: 1px solid rgba(168, 85, 247, 0.25);
  backdrop-filter: blur(16px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: transform .22s ease, border-color .22s ease;
}

.vx-card:hover {
  transform: translateY(-2px);
  border-color: rgba(192, 132, 252, 0.45);
}

.vx-card .ic {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(168, 85, 247, 0.18);
  color: #fb923c;
  border: 1px solid rgba(168, 85, 247, 0.35);
  box-shadow: 0 0 14px rgba(168, 85, 247, 0.25);
}

.vx-card .meta {
  flex: 1;
  min-width: 0;
}

.vx-card .lab {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: .12em;
  color: rgba(226, 232, 240, 0.55);
  text-transform: uppercase;
}

.vx-card .val {
  font-size: 13px;
  font-weight: 750;
  margin-top: 3px;
  word-break: break-all;
  color: #f8fafc;
}

.vx-copy {
  all: unset;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 13px;
  border-radius: 11px;
  font-size: 11px;
  font-weight: 800;
  color: #ffffff;
  background: linear-gradient(135deg, #ea580c, #06b6d4);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
  transition: transform .2s ease, filter .2s ease;
}

.vx-copy:hover {
  transform: translateY(-1px) scale(1.05);
  filter: brightness(1.1);
}

.vx-copy:active {
  transform: scale(0.95);
}

/* Quota / Free Card */
.vx-free {
  padding: 15px 16px;
  border-radius: 20px;
  margin-bottom: 10px;
  background: linear-gradient(145deg, rgba(34, 18, 68, 0.75), rgba(16, 10, 34, 0.9));
  border: 1px solid rgba(168, 85, 247, 0.32);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vx-free .fr-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vx-free .fr-lab {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.6);
}

.vx-free .fr-count {
  font-family: 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
}

.vx-free .fr-track {
  height: 7px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.vx-free .fr-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #38bdf8, #06b6d4, #ec4899);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.6);
  transition: width .45s ease;
}

.vx-free .fr-hint {
  font-size: 11px;
  font-weight: 600;
  color: #34d399;
}

.vx-actions {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 10px !important;
  margin-top: 10px !important;
}

.vx-btn.ghost {
  all: unset !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  padding: 12px 14px !important;
  border-radius: 16px !important;
  box-sizing: border-box !important;
  font-size: 12px !important;
  font-weight: 750 !important;
  color: #f1f5f9 !important;
  background: linear-gradient(145deg, rgba(34, 18, 64, 0.65) 0%, rgba(16, 10, 32, 0.88) 100%) !important;
  border: 1px solid rgba(168, 85, 247, 0.3) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
  transition: transform .2s ease, border-color .2s ease, background .2s ease, box-shadow .2s ease !important;
  min-height: 46px !important;
}

.vx-btn.ghost:hover {
  transform: translateY(-2px) scale(1.02) !important;
  border-color: rgba(192, 132, 252, 0.6) !important;
  background: linear-gradient(145deg, rgba(46, 24, 88, 0.8) 0%, rgba(22, 14, 44, 0.95) 100%) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 18px rgba(168, 85, 247, 0.3) !important;
  color: #ffffff !important;
}

.vx-btn.ghost:active {
  transform: translateY(1px) scale(0.98) !important;
}

.vx-btn svg, .vx-actions button svg, .vx-copy svg {
  width: 18px !important;
  height: 18px !important;
  min-width: 18px !important;
  max-width: 18px !important;
  display: inline-block !important;
  flex-shrink: 0 !important;
  vertical-align: middle !important;
}

.vx-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(192, 132, 252, 0.45);
}

/* === CHAT WORKSTATION === */
.zk-lb {
  padding: 6px 2px 4px;
}

.zk-lb-title {
  font-family: 'Outfit', 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: .01em;
  color: #ffffff;
  margin: 0 0 4px;
}

.zk-lb-title .heart {
  color: #f43f5e;
  filter: drop-shadow(0 0 10px rgba(244, 63, 94, 0.7));
  display: inline-block;
  animation: zkHeartBeat 1.4s ease-in-out infinite;
}

@keyframes zkHeartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.zk-lb-desc {
  font-size: 11.5px;
  line-height: 1.55;
  color: rgba(226, 232, 240, 0.65);
  margin: 0 0 14px;
}

.zk-lb-box {
  border-radius: 20px;
  background: linear-gradient(160deg, rgba(32, 16, 64, 0.8), rgba(12, 8, 24, 0.94));
  border: 1px solid rgba(192, 132, 252, 0.32);
  padding: 12px 14px 10px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.zk-lb-input {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  color: #f8fafc;
  font-size: 13.5px;
  line-height: 1.5;
  min-height: 64px;
  padding: 4px 2px;
  font-family: inherit;
}

.zk-lb-input::placeholder {
  color: rgba(192, 132, 252, 0.4);
}

.zk-lb-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.zk-lb-plus, .zk-lb-send, .zk-lb-stop {
  all: unset !important;
  cursor: pointer !important;
  width: 38px !important;
  height: 38px !important;
  min-width: 38px !important;
  border-radius: 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  transition: transform .2s ease, box-shadow .2s ease, filter .2s ease !important;
  flex-shrink: 0 !important;
}

.zk-lb-plus svg, .zk-lb-send svg, .zk-lb-stop svg {
  width: 18px !important;
  height: 18px !important;
  min-width: 18px !important;
  max-width: 18px !important;
  display: block !important;
  flex-shrink: 0 !important;
}

.zk-lb-plus {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e2e8f0;
}

.zk-lb-plus:hover {
  transform: translateY(-1px) scale(1.06);
  background: rgba(168, 85, 247, 0.2);
  border-color: rgba(192, 132, 252, 0.45);
  color: #ffffff;
}

.zk-lb-capsule {
  position: relative;
}

.zk-lb-cap-btn {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(168, 85, 247, 0.32);
  background: rgba(168, 85, 247, 0.15);
  color: #cffafe;
  font-size: 12px;
  font-weight: 750;
  box-shadow: 0 0 14px rgba(168, 85, 247, 0.2);
  transition: transform .2s ease, border-color .2s ease;
}

.zk-lb-cap-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(192, 132, 252, 0.55);
}

.zk-lb-menu {
  position: absolute;
  left: 0;
  bottom: 40px;
  min-width: 120px;
  border-radius: 14px;
  padding: 5px;
  background: rgba(18, 12, 34, 0.96);
  border: 1px solid rgba(192, 132, 252, 0.35);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(24px);
  z-index: 10;
}

.zk-lb-menu button {
  all: unset;
  display: block;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  color: #e2e8f0;
  padding: 8px 12px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
}

.zk-lb-menu button:hover {
  background: rgba(168, 85, 247, 0.25);
  color: #ffffff;
}

.zk-lb-spacer {
  flex: 1;
}

.zk-lb-send {
  background: linear-gradient(135deg, #ea580c, #06b6d4 50%, #ec4899);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
}

.zk-lb-send:hover {
  transform: translateY(-2px) scale(1.08);
  filter: brightness(1.1);
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.65), 0 0 18px rgba(236, 72, 153, 0.4);
}

.zk-lb-stop {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
  animation: zkPulse 1.2s infinite;
}

.zk-lb-hist {
  margin-top: 10px;
  max-height: 80px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.zk-lb-h {
  font-size: 10.5px;
  padding: 6px 8px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(226, 232, 240, 0.65);
}

.zk-lb-h.ok {
  border-color: rgba(52, 211, 153, 0.3);
  color: #a7f3d0;
}

.zk-lb-h.bad {
  border-color: rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

/* === LANGUAGE SCREEN === */
.vx-lang {
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
  padding: 4px 0 !important;
}

.vx-lang button {
  all: unset !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100% !important;
  box-sizing: border-box !important;
  padding: 12px 14px !important;
  border-radius: 16px !important;
  background: linear-gradient(145deg, rgba(30, 16, 56, 0.65), rgba(15, 10, 30, 0.85)) !important;
  border: 1px solid rgba(168, 85, 247, 0.25) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
  transition: transform .2s ease, border-color .2s ease, background .2s ease, box-shadow .2s ease !important;
}

.vx-lang button:hover {
  transform: translateY(-2px) scale(1.01) !important;
  border-color: rgba(192, 132, 252, 0.55) !important;
  background: rgba(168, 85, 247, 0.2) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), 0 0 16px rgba(168, 85, 247, 0.25) !important;
}

.vx-lang button.active {
  border-color: rgba(56, 189, 248, 0.6) !important;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.32), rgba(56, 189, 248, 0.18)) !important;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}

.vx-lang-left {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
}

.vx-lang-code {
  width: 36px !important;
  height: 36px !important;
  border-radius: 11px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 12px !important;
  font-weight: 900 !important;
  letter-spacing: .05em !important;
  color: #fb923c !important;
  background: rgba(168, 85, 247, 0.18) !important;
  border: 1px solid rgba(168, 85, 247, 0.35) !important;
  flex-shrink: 0 !important;
}

.vx-lang button.active .vx-lang-code {
  color: #38bdf8 !important;
  background: rgba(56, 189, 248, 0.2) !important;
  border-color: rgba(56, 189, 248, 0.45) !important;
}

.vx-lang-text {
  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
  text-align: left !important;
}

.vx-lang-text b {
  font-size: 13.5px !important;
  font-weight: 800 !important;
  color: #ffffff !important;
}

.vx-lang-text span {
  font-size: 10.5px !important;
  color: rgba(226, 232, 240, 0.55) !important;
}

.vx-lang-right {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.vx-lang-pill {
  font-size: 9.5px !important;
  font-weight: 800 !important;
  letter-spacing: .08em !important;
  text-transform: uppercase !important;
  padding: 3px 8px !important;
  border-radius: 999px !important;
  background: rgba(56, 189, 248, 0.18) !important;
  border: 1px solid rgba(56, 189, 248, 0.4) !important;
  color: #38bdf8 !important;
}

.vx-lang-check {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: #38bdf8 !important;
}

.vx-lang-check svg {
  width: 18px !important;
  height: 18px !important;
}

/* === SHOP / SUBSCRIPTION SCREEN === */
.zk-shop-head {
  padding: 4px 4px 14px;
  text-align: center;
}

.zk-shop-title {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: .06em;
  background: linear-gradient(135deg, #ffffff, #fb923c 40%, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.zk-shop-sub {
  font-size: 11px;
  color: rgba(226, 232, 240, 0.6);
  margin-top: 4px;
}

.zk-card {
  position: relative;
  padding: 16px 16px 14px;
  border-radius: 20px;
  margin-bottom: 12px;
  background: linear-gradient(145deg, rgba(34, 18, 68, 0.75), rgba(16, 10, 34, 0.92));
  border: 1px solid rgba(168, 85, 247, 0.28);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
  overflow: hidden;
}

.zk-card:hover {
  transform: translateY(-3px) scale(1.015);
  border-color: rgba(192, 132, 252, 0.55);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), 0 0 28px rgba(168, 85, 247, 0.35);
}

.zk-card.featured {
  border-color: rgba(192, 132, 252, 0.55);
  background: linear-gradient(145deg, rgba(46, 22, 92, 0.85), rgba(20, 12, 42, 0.95));
  box-shadow: 0 16px 45px rgba(126, 34, 206, 0.4), 0 0 35px rgba(168, 85, 247, 0.35);
}

.zk-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.zk-tag {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .14em;
  padding: 4px 9px;
  border-radius: 999px;
  background: rgba(168, 85, 247, 0.22);
  color: #cffafe;
  border: 1px solid rgba(168, 85, 247, 0.38);
}

.zk-hot {
  font-size: 9px;
  font-weight: 900;
  padding: 3px 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, #f43f5e, #ec4899);
  color: #ffffff;
  box-shadow: 0 0 12px rgba(244, 63, 94, 0.5);
}

.zk-price {
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.1;
  background: linear-gradient(120deg, #ffffff, #cffafe 40%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.zk-dur {
  font-size: 11px;
  color: rgba(226, 232, 240, 0.6);
  margin: 2px 0 12px;
}

.zk-feats {
  list-style: none;
  margin: 0 0 14px;
  padding: 0;
}

.zk-feats li {
  font-size: 11.5px;
  color: rgba(226, 232, 240, 0.8);
  padding: 3px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.zk-feats li svg {
  color: #34d399;
  flex-shrink: 0;
}

.zk-buy {
  all: unset;
  box-sizing: border-box;
  display: block;
  width: 100%;
  text-align: center;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 12.5px;
  font-weight: 800;
  color: #ffffff;
  background: linear-gradient(135deg, #ea580c, #06b6d4 50%, #ec4899);
  box-shadow: 0 8px 22px rgba(124, 58, 237, 0.4);
  transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
}

.zk-buy:hover {
  transform: translateY(-2px);
  filter: brightness(1.08);
  box-shadow: 0 12px 30px rgba(124, 58, 237, 0.6), 0 0 20px rgba(236, 72, 153, 0.35);
}

/* === TOAST NOTIFICATION === */
.vx-toast {
  pointer-events: none;
  position: fixed;
  left: 50%;
  bottom: 95px;
  transform: translateX(-50%) translateY(14px) scale(.95);
  padding: 11px 18px;
  border-radius: 18px;
  font-size: 12.5px;
  font-weight: 700;
  color: #ffffff;
  background: rgba(14, 10, 28, 0.88);
  border: 1px solid rgba(192, 132, 252, 0.45);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.65), 0 0 25px rgba(168, 85, 247, 0.35);
  opacity: 0;
  transition: opacity .25s ease, transform .3s cubic-bezier(.16,1,.3,1);
  z-index: 2147483647;
  display: flex;
  align-items: center;
  gap: 8px;
}

.vx-toast.show {
  opacity: 1 !important;
  transform: translateX(-50%) translateY(0) scale(1) !important;
}

@keyframes zkPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.55; transform: scale(1.18); }
}

@media (prefers-reduced-motion: reduce) {
  #zokys-vx-root *, #zokys-vx-root *::before, #zokys-vx-root *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
`;
  }

  function svg(n) {
    const m = {
      // Iconsax Global / Language
      lang: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12H21.5" opacity="0.45"/><path d="M12 2.5C14.5 5.8 15.8 8.8 15.8 12C15.8 15.2 14.5 18.2 12 21.5C9.5 18.2 8.2 15.2 8.2 12C8.2 8.8 9.5 5.8 12 2.5Z"/></svg>',
      global: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12H21.5" opacity="0.45"/><path d="M12 2.5C14.5 5.8 15.8 8.8 15.8 12C15.8 15.2 14.5 18.2 12 21.5C9.5 18.2 8.2 15.2 8.2 12C8.2 8.8 9.5 5.8 12 2.5Z"/></svg>',

      // Iconsax 3D Layers / Category (Features / Tools)
      features: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 8.5L12 3.5L21.5 8.5L12 13.5L2.5 8.5Z"/><path d="M2.5 12.5L12 17.5L21.5 12.5" opacity="0.6"/><path d="M2.5 16.5L12 21.5L21.5 16.5" opacity="0.35"/></svg>',
      layer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 8.5L12 3.5L21.5 8.5L12 13.5L2.5 8.5Z"/><path d="M2.5 12.5L12 17.5L21.5 12.5" opacity="0.6"/><path d="M2.5 16.5L12 21.5L21.5 16.5" opacity="0.35"/></svg>',

      // Iconsax Message / Chat
      chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 19H8C4 19 2 17.5 2 13V8C2 4 4 2.5 8 2.5H16C20 2.5 22 4 22 8V13C22 17.5 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.11 19.15 8.81 19 8.5 19Z"/><path d="M7 8.5H17" opacity="0.75"/><path d="M7 13.5H13" opacity="0.5"/></svg>',

      // Iconsax Key
      key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8.5" cy="15.5" r="4.5"/><circle cx="8.5" cy="15.5" r="1.8" opacity="0.5"/><path d="M11.7 12.3L20.5 3.5M16 8L18.5 10.5M18.5 5.5L21 8"/></svg>',
      keySquare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="2.5" width="19" height="19" rx="6"/><circle cx="9.5" cy="14.5" r="3.2" opacity="0.6"/><path d="M11.8 12.2L17.5 6.5M15.5 8.5L17.5 10.5"/></svg>',
      keyCard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="2.5" width="19" height="19" rx="6"/><circle cx="9.5" cy="14.5" r="3.2" opacity="0.6"/><path d="M11.8 12.2L17.5 6.5M15.5 8.5L17.5 10.5"/></svg>',

      // Iconsax Arrow-Up-2 (Chevron)
      chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15L12 9L6 15"/></svg>',

      // Iconsax Flash (Auto Approval)
      flash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.5L4.5 13.5H12L11 21.5L19.5 10.5H12L13 2.5Z"/><path d="M8.5 13.5L7 16" opacity="0.45"/></svg>',

      // Iconsax Magicpen (Watermark Remove)
      magicpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 20.5L13 11M9.5 7.5L13 11M14.5 6L18 9.5L20.2 7.3C21.3 6.2 21.3 4.4 20.2 3.3C19.1 2.2 17.3 2.2 16.2 3.3L14.5 6Z"/><path d="M18.5 15.5V19.5M20.5 17.5H16.5" opacity="0.5"/><path d="M6 3.5V6.5M7.5 5H4.5" opacity="0.5"/><path d="M7 21L3.5 20.5L3 17L6.5 12.5L11.5 17.5L7 21Z" opacity="0.25" fill="currentColor"/></svg>',

      // Iconsax Cloud Connection (Enable Cloud)
      cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 17C4.5 17 2.5 14.7 2.5 11.8C2.5 9.2 4.5 7.1 7.1 7.1C7.4 7.1 7.7 7.1 8 7.2C8.9 4.8 11.2 3.2 13.9 3.2C17.3 3.2 20.2 5.8 20.7 9.2C21.4 9.9 21.8 10.8 21.8 12C21.8 14.8 19.6 17 16.8 17"/><path d="M12 12V18M9.5 15.5L12 18L14.5 15.5" opacity="0.75"/><circle cx="12" cy="21" r="1" fill="currentColor" opacity="0.6"/></svg>',

      // Iconsax Add Circle (Create New Project)
      add: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M8.5 12H15.5"/><path d="M12 8.5V15.5"/><path d="M17 7L18.5 5.5M5.5 18.5L7 17" opacity="0.45"/></svg>',

      // Iconsax Document Download (Download Full Source)
      download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11L12 14L15 11M12 14V3.5"/><path d="M20 12V17C20 19.8 18.2 21.5 15 21.5H9C5.8 21.5 4 19.8 4 17V12" opacity="0.65"/><path d="M8.5 18H15.5" opacity="0.4"/></svg>',

      // Iconsax Mobile (Convert Web to App)
      mobile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5.5" y="2.5" width="13" height="19" rx="4.5"/><path d="M10.5 18H13.5" opacity="0.5"/><circle cx="12" cy="6" r="0.75" fill="currentColor" opacity="0.5"/><path d="M2 9.5C1 11 1 13 2 14.5M22 9.5C23 11 23 13 22 14.5" opacity="0.45"/></svg>',

      // Iconsax Timer-1 (Time Remaining)
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8.5"/><path d="M12 9V13L15 15"/><path d="M10 2.5H14" opacity="0.5"/></svg>',

      // Iconsax Refresh-2 (Project Sync)
      sync: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7V3M21 3H17M21 3L16.5 7.5C14.8 5.5 12.5 4.5 10 4.5C5.8 4.5 2.5 7.8 2.5 12"/><path d="M3 17V21M3 21H7M3 21L7.5 16.5C9.2 18.5 11.5 19.5 14 19.5C18.2 19.5 21.5 16.2 21.5 12" opacity="0.6"/></svg>',

      // Iconsax Shield Security / Status
      status: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5L4 6V11.5C4 16.5 7.5 20.8 12 22C16.5 20.8 20 16.5 20 11.5V6L12 2.5Z"/><path d="M9 12L11 14L15 10" opacity="0.75"/></svg>',
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5L4 6V11.5C4 16.5 7.5 20.8 12 22C16.5 20.8 20 16.5 20 11.5V6L12 2.5Z"/><path d="M9 12L11 14L15 10" opacity="0.75"/></svg>',

      // Iconsax Copy
      copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8.5" y="8.5" width="11" height="11" rx="3.5"/><path d="M4.5 15.5V6.5C4.5 5.4 5.4 4.5 6.5 4.5H15.5" opacity="0.5"/></svg>',

      // Iconsax Shopping Bag
      shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8H20.5L19.2 20.5C19.1 21.3 18.4 22 17.5 22H6.5C5.6 22 4.9 21.3 4.8 20.5L3.5 8Z"/><path d="M8.5 11V6C8.5 4.1 9.9 2.5 12 2.5C14.1 2.5 15.5 4.1 15.5 6V11" opacity="0.6"/></svg>',

      // Iconsax Repeat / Switch
      repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 17H4C2.9 17 2 16.1 2 15V13M7 7H20C21.1 7 22 7.9 22 9V11"/><path d="M14 14L17 17L14 20M10 10L7 7L10 4"/></svg>',

      // Iconsax User Edit
      userEdit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="7" r="4"/><path d="M2.5 20C2.5 16.5 5.5 14.5 10 14.5C11.5 14.5 12.8 14.8 14 15.4" opacity="0.6"/><path d="M16 19.5L21.5 14M21.5 19.5L16 14" opacity="0.8"/></svg>',

      // Iconsax Logout
      logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12H3.5M3.5 12L7.5 8M3.5 12L7.5 16"/><path d="M10 4H17C18.7 4 20 5.3 20 7V17C20 18.7 18.7 20 17 20H10" opacity="0.5"/></svg>',

      // Iconsax Paperclip
      paperclip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.4 12.6L14.8 5.2C16.4 3.6 19 3.6 20.6 5.2C22.2 6.8 22.2 9.4 20.6 11L12.2 19.4C11.1 20.5 9.3 20.5 8.2 19.4C7.1 18.3 7.1 16.5 8.2 15.4L15.6 8C16.1 7.5 17 7.5 17.5 8C18 8.5 18 9.4 17.5 9.9L10.6 16.8"/></svg>',

      // Iconsax Send
      send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V4M12 4L5.5 10.5M12 4L18.5 10.5"/></svg>',

      // Iconsax Stop Circle
      stop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><rect x="8.5" y="8.5" width="7" height="7" rx="1.5" fill="currentColor"/></svg>',

      // Iconsax Tick Circle
      tick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M7.5 12L10.5 15L16.5 9"/></svg>',

      // Iconsax CPU Setting
      cpuSetting: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5.5" y="5.5" width="13" height="13" rx="3.5"/><circle cx="12" cy="12" r="2.5" opacity="0.5"/><path d="M9 2.5V5.5M15 2.5V5.5M9 18.5V21.5M15 18.5V21.5M2.5 9H5.5M2.5 15H5.5M18.5 9H21.5M18.5 15H21.5" opacity="0.6"/></svg>',

      // Iconsax People / Community
      people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20C18 17.5 15.5 16 12 16C8.5 16 6 17.5 6 20"/><circle cx="12" cy="9" r="4"/><path d="M21 19C21 17.2 19.5 16 17.5 15.5M18 6.5C19.2 7 20 8.2 20 9.5C20 10.8 19.2 12 18 12.5" opacity="0.5"/></svg>',

      // Iconsax Arrow Right
      arrowRight: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12H19M13 6L19 12L13 18"/></svg>',

      // 3D Social Icons
      discord: '<svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>',
      telegram: '<svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>',
      instagram: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="6" ry="6"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1" fill="#ffffff"/></svg>',

      // Legacy fallback mapping
      social: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20C18 17.5 15.5 16 12 16C8.5 16 6 17.5 6 20"/><circle cx="12" cy="9" r="4"/><path d="M21 19C21 17.2 19.5 16 17.5 15.5M18 6.5C19.2 7 20 8.2 20 9.5C20 10.8 19.2 12 18 12.5" opacity="0.5"/></svg>',
      pulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5L4 6V11.5C4 16.5 7.5 20.8 12 22C16.5 20.8 20 16.5 20 11.5V6L12 2.5Z"/><path d="M9 12L11 14L15 10" opacity="0.75"/></svg>'
    };
    return m[n] || "";
  }

  function toast(msg) {
    let el = document.getElementById("zokys-vx-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "zokys-vx-toast";
      el.className = "vx-toast";
      document.documentElement.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function formatLeft(ms) {
    if (!ms || ms <= 0) return "0:00";
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    if (d > 0) return d + "d " + h + "h";
    if (h > 0) return h + ":" + String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
    return m + ":" + String(sec).padStart(2, "0");
  }

  function detectProjectSync() {
    try {
      const href = location.href || "";
      const m = href.match(/\/projects\/([0-9a-fA-F-]{8,})/i);
      if (m && m[1]) return { synced: true };
      const el = document.querySelector("[data-project-id],[data-projectid]");
      if (el) return { synced: true };
      return { synced: false };
    } catch (_) {
      return { synced: false };
    }
  }

  function getLicense(cb) {
    try {
      chrome.runtime.sendMessage({ type: "TRIVIS_STATUS" }, function (r) {
        if (chrome.runtime.lastError || !r) {
          chrome.storage.local.get(["trivis_lic_ok", "trivis_license_key", "trivis_lic_expires"], function (s) {
            const ok = !!(s && (s.trivis_lic_ok === true || s.trivis_lic_ok === "1") && s.trivis_license_key);
            let status = t("none"), left = "—";
            if (ok) {
              status = t("valid");
              if (s.trivis_lic_expires) {
                const exp = Date.parse(s.trivis_lic_expires);
                if (exp && Date.now() > exp) status = t("expired");
                else if (exp) left = formatLeft(exp - Date.now());
              }
            }
            cb({ ok, key: s && s.trivis_license_key, status, left });
          });
          return;
        }
        let status = r.ok ? t("valid") : t("none"), left = "—";
        if (r.ok && r.expires_at) {
          const exp = Date.parse(r.expires_at);
          if (exp && Date.now() > exp) status = t("expired");
          else if (exp) left = formatLeft(exp - Date.now());
        }
        cb({ ok: !!r.ok, key: r.key, status, left });
      });
    } catch (_) {
      cb({ ok: false, key: null, status: t("none"), left: "—" });
    }
  }

  function setBody(html) {
    bodyEl.innerHTML = '<div class="vx-sheet">' + html + "</div>";
  }

  function expand(on) {
    const chev = panel.querySelector('[data-act="chev"]');
    const want = !!on;
    const isMin = panel.classList.contains("minimized");
    // Sync flag with real class (fixes stuck expand)
    if (isMin) expanded = false;
    else if (!panel.classList.contains("is-collapsing")) expanded = true;

    if (want && !isMin && expanded && !panel.classList.contains("is-collapsing")) {
      if (chev) chev.style.transform = "rotate(0deg)";
      try {
        bodyEl.style.display = "";
      } catch (_) {}
      return;
    }
    if (!want && isMin) {
      if (chev) chev.style.transform = "rotate(180deg)";
      return;
    }

    if (want) {
      panel.classList.remove("is-collapsing");
      try {
        panel.classList.remove("light");
        root.classList.remove("light");
      } catch (_e) {}
      panel.classList.add("is-expanding");
      /* FOXGEN_FAN_EXPAND */
      setTimeout(function () { try { panel.classList.remove("is-expanding"); } catch (_) {} }, 750);
      panel.classList.remove("minimized");
      expanded = true;
      try {
        bodyEl.style.display = "";
        bodyEl.style.visibility = "visible";
        bodyEl.style.opacity = "1";
        bodyEl.style.pointerEvents = "auto";
      } catch (_) {}
      if (chev) chev.style.transform = "rotate(0deg)";
      clearTimeout(panel._expandT);
      panel._expandT = setTimeout(function () {
        panel.classList.remove("is-expanding");
      }, 800);
    } else {
      panel.classList.remove("is-expanding");
      panel.classList.add("is-collapsing");
      /* FOXGEN_FAN_COLLAPSE */
      if (chev) chev.style.transform = "rotate(180deg)";
      clearTimeout(panel._expandT);
      panel._expandT = setTimeout(function () {
        panel.classList.add("minimized");
        panel.classList.remove("is-collapsing");
        expanded = false;
      }, 240);
    }
  }


  let autoApprove = false;
  let autoApproveObs = null;

  function sendToLovableChat(promptText) {
    try {
      window.postMessage({ type: "TRIVIS_SEND_CHAT", text: String(promptText || "") }, "*");
    } catch (e) {
      console.warn("[FoxGEN Pro] send chat", e);
    }
    toast("Prompt sent → Lovable");
  }

    function startAutoApprove() {
    stopAutoApprove();
    function isOurUi(el) {
      return !!(el.closest && (el.closest("#zokys-vx-root") || el.closest("#zokys-pro-gate") || el.closest("#zokys-limit-overlay")));
    }
    function labelOf(b) {
      return ((b.getAttribute("aria-label") || "") + " " + (b.textContent || "") + " " + (b.getAttribute("title") || "")).replace(/\s+/g, " ").trim();
    }
    function tryAutoApprove() {
      if (!autoApprove) return;
      try {
        // 1) Prefer selecting first radio / option in approval cards
        const radios = document.querySelectorAll('input[type="radio"]');
        let radioGroupDone = {};
        radios.forEach(function (r) {
          if (isOurUi(r) || r.disabled) return;
          const name = r.name || r.id || "x";
          if (radioGroupDone[name]) return;
          if (!r.checked) {
            try {
              r.click();
              r.checked = true;
              r.dispatchEvent(new Event("change", { bubbles: true }));
              r.dispatchEvent(new Event("input", { bubbles: true }));
            } catch (_) {}
          }
          radioGroupDone[name] = true;
        });

        // 2) Click primary action buttons
        const buttons = document.querySelectorAll("button, [role='button'], a");
        let clicked = false;
        buttons.forEach(function (b) {
          if (clicked || b.dataset.zokysAa === "1" || b.disabled) return;
          if (isOurUi(b)) return;
          const t = labelOf(b);
          if (!t || t.length > 64) return;
          // Skip "Skip" / cancel / dismiss
          if (/^(skip|cancel|dismiss|close|no|reject)$/i.test(t)) return;
          if (/\b(skip|cancel|dismiss)\b/i.test(t) && !/\bsubmit\b/i.test(t)) return;
          const isPrimary =
            /^(submit|approve|allow|accept|confirm|continue|yes|run|execute|apply|ok|done)$/i.test(t) ||
            /\b(approve|allow changes|accept|confirm|run tool|submit)\b/i.test(t);
          if (!isPrimary) return;
          b.dataset.zokysAa = "1";
          clicked = true;
          setTimeout(function () {
            try { b.click(); } catch (_) {}
          }, 350);
        });
      } catch (_) {}
    }
    autoApproveObs = new MutationObserver(function () {
      tryAutoApprove();
    });
    try {
      autoApproveObs.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
    } catch (_) {}
    // also poll — Lovable sometimes updates without useful mutations
    try {
      autoApproveObs._poll = setInterval(tryAutoApprove, 700);
    } catch (_) {}
    tryAutoApprove();
  }
  function stopAutoApprove() {
    if (autoApproveObs) {
      try { if (autoApproveObs._poll) clearInterval(autoApproveObs._poll); } catch (_) {}
      try { autoApproveObs.disconnect(); } catch (_) {}
      autoApproveObs = null;
    }
  }

  function downloadProjectSource() {
    toast("Scanning project…");
    try {
      window.postMessage({ type: "TRIVIS_TRY_DOWNLOAD_SOURCE" }, "*");
    } catch (_) {}
    setTimeout(function () {
      sendToLovableChat(
        "Please export and provide a complete downloadable ZIP of this project's full source code, " +
        "including all files and folders exactly as in the project (frontend, backend, config, assets). " +
        "If a Download ZIP button exists, point me to it; otherwise generate the full file tree and contents for archive."
      );
    }, 1200);
  }

  const PROMPT_WATERMARK =
    "Remove every Lovable watermark, badge, 'Edit with Lovable' link, lovable.dev branding, and any " +
    "Lovable attribution from this project — UI, HTML, footer, meta tags, and published site. " +
    "Search the whole codebase for lovable / 'edit with lovable' / badge components and delete them. " +
    "Ensure the live preview and production build show zero Lovable branding. Keep all other design intact.";

  const PROMPT_CLOUD =
    "Enable Supabase cloud for this project properly end-to-end: create/connect Supabase project, " +
    "configure env keys securely (never expose service role on client), set up auth if needed, " +
    "wire database tables the app requires, and verify cloud connection works in preview. " +
    "Document any required dashboard steps briefly in a comment only if unavoidable.";

  const PROMPT_SECURITY =
    "Perform a full security audit and harden this project completely.\\n\\n" +
    "1) Scan every file for weak points: XSS, CSRF, open redirects, insecure storage, " +
    "missing auth checks, overly permissive CORS, prototype pollution, dependency risks.\\n" +
    "2) Move any API keys, tokens, endpoint secrets, and private URLs off the frontend into " +
    "backend/edge functions / Supabase secrets / env — never ship secrets in client bundles.\\n" +
    "3) Fix each issue with production-safe code; do not leave TODOs.\\n" +
    "4) Tighten input validation, auth guards, RLS policies if Supabase is used, and error handling " +
    "so crashes and data leaks cannot happen.\\n" +
    "5) After fixes, summarize what was vulnerable and what you changed. Goal: no easy hacks, no secret leaks, stable app.";

  function showFeatures() {
    expand(true);
    try {
      chrome.storage.local.get(["zokys_auto_approve"], function (s) {
        autoApprove = !!s.zokys_auto_approve;
        renderFeatures();
      });
    } catch (_) {
      renderFeatures();
    }
  }

  let selectedMethod = "1";

  
  
  function synclovaXCredits(lic) {
    try {
      var n = 0;
      if (lic && typeof lic.credits === "number") n = lic.credits;
      else if (lic && lic.license && typeof lic.license.credits === "number") n = lic.license.credits;
      else {
        try {
          n = parseInt(localStorage.getItem("zokys_ext_credits") || "20", 10); if (isNaN(n)) n = 20; if (n > 20 && !lic) n = 20;
        } catch (_) { n = 100; }
      }
      localStorage.setItem("zokys_ext_credits", String(n));
      localStorage.setItem("zokys_ext_credits", String(n));
      try { chrome.storage.local.set({ zokys_ext_credits: n }); } catch (_) {}
      return n;
    } catch (_) { return 0; }
  }


  function showAccountSwitchModal() {
    var existing = document.getElementById("zokys-switch-modal");
    if (existing) existing.remove();
    try {
      if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide();
      var stuck = document.getElementById("zokys-rocket-overlay");
      if (stuck) stuck.remove();
      hideSwitchShield();
    } catch (_) {}
    var ov = document.createElement("div");
    ov.id = "zokys-switch-modal";
    ov.innerHTML = [
      '<style>',
      '.zk-sw-back{width:100%;margin:10px 0 0;padding:12px;border-radius:14px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#cffafe;font-weight:800;font-size:12px;cursor:pointer;backdrop-filter:blur(12px);}#zokys-switch-modal{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;',
      'padding:20px;font-family:Inter,system-ui,-apple-system,sans-serif;',
      'background:rgba(4,2,12,.55);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);}',
      '#zokys-switch-modal .zk-sw-card{position:relative;width:min(420px,100%);overflow:hidden;border-radius:24px;',
      'background:linear-gradient(160deg,rgba(28,16,48,.97),rgba(18,10,32,.98));',
      'border:1px solid rgba(6,182,212,.4);box-shadow:0 28px 80px rgba(76,29,149,.45),0 0 0 1px rgba(255,255,255,.04) inset;',
      'padding:26px 22px 22px;color:#f5f3ff;}',
      '#zokys-switch-modal .zk-sw-orb{position:absolute;border-radius:50%;filter:blur(40px);pointer-events:none;}',
      '#zokys-switch-modal .zk-sw-orb.a{width:160px;height:160px;top:-50px;right:-40px;background:rgba(234,88,12,.4);}',
      '#zokys-switch-modal .zk-sw-orb.b{width:120px;height:120px;bottom:-30px;left:-30px;background:rgba(185,28,28,.28);}',
      '#zokys-switch-modal .zk-sw-badge{position:relative;display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:900;',
      'letter-spacing:.14em;padding:5px 12px;border-radius:999px;margin-bottom:12px;',
      'background:linear-gradient(135deg,rgba(234,88,12,.3),rgba(185,28,28,.15));border:1px solid rgba(125,211,252,.35);}',
      '#zokys-switch-modal .zk-sw-badge .z{color:#67e8f9}#zokys-switch-modal .zk-sw-badge .x{color:rgba(255,255,255,.35)}',
      '#zokys-switch-modal .zk-sw-badge .t{color:#a5f3fc}',
      '#zokys-switch-modal h3{position:relative;margin:0 0 6px;font-size:20px;font-weight:900;letter-spacing:.02em;',
      'background:linear-gradient(100deg,#fff,#ddd6fe,#fecaca);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}',
      '#zokys-switch-modal .zk-sw-sub{position:relative;font-size:12px;line-height:1.55;color:rgba(226,232,240,.7);margin-bottom:16px;}',
      '#zokys-switch-modal label{position:relative;display:block;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;',
      'color:#a78bfa;margin-bottom:6px;}',
      '#zokys-switch-modal .zk-sw-opt{font-weight:600;color:rgba(167,139,250,.7);text-transform:none;letter-spacing:0;}',
      '#zokys-switch-modal input{position:relative;width:100%;box-sizing:border-box;padding:13px 14px;border-radius:14px;',
      'border:1px solid rgba(6,182,212,.35);background:rgba(10,6,20,.85);color:#fff;font-size:13px;outline:none;',
      'margin-bottom:8px;transition:border-color .2s,box-shadow .2s;}',
      '#zokys-switch-modal input:focus{border-color:rgba(251,146,60,.7);box-shadow:0 0 0 3px rgba(234,88,12,.2);}',
      '#zokys-switch-modal .zk-sw-hint{position:relative;font-size:11px;color:rgba(148,163,184,.75);margin-bottom:12px;line-height:1.4;}',
      '#zokys-switch-modal .zk-sw-stats{position:relative;display:flex;gap:8px;margin-bottom:14px;}',
      '#zokys-switch-modal .zk-sw-pill{flex:1;padding:10px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);text-align:center;}',
      '#zokys-switch-modal .zk-sw-pill b{display:block;font-size:14px;color:#cffafe;margin-bottom:2px;}',
      '#zokys-switch-modal .zk-sw-pill span{font-size:10px;opacity:.55;}',
      '#zokys-switch-modal #zokys-switch-status{position:relative;font-size:11px;min-height:18px;margin-bottom:12px;color:#67e8f9;}',
      '#zokys-switch-modal .zk-sw-actions{position:relative;display:flex;gap:10px;}',
      '#zokys-switch-modal .zk-sw-cancel{flex:1;padding:13px;border-radius:14px;border:1px solid rgba(255,255,255,.1);',
      'background:rgba(255,255,255,.05);color:#67e8f9;font-weight:700;cursor:pointer;font-size:13px;}',
      '#zokys-switch-modal .zk-sw-go{flex:1.4;padding:13px;border-radius:14px;border:none;cursor:pointer;font-size:13px;font-weight:900;',
      'color:#fff;background:linear-gradient(135deg,#ea580c,#9f1239);box-shadow:0 10px 28px rgba(234,88,12,.35);}',
      '#zokys-switch-modal .zk-sw-go:disabled{opacity:.55;cursor:wait;}',
      '</style>',
      '<div class="zk-sw-card">',
      '<div class="zk-sw-orb a"></div><div class="zk-sw-orb b"></div>',
      '<div class="zk-sw-badge"><span class="z">FoxGEN Pro</span><span class="t"></span></div>',
      '<h3>Account Switch</h3>',
      '<div class="zk-sw-sub">Fresh pool account · 0 credits · max 2 / day. Invite link optional — project continue after login.</div>',
      '<button type="button" class="zk-sw-back" id="zk-sw-back-main">↩ Back to your main account</button>',
      '<div class="zk-sw-stats">',
      '<div class="zk-sw-pill"><b>0</b><span>Credits cost</span></div>',
      '<div class="zk-sw-pill"><b>2</b><span>Daily limit</span></div>',
      '<div class="zk-sw-pill"><b>Pool</b><span>Server Gmail</span></div>',
      '</div>',
      '<label>Project invite URL <span class="zk-sw-opt">(optional)</span></label>',
      '<input id="zokys-invite-input" type="url" placeholder="https://lovable.dev/projects/…?magic_link=…"/>',
      '<div class="zk-sw-hint">Leave empty to only switch account. Paste magic/invite link to open that project on the new account.</div>',
      '<div id="zokys-switch-status"></div>',
      '<div class="zk-sw-actions">',
      '<button type="button" class="zk-sw-cancel" id="zokys-switch-cancel">Cancel</button>',
      '<button type="button" class="zk-sw-go" id="zokys-switch-go">Switch account →</button>',
      '</div></div>'
    ].join("");
    document.documentElement.appendChild(ov);
    var backMain = ov.querySelector("#zk-sw-back-main");
    if (backMain) {
      backMain.onclick = function () {
        if (typeof window.__zokysBackToMainAccount === "function") {
          window.__zokysBackToMainAccount();
        } else {
          toast("Restoring main account…");
        }
      };
    }

    var st = ov.querySelector("#zokys-switch-status");
    var go = ov.querySelector("#zokys-switch-go");
    ov.querySelector("#zokys-switch-cancel").onclick = function () {
      ov.remove();
    };
    ov.onclick = function (e) {
      if (e.target === ov) ov.remove();
    };
    go.onclick = function () {
      var v = (ov.querySelector("#zokys-invite-input").value || "").trim();
      if (v && v.indexOf("http") !== 0) {
        toast("Invite must start with https://");
        return;
      }
      go.disabled = true;
      go.textContent = "Switching…";
      // Shield FIRST — before network
      try {
        chrome.storage.local.set({ zokys_switch_shield: true });
      } catch (_) {}
      try {
        showSwitchShield("Preparing account switch…");
      } catch (_) {}
      ov.remove();
      try {
        chrome.runtime.sendMessage({ type: "TRIVIS_SWITCH_ACCOUNT", inviteUrl: v || "" }, function (res) {
          if (chrome.runtime.lastError) {
            try {
              hideSwitchShield();
            } catch (_) {}
            toast(chrome.runtime.lastError.message || "Extension error");
            return;
          }
          if (!res || !res.ok) {
            try {
              hideSwitchShield();
            } catch (_) {}
            toast((res && res.error) || "Switch failed");
            return;
          }
          try {
            if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide();
          } catch (_) {}
          try {
            showSwitchShield("Pool: " + (res.email || "account") + " · signing in…");
          } catch (_) {}
          try {
            toast("Switching to " + (res.email || "pool account"));
          } catch (_) {}
          /* Auto-hide bar shield after login script takes over (non-blocking) */
          setTimeout(function () {
            try { hideSwitchShield(); } catch (_) {}
          }, 8000);
        });
      } catch (e) {
        try {
          hideSwitchShield();
        } catch (_) {}
        toast(String((e && e.message) || e));
      }
    };
  }

  function showSwitchShield(msg) {
    /* Never use rocket for switch — it blocks the whole page (pointer-events) */
    try {
      if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide();
    } catch (_) {}

    var old = document.getElementById("zokys-switch-shield");
    if (old) {
      var t = old.querySelector(".zk-st");
      if (t && msg) t.textContent = msg;
      return;
    }
    var sh = document.createElement("div");
    sh.id = "zokys-switch-shield";
    sh.innerHTML = [
      "<style>",
      "#zokys-switch-shield{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;pointer-events:none;",
      "flex-direction:column;gap:20px;background:rgba(5,3,12,.82);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);",
      "font-family:Inter,system-ui,sans-serif;color:#f5f3ff;}",
      "#zokys-switch-shield .zk-ring{position:relative;width:64px;height:64px;}",
      "#zokys-switch-shield .zk-ring i{position:absolute;inset:0;border-radius:50%;border:3px solid transparent;",
      "border-top-color:#06b6d4;border-right-color:#ef4444;animation:zkSpin .9s linear infinite;}",
      "#zokys-switch-shield .zk-ring i:nth-child(2){inset:8px;border-top-color:#fb923c;border-right-color:transparent;animation-duration:1.2s;animation-direction:reverse;}",
      "@keyframes zkSpin{to{transform:rotate(360deg)}}",
      "#zokys-switch-shield .zk-st{font-size:16px;font-weight:800;letter-spacing:.03em;text-align:center;padding:0 28px;",
      "background:linear-gradient(90deg,#cffafe,#fff,#fecaca);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}",
      "#zokys-switch-shield .zk-ss{font-size:12px;opacity:.55;text-align:center;max-width:300px;line-height:1.5;}",
      "#zokys-switch-shield .zk-dots{display:flex;gap:6px;margin-top:4px;}",
      "#zokys-switch-shield .zk-dots b{width:6px;height:6px;border-radius:50%;background:#06b6d4;animation:zkDot 1.2s ease-in-out infinite;}",
      "#zokys-switch-shield .zk-dots b:nth-child(2){animation-delay:.2s;background:#fb923c;}",
      "#zokys-switch-shield .zk-dots b:nth-child(3){animation-delay:.4s;background:#f87171;}",
      "@keyframes zkDot{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1.15)}}",
      "</style>",
      '<div class="zk-ring"><i></i><i></i></div>',
      '<div class="zk-st">' + (msg || "Switching account…") + "</div>",
      '<div class="zk-ss">Logout · pool login · project handoff</div>',
      '<div class="zk-dots"><b></b><b></b><b></b></div>'
    ].join("");
    document.documentElement.appendChild(sh);
  }

  function hideSwitchShield() {
    try {
      if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide();
    } catch (_) {}

    var sh = document.getElementById("zokys-switch-shield");
    if (sh) sh.remove();
    try {
      chrome.storage.local.set({ zokys_switch_shield: false });
    } catch (_) {}
  }







  function setMethod(m, proxy) {
    m = "1"; proxy = false;
    selectedMethod = m;
    try { chrome.storage.local.set({ zokys_method: m, zokys_method3_proxy: !!proxy }); } catch (_) {}
    try {
      window.postMessage({ type: "TRIVIS_SET_METHOD", method: m, proxy: !!proxy }, "*");
    } catch (_) {}
    try {
      localStorage.setItem("zokys_method", String(m));
      localStorage.setItem("zokys_method3_proxy", proxy ? "1" : "0");
    } catch (_) {}
    toast("Method " + m + " saved · page refreshing…");
    // Hard reload so MAIN hook boots with selected method (reliable apply)
    setTimeout(function () {
      try {
        location.reload();
      } catch (_) {}
    }, 450);
  }

  
  function showFeatures() {
    expand(true);
    try {
      chrome.storage.local.get(["zokys_auto_approve"], function (s) {
        autoApprove = !!s.zokys_auto_approve;
        renderFeaturesInner();
      });
    } catch (_) {
      renderFeaturesInner();
    }
  }

  function renderFeatures() {
    showFeatures();
  }

  function injectPromptToChat(text) {
    try {
      if (typeof window.__zokysChatSendTxt === "function") {
        window.__zokysChatSendTxt(text, { mode: "build", autoSend: true, showLoader: true });
        toast("Sending via FoxGEN Pro Chat…");
        return;
      }
    } catch (e) {}
    try {
      sendToLovableChat(text);
      return;
    } catch (_) {}
    toast("Open a project chat first");
  }

  function renderFeaturesInner() {
    setBody(
      '<div class="zk-dev-box">' +
        '<div class="zk-dev-badge"><span class="glow-dot"></span><span>SYSTEM MODULE</span></div>' +
        '<div class="zk-dev-title">FoxGEN Pro TOOLS</div>' +
        '<div class="zk-dev-sub">Intelligent automation & swift bypasses</div>' +
      '</div>' +
      '<div class="vx-feat-card">' +
        '<div class="vx-aa-row">' +
          '<div class="vx-aa-meta"><div class="t">Auto Approval</div><div class="s">Auto-click Lovable approve / allow</div></div>' +
          '<div class="vx-toggle ' + (autoApprove ? "on" : "") + '" id="vx-aa-toggle" role="switch"><div class="knob"></div></div>' +
        '</div>' +
        '<div class="vx-aa-status ' + (autoApprove ? "on" : "") + '" id="vx-aa-status">' +
          '<span class="status-indicator"></span>' +
          (autoApprove ? "Auto approve on · Listening" : "Auto approve off · Standby") +
        '</div>' +
      '</div>' +
      '<button type="button" class="vx-fbtn zk-3d" id="vx-f-wm">' +
        '<div class="fi fi-wm">' + svg("magicpen") + '</div>' +
        '<div class="fl"><div class="fl-top"><b>Watermark Remove</b><span class="vx-tag">1-CLICK</span></div><span>Strip Lovable branding completely</span></div>' +
      '</button>' +
      '<button type="button" class="vx-fbtn zk-3d" id="vx-f-cloud">' +
        '<div class="fi fi-cloud">' + svg("cloud") + '</div>' +
        '<div class="fl"><div class="fl-top"><b>Enable Cloud</b><span class="vx-tag">SUPABASE</span></div><span>Supabase database & cloud auth</span></div>' +
      '</button>' +
      '<button type="button" class="vx-fbtn zk-3d" id="vx-f-new">' +
        '<div class="fi fi-new">' + svg("add") + '</div>' +
        '<div class="fl"><div class="fl-top"><b>Create New Project</b><span class="vx-tag">SCAFFOLD</span></div><span>Fresh project prompt pack</span></div>' +
      '</button>' +
      '<button type="button" class="vx-fbtn zk-3d" id="vx-f-dlfull">' +
        '<div class="fi fi-dl">' + svg("download") + '</div>' +
        '<div class="fl"><div class="fl-top"><b>Download Full Source</b><span class="vx-tag">FULL ZIP</span></div><span>ZIP archive & project export</span></div>' +
      '</button>' +
      '<button type="button" class="vx-fbtn zk-3d" id="vx-f-webapp">' +
        '<div class="fi fi-app">' + svg("mobile") + '</div>' +
        '<div class="fl"><div class="fl-top"><b>Convert Web into App</b><span class="vx-tag">APK BUILD</span></div><span>Website → mobile installable APK flow</span></div>' +
      '</button>'
    );

    var tog = bodyEl.querySelector("#vx-aa-toggle");
    if (tog) {
      tog.onclick = function () {
        autoApprove = !autoApprove;
        try {
          chrome.storage.local.set({ zokys_auto_approve: autoApprove });
        } catch (_) {}
        if (autoApprove) startAutoApprove();
        else stopAutoApprove();
        renderFeaturesInner();
        toast(autoApprove ? "Auto approve on · Active" : "Auto approve off · Standby");
      };
    }
    var wm = bodyEl.querySelector("#vx-f-wm");
    if (wm)
      wm.onclick = function () {
        var prompt =
          "Look at the attached screenshot. It shows the floating \"Edit with Lovable\" badge on the site.\n\n" +
          "Remove or fully hide this badge from the published website so visitors never see it. " +
          "Handle all cases: corner badge, overlay button, iframe badge, and any script that injects \"Edit with Lovable\" or Lovable branding.\n\n" +
          "Apply the fix in the project code (CSS and/or by removing the injecting component/script). " +
          "Do not only describe steps — implement the change so the badge is gone.";
        function sendWm(file) {
          try {
            if (file && typeof window.__zokysAttachExtraFiles === "function") {
              window.__zokysAttachExtraFiles([file]);
            }
          } catch (_) {}
          if (typeof window.__zokysChatSendTxt === "function") {
            window.__zokysChatSendTxt(prompt, { mode: "build", autoSend: true, showLoader: true });
            toast("Watermark remove · badge image + prompt sent");
          } else {
            injectPromptToChat(prompt);
          }
        }
        try {
          var url = chrome.runtime.getURL("assets/lovable-edit-badge.jpg");
          fetch(url)
            .then(function (r) { return r.blob(); })
            .then(function (blob) {
              var file = new File([blob], "edit-with-lovable-badge.jpg", { type: "image/jpeg" });
              sendWm(file);
            })
            .catch(function () {
              sendWm(null);
            });
        } catch (_) {
          sendWm(null);
        }
      };
    var cl = bodyEl.querySelector("#vx-f-cloud");
    if (cl)
      cl.onclick = function () {
        injectPromptToChat(
          "Enable Supabase cloud for this project end-to-end.\n\n1) Set up Supabase client safely (env keys, not hardcoded secrets in frontend if avoidable).\n2) Auth if needed.\n3) Database tables + RLS policies.\n4) Wire the app to use cloud data.\nApply real code changes so cloud works."
        );
      };
    var np = bodyEl.querySelector("#vx-f-new");
    if (np)
      np.onclick = function () {
        injectPromptToChat(
          "Scaffold a clean new mini-product in this workspace with modern UI, clear structure, and best practices.\nFirst ask me one short question: what product should we build? Then implement the first version."
        );
      };
    var dl = bodyEl.querySelector("#vx-f-dlfull");
    if (dl) {
      dl.onclick = function () {
        if (typeof window.__zokysDownloadFullSource === "function") {
          window.__zokysDownloadFullSource();
        } else {
          downloadProjectSource();
        }
      };
    }
    var wa = bodyEl.querySelector("#vx-f-webapp");
    if (wa) {
      wa.onclick = function () {
        var prompt =
          "Convert this entire website project into a real installable Android mobile application, using this project's full source code as the base.\n\n" +
          "Goals:\n1) Reuse existing UI, pages, routing, and features.\n" +
          "2) Mobile app shell (Capacitor/TWA/PWA-to-APK style preferred).\n" +
          "3) App icon + splash placeholders, package id com.zokys.app, version 1.0.0.\n" +
          "4) After setup provide APK download link/button in chat OR the closest downloadable build artifact + exact rebuild steps.\n\n" +
          "Implement now in this project, then put the APK download link or button in the chat.";
        if (typeof window.__zokysChatSendTxt === "function") {
          window.__zokysChatSendTxt(prompt, { mode: "build", autoSend: true, showLoader: false });
          toast("Web→App prompt sending…");
        } else {
          sendToLovableChat(prompt);
        }
      };
    }
  }



  function showAntiProtect() {
    expand(true);
    setBody(
      '<style id="zk-ap-css">.zk-ap{display:flex;flex-direction:column;align-items:center;padding:8px 4px 12px;text-align:center}.zk-ap-badge{display:inline-flex;align-items:center;gap:7px;font:700 9px Inter,system-ui;letter-spacing:.14em;color:#67e8f9;margin-bottom:8px}.zk-ap-badge .glow-dot{width:6px;height:6px;border-radius:50%;background:#06b6d4;box-shadow:0 0 10px #06b6d4;animation:zkDot 1.4s ease-in-out infinite}.zk-ap-title{font:800 20px Inter,system-ui;color:#f0f9ff;letter-spacing:.04em}.zk-ap-sub{font:500 11px Inter,system-ui;color:rgba(186,230,253,.5);margin:6px 0 18px;line-height:1.45;max-width:240px}.zk-ap-orb{position:relative;width:118px;height:118px;border-radius:50%;border:0;cursor:pointer;background:radial-gradient(circle at 40% 35%,#0c2a4a,#050b18 70%);box-shadow:0 0 0 2px rgba(6,182,212,.25),0 12px 40px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .25s}.zk-ap-orb:hover{transform:scale(1.03)}.zk-ap-orb.on{box-shadow:0 0 0 2px rgba(52,211,153,.45),0 0 36px rgba(6,182,212,.45),0 12px 40px rgba(0,0,0,.45)}.zk-ap-orb .zk-ap-glow{position:absolute;inset:-12px;border-radius:50%;background:radial-gradient(circle,rgba(6,182,212,.35),transparent 70%);opacity:.5;pointer-events:none}.zk-ap-orb.on .zk-ap-glow{opacity:1;background:radial-gradient(circle,rgba(52,211,153,.28),rgba(6,182,212,.3) 50%,transparent 70%)}.zk-ap-orb .zk-ap-ring{position:absolute;inset:8px;border-radius:50%;border:1px solid rgba(6,182,212,.3);pointer-events:none}.zk-ap-orb.on .zk-ap-ring{border-color:rgba(52,211,153,.4);animation:zkApPulse 2s ease-in-out infinite}@keyframes zkApPulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.04);opacity:1}}.zk-ap-orb svg{width:42px;height:42px;color:#cffafe;position:relative;z-index:1;filter:drop-shadow(0 4px 12px rgba(6,182,212,.5))}.zk-ap-orb.on svg{color:#a7f3d0}.zk-ap-play{position:absolute;bottom:10px;font:800 10px Inter,system-ui;letter-spacing:.12em;color:#a5f3fc;z-index:2}.zk-ap-orb.on .zk-ap-play{color:#6ee7b7}.zk-ap-status{margin-top:16px;display:inline-flex;align-items:center;gap:8px;font:600 12px Inter,system-ui;color:#67e8f9}.zk-ap-status .dot{width:8px;height:8px;border-radius:50%;background:#f87171;box-shadow:0 0 8px rgba(248,113,113,.5)}.zk-ap-status.on .dot{background:#34d399;box-shadow:0 0 8px rgba(52,211,153,.55)}.zk-ap-status.on{color:#a7f3d0}.zk-ap-timer{margin-top:6px;font:700 18px ui-monospace,monospace;color:#e0f2fe;letter-spacing:.04em}.zk-ap-cards{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;width:100%;margin-top:16px}.zk-ap-card{background:rgba(255,255,255,.04);border:1px solid rgba(6,182,212,.2);border-radius:12px;padding:10px 6px}.zk-ap-card .k{font:700 8px Inter,system-ui;letter-spacing:.1em;text-transform:uppercase;color:rgba(125,211,252,.55);margin-bottom:4px}.zk-ap-card .v{font:650 11px Inter,system-ui;color:#e0f2fe}.zk-ap-hint{margin-top:14px;font:500 10.5px Inter,system-ui;color:rgba(186,230,253,.42);line-height:1.5;text-align:left;max-width:100%}.zk-ap-hint b{color:#cffafe}</style>' +
      '<div class="zk-ap">' +
        '<div class="zk-ap-badge"><span class="glow-dot"></span><span>SHIELD LAYER</span></div>' +
        '<div class="zk-ap-title">AntiProtect</div>' +
        '<div class="zk-ap-sub">Verify → health check → auto fix → then send</div>' +
        '<button type="button" class="zk-ap-orb" id="zk-ap-toggle" aria-label="Toggle AntiProtect">' +
          '<span class="zk-ap-glow"></span>' +
          '<span class="zk-ap-ring"></span>' +
          svg("shield") +
          '<span class="zk-ap-play" id="zk-ap-play">OFF</span>' +
        '</button>' +
        '<div class="zk-ap-status" id="zk-ap-status">' +
          '<span class="dot"></span><span class="lbl">Loading…</span>' +
        '</div>' +
        '<div class="zk-ap-timer" id="zk-ap-timer">—</div>' +
        '<div class="zk-ap-cards">' +
          '<div class="zk-ap-card"><div class="k">Server</div><div class="v" id="zk-ap-server">Authorize</div></div>' +
          '<div class="zk-ap-card"><div class="k">Method</div><div class="v" id="zk-ap-method">Health</div></div>' +
          '<div class="zk-ap-card"><div class="k">Last run</div><div class="v" id="zk-ap-last">—</div></div>' +
        '</div>' +
        '<p class="zk-ap-hint">When <b>ON</b>, every extension send runs full pipeline: one-time server token, method health, auto re-inject if missing, then UsagiAutoX send.<br/>When <b>OFF</b>, send still needs a valid license token but skips forced heal.</p>' +
        '<button type="button" class="vx-btn primary" id="zk-ap-test" style="margin-top:12px;width:100%">Run health check now</button>' +
      '</div>'
    );

    function paint(on, health) {
      var orb = bodyEl.querySelector("#zk-ap-toggle");
      var play = bodyEl.querySelector("#zk-ap-play");
      var st = bodyEl.querySelector("#zk-ap-status");
      if (orb) orb.classList.toggle("on", !!on);
      if (play) play.textContent = on ? "ON" : "OFF";
      if (st) {
        st.classList.toggle("on", !!on);
        var lbl = st.querySelector(".lbl");
        if (lbl) lbl.textContent = on ? "Shield armed · pipeline active" : "Shield idle · soft mode";
      }
      var meth = bodyEl.querySelector("#zk-ap-method");
      if (meth && health) {
        meth.textContent = health.healthy ? "Healthy ✓" : "Needs fix";
        meth.style.color = health.healthy ? "#6ee7b7" : "#a5f3fc";
      }
    }

    function loadState() {
      try {
        chrome.storage.local.get(
          ["zokys_antiprotect_on", "zokys_ap_last_check", "zokys_ap_last_ok", "zokys_ap_last_steps"],
          function (s) {
            var on = true;
            if (s && s.zokys_antiprotect_on !== undefined && s.zokys_antiprotect_on !== null) {
              on = !!s.zokys_antiprotect_on;
            }
            paint(on, null);
            var last = bodyEl.querySelector("#zk-ap-last");
            var timer = bodyEl.querySelector("#zk-ap-timer");
            if (s && s.zokys_ap_last_check) {
              var ago = Math.max(0, Date.now() - Number(s.zokys_ap_last_check));
              var sec = Math.floor(ago / 1000);
              var txt = sec < 60 ? sec + "s ago" : Math.floor(sec / 60) + "m ago";
              if (last) last.textContent = s.zokys_ap_last_ok ? "OK · " + txt : "Soft · " + txt;
              if (timer) timer.textContent = txt;
            }
          }
        );
      } catch (_) {
        paint(true, null);
      }
    }

    var toggle = bodyEl.querySelector("#zk-ap-toggle");
    if (toggle) {
      toggle.onclick = function () {
        try {
          chrome.storage.local.get(["zokys_antiprotect_on"], function (s) {
            var cur = true;
            if (s && s.zokys_antiprotect_on !== undefined && s.zokys_antiprotect_on !== null) {
              cur = !!s.zokys_antiprotect_on;
            }
            var next = !cur;
            chrome.storage.local.set({ zokys_antiprotect_on: next }, function () {
              paint(next, null);
              toast(next ? "AntiProtect ON" : "AntiProtect OFF");
            });
          });
        } catch (_) {}
      };
    }

    var testBtn = bodyEl.querySelector("#zk-ap-test");
    if (testBtn) {
      testBtn.onclick = function () {
        try {
          if (typeof window.__zokysSendAnimShow === "function") {
            window.__zokysSendAnimShow("HEALTH CHECK", "Scanning method layer");
          }
        } catch (_) {}
        try {
          chrome.runtime.sendMessage({ type: "FOXGEN_METHOD_HEALTH" }, function (res) {
            var healthy = !!(res && res.healthy);
            if (!healthy) {
              chrome.runtime.sendMessage({ type: "FOXGEN_REINJECT" }, function () {
                setTimeout(function () {
                  chrome.runtime.sendMessage({ type: "FOXGEN_METHOD_HEALTH" }, function (res2) {
                    try {
                      if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide();
                    } catch (_) {}
                    paint(true, res2 || res);
                    try {
                      chrome.storage.local.set({
                        zokys_ap_last_check: Date.now(),
                        zokys_ap_last_ok: !!(res2 && res2.healthy)
                      });
                    } catch (_) {}
                    toast(res2 && res2.healthy ? "Method healthy after reinject" : "Still weak — open a project chat");
                    loadState();
                  });
                }, 800);
              });
            } else {
              try {
                if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide();
              } catch (_) {}
              paint(true, res);
              try {
                chrome.storage.local.set({
                  zokys_ap_last_check: Date.now(),
                  zokys_ap_last_ok: true
                });
              } catch (_) {}
              toast("Method healthy ✓");
              loadState();
            }
          });
        } catch (_) {
          try {
            if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide();
          } catch (_) {}
          toast("Health check failed");
        }
      };
    }

    loadState();
  }

  function showWelcome() {
    expand(true);
    setBody(
      '<div class="zk-welcome">' +
        '<div class="zk-welcome-orb zk-welcome-orb-a"></div>' +
        '<div class="zk-welcome-orb zk-welcome-orb-b"></div>' +
        '<div class="zk-welcome-inner">' +
          '<div class="zk-welcome-badge"><span class="z">FoxGEN Pro</span><span class="t"></span></div>' +
          '<div class="zk-welcome-title">Welcome back</div>' +
          '<div class="zk-welcome-line"></div>' +
          '<div class="zk-welcome-text">' +
            "You’re locked in. Open any project chat and build — the path stays live behind the scenes." +
          "</div>" +
          '<div class="zk-welcome-hints">' +
            '<div class="zk-soc-card zk-soc-telegram" id="zk-soc-youtube">' +
              '<div class="zk-3d-ico zk-3d-ico-telegram">' + svg("telegram") + '</div>' +
              '<div class="zk-soc-info"><b>YouTube</b><span>Tutorials, updates & demos</span></div>' +
              '<span class="zk-soc-pill zk-soc-pill-telegram">WATCH ↗</span>' +
            '</div>' +
            '<div class="zk-soc-card zk-soc-telegram" id="zk-soc-telegram">' +
              '<div class="zk-3d-ico zk-3d-ico-telegram">' + svg("telegram") + '</div>' +
              '<div class="zk-soc-info"><b>Telegram</b><span>Updates, support & news</span></div>' +
              '<span class="zk-soc-pill zk-soc-pill-telegram">CHANNEL ↗</span>' +
            '</div>' +
            '<div class="zk-soc-card zk-soc-instagram" id="zk-soc-instagram">' +
              '<div class="zk-3d-ico zk-3d-ico-instagram">' + svg("instagram") + '</div>' +
              '<div class="zk-soc-info"><b>Instagram</b><span>Showcases, reels & stories</span></div>' +
              '<span class="zk-soc-pill zk-soc-pill-instagram">FOLLOW ↗</span>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="vx-btn zk-welcome-cta" id="zk-welcome-lic"><span>Open license</span>' + svg("arrowRight") + '</button>' +
        '</div>' +
      '</div>'
    );
    var btn = bodyEl.querySelector("#zk-welcome-lic");
    if (btn) btn.onclick = function () {
      showLicense();
    };
    var socYt = bodyEl.querySelector("#zk-soc-youtube");
    if (socYt) {
      socYt.onclick = function () {
        window.open(LINKS.youtube || "https://t.me/foxgenofficial", "_blank", "noopener");
        toast("YouTube ↗");
      };
    }
    var socTelegram = bodyEl.querySelector("#zk-soc-telegram");
    if (socTelegram) {
      socTelegram.onclick = function () {
        window.open(LINKS.telegram, "_blank", "noopener");
        toast("Telegram Channel ↗");
      };
    }
    var socInstagram = bodyEl.querySelector("#zk-soc-instagram");
    if (socInstagram) {
      socInstagram.onclick = function () {
        window.open(LINKS.instagram, "_blank", "noopener");
        toast("Instagram Channel ↗");
      };
    }
  }

  function showLicense() {
    expand(true);
    getLicense(function (info) {
      try {
        var sync = detectProjectSync();
        var key = (info && info.key) || "—";
        var short = key.length > 16 ? key.slice(0, 12) + "…" : key;
        var syncText = sync && sync.synced ? t("syncOk") : t("syncNo");
        var syncColor = sync && sync.synced ? "#34d399" : "#fbbf24";
        var left = (info && info.left) || "—";
        var status = (info && info.status) || "—";

        setBody(
          '<div class="zk-dev-box">' +
            '<div class="zk-dev-badge"><span class="glow-dot"></span><span>SECURITY CLEARANCE</span></div>' +
            '<div class="zk-dev-title">LICENSE HUB</div>' +
            '<div class="zk-dev-sub">Active session, tokens & synchronization</div>' +
          '</div>' +
          '<div class="vx-card">' +
            '<div class="ic">' + svg("keySquare") + '</div>' +
            '<div class="meta"><div class="lab">' + t("license") + '</div><div class="val">' + short + '</div></div>' +
            '<button class="vx-copy" id="vx-copy">' + svg("copy") + '<span>' + t("copy") + '</span></button>' +
          '</div>' +
          '<div class="vx-free" id="vx-free-card">' +
            '<div class="fr-top"><div class="fr-lab">CHATS PIPELINE</div><div class="fr-count">Unlimited</div></div>' +
            '<div class="fr-track"><div class="fr-fill" style="width:100%"></div></div>' +
            '<div class="fr-hint ok"><span class="status-indicator"></span>Unlimited chats · Zero latency queue</div>' +
          '</div>' +
          '<div class="vx-card">' +
            '<div class="ic">' + svg("clock") + '</div>' +
            '<div class="meta"><div class="lab">' + t("time") + '</div><div class="val">' + left + '</div></div>' +
          '</div>' +
          '<div class="vx-card">' +
            '<div class="ic">' + svg("sync") + '</div>' +
            '<div class="meta"><div class="lab">' + t("sync") + '</div><div class="val" style="color:' + syncColor + '">' + syncText + '</div></div>' +
          '</div>' +
          '<div class="vx-card">' +
            '<div class="ic">' + svg("status") + '</div>' +
            '<div class="meta"><div class="lab">' + t("status") + '</div><div class="val">' + status + '</div></div>' +
          '</div>' +
          '<div class="vx-actions">' +
            '<button class="vx-btn ghost" id="vx-shop">' + svg("shop") + '<span>' + t("shop") + '</span></button>' +
            '<button class="vx-btn ghost" id="vx-reinject">' + svg("repeat") + '<span>Re-inject</span></button>' +
            '<button class="vx-btn ghost" id="vx-account-switch">' + svg("userEdit") + '<span>Account Switch</span></button>' +
            '<button class="vx-btn ghost" id="vx-logout">' + svg("logout") + '<span>' + t("logout") + '</span></button>' +
          '</div>' +
          '<div class="vx-foot"><span>FoxGEN Pro · Next-Gen Interface</span></div>'
        );

        var copyBtn = bodyEl.querySelector("#vx-copy");
        if (copyBtn) {
          copyBtn.onclick = function () {
            try {
              navigator.clipboard.writeText(key);
              toast("Copied");
            } catch (_) {
              toast(key);
            }
          };
        }
        var shop = bodyEl.querySelector("#vx-shop");
        if (shop) shop.onclick = function () {
          showShop();
        };
        var reinjectBtn = bodyEl.querySelector("#vx-reinject");
        if (reinjectBtn) {
          reinjectBtn.onclick = function () {
            try {
              if (typeof window.__zokysSendAnimShow === "function") {
                window.__zokysSendAnimShow("RE-INJECT SEQUENCE", "Reloading method · arming systems");
              }
            } catch (_) {}
            try {
              chrome.runtime.sendMessage({ type: "FOXGEN_REINJECT" }, function () {
                try {
                  toast("Method re-injected");
                } catch (_) {}
                setTimeout(function () {
                  try {
                    if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide();
                  } catch (_) {}
                }, 2200);
              });
            } catch (e) {
              try {
                if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide();
              } catch (_) {}
              try {
                toast("Re-inject failed");
              } catch (_) {}
            }
          };
        }
        var swBtn = bodyEl.querySelector("#vx-account-switch");

        if (swBtn) {
          swBtn.onclick = function () {
            try {
              if (typeof window.__zokysSendAnimShow === "function") {
                window.__zokysSendAnimShow("ACCOUNT SWITCH", "Preparing secure login · please wait");
              }
            } catch (_) {}
            try {
              try { if (window.__zokysSaveMainBeforeSwitch) window.__zokysSaveMainBeforeSwitch(); } catch(_e) {}
              showAccountSwitchModal();
            } catch (_) {
              try {
                if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide();
              } catch (_) {}
              toast("Coming soon");
            }
          };
        }
        var lo = bodyEl.querySelector("#vx-logout");
        if (lo) {
          lo.onclick = function () {
            try {
              chrome.runtime.sendMessage({ type: "TRIVIS_LOGOUT" }, function () {
                toast(t("logout"));
                showLicense();
              });
            } catch (_) {}
          };
        }
      } catch (err) {
        try {
          console.warn("[FoxGEN Pro] showLicense", err);
        } catch (_) {}
        setBody('<div class="zk-welcome-text">License panel error — try re-activate key.</div>');
      }
    });
  }


  function showSocial() {
    expand(true);
    setBody(
      '<div class="zk-dev-box">' +
        '<div class="zk-dev-badge"><span class="glow-dot"></span><span>COMMUNITY HUB</span></div>' +
        '<div class="zk-dev-title">CONNECT WITH US</div>' +
        '<div class="zk-dev-sub">Official FoxGEN Pro networks & support</div>' +
      '</div>' +
      '<div class="zk-welcome-hints">' +
        '<div class="zk-soc-card zk-soc-telegram" data-open="youtube">' +
          '<div class="zk-3d-ico zk-3d-ico-telegram">' + svg("telegram") + '</div>' +
          '<div class="zk-soc-info"><b>YouTube</b><span>Tutorials, updates & demos</span></div>' +
          '<span class="zk-soc-pill zk-soc-pill-telegram">WATCH ↗</span>' +
        '</div>' +
        '<div class="zk-soc-card zk-soc-telegram" data-open="telegram">' +
          '<div class="zk-3d-ico zk-3d-ico-telegram">' + svg("telegram") + '</div>' +
          '<div class="zk-soc-info"><b>Telegram</b><span>Updates, support & news</span></div>' +
          '<span class="zk-soc-pill zk-soc-pill-telegram">CHANNEL ↗</span>' +
        '</div>' +
        '<div class="zk-soc-card zk-soc-instagram" data-open="instagram">' +
          '<div class="zk-3d-ico zk-3d-ico-instagram">' + svg("instagram") + '</div>' +
          '<div class="zk-soc-info"><b>Instagram</b><span>Showcases, reels & stories</span></div>' +
          '<span class="zk-soc-pill zk-soc-pill-instagram">FOLLOW ↗</span>' +
        '</div>' +
      '</div>'
    );
    bodyEl.querySelectorAll(".zk-soc-card[data-open]").forEach(function (btn) {
      btn.onclick = function () {
        var k = btn.getAttribute("data-open");
        var url = LINKS[k];
        if (url) {
          window.open(url, "_blank", "noopener");
          var name = k === "youtube" ? "YouTube" : k === "telegram" ? "Telegram" : "Instagram";
          toast(name + " ↗");
        }
      };
    });
  }


  function showApp() {
    /* Download app section removed */
    showWelcome();
  }


  function loadChatHist() {
    try {
      var raw = localStorage.getItem(FOXGEN_CHAT_HIST_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.slice(-40) : [];
    } catch (_) {
      return [];
    }
  }
  function saveChatHist(arr) {
    try {
      localStorage.setItem(FOXGEN_CHAT_HIST_KEY, JSON.stringify(arr.slice(-40)));
    } catch (_) {}
  }
  function pushChatHist(item) {
    var arr = loadChatHist();
    arr.push(item);
    saveChatHist(arr);
    return arr;
  }

  function fmtTime(ts) {
    try {
      var d = new Date(ts);
      return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (_) {
      return "";
    }
  }

  function showlovaXChat() {
    expand(true);
    var planOn = false;
    try {
      if (localStorage.getItem("zokys_plan_mode") === "1") planOn = true;
    } catch (_) {}

    setBody(
      '<div class="zk-lb zk-glass">' +
        '<div class="zk-lb-title"><span>FoxGEN Pro</span> <span class="heart">♥</span> <span class="zk-dev-badge" style="margin-left:auto;font-size:9px"><span class="glow-dot"></span>AI ENGINE</span></div>' +
        '<p class="zk-lb-desc">Ship prompts as a secure task file. Lovable reads the file and finishes the job — stable, clean, automatic.</p>' +
        '<div class="zk-lb-box zk-glass-panel">' +
          '<textarea id="vx-chat-input" class="zk-lb-input" rows="3" placeholder="Ask Lovable anything…"></textarea>' +
          '<div class="zk-lb-bar">' +
            '<button type="button" class="zk-lb-plus zk-glass-circle" id="vx-chat-plus" title="Add files">' + svg("paperclip") + '</button>' +
            '<div class="zk-lb-spacer"></div>' +
            '<div class="zk-lb-capsule zk-glass-cap" id="vx-mode-cap">' +
              '<button type="button" class="zk-lb-cap-btn" id="vx-mode-toggle"><span id="vx-mode-label">' +
              (planOn ? "Plan" : "Build") +
              '</span><span class="caret">▾</span></button>' +
              '<div class="zk-lb-menu zk-glass-panel" id="vx-mode-menu" hidden>' +
                '<button type="button" data-mode="build">Build</button>' +
                '<button type="button" data-mode="plan">Plan</button>' +
              '</div>' +
            '</div>' +
            '<button type="button" class="zk-lb-send zk-glass-circle" id="vx-chat-send" title="Send">' + svg("send") + '</button>' +
            '<button type="button" class="zk-lb-stop zk-glass-circle" id="vx-chat-stop" title="Stop" hidden>' + svg("stop") + '</button>' +
          '</div>' +
        '</div>' +
        '<input type="file" id="vx-chat-file" style="display:none" multiple />' +
        '<div class="zk-lb-hist" id="vx-chat-hist"></div>' +
      '</div>'
    );

    var hist = bodyEl.querySelector("#vx-chat-hist");
    var input = bodyEl.querySelector("#vx-chat-input");
    var sendBtn = bodyEl.querySelector("#vx-chat-send");
    var stopBtn = bodyEl.querySelector("#vx-chat-stop");
    var plusBtn = bodyEl.querySelector("#vx-chat-plus");
    var fileInp = bodyEl.querySelector("#vx-chat-file");
    var modeToggle = bodyEl.querySelector("#vx-mode-toggle");
    var modeMenu = bodyEl.querySelector("#vx-mode-menu");
    var modeLabel = bodyEl.querySelector("#vx-mode-label");

    function addHist(text, ok) {
      if (!hist) return;
      var row = document.createElement("div");
      row.className = "zk-lb-h" + (ok ? " ok" : " bad");
      row.textContent = (ok ? "✓ " : "✕ ") + text.slice(0, 100) + (text.length > 100 ? "…" : "");
      hist.insertBefore(row, hist.firstChild);
    }

    function setSending(busy) {
      if (sendBtn) sendBtn.hidden = !!busy;
      if (stopBtn) stopBtn.hidden = !busy;
    }

    function setMode(isPlan) {
      planOn = !!isPlan;
      try {
        localStorage.setItem("zokys_plan_mode", planOn ? "1" : "0");
      } catch (_) {}
      if (modeLabel) modeLabel.textContent = planOn ? "Plan" : "Build";
      if (modeMenu) modeMenu.hidden = true;
      if (typeof window.__zokysSetLovableMode === "function") {
        window.__zokysSetLovableMode(planOn ? "plan" : "build");
      }
    }

    if (modeToggle && modeMenu) {
      modeToggle.onclick = function (e) {
        e.stopPropagation();
        modeMenu.hidden = !modeMenu.hidden;
      };
      modeMenu.querySelectorAll("button").forEach(function (b) {
        b.onclick = function () {
          setMode(b.getAttribute("data-mode") === "plan");
        };
      });
    }

    if (plusBtn && fileInp) {
      plusBtn.onclick = function () {
        fileInp.click();
      };
      fileInp.onchange = function () {
        try {
          if (!fileInp.files || !fileInp.files.length) return;
          /* Snapshot File objects BEFORE clearing input */
          var snap = [];
          for (var fi = 0; fi < fileInp.files.length; fi++) snap.push(fileInp.files[fi]);
          if (typeof window.__zokysAttachExtraFiles === "function") {
            window.__zokysAttachExtraFiles(snap);
          }
          var names = snap.map(function (f) { return f.name; }).join(", ");
          toast("Attached: " + (names.length > 60 ? names.slice(0, 57) + "…" : names));
        } catch (e) {
          toast("Attach failed");
        }
        try { fileInp.value = ""; } catch (_) {}
      };
    }

    if (stopBtn) {
      stopBtn.onclick = function () {
        if (typeof window.__zokysClickStop === "function") (window.__zokysForceStopBurst ? window.__zokysForceStopBurst() : window.__zokysClickStop());
        setSending(false);
        toast("Stopped");
      };
    }

    function doSend() {
      var text = ((input && input.value) || "").trim();
      if (!text) return;
      setSending(true);
      var mode = planOn ? "plan" : "build";
      function done(ok) {
        addHist(text, !!ok);
        if (ok) input.value = "";
        toast(ok ? "Sent" : "Send failed");
        setTimeout(function () {
          setSending(false);
        }, ok ? 2500 : 400);
      }
      try {
        if (typeof window.__zokysChatSendTxt === "function") {
          Promise.resolve(
            window.__zokysChatSendTxt(text, {
              mode: mode,
              autoSend: true,
              showLoader: false,
              waitForSendReady: true
            })
          )
            .then(done)
            .catch(function () {
              try {
                sendToLovableChat(text);
                done(true);
              } catch (_) {
                done(false);
              }
            });
        } else {
          try {
            sendToLovableChat(text);
            done(true);
          } catch (_) {
            done(false);
          }
        }
      } catch (e) {
        try {
          sendToLovableChat(text);
          done(true);
        } catch (_) {
          done(false);
        }
      }
    }

    if (sendBtn) sendBtn.onclick = doSend;
    if (input) {
      input.onkeydown = function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          doSend();
        }
      };
    }
  }


  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function sleep(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }

  function findLovableComposer() {
    var selectors = [
      "textarea[placeholder*='Ask Lovable']",
      "textarea[placeholder*='lovable' i]",
      "form textarea",
      "[contenteditable='true']",
      "textarea"
    ];
    for (var i = 0; i < selectors.length; i++) {
      var nodes = document.querySelectorAll(selectors[i]);
      for (var j = 0; j < nodes.length; j++) {
        var el = nodes[j];
        if (!el || (el.closest && el.closest("#zokys-vx-root"))) continue;
        var r = el.getBoundingClientRect();
        if (r.width > 80 && r.height > 20) return el;
      }
    }
    return null;
  }

  function findFileInput() {
    var inputs = document.querySelectorAll('input[type="file"]');
    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      if (el.closest && el.closest("#zokys-vx-root")) continue;
      return el;
    }
    return null;
  }

  function findSendButton() {
    var buttons = document.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      if (b.closest && b.closest("#zokys-vx-root")) continue;
      var t = (b.getAttribute("aria-label") || b.textContent || "").toLowerCase();
      if (/send|submit/.test(t)) return b;
      // paper-plane near composer
      if (b.querySelector("svg") && b.closest("form")) return b;
    }
    return null;
  }

  function setNativeValue(el, value) {
    try {
      var proto = el.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
      var desc = Object.getOwnPropertyDescriptor(proto, "value");
      if (desc && desc.set) desc.set.call(el, value);
      else el.value = value;
    } catch (_) {
      el.value = value;
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

          async function sendlovaXChatPrompt(userPrompt) {
    /* Single pipeline only — no second zokys-task / Read txt bubble */
    if (typeof window.__zokysChatSendTxt === "function") {
      return window.__zokysChatSendTxt(userPrompt, { mode: "build", autoSend: true });
    }
    try {
      window.dispatchEvent(new Event("zokys-rehook"));
    } catch (_) {}

    try {
      window.__zokys_last_task = userPrompt;
      localStorage.setItem("zokys_last_task", userPrompt);
      localStorage.setItem("zokys_pending_trigger", "1");
      window.postMessage({ type: "TRIVIS_STASH_TASK", task: userPrompt }, "*");
    } catch (_) {}

    var trigger = TRIVIS_TRIGGER;
    var file = new File([userPrompt], "zokys-task.txt", { type: "text/plain" });

    // Attach txt file
    try {
      var inputs = document.querySelectorAll('input[type="file"]');
      for (var i = 0; i < inputs.length; i++) {
        var el = inputs[i];
        if (el.closest && el.closest("#zokys-vx-root")) continue;
        try {
          var dt = new DataTransfer();
          dt.items.add(file);
          el.files = dt.files;
          el.dispatchEvent(new Event("change", { bubbles: true }));
          el.dispatchEvent(new Event("input", { bubbles: true }));
        } catch (_) {}
      }
    } catch (_) {}

    await sleep(500);

    var composer = findLovableComposer();
    if (!composer) throw new Error("Open a project chat first");

    // Only put short trigger — user presses Lovable Send manually
    composer.focus();
    if (composer.isContentEditable) {
      composer.textContent = trigger;
      try {
        composer.dispatchEvent(
          new InputEvent("input", { bubbles: true, cancelable: true, inputType: "insertText", data: trigger })
        );
      } catch (_) {
        composer.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } else {
      setNativeValue(composer, trigger);
      try {
        composer.dispatchEvent(
          new InputEvent("input", { bubbles: true, cancelable: true, inputType: "insertText", data: trigger })
        );
      } catch (_) {}
    }

    try {
      toast("Ready — press Send on Lovable");
    } catch (_) {}

    return true;
  }


    function showShop() {
    expand(true);
    setBody(
      '<div class="zk-dev-box">' +
        '<div class="zk-dev-badge"><span class="glow-dot"></span><span>SUBSCRIPTION STORE</span></div>' +
        '<div class="zk-dev-title">PREMIUM ACCESS</div>' +
        '<div class="zk-dev-sub">Unlock unlimited sessions, VIP support & bypasses</div>' +
      '</div>' +
      PLANS.map(function (p, i) {
        var hot = p.hot ? " featured" : "";
        var feats = (p.feats || [])
          .map(function (f) {
            return '<li><span class="zk-check" style="display:inline-flex;align-items:center;margin-right:6px;color:#06b6d4">' + svg("tick") + '</span>' + f + "</li>";
          })
          .join("");
        return (
          '<div class="zk-card' + hot + '" style="--i:' + i + '">' +
            '<div class="zk-card-top">' +
              '<span class="zk-tag">' + (p.tag || "PLAN") + "</span>" +
              (p.hot ? '<span class="zk-hot">HOT</span>' : "") +
            "</div>" +
            '<div class="zk-price">' + p.price + '</div>' +
            '<div class="zk-dur">' + p.label + " · " + (p.devices || "") + "</div>" +
            '<ul class="zk-feats">' + feats + "</ul>" +
            '<button class="zk-buy" data-id="' + p.id + '"><span>Get plan</span>' + svg("arrowRight") + '</button>' +
          "</div>"
        );
      }).join("")
    );
    bodyEl.querySelectorAll(".zk-buy").forEach(function (btn) {
      btn.onclick = function () {
        window.open(LINKS.telegram || "https://t.me/foxgenofficial", "_blank", "noopener");
        toast("Telegram · " + btn.getAttribute("data-id"));
      };
    });
  }


  function showLang() {
    expand(true);
    setBody(
      '<div class="zk-dev-box">' +
        '<div class="zk-dev-badge"><span class="glow-dot"></span><span>LOCALIZATION</span></div>' +
        '<div class="zk-dev-title">SELECT LANGUAGE</div>' +
        '<div class="zk-dev-sub">UI & prompt system translations</div>' +
      '</div>' +
      '<div class="vx-lang">' +
      LANGS.map(function (L, i) {
        var isAct = L.id === lang;
        return (
          '<button data-l="' + L.id + '" style="--i:' + i + '" class="' + (isAct ? "active" : "") + '">' +
            '<div class="vx-lang-left">' +
              '<span class="vx-lang-code">' + L.id.toUpperCase() + '</span>' +
              '<div class="vx-lang-text">' +
                '<b>' + L.label + '</b>' +
                '<span>' + (L.sub || L.label) + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="vx-lang-right">' +
              (isAct ? '<span class="vx-lang-pill">Active</span><span class="vx-lang-check">' + svg("tick") + '</span>' : '') +
            '</div>' +
          '</button>'
        );
      }).join("") +
      '</div>'
    );
    bodyEl.querySelectorAll("[data-l]").forEach(function (b) {
      b.onclick = function () {
        lang = b.getAttribute("data-l");
        try { chrome.storage.local.set({ zokys_ui_lang: lang }); } catch (_) {}
        var nameSpan = b.querySelector(".vx-lang-text b");
        toast((nameSpan ? nameSpan.textContent : b.textContent) + " active");
        showLang();
      };
    });
  }

  function enableDrag(handle) {
    const onDown = (clientX, clientY, e) => {
      if (e && e.target && e.target.closest && e.target.closest(".vx-ibtn")) return;
      const r = panel.getBoundingClientRect();
      dragState = { dx: clientX - r.left, dy: clientY - r.top };
      panel.classList.add("dragging");
      panel.style.left = r.left + "px";
      panel.style.top = r.top + "px";
      panel.style.bottom = "auto";
      panel.style.right = "auto";
      if (e && e.preventDefault) e.preventDefault();
    };
    const onMove = (clientX, clientY) => {
      if (!dragState) return;
      const nx = Math.min(window.innerWidth - 48, Math.max(4, clientX - dragState.dx));
      const ny = Math.min(window.innerHeight - 48, Math.max(4, clientY - dragState.dy));
      panel.style.left = nx + "px";
      panel.style.top = ny + "px";
      pos = { left: nx, top: ny };
    };
    const onUp = () => {
      if (!dragState) return;
      dragState = null;
      panel.classList.remove("dragging");
      try { chrome.storage.local.set({ zokys_vx_pos: pos }); } catch (_) {}
    };
    handle.addEventListener("pointerdown", (e) => {
      if (e.button != null && e.button !== 0) return;
      if (e.target && e.target.closest && e.target.closest(".vx-ibtn, button, a, input")) return;
      try { handle.setPointerCapture(e.pointerId); } catch (_) {}
      onDown(e.clientX, e.clientY, e);
    });
    handle.addEventListener("pointermove", (e) => onMove(e.clientX, e.clientY));
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  }

  function killLegacy() {
    ["#ql-floating", "#zokys-fab", "#zokys-fab-root", "[data-zokys-fab]", ".sp-extension-fab",
     "#last-zone-floating-btn", "#last-zone-floating-window", "[id*='last-zone-floating']",
     "[class*='last-zone-floating']"].forEach((sel) => {
      try {
        document.querySelectorAll(sel).forEach((n) => {
          n.style.setProperty("display", "none", "important");
          n.style.setProperty("visibility", "hidden", "important");
        });
      } catch (_) {}
    });
  }

  function mount() {
    if (document.getElementById("zokys-vx-root")) return;
    root = document.createElement("div");
    root.id = "zokys-vx-root";
    root.setAttribute("data-theme", light ? "light" : "dark");
    if (light) root/* purple only */;
    const st = document.createElement("style");
    st.textContent = cssText();
    root.appendChild(st);

    panel = document.createElement("div");
    panel.id = "zokys-vx-panel";
    panel.className = "minimized";
    // Order: V7 | lang | social | download | theme | key | expand(end)
    panel.innerHTML = `
      <div id="zokys-vx-header">
        <span class="vx-brand vx-brand-icon" data-act="welcome" title="FoxGEN Pro Home" style="cursor:pointer"><img src="${(function(){try{return chrome.runtime.getURL("assets/icon48.png")}catch(e){return ""}})()}" alt="FoxGEN Pro" width="22" height="22" style="border-radius:7px;display:block;box-shadow:0 0 12px rgba(6,182,212,.45)"/></span>
        <button class="vx-ibtn" data-act="lang" title="Language">${svg("lang")}</button>
                <button class="vx-ibtn" data-act="shield" title="AntiProtect">${svg("shield")}</button>
        <button class="vx-ibtn" data-act="features" title="Features">${svg("features")}</button>
        <button class="vx-ibtn" data-act="chat" title="Chat">${svg("chat")}</button>
        <button class="vx-ibtn" data-act="license" title="License">${svg("key")}</button>
        <button class="vx-ibtn" data-act="chev" title="Expand" style="transition:transform .4s cubic-bezier(.32,.72,0,1)">${svg("chev")}</button>
      </div>
      <div id="zokys-vx-body"></div>`;
    root.appendChild(panel);
    document.documentElement.appendChild(root);
    bodyEl = panel.querySelector("#zokys-vx-body");

    if (pos && typeof pos.left === "number") {
      panel.style.left = pos.left + "px";
      panel.style.top = pos.top + "px";
      panel.style.bottom = "auto";
    }

    enableDrag(panel.querySelector("#zokys-vx-header"));

    function applyTheme(next) {
      light = !!next;
      if (root) {
        root.classList.toggle("light", light);
        root.setAttribute("data-theme", light ? "light" : "dark");
      }
      if (panel) {
        panel.classList.toggle("vx-light", light);
      }
      try { chrome.storage.local.set({ zokys_ui_light: light }); } catch (_) {}
    }

    panel.addEventListener("pointerdown", (e) => {
      const b = e.target.closest("[data-act]");
      if (b) e.stopPropagation();
    }, true);

    panel.addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      e.preventDefault();
      e.stopPropagation();
      const a = b.getAttribute("data-act");
      panel.querySelectorAll(".vx-ibtn").forEach((x) => x.classList.remove("active-sky"));
      if (a !== "theme" && a !== "chev" && a !== "welcome") b.classList.add("active-sky");
      if (a === "welcome") {
        expand(true);
        showWelcome();
      } else if (a === "lang") showLang();
      else if (a === "social") showSocial();
      else if (a === "chev") {
        var isMin = panel.classList.contains("minimized");
        if (!isMin && expanded) {
          expand(false);
        } else {
          expand(true);
          try {
            showWelcome();
          } catch (err) {
            try { console.warn(err); } catch (_) {}
            setBody('<div class="zk-welcome-title">Welcome</div><div class="zk-welcome-text">FoxGEN Pro is ready.</div>');
          }
        }
      } else if (a === "shield") showAntiProtect();
      else if (a === "features") showFeatures();
      else if (a === "chat") showlovaXChat();
      else if (a === "license") showLicense();
    });

    killLegacy();
    setInterval(killLegacy, 4000);
    try {
      new MutationObserver(killLegacy).observe(document.documentElement, { childList: true, subtree: true });
    } catch (_) {}
  }

  function boot() {
    try {
      chrome.storage.local.get(["zokys_ui_lang", "zokys_ui_light", "zokys_vx_pos"], (s) => {
        if (s && s.zokys_ui_lang) lang = s.zokys_ui_lang;
        if (s && s.zokys_ui_light) light = !!s.zokys_ui_light;
        if (s && s.zokys_vx_pos) pos = s.zokys_vx_pos;
        mount();
      });
    } catch (_) { mount(); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else 
  /* Live free-prompt counter in license panel */
  try {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area !== "local") return;
      if (!changes.zokys_free_left && !changes.zokys_free_reset_at) return;
      try {
        const card = bodyEl && bodyEl.querySelector && bodyEl.querySelector("#vx-free-card");
        if (!card) return;
        chrome.storage.local.get(["zokys_free_left", "zokys_free_reset_at", "zokys_free_max"], function (s) {
          let left = typeof s.zokys_free_left === "number" ? s.zokys_free_left : 20;
          let resetAt = s.zokys_free_reset_at || 0;
          const max = s.zokys_free_max || 20;
          if (resetAt && Date.now() >= resetAt) { left = max; resetAt = 0; }
          const pct = Math.max(0, Math.min(100, (left / max) * 100));
          const fillCls = left <= 0 ? "empty" : left <= 3 ? "low" : "";
          let hintCls = "ok", hintText = "Unlimited chats · no limit";
          if (left <= 0) {
            const ms = Math.max(0, (resetAt || 0) - Date.now());
            const mins = Math.ceil(ms / 60000);
            hintCls = "warn";
            hintText = mins > 0 ? (mins + " min baad free prompts reset · refresh page") : "—s baad free credits aayenge · page refresh karo";
          } else if (left <= 3) {
            hintCls = "warn";
            hintText = left + " free prompts left · use carefully";
          }
          const countEl = card.querySelector(".fr-count");
          const fillEl = card.querySelector(".fr-fill");
          const hintEl = card.querySelector(".fr-hint");
          if (countEl) countEl.innerHTML = left + '<span class="dim"> / ' + max + "</span>";
          if (fillEl) {
            fillEl.style.width = pct + "%";
            fillEl.className = "fr-fill " + fillCls;
          }
          if (hintEl) {
            hintEl.className = "fr-hint " + hintCls;
            hintEl.textContent = hintText;
          }
        });
      } catch (_) {}
    });
  } catch (_) {}


  try {
    chrome.storage.local.get(["zokys_auto_approve"], function (s) {
      if (s && s.zokys_auto_approve) {
        autoApprove = true;
        startAutoApprove();
      }
    });
  } catch (_) {}

  boot();
})();
