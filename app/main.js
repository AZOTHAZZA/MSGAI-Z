// /app/main.js - MSGAI Pure Core (CalcLang制御下で機能するように調整)

// =========================================================================
// I. ロゴス状態と補助関数 (CalcLang Coreによって利用される部分)
// =========================================================================

// 初期アカウント残高の定義 (全てゼロ)
const INITIAL_ACCOUNTS = {
    User_A: { USD: 0.00, JPY: 0, EUR: 0.00, BTC: 0.0, ETH: 0.0, MATIC: 0.0 },
    User_B: { USD: 0.00, JPY: 0, EUR: 0.00, BTC: 0.0, ETH: 0.0, MATIC: 0.0 },
    User_C: { USD: 0.00, JPY: 0, EUR: 0.00, BTC: 0.0, ETH: 0.0, MATIC: 0.0 }
};

let state = initializeState();

/** 状態の初期化 */
function initializeState() {
    return {
        status_message: "コア起動完了",
        active_user: "User_A",
        accounts: JSON.parse(JSON.stringify(INITIAL_ACCOUNTS)),
        // 💡 Tensionの管理は CalcLang (calcshell_host.js) が担うが、構造は維持
        tension: { value: 0.0, max_limit: 0.5, increase_rate: 0.00001 }
    };
}

/** 状態の取得 (CalcLangコアがTension値を取得・更新するのに利用) */
function getCurrentState() { return state; }

/** 状態の更新 (CalcLangコアがアカウント情報を更新するのに利用) */
function updateState(newState) {
    state = newState;
    localStorage.setItem('msaiState', JSON.stringify(state));
}

// ローカルストレージからの状態復元を試みる
const savedState = localStorage.getItem('msaiState');
if (savedState) {
    try {
        state = JSON.parse(savedState);
        // Tensionの値はCalcLangコアによって常に上書きされる
        state.tension = { value: state.tension.value, max_limit: 0.5, increase_rate: 0.00001 };
        state.status_message = "コア状態復元済み";
    } catch (e) {
        state = initializeState();
    }
} else {
    updateState(state);
}

/** Tensionの追加/削減 (CalcLangコアによって呼び出される) */
function addTension(amount) {
    state.tension.value += amount;
    state.tension.value = Math.max(0, state.tension.value);
    updateState(state);
}

/** アクティブユーザーの設定 */
function setActiveUser(user) {
    if (state.accounts[user]) {
        state.active_user = user;
        updateState(state);
    } else {
        // Tension追加は calcshell_host.js が行う
        throw new Error(`User ${user} not found.`);
    }
}

/** アカウント削除 (リセット) */
function deleteAccounts() {
    localStorage.removeItem('msaiState');
    state = initializeState();
}

// 為替レート
const EXCHANGE_RATES = {
    JPY: 130, 
    EUR: 0.9,
    BTC: 0.00005,
    ETH: 0.001,
    MATIC: 1.5, 
    USD: 1
};


// =========================================================================
// II. 既存の作為実行関数 (CalcLang MöbiusActから呼び出される)
// =========================================================================

/**
 * 通貨生成作為 (Minting Act)
 * 💡 Tensionの更新ロジック（addTensionの直接呼び出し）は CalcLangコアに移動するため、削除またはコメントアウト
 */
function actMintCurrency(user, currency, amount) {
    const currentState = getCurrentState();

    if (!currentState.accounts[user]) {
        throw new Error(`User ${user} not found.`);
    }

    currentState.accounts[user][currency] = (currentState.accounts[user][currency] || 0) + amount;
    
    // 💡 Tension更新ロジックは calcshell_host.js の MöbiusAct に委譲
    // const usdEquivalent = amount / (EXCHANGE_RATES[currency] || 1);
    // const tensionIncrease = usdEquivalent * 0.005; 
    // addTension(tensionIncrease); 

    updateState(currentState);
    return currentState;
}

/**
 * 送金作為 (Transfer Act)
 * 💡 Tensionの更新ロジックは CalcLangコアに移動するため、削除またはコメントアウト
 */
function actTransfer(sender, recipient, amount, currency) {
    const currentState = getCurrentState();
    const isInternal = currentState.accounts[recipient];

    if ((currentState.accounts[sender][currency] || 0) < amount) {
        throw new Error(`${sender} の ${currency} 残高不足です。`);
    }

    currentState.accounts[sender][currency] -= amount;
    
    if (isInternal) {
        currentState.accounts[recipient][currency] = (currentState.accounts[recipient][currency] || 0) + amount;
    }
    
    // 💡 Tension更新ロジックは calcshell_host.js の MöbiusAct に委譲
    // const tensionAmount = isExternal ? amount * 0.0001 : amount * 0.00001;
    // addTension(tensionAmount); 

    updateState(currentState);
    return currentState;
}

/**
 * 通貨交換作為 (Exchange Act)
 * 💡 Tensionの更新ロジックは CalcLangコアに移動するため、削除またはコメントアウト
 */
function actExchangeCurrency(user, fromCurrency, fromAmount, toCurrency) {
    const currentState = getCurrentState();

    if (!currentState.accounts[user]) {
        throw new Error(`User ${user} not found.`);
    }
    if ((currentState.accounts[user][fromCurrency] || 0) < fromAmount) {
        throw new Error(`${fromCurrency} の残高が不足しています。`);
    }

    const rateFrom = EXCHANGE_RATES[fromCurrency] || 1;
    const rateTo = EXCHANGE_RATES[toCurrency] || 1;
    
    const usdEquivalent = fromAmount / rateFrom;
    const toAmount = usdEquivalent * rateTo;

    currentState.accounts[user][fromCurrency] -= fromAmount;
    currentState.accounts[user][toCurrency] = (currentState.accounts[user][toCurrency] || 0) + toAmount;

    // 💡 Tension更新ロジックは calcshell_host.js の MöbiusAct に委譲
    // const tensionIncrease = usdEquivalent * 0.001; 
    // addTension(tensionIncrease);

    updateState(currentState);
    return currentState;
}

// =========================================================================
// III. 既存のUI/Appロジック（そのまま維持または削除）
// =========================================================================

// 💡 注意: 既存の /app/main.js に含まれていた可能性のある
// UI要素のキャッシュ (cacheUIElements) やイベントハンドラの設定 (initializeApp) は、
// 制御を index.html のスクリプトブロックに完全に移譲するため、このファイルからは削除します。
// このファイルは純粋に「状態と作為ロジック」のみを提供します。
