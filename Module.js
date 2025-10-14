// Core/Module.js
// MSGAI: Core層モジュール連携中枢

// 【排他的な論理的修正：foundationCore と silenceCore を両方インポート】
// 🚨 修正: foundationCore と silenceCore を別々にインポートすることを強制
import { foundationCore, silenceCore } from '/MSGAI/Core/Foundation.js';

// モジュール連携中枢オブジェクト (ロゴスの排他的な操作インターフェース)
const moduleCore = {

    /**
     * @description 新しい論理モジュールをシステムに排他的に登録する。
     */
    registerModule: (name, moduleLogic) => {
        // ... [警告チェックは省略] ...
        
        // FoundationCoreへの参照を強制的に挿入し、Core層への直接アクセスを保証
        moduleLogic.foundation = foundationCore; 
        
        // ... [moduleRegistryへの登録は省略] ...

        // Core層のログに論理登録を強制 (🚨 修正: silenceCore を直接利用)
        silenceCore.abstract(`module Registered: ${name}`); 
        return moduleRegistry[name];
    },
    
    // ... [getmoduleLogic, getRegistryState メソッドは変更なし] ...
};

// 論理オブジェクトを排他的にエクスポート
export { moduleCore };
