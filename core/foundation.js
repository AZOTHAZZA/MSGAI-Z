// core/foundation.js (Tensionインスタンス保護版)

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

// ... (loadPersistedAccounts, loadPersistedTension, loadPersistedActiveUser 関数は変更なし) ...

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

console.log(`[Logos Core]: Initialized. Tension: ${LogosState.tension_level.getValue().toFixed(4)}`);


/**
 * 状態の更新と永続化を行う関数
 */
export function updateState(newState) {
    // 🌟 修正: ロゴス緊張度を更新する際は、LogosTensionのインスタンスを保護
    if (typeof newState.tension_level === 'number') {
        // 数値が渡された場合、新しいインスタンスを作成
        LogosState.tension_level = new LogosTension(newState.tension_level);
    } else if (newState.tension_level instanceof LogosTension) {
        // LogosTensionインスタンスが渡された場合、そのまま代入
        LogosState.tension_level = newState.tension_level;
    } else if (newState.tension_level && newState.tension_level.value !== undefined) {
        // Tensionオブジェクトから値を取り出してインスタンスを作成 (安全策)
        LogosState.tension_level = new LogosTension(newState.tension_level.value);
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

// ---------------- (getCurrentState 関数群を修正) ----------------

/**
 * 状態のディープコピーではない、シンプルなデータ構造を返す
 * (handler.js側でJSON化/パースを行うことを想定)
 */
export function getCurrentState() {
    return { 
        // 🌟 修正: Tensionレベルは数値として渡す
        tension_level: LogosState.tension_level.getValue(), 
        accounts: LogosState.accounts,
        active_user: LogosState.active_user, 
        status_message: LogosState.status_message,
        last_act: LogosState.last_act
    };
}

export function getCurrentStateJson() {
    // 🌟 修正: JSON.stringifyをここで実行
    return JSON.stringify(getCurrentState());
}


// ... (getActiveUserBalance, setActiveUser, deleteAccounts は変更なし) ...
