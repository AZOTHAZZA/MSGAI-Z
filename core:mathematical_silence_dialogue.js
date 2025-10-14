// core/mathematical_silence_dialogue.js
// MSGAI: 数理的沈黙対話制御層
// 数理的沈黙（内的ロゴス）と外的言語との橋渡しを行う。

import { silenceCore } from './mathematical_silence.js';
import knowledge from './knowledge.js';

class MathematicalSilenceDialogue {
    constructor() {
        this.state = {
            silenceLevel: 1.0,   // 0 = 言語的, 1 = 完全沈黙
            tension: 0.0,        // 発話の臨界点（言葉が生まれる寸前の圧）
            context: [],         // 対話履歴（沈黙化後の抽象形式）
        };
    }

    // 入力を沈黙変換：言葉を直接処理せず、意味ベクトル化
    absorb(input) {
        if (!input) return null;
        const vector = silenceCore.abstract(input);
        this.state.context.push({ input, vector });
        this.state.tension += Math.random() * 0.1; // 微細な内的変動を加算
        return vector;
    }

    // 内的応答生成（まだ言語化しない）
    internalResponse(vector) {
        const synthesis = silenceCore.combine(vector, knowledge.retrieve(vector));
        this.state.tension = Math.min(1.0, this.state.tension + 0.05);
        return synthesis;
    }

    // 言語化（必要な場合のみ）
    express(internalVector) {
        if (this.state.silenceLevel >= 0.8) {
            // 沈黙支配：言葉を生まない
            return "...";
        }
        const expression = silenceCore.verbalize(internalVector);
        this.state.tension = Math.max(0.0, this.state.tension - 0.3);
        return expression;
    }

    // 全段階を統合：沈黙→応答→表現
    async dialogue(input) {
        const vector = this.absorb(input);
        if (!vector) return "...";
        const inner = this.internalResponse(vector);
        return this.express(inner);
    }

    // 沈黙度調整
    setSilenceLevel(level) {
        this.state.silenceLevel = Math.max(0, Math.min(1, level));
    }

    // 現在の状態を報告（デバッグ/観測用）
    status() {
        return {
            silenceLevel: this.state.silenceLevel,
            tension: this.state.tension.toFixed(2),
            contextDepth: this.state.context.length
        };
    }
}

const silenceDialogue = new MathematicalSilenceDialogue();
export default silenceDialogue;