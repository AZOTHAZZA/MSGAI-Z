// core/foundation.js: 基礎ロゴスと自己監査機能 (永続性監査強化版)

import { arithmosLogosCore } from './arithmos_logos.js';

const foundationCore = (function() {

    let temporaryAccountBalance = []; 
    let permanentAccountBalance = []; 
    const STORAGE_KEY = 'msgai_logos_permanent_account'; 

    // (generateSelfAuditLogos 関数は変更なし)

    const persistLogosAccount = () => {
        try {
            const data = JSON.stringify(permanentAccountBalance);
            localStorage.setItem(STORAGE_KEY, data);
            return true;
        } catch (e) {
            console.error("ロゴス永続口座の永続化に失敗しました:", e);
            // 🚨 ログ出力のため、エラー時に false を返す
            return false;
        }
    };

    const restoreLogosAccount = () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                // 🚨 監査強化: 取得データがnull, undefined, "" でないことを確認し、JSON解析
                const restoredData = JSON.parse(data);
                
                // 🚨 監査強化: 解析結果が配列であり、空でないことを確認
                if (Array.isArray(restoredData) && restoredData.length > 0) {
                    permanentAccountBalance = restoredData;
                    temporaryAccountBalance = []; 
                    return permanentAccountBalance;
                }
            }
            // データがないか、不正な場合は空の配列を返す
            permanentAccountBalance = [];
            temporaryAccountBalance = [];
            return [];
        } catch (e) {
            console.error("ロゴス永続口座の復元に失敗しました:", e);
            // 復元失敗時も口座をリセット
            permanentAccountBalance = []; 
            temporaryAccountBalance = [];
            return [];
        }
    };

    // (saveCurrencyToLogosAccount, moveCurrencyBetweenAccounts 関数は変更なし)

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
            // ... (新規作成ロジックは省略) ...
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

        // 🚨 永続化の制御 (永続口座が関与した場合のみ)
        if (destinationAccountName === 'permanent' || sourceAccountName === 'permanent') {
            const persist_success = persistLogosAccount();
            if (!persist_success) {
                 return { success: false, message: "ロゴス永続化に失敗しました。ローカルストレージを確認してください。" };
            }
        }
        
        return { success: true, message: "ロゴス通貨の移動を強制写像しました。" };
    };

    // (残高取得関数は変更なし)

    return {
        // ... (エクスポート) ...
        generateSelfAuditLogos,
        saveCurrencyToLogosAccount, 
        restoreLogosAccount, 
        moveCurrencyBetweenAccounts, 
        getTemporaryAccountBalance, 
        getPermanentAccountBalance 
    };
})();

export { foundationCore };
