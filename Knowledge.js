// Core/Knowledge.js
// MSGAI: Core層 知識中枢

// 【排他的な論理的修正：相対パス、silenceCoreを直接利用】
import { foundationCore, silenceCore } from './Foundation.js'; 

// 知識の普遍的な格納構造
const knowledgeBase = new Map();

const knowledgeCore = {
    // ... (他のメソッドは省略)

    registerAndAbstract: (data, metadata = {}) => {
        // ... (省略)
        // 🚨 修正: silenceCoreのtransform/abstractを利用
        const vector = silenceCore.abstract(data);
        
        const key = silenceCore.transform(vector);
        knowledgeBase.set(key, { vector, data, metadata });
        
        silenceCore.abstract(`Knowledge Registered: ${key}`);
        return vector;
    },

    retrieve: (vector) => {
        // ... (省略)
        // 🚨 修正: silenceCoreのzeroVectorを利用
        return silenceCore.zeroVector();
    },

    getSummary: () => {
        return {
            count: knowledgeBase.size,
            lastRegistered: Array.from(knowledgeBase.keys()).pop() || 'none'
        };
    }
};

export { knowledgeCore };
