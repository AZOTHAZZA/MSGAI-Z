// /core/external_finance_logos.js (純粋なJS版 - Rust/LNP不使用)

/**
 * MSGAIの金融操作を担うサービス（Rust移行前の純粋なJS論理）。
 * 具象的なAPI通信は、ここでは擬似的に成功/失敗として処理される。
 */

// -----------------------------------------------------------
// 1. ユーザー間通貨移動機能（純粋なJSによる内部会計の擬似化）
// -----------------------------------------------------------
export function transferInternalCurrency(userName, targetUserName, denomination, amount) {
    if (userName === targetUserName) {
        return { success: false, reason: "移動元と先が同じです。" };
    }
    
    // 擬似的な摩擦ゼロの会計処理
    console.log(`[JS会計]: ${userName} から ${targetUserName} へ ${amount} ${denomination} を内部移動成功。`);
    
    // 実際にはLocalStorageなどで残高を更新するロジックが入るが、ここでは簡略化
    const transactionId = `TX_INT_${Date.now()}`;
    return { success: true, message: `内部移動成功。取引ID: ${transactionId}` };
}


// -----------------------------------------------------------
// 2. 外部送金機能（純粋なJSによる高摩擦なAPI通信の擬似化）
// -----------------------------------------------------------
export async function initiateExternalTransfer(userName, denomination, amount, externalAddress, platformName) {
    console.log(`[JS外部通信]: ${userName} が ${platformName} への送金を開始。`);

    // 🚨 ここが本来、高摩擦な外部APIへのAJAXリクエストが入る箇所
    
    // 純粋なJS版では、外部APIの非同期処理を擬似的に再現
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5秒のレイテンシを再現 (摩擦の擬似化)

    const randomFailure = Math.random();
    if (randomFailure < 0.2) { // 20%の確率で通信失敗という具象的な摩擦を発生させる
        console.error(`[JS外部通信失敗]: ${platformName} との接続に失敗しました。`);
        return { success: false, reason: "外部プラットフォームとの通信に失敗しました。" };
    }
    
    const transactionId = `TX_EXT_${platformName}_${Date.now()}`;
    console.log(`[JS外部通信成功]: 取引ID ${transactionId}`);
    return { success: true, transactionId: transactionId };
}
