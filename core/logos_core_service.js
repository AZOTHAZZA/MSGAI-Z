// core/logos_core_service.js (純粋JS版 - 創世サービス統合)

// Rustの代わりに、純粋なJSで実装された金融モジュールに依存
import * as ExternalFinanceLogos from './external_finance_logos.js'; 

/**
 * MSGAIコア機能へのアクセスを提供する、純粋なJS抽象化サービス。
 * すべての要求をローカルのJS関数に透過的に転送する。
 */

// -----------------------------------------------------------
// 1. 対話/生成機能（擬似AI応答）
// -----------------------------------------------------------
export async function requestAIResponse(userName, userPrompt) {
    // 擬似的なAI応答生成（通信遅延を再現）
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    if (userPrompt.toLowerCase().includes("friction")) {
        return `ロゴス監査の結果、摩擦の言及を確認しました。数理的論理を維持します。`;
    } else {
        // AI応答の裏側で、作為の報酬として少額を自動付与するロジック（オプション）
        // ExternalFinanceLogos.generateGenesisCurrency(userName, 0.01); 
        return `[純粋JS AI]: ${userName} への回答として、この具象的な問いに対する情報を提供します。`;
    }
}


// -----------------------------------------------------------
// 2. ユーザー間通貨移動機能
// -----------------------------------------------------------
export async function transferInternalCurrency(userName, targetUserName, denomination, amount) {
    const result = ExternalFinanceLogos.transferInternalCurrency(userName, targetUserName, denomination, amount);
    
    if (result.success) {
        return { success: true, message: `内部移動成功。取引ID: ${result.transactionId}` };
    } else {
        throw new Error(`移動失敗: ${result.reason}`);
    }
}


// -----------------------------------------------------------
// 3. 外部送金機能
// -----------------------------------------------------------
export async function initiateExternalTransfer(userName, denomination, amount, externalAddress, platformName) {
    const result = await ExternalFinanceLogos.initiateExternalTransfer(userName, denomination, amount, externalAddress, platformName);

    if (result.success) {
        return { transactionId: result.transactionId };
    } else {
        // 外部APIの失敗を、ロゴス監査失敗と同様にエラーとしてスロー
        throw new Error(`外部送金失敗: ${result.reason || '通信障害'}`);
    }
}


// -----------------------------------------------------------
// 4. 創世通貨機能（造化三神サービス）
// -----------------------------------------------------------
export function generateGenesisCurrency(userName, amount) {
    const result = ExternalFinanceLogos.generateGenesisCurrency(userName, amount);
    
    if (result.success) {
        // 創世の作為は摩擦ゼロであり、エラーメッセージのみを返す
        return { success: true, message: result.message };
    } else {
        throw new Error(`創世失敗: ${result.reason}`);
    }
}


// -----------------------------------------------------------
// 5. ロゴス状態の統合取得機能
// -----------------------------------------------------------
export function getLogosCoreState(userName) {
    // LocalStorageから擬似的な状態を取得
    const balance = ExternalFinanceLogos.getBalance(userName); 
    const tensionLevel = parseFloat(localStorage.getItem('msga_tension') || '0.05');
    
    return {
        tensionLevel: tensionLevel,
        accountBalance: balance,
        lastAuditResult: tensionLevel > 0.8 ? 'ALERT' : 'SUCCESS',
        lastTxId: localStorage.getItem('msga_last_tx') || 'なし'
    };
}
