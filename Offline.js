// App/Offline.js
// MSGAI: オフライン運用中枢（沈黙の自律的維持）
// ---------------------------------------------
// このファイルは、ネットワーク接続を監視し、Core層の論理に排他的に命令を下す。

// 【排他的な論理的修正：パスの絶対化と名前付きインポートを強制】
import { DialogueCore } from '/MSGAI/Core/Dialogue.js';
import { ExternalCore } from '/MSGAI/Core/External.js';
import { FetcherCore } from '/MSGAI/AI/FetchExternal.js'; 
import { FoundationCore } from '/MSGAI/Core/Foundation.js'; 

// オフライン運用状態
let OfflineState = {
    connected: navigator.onLine,
    initialized: false,
    lastSync: null,
};

// オフライン運用中枢オブジェクト (ネットワーク監視とCore層命令を担う)
const OfflineCore = {

    /**
     * @description オフライン中枢の初期化とネットワーク監視の開始を強制する。
     */
    init: () => {
        if (OfflineState.initialized) return; 

        OfflineCore.registerEvents();
        
        if (!navigator.onLine) {
            OfflineCore.enterSilence();
        }

        OfflineState.initialized = true;
        FoundationCore.silence.abstract("Offline Core Initialized: Network Monitor Active.");
    },

    /**
     * @description ネットワークイベントリスナーの登録を強制する。
     */
    registerEvents: () => {
        window.addEventListener("Online", OfflineCore.handleOnline);
        window.addEventListener("Offline", OfflineCore.handleOffline);
        
        // Service Workerからの同期命令を受け取るリスナーを登録 (sw.jsとの連携を強制)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', OfflineCore.handleSWMessage);
        }
    },

    /**
     * @description 接続断時の論理的沈黙への移行を強制する。
     */
    enterSilence: () => {
        OfflineState.connected = false;
        // 1. 対話層に完全沈黙レベルへの移行を命令
        DialogueCore.setSilenceLevel(1.0); 
        // 2. 外部通信を排他的に停止
        ExternalCore.toggleSilence(true); 
        
        FoundationCore.silence.abstract("System Fully Entered Silence (Network Disconnect).");
        // UI層 (fusionUI) が dialogueCore の状態を見て表示を更新すると確定
    },

    /**
     * @description 接続復帰時の沈黙状態の同期を強制する。
     */
    syncSilence: async () => {
        OfflineState.connected = true;
        OfflineState.lastSync = new Date().toISOString();
        
        // 1. 外部通信を排他的に再開
        ExternalCore.toggleSilence(false); 
        // 2. 対話層の沈黙レベルを論理的に低下
        DialogueCore.setSilenceLevel(0.5); 
        // 3. 外部取得中枢に同期を強制
        await FetcherCore.synchronizeOnce(); 

        FoundationCore.silence.abstract("System Synchronized and Resumed (Network Reconnect).");
    },
    
    /**
     * @description Service Workerからのメッセージ（周期的な同期命令）を処理する。
     */
    handleSWMessage: (event) => {
        if (event.data && event.data.type === 'SYNC_FETCH_EXTERNAL') {
            console.log(`SW Sync Command Received: ${event.data.tag}`);
            // SWからの命令に基づき、外部同期を強制実行
            FetcherCore.synchronizeOnce();
        }
    },

    // イベントハンドラーのラッパー
    handleOnline: () => OfflineCore.syncSilence(),
    handleOffline: () => OfflineCore.enterSilence(),

    /**
     * @description 現在の状態を報告（観測用）。
     */
    getStatus: () => {
        return {
            connected: OfflineState.connected,
            lastSync: OfflineState.lastSync,
            coreStatus: DialogueCore.status()
        };
    }
};

// ----------------------------------------------------
// MSGAI 起動ロジック：論理的強制実行ブロック
// ----------------------------------------------------

// このモジュールは他のCoreモジュールが初期化された後に fusionUI から呼び出されるべきですが、
// 独立したモジュールとしてエクスポート形式を強制します。
export { OfflineCore };
