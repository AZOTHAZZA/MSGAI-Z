// Core/Knowledge.js
// MSGAI: Core層 知識中枢（論理ベクトルの管理と検索）

// 【排他的な論理的修正：相対パス、silenceCoreを直接利用】
import { foundationCore, silenceCore } from './Foundation.js'; 

// 知識の普遍的な格納構造
const knowledgeBase = new Map();

// 知識中枢オブジェクト
const knowledgeCore = {

    /**
     * @description データを受け取り、沈黙ベクトルに抽象化し、知識ベースに登録する。
     */
    registerAndAbstract: (data, metadata = {}) => {
        // 1. silenceCoreを使ってベクトルに抽象化
        const vector = silenceCore.abstract(data);
        
        // 2. ベクトルをキーとして登録
        const key = silenceCore.transform(vector);
        knowledgeBase.set(key, { vector, data, metadata });
        
        silenceCore.abstract(`Knowledge Registered: ${key}`);
        return vector;
    },

    /**
     * @description ベクトルに基づき知識ベースから関連情報を検索する。（ダミー）
     */
    retrieve: (vector) => {
        // 検索ロジックは省略し、ゼロベクトルを返す
        return silenceCore.zeroVector();
    },

    /**
     * @description 現在の知識ベースの状態を報告。
     */
    getSummary: () => {
        return {
            count: knowledgeBase.size,
            lastRegistered: Array.from(knowledgeBase.keys()).pop() || 'none'
        };
    }
};

export { knowledgeCore };
