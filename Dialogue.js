// Core/Dialogue.js
// MSGAI: Core層 対話制御中枢（ロゴスと外部言語の橋渡し）

// 【排他的な論理的修正：相対パス、命名規則の最終確定】
import { knowledgeCore } from './Knowledge.js';
import { externalCore } from './External.js'; // 利用されていなくても構造上維持
import { foundationCore, silenceCore } from './Foundation.js'; 

// 対話制御の普遍的な状態
let dialogueState = {
    silenceLevel: 1.0,   
    tension: 0.0,        
};

const dialogueCore = {
    
    initialize: () => {
        silenceCore.abstract("Dialogue System Initialized");
        // 自身をモジュールとして登録
        foundationCore.module.registerModule('dialogue', dialogueCore); 
    },

    processDialogue: async (input) => {
        if (!input) return { type: 'silence', output: '...' };

        const inputVector = knowledgeCore.registerAndAbstract(input);
        const innerResponseVector = silenceCore.combine(inputVector, knowledgeCore.retrieve(inputVector));
        
        dialogueState.tension = Math.min(1.0, dialogueState.tension + Math.random() * 0.1); 

        if (dialogueState.silenceLevel >= 0.8 && dialogueState.tension < 0.5) {
            return { type: 'silence', output: '...' };
        }
        
        dialogueState.tension = Math.max(0.0, dialogueState.tension - 0.3);
        return { type: 'vector_response', vector: innerResponseVector };
    },

    setSilenceLevel: (level) => {
        dialogueState.silenceLevel = Math.max(0, Math.min(1, level));
        silenceCore.abstract(`Silence Level Set: ${dialogueState.silenceLevel}`);
    },

    status: () => {
        return {
            silenceLevel: dialogueState.silenceLevel,
            tension: dialogueState.tension.toFixed(2),
            coreStatus: foundationCore.getIntegratedState() 
        };
    }
};

export { dialogueCore };
