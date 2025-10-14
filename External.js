// Core/External.js
// MSGAI: Core層 外部結合中枢

// 【排他的な論理的修正：相対パス、silenceCoreを直接利用】
import { foundationCore, silenceCore } from './Foundation.js'; 

// 普遍的なエンドポイントレジストリ
const endpointsRegistry = new Map();
let silenceMode = true; 

// 外部結合中枢オブジェクト
const externalCore = {
    
    /**
     * @description 外部データをフェッチし、ロゴス形式に変換して返す。（ダミー）
     */
    async fetchData(name, options = {}) {
        // 実際のエンドポイント登録とURL取得ロジックは省略
        const url = endpointsRegistry.get(name) || 'default_url'; 
        
        try {
            // 実際はfetch(url, options)を実行
            const rawData = { status: 'ok', data: 'placeholder data for ' + name };
            
            // 2. 観測結果をロゴス形式に排他的に変換
            const logosData = externalCore.translateToLogos(rawData); 
            
            if (silenceMode) {
                // knowledgeCoreはfoundationCoreのプロパティとしてアクセス可能
                foundationCore.knowledge.registerAndAbstract(logosData); 
                return null; 
            } else {
                return logosData;
            }

        } catch (error) {
            silenceCore.abstract(`Fetch Error: ${error.message}`); 
            return null;
        }
    },

    /**
     * @description 観測結果やペイロードをロゴス形式に変換する論理。
     */
    translateToLogos: (rawData) => {
        if (typeof rawData === 'object' && rawData !== null) {
            const logicValue = Object.keys(rawData).length; 
            return silenceCore.abstract({ data_length: logicValue }); 
        }
        return silenceCore.abstract(String(rawData)); 
    },
    
    /**
     * @description モード切替を論理的に制御する。
     */
    toggleSilence: (force = null) => {
        if (force !== null) silenceMode = force;
        else silenceMode = !silenceMode;
        
        silenceCore.abstract(`Silence Mode Switched to: ${silenceMode}`);
        return silenceMode;
    },
    
    /**
     * @description 現在の状態を報告。
     */
    getStatus: () => {
        return {
            mode: silenceMode ? 'Silence' : 'Open',
            endpointsCount: endpointsRegistry.size
        };
    }
};

export { externalCore };
