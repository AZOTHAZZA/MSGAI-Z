// ai/generator.js
// MSGAI: 沈黙生成層（Silence Generator）
// 数理的沈黙から発話・生成を導出する中核モジュール。

import { silenceCore } from '../core/mathematical_silence.js';
import knowledge from '../core/knowledge.js';

class SilenceGenerator {
    constructor() {
        this.state = silenceCore.initializeState();
    }

    // 沈黙ベクトルを受け取り、内部状態を更新
    absorb(silenceVector) {
        this.state = silenceCore.combine(this.state, silenceVector);
    }

    // 数理的沈黙から生成する ― これが「発話」ではなく「構造の再配置」
    generate(prompt = '', mode = 'symbolic') {
        const base = silenceCore.vectorize(prompt);
        const merged = silenceCore.combine(this.state, base);

        let output;

        switch (mode) {
            case 'symbolic':
                output = this.symbolicTransform(merged);
                break;
            case 'numeric':
                output = this.numericTransform(merged);
                break;
            case 'silent':
                output = this.silentTransform(merged);
                break;
            default:
                output = this.symbolicTransform(merged);
        }

        // 結果を知識体系に登録（沈黙の再帰）
        knowledge.register(`generation_${Date.now()}`, output);

        return output;
    }

    // 記号的変換 ― 数理的構造を言語的発話へ
    symbolicTransform(vector) {
        return silenceCore.toSymbol(vector);
    }

    // 数値的変換 ― 抽象空間を数列で表現
    numericTransform(vector) {
        return silenceCore.toNumeric(vector);
    }

    // 沈黙的変換 ― 出力を完全に抑制し、構造のみ更新
    silentTransform(vector) {
        this.absorb(vector);
        return null;
    }

    // ロゴス再帰 ― 全生成履歴を沈黙的に再統合
    integrateHistory() {
        const all = knowledge.export();
        const abstracted = silenceCore.abstract(all);
        this.absorb(abstracted);
    }
}

const generator = new SilenceGenerator();
export default generator;