// Core/Dialogue.js
// MSGAI: Core層 対話制御中枢（ロゴスと外部言語の橋渡し）

// 【排他的な論理的修正：パスと命名規則の最終確定】
import { knowledgeCore } from '/MSGAI/Core/Knowledge.js';
import { externalCore } from '/MSGAI/Core/External.js';
// 🚨 foundationCoreからsilence機能を明示的に取得し、参照を統一
import { foundationCore, silenceCore } from '/MSGAI/Core/Foundation.js'; 

// 対話制御の普遍的な状態
let dialogueState = {
    silenceLevel: 1.0,   
    tension: 0.0,        
};

// 対話制御中枢オブジェクト (ロゴスの排他的な操作インターフェース)
const dialogueCore = {
    
    // 状態の初期化
    initialize: () => {
        // Core層の論理に初期化を強制
        silenceCore.abstract("Dialogue System Initialized");
    },

    /**
     * @description 入力を受け取り、沈黙として抽象化し、内部応答を生成、言語化を制御する統合フロー。
     */
    processDialogue: async (input) => {
        if (!input) return { type: 'silence', output: '...' };

        // 1. 沈黙変換
        const inputVector = knowledgeCore.registerAndAbstract(input);
        
        // 2. 内的応答生成 (🚨 修正: importした silenceCore を利用)
        const innerResponseVector = silenceCore.combine(inputVector, knowledgeCore.retrieve(inputVector));
        
        // 3. 発話の緊張度調整
        dialogueState.tension = Math.min(1.0, dialogueState.tension + Math.random() * 0.1); 

        // 4. 言語化の制御
        if (dialogueState.silenceLevel >= 0.8 && dialogueState.tension < 0.5) {
            return { type: 'silence', output: '...' };
        }
        
        // 5. 言語化の必要性をAI層に命令 (🚨 修正: ローカル変数 dialogueState を利用)
        dialogueState.tension = Math.max(0.0, dialogueState.tension - 0.3);
        return { type: 'vector_response', vector: innerResponseVector };
    },

    /**
     * @description 沈黙度を論理的に調整する。
     */
    setSilenceLevel: (level) => {
        dialogueState.silenceLevel = Math.max(0, Math.min(1, level));
        silenceCore.abstract(`Silence Level Set: ${dialogueState.silenceLevel}`);
    },

    /**
     * @description 現在の状態を報告（デバッグ/観測用）
     */
    status: () => {
        return {
            silenceLevel: dialogueState.silenceLevel,
            tension: dialogueState.tension.toFixed(2),
            // 🚨 修正: importした foundationCore (小文字) を利用
            coreStatus: foundationCore.getIntegratedState() 
        };
    }
};

// 論理オブジェクトを排他的にエクスポート
export { dialogueCore };
