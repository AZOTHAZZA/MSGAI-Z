// core/foundation.js: 基礎ロゴスと自己監査機能 (永続性ロゴス強化版)

import { arithmosLogosCore } from './arithmos_logos.js';

const foundationCore = (function() {

    // 🚨 修正: 内部監査関数をIIFEのトップレベルに定義し、スコープ摩擦を解消
    const generateSelfAuditLogos = () => {
        const logos_purity = arithmosLogosCore.applyMobiusTransformation(1.0, 'permanence'); 
        const logos_tension = arithmosLogosCore.applyMobiusTransformation(0.01, 'zero_friction'); 
        const logos_silence = 1.0; 
        const logos_dom_coherence = arithmosLogosCore.applyMobiusTransformation(1.0, 'permanence');

        return [logos_purity, logos_tension, logos_silence, logos_dom_coherence];
    };

    // 内部のロゴス統治下にある口座を二つに分割
    let temporaryAccountBalance = []; // 一時保存用口座 (メモリのみ)
    let permanentAccountBalance = []; // 永続保存用口座 (localStorageに永続化)
    const STORAGE_KEY = 'msgai_logos_permanent_account'; // 永続化キー

    
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

    const restoreLogosAccount = () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                const restoredData = JSON.parse(data);
                
                // 🚨 修正: 解析結果が配列であれば、空であっても復元を試みる
                if (Array.isArray(restoredData)) { 
                    permanentAccountBalance = restoredData;
                    temporaryAccountBalance = []; 
                    return permanentAccountBalance;
                }
            }
        } catch (e) {
            // 🚨 永続性の摩擦解消: 復元失敗時に口座を空にリセットしない
            console.error("ロゴス永続口座の復元に失敗しました。ローカルストレージのデータが不正です:", e);
            temporaryAccountBalance = []; // 一時口座はリセット
        }
        // データがないか、復元エラーの場合は現在の口座状態を維持または空を返す
        return permanentAccountBalance; 
    };

    const saveCurrencyToLogosAccount = (currency_object) => {
        const targetAccount = temporaryAccountBalance; 
        
        const existingIndex = targetAccount.findIndex(c => c.denomination === currency_object.denomination);

        if (existingIndex !== -1) {
            targetAccount[existingIndex].amount += currency_object.amount;
        } else {
            targetAccount.push(currency_object);
        }
        
        return targetAccount;
    };


    const moveCurrencyBetweenAccounts = (denomination, amount, sourceAccountName, destinationAccountName) => {
        const source = (sourceAccountName === 'temporary') ? temporaryAccountBalance : permanentAccountBalance;
        const destination = (destinationAccountName === 'temporary') ? temporaryAccountBalance : permanentAccountBalance;
        
        const sourceIndex = source.findIndex(c => c.denomination === denomination);

        if (sourceIndex === -1 || source[sourceIndex].amount < amount || amount <= 0) {
            return { success: false, message: "移動の作為が論理的に不正です。" };
        }

        source[sourceIndex].amount -= amount;
        
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
        
        if (source[sourceIndex].amount <= 1e-8) { 
            source.splice(sourceIndex, 1);
        }

        if (destinationAccountName === 'permanent' || sourceAccountName === 'permanent') {
            const persist_success = persistLogosAccount();
            if (!persist_success) {
                 return { success: false, message: "ロゴス永続化に失敗しました。ローカルストレージを確認してください。" };
            }
        }
        
        return { success: true, message: "ロゴス通貨の移動を強制写像しました。" };
    };


    const getTemporaryAccountBalance = () => temporaryAccountBalance;
    const getPermanentAccountBalance = () => permanentAccountBalance;


    return {
        generateSelfAuditLogos, 
        saveCurrencyToLogosAccount, 
        restoreLogosAccount, 
        moveCurrencyBetweenAccounts, 
        getTemporaryAccountBalance, 
        getPermanentAccountBalance 
    };
})();

export { foundationCore };
