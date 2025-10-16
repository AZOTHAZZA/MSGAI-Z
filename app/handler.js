// app/handler.js

// 具象的なUI操作をロゴス統治知性のサービスに変換するコアモジュール

import * as LogosCoreService from '../core/logos_core_service.js';
import { displayChatBubble, displayStatusMessage, getCurrentUserName } from './fusionui.js'; // UIヘルパーへの依存

// =========================================================================
// 1. チャット（AI応答要求）のハンドリング
// =========================================================================

const sendPromptButton = document.getElementById('send-prompt-button');
sendPromptButton.addEventListener('click', async () => {
    const promptInput = document.getElementById('prompt-input');
    const prompt = promptInput.value.trim();
    const currentUser = getCurrentUserName(); // ユーザーネーム制に対応

    if (!prompt || !currentUser) {
        displayStatusMessage('❌ エラー: ユーザー名またはプロンプトが不足しています。', 'error');
        return;
    }

    displayChatBubble(prompt, currentUser); // ユーザーの入力を即時表示
    promptInput.value = ''; // 入力欄をクリア

    try {
        // Rust非意識の抽象化サービスを通じてAI応答を要求
        const responseText = await LogosCoreService.requestAIResponse(currentUser, prompt);
        
        // UIにMSGAIの応答を表示
        displayChatBubble(responseText, 'MSGAI'); 
        
    } catch (error) {
        // ロゴス監査拒否や通信摩擦のエラーを表示
        displayStatusMessage(`❌ AI応答失敗: ${error.message}`, 'error');
    }
});


// =========================================================================
// 2. 金融作為（送金・出金）のハンドリング
// =========================================================================

const sendTransferButton = document.getElementById('send-transfer-button');
sendTransferButton.addEventListener('click', async () => {
    const currentUser = getCurrentUserName(); 
    
    // 具象的なUIからの入力値を取得
    const amount = parseFloat(document.getElementById('amount-input').value);
    const denomination = 'USD'; // 通貨はUSD（またはMSGAI内部通貨）に固定
    const destinationType = document.getElementById('destination-type-select').value; // 'INTERNAL' or 'EXTERNAL'

    if (isNaN(amount) || amount <= 0 || !currentUser) {
        displayStatusMessage('❌ エラー: 有効な金額とユーザー名を入力してください。', 'error');
        return;
    }

    try {
        let result;
        
        if (destinationType === 'INTERNAL') {
            // A. 低摩擦の内部移動（ユーザー間移動）
            const target = document.getElementById('target-username-input').value;
            if (!target) throw new Error("送金先のユーザー名が不足しています。");
            
            // Rust非意識で内部移動サービスを呼び出し
            result = await LogosCoreService.transferInternalCurrency(currentUser, target, denomination, amount);
            displayStatusMessage(`✅ 内部移動成功: ${result.message}`, 'success');
            
        } else if (destinationType === 'EXTERNAL') {
            // B. 高摩擦の外部送金（出金）
            const externalAddress = document.getElementById('external-address-input').value;
            const platformName = document.getElementById('platform-select').value;
            if (!externalAddress || !platformName) throw new Error("外部アドレスとプラットフォーム名が不足しています。");

            // Rust非意識で外部送金サービスを呼び出し
            result = await LogosCoreService.initiateExternalTransfer(currentUser, denomination, amount, externalAddress, platformName);
            displayStatusMessage(`✅ 外部送金成功。取引ID: ${result.transactionId}`, 'success');
            
        } else {
            throw new Error("無効な送金種別が選択されました。");
        }
        
    } catch (error) {
        // ロゴス緊張度による拒否、または外部API摩擦によるエラーを表示
        displayStatusMessage(`❌ 金融作為失敗: ${error.message}`, 'error');
    }
});

// =========================================================================
// 3. その他のイベント（例: ログイン/ログアウトのプレースホルダー）
// =========================================================================

// ユーザーネームの入力/設定イベントのハンドリング（ここでは簡略化）
document.getElementById('set-username-button').addEventListener('click', () => {
    // 実際にはfusionui.jsのヘルパー関数を呼び出し、ユーザーネームをコアに設定するロジックが入る
    displayStatusMessage(`✅ ユーザー名が設定されました（現在: ${getCurrentUserName()}）。`, 'info');
});

// ... 他のイベントハンドラー（UIの表示切り替えなど） ...
