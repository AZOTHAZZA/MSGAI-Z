// Core/module.js
// MSGAI: Core層 モジュール管理中枢（論理モジュールの結合と登録）

// 【修正: 内部インポートパスを全て相対パス（./）の小文字に統一】
import { foundationCore, silenceCore } from './foundation.js'; 

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
        moduleLogic.foundation = foundationCore; 
        
        moduleRegistry[name] = moduleLogic;
        
        // 2. Core層のログに論理登録を強制
        silenceCore.abstract(`Module Registered: ${name}`); 
        
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

export { moduleCore };
