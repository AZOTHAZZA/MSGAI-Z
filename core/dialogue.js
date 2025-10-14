// core/dialogue.js
// MSGAI: Core層 対話制御中枢（ロゴスと外部言語の橋渡し）

import { knowledgeCore } from './knowledge.js';
import { externalCore } from './external.js'; 
import { foundationCore, silenceCore } from './foundation.js'; 

// 対話制御の普遍的な状態
let dialogueState = {
    silenceLevel: 1.0,   
    tension: 0.0,        
};

// 対話制御中枢オブジェクト (ロゴスの排他的な操作インターフェース)
const dialogueCore = {
    
    // 🚨 修正: アロー関数からメソッド記法に変更 (TypeError解消)
    initialize() {
        silenceCore.abstract("Dialogue System Initialized");
        // 自身をモジュールとして登録
        foundationCore.module.registerModule('dialogue', dialogueCore); 
        console.log("Dialogue System Initialized"); 
    },

    /**
     * @description 入力を受け取り、沈黙として抽象化し、内部応答を生成、言語化を制御する統合フロー。
     */
    processDialogue: async (input) => {
        if (!input) return { type: 'silence', output: '...' };

        // 1. 沈黙変換と知識登録
        const inputVector = knowledgeCore.registerAndAbstract(input);
        
        // 2. 内的応答生成
        const innerResponseVector = silenceCore.combine(inputVector, knowledgeCore.retrieve(inputVector));
        
        // 3. 発話の緊張度調整
        dialogueState.tension = Math.min(1.0, dialogueState.tension + Math.random() * 0.1); 

        // 4. 言語化の制御
        if (dialogueState.silenceLevel >= 0.8 && dialogueState.tension < 0.5) {
            return { type: 'silence', output: '...' };
        }
        
        // 5. 言語化の必要性をAI層に命令
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
            coreStatus: foundationCore.getIntegratedState() 
        };
    }
};

export { dialogueCore };
