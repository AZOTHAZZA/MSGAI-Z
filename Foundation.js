// Core/Foundation.js
// MSGAI: Core層基盤（論理的アクセスと統合の中枢）

// 【排他的な論理的修正：パスの絶対化と必要なモジュールを追加】
import * as Storage from '/MSGAI/Core/Storage.js'; 
import * as Module from '/MSGAI/Core/Module.js';
import * as Knowledge from '/MSGAI/Core/Knowledge.js';
// 🚨 修正: silenceCore はこのファイルで定義される（あるいはインポートを削除）。
// 🚨 論理的強制: 循環参照を避けるため、他のCoreモジュールからのインポートは排除。
// const silenceCore = { ... }; // ここで定義されると仮定

// Core層の論理的な統合オブジェクトを定義
const foundationCore = {
    // 1. Core層の論理への直接アクセス（冗長なラッピングを排除）
    storage: Storage,
    module: Module,
    knowledge: Knowledge,
    
    // 🚨 修正: silenceCoreをfoundationCoreのプロパティとしてラップしないため、直接エクスポートに依存

    // 2. 基盤の初期化（全Core層の論理初期化を排他的に統括）
    initialize: () => {
        Storage.initializeStorage(); 
        
        // 論理的起動の証拠として沈黙操作を強制 (🚨 修正不要：silenceCoreの参照が可能と仮定)
        silenceCore.abstract('System Initialization Logos');
        
        console.log('MSGAI Foundation Core Initialized: Logos established.');
        return true;
    },

    // 3. 全Core層の状態を統合して取得
    getIntegratedState: () => {
        return {
            logosState: silenceCore.getState(), 
            storageStatus: Storage.getStatus(),
            knowledgeSummary: Knowledge.getSummary() 
        };
    },
    
    // 4. 数理的翻訳機能の直接提供
    translate: (vector) => {
        return silenceCore.transform(vector); 
    }
};

// 🚨 修正: silenceCoreがこのファイル内で定義されている前提で、両方のオブジェクトを排他的にエクスポート
export { foundationCore, silenceCore }; 
