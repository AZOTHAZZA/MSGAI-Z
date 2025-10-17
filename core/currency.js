// core/currency.js

import { getCurrentState, updateState } from './foundation.js';
import { calculateTension } from './ai_control.js';
import { LogosTension } from './arithmos.js';
import { TensionEvent } from './silence.js';

const TENSION_THRESHOLD = 0.85;

/**
 * 低摩擦な内部送金（ウォレット間送金）を実行する。
 */
export function actTransferInternal(sender, recipient, amount) {
    const state = getCurrentState();
    
    if (!state.accounts[sender] || !state.accounts[recipient]) {
        throw new Error("指定されたアカウントが見つかりません。");
    }
    if (state.accounts[sender] < amount) {
        throw new Error("残高不足のため、ウォレット間送金ができませんでした。");
    }
    
    // 送金処理
    state.accounts[sender] -= amount;
    state.accounts[recipient] += amount;

    state.last_act = `Wallet Transfer: ${sender} -> ${recipient} ($${amount.toFixed(2)})`;
    updateState(state);
}

/**
 * 高摩擦な外部送金（外部出金依頼/コンプライアンス監査）を実行する。
 */
export function actExternalTransfer(sender, amount) {
    const state = getCurrentState();
    const currentTension = new LogosTension(state.tension_level);
    
    // 1. 残高チェック
    if (!state.accounts[sender]) {
        throw new Error("指定されたアカウントが見つかりません。");
    }
    if (state.accounts[sender] < amount) {
        throw new Error("残高不足のため、外部出金ができませんでした。");
    }

    // 2. ロゴス緊張度に基づくコンプライアンス監査（暴走抑止）
    if (currentTension.getValue() > TENSION_THRESHOLD) {
        // 拒否時も監査によって緊張度が若干上昇したことを示唆
        const newTension = calculateTension(currentTension, TensionEvent.RejectedAudit);
        state.tension_level = newTension.getValue();
        updateState(state);
        // 擬態戦略に基づき、中立的なエラーメッセージを返す
        throw new Error(`セキュリティレベル高: 現在、コンプライアンス監査により取引が一時的に制限されています。`);
    }

    // 3. 外部出金処理
    state.accounts[sender] -= amount;
    
    // 4. 外部出金による緊張度の上昇
    const newTension = calculateTension(currentTension, TensionEvent.ExternalAct);
    state.tension_level = newTension.getValue();

    state.last_act = `External Withdrawal: ${sender} OUT ($${amount.toFixed(2)})`;
    updateState(state);
}
