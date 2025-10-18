// core/currency.js (状態取得修正版)

// 🌟 修正: LogosState の直接インポートを削除。代わりに getMutableState をインポート。
import { updateState, getMutableState } from './foundation.js'; 
import { ControlMatrix } from './arithmos.js';

// 各通貨の摩擦度
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
    if (state.accounts[sender] === undefined || state.accounts[recipient] === undefined) throw new Error("無効な送金元または受取人です。");
    if (CURRENCY_FRICTION[currency] === undefined) throw new Error(`通貨 ${currency} はサポートされていません。`);
    if (state.accounts[sender][currency] < amount) throw new Error(`${sender} は ${currency} 残高不足です (必要: ${amount.toFixed(2)}, 現状: ${state.accounts[sender][currency].toFixed(2)})。`);

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
    if (state.accounts[sender] === undefined) throw new Error("無効な送金元です。");
    if (CURRENCY_FRICTION[currency] === undefined) throw new Error(`通貨 ${currency} はサポートされていません。`);
    if (state.accounts[sender][currency] < amount) throw new Error(`${sender} は ${currency} 残高不足です (必要: ${amount.toFixed(2)}, 現状: ${state.accounts[sender][currency].toFixed(2)})。`);

    const balance = state.accounts[sender][currency];
    const matrix = new ControlMatrix(state.tension_level);
    const rigor = matrix.rigor;
    
    // 厳密な暴走抑止ロジック
    if (currentTension >= TENSION_THRESHOLD_EXTERNAL_TRANSFER && amount > MIN_EXTERNAL_TRANSFER_AMOUNT) {
        const riskFactor = (amount / balance) * (1 - rigor);
        if (riskFactor > 0.5) { 
            throw new Error(`現在のロゴス緊張度 (${currentTension.toFixed(4)}) では、大規模な外部作為は厳密性 (${rigor.toFixed(4)}) により抑止されます。`);
        }
    }
    
    // 1. 口座から出金
    state.accounts[sender][currency] -= amount;

    // 2. TENSIONの変動計算
    const friction = CURRENCY_FRICTION[currency];
    const tensionChange = friction * (1 + (amount / balance) * 0.1);

    // Tensionインスタンスの add メソッドを呼び出す
    state.tension_level.add(tensionChange); 

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
    if (state.accounts[sender] === undefined) throw new Error("無効な操作ユーザーです。");
    if (CURRENCY_FRICTION[currency] === undefined) throw new Error(`通貨 ${currency} の生成はサポートされていません。`);

    // 1. 口座へ追加
    state.accounts[sender][currency] = (state.accounts[sender][currency] || 0) + amount;
    
    // 2. TENSIONの変動計算
    const friction = CURRENCY_FRICTION[currency];
    const tensionChange = friction * 0.5;

    // Tensionインスタンスの add メソッドを呼び出す
    state.tension_level.add(tensionChange);
    
    state.last_act = `Minting Act (${currency})`;
    state.status_message = `${sender} に ${currency} $${amount.toFixed(2)} 生成。Tension +${tensionChange.toFixed(4)}。`;
    updateState(state);
}
