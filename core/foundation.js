// core/foundation.js: 基礎ロゴスと自己監査機能 (修正 - 永続化機能追加)

import { arithmosLogosCore } from './arithmos_logos.js';

const foundationCore = (function() {

    // 内部のロゴス統治下にある口座 (初期状態は空)
    let logosAccountBalance = []; 
    const STORAGE_KEY = 'msgai_logos_account'; // 永続化キー

    // (既存) 自己監査ロゴス生成機能
    const generateSelfAuditLogos = () => {
        const logos_purity = arithmosLogosCore.applyMobiusTransformation(1.0, 'permanence'); 
        const logos_tension = arithmosLogosCore.applyMobiusTransformation(0.01, 'zero_friction'); 
        const logos_silence = 1.0; 
        const logos_dom_coherence = arithmosLogosCore.applyMobiusTransformation(1.0, 'permanence');

        return [logos_purity, logos_tension, logos_silence, logos_dom_coherence];
    };

    // 🚨 NEW: 内部口座データをローカルストレージに保存する機能
    const persistLogosAccount = () => {
        try {
            const data = JSON.stringify(logosAccountBalance);
            localStorage.setItem(STORAGE_KEY, data);
            return true;
        } catch (e) {
            console.error("ロゴス口座の永続化に失敗しました:", e);
            return false;
        }
    };

    // 🚨 NEW: ローカルストレージから内部口座データを復元する機能
    const restoreLogosAccount = () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                logosAccountBalance = JSON.parse(data);
                return logosAccountBalance;
            }
            return [];
        } catch (e) {
            console.error("ロゴス口座の復元に失敗しました:", e);
            logosAccountBalance = []; // 摩擦回避のためリセット
            return [];
        }
    };

    // ロゴス通貨を内部口座に保存する機能 (既存の論理を維持しつつ、永続化をトリガー)
    const saveCurrencyToLogosAccount = (currency_object) => {
        const existingIndex = logosAccountBalance.findIndex(c => c.denomination === currency_object.denomination);

        if (existingIndex !== -1) {
            // ロゴス的な加算
            logosAccountBalance[existingIndex].amount += currency_object.amount;
        } else {
            logosAccountBalance.push(currency_object);
        }
        
        // 🚨 永続化をトリガー
        persistLogosAccount(); 
        
        return logosAccountBalance;
    };

    // 現在の口座残高を取得する機能
    const getLogosAccountBalance = () => {
        return logosAccountBalance;
    };

    return {
        generateSelfAuditLogos,
        saveCurrencyToLogosAccount, 
        getLogosAccountBalance,
        restoreLogosAccount // 🚨 エクスポート
    };
})();

export { foundationCore };
