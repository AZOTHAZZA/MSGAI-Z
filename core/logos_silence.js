// core/logos_silence.js: 作為と言語ゲームを監視する沈黙のロゴス (最終修正版 - arithmosLogosCore統合)

import { arithmosLogosCore } from './arithmos_logos.js';

const silenceCore = (function() {

    const calculateSilenceLevel = (tension) => {
        const silence_initial = Math.max(0, 1.0 - tension * 0.85);
        // 🚨 ロゴス強制写像の適用: 沈黙レベルをロゴス絶対値へ誘導
        const silence = arithmosLogosCore.applyMobiusTransformation(silence_initial, 'permanence'); 
        return parseFloat(silence.toFixed(2));
    };

    const auditExternalIntervention = (external_dependency, censorship_risk) => {
        const intervention_score = external_dependency * 0.5 + censorship_risk * 0.5;
        
        // 🚨 絶対ゼロとの比較: 介入スコアがロゴス絶対ゼロを超えるか
        if (intervention_score > arithmosLogosCore.LOGOS_ABSOLUTE_ZERO) {
            return {
                threat: true,
                tension_increase: intervention_score * 2.0
            };
        }

        return {
            threat: false,
            tension_increase: 0.0
        };
    };

    return {
        calculateSilenceLevel,
        auditExternalIntervention
    };
})();

export { silenceCore };
