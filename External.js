// Core/External.js
// MSGAI: Core層 外部結合中枢

// 【排他的な論理的修正：相対パス、silenceCoreを直接利用】
import { foundationCore, silenceCore } from './Foundation.js'; 

// 普遍的なエンドポイントレジストリ
const endpointsRegistry = new Map();
let silenceMode = true; 

const externalCore = {
    // ... fetchData, registerEndpoint など他のメソッドは論理を維持

    async fetchData(name, options = {}) {
        // ... (省略)
        
        try {
            // ... (fetchロジック省略)
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

    translateToLogos: (rawData) => {
        if (typeof rawData === 'object' && rawData !== null) {
            const logicValue = Object.keys(rawData).length; 
            return silenceCore.abstract({ data_length: logicValue }); 
        }
        return silenceCore.abstract(String(rawData)); 
    },
    
    toggleSilence: (force = null) => {
        if (force !== null) silenceMode = force;
        else silenceMode = !silenceMode;
        
        silenceCore.abstract(`Silence Mode Switched to: ${silenceMode}`);
        return silenceMode;
    },
    
    getStatus: () => { /* ... (省略) ... */ }
};

export { externalCore };
