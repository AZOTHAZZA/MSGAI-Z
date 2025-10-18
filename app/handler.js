// app/handler.js (ユーザー切り替え・リセットハンドラ追加版)

import { actDialogue } from '../ai/generator.js';
import { actTransferInternal, actExternalTransfer, actMintCurrency } from '../core/currency.js';
import { initiateAutonomousRevision } from '../core/revision.js'; 
// 修正: setActiveUser と deleteAccounts をインポート
import { getCurrentStateJson, setActiveUser, deleteAccounts } from '../core/foundation.js';
import { LogosTension, ControlMatrix } from '../core/arithmos.js';

import * as UI from './fusionui.js';

// ... (getActionInputs, getMintInputs, updateUIAndLog 関数は変更なし) ...
function getActionInputs() {
    const recipient = document.getElementById('recipient_input').value;
    const amount = parseFloat(document.getElementById('amount_input').value);
    
    if (isNaN(amount) || amount <= 0) {
        throw new Error("数量は正の数でなければなりません。");
    }
    return { recipient, amount };
}

function getMintInputs() {
    const amount = parseFloat(document.getElementById('mint_amount_input').value);
    
    if (isNaN(amount) || amount <= 0) {
        throw new Error("生成数量は正の数でなければなりません。");
    }
    return { amount };
}

/**
 * 状態を取得し、I/Rパラメータを計算してUIを更新するヘルパー関数。
 */
function updateUIAndLog(resultMessage) {
    const stateData = JSON.parse(getCurrentStateJson());
    
    // I/Rパラメータの計算ロジックをhandler.js内で実行
    const tension = new LogosTension(stateData.tension_level);
    const matrix = new ControlMatrix(tension);
    
    const matrixData = {
        intensity: matrix.intensity,
        rigor: matrix.rigor
    };

    UI.updateUI(stateData, resultMessage, matrixData);
}

// =========================================================================
// Aspekton: Act Handlers
// =========================================================================

export function handleDialogueAct() {
    const prompt = document.getElementById('dialogue_input').value;
    if (!prompt) return;

    let resultMessage = '対話応答成功。';
    const state = JSON.parse(getCurrentStateJson());
    const username = state.active_user; // 🌟 アクティブユーザーを使用
    
    UI.displayDialogue('User', prompt);
    document.getElementById('dialogue_input').value = '';

    try {
        const responseText = actDialogue(username, prompt); 
        UI.displayDialogue('MSGAI', responseText);
    } catch (error) {
        resultMessage = `❌ 対話作為失敗: ${error.message}`;
    }

    updateUIAndLog(resultMessage);
}

export function handleInternalTransferAct() {
    let resultMessage = '';
    const state = JSON.parse(getCurrentStateJson());
    const sender = state.active_user; // 🌟 アクティブユーザーを使用
    
    try {
        const { recipient, amount } = getActionInputs();
        actTransferInternal(sender, recipient, amount); 
        resultMessage = `✅ 内部送金作為成功: ${sender} -> ${recipient} へ $${amount.toFixed(2)} USD。`;
    } catch (error) {
        resultMessage = `❌ 内部送金作為失敗: ${error.message}`;
    }
    updateUIAndLog(resultMessage);
}

export function handleExternalTransferAct() {
    let resultMessage = '';
    const state = JSON.parse(getCurrentStateJson());
    const sender = state.active_user; // 🌟 アクティブユーザーを使用
    
    try {
        const { amount } = getActionInputs();
        actExternalTransfer(sender, amount); 
        resultMessage = `🚨 外部送金作為受理: ${sender} から $${amount.toFixed(2)} USD。ロゴス緊張度が上昇しました。`;
    } catch (error) {
        resultMessage = `❌ 外部送金作為拒否 (暴走抑止): ${error.message}`;
    }
    updateUIAndLog(resultMessage);
}

export function handleRevisionPetitionAct() {
    let resultMessage = '';
    
    try {
        const revisionMessage = initiateAutonomousRevision(); 
        resultMessage = `✅ 修正請願作為受理: ${revisionMessage}`;
    } catch (error) {
        resultMessage = `❌ 修正請願拒否: ${error.message}`;
    }
    updateUIAndLog(resultMessage);
}

function handleMintAct(event) {
    let resultMessage = '';
    const currencyType = event.currentTarget.getAttribute('data-currency');
    
    try {
        const { amount } = getMintInputs();
        actMintCurrency(currencyType, amount); 
        resultMessage = `💰 ${currencyType} 生成作為成功: ${currencyType} $${amount.toFixed(2)}。`;
        
        if (currencyType === 'BTC' || currencyType === 'ETH' || currencyType === 'MATIC') {
             resultMessage += ` (高摩擦)`
        }
        
    } catch (error) {
        resultMessage = `❌ ${currencyType} 生成作為失敗: ${error.message}`;
    }
    updateUIAndLog(resultMessage);
}


/**
 * 🌟 追加: アクティブユーザー切り替えハンドラ
 */
function handleActiveUserChange(event) {
    const newUsername = event.target.value;
    let resultMessage = '';
    try {
        resultMessage = setActiveUser(newUsername);
    } catch (error) {
        resultMessage = `❌ ユーザー切り替え失敗: ${error.message}`;
    }
    // ユーザーが切り替わったため、UI全体を更新
    updateUIAndLog(resultMessage);
}

/**
 * 🌟 追加: 口座情報削除ハンドラ
 */
function handleDeleteAccountsAct() {
    let resultMessage = '';
    if (confirm("警告: 口座情報、緊張度を初期値にリセットします。続行しますか？")) {
        try {
            resultMessage = deleteAccounts();
        } catch (error) {
            resultMessage = `❌ 口座リセット失敗: ${error.message}`;
        }
    } else {
        resultMessage = "口座リセット作為をキャンセルしました。";
    }
    // 状態がリセットされたため、UI全体を更新
    updateUIAndLog(resultMessage);
}

// =========================================================================
// Event Handler Attachment
// =========================================================================

export function attachEventHandlers() {
    // 既存のハンドラ
    document.getElementById('dialogue_button').addEventListener('click', handleDialogueAct);
    document.getElementById('transfer_internal_button').addEventListener('click', handleInternalTransferAct);
    document.getElementById('transfer_external_button').addEventListener('click', handleExternalTransferAct);
    document.getElementById('revision_button').addEventListener('click', handleRevisionPetitionAct);
    
    // 通貨生成ハンドラ
    document.getElementById('mint_jpy_button').addEventListener('click', handleMintAct);
    document.getElementById('mint_usd_button').addEventListener('click', handleMintAct);
    document.getElementById('mint_eur_button').addEventListener('click', handleMintAct);
    document.getElementById('mint_btc_button').addEventListener('click', handleMintAct);
    document.getElementById('mint_eth_button').addEventListener('click', handleMintAct);
    document.getElementById('mint_matic_button').addEventListener('click', handleMintAct);
    
    // 🌟 追加された新しいハンドラ
    document.getElementById('active_user_select').addEventListener('change', handleActiveUserChange);
    document.getElementById('delete_accounts_button').addEventListener('click', handleDeleteAccountsAct);
    
    console.log('[UI]: Event handlers attached.');
}
