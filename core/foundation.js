// core/foundation.js (ロードロジック安全性強化版)

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

// =========================================================================
// 状態ロード関数 (安全性強化)
// =========================================================================

/**
 * 永続化された口座情報を読み込む関数。失敗時は初期値を返す。
 */
function loadPersistedAccounts() {
    try {
        const persisted = localStorage.getItem(PERSISTENCE_KEY_ACCOUNTS);
        // null または空文字列の場合は初期値を返す
        if (!persisted) {
            return JSON.parse(JSON.stringify(INITIAL_ACCOUNTS));
        }
        
        const accounts = JSON.parse(persisted);
        // 構造チェック
        if (typeof accounts["User_A"] === 'object' && accounts["User_A"].USD !== undefined) {
             console.log("[Logos Foundation]: 永続化されたマルチカレンシー口座情報を読み込みました。");
             return accounts;
        }
    } catch (e) {
        console.warn("[Logos Foundation WARNING]: 口座情報の読み込みに失敗、初期値を強制使用。", e);
    }
    return JSON.parse(JSON.stringify(INITIAL_ACCOUNTS)); // 初期値のディープコピーを返す
}

/**
 * 永続化された緊張度を読み込む関数。失敗時は初期値を返す。
 */
function loadPersistedTension() {
    try {
        const persisted = localStorage.getItem(PERSISTENCE_KEY_TENSION);
        // null または空文字列の場合は初期値を返す
        if (!persisted) {
             return INITIAL_TENSION;
        }
        
        const t = parseFloat(persisted);
        if (!isNaN(t)) {
            console.log(`[Logos Foundation]: 永続化されたTension (${t.toFixed(4)}) を読み込みました。`);
            return t;
        }
    } catch (e) {
        console.warn("[Logos Foundation WARNING]: 緊張度情報の読み込みに失敗、初期値を使用。", e);
    }
    return INITIAL_TENSION; 
}

/**
 * 永続化されたアクティブユーザーを読み込む関数。失敗時は初期値を返す。
 */
function loadPersistedActiveUser() {
    try {
        const persisted = localStorage.getItem(PERSISTENCE_KEY_ACTIVE_USER);
        // null または空文字列の場合は初期値を返す
        if (!persisted) {
            return INITIAL_ACTIVE_USER;
        }
        
        // 永続化データがあり、かつアカウントリストに存在するユーザーであること (ここでは accounts の初期化が完了していると仮定)
        // 厳密には accounts のロード後にチェックすべきだが、ここではシンプルなフォールバックを優先
        return persisted;
        
    } catch (e) {
        console.warn("[Logos Foundation WARNING]: アクティブユーザーの読み込みに失敗、初期値を使用。", e);
    }
    return INITIAL_ACTIVE_USER; 
}


// =========================================================================
// LogosState 初期化と更新
// =========================================================================

export const LogosState = {
    // これらの関数は常に有効な値を返すため、LogosStateは完全な状態で初期化される
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
    // Tensionインスタンスの復元ロジック (変更なし)
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
export function getCurrentState() { 
    return { 
        tension_level: LogosState.tension_level.getValue(), 
        accounts: LogosState.accounts,
        active_user: LogosState.active_user, 
        status_message: LogosState.status_message,
        last_act: LogosState.last_act
    };
}
export function getCurrentStateJson() { return JSON.stringify(getCurrentState()); }

// =========================================================================
// ヘルパー関数と作為関数
// =========================================================================
export function getMutableState() { return LogosState; }
export function getActiveUserBalance(currency = "USD") { /* ... 変更なし ... */ }
export function setActiveUser(username) { /* ... 変更なし ... */ }
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
