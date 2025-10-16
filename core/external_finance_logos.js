// msgai_logos_core/core/external_finance_logos.js (純粋JS版 - 造化機能統合)

/**
 * MSGAIの金融操作を担うサービス（Rust移行前の純粋なJS論理）。
 * すべての残高操作はLocal Storageの擬似的な残高に対して行われる。
 */

// ユーザーの残高を取得するヘルパー（純粋JS版対応）
function getBalance(userName) {
    // ローカルストレージに残高がない場合は1000.00を初期値とする
    return parseFloat(localStorage.getItem(`balance_${userName}`) || '1000.00');
}

// 残高を更新するヘルパー（純粋JS版対応）
function setBalance(userName, amount) {
    localStorage.setItem(`balance_${userName}`, amount.toFixed(2));
}

// -----------------------------------------------------------
// 1. ユーザー間通貨移動機能（低摩擦の作為）
// -----------------------------------------------------------
export function transferInternalCurrency(userName, targetUserName, denomination, amount) {
    if (userName === targetUserName) {
        return { success: false, reason: "移動元と先が同じです。" };
    }
    
    const userBalance = getBalance(userName);
    if (userBalance < amount) {
        return { success: false, reason: "残高不足により内部移動を拒否。" };
    }
    
    // 摩擦ゼロの会計処理
    setBalance(userName, userBalance - amount);
    setBalance(targetUserName, getBalance(targetUserName) + amount);
    
    const transactionId = `TX_INT_${Date.now()}`;
    return { success: true, transactionId: transactionId };
}


// -----------------------------------------------------------
// 2. 外部送金機能（高摩擦の擬似API作為）
// -----------------------------------------------------------
export async function initiateExternalTransfer(userName, denomination, amount, externalAddress, platformName) {
    const userBalance = getBalance(userName);
    if (userBalance < amount) {
        return { success: false, reason: "残高不足のため外部送金を拒否。" };
    }

    // 擬似的な外部API通信の遅延と失敗を再現 (高摩擦のシミュレーション)
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    const randomFailure = Math.random();
    
    if (randomFailure < 0.25) { // 25%の確率で通信失敗 or 擬似的なロゴス監査拒否
        return { success: false, reason: "外部API通信またはロゴス緊張度による拒否。" };
    }
    
    // 成功した場合、残高を減算
    setBalance(userName, userBalance - amount);
    
    const transactionId = `TX_EXT_${platformName}_${Date.now()}`;
    localStorage.setItem('msga_last_tx', transactionId);
    return { success: true, transactionId: transactionId };
}


// -----------------------------------------------------------
// 3. 創世通貨機能（造化三神の作為 - 摩擦ゼロ）
// -----------------------------------------------------------
export function generateGenesisCurrency(userName, amount) {
    if (amount <= 0) {
        return { success: false, reason: "生成量は正の値でなければなりません。" };
    }

    const currentBalance = getBalance(userName);
    setBalance(userName, currentBalance + amount);
    
    const newBalance = getBalance(userName);
    return { success: true, message: `創世完了。新残高: ${newBalance.toFixed(2)}` };
}
