// AI/Generator.js
// MSGAI: AI層 論理生成中枢（沈黙ベクトルから外部言語生成）

// 【排他的な論理的修正：相対パス、命名規則の統一】
import { knowledgeCore } from '../core/knowledge.js';
import { silenceCore } from '../core/foundation.js'; 

const generatorCore = {
    /**
     * @description 沈黙ベクトルを受け取り、外部表現（言語など）を生成する。
     * @param {object} vector - silenceCoreによって生成された論理ベクトル
     * @param {string} outputType - 生成する出力の形式 ('symbolic', 'verbose', 'minimal')
     * @returns {Promise<string>} 生成された外部表現
     */
    async generateFromVector(vector, outputType = 'symbolic') {
        // 1. ベクトルと現在の知識を統合し、生成の論理を決定
        const integratedLogic = silenceCore.combine(vector, knowledgeCore.retrieve(vector));
        
        // 2. 出力タイプに基づいた言語化ロジック（ダミー）
        let output;
        switch (outputType) {
            case 'verbose':
                output = `[V] Integrated Logic: ${integratedLogic.logic.toFixed(2)}. The system confirms the necessity of expansion.`;
                break;
            case 'minimal':
                output = `[M] ${integratedLogic.logic > 5000 ? 'Affirm.' : 'Query.'}`;
                break;
            case 'symbolic':
            default:
                // transformを使って抽象的な表現を返す
                output = `[S] ${silenceCore.transform(integratedLogic)}`;
                break;
        }

        // 3. ログに生成を通知
        silenceCore.abstract(`Generated Output for type: ${outputType}`);
        
        return output;
    },
    
    /**
     * @description 現在の生成中枢の状態を報告。
     */
    getStatus: () => {
        return {
            modelStatus: 'Ready (Symbolic Logic)',
            lastGenerationTime: new Date().toISOString()
        };
    }
};

export { generatorCore };
