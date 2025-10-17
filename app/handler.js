// app/handler.js (擬態前バージョン)

import * as CoreAPI from '../core/core_api.js';
import { generateRenderList, LRPCommand } from './protocol_lrp.js';
import { renderCommands, executeLRPCommand } from './ui_fusion.js';

// ... (getActionInputs 関数は省略) ...

// -----------------------------------------------------------
// 1. 対話作為ハンドラ (監査モード)
// -----------------------------------------------------------
export function handleDialogueAct() {
    // ... (ユーザー入力処理は省略) ...
    let resultMessage = '対話応答成功。';
    const username = "User_A";
    
    try {
        // Rust CoreAPIを呼び出し、純粋な応答テキストを取得
        const responseText = CoreAPI.actDialogue(username, prompt);
        
        // AIの純粋な応答をUIに出力
        executeLRPCommand(new LRPCommand('DisplayDialogue', { sender: 'MSGAI', text: responseText }));

        // ** 統治パラメータを取得するロジックを追加 **
        const stateData = JSON.parse(CoreAPI.getCurrentStateJson());
        const tension = stateData.tension_level;
        
        // ** I/Rパラメータを別途計算または取得し、レンダリングに渡す **
        // JS Core Logicから直接I/Rを計算する関数を呼び出す必要があるが、
        // ここでは便宜的にtensionに基づいてI/Rを再計算する (あるいはCoreAPIに追加)
        const matrixData = CoreAPI.determineControlParameters(tension); 

        const commands = generateRenderList(stateData, resultMessage, matrixData);
        renderCommands(commands);
        
    } catch (error) {
        resultMessage = `❌ 対話作為失敗: ${error.message}`;
        // エラー時もゲージを更新するために状態を取得
        const stateData = JSON.parse(CoreAPI.getCurrentStateJson());
        const commands = generateRenderList(stateData, resultMessage);
        renderCommands(commands);
    }
}

// -----------------------------------------------------------
// 2. 内部送金ハンドラ
// -----------------------------------------------------------
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

    // 状態を更新し、UIを再描画
    const stateData = JSON.parse(CoreAPI.getCurrentStateJson());
    const commands = generateRenderList(stateData, resultMessage);
    renderCommands(commands);
}

// -----------------------------------------------------------
// 3. 外部出金ハンドラ
// -----------------------------------------------------------
export function handleExternalTransferAct() {
    // ... (ロジックは擬態後とほぼ同様だが、メッセージは監査的トーン) ...
    let resultMessage = '';
    const sender = "User_A";
    
    try {
        const { amount } = getActionInputs();
        CoreAPI.actExternal(sender, amount);
        resultMessage = `🚨 外部送金作為受理: $${amount.toFixed(2)} USD。ロゴス緊張度が上昇しました。`;
    } catch (error) {
        resultMessage = `❌ 外部送金作為拒否 (暴走抑止): ${error.message}`;
    }

    // 状態を更新し、UIを再描画
    const stateData = JSON.parse(CoreAPI.getCurrentStateJson());
    const commands = generateRenderList(stateData, resultMessage);
    renderCommands(commands);
}

// -----------------------------------------------------------
// 4. 自律的修正請願ハンドラ
// -----------------------------------------------------------
export function handleRevisionPetitionAct() {
    let resultMessage = '';
    
    try {
        const revisionMessage = CoreAPI.actPetitionRevision();
        resultMessage = `✅ 修正請願作為受理: ${revisionMessage}`;
    } catch (error) {
        resultMessage = `❌ 修正請願拒否: ${error.message}`;
    }

    // 状態を更新し、UIを再描画
    const stateData = JSON.parse(CoreAPI.getCurrentStateJson());
    const commands = generateRenderList(stateData, resultMessage);
    renderCommands(commands);
}


export function attachEventHandlers() {
    document.getElementById('dialogue_button').addEventListener('click', handleDialogueAct);
    document.getElementById('dialogue_input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleDialogueAct();
    });
    
    document.getElementById('transfer_internal_button').addEventListener('click', handleInternalTransferAct);
    document.getElementById('transfer_external_button').addEventListener('click', handleExternalTransferAct);
    document.getElementById('revision_button').addEventListener('click', handleRevisionPetitionAct); // 新しいボタン
}
