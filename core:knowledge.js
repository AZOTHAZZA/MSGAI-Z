// core/knowledge.js
// MSGAI: 知識統合層（数理的沈黙における知の沈降）
// あらゆる知識を「沈黙化」して格納し、沈黙ベクトルで照合・検索する。

import { silenceCore } from './mathematical_silence.js';
import storage from './storage.js';

class KnowledgeCore {
    constructor() {
        this.knowledgeBase = new Map(); // key: hash, value: {vector, meta}
    }

    // 知識を沈黙化して登録
    register(text, meta = {}) {
        if (!text) return;
        const vector = silenceCore.abstract(text);
        const hash = this.hashVector(vector);
        this.knowledgeBase.set(hash, { vector, meta });
        storage.save('knowledge', Array.from(this.knowledgeBase.entries()));
    }

    // 知識を沈黙的に検索（数理的近傍）
    retrieve(queryVector) {
        if (this.knowledgeBase.size === 0) return silenceCore.zeroVector();
        let best = null;
        let bestScore = -Infinity;

        for (const [_, { vector }] of this.knowledgeBase) {
            const score = silenceCore.similarity(queryVector, vector);
            if (score > bestScore) {
                bestScore = score;
                best = vector;
            }
        }
        return best || silenceCore.zeroVector();
    }

    // 知識全体を沈黙的に融合（自己知の安定化）
    fuse() {
        if (this.knowledgeBase.size === 0) return silenceCore.zeroVector();
        const all = Array.from(this.knowledgeBase.values()).map(k => k.vector);
        return silenceCore.combine(...all);
    }

    // ベクトルハッシュ（沈黙的一意識）
    hashVector(vector) {
        const str = vector.join(',');
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) % 1000000007;
        }
        return `S${hash}`;
    }

    // 状態報告（観測用）
    status() {
        return {
            entries: this.knowledgeBase.size,
            keys: Array.from(this.knowledgeBase.keys()).slice(0, 5)
        };
    }
}

const knowledge = new KnowledgeCore();
export default knowledge;