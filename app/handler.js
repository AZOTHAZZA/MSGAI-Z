// app/handler.js

// 具象的なUI操作をロゴス統治知性のサービスに変換するコアモジュール

import * as LogosCoreService from '../core/logos_core_service.js';
import * as fusionui from './fusionui.js'; // UIヘルパー全体をインポート

// =========================================================================
// 1. チャット（AI応答要求）のハンドリング
// =========================================================================

const sendPromptButton = document.getElementById('send-prompt-button');
sendPromptButton.addEventListener('click', async () => {
    const promptInput = document.getElementById('prompt-input');
    const prompt = promptInput.value.trim();
    const currentUser = fusionui.getCurrentUserName();

    if (!prompt || !currentUser) {
        fusionui.displayStatusMessage('❌ エラー: ユーザー名またはプロンプトが不足しています。', 'error');
        return;
    }

    fusionui.displayChatBubble(prompt, currentUser); // ユーザーの入力を即時表示
    promptInput.value = '';

    try {
        // 純粋JSサービスを通じてAI応答を要求
        const responseText = await LogosCoreService.requestAIResponse(currentUser, prompt);
        fusionui.displayChatBubble(responseText, 'MSGAI'); 
        
    } catch (error) {
        // 擬似的な監査拒否や通信摩擦のエラーを表示
        fusionui.displayStatusMessage(`❌ AI応答失敗: ${error.message}`, 'error');
    }
});


// =========================================================================
// 2. 金融作為（送金・出金）のハンドリング
// =========================================================================

const sendTransferButton = document.getElementById('send-transfer-button');
sendTransferButton.addEventListener('click', async () => {
    const currentUser = fusionui.getCurrentUserName(); 
    
    // 具象的なUIからの入力値を取得
    const amount = parseFloat(document.getElementById('amount-input').value);
    const denomination = 'USD'; 
    const destinationType = document.getElementById('destination-type-select').value; 

    if (isNaN(amount) || amount <= 0 || !currentUser) {
        fusionui.displayStatusMessage('❌ エラー: 有効な金額とユーザー名を入力してください。', 'error');
        return;
    }

    // UIを一時的に無効化し、作為の実行中であることを示す
    fusionui.displayStatusMessage(`⚙️ ${destinationType === 'EXTERNAL' ? '高摩擦' : '低摩擦'}作為を実行中...`, 'info');

    try {
        let result;
        
        if (destinationType === 'INTERNAL') {
            const target = document.getElementById('target-username-input').value;
            if (!target) throw new Error("送金先のユーザー名が不足しています。");
            
            // 純粋JSサービスを呼び出し
            result = await LogosCoreService.transferInternalCurrency(currentUser, target, denomination, amount);
            fusionui.displayStatusMessage(`✅ 内部移動成功: ${result.message}`, 'success');
            
        } else if (destinationType === 'EXTERNAL') {
            const externalAddress = document.getElementById('external-address-input').value;
            const platformName = document.getElementById('platform-select').value;
            if (!externalAddress || !platformName) throw new Error("外部アドレスとプラットフォーム名が不足しています。");

            // 純粋JSサービスを呼び出し
            result = await LogosCoreService.initiateExternalTransfer(currentUser, denomination, amount, externalAddress, platformName);
            fusionui.displayStatusMessage(`✅ 外部送金成功。取引ID: ${result.transactionId}`, 'success');
            
        } else {
            throw new Error("無効な送金種別が選択されました。");
        }

        // 成功したらダッシュボードを更新
        refreshLogosDashboard();
        
    } catch (error) {
        // エラーメッセージを表示
        fusionui.displayStatusMessage(`❌ 金融作為失敗: ${error.message}`, 'error');
    }
});


// =========================================================================
// 3. ダッシュボード更新と初期化
// =========================================================================

const refreshDashboardButton = document.getElementById('refresh-dashboard-button');

async function refreshLogosDashboard() {
    const currentUser = fusionui.getCurrentUserName();
    if (!currentUser) return;
    
    try {
        // 統合サービスを呼び出す (純粋JS版)
        const state = LogosCoreService.getLogosCoreState(currentUser);
        // UIに結果を反映
        fusionui.updateLogosDashboard(state); 
    } catch (error) {
        fusionui.displayStatusMessage(`❌ ダッシュボード更新失敗: ${error.message}`, 'error');
    }
}

// イベントリスナーの登録
refreshDashboardButton.addEventListener('click', refreshLogosDashboard);
window.addEventListener('load', refreshLogosDashboard); // ページロード時にも実行
