// app/handler.js

import * as CoreAPI from './core_api.js';
import * as UI from './fusionui.js'; // 修正: fusionui.jsをインポート

function getActionInputs() {
    const recipient = document.getElementById('recipient_input').value;
    const amountStr = document.getElementById('amount_input').value;
    const amount = parseFloat(amountStr);
    
    if (isNaN(amount) || amount <= 0) {
        throw new Error("有効な数量を入力してください。");
    }
    return { recipient, amount };
}

function updateUIAndLog(resultMessage) {
    const stateData = JSON.parse(CoreAPI.getCurrentStateJson());
    const matrixData = CoreAPI.getControlParameters(stateData.tension_level);
    UI.updateUI(stateData, resultMessage, matrixData);
}


export function handleDialogueAct() {
    const prompt = document.getElementById('dialogue_input').value;
    if (!prompt) return;

    let resultMessage = '対話応答成功。';
    const username = "User_A";
    
    UI.displayDialogue('User', prompt);
    document.getElementById('dialogue_input').value = '';

    try {
        const responseText = CoreAPI.actDialogue(username, prompt);
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
        CoreAPI.actTransferInternal(sender, recipient, amount);
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
        CoreAPI.actExternal(sender, amount);
        resultMessage = `🚨 外部送金作為受理: $${amount.toFixed(2)} USD。ロゴス緊張度が上昇しました。`;
    } catch (error) {
        resultMessage = `❌ 外部送金作為拒否 (暴走抑止): ${error.message}`;
    }
    updateUIAndLog(resultMessage);
}

export function handleRevisionPetitionAct() {
    let resultMessage = '';
    
    try {
        const revisionMessage = CoreAPI.actPetitionRevision();
        resultMessage = `✅ 修正請願作為受理: ${revisionMessage}`;
    } catch (error) {
        resultMessage = `❌ 修正請願拒否: ${error.message}`;
    }
    updateUIAndLog(resultMessage);
}

export function attachEventHandlers() {
    document.getElementById('dialogue_button').addEventListener('click', handleDialogueAct);
    document.getElementById('dialogue_input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleDialogueAct();
    });
    
    document.getElementById('transfer_internal_button').addEventListener('click', handleInternalTransferAct);
    document.getElementById('transfer_external_button').addEventListener('click', handleExternalTransferAct);
    document.getElementById('revision_button').addEventListener('click', handleRevisionPetitionAct);
}
