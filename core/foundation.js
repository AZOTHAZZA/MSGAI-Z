// core/foundation.js (構文エラー修正済み - 全文)

// 初期アカウント残高の定義 (USD, JPY, EUR, BTC, ETH, MATIC)
const INITIAL_ACCOUNTS = {
    User_A: { USD: 0.00, JPY: 0.00, EUR: 0.00, BTC: 0.00, ETH: 0.00, MATIC: 0.00 },
    User_B: { USD: 0.00, JPY: 0.00, EUR: 0.00, BTC: 0.00, ETH: 0.00, MATIC: 0.00 },
    User_C: { USD: 0.00, JPY: 0.00, EUR: 0.00, BTC: 0.00, ETH: 0.00, MATIC: 0.00 }
};

// =========================================================================
// 状態管理 (State Management)
// =========================================================================

let state = initializeState();

/**
 * 初期状態を定義する。
 * @returns {object} 初期状態オブジェクト
 */
function initializeState() {
    return {
        status_message: "コア起動完了",
        active_user: "User_A",
        accounts: JSON.parse(JSON.stringify(INITIAL_ACCOUNTS)), // ディープコピー
        tension: { value: 0.0, max_limit: 0.5, increase_rate: 0.00001 }
    };
}

/**
 * 現在の状態を取得する。
 * @returns {object} 現在の状態
 */
export function getCurrentState() {
    return state;
}

/**
 * 状態を更新する。
 * @param {object} newState - 新しい状態オブジェクト
 */
function updateState(newState) {
    state = newState;
    // 状態をローカルストレージに保存（持続性のため）
    localStorage.setItem('msaiState', JSON.stringify(state));
}

// ローカルストレージからの状態復元を試みる
const savedState = localStorage.getItem('msaiState');
if (savedState) {
    try {
        state = JSON.parse(savedState);
        // Tensionインスタンスを再初期化（クラスメソッドが失われるため）
        state.tension = { value: state.tension.value, max_limit: 0.5, increase_rate: 0.00001 };
        state.status_message = "コア状態復元済み";
    } catch (e) {
        console.error("Failed to load state from localStorage:", e);
        // 失敗した場合は初期状態に戻す
        state = initializeState();
    }
} else {
    // 初回起動時の状態を保存
    updateState(state);
}

// =========================================================================
// テンション (Tension) 管理
// =========================================================================

/**
 * ロゴス緊張度 (Tension) インスタンスを取得する。
 * @returns {object} Tensionオブジェクト
 */
export function getTensionInstance() {
    return state.tension;
}

/**
 * ロゴス緊張度 (Tension) を指定量増加させる。
 * @param {number} amount - 増加させる量
 */
export function addTension(amount) {
    state.tension.value += amount;
    state.tension.value = Math.max(0, state.tension.value); // 0未満にならないように
    updateState(state);
}

// =========================================================================
// アカウントとユーザー制御
// =========================================================================

/**
 * アクティブユーザーを設定する。
 * @param {string} user - 新しいアクティブユーザー名
 */
export function setActiveUser(user) {
    if (state.accounts[user]) {
        state.active_user = user;
        updateState(state);
    } else {
        throw new Error(`User ${user} not found.`);
    }
}

/**
 * 指定したユーザーの全残高を取得する。
 * @param {string} user - ユーザー名
 * @returns {object} 残高オブジェクト
 */
export function getActiveUserBalance(user) {
    return state.accounts[user] || {};
}

/**
 * 全ての口座情報とTensionを削除し、初期状態にリセットする。
 */
export function deleteAccounts() {
    localStorage.removeItem('msaiState');
    state = initializeState();
}

// =========================================================================
// 経済的作為 (Acts)
// =========================================================================

/**
 * 送金作為 (Transfer Act) を実行し、残高を移動させる。
 * @param {string} sender - 送金元ユーザー名
 * @param {string} recipient - 受取人ユーザー名
 * @param {number} amount - 送金数量
 * @param {string} currency - 送金通貨 (USD固定)
 * @returns {object} 更新された状態 (newState)
 */
export function actTransfer(sender, recipient, amount, currency) {
    const state = getCurrentState();

    // 1. 受取人が存在するかチェック (内部送金の場合)
    // 外部送金は "External_Gateway" を通るが、ここでは state.accounts には追加しない
    const isInternal = state.accounts[recipient];

    // 2. 残高チェック
    if ((state.accounts[sender][currency] || 0) < amount) {
        throw new Error(`${sender} の ${currency} 残高不足です。`);
    }

    // 3. 残高を移動 (消費と増加)
    state.accounts[sender][currency] -= amount;
    
    // 受取人が内部アカウントの場合のみ残高増加
    if (isInternal) {
        state.accounts[recipient][currency] = (state.accounts[recipient][currency] || 0) + amount;
    }
    
    // 4. 状態の更新
    updateState(state);
    return state;
}


// =========================================================================
// エクスポート
// =========================================================================

export { 
    updateState, 
    initializeState 
    // 💡 actTransfer は関数定義時にexport済みのため、ここから削除
};
