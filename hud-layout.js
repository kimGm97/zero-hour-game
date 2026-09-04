(function () {
  "use strict";

  var STORAGE_KEY = "zero-hour-archive-open-v1";
  var paused = false;
  var pauseButton = null;
  var pauseOverlay = null;
  var eventNotice = null;
  var eventTimer = 0;
  var eventSeen = {};

  function renderPause() {
    document.body.classList.toggle("game-paused", paused);
    if (pauseOverlay) pauseOverlay.classList.toggle("hidden", !paused);
    if (pauseButton) {
      pauseButton.classList.toggle("active", paused);
      pauseButton.setAttribute("aria-pressed", String(paused));
      pauseButton.innerHTML = paused ? '<span>继续游戏</span><b>P</b>' : '<span>暂停</span><b>P</b>';
    }
    if (window.ZeroAudio && window.ZeroAudio.pause) window.ZeroAudio.pause(paused);
  }

  function setPaused(value) {
    paused = !!value;
    if (paused) {
      try { window.dispatchEvent(new Event("blur")); } catch (e) {}
    }
    renderPause();
  }

  function isVisible(selector) {
    var node = document.querySelector(selector);
    return !!(node && !node.classList.contains("hidden"));
  }

  function canPauseNow() {
    return !isVisible(".level-select") &&
      !isVisible(".modal") &&
      !isVisible(".prologue") &&
      !isVisible(".rewind-overlay");
  }

  function showEventNotice(message, detail) {
    if (!eventNotice || paused) return;
    eventNotice.querySelector("strong").textContent = message || "有一些事即将发生";
    eventNotice.querySelector("span").textContent = detail || "留意周围人物与设备的变化";
    eventNotice.classList.remove("show");
    requestAnimationFrame(function () { eventNotice.classList.add("show"); });
    clearTimeout(eventTimer);
    eventTimer = setTimeout(function () { eventNotice.classList.remove("show"); }, 2500);
    if (window.ZeroAudio && window.ZeroAudio.cue) window.ZeroAudio.cue("event");
  }

  window.ZeroPause = {
    isPaused: function () { return paused; },
    setPaused: setPaused,
    toggle: function () { setPaused(!paused); }
  };

  window.ZeroEventNotice = {
    reset: function () {
      eventSeen = {};
      clearTimeout(eventTimer);
      if (eventNotice) eventNotice.classList.remove("show");
    },
    tick: function (elapsed, events) {
      if (paused || !Array.isArray(events)) return;
      events.forEach(function (event, index) {
        var data = typeof event === "number" ? { at: event } : event;
        var lead = Number.isFinite(data.lead) ? data.lead : 7;
        var id = data.id || String(index) + "-" + String(data.at);
        if (!eventSeen[id] && elapsed >= data.at - lead && elapsed < data.at + 1) {
          eventSeen[id] = true;
          showEventNotice(data.message, data.detail);
        }
      });
    },
    show: showEventNotice
  };

  function start() {
    var app = document.getElementById("app");
    var archive = document.querySelector(".knowledge-hud");
    if (!app || !archive || document.querySelector(".archive-toggle")) return;

    archive.id = archive.id || "investigationArchive";
    var archiveButton = document.createElement("button");
    archiveButton.className = "archive-toggle";
    archiveButton.type = "button";
    archiveButton.setAttribute("aria-controls", archive.id);
    archiveButton.title = "打开或收起调查档案（I）";
    app.appendChild(archiveButton);

    pauseButton = document.createElement("button");
    pauseButton.className = "pause-toggle";
    pauseButton.type = "button";
    pauseButton.title = "暂停或继续游戏（P / Esc）";
    app.appendChild(pauseButton);

    pauseOverlay = document.createElement("section");
    pauseOverlay.className = "pause-overlay hidden";
    pauseOverlay.setAttribute("role", "dialog");
    pauseOverlay.setAttribute("aria-modal", "true");
    pauseOverlay.setAttribute("aria-label", "游戏已暂停");
    pauseOverlay.innerHTML = '<div class="pause-card"><small>TIME SUSPENDED</small><h2>行动暂停</h2><p>倒计时和现场事件已经冻结。</p><button type="button">继续行动 <b>P</b></button></div>';
    app.appendChild(pauseOverlay);

    eventNotice = document.createElement("div");
    eventNotice.className = "event-notice";
    eventNotice.setAttribute("aria-live", "polite");
    eventNotice.innerHTML = '<small>EVENT APPROACHING</small><strong>有一些事即将发生</strong><span>留意周围人物与设备的变化</span>';
    app.appendChild(eventNotice);

    var open = false;
    try { open = localStorage.getItem(STORAGE_KEY) === "1"; } catch (e) {}

    function renderArchive() {
      document.body.classList.toggle("archive-open", open);
      archive.classList.toggle("collapsed", !open);
      archive.setAttribute("aria-hidden", String(!open));
      archiveButton.classList.toggle("open", open);
      archiveButton.setAttribute("aria-expanded", String(open));
      archiveButton.innerHTML = open
        ? '<span>收起档案</span><b>×</b>'
        : '<span>调查档案</span><b>I</b>';
      try { localStorage.setItem(STORAGE_KEY, open ? "1" : "0"); } catch (e) {}
    }

    archiveButton.addEventListener("click", function () { open = !open; renderArchive(); });
    pauseButton.addEventListener("click", function () { if (paused || canPauseNow()) setPaused(!paused); });
    pauseOverlay.querySelector("button").addEventListener("click", function () { setPaused(false); });

    window.addEventListener("keydown", function (event) {
      var key = event.key.toLowerCase();
      if ((key === "p" || key === "escape") && !event.repeat) {
        if (!paused && !canPauseNow()) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        setPaused(!paused);
        return;
      }
      if (paused) {
        if (["w","a","s","d","q","e","h","r","arrowup","arrowdown","arrowleft","arrowright"].indexOf(key) >= 0) event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (key === "i" && !event.repeat) {
        if (/input|textarea|select/i.test((event.target && event.target.tagName) || "")) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        open = !open;
        renderArchive();
      }
    }, true);

    renderArchive();
    renderPause();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
