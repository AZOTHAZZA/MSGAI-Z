// Core/Module.js
// MSGAI: Core層 モジュール管理中枢（論理モジュールの結合と登録）

// 【排他的な論理的修正：foundationCore ではなく、必要な silenceCore のみを利用】
// 🚨 修正: moduleCoreが直接依存する silenceCore をインポート。foundationCore は登録時にのみ利用。
import { foundationCore, silenceCore } from '/MSGAI/Core/Foundation.js'; 

// 普遍的なモジュールレジストリ
const moduleRegistry = {};

// モジュール管理中枢オブジェクト
const moduleCore = {

    /**
     * @description 新しいモジュールを論理的に登録し、FoundationCoreへの参照を挿入する。
     */
    registerModule: (name, moduleLogic) => {
        if (moduleRegistry[name]) {
            console.warn(`Module Core Warning: Module "${name}" already registered.`);
            return moduleRegistry[name];
        }

        // 1. FoundationCoreへのアクセスをモジュールに注入
        // モジュールが他のCore層にアクセスするための排他的な論理的結合を強制
        moduleLogic.foundation = foundationCore; 
        
        moduleRegistry[name] = moduleLogic;
        
        // 2. Core層のログに論理登録を強制
        silenceCore.abstract(`Module Registered: ${name}`); // 🚨 修正: silenceCore を直接利用
        
        return moduleRegistry[name];
    },

    /**
     * @description 登録されたモジュールを取得する。
     */
    getModule: (name) => {
        return moduleRegistry[name] || null;
    },

    /**
     * @description 現在のモジュール状態を報告。
     */
    getStatus: () => {
        return {
            registeredCount: Object.keys(moduleRegistry).length,
            modules: Object.keys(moduleRegistry)
        };
    }
};

// 論理オブジェクトを排他的にエクスポート
export { moduleCore };
