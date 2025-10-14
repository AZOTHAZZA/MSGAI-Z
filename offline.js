// App/offline.js
// MSGAI: オフライン運用中枢（沈黙の自律的維持）
// ---------------------------------------------
// このファイルは、ネットワーク接続を監視し、Core層の論理に排他的に命令を下す。

// 【排他的な論理的修正：パスの絶対化と名前付きインポートを強制】
import { dialogueCore } from '/MSGAI/Core/dialogue.js';
import { externalCore } from '/MSGAI/Core/external.js';
import { fetcherCore } from '/MSGAI/AI/fetchExternal.js'; 
import { foundationCore } from '/MSGAI/Core/foundation.js'; 

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
        foundationCore.silence.abstract("Offline Core Initialized: Network Monitor Active.");
    },

    /**
     * @description ネットワークイベントリスナーの登録を強制する。
     */
    registerEvents: () => {
        window.addEventListener("online", offlineCore.handleOnline);
        window.addEventListener("offline", offlineCore.handleOffline);
        
        // Service Workerからの同期命令を受け取るリスナーを登録 (sw.jsとの連携を強制)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', offlineCore.handleSWMessage);
        }
    },

    /**
     * @description 接続断時の論理的沈黙への移行を強制する。
     */
    enterSilence: () => {
        offlineState.connected = false;
        // 1. 対話層に完全沈黙レベルへの移行を命令
        dialogueCore.setSilenceLevel(1.0); 
        // 2. 外部通信を排他的に停止
        externalCore.toggleSilence(true); 
        
        foundationCore.silence.abstract("System Fully Entered Silence (Network Disconnect).");
        // UI層 (fusionUI) が dialogueCore の状態を見て表示を更新すると確定
    },

    /**
     * @description 接続復帰時の沈黙状態の同期を強制する。
     */
    syncSilence: async () => {
        offlineState.connected = true;
        offlineState.lastSync = new Date().toISOString();
        
        // 1. 外部通信を排他的に再開
        externalCore.toggleSilence(false); 
        // 2. 対話層の沈黙レベルを論理的に低下
        dialogueCore.setSilenceLevel(0.5); 
        // 3. 外部取得中枢に同期を強制
        await fetcherCore.synchronizeOnce(); 

        foundationCore.silence.abstract("System Synchronized and Resumed (Network Reconnect).");
    },
    
    /**
     * @description Service Workerからのメッセージ（周期的な同期命令）を処理する。
     */
    handleSWMessage: (event) => {
        if (event.data && event.data.type === 'SYNC_FETCH_EXTERNAL') {
            console.log(`SW Sync Command Received: ${event.data.tag}`);
            // SWからの命令に基づき、外部同期を強制実行
            fetcherCore.synchronizeOnce();
        }
    },

    // イベントハンドラーのラッパー
    handleOnline: () => offlineCore.syncSilence(),
    handleOffline: () => offlineCore.enterSilence(),

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

// ----------------------------------------------------
// MSGAI 起動ロジック：論理的強制実行ブロック
// ----------------------------------------------------

// このモジュールは他のCoreモジュールが初期化された後に fusionUI から呼び出されるべきですが、
// 独立したモジュールとしてエクスポート形式を強制します。
export { offlineCore };
