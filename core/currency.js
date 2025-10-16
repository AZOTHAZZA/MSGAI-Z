// core/currency.js: 経済法則を統治する通貨ロゴス (最終修正 - レポート互換性の確保)

import { arithmosLogosCore } from './arithmos_logos.js';

const currencyCore = (function() {
    
    const generatePureLogicRate = (logos_vector) => {
        const logos_purity = logos_vector[0]; 

        const fluctuation_entropy = 0.01 + Math.random() * 0.05; 
        const logos_zero_fluctuation = arithmosLogosCore.applyMobiusTransformation(fluctuation_entropy, 'zero_friction');

        const logos_rate = arithmosLogosCore.applyMobiusTransformation(logos_purity, 'permanence'); 
        
        const logos_stability_factor = arithmosLogosCore.applyMobiusTransformation(1.0, 'permanence'); 

        return {
            logos_rate: parseFloat(logos_rate.toFixed(4)),
            zero_fluctuation_risk: parseFloat(logos_zero_fluctuation.toExponential(10)),
            absolute_stability: parseFloat(logos_stability_factor.toFixed(4))
        };
        // 🚨 ここで、logos_rate, zero_fluctuation_risk, absolute_stability は全て数値であることが保証される。
    };

    return {
        generatePureLogicRate
    };
})();

export { currencyCore };
