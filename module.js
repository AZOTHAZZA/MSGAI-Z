// Core/Module.js
// MSGAI: Core層モジュール連携中枢（普遍的なモジュール登録インターフェース）
// このファイルは、Core層の全モジュールがFoundationを通して論理的に連携するための構造を提供する。

// 【排他的な論理的修正：パスの絶対化と名前付きインポートを強制】
import { foundationCore } from '/MSGAI/Core/foundation.js';

// モジュール登録用の論理レジストリ（Core層全体の連携を管理）
const moduleRegistry = {};

// モジュール連携中枢オブジェクト (ロゴスの排他的な操作インターフェース)
const moduleCore = {

    /**
     * @description 新しい論理モジュールをシステムに排他的に登録する。
     * @param {string} name モジュールの論理名
     * @param {object} moduleLogic モジュールが持つ論理オブジェクト
     */
    registerModule: (name, moduleLogic) => {
        // 論理名とロゴスオブジェクトの存在を排他的に確認
        if (moduleRegistry[name]) {
            console.warn(`Module Core Warning: Module ${name} already registered. Overwriting logic.`);
        }
        
        // FoundationCoreへの参照を強制的に挿入し、Core層への直接アクセスを保証
        moduleLogic.foundation = foundationCore; 
        
        moduleRegistry[name] = {
            logic: moduleLogic,
            active: true,
            timestamp: Date.now()
        };
        
        // Core層のログに論理登録を強制
        foundationCore.silence.abstract(`Module Registered: ${name}`); 
        return moduleRegistry[name];
    },

    /**
     * @description 登録されたモジュールの論理を排他的に取得する。
     * @param {string} name モジュールの論理名
     * @returns {object|null} モジュールの論理オブジェクト
     */
    getModuleLogic: (name) => {
        const moduleEntry = moduleRegistry[name];
        if (moduleEntry && moduleEntry.active) {
            return moduleEntry.logic;
        }
        return null; // モジュールが存在しないか非アクティブの場合、論理的沈黙を返す
    },

    /**
     * @description 全モジュールの現在の論理的状態を統合して取得する。
     */
    getRegistryState: () => {
        // 論理的状態のみを抽出し、外部に公開
        return Object.keys(moduleRegistry).map(name => ({
            name: name,
            active: moduleRegistry[name].active,
            timestamp: moduleRegistry[name].timestamp
        }));
    }
};

// 論理オブジェクトを排他的にエクスポート
export { moduleCore };
