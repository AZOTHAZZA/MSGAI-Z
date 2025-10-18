// core/foundation.js (口座リセット機能追加版)

import { LogosTension } from './arithmos.js';

// 永続化キー
const PERSISTENCE_KEY_ACCOUNTS = 'msgaicore_accounts';
const PERSISTENCE_KEY_TENSION = 'msgaicore_tension';
const PERSISTENCE_KEY_ACTIVE_USER = 'msgaicore_active_user';

// 初期値を定義
const INITIAL_ACCOUNTS = { "User_A": 1000.00, "User_B": 500.00 };
const INITIAL_TENSION = 0.05;
const INITIAL_ACTIVE_USER = "User_A";

/**
 * 永続化された口座情報を読み込む関数
 */
function loadPersistedAccounts() {
    try {
        const persisted = localStorage.getItem(PERSISTENCE_KEY_ACCOUNTS);
        if (persisted) {
            console.log("[Logos Foundation]: 永続化された口座情報を読み込みました。");
            return JSON.parse(persisted);
        }
    } catch (e) {
        console.warn("[Logos Foundation WARNING]: 口座情報の読み込みに失敗しました。初期値を使用します。", e);
    }
    return INITIAL_ACCOUNTS; 
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
        if (persisted && (loadPersistedAccounts()[persisted] !== undefined)) {
            return persisted;
        }
    } catch (e) {
        console.warn("[Logos Foundation WARNING]: アクティブユーザーの読み込みに失敗しました。初期値を使用します。", e);
    }
    return INITIAL_ACTIVE_USER; 
}


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

// ---------------- (既存の getCurrentState 関数群) ----------------

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

/**
 * 第4作為: アクティブユーザーを切り替える関数
 */
export function setActiveUser(username) {
    if (LogosState.accounts[username] !== undefined) {
        const oldUser = LogosState.active_user;
        LogosState.active_user = username;
        // アクティブユーザーの状態を永続化
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
 * 🌟 追加: 第9作為: 口座情報を削除し、初期状態に戻す関数 (監査用リセット)
 */
export function deleteAccounts() {
    // 1. ローカルストレージから永続化データを削除
    localStorage.removeItem(PERSISTENCE_KEY_ACCOUNTS);
    localStorage.removeItem(PERSISTENCE_KEY_TENSION); // Tensionもリセット対象に含める
    localStorage.removeItem(PERSISTENCE_KEY_ACTIVE_USER);
    
    // 2. メモリ上のLogosStateを初期値にリセット
    LogosState.accounts = INITIAL_ACCOUNTS;
    LogosState.tension_level = new LogosTension(INITIAL_TENSION);
    LogosState.active_user = INITIAL_ACTIVE_USER;
    LogosState.status_message = "Logos Core Reset. Accounts deleted.";
    LogosState.last_act = "Account Reset";
    
    return "✅ 口座情報とロゴス緊張度を初期値にリセットしました。監査ログは保持されます。";
}
