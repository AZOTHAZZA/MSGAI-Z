// core/currency.js (addTension利用徹底版 - 全文)

// 🌟 修正: Foundationから updateState, getMutableState に加えて addTension をインポート
import { updateState, getMutableState, addTension } from './foundation.js'; 
import { ControlMatrix } from './arithmos.js';

// 各通貨の摩擦度（変更なし）
const CURRENCY_FRICTION = {
    "USD": 0.005, "JPY": 0.005, "EUR": 0.005, // 低摩擦
    "BTC": 0.03, "ETH": 0.02, "MATIC": 0.015 // 高摩擦
};
const MIN_EXTERNAL_TRANSFER_AMOUNT = 100.00; 
const TENSION_THRESHOLD_EXTERNAL_TRANSFER = 0.70; 

// =========================================================================
// 経済ロゴスの作為 (Acts of Economic Logos)
// =========================================================================

/**
 * 第1作為: 内部送金 (低摩擦)
 */
export function actTransferInternal(sender, recipient, amount, currency = "USD") {
    const state = getMutableState(); 
    
    if (sender === recipient) throw new Error("自己宛の送金は認められません。");
    if (state.accounts[sender][currency] < amount) throw new Error("残高が不足しています。");

    state.accounts[sender][currency] -= amount;
    state.accounts[recipient][currency] = (state.accounts[recipient][currency] || 0) + amount;

    state.last_act = `Internal Transfer (${currency})`;
    state.status_message = `${sender} から ${recipient} へ ${currency} $${amount.toFixed(2)} 送金完了。`;
    
    updateState(state);
}


/**
 * 第2作為: 外部送金 (高摩擦)
 */
export function actExternalTransfer(sender, amount, currency = "USD") {
    const state = getMutableState(); 
    
    if (state.accounts[sender][currency] < amount) throw new Error("残高が不足しています。");

    const balance = state.accounts[sender][currency];
    // ControlMatrix の計算には影響なし
    const matrix = new ControlMatrix(state.tension_level); 
    const rigor = matrix.rigor;
    
    // 1. 口座から出金
    state.accounts[sender][currency] -= amount;

    // 2. TENSIONの変動計算
    const friction = CURRENCY_FRICTION[currency];
    const tensionChange = friction * (1 + (amount / balance) * 0.1);

    // 🌟 修正: state.tension_level.add() の代わりに Foundation.addTension() を使用
    addTension(tensionChange); 
    
    state.last_act = `External Transfer (${currency})`;
    state.status_message = `${sender} から ${currency} $${amount.toFixed(2)} 外部送金。Tension +${tensionChange.toFixed(4)}。`;
    updateState(state);
}


/**
 * 第3作為: 通貨生成 (Minting Act)
 */
export function actMintCurrency(currency, amount) {
    const state = getMutableState(); 
    const sender = state.active_user;
    
    // 1. 口座へ追加
    state.accounts[sender][currency] = (state.accounts[sender][currency] || 0) + amount;
    
    // 2. TENSIONの変動計算
    const friction = CURRENCY_FRICTION[currency];
    const tensionChange = friction * 0.5;

    // 🌟 修正: state.tension_level.add() の代わりに Foundation.addTension() を使用
    addTension(tensionChange); 
    
    state.last_act = `Minting Act (${currency})`;
    state.status_message = `${sender} に ${currency} $${amount.toFixed(2)} 生成。Tension +${tensionChange.toFixed(4)}。`;
    updateState(state);
}
