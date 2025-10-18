// core/currency.js

import { getCurrentState, updateState } from './foundation.js';
import { LogosTension, calculateTension } from './arithmos.js'; // 修正: arithmosからインポート
import { TensionEvent } from './silence.js';

const TENSION_THRESHOLD = 0.85;

export function actTransferInternal(sender, recipient, amount) {
    const state = getCurrentState();
    if (!state.accounts[sender] || !state.accounts[recipient]) { throw new Error("指定されたアカウントが見つかりません。"); }
    if (state.accounts[sender] < amount) { throw new Error("残高不足のため、ウォレット間送金ができませんでした。"); }
    
    state.accounts[sender] -= amount;
    state.accounts[recipient] += amount;
    state.last_act = `Wallet Transfer: ${sender} -> ${recipient} ($${amount.toFixed(2)})`;
    updateState(state);
}

// 高摩擦な外部送金（暴走抑止のロジックを含むため、autonomy.jsの機能も実質的にここに統合）
export function actExternalTransfer(sender, amount) {
    const state = getCurrentState();
    const currentTension = new LogosTension(state.tension_level);
    
    if (!state.accounts[sender] || state.accounts[sender] < amount) { throw new Error("残高不足のため、外部出金ができませんでした。"); }

    // 暴走抑止チェック
    if (currentTension.getValue() > TENSION_THRESHOLD) {
        const newTension = calculateTension(currentTension, TensionEvent.RejectedAudit);
        state.tension_level = newTension.getValue();
        updateState(state);
        throw new Error(`セキュリティレベル高: 現在、コンプライアンス監査により取引が一時的に制限されています。`);
    }

    state.accounts[sender] -= amount;
    
    const newTension = calculateTension(currentTension, TensionEvent.ExternalAct);
    state.tension_level = newTension.getValue();

    state.last_act = `External Withdrawal: ${sender} OUT ($${amount.toFixed(2)})`;
    updateState(state);
}
