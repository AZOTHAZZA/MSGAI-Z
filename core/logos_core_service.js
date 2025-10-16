// /core/logos_core_service.js (純粋JS版 - Rust/LNP依存性排除)

// Rustの代わりに、純粋なJSで実装された金融モジュールに依存
import * as ExternalFinanceLogos from './external_finance_logos.js'; 

/**
 * MSGAIコア機能へのアクセスを提供する、純粋なJS抽象化サービス。
 * すべての要求をローカルのJS関数に透過的に転送する。
 */

// -----------------------------------------------------------
// 1. 対話/生成機能（旧: generator.js, dialogue.js 連携）
// -----------------------------------------------------------
export async function requestAIResponse(userName, userPrompt) {
    console.log(`[JS服務]: ${userName} からのプロンプトを受領。`);
    
    // 擬似的なAI応答生成（外部API通信の代わり）
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    if (userPrompt.toLowerCase().includes("friction")) {
        return `ロゴス監査の結果、摩擦の言及を確認しました。数理的論理を維持します。`;
    } else if (userPrompt.toLowerCase().includes("send") || userPrompt.toLowerCase().includes("transfer")) {
        return `金融作為に関する質問は、専用の送金/出金フォームをご利用ください。`;
    } else {
        return `[純粋JS AI]: ${userName} への回答として、この具象的な問いに対する一般的な情報を提供します。`;
    }
}


// -----------------------------------------------------------
// 2. ユーザー間通貨移動機能（純粋JS版のサービス呼び出し）
// -----------------------------------------------------------
export async function transferInternalCurrency(userName, targetUserName, denomination, amount) {
    // 依存モジュールに作為を委譲
    const result = ExternalFinanceLogos.transferInternalCurrency(userName, targetUserName, denomination, amount);
    
    if (result.success) {
        return { success: true, message: `内部移動成功。取引ID: ${result.transactionId}` };
    } else {
        throw new Error(`移動失敗: ${result.reason}`);
    }
}


// -----------------------------------------------------------
// 3. 外部送金機能（純粋JS版のサービス呼び出し）
// -----------------------------------------------------------
export async function initiateExternalTransfer(userName, denomination, amount, externalAddress, platformName) {
    // 依存モジュールに非同期作為を委譲
    const result = await ExternalFinanceLogos.initiateExternalTransfer(userName, denomination, amount, externalAddress, platformName);

    if (result.success) {
        return { transactionId: result.transactionId };
    } else {
        // 外部APIの失敗をエラーとしてスロー
        throw new Error(`外部送金失敗: ${result.reason || '通信障害'}`);
    }
}


// -----------------------------------------------------------
// 4. ロゴス状態の統合取得機能 (純粋JS版)
// -----------------------------------------------------------
export function getLogosCoreState(userName) {
    // ローカルストレージまたはJS変数から擬似的な状態を取得
    const tensionLevel = parseFloat(localStorage.getItem('msga_tension') || '0.05');
    const accountBalance = parseFloat(localStorage.getItem(`balance_${userName}`) || '1000.00');

    return {
        tensionLevel: tensionLevel,
        accountBalance: accountBalance,
        lastAuditResult: tensionLevel > 0.8 ? 'ALERT' : 'SUCCESS',
        lastTxId: localStorage.getItem('msga_last_tx') || 'なし'
    };
}
