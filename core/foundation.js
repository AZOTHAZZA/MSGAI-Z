// core/foundation.js (修復ロジック分離版 - 全文)

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
// 状態ロード関数 (防御的なロード)
// =========================================================================

function loadPersistedAccounts() {
    try {
        const persisted = localStorage.getItem(PERSISTENCE_KEY_ACCOUNTS);
        if (!persisted) {
            console.log("[Logos Foundation]: 口座情報が見つかりません。初期値を適用します。");
            return JSON.parse(JSON.stringify(INITIAL_ACCOUNTS));
        }
        const accounts = JSON.parse(persisted);
        if (typeof accounts === 'object' && accounts !== null && Object.keys(accounts).length > 0) {
             console.log("[Logos Foundation]: 永続化されたマルチカレンシー口座情報を読み込みました。");
             return accounts;
        }
    } catch (e) {
        console.warn("[Logos Foundation WARNING]: 口座情報の読み込みに失敗、初期値を強制使用。", e);
    }
    return JSON.parse(JSON.stringify(INITIAL_ACCOUNTS));
}

function loadPersistedTension() {
    try {
        const persisted = localStorage.getItem(PERSISTENCE_KEY_TENSION);
        if (!persisted) return INITIAL_TENSION;
        const t = parseFloat(persisted);
        if (!isNaN(t) && t >= 0 && t <= 1.0) {
            console.log(`[Logos Foundation]: 永続化されたTension (${t.toFixed(4)}) を読み込みました。`);
            return t;
        }
    } catch (e) {
        console.warn("[Logos Foundation WARNING]: 緊張度情報の読み込みに失敗、初期値を使用。", e);
    }
    return INITIAL_TENSION; 
}

function loadPersistedActiveUser() {
    try {
        const persisted = localStorage.getItem(PERSISTENCE_KEY_ACTIVE_USER);
        if (persisted && INITIAL_ACCOUNTS[persisted]) {
            return persisted;
        }
    } catch (e) {
        console.warn("[Logos Foundation WARNING]: アクティブユーザー情報の読み込みに失敗、初期値を使用。", e);
    }
    return INITIAL_ACTIVE_USER;
}

// =========================================================================
// LogosState の定義と遅延初期化ロジック
// =========================================================================

let LogosState = null;

function ensureLogosStateInitialized() {
    if (LogosState === null) {
        console.log("[Foundation]: LogosStateを初期化中...");
        LogosState = { 
            tension_level: new LogosTension(loadPersistedTension()),
            accounts: loadPersistedAccounts(),
            active_user: loadPersistedActiveUser(),
            status_message: "Logos Core Initialized. Awaiting first act.",
            last_act: "Genesis",
        };
        console.log("[Foundation]: LogosState初期化完了。");
    }
    return LogosState;
}

// =========================================================================
// 公開関数 (Public Exports)
// =========================================================================

/**
 * Tensionインスタンスを破損から保護し、必要であれば修復する (内部関数)
 * @param {object} state - LogosStateオブジェクトの参照
 */
function ensureTensionInstanceIntegrity(state) {
    // 破損していれば修復する防御ロジック (最終防衛ライン)
    if (typeof state.tension_level.add !== 'function') {
        console.warn("[Logos Foundation WARNING]: Tensionインスタンスが破損していました。再インスタンス化します。");
        const value = (typeof state.tension_level.value === 'number') 
            ? state.tension_level.value 
            : INITIAL_TENSION;
            
        state.tension_level = new LogosTension(value);
        // 修復後は状態全体を永続化し、新しいインスタンス参照を安定させる
        updateState(state); 
    }
}


/**
 * 状態の更新と永続化を行う関数
 * ⚠️ 主に永続化を実行します。Tensionインスタンスの完全な代入は行いません。
 */
export function updateState(newState) {
    const state = ensureLogosStateInitialized();

    // newStateから渡されたプロパティのみを内部状態に安全にコピー
    if (newState.accounts) state.accounts = newState.accounts;
    if (newState.active_user) state.active_user = newState.active_user;
    if (newState.status_message) state.status_message = newState.status_message;
    if (newState.last_act) state.last_act = newState.last_act;
    
    // 永続化を試行
    try {
        localStorage.setItem(PERSISTENCE_KEY_ACCOUNTS, JSON.stringify(state.accounts));
        localStorage.setItem(PERSISTENCE_KEY_TENSION, state.tension_level.getValue().toString());
        localStorage.setItem(PERSISTENCE_KEY_ACTIVE_USER, state.active_user);
        
        console.log("[Logos Foundation]: 状態の永続化に成功しました。");

    } catch (e) {
        console.error("[Logos Foundation ERROR]: 状態の永続化に失敗しました。", e);
    }
}


/** LogosTensionインスタンスの参照を返す。（Tension値を取得する関数のみに用途を限定する） */
export function getTensionInstance() { 
    const state = ensureLogosStateInitialized();
    // 🌟 修正: 修復ロジックを分離したため、ここではインスタンスをそのまま返す
    return state.tension_level; 
}

/** Tensionレベルを安全に操作するための公開関数 */
export function addTension(amount) {
    const state = ensureLogosStateInitialized();
    
    // 🌟 修正: Tensionインスタンスの完全性チェックを操作の開始時に行う
    ensureTensionInstanceIntegrity(state); 
    
    // 修復された/正常なインスタンスのaddメソッドを呼び出す
    state.tension_level.add(amount); 
    
    // 永続化のために、LogosState全体を updateState に渡す
    updateState(state); 
}


// ---------------- (getCurrentState 関数群) ----------------

/** 最新の状態オブジェクトの参照を返す。 */
export function getCurrentState() { 
    return ensureLogosStateInitialized(); 
}

/** 状態オブジェクトのディープコピー（JSON形式）を返す。 */
export function getCurrentStateJson() { 
    return JSON.parse(JSON.stringify(ensureLogosStateInitialized())); 
}


// =========================================================================
// ヘルパー関数
// =========================================================================

/**
 * 必須: 常に最新かつ操作可能なLogosStateのオブジェクト参照を返す
 * 🌟 外部からの破壊を防ぐため、シャローコピーを返す
 */
export function getMutableState() {
    return { ...ensureLogosStateInitialized() }; 
}

/**
 * コアシステムをリセットし、口座情報を削除する。
 */
export function deleteAccounts() { 
    localStorage.removeItem(PERSISTENCE_KEY_ACCOUNTS);
    localStorage.removeItem(PERSISTENCE_KEY_TENSION);
    localStorage.removeItem(PERSISTENCE_KEY_ACTIVE_USER);

    LogosState = null; 
    const state = ensureLogosStateInitialized(); 
    state.status_message = "全口座情報とTensionレベルをリセットしました。";
    updateState(state);
    return state.status_message; 
}

/**
 * 現在のアクティブユーザーを変更する。
 */
export function setActiveUser(username) {
    const state = ensureLogosStateInitialized();
    if (state.accounts[username]) {
        state.active_user = username;
        updateState(state);
    } else {
        throw new Error(`User ${username} does not exist.`);
    }
}

/**
 * アクティブユーザーの残高を取得する。
 */
export function getActiveUserBalance(currency = "USD") {
    const state = ensureLogosStateInitialized();
    const balance = state.accounts[state.active_user][currency];
    return balance !== undefined ? balance : 0.00;
}
