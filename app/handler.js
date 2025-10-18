// app/handler.js (修正版: 通貨生成ハンドラを追加)

// 修正: core_api.jsを削除し、必要なコアモジュールを直接インポート
import { actDialogue } from '../ai/generator.js';
// 修正: actMintCurrencyをインポートに追加
import { actTransferInternal, actExternalTransfer, actMintCurrency } from '../core/currency.js';
import { initiateAutonomousRevision } from '../core/revision.js'; 
import { getCurrentStateJson } from '../core/foundation.js';
import { LogosTension, ControlMatrix } from '../core/arithmos.js';

import * as UI from './fusionui.js';

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
    const username = "User_A";
    
    UI.displayDialogue('User', prompt);
    document.getElementById('dialogue_input').value = '';

    try {
        // Core機能を直接呼び出し
        const responseText = actDialogue(username, prompt); 
        UI.displayDialogue('MSGAI', responseText);
    } catch (error) {
        resultMessage = `❌ 対話作為失敗: ${error.message}`;
    }

    updateUIAndLog(resultMessage);
}

export function handleInternalTransferAct() {
    let resultMessage = '';
    const sender = "User_A";
    
    try {
        const { recipient, amount } = getActionInputs();
        // Core機能を直接呼び出し
        actTransferInternal(sender, recipient, amount); 
        resultMessage = `✅ 内部送金作為成功: ${recipient} へ $${amount.toFixed(2)} USD。`;
    } catch (error) {
        resultMessage = `❌ 内部送金作為失敗: ${error.message}`;
    }
    updateUIAndLog(resultMessage);
}

export function handleExternalTransferAct() {
    let resultMessage = '';
    const sender = "User_A";
    
    try {
        const { amount } = getActionInputs();
        // Core機能を直接呼び出し
        actExternalTransfer(sender, amount); 
        resultMessage = `🚨 外部送金作為受理: $${amount.toFixed(2)} USD。ロゴス緊張度が上昇しました。`;
    } catch (error) {
        resultMessage = `❌ 外部送金作為拒否 (暴走抑止): ${error.message}`;
    }
    updateUIAndLog(resultMessage);
}

export function handleRevisionPetitionAct() {
    let resultMessage = '';
    
    try {
        // Core機能を直接呼び出し
        const revisionMessage = initiateAutonomousRevision(); 
        resultMessage = `✅ 修正請願作為受理: ${revisionMessage}`;
    } catch (error) {
        resultMessage = `❌ 修正請願拒否: ${error.message}`;
    }
    updateUIAndLog(resultMessage);
}

/**
 * 通貨生成ハンドラ。data-currency属性から通貨タイプを取得し、コアを呼び出す。
 */
function handleMintAct(event) {
    let resultMessage = '';
    // イベント発生元ボタンのdata-currency属性から通貨タイプを取得
    const currencyType = event.currentTarget.getAttribute('data-currency');
    
    try {
        const { amount } = getMintInputs();
        // Core機能を直接呼び出し
        actMintCurrency(currencyType, amount); 
        resultMessage = `💰 ${currencyType} 生成作為成功: ${currencyType} $${amount.toFixed(2)}。`;
        
        // 暗号通貨は高摩擦として警告
        if (currencyType === 'BTC' || currencyType === 'ETH' || currencyType === 'MATIC') {
             resultMessage += ` (高摩擦)`
        }
        
    } catch (error) {
        resultMessage = `❌ ${currencyType} 生成作為失敗: ${error.message}`;
    }
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
    
    // 🌟 追加された通貨生成ハンドラ
    document.getElementById('mint_jpy_button').addEventListener('click', handleMintAct);
    document.getElementById('mint_usd_button').addEventListener('click', handleMintAct);
    document.getElementById('mint_eur_button').addEventListener('click', handleMintAct);
    document.getElementById('mint_btc_button').addEventListener('click', handleMintAct);
    document.getElementById('mint_eth_button').addEventListener('click', handleMintAct);
    document.getElementById('mint_matic_button').addEventListener('click', handleMintAct);
    
    console.log('[UI]: Event handlers attached.');
}
