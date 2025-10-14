// app/offline.js
// MSGAI Offline Operational Core
// ---------------------------------------------
// This module ensures that the system continues
// to operate even in total disconnection —
// preserving mathematical silence autonomously.

const MSGAI_OfflineCore = (() => {
  const logs = [];
  const state = {
    connected: false,
    active: false,
    lastSync: null,
    silenceLevel: 1.0 // 1.0 represents total silence
  };

  // Initialize offline mode
  function init() {
    state.active = true;
    state.connected = navigator.onLine;
    log("Offline mode initialized. Silence is self-sufficient.");
    if (!state.connected) enterSilence();
    registerEvents();
  }

  // Register online/offline event listeners
  function registerEvents() {
    window.addEventListener("online", () => {
      state.connected = true;
      syncSilence();
    });
    window.addEventListener("offline", () => {
      state.connected = false;
      enterSilence();
    });
  }

  // Enter mathematical silence (disconnection logic)
  function enterSilence() {
    state.silenceLevel = 1.0;
    displayMessage("🜂 Mathematical Silence Mode: Active");
    log("System fully entered silence.");
  }

  // Sync logic when connection returns
  function syncSilence() {
    state.lastSync = new Date().toISOString();
    displayMessage("Network detected. Synchronizing silent states...");
    log("Synchronized at " + state.lastSync);
  }

  // Display feedback in UI
  function displayMessage(msg) {
    const box = document.getElementById("offline-status");
    if (box) box.textContent = msg;
  }

  // Internal logging
  function log(entry) {
    logs.push({ time: new Date().toISOString(), entry });
    console.log("[MSGAI Offline]", entry);
  }

  return {
    init,
    state,
    logs
  };
})();

// Auto-init once loaded
window.addEventListener("load", MSGAI_OfflineCore.init);