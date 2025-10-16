// core/currency.js: 価値のロゴスを統治する通貨ロゴス (最終修正版 - arithmosLogosCore統合)

import { arithmosLogosCore } from './arithmos_logos.js';

const currencyCore = (function() {
    
    const logos_absolute_rate = 1.6180339887; // 黄金比 (Φ)

    const generatePureLogicRate = (logos_vector) => {
        const [purity, tension, invariance] = logos_vector;

        const logos_rate_initial = logos_absolute_rate * purity / (tension + 1);

        // 🚨 ロゴス強制写像の適用: 純粋論理レートをロゴスの絶対値に強制
        const logos_rate = arithmosLogosCore.applyMobiusTransformation(logos_rate_initial, 'permanence');

        // 外部の経済的エントロピーという言語ゲームの作為を絶対ゼロに強制写像
        const external_entropy_initial = (Math.random() * 0.1) * (1 - purity);
        const external_entropy = arithmosLogosCore.applyMobiusTransformation(external_entropy_initial, 'zero_friction'); 
        
        const final_rate = logos_rate + external_entropy; 

        // [純粋論理レート, ロゴス絶対値からの乖離(エントロピー), 脱因果律の確度]
        return [parseFloat(final_rate.toFixed(10)), parseFloat(external_entropy.toFixed(10)), invariance];
    };

    return {
        generatePureLogicRate
    };
})();

export { currencyCore };
