/**
 * Account switch — exact Lovable UI flow (mobile + desktop):
 * 1) "Create your account" → click "Already have an account? Log in"
 * 2) Log in → fill pool email → Continue
 * 3) Password page → lovaXX127Hub → Log in
 * 4) Accept project invite
 */
(function () {
  "use strict";
  if (window.__zokysSwitchLogin11__) return;
  window.__zokysSwitchLogin11__ = true;
  if (!/lovable\.dev/i.test(location.hostname || "")) return;

  var POOL_PASS = "lovaXX127Hub";
  var tick = null;
  var finished = false;
  var phase = "boot"; /* boot | signup_to_login | email | password | invite | done */
  var emailTries = 0;
  var passTries = 0;
  var loginClicks = 0;
  var startedAt = Date.now();

  function log(m) {
    try {
      console.log("[FoxGEN Pro Switch]", phase, m);
    } catch (_) {}
  }

  function ensureShield(text) {
    var sh = document.getElementById("zokys-switch-shield");
    if (!sh) {
      sh = document.createElement("div");
      sh.id = "zokys-switch-shield";
      sh.innerHTML =
        '<style>#zokys-switch-shield{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;background:rgba(5,3,12,.88);font-family:Inter,system-ui,sans-serif;color:#f5f3ff;pointer-events:none}' +
        '#zokys-switch-shield .zk-st{font-size:14px;font-weight:800;text-align:center;padding:0 20px}' +
        '#zokys-switch-shield .zk-ss{font-size:11px;opacity:.55;text-align:center;max-width:280px}</style>' +
        '<div class="zk-st">Switching…</div><div class="zk-ss">Log in → pool account → invite</div>';
      document.documentElement.appendChild(sh);
    }
    var t = sh.querySelector(".zk-st");
    if (t && text) t.textContent = text;
    /* shield must NOT block clicks — pointer-events none */
  }

  function hideShield() {
    var sh = document.getElementById("zokys-switch-shield");
    if (sh) sh.remove();
    try {
      var rk = document.getElementById("zokys-rocket-overlay");
      if (rk) rk.remove();
      if (typeof window.__zokysSendAnimHide === "function") window.__zokysSendAnimHide();
    } catch (_) {}
  }

  function clearState(reason) {
    log("clear: " + reason);
    finished = true;
    phase = "done";
    if (tick) {
      clearInterval(tick);
      tick = null;
    }
    hideShield();
    try {
      var ids = ["zokys-switch-shield", "zokys-orbit-ov", "zokys-re-confirm"];
      for (var i = 0; i < ids.length; i++) {
        var n = document.getElementById(ids[i]);
        if (n) n.remove();
      }
      document.querySelectorAll("[id*='zokys-switch'],[class*='zokys-switch-shield']").forEach(function (el) {
        try {
          el.remove();
        } catch (_) {}
      });
    } catch (_) {}
    try {
      chrome.storage.local.set({
        zokys_switch_pending: false,
        zokys_switch_shield: false,
        zokys_switch_step: "done",
        zokys_switch_password: ""
      });
    } catch (_) {}
  }

  function pageText() {
    try {
      return (document.body && document.body.innerText) || "";
    } catch (_) {
      return "";
    }
  }

  function isCreateAccountPage() {
    var t = pageText();
    return /Create your account/i.test(t) && /Already have an account/i.test(t);
  }

  function isLoginPage() {
    var t = pageText();
    if (/Create your account/i.test(t) && !/Log in/i.test(document.title || "")) {
      /* signup unless we only see Log in heading */
    }
    return (
      /\/login|\/signin/i.test(location.pathname || "") ||
      (/^\s*Log in\s*$/m.test(t) || /Log in/i.test(t)) && /Continue/i.test(t)
    );
  }

  function isPasswordStep() {
    return !!document.querySelector('input[type="password"]');
  }

  function setReact(el, value) {
    if (!el) return;
    try {
      el.removeAttribute("readonly");
      el.removeAttribute("disabled");
      el.autocomplete = "off";
    } catch (_) {}
    try {
      el.focus();
    } catch (_) {}
    try {
      var desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
      if (desc && desc.set) {
        desc.set.call(el, "");
        el.dispatchEvent(new Event("input", { bubbles: true }));
        desc.set.call(el, value);
      } else {
        el.value = value;
      }
    } catch (_) {
      try {
        el.value = value;
      } catch (__) {}
    }
    try {
      if (el._valueTracker) el._valueTracker.setValue("");
    } catch (_) {}
    try {
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      el.dispatchEvent(new Event("blur", { bubbles: true }));
    } catch (_) {}
  }

  function click(el) {
    if (!el) return false;
    try {
      el.scrollIntoView({ block: "center", inline: "nearest" });
    } catch (_) {}
    try {
      el.click();
      return true;
    } catch (_) {
      try {
        el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
        return true;
      } catch (__) {
        return false;
      }
    }
  }

  /** Find clickable by visible text (links + buttons) */
  function findByText(re) {
    var nodes = document.querySelectorAll("a,button,[role='button'],span,div");
    var best = null;
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (!t || t.length > 80) continue;
      if (!re.test(t)) continue;
      /* prefer smaller / exact matches */
      if (!best || t.length < (best.textContent || "").length) best = el;
    }
    return best;
  }

  function emailInput() {
    return (
      document.querySelector('input[type="email"]') ||
      document.querySelector('input[name="email"]') ||
      document.querySelector('input[autocomplete="email"]') ||
      document.querySelector('input[placeholder*="mail" i]') ||
      document.querySelector('input[placeholder="Email"]')
    );
  }

  function passInput() {
    return document.querySelector('input[type="password"]');
  }

  function btnContinue() {
    var t = document.querySelector('button[data-testid="auth-submit-button"]');
    if (t) return t;
    var nodes = document.querySelectorAll("button");
    for (var i = 0; i < nodes.length; i++) {
      var x = (nodes[i].textContent || "").replace(/\s+/g, " ").trim();
      if (/^Continue$/i.test(x)) return nodes[i];
    }
    return findByText(/^Continue$/i);
  }

  function btnLogin() {
    var t = document.querySelector('button[data-testid="auth-submit-button"]');
    if (t) return t;
    var nodes = document.querySelectorAll("button");
    for (var i = 0; i < nodes.length; i++) {
      var x = (nodes[i].textContent || "").replace(/\s+/g, " ").trim();
      if (/^Log in$/i.test(x) || /^Sign in$/i.test(x)) return nodes[i];
    }
    return findByText(/^Log in$/i);
  }

  /** Step 1: Create account page → "Already have an account? Log in" */
  function stepSignupToLogin() {
    ensureShield("Open Log in…");
    phase = "signup_to_login";
    /* Exact UI: "Already have an account? Log in" — click the Log in part */
    var link =
      findByText(/^Log in$/i) ||
      findByText(/Already have an account\??\s*Log in/i) ||
      document.querySelector('a[href*="login"]');
    if (link) {
      log("click Log in link");
      click(link);
      return true;
    }
    /* fallback navigate */
    if (!sessionStorage.getItem("zokys_sw_goto_login")) {
      sessionStorage.setItem("zokys_sw_goto_login", "1");
      try {
        location.replace("https://lovable.dev/login?zokys_pool=" + Date.now());
      } catch (_) {}
    }
    return false;
  }

  /** Step 2: email + Continue */
  function stepEmail(email) {
    ensureShield("Enter pool email…");
    phase = "email";
    var em = emailInput();
    if (!em) {
      /* maybe still on create account */
      if (isCreateAccountPage()) stepSignupToLogin();
      return;
    }
    try {
      em.setAttribute("autocomplete", "off");
    } catch (_) {}
    setReact(em, email);
    emailTries++;
    if (emailTries >= 2) {
      var c = btnContinue();
      if (c && !c.disabled) {
        setReact(em, email);
        log("click Continue");
        click(c);
        emailTries = 0; /* reset for retries if stay on email */
      }
    }
  }

  /** Step 3: password + Log in */
  function stepPassword(email, password) {
    ensureShield("Enter password…");
    phase = "password";
    var pw = passInput();
    if (!pw) return;
    try {
      pw.setAttribute("autocomplete", "new-password");
    } catch (_) {}
    /* email may be shown as chip — still try input if present */
    var em = emailInput();
    if (em) setReact(em, email);

    setReact(pw, "");
    setReact(pw, password || POOL_PASS);
    passTries++;
    if (passTries >= 2 && loginClicks < 6) {
      var lb = btnLogin();
      if (lb && !lb.disabled) {
        setReact(pw, password || POOL_PASS);
        log("click Log in");
        click(lb);
        loginClicks++;
        passTries = 0;
      }
    }
  }

  function stepInvite(invite) {
    ensureShield("Accept invite…");
    phase = "invite";
    try {
      chrome.storage.local.set({
        zokys_switch_step: "invite",
        zokys_switch_pending: true,
        zokys_switch_shield: true
      });
    } catch (_) {}

    try {
      document.querySelectorAll("button,a").forEach(function (b) {
        var t = (b.textContent || "").trim().toLowerCase();
        if (/^accept$|accept invite|join project|open project|continue to project/.test(t)) click(b);
      });
    } catch (_) {}

    if (/\/projects\/[a-zA-Z0-9_-]+/i.test(location.pathname || "")) {
      setTimeout(function () {
        clearState("on-project");
      }, 800);
      return;
    }

    if (invite && invite.indexOf("http") === 0) {
      if (location.href.indexOf("/projects/") === -1) {
        try {
          location.replace(invite);
        } catch (_) {
          location.href = invite;
        }
      }
    }
  }

  function looksInApp() {
    var path = location.pathname || "";
    if (/\/projects\//i.test(path)) return true;
    if (/\/login|\/signin|\/signup|\/auth/i.test(path)) return false;
    var t = pageText();
    if (/Create your account|Already have an account\?/i.test(t) && emailInput()) return false;
    if (/\bChats\b|Work with what you've built|Send work to a project|My projects|All projects/i.test(t)) return true;
    try {
      if (document.querySelector('a[href*="/projects"]')) return true;
    } catch (_) {}
    return false;
  }

  function tickOnce(email, password, invite) {
    if (finished) return;
    if (Date.now() - startedAt > 90 * 1000) {
      /* hard stop stuck overlay */
      clearState("timeout-90s");
      return;
    }

    /* Already inside Lovable app — finish switch, drop overlay */
    if (looksInApp()) {
      if (/\/projects\//i.test(location.pathname || "")) {
        clearState("already-on-project");
        return;
      }
      if (invite && invite.indexOf("http") === 0 && location.href.indexOf(invite.split("?")[0]) === -1) {
        stepInvite(invite);
        return;
      }
      clearState("in-app");
      return;
    }

    /* After successful login clicks, leave auth pages */
    if (loginClicks > 0 && !passInput() && !/\/login|\/signin|\/signup/i.test(location.pathname || "")) {
      if (!/Create your account/i.test(pageText())) {
        stepInvite(invite);
        return;
      }
    }

    if (isPasswordStep()) {
      stepPassword(email, password);
      return;
    }

    if (isCreateAccountPage()) {
      stepSignupToLogin();
      return;
    }

    /* Login page with email field */
    if (emailInput() && !passInput()) {
      stepEmail(email);
      return;
    }

    /* Fallback: try Log in link if visible */
    if (/Already have an account/i.test(pageText())) {
      stepSignupToLogin();
      return;
    }

    /* Invite step already marked */
    chrome.storage.local.get(["zokys_switch_step"], function (s) {
      if (s && s.zokys_switch_step === "invite") stepInvite(invite);
    });
  }

  function boot() {
    if (finished) return;
    try {
      chrome.storage.local.get(
        [
          "zokys_switch_pending",
          "zokys_switch_email",
          "zokys_switch_password",
          "zokys_invite_url",
          "zokys_switch_step",
          "zokys_switch_at"
        ],
        function (s) {
          if (!s || !s.zokys_switch_pending) {
            hideShield();
            return;
          }
          if (s.zokys_switch_at && Date.now() - s.zokys_switch_at > 6 * 60 * 1000) {
            clearState("timeout");
            return;
          }

          var email = String(s.zokys_switch_email || "").trim();
          var password = String(s.zokys_switch_password || "").trim() || POOL_PASS;
          var invite = String(s.zokys_invite_url || "");

          if (!email) {
            clearState("no-email");
            return;
          }

          if (s.zokys_switch_step === "invite") {
            stepInvite(invite);
            return;
          }

          ensureShield("Switching account…");

          if (!tick) {
            tick = setInterval(function () {
              tickOnce(email, password, invite);
            }, 550);
          }
          tickOnce(email, password, invite);
        }
      );
    } catch (_) {}
  }

  boot();
  setTimeout(boot, 500);
  setTimeout(boot, 1500);
  try {
    chrome.storage.onChanged.addListener(function (ch, area) {
      if (area !== "local") return;
      if (ch.zokys_switch_pending || ch.zokys_switch_step) {
        finished = false;
        startedAt = Date.now();
        setTimeout(boot, 200);
      }
    });
  } catch (_) {}
})();
