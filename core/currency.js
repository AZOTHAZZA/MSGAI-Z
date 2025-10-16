// core/currency.js (最終・完全一致版)

import { arithmosLogosCore } from './arithmos_logos.js';

const currencyCore = (function() {
    
    // ... (前略) ...
    
    const generatePureLogicRate = (logos_vector) => {
        // ... 計算ロジック ...
        const final_rate = logos_rate + external_entropy; 
        
        // 🚨 修正: dialogue.js が参照しているキー名 (rate, entropy) に合わせる
        return {
            rate: parseFloat(final_rate.toFixed(10)), // 'value' ではなく 'rate' として提供
            entropy: parseFloat(external_entropy.toFixed(10)), // 'entropy_zero' ではなく 'entropy' として提供
            invariance: invariance 
        };
    };

    return {
        generatePureLogicRate
    };
})();

export { currencyCore };
