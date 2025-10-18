// core/currency.js (最終修正版 - 全文)

import { 
    getCurrentState, 
    updateState, 
    getTensionInstance, 
    addTension // 💡 修正: addTensionをインポート
} from './foundation.js';

// 簡略化された静的な為替レート (USDに対する固定比率)
const EXCHANGE_RATES = {
    JPY: 130, // 1 USD = 130 JPY
    EUR: 0.9,  // 1 USD = 0.9 EUR
    BTC: 0.00005, // 1 USD = 0.00005 BTC
    ETH: 0.001, // 1 USD = 0.001 ETH
    MATIC: 1.5, // 1 USD = 1.5 MATIC
    USD: 1
};


// =========================================================================
// 通貨生成 (Minting Act)
// =========================================================================

/**
 * 通貨生成作為 (Minting Act) を実行し、残高とTensionを増やす。
 * @param {string} user - 通貨を生成するユーザー名
 * @param {string} currency - 生成する通貨コード
 * @param {number} amount - 生成する数量
 * @returns {object} 更新された状態 (newState)
 */
export function actMintCurrency(user, currency, amount) {
    const state = getCurrentState();

    if (!state.accounts[user]) {
        throw new Error(`User ${user} not found.`);
    }

    // 1. 残高の増加
    state.accounts[user][currency] = (state.accounts[user][currency] || 0) + amount;

    // 2. Tensionの計算と増加
    // Mintingは大きな作為とみなし、Tension増加率は高めに設定
    const usdEquivalent = amount / (EXCHANGE_RATES[currency] || 1);
    const tensionIncrease = usdEquivalent * 0.005; 
    
    // 💡 修正: tensionInstance.add() から addTension() へ変更
    addTension(tensionIncrease);

    // 3. 状態の更新
    updateState(state);
    return state;
}

// =========================================================================
// 通貨交換 (Exchange Act)
// =========================================================================

/**
 * 通貨交換作為 (Exchange Act) を実行し、残高を交換する。
 * @param {string} user - 交換を行うユーザー名
 * @param {string} fromCurrency - 売却する通貨コード
 * @param {number} fromAmount - 売却する数量
 * @param {string} toCurrency - 購入する通貨コード
 * @returns {object} 更新された状態 (newState)
 */
export function actExchangeCurrency(user, fromCurrency, fromAmount, toCurrency) {
    const state = getCurrentState();

    if (!state.accounts[user]) {
        throw new Error(`User ${user} not found.`);
    }

    // 1. 残高チェック
    if ((state.accounts[user][fromCurrency] || 0) < fromAmount) {
        throw new Error(`${fromCurrency} の残高が不足しています。`);
    }

    // 2. 数量の計算
    // USD基準で換算
    const rateFrom = EXCHANGE_RATES[fromCurrency] || 1;
    const rateTo = EXCHANGE_RATES[toCurrency] || 1;
    
    // 売却数量をUSD換算
    const usdEquivalent = fromAmount / rateFrom;
    // USD換算値を購入通貨に換算
    const toAmount = usdEquivalent * rateTo;

    // 3. 残高の変更
    state.accounts[user][fromCurrency] -= fromAmount;
    state.accounts[user][toCurrency] = (state.accounts[user][toCurrency] || 0) + toAmount;

    // 4. Tensionの計算と増加
    // ExchangeはMintingよりは低いが、Tensionが発生
    const tensionIncrease = usdEquivalent * 0.001; 
    
    addTension(tensionIncrease); // 💡 修正: addTensionを使用

    // 5. 状態の更新
    updateState(state);
    return state;
}
