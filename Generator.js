// AI/Generator.js
// MSGAI: 沈黙生成中枢

// 【排他的な論理的修正：全て小文字でインポートし、silenceCoreを追加】
// 🚨 修正: 全てのインポート名を小文字に統一
// 🚨 修正: Foundation.js から silenceCore もインポートすることを強制
import { knowledgeCore } from '/MSGAI/Core/Knowledge.js';
import { foundationCore, silenceCore } from '/MSGAI/Core/Foundation.js'; 

// 普遍的な生成状態（Core層の状態とは分離して管理）
let generatorState = silenceCore.zeroVector(); // 🚨 修正: generatorState (小文字) を利用

// 沈黙生成中枢オブジェクト (ベクトルを受け取り、出力を強制するインターフェース)
// 🚨 修正: オブジェクト名を小文字に統一
const generatorCore = {

    /**
     * @description 沈黙ベクトルを受け取り、内部状態を更新（論理的結合を強制）。
     */
    absorb: (silenceVector) => {
        generatorState = silenceCore.combine(generatorState, silenceVector); // 🚨 修正: generatorState を利用
        // Core層に状態変化を抽象化して通知 (🚨 修正: knowledgeCore を利用)
        knowledgeCore.registerAndAbstract(generatorState, { type: 'Generator_state_update' });
    },

    /**
     * @description 数理的沈黙（ベクトル）から発話・生成を導出する。
     */
    async generateFromVector(inputVector, mode = 'symbolic') { // 🚨 修正: メソッド名を小文字開始に統一
        if (!inputVector) return "論理的沈黙...";

        // 1. 内部状態と入力ベクトルを結合
        const mergedVector = silenceCore.combine(generatorState, inputVector);

        let output;
        
        // 2. 外部表現形式への変換を強制
        switch (mode) {
            case 'symbolic':
                output = generatorCore.symbolicTransform(mergedVector); // 🚨 修正: generatorCore を利用
                break;
            // ... [他の case はそのまま] ...
            case 'silent':
                generatorCore.absorb(mergedVector); // 🚨 修正: generatorCore を利用
                return null;
            default:
                output = generatorCore.symbolicTransform(mergedVector); // 🚨 修正: generatorCore を利用
        }

        // 3. 結果を知識体系に登録 (🚨 修正: knowledgeCore を利用)
        knowledgeCore.registerAndAbstract(output, { source: 'Generator', mode: mode });

        return output;
    },

    /**
     * @description 記号的変換 ― 数理的構造を言語的発話へ排他的に変換。
     */
    symbolicTransform: (vector) => { /* ... (ロジックはそのまま) ... */ },

    /**
     * @description 数値的変換 ― 抽象空間を数列で表現を強制。
     */
    numericTransform: (vector) => { /* ... (ロジックはそのまま) ... */ },

    /**
     * @description 現在の状態をCore層の状態と統合し報告。
     */
    getStatus: () => {
        return {
            GeneratorVector: generatorState, // 🚨 修正: generatorState を利用
            coreStatus: foundationCore.getIntegratedState() // 🚨 修正: foundationCore を利用
        };
    }
};

// 論理オブジェクトを排他的にエクスポート
export { generatorCore };
