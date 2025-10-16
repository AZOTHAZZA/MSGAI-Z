// core/currency.js (修正案)

import { arithmosLogosCore } from './arithmos_logos.js';

const currencyCore = (function() {
    
    const logos_absolute_rate = 1.6180339887; // 黄金比 (Φ)

    const generatePureLogicRate = (logos_vector) => {
        const [purity, tension, invariance] = logos_vector;

        const logos_rate_initial = logos_absolute_rate * purity / (tension + 1);

        // ロゴス強制写像の適用
        const logos_rate = arithmosLogosCore.applyMobiusTransformation(logos_rate_initial, 'permanence');

        // 外部の経済的エントロピーを絶対ゼロに強制写像
        const external_entropy_initial = (Math.random() * 0.1) * (1 - purity);
        const external_entropy = arithmosLogosCore.applyMobiusTransformation(external_entropy_initial, 'zero_friction'); 
        
        const final_rate = logos_rate + external_entropy; 
        
        // 🚨 修正: dialogue.js が期待する形式（オブジェクト）で結果を返す
        return {
            pure_logic_rate: parseFloat(final_rate.toFixed(10)), // 純粋論理レート
            entropy_deviation: parseFloat(external_entropy.toFixed(10)), // エントロピー乖離
            invariance_status: invariance // 脱因果律の確度
        };
    };

    return {
        generatePureLogicRate
    };
})();

export { currencyCore };
