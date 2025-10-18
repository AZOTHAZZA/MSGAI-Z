// core/currency.js (getMutableState対応版 - 全文)

import { updateState, getMutableState, addTension, getCurrentState } from './foundation.js'; 
import { ControlMatrix } from './arithmos.js';

// 各通貨の摩擦度
const CURRENCY_FRICTION = {
    "USD": 0.005, "JPY": 0.005, "EUR": 0.005, 
    "BTC": 0.03, "ETH": 0.02, "MATIC": 0.015 
};
const MIN_EXTERNAL_TRANSFER_AMOUNT = 100.00; 
const TENSION_THRESHOLD_EXTERNAL_TRANSFER = 0.70; 

// =========================================================================
// ヘルパー関数
// =========================================================================

/**
 * 状態を永続化するために渡すオブジェクトから tension_level を除外するヘルパー関数
 */
function createStateToPersist(state) {
    // シャローコピーだが、Tensionインスタンスは削除してFoundation側で上書きされないように保護
    const stateToPersist = { 
        accounts: state.accounts,
        active_user: state.active_user,
        status_message: state.status_message,
        last_act: state.last_act
    };
    return stateToPersist;
}


// =========================================================================
// 経済ロゴスの作為 (Acts of Economic Logos)
// =========================================================================

/**
 * 第1作為: 内部送金 (低摩擦)
 */
export function actTransferInternal(sender, recipient, amount, currency = "USD") {
    // getMutableStateがコピーを返すため、安全に操作できる
    const state = getMutableState(); 
    
    if (sender === recipient) throw new Error("自己宛の送金は認められません。");
    if (state.accounts[sender][currency] < amount) throw new Error("残高が不足しています。");

    state.accounts[sender][currency] -= amount;
    state.accounts[recipient][currency] = (state.accounts[recipient][currency] || 0) + amount;

    state.last_act = `Internal Transfer (${currency})`;
    state.status_message = `${sender} から ${recipient} へ ${currency} $${amount.toFixed(2)} 送金完了。`;
    
    // Tensionを除外した状態を永続化
    updateState(createStateToPersist(state));
}


/**
 * 第2作為: 外部送金 (高摩擦)
 */
export function actExternalTransfer(sender, amount, currency = "USD") {
    const state = getMutableState(); 
    
    if (state.accounts[sender][currency] < amount) throw new Error("残高が不足しています。");

    const balance = state.accounts[sender][currency];
    const matrix = new ControlMatrix(getCurrentState().tension_level); // Tension値は常に最新のものを取得
    
    state.accounts[sender][currency] -= amount;

    const friction = CURRENCY_FRICTION[currency];
    const tensionChange = friction * (1 + (amount / balance) * 0.1);

    // Foundationの安全な関数を使用して Tension を操作
    addTension(tensionChange); 
    
    state.last_act = `External Transfer (${currency})`;
    state.status_message = `${sender} から ${currency} $${amount.toFixed(2)} 外部送金。Tension +${tensionChange.toFixed(4)}。`;
    
    // Tensionを除外した状態を永続化
    updateState(createStateToPersist(state));
}


/**
 * 第3作為: 通貨生成 (Minting Act)
 */
export function actMintCurrency(currency, amount) {
    const state = getMutableState(); 
    const sender = state.active_user;
    
    state.accounts[sender][currency] = (state.accounts[sender][currency] || 0) + amount;
    
    const friction = CURRENCY_FRICTION[currency];
    const tensionChange = friction * 0.5;

    // Foundationの安全な関数を使用して Tension を操作
    addTension(tensionChange); 
    
    state.last_act = `Minting Act (${currency})`;
    state.status_message = `${sender} に ${currency} $${amount.toFixed(2)} 生成。Tension +${tensionChange.toFixed(4)}。`;
    
    // Tensionを除外した状態を永続化
    updateState(createStateToPersist(state));
}
