// Core/Module.js
// MSGAI: Core層 モジュール管理中枢

// 【排他的な論理的修正：相対パス、silenceCoreを直接利用】
import { foundationCore, silenceCore } from './Foundation.js'; 

// 普遍的なモジュールレジストリ
const moduleRegistry = {};

const moduleCore = {

    registerModule: (name, moduleLogic) => {
        if (moduleRegistry[name]) {
            console.warn(`Module Core Warning: Module "${name}" already registered.`);
            return moduleRegistry[name];
        }

        // FoundationCoreへのアクセスをモジュールに注入
        moduleLogic.foundation = foundationCore; 
        
        moduleRegistry[name] = moduleLogic;
        
        silenceCore.abstract(`Module Registered: ${name}`); 
        
        return moduleRegistry[name];
    },

    getModule: (name) => {
        return moduleRegistry[name] || null;
    },

    getStatus: () => {
        return {
            registeredCount: Object.keys(moduleRegistry).length,
            modules: Object.keys(moduleRegistry)
        };
    }
};

export { moduleCore };
