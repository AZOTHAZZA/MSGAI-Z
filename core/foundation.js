// core/foundation.js (マルチカレンシー対応版)

import { LogosTension } from './arithmos.js';

// 永続化キー
const PERSISTENCE_KEY_ACCOUNTS = 'msgaicore_accounts';
const PERSISTENCE_KEY_TENSION = 'msgaicore_tension';
const PERSISTENCE_KEY_ACTIVE_USER = 'msgaicore_active_user';

// 🌟 修正: 口座の初期値をマルチカレンシー構造に変更
const INITIAL_ACCOUNTS = { 
    "User_A": { "USD": 1000.00, "JPY": 0.00, "EUR": 0.00, "BTC": 0.00, "ETH": 0.00, "MATIC": 0.00 },
    "User_B": { "USD": 500.00, "JPY": 0.00, "EUR": 0.00, "BTC": 0.00, "ETH": 0.00, "MATIC": 0.00 }
};
const INITIAL_TENSION = 0.05;
const INITIAL_ACTIVE_USER = "User_A";

// =========================================================================
// 状態ロード関数
// =========================================================================

/**
 * 永続化された口座情報を読み込む関数
 * 古い単一通貨構造のデータがある場合は、ロード失敗とみなし初期値を強制使用します。
 */
function loadPersistedAccounts() {
    try {
        const persisted = localStorage.getItem(PERSISTENCE_KEY_ACCOUNTS);
        if (persisted) {
            const accounts = JSON.parse(persisted);
            // 構造チェック: User_Aがオブジェクトであり、USDキーを持っていることを確認
            if (typeof accounts["User_A"] === 'object' && accounts["User_A"].USD !== undefined) {
                 console.log("[Logos Foundation]: 永続化されたマルチカレンシー口座情報を読み込みました。");
                 return accounts;
            }
        }
    } catch (e) {
        console.warn("[Logos Foundation WARNING]: 口座情報の読み込みに失敗、または旧構造です。初期値を強制使用します。", e);
    }
    return JSON.parse(JSON.stringify(INITIAL_ACCOUNTS)); // 初期値のディープコピーを返す
}

/**
 * 永続化された緊張度を読み込む関数
 */
function loadPersistedTension() {
    try {
        const persisted = localStorage.getItem(PERSISTENCE_KEY_TENSION);
        if (persisted !== null) {
            const t = parseFloat(persisted);
            console.log(`[Logos Foundation]: 永続化されたTension (${t.toFixed(4)}) を読み込みました。`);
            return t;
        }
    } catch (e) {
        console.warn("[Logos Foundation WARNING]: 緊張度情報の読み込みに失敗しました。初期値を使用します。", e);
    }
    return INITIAL_TENSION; 
}

/**
 * 永続化されたアクティブユーザーを読み込む関数
 */
function loadPersistedActiveUser() {
    try {
        const persisted = localStorage.getItem(PERSISTENCE_KEY_ACTIVE_USER);
        // 永続化データがあり、かつアカウントリストに存在するユーザーであること
        if (persisted && (loadPersistedAccounts()[persisted] !== undefined)) {
            return persisted;
        }
    } catch (e) {
        console.warn("[Logos Foundation WARNING]: アクティブユーザーの読み込みに失敗しました。初期値を使用します。", e);
    }
    return INITIAL_ACTIVE_USER; 
}


// =========================================================================
// LogosState 初期化と更新
// =========================================================================

/**
 * LogosState の初期化 (永続化データをロード)
 */
export const LogosState = {
    tension_level: new LogosTension(loadPersistedTension()),
    accounts: loadPersistedAccounts(),
    active_user: loadPersistedActiveUser(),
    status_message: "Logos Core Initialized. Awaiting first act.",
    last_act: "Genesis",
};

console.log(`[Logos Core]: Initialized. Tension: ${LogosState.tension_level.getValue().toFixed(4)}`);


/**
 * 状態の更新と永続化を行う関数
 */
export function updateState(newState) {
    LogosState.tension_level = new LogosTension(newState.tension_level);
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
    return JSON.parse(JSON.stringify({ 
        tension_level: LogosState.tension_level.getValue(),
        accounts: LogosState.accounts,
        active_user: LogosState.active_user, 
        status_message: LogosState.status_message,
        last_act: LogosState.last_act
    }));
}

export function getCurrentStateJson() {
    return JSON.stringify({
        tension_level: LogosState.tension_level.getValue(),
        accounts: LogosState.accounts,
        active_user: LogosState.active_user,
        status_message: LogosState.status_message,
        last_act: LogosState.last_act
    });
}

// =========================================================================
// ヘルパー関数と作為関数
// =========================================================================

/**
 * 🌟 新規追加: 指定されたユーザーの、指定された通貨の残高を取得する
 * @param {string} currency 通貨種別 (デフォルトは"USD")
 * @returns {number} 残高 (通貨が存在しない場合は 0.00 を返す)
 */
export function getActiveUserBalance(currency = "USD") {
    const user = LogosState.active_user;
    const balance = LogosState.accounts[user] ? LogosState.accounts[user][currency] : undefined;
    
    // 残高が存在しない通貨であれば0を返す (安全策)
    return balance !== undefined ? balance : 0.00;
}

/**
 * 第4作為: アクティブユーザーを切り替える関数
 */
export function setActiveUser(username) {
    if (LogosState.accounts[username] !== undefined) {
        const oldUser = LogosState.active_user;
        LogosState.active_user = username;
        
        try {
            localStorage.setItem(PERSISTENCE_KEY_ACTIVE_USER, LogosState.active_user);
        } catch (e) {
            console.error("[Logos Foundation ERROR]: アクティブユーザーの永続化に失敗しました。", e);
        }
        
        return `アクティブユーザーを ${oldUser} から ${username} に切り替えました。`;
    }
    throw new Error(`ユーザー ${username} は存在しません。`);
}

/**
 * 第9作為: 口座情報を削除し、初期状態に戻す関数 (監査用リセット)
 */
export function deleteAccounts() {
    // 1. ローカルストレージから永続化データを削除
    localStorage.removeItem(PERSISTENCE_KEY_ACCOUNTS);
    localStorage.removeItem(PERSISTENCE_KEY_TENSION); 
    localStorage.removeItem(PERSISTENCE_KEY_ACTIVE_USER);
    
    // 2. メモリ上のLogosStateを初期値にリセット
    LogosState.accounts = JSON.parse(JSON.stringify(INITIAL_ACCOUNTS)); 
    LogosState.tension_level = new LogosTension(INITIAL_TENSION);
    LogosState.active_user = INITIAL_ACTIVE_USER;
    LogosState.status_message = "Logos Core Reset. Accounts deleted.";
    LogosState.last_act = "Account Reset";
    
    return "✅ 口座情報とロゴス緊張度を初期値にリセットしました。監査ログは保持されます。";
}
