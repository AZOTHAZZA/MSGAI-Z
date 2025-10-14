// core/dialogue.js
// MSGAI: Core層 対話制御中枢（ロゴスと外部言語の橋渡し）
// このファイルは、Core層の論理と外部からの対話フローを排他的に制御する。

// 【排他的な論理的修正：パスの絶対化と名前付きインポートを強制】
import { silenceCore } from '/MSGAI/core/mathematical_silence.js';
import { knowledgeCore } from '/MSGAI/core/knowledge.js';
import { externalCore } from '/MSGAI/core/external.js';
import { foundationCore } from '/MSGAI/core/foundation.js'; 

// 対話制御の普遍的な状態
let dialogueState = {
    silenceLevel: 1.0,   // 1.0 = 完全沈黙（支配）
    tension: 0.0,        // 論理的発話の臨界点
};

// 対話制御中枢オブジェクト (ロゴスの排他的な操作インターフェース)
const dialogueCore = {
    
    // 状態の初期化
    initialize: () => {
        // Core層の論理に初期化を強制
        foundationCore.silence.abstract("Dialogue System Initialized");
    },

    /**
     * @description 入力を受け取り、沈黙として抽象化し、内部応答を生成、言語化を制御する統合フロー。
     * @param {string} input 外部からの言語入力
     * @returns {object} 内的応答ベクトル、または論理的沈黙
     */
    processDialogue: async (input) => {
        if (!input) return { type: 'silence', output: '...' };

        // 1. 沈黙変換（Core層の知識モジュールに排他的に登録）
        const inputVector = knowledgeCore.registerAndAbstract(input);
        
        // 2. 内的応答生成（沈黙コアと知識の統合）
        const innerResponseVector = silenceCore.combine(inputVector, knowledgeCore.retrieve(inputVector));
        
        // 3. 発話の緊張度調整（外的作用による内的変動）
        dialogueState.tension = Math.min(1.0, dialogueState.tension + Math.random() * 0.1); 

        // 4. 言語化の制御（AI層への命令を決定）
        if (dialogueState.silenceLevel >= 0.8 && dialogueState.tension < 0.5) {
            // 沈黙支配: 言葉を生まない
            return { type: 'silence', output: '...' };
        }
        
        // 5. 言語化の必要性をAI層に命令
        // ここでは応答ベクトルを返すのみとし、実際の言語生成はAI層のgeneratorが担う
        dialogueState.tension = Math.max(0.0, dialogueState.tension - 0.3);
        return { type: 'vector_response', vector: innerResponseVector };
    },

    /**
     * @description 沈黙度を論理的に調整する。
     */
    setSilenceLevel: (level) => {
        dialogueState.silenceLevel = Math.max(0, Math.min(1, level));
        foundationCore.silence.abstract(`Silence Level Set: ${dialogueState.silenceLevel}`);
    },

    /**
     * @description 現在の状態を報告（デバッグ/観測用）
     */
    status: () => {
        return {
            silenceLevel: dialogueState.silenceLevel,
            tension: dialogueState.tension.toFixed(2),
            coreStatus: foundationCore.getIntegratedState()
        };
    }
};

// 論理オブジェクトを排他的にエクスポート
export { dialogueCore };
