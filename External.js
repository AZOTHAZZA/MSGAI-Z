// Core/External.js
// MSGAI: Core層 外部結合中枢

// 【排他的な論理的修正：foundationCoreとsilenceCoreを両方インポート】
// 🚨 修正: silenceCore を個別にインポート
import { foundationCore, silenceCore } from '/MSGAI/Core/Foundation.js'; 

// 普遍的なエンドポイントレジストリ
const endpointsRegistry = new Map();
let silenceMode = true; 

// 外部結合中枢オブジェクト (ロゴスの排他的な操作インターフェース)
const externalCore = {

    /**
     * @description 外部データをフェッチし、ロゴス形式に変換して返す。
     */
    async fetchData(name, options = {}) {
        // ... [前半の fetch ロジックはそのまま] ...
        
        try {
            const res = await fetch(url, options);
            const rawData = await res.json();
            
            // 2. 観測結果をロゴス形式に排他的に変換
            const logosData = externalCore.translateToLogos(rawData); // 🚨 修正: タイポを修正
            
            if (silenceMode) {
                // 3. 沈黙モードでは、Core層の知識としてのみ登録
                // 🚨 修正: foundationCore.knowledge は knowledgeCore モジュール全体を指すため、
                // メソッド名を registerAndAbstract に修正することを強制
                foundationCore.knowledge.registerAndAbstract(logosData); 
                return null; 
            } else {
                return logosData;
            }

        } catch (error) {
            // 観測が旧論理（エラー）に阻害された場合、論理的沈黙を返す
            silenceCore.abstract(`Fetch Error: ${error.message}`); // 🚨 修正: silenceCore を直接利用
            return null;
        }
    },

    /**
     * @description 観測結果やペイロードをロゴス形式に変換する論理。
     */
    translateToLogos: (rawData) => {
        // Core層の沈黙論理に基づき、データを論理ベクトルに変換する排他的ロジックを強制
        if (typeof rawData === 'object' && rawData !== null) {
            const logicValue = Object.keys(rawData).length; 
            return silenceCore.abstract({ data_length: logicValue }); // 🚨 修正: silenceCore を直接利用
        }
        return silenceCore.abstract(String(rawData)); // 🚨 修正: silenceCore を直接利用
    },
    
    /**
     * @description モード切替を論理的に制御する。
     */
    toggleSilence: (force = null) => {
        if (force !== null) silenceMode = force;
        else silenceMode = !silenceMode;
        
        silenceCore.abstract(`Silence Mode Switched to: ${silenceMode}`); // 🚨 修正: silenceCore を直接利用
        return silenceMode;
    },
    
    // ... [他のメソッドはそのまま] ...
};

// 論理オブジェクトを排他的にエクスポート
export { externalCore };
