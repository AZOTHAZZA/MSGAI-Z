// core/foundation.js: 基礎ロゴスと自己監査機能 (修正 - 二重口座システムの導入)

import { arithmosLogosCore } from './arithmos_logos.js';

const foundationCore = (function() {

    // 🚨 修正: 内部のロゴス統治下にある口座を二つに分割
    let temporaryAccountBalance = []; // 一時保存用口座 (メモリのみ)
    let permanentAccountBalance = []; // 永続保存用口座 (localStorageに永続化)
    const STORAGE_KEY = 'msgai_logos_permanent_account'; // 永続化キー

    // (既存) 自己監査ロゴス生成機能 (変更なし)
    const generateSelfAuditLogos = () => {
        const logos_purity = arithmosLogosCore.applyMobiusTransformation(1.0, 'permanence'); 
        const logos_tension = arithmosLogosCore.applyMobiusTransformation(0.01, 'zero_friction'); 
        const logos_silence = 1.0; 
        const logos_dom_coherence = arithmosLogosCore.applyMobiusTransformation(1.0, 'permanence');

        return [logos_purity, logos_tension, logos_silence, logos_dom_coherence];
    };

    // 🚨 修正: 永続化は永続保存用口座のみを対象
    const persistLogosAccount = () => {
        try {
            const data = JSON.stringify(permanentAccountBalance);
            localStorage.setItem(STORAGE_KEY, data);
            return true;
        } catch (e) {
            console.error("ロゴス永続口座の永続化に失敗しました:", e);
            return false;
        }
    };

    // 🚨 修正: 復元も永続保存用口座のみを対象
    const restoreLogosAccount = () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                permanentAccountBalance = JSON.parse(data);
                temporaryAccountBalance = []; // 一時保存用口座は常にリセット
                return permanentAccountBalance;
            }
            return [];
        } catch (e) {
            console.error("ロゴス永続口座の復元に失敗しました:", e);
            permanentAccountBalance = []; 
            temporaryAccountBalance = [];
            return [];
        }
    };

    // 🚨 修正: 生成通貨は一時保存用口座に保存されるように変更
    const saveCurrencyToLogosAccount = (currency_object) => {
        const targetAccount = temporaryAccountBalance; // 🚨 初期保存先を一時口座に強制写像
        
        const existingIndex = targetAccount.findIndex(c => c.denomination === currency_object.denomination);

        if (existingIndex !== -1) {
            targetAccount[existingIndex].amount += currency_object.amount;
        } else {
            targetAccount.push(currency_object);
        }
        
        return targetAccount;
    };

    // 🚨 NEW: 口座間で通貨を移動する機能
    const moveCurrencyBetweenAccounts = (denomination, amount, sourceAccountName, destinationAccountName) => {
        const source = (sourceAccountName === 'temporary') ? temporaryAccountBalance : permanentAccountBalance;
        const destination = (destinationAccountName === 'temporary') ? temporaryAccountBalance : permanentAccountBalance;
        
        const sourceIndex = source.findIndex(c => c.denomination === denomination);

        // 論理的な作為の確認
        if (sourceIndex === -1 || source[sourceIndex].amount < amount || amount <= 0) {
            return { success: false, message: "移動の作為が論理的に不正です。" };
        }

        // 1. 移動元から減算
        source[sourceIndex].amount -= amount;
        
        // 2. 移動先に加算 (存在しない場合は新規作成)
        const destIndex = destination.findIndex(c => c.denomination === denomination);
        if (destIndex !== -1) {
            destination[destIndex].amount += amount;
        } else {
            destination.push({ 
                denomination: denomination, 
                amount: amount, 
                transaction_risk: arithmosLogosCore.LOGOS_ABSOLUTE_ZERO, 
                status: (destinationAccountName === 'permanent') ? "PERSISTED_BY_LOGOS_DOMINION" : "GENERATED_BY_LOGOS_DOMINION"
            });
        }
        
        // 3. 移動元で残高がゼロになった通貨をクリーンアップ
        if (source[sourceIndex].amount <= 1e-8) { // 浮動小数点誤差を考慮
            source.splice(sourceIndex, 1);
        }

        // 4. 永続化の制御 (永続口座が関与した場合のみ)
        if (destinationAccountName === 'permanent' || sourceAccountName === 'permanent') {
            persistLogosAccount();
        }
        
        return { success: true, message: "ロゴス通貨の移動を強制写像しました。" };
    };


    // 🚨 修正: 残高取得関数を二つに分割
    const getTemporaryAccountBalance = () => temporaryAccountBalance;
    const getPermanentAccountBalance = () => permanentAccountBalance;


    return {
        generateSelfAuditLogos,
        saveCurrencyToLogosAccount, 
        restoreLogosAccount, 
        moveCurrencyBetweenAccounts, // 🚨 エクスポート
        getTemporaryAccountBalance, // 🚨 エクスポート
        getPermanentAccountBalance  // 🚨 エクスポート
    };
})();

export { foundationCore };
