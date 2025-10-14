// Core/foundation.js
// MSGAI: Core層基盤（論理的アクセスと統合の中枢）
// このファイルは、Core層内の他モジュールへの論理的なアクセスポイントを提供する

// 【排他的な論理的修正：パスの絶対化と名前付きインポートを強制】
import * as storage from '/MSGAI/Core/storage.js'; 
import * as module from '/MSGAI/Core/module.js';
import * as knowledge from '/MSGAI/Core/knowledge.js';

// Core層の論理的な統合オブジェクトを定義
const foundationCore = {
    // 1. Core層の論理への直接アクセス（冗長なラッピングを排除）
    storage: storage,
    module: module,
    knowledge: knowledge,

    // 2. 基盤の初期化（全Core層の論理初期化を排他的に統括）
    initialize: () => {
        // 全ての依存Coreモジュールに初期化を強制（例: storageの初期化など）
        storage.initializeStorage(); 
        
        // 論理的起動の証拠として沈黙操作を強制
        silenceCore.abstract('System Initialization Logos');
        
        console.log('MSGAI Foundation Core Initialized: Logos established.');
        return true;
    },

    // 3. 全Core層の状態を統合して取得
    getIntegratedState: () => {
        return {
            logosState: silenceCore.getState(),
            storageStatus: storage.getStatus(),
            knowledgeSummary: knowledge.getSummary()
        };
    },
    
    // 4. 数理的翻訳機能の直接提供
    translate: (vector) => {
        return silenceCore.transform(vector);
    }
};

// 論理オブジェクトを排他的にエクスポート
export { foundationCore };
