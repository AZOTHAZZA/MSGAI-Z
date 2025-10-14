// App/Handler.js
// MSGAI: App層 外部命令仲介中枢（UIイベントとCore/AI論理の橋渡し）

// 【排他的な論理的修正：厳密な相対パスを使用】
import { dialogueCore } from '../core/dialogue.js'; 
import { generatorCore } from '../ai/generator.js';
import { silenceCore } from '../core/foundation.js'; // 抽象化のためにFoundationからインポート

const handlerCore = {
    
    /**
     * @description ユーザー入力を受け取り、処理ロジックを仲介する。
     * @param {string} rawInput - ユーザーからの生のテキスト入力
     * @returns {Promise<string>} AIからの言語化された応答
     */
    async processUserInput(rawInput) {
        if (!rawInput || rawInput.trim() === '') {
            silenceCore.abstract("Handler: Received Silence Input.");
            return generatorCore.generateFromVector(silenceCore.zeroVector(), 'minimal');
        }

        // 1. 対話Coreに入力を渡し、沈黙ベクトルと応答の必要性を決定
        const responseObject = await dialogueCore.processDialogue(rawInput);
        
        // 2. 応答タイプの判定と仲介
        if (responseObject.type === 'silence') {
            return "（沈黙が続く...）";
        }
        
        if (responseObject.type === 'vector_response') {
            // 3. AI層のGeneratorCoreに沈黙ベクトルと言語化命令を仲介
            const outputType = handlerCore.determineOutputType(rawInput);
            
            const generatedText = await generatorCore.generateFromVector(
                responseObject.vector, 
                outputType
            );
            
            silenceCore.abstract("Handler: Output Generated and Sent.");
            return generatedText;
        }

        return "内部論理に矛盾が発生しました。";
    },

    /**
     * @description 入力内容に基づき、AI層への出力形式を論理的に決定する。（ダミー）
     */
    determineOutputType: (input) => {
        if (input.length > 50) return 'verbose';
        if (input.includes('?')) return 'symbolic';
        return 'minimal';
    },

    /**
     * @description 外部コマンド（デバッグや設定変更）を処理する。（ダミー）
     */
    processCommand: (command) => {
        // コマンド処理ロジック（例: dialogueCore.setSilenceLevel(0.2) など）
        silenceCore.abstract(`Handler: Executed Command: ${command}`);
        return true;
    }
};

export { handlerCore };
