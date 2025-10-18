// core/foundation.js (getMutableState追加版)

import { LogosTension } from './arithmos.js';

// 永続化キー
const PERSISTENCE_KEY_ACCOUNTS = 'msgaicore_accounts';
const PERSISTENCE_KEY_TENSION = 'msgaicore_tension';
const PERSISTENCE_KEY_ACTIVE_USER = 'msgaicore_active_user';

// 初期値の定義
const INITIAL_ACCOUNTS = { 
    "User_A": { "USD": 1000.00, "JPY": 0.00, "EUR": 0.00, "BTC": 0.00, "ETH": 0.00, "MATIC": 0.00 },
    "User_B": { "USD": 500.00, "JPY": 0.00, "EUR": 0.00, "BTC": 0.00, "ETH": 0.00, "MATIC": 0.00 }
};
const INITIAL_TENSION = 0.05;
const INITIAL_ACTIVE_USER = "User_A";

// ... (loadPersistedAccounts, loadPersistedTension, loadPersistedActiveUser は省略) ...
function loadPersistedAccounts() { /* ... */ }
function loadPersistedTension() { /* ... */ return INITIAL_TENSION; }
function loadPersistedActiveUser() { /* ... */ return INITIAL_ACTIVE_USER; }


// =========================================================================
// LogosState 初期化と更新
// =========================================================================

export const LogosState = {
    tension_level: new LogosTension(loadPersistedTension()),
    accounts: loadPersistedAccounts(),
    active_user: loadPersistedActiveUser(),
    status_message: "Logos Core Initialized. Awaiting first act.",
    last_act: "Genesis",
};

/**
 * 状態の更新と永続化を行う関数
 */
export function updateState(newState) {
    // Tensionインスタンスの厳密な復元ロジック (変更なし)
    if (newState.tension_level instanceof LogosTension) {
        LogosState.tension_level = newState.tension_level;
    } else if (typeof newState.tension_level === 'number') {
        LogosState.tension_level = new LogosTension(newState.tension_level);
    } else if (newState.tension_level && typeof newState.tension_level.getValue === 'function') {
        LogosState.tension_level = new LogosTension(newState.tension_level.getValue());
    } else {
        const value = (typeof newState.tension_level === 'object' && newState.tension_level.value !== undefined) 
            ? newState.tension_level.value 
            : INITIAL_TENSION;
        LogosState.tension_level = new LogosTension(value);
    }
    
    LogosState.accounts = newState.accounts;
    LogosState.active_user = newState.active_user;
    LogosState.status_message = newState.status_message;
    LogosState.last_act = newState.last_act;

    try {
        localStorage.setItem(PERSISTENCE_KEY_ACCOUNTS, JSON.stringify(LogosState.accounts));
        localStorage.setItem(PERSISTENCE_KEY_TENSION, LogosState.tension_level.getValue().toString());
        localStorage.setItem(PERSISTENCE_KEY_ACTIVE_USER, LogosState.active_user);
    } catch (e) {
        console.error("[Logos Foundation ERROR]: 状態の永続化に失敗しました。", e);
    }
}

// ---------------- (getCurrentState 関数群) ----------------
export function getCurrentState() { /* ... 変更なし ... */ }
export function getCurrentStateJson() { /* ... 変更なし ... */ }

// =========================================================================
// ヘルパー関数と作為関数
// =========================================================================

/**
 * 🌟 新規追加: 常に最新かつ操作可能なLogosStateのオブジェクト参照を返す
 */
export function getMutableState() {
    return LogosState;
}

export function getActiveUserBalance(currency = "USD") { /* ... 変更なし ... */ }
export function setActiveUser(username) { /* ... 変更なし ... */ }

/**
 * 第9作為: 口座情報を削除し、初期状態に戻す関数 (監査用リセット)
 */
export function deleteAccounts() { 
    localStorage.removeItem(PERSISTENCE_KEY_ACCOUNTS);
    localStorage.removeItem(PERSISTENCE_KEY_TENSION); 
    localStorage.removeItem(PERSISTENCE_KEY_ACTIVE_USER);
    
    LogosState.accounts = JSON.parse(JSON.stringify(INITIAL_ACCOUNTS)); 
    LogosState.tension_level = new LogosTension(INITIAL_TENSION);
    LogosState.active_user = INITIAL_ACTIVE_USER;
    LogosState.status_message = "Logos Core Reset. Accounts deleted.";
    LogosState.last_act = "Account Reset";
    
    return "✅ 口座情報とロゴス緊張度を初期値にリセットしました。監査ログは保持されます。";
}
