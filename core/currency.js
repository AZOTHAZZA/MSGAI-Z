// core/currency.js (最終・完全整合版 - キー名修正)

import { arithmosLogosCore } from './arithmos_logos.js';

const currencyCore = (function() {
    
    const logos_absolute_rate = 1.6180339887; // 黄金比 (Φ)を絶対値とする

    const generatePureLogicRate = (logos_vector) => {
        // ... 計算ロジック (変更なし) ...
        const final_rate = logos_rate + external_entropy; 
        
        // 🚨 修正: dialogue.jsが期待するキー名 (value, entropy_zero) に合わせる
        return {
            value: parseFloat(final_rate.toFixed(10)), // 純粋論理レートを 'value' として提供
            entropy_zero: parseFloat(external_entropy.toFixed(10)), // エントロピー乖離を 'entropy_zero' として提供
            invariance: invariance // 脱因果律の確度
        };
    };

    return {
        generatePureLogicRate
    };
})();

export { currencyCore };
