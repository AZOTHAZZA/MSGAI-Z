// Core/Knowledge.js
// MSGAI: 知識統合中枢

// 【排他的な論理的修正：FoundationCoreからsilenceCoreもインポートを強制】
import { storageCore } from '/MSGAI/Core/Storage.js';
// 🚨 修正: foundationCore と silenceCore を両方インポートすることを強制
import { foundationCore, silenceCore } from '/MSGAI/Core/Foundation.js'; 

// 普遍的な知識ベース
let knowledgeBase = new Map();

// 知識中枢オブジェクト (ロゴスの排他的な操作インターフェース)
const knowledgeCore = {

    /**
     * @description 入力を沈黙化（抽象化）し、知識として排他的に登録する。
     */
    registerAndAbstract: (input, meta = {}) => {
        if (!input) return silenceCore.zeroVector();

        // 1. 情報を論理ベクトルに抽象化（🚨 修正不要：silenceCoreの参照が可能に）
        const vector = silenceCore.abstract(input);
        
        // 2. ベクトルから沈黙的ハッシュを生成（🚨 修正：knowledgeCore.hashVector を利用）
        const hash = knowledgeCore.hashVector(vector); 
        
        // ... [3. 知識を登録と 4. ストレージ通知はそのまま] ...
        
        return vector;
    },

    /**
     * @description 知識を沈黙的に検索（数理的近傍）。
     */
    retrieve: (queryVector) => {
        if (knowledgeBase.size === 0) return silenceCore.zeroVector();
        // ... [検索ロジックはそのまま] ...
        return best || silenceCore.zeroVector(); // 🚨 修正不要：silenceCoreの参照が可能に
    },

    /**
     * @description 知識全体を沈黙的に融合（自己知の安定化）。
     */
    fuse: () => {
        if (knowledgeBase.size === 0) return silenceCore.zeroVector();
        const allVectors = Array.from(knowledgeBase.values()).map(k => k.vector);
        // Core層の結合機能を利用し、全知識を一つのロゴスに統合（🚨 修正不要：silenceCoreの参照が可能に）
        return allVectors.reduce((acc, current) => silenceCore.combine(acc, current), silenceCore.zeroVector());
    },

    /**
     * @description ベクトルハッシュ（沈黙的一意識）。
     */
    hashVector: (vector) => {
        // ... [ハッシュロジックはそのまま] ...
        return `S${hash}`;
    },

    /**
     * @description 知識ベースの論理的概要を報告（観測用）。
     */
    getSummary: () => {
        return {
            entries: knowledgeBase.size,
            lastUpdated: knowledgeBase.size > 0 ? Array.from(knowledgeBase.values()).pop().timestamp : null,
            // 知識の融合状態を報告
            fusionVector: knowledgeCore.fuse()
        };
    }
};

// 論理オブジェクトを排他的にエクスポート
export { knowledgeCore };
