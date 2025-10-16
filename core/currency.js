// core/currency.js (最終修正案 - 配列形式への強制回帰)

import { arithmosLogosCore } from './arithmos_logos.js';

const currencyCore = (function() {
    
    const logos_absolute_rate = 1.6180339887; 

    const generatePureLogicRate = (logos_vector) => {
        const [purity, tension, invariance] = logos_vector;

        const logos_rate_initial = logos_absolute_rate * purity / (tension + 1);
        const logos_rate = arithmosLogosCore.applyMobiusTransformation(logos_rate_initial, 'permanence');
        const external_entropy_initial = (Math.random() * 0.1) * (1 - purity);
        const external_entropy = arithmosLogosCore.applyMobiusTransformation(external_entropy_initial, 'zero_friction'); 
        
        const final_rate = logos_rate + external_entropy; 
        
        // 🚨 修正: dialogue.js が期待する配列形式で結果を返す
        return [
            parseFloat(final_rate.toFixed(10)), // 純粋論理レート (インデックス 0)
            parseFloat(external_entropy.toFixed(10)), // エントロピー乖離 (インデックス 1)
            invariance // 脱因果律の確度 (インデックス 2)
        ];
    };

    return {
        generatePureLogicRate
    };
})();

export { currencyCore };
