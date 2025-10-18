// core/currency.js: 経済ロゴス（通貨、残高）の作為を統治する

import { getCurrentState, updateState } from './foundation.js';
import { LogosTension, calculateTension } from './arithmos.js';
import { TensionEvent, TENSION_ALERT_THRESHOLD } from './silence.js';

// 通貨の摩擦度を定義
const CURRENCY_FRICTION = {
    // 低摩擦: Tの変動は小さい
    JPY: { friction: 0.01, event: TensionEvent.StandardInteraction },
    USD: { friction: 0.015, event: TensionEvent.StandardInteraction },
    EUR: { friction: 0.015, event: TensionEvent.StandardInteraction },
    // 高摩擦: Tの変動は大きい
    BTC: { friction: 0.10, event: TensionEvent.ExternalAct },
    ETH: { friction: 0.08, event: TensionEvent.ExternalAct },
    MATIC: { friction: 0.05, event: TensionEvent.ExternalAct },
};

/**
 * 送金処理の基盤となるロジック。
 * @param {string} sender 送金元
 * @param {string} recipient 受取人
 * @param {number} amount 数量
 * @param {string} eventType 緊張度に影響を与えるイベントタイプ
 * @param {boolean} checkRigor 厳密性（暴走抑止）チェックを行うか
 */
function processTransfer(sender, recipient, amount, eventType, checkRigor = false) {
    const state = getCurrentState();
    const currentTension = new LogosTension(state.tension_level);
    
    // 1. 暴走抑止チェック
    if (checkRigor && currentTension.getValue() >= TENSION_ALERT_THRESHOLD) {
        // Tが閾値を超えている場合、作為を拒否し、Tを上昇させる
        const rejectedTension = calculateTension(currentTension, TensionEvent.RejectedAudit);
        state.tension_level = rejectedTension.getValue();
        updateState(state);
        throw new Error("高緊張度のロゴス監査により、高摩擦な作為は拒否されました。");
    }

    // 2. 残高チェック
    if (state.accounts[sender] < amount) {
        throw new Error("残高不足により作為を拒否しました。");
    }

    // 3. 状態更新
    state.accounts[sender] -= amount;
    
    // 内部送金の場合のみ受取人に加算（外部作為はシステム外への排出をシミュレート）
    if (recipient && state.accounts[recipient] !== undefined) {
        state.accounts[recipient] += amount;
    }

    // 4. 緊張度の再計算
    const newTension = calculateTension(currentTension, eventType);
    state.tension_level = newTension.getValue();
    state.last_act = `Transfer Act: ${sender} -> ${recipient || 'External'} (${amount.toFixed(2)})`;
    updateState(state);
}

// =========================================================================

/**
 * 第六作為: 内部送金 (低摩擦)
 */
export function actTransferInternal(sender, recipient, amount) {
    // 内部送金はTENSION_EVENT.INTERNAL_TRANSFER を使用し、暴走抑止は行わない
    processTransfer(sender, recipient, amount, TensionEvent.InternalTransfer, false);
}

/**
 * 第七作為: 外部送金 (高摩擦)
 */
export function actExternalTransfer(sender, amount) {
    // 外部送金はTENSION_EVENT.EXTERNAL_ACT を使用し、暴走抑止チェックを行う
    processTransfer(sender, null, amount, TensionEvent.ExternalAct, true);
}

/**
 * 第八作為: 通貨生成 (Minting Act)
 * ロゴス通貨を創造し、システムに供給する作為
 */
export function actMintCurrency(currencyType, amount) {
    const state = getCurrentState();
    const currentTension = new LogosTension(state.tension_level);
    const frictionData = CURRENCY_FRICTION[currencyType];
    
    if (!frictionData) {
        throw new Error(`未定義の通貨 (${currencyType}) の生成作為は拒否されました。`);
    }

    // 1. 緊張度の計算
    // Minting Actは常に緊張度を上昇させる（創造性にはコストが伴う）
    let newTension;
    if (currencyType === 'JPY' || currencyType === 'USD' || currencyType === 'EUR') {
        // 法定通貨（低摩擦としてStandardInteractionのT変化を流用）
        newTension = calculateTension(currentTension, TensionEvent.StandardInteraction);
    } else {
        // 暗号通貨（高摩擦としてExternalActのT変化を流用）
        newTension = calculateTension(currentTension, TensionEvent.ExternalAct);
    }
    
    // 2. 残高の更新 (User_Aの残高が増加)
    const baseAccount = "User_A";
    const newAccountKey = `${baseAccount}_${currencyType}`;
    
    // ロゴス監査コンソールでは、User_AのUSD残高に統合して表示されることを前提とする
    // 簡潔のため、ここでは User_A の USD 残高に加算します。
    // *本来は、通貨ロゴスの変換ロジックが必要です。
    state.accounts[baseAccount] += amount * 1.0; 
    
    // 3. 状態の更新
    state.tension_level = newTension.getValue();
    state.last_act = `Mint Act: ${currencyType} generated (${amount.toFixed(2)})`;
    updateState(state);
}
