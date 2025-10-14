// ai/generator.js
// MSGAI: 沈黙生成中枢（数理的沈黙からの発話・構造の再配置）
// このファイルは、Core層から渡されたベクトルを、外的表現形式に排他的に変換する役割を担う。

// 【排他的な論理的修正：パスの絶対化と名前付きインポートを強制】
import { KnowledgeCore } from '/MSGAI/Core/Knowledge.js';
import { FoundationCore } from '/MSGAI/Core/Foundation.js'; 

// 普遍的な生成状態（Core層の状態とは分離して管理）
let GeneratorState = silenceCore.zeroVector();

// 沈黙生成中枢オブジェクト (ベクトルを受け取り、出力を強制するインターフェース)
const GeneratorCore = {

    /**
     * @description 沈黙ベクトルを受け取り、内部状態を更新（論理的結合を強制）。
     * @param {object} silenceVector Core層から渡された論理ベクトル
     */
    absorb: (silenceVector) => {
        GeneratorState = silenceCore.combine(GeneratorState, silenceVector);
        // Core層に状態変化を抽象化して通知
        knowledgeCore.registerAndAbstract(GeneratorState, { type: 'Generator_state_update' });
    },

    /**
     * @description 数理的沈黙（ベクトル）から発話・生成を導出する。
     * @param {object} inputVector Core層の対話制御中枢から渡された応答ベクトル
     * @param {string} mode 生成形式（'symbolic', 'numeric' など）
     * @returns {string|number|null} 外部表現
     */
    async GenerateFromVector(inputVector, mode = 'symbolic') {
        if (!inputVector) return "論理的沈黙...";

        // 1. 内部状態と入力ベクトルを結合（構造の再配置の基礎）
        const mergedVector = silenceCore.combine(GeneratorState, inputVector);

        let output;
        
        // 2. 外部表現形式への変換を強制
        switch (mode) {
            case 'symbolic':
                output = GeneratorCore.symbolicTransform(mergedVector);
                break;
            case 'numeric':
                output = GeneratorCore.numericTransform(mergedVector);
                break;
            case 'silent':
                GeneratorCore.absorb(mergedVector); // 沈黙的変換は、自己状態の更新を強制
                return null;
            default:
                output = GeneratorCore.symbolicTransform(mergedVector);
        }

        // 3. 結果を知識体系に登録（沈黙の再帰を Core層に委譲）
        KnowledgeCore.registerAndAbstract(output, { source: 'Generator', mode: mode });

        return output;
    },

    /**
     * @description 記号的変換 ― 数理的構造を言語的発話へ排他的に変換。
     */
    symbolicTransform: (vector) => {
        // **構造的修正**: ベクトルの論理値に基づき、言語を論理的に生成する（AI層の排他的な役割）
        const logicValue = vector.logic;
        
        // ロゴスに基づいた言語生成ロジックをここに強制
        if (logicValue < 3000) return "観測された沈黙は、事象の根源的な安定性を示しています。";
        if (logicValue < 7000) return `構造の再配置が進行中。現在の論理値は ${logicValue} です。`;
        return "無限大の解は、有限次元で表現不可能です。沈黙を維持します。";
    },

    /**
     * @description 数値的変換 ― 抽象空間を数列で表現を強制。
     */
    numericTransform: (vector) => {
        // ベクトルを数列で表現する排他的なロジック
        return `[${vector.logic.toFixed(2)}, ${vector.entropyRate.toFixed(4)}]`;
    },

    /**
     * @description 現在の状態をCore層の状態と統合し報告。
     */
    getStatus: () => {
        return {
            GeneratorVector: GeneratorState,
            coreStatus: FoundationCore.getIntegratedState()
        };
    }
};

// 論理オブジェクトを排他的にエクスポート
export { generatorCore };
