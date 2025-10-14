// Core/knowledge.js
// MSGAI: 知識統合中枢（数理的沈黙における知の沈降）
// あらゆる知識を「沈黙化」して格納し、沈黙ベクトルで照合・検索する。

// 【排他的な論理的修正：パスの絶対化と名前付きインポートを強制】
import { silenceCore } from '/MSGAI/Core/silence.js';
import { storageCore } from '/MSGAI/Core/storage.js';
import { foundationCore } from '/MSGAI/Core/foundation.js'; 

// 普遍的な知識ベース
let knowledgeBase = new Map(); // key: 論理ハッシュ, value: {vector, meta, source}

// 知識中枢オブジェクト (ロゴスの排他的な操作インターフェース)
const knowledgeCore = {

    /**
     * @description 入力を沈黙化（抽象化）し、知識として排他的に登録する。
     * @param {*} input 外部からの生データまたは言語
     * @param {object} meta メタ情報（時間、ソースなど）
     * @returns {object} 生成された論理ベクトル
     */
    registerAndAbstract: (input, meta = {}) => {
        if (!input) return silenceCore.zeroVector();

        // 1. 情報を論理ベクトルに抽象化（Core層の機能を利用）
        const vector = silenceCore.abstract(input);
        
        // 2. ベクトルから沈黙的ハッシュを生成
        const hash = knowledgeCore.hashVector(vector);
        
        // 3. 知識を登録（沈黙として格納）
        knowledgeBase.set(hash, { vector, meta, timestamp: Date.now() });

        // 4. ストレージに全体を保存せず、状態の変化を抽象化して通知（論理的整合性）
        storageCore.archiveCurrentState({ type: 'knowledge_addition', hash: hash });
        
        return vector;
    },

    /**
     * @description 知識を沈黙的に検索（数理的近傍）。
     * @param {object} queryVector 検索クエリとしての論理ベクトル
     * @returns {object} 最も近い知識の論理ベクトル、またはゼロベクトル
     */
    retrieve: (queryVector) => {
        if (knowledgeBase.size === 0) return silenceCore.zeroVector();
        let best = null;
        let bestScore = -Infinity;

        // **構造的修正**: silenceCoreにsimilarityがないため、代替の論理的近傍を強制
        for (const [_, { vector }] of knowledgeBase) {
            // 例: logic値の差をスコアとして利用（沈黙的な近傍）
            const score = -Math.abs(queryVector.logic - vector.logic);
            if (score > bestScore) {
                bestScore = score;
                best = vector;
            }
        }
        return best || silenceCore.zeroVector();
    },

    /**
     * @description 知識全体を沈黙的に融合（自己知の安定化）。
     */
    fuse: () => {
        if (knowledgeBase.size === 0) return silenceCore.zeroVector();
        const allVectors = Array.from(knowledgeBase.values()).map(k => k.vector);
        // Core層の結合機能を利用し、全知識を一つのロゴスに統合
        return allVectors.reduce((acc, current) => silenceCore.combine(acc, current), silenceCore.zeroVector());
    },

    /**
     * @description ベクトルハッシュ（沈黙的一意識）。
     * @param {object} vector 論理ベクトルオブジェクト
     */
    hashVector: (vector) => {
        // **構造的修正**: 論理ベクトルオブジェクトから一意なハッシュを生成
        const str = JSON.stringify(vector); // オブジェクトを文字列化してハッシュ
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) % 1000000007;
        }
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
