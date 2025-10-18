// core/currency.js (多通貨・厳密な作為ロジック対応版)

import { LogosState, updateState } from './foundation.js';
import { ControlMatrix } from './arithmos.js';

// 🌟 新規定義: 各通貨の摩擦度（Tension変動への影響）
// High Friction (高摩擦): 暗号通貨など、システムの変動性が高いもの
// Low Friction (低摩擦): 法定通貨など、システムの変動性が低いもの
const CURRENCY_FRICTION = {
    "USD": 0.005, "JPY": 0.005, "EUR": 0.005, // 低摩擦
    "BTC": 0.03, "ETH": 0.02, "MATIC": 0.015 // 高摩擦
};
const MIN_EXTERNAL_TRANSFER_AMOUNT = 100.00; // 外部送金が厳密チェックの対象となる最小額
const TENSION_THRESHOLD_EXTERNAL_TRANSFER = 0.70; // 暴走抑止が強く働くTensionの閾値

// =========================================================================
// 経済ロゴスの作為 (Acts of Economic Logos)
// =========================================================================

/**
 * 第1作為: 内部送金 (低摩擦)
 * @param {string} sender 送金元ユーザー名
 * @param {string} recipient 受取人ユーザー名
 * @param {number} amount 送金数量
 * @param {string} currency 通貨種別 (例: "USD", "JPY") 🌟追加
 */
export function actTransferInternal(sender, recipient, amount, currency = "USD") {
    const state = LogosState;
    
    if (sender === recipient) {
        throw new Error("自己宛の送金は認められません。");
    }
    if (state.accounts[sender] === undefined || state.accounts[recipient] === undefined) {
        throw new Error("無効な送金元または受取人です。");
    }
    if (CURRENCY_FRICTION[currency] === undefined) {
        throw new Error(`通貨 ${currency} はサポートされていません。`);
    }
    
    // 🌟 修正: 残高チェックと操作を多通貨構造に対応
    if (state.accounts[sender][currency] < amount) {
        throw new Error(`${sender} は ${currency} 残高不足です (必要: ${amount.toFixed(2)}, 現状: ${state.accounts[sender][currency].toFixed(2)})。`);
    }

    state.accounts[sender][currency] -= amount;
    state.accounts[recipient][currency] = (state.accounts[recipient][currency] || 0) + amount; // 受取口座に通貨キーがなければ初期化

    state.last_act = `Internal Transfer (${currency})`;
    state.status_message = `${sender} から ${recipient} へ ${currency} 送金完了。`;
    updateState(state);
}


/**
 * 第2作為: 外部送金 (高摩擦) - ロゴス緊張度の主要な駆動源
 * @param {string} sender 送金元ユーザー名
 * @param {number} amount 送金数量
 * @param {string} currency 通貨種別 (例: "USD", "BTC") 🌟追加
 */
export function actExternalTransfer(sender, amount, currency = "USD") {
    const state = LogosState;
    const currentTension = state.tension_level.getValue();
    
    if (state.accounts[sender] === undefined) {
        throw new Error("無効な送金元です。");
    }
    if (CURRENCY_FRICTION[currency] === undefined) {
        throw new Error(`通貨 ${currency} はサポートされていません。`);
    }

    // 🌟 修正: 残高チェックを多通貨構造に対応
    if (state.accounts[sender][currency] < amount) {
        throw new Error(`${sender} は ${currency} 残高不足です (必要: ${amount.toFixed(2)}, 現状: ${state.accounts[sender][currency].toFixed(2)})。`);
    }
    
    // --------------------------------------------------------
    // 🌟 厳密な暴走抑止ロジック (Rigor Check) 🌟
    // --------------------------------------------------------
    const matrix = new ControlMatrix(state.tension_level);
    const rigor = matrix.rigor;
    const balance = state.accounts[sender][currency];
    
    // ロゴス緊張度Tが高い状態 (暴走リスク高) で、かつ送金規模が大きい場合に抑止を強化
    if (currentTension >= TENSION_THRESHOLD_EXTERNAL_TRANSFER && amount > MIN_EXTERNAL_TRANSFER_AMOUNT) {
        // TENSION_THRESHOLD以上で Rigor (厳密性) が低い場合、抑制が発動しやすい
        const riskFactor = (amount / balance) * (1 - rigor); // 送金額の割合と厳密性の反比例
        
        if (riskFactor > 0.5) { // 例: リスクファクターが50%を超えたら拒否
            throw new Error(`現在のロゴス緊張度 (${currentTension.toFixed(4)}) では、大規模な外部作為は厳密性 (${rigor.toFixed(4)}) により抑止されます。`);
        }
    }
    
    // --------------------------------------------------------
    
    // 1. 口座から出金
    state.accounts[sender][currency] -= amount;

    // 2. TENSIONの変動計算
    const friction = CURRENCY_FRICTION[currency];
    const tensionChange = friction * (1 + (amount / balance) * 0.1); // 送金額の割合に応じて摩擦を増幅

    state.tension_level.add(tensionChange);

    state.last_act = `External Transfer (${currency})`;
    state.status_message = `${sender} から ${currency} 外部送金。Tension +${tensionChange.toFixed(4)}。`;
    updateState(state);
}


/**
 * 第3作為: 通貨生成 (Minting Act) - TENSION変動の追加源
 * @param {string} currency 生成する通貨種別
 * @param {number} amount 生成数量
 */
export function actMintCurrency(currency, amount) {
    const state = LogosState;
    const sender = state.active_user;
    
    if (state.accounts[sender] === undefined) {
        throw new Error("無効な操作ユーザーです。");
    }
    if (CURRENCY_FRICTION[currency] === undefined) {
        throw new Error(`通貨 ${currency} の生成はサポートされていません。`);
    }

    // 1. 口座へ追加
    state.accounts[sender][currency] = (state.accounts[sender][currency] || 0) + amount;
    
    // 2. TENSIONの変動計算 (生成も摩擦を生む)
    const friction = CURRENCY_FRICTION[currency];
    const tensionChange = friction * 0.5; // 送金よりは低めの摩擦

    state.tension_level.add(tensionChange);
    
    state.last_act = `Minting Act (${currency})`;
    state.status_message = `${sender} に ${currency} $${amount.toFixed(2)} 生成。Tension +${tensionChange.toFixed(4)}。`;
    updateState(state);
}
