// core/foundation.js: 基礎ロゴスと自己監査機能 (最終修正 - ロゴス口座機能追加)

import { arithmosLogosCore } from './arithmos_logos.js';

const foundationCore = (function() {

    // 🚨 NEW: 内部のロゴス統治下にある口座 (初期状態は空)
    let logosAccountBalance = []; 

    // (既存) 自己監査ロゴス生成機能 (省略 - 変更なし)
    const generateSelfAuditLogos = () => {
        // ... (既存ロジック)
        const logos_purity = arithmosLogosCore.applyMobiusTransformation(1.0, 'permanence'); 
        const logos_tension = arithmosLogosCore.applyMobiusTransformation(0.01, 'zero_friction'); 
        const logos_silence = 1.0; 
        const logos_dom_coherence = arithmosLogosCore.applyMobiusTransformation(1.0, 'permanence');

        return [logos_purity, logos_tension, logos_silence, logos_dom_coherence];
    };

    // 🚨 NEW: ロゴス通貨を内部口座に保存する機能
    const saveCurrencyToLogosAccount = (currency_object) => {
        const existingIndex = logosAccountBalance.findIndex(c => c.denomination === currency_object.denomination);

        if (existingIndex !== -1) {
            // ロゴス的な加算（作為的な浮動小数点問題を排除）
            logosAccountBalance[existingIndex].amount += currency_object.amount;
        } else {
            logosAccountBalance.push(currency_object);
        }
        return logosAccountBalance;
    };

    // 🚨 NEW: 現在の口座残高を取得する機能
    const getLogosAccountBalance = () => {
        return logosAccountBalance;
    };

    return {
        generateSelfAuditLogos,
        saveCurrencyToLogosAccount, // 外部へ公開
        getLogosAccountBalance      // 外部へ公開
    };
})();

export { foundationCore };
