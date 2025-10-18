// core/currency.js (getMutableState利用徹底版)

// 🌟 修正: LogosStateを直接importしない。
import { updateState, getMutableState } from './foundation.js'; 
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
    const state = getMutableState(); // 🌟 最新の状態を取得
    
    // ... (チェックロジックは省略) ...
    if (sender === recipient) throw new Error("自己宛の送金は認められません。");
    // ... (他のチェックも省略) ...

    state.accounts[sender][currency] -= amount;
    state.accounts[recipient][currency] = (state.accounts[recipient][currency] || 0) + amount;

    state.last_act = `Internal Transfer (${currency})`;
    state.status_message = `${sender} から ${recipient} へ ${currency} 送金完了。`;
    
    updateState(state);
}


/**
 * 第2作為: 外部送金 (高摩擦)
 */
export function actExternalTransfer(sender, amount, currency = "USD") {
    const state = getMutableState(); // 🌟 最新の状態を取得
    const currentTension = state.tension_level.getValue(); 
    
    // ... (チェックロジックは省略) ...

    const balance = state.accounts[sender][currency];
    const matrix = new ControlMatrix(state.tension_level);
    const rigor = matrix.rigor;
    
    // 厳密な暴走抑止ロジック（省略）
    
    // 1. 口座から出金
    state.accounts[sender][currency] -= amount;

    // 2. TENSIONの変動計算
    const friction = CURRENCY_FRICTION[currency];
    const tensionChange = friction * (1 + (amount / balance) * 0.1);

    // Tensionインスタンスの add メソッドを呼び出す
    state.tension_level.add(tensionChange); // 🌟 これが動作する
    
    state.last_act = `External Transfer (${currency})`;
    state.status_message = `${sender} から ${currency} 外部送金。Tension +${tensionChange.toFixed(4)}。`;
    updateState(state);
}


/**
 * 第3作為: 通貨生成 (Minting Act)
 */
export function actMintCurrency(currency, amount) {
    const state = getMutableState(); // 🌟 最新の状態を取得
    const sender = state.active_user;
    
    // ... (チェックロジックは省略) ...

    // 1. 口座へ追加
    state.accounts[sender][currency] = (state.accounts[sender][currency] || 0) + amount;
    
    // 2. TENSIONの変動計算
    const friction = CURRENCY_FRICTION[currency];
    const tensionChange = friction * 0.5;

    // Tensionインスタンスの add メソッドを呼び出す
    state.tension_level.add(tensionChange); // 🌟 これが動作する
    
    state.last_act = `Minting Act (${currency})`;
    state.status_message = `${sender} に ${currency} $${amount.toFixed(2)} 生成。Tension +${tensionChange.toFixed(4)}。`;
    updateState(state);
}
