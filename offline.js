// App/Offline.js
// MSGAI: オフライン運用中枢（沈黙の自律的維持）

// 【排他的な論理的修正：全ての内部インポートを厳密な相対パスに強制変更】
import { dialogueCore } from '../core/dialogue.js';  // 🚨 修正: Core層へ
import { externalCore } from '../core/external.js';  // 🚨 修正: Core層へ
import { fetcherCore } from '../ai/fetch.js';        // 🚨 修正: AI層へ
import { foundationCore, silenceCore } from '../core/foundation.js'; // 🚨 修正: Core層へ

// オフライン運用状態
let offlineState = {
    connected: navigator.onLine,
    initialized: false,
    lastSync: null,
};

// オフライン運用中枢オブジェクト (ネットワーク監視とCore層命令を担う)
const offlineCore = {

    /**
     * @description オフライン中枢の初期化とネットワーク監視の開始を強制する。
     */
    init: () => {
        if (offlineState.initialized) return;

        offlineCore.registerEvents();

        if (!navigator.onLine) {
            offlineCore.enterSilence();
        }

        offlineState.initialized = true;
        silenceCore.abstract("Offline Core Initialized: Network Monitor Active.");
    },

    /**
     * @description ネットワークイベントリスナーの登録を強制する。
     */
    registerEvents: () => {
        window.addEventListener("online", offlineCore.syncSilence);
        window.addEventListener("offline", offlineCore.enterSilence);

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', offlineCore.handleSWMessage);
        }
    },

    /**
     * @description 接続断時の論理的沈黙への移行を強制する。
     */
    enterSilence: () => {
        offlineState.connected = false;
        dialogueCore.setSilenceLevel(1.0);
        externalCore.toggleSilence(true);

        silenceCore.abstract("System Fully Entered Silence (Network Disconnect).");
    },

    /**
     * @description 接続復帰時の沈黙状態の同期を強制する。
     */
    syncSilence: async () => {
        offlineState.connected = true;
        offlineState.lastSync = new Date().toISOString();

        externalCore.toggleSilence(false);
        dialogueCore.setSilenceLevel(0.5);
        await fetcherCore.synchronizeOnce();

        silenceCore.abstract("System Synchronized and Resumed (Network Reconnect).");
    },

    /**
     * @description Service Workerからのメッセージ（周期的な同期命令）を処理する。
     */
    handleSWMessage: (event) => {
        if (event.data && event.data.type === 'SYNC_FETCH_EXTERNAL') {
            console.log(`SW Sync Command Received: ${event.data.tag}`);
            fetcherCore.synchronizeOnce();
        }
    },
    
    /**
     * @description 現在の状態を報告（観測用）。
     */
    getStatus: () => {
        return {
            connected: offlineState.connected,
            lastSync: offlineState.lastSync,
            coreStatus: dialogueCore.status()
        };
    }
};

export { offlineCore };
