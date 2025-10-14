// App/Offline.js
// MSGAI: オフライン運用中枢（沈黙の自律的維持）

// 【排他的な論理的修正：パスと命名規則を全て小文字（camelCase）に統一し、silenceCoreを追加】
import { dialogueCore } from '/MSGAI/Core/Dialogue.js'; // 🚨 修正: 小文字に統一
import { externalCore } from '/MSGAI/Core/External.js'; // 🚨 修正: 小文字に統一
import { fetcherCore } from '/MSGAI/AI/Fetch.js'; // 🚨 修正: パスを /AI/Fetch.js に変更し、小文字に統一
import { foundationCore, silenceCore } from '/MSGAI/Core/Foundation.js'; // 🚨 修正: silenceCore を追加し、小文字に統一

// オフライン運用状態
let offlineState = { // 🚨 修正: offlineState (小文字) に統一
    connected: navigator.onLine,
    initialized: false,
    lastSync: null,
};

// オフライン運用中枢オブジェクト (ネットワーク監視とCore層命令を担う)
const offlineCore = { // 🚨 修正: offlineCore (小文字) に統一

    /**
     * @description オフライン中枢の初期化とネットワーク監視の開始を強制する。
     */
    init: () => {
        if (offlineState.initialized) return; // 🚨 修正: offlineState を利用

        offlineCore.registerEvents(); // 🚨 修正: offlineCore を利用
        
        if (!navigator.onLine) {
            offlineCore.enterSilence(); // 🚨 修正: offlineCore を利用
        }

        offlineState.initialized = true; // 🚨 修正: offlineState を利用
        // 🚨 修正: silenceCore を直接利用
        silenceCore.abstract("Offline Core Initialized: Network Monitor Active."); 
    },

    /**
     * @description ネットワークイベントリスナーの登録を強制する。
     */
    registerEvents: () => {
        window.addEventListener("online", offlineCore.handleOnline); // 🚨 修正: 小文字のイベント名、offlineCore を利用
        window.addEventListener("offline", offlineCore.handleOffline); // 🚨 修正: 小文字のイベント名、offlineCore を利用
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', offlineCore.handleSWMessage); // 🚨 修正: offlineCore を利用
        }
    },

    /**
     * @description 接続断時の論理的沈黙への移行を強制する。
     */
    enterSilence: () => {
        offlineState.connected = false; // 🚨 修正: offlineState を利用
        // 1. 対話層に完全沈黙レベルへの移行を命令
        dialogueCore.setSilenceLevel(1.0); // 🚨 修正: dialogueCore を利用
        // 2. 外部通信を排他的に停止
        externalCore.toggleSilence(true); // 🚨 修正: externalCore を利用
        
        silenceCore.abstract("System Fully Entered Silence (Network Disconnect)."); // 🚨 修正: silenceCore を利用
    },

    /**
     * @description 接続復帰時の沈黙状態の同期を強制する。
     */
    syncSilence: async () => {
        offlineState.connected = true; // 🚨 修正: offlineState を利用
        offlineState.lastSync = new Date().toISOString(); // 🚨 修正: offlineState を利用
        
        // 1. 外部通信を排他的に再開
        externalCore.toggleSilence(false); // 🚨 修正: externalCore を利用
        // 2. 対話層の沈黙レベルを論理的に低下
        dialogueCore.setSilenceLevel(0.5); // 🚨 修正: dialogueCore を利用
        // 3. 外部取得中枢に同期を強制
        await fetcherCore.synchronizeOnce(); // 🚨 修正: fetcherCore を利用

        silenceCore.abstract("System Synchronized and Resumed (Network Reconnect)."); // 🚨 修正: silenceCore を利用
    },
    
    /**
     * @description Service Workerからのメッセージ（周期的な同期命令）を処理する。
     */
    handleSWMessage: (event) => {
        if (event.data && event.data.type === 'SYNC_FETCH_EXTERNAL') {
            console.log(`SW Sync Command Received: ${event.data.tag}`);
            // SWからの命令に基づき、外部同期を強制実行
            fetcherCore.synchronizeOnce(); // 🚨 修正: fetcherCore を利用
        }
    },

    // イベントハンドラーのラッパー
    handleOnline: () => offlineCore.syncSilence(), // 🚨 修正: offlineCore を利用
    handleOffline: () => offlineCore.enterSilence(), // 🚨 修正: offlineCore を利用

    /**
     * @description 現在の状態を報告（観測用）。
     */
    getStatus: () => {
        return {
            connected: offlineState.connected, // 🚨 修正: offlineState を利用
            lastSync: offlineState.lastSync, // 🚨 修正: offlineState を利用
            coreStatus: dialogueCore.status() // 🚨 修正: dialogueCore を利用
        };
    }
};

// ----------------------------------------------------
// MSGAI 起動ロジック：論理的強制実行ブロック
// ----------------------------------------------------

// 🚨 修正: 定義されたオブジェクト名 (offlineCore) をエクスポート
export { offlineCore };
