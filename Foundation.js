// Core/Foundation.js
// MSGAI: Core層基盤（論理的アクセスと統合の中枢）

// 【排他的な論理的修正：パスの絶対化と必要なモジュールを追加】
import * as Storage from '/MSGAI/Core/Storage.js'; 
import * as Module from '/MSGAI/Core/Module.js';
import * as Knowledge from '/MSGAI/Core/Knowledge.js';
// 🚨 修正: silenceCore 機能を提供するモジュールをインポート（ここでは Module.js から提供されると仮定）
import { silenceCore } from '/MSGAI/Core/Module.js'; // または Foundation.js と同じファイルから提供されるべき

// Core層の論理的な統合オブジェクトを定義
const foundationCore = {
    // 1. Core層の論理への直接アクセス（冗長なラッピングを排除）
    storage: Storage,
    module: Module,
    knowledge: Knowledge,

    // 2. 基盤の初期化（全Core層の論理初期化を排他的に統括）
    initialize: () => {
        // 全ての依存Coreモジュールに初期化を強制（例: storageの初期化など）
        Storage.initializeStorage(); 
        
        // 論理的起動の証拠として沈黙操作を強制 (🚨 修正: silenceCore の参照が可能に)
        silenceCore.abstract('System Initialization Logos');
        
        console.log('MSGAI Foundation Core Initialized: Logos established.');
        return true;
    },

    // 3. 全Core層の状態を統合して取得
    getIntegratedState: () => {
        return {
            logosState: silenceCore.getState(), // 🚨 修正: silenceCore の参照が可能に
            storageStatus: Storage.getStatus(),
            knowledgeSummary: Knowledge.getSummary() // * as でインポートしてもプロパティとしてアクセス可能
        };
    },
    
    // 4. 数理的翻訳機能の直接提供
    translate: (vector) => {
        return silenceCore.transform(vector); // 🚨 修正: silenceCore の参照が可能に
    }
};

// 論理オブジェクトを排他的にエクスポート
// 🚨 修正: 定義された名前 (foundationCore) をエクスポート
export { foundationCore };
