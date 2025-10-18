// core/foundation.js (究極の最終版 - 全文)

import { createLogosTension } from './arithmos.js'; 

// 永続化キーと初期値の定義 (変更なし)
const PERSISTENCE_KEY_ACCOUNTS = 'msgaicore_accounts';
const PERSISTENCE_KEY_TENSION = 'msgaicore_tension';
const PERSISTENCE_KEY_ACTIVE_USER = 'msgaicore_active_user';

const INITIAL_ACCOUNTS = { /* ... 変更なし ... */ };
const INITIAL_TENSION_VALUE = 0.05; 
const INITIAL_ACTIVE_USER = "User_A";

// =========================================================================
// 状態ロード関数 (防御的なロード) - 変更なし
// =========================================================================

function loadPersistedAccounts() { /* ... 変更なし ... */ return JSON.parse(JSON.stringify(INITIAL_ACCOUNTS)); }
function loadPersistedTensionValue() { /* ... 変更なし ... */ return INITIAL_TENSION_VALUE; }
function loadPersistedActiveUser() { /* ... 変更なし ... */ return INITIAL_ACTIVE_USER; }

// =========================================================================
// LogosState & LogosTension のカプセル化ロジック
// =========================================================================

// 🌟 修正: Tensionインスタンスをグローバルスコープに固定
let _LogosState = null; 

/**
 * LogosStateの初期化を行う。破損チェックは行わない。
 */
function loadInitialState() {
    if (_LogosState === null) {
        console.log("[Foundation]: LogosStateを初期化中...");
        _LogosState = { 
            accounts: loadPersistedAccounts(),
            active_user: loadPersistedActiveUser(),
            status_message: "Logos Core Initialized. Awaiting first act.",
            last_act: "Genesis",
        };
        console.log("[Foundation]: LogosState初期化完了。");
    }
    return _LogosState;
}

/**
 * 🌟 究極の修正: Tensionインスタンスをグローバル定位置から取得・修復する
 */
function getTensionReference() {
    // 常にグローバル変数から取得を試みる
    let tensionInstance = window.MSGAI_TENSION_CORE;

    if (!tensionInstance) {
        tensionInstance = createLogosTension(loadPersistedTensionValue());
        window.MSGAI_TENSION_CORE = tensionInstance;
        console.log("[Foundation]: Tension機能をグローバルスコープに初期ロードしました。");
        return tensionInstance;
    }
    
    // 破損していれば修復する防御ロジック
    if (typeof tensionInstance.add !== 'function') {
        console.warn("[Logos Foundation WARNING]: Tensionインスタンスが破損していました。再構築します。"); 
        
        const value = (typeof tensionInstance.value === 'number') 
            ? tensionInstance.value 
            : INITIAL_TENSION_VALUE;
            
        // 新しい機能構造体で置き換え、グローバルスコープを更新
        tensionInstance = createLogosTension(value);
        window.MSGAI_TENSION_CORE = tensionInstance;
        
        // 🚨 永続化を呼び出す必要はないが、状態を安定させるため updateState を空呼び出し
        updateState({}); 
    }
    return tensionInstance;
}

/**
 * LogosStateへの単一エントリポイント
 */
function getStateReference() {
    getTensionReference();
    return loadInitialState();
}

// =========================================================================
// 公開関数 (Public Exports)
// =========================================================================

/**
 * 状態の更新と永続化を行う関数
 */
export function updateState(newState) {
    const currentState = loadInitialState(); 

    // 状態全体を新しいオブジェクトで置き換える (不変性強制)
    _LogosState = {
        accounts: newState.accounts || currentState.accounts,
        active_user: newState.active_user || currentState.active_user,
        status_message: newState.status_message || currentState.status_message,
        last_act: newState.last_act || currentState.last_act,
    };
    
    // 永続化を試行
    try {
        localStorage.setItem(PERSISTENCE_KEY_ACCOUNTS, JSON.stringify(_LogosState.accounts));
        
        // 🌟 修正: グローバルインスタンスから直接値を取得
        const tensionInstance = getTensionReference();
        localStorage.setItem(PERSISTENCE_KEY_TENSION, tensionInstance.getValue().toString());
        localStorage.setItem(PERSISTENCE_KEY_ACTIVE_USER, _LogosState.active_user);
        
        console.log("[Logos Foundation]: 状態の永続化に成功しました。");

    } catch (e) {
        console.error("[Logos Foundation ERROR]: 状態の永続化に失敗しました。", e);
    }
}


/** LogosTension機能構造体の参照を返す。（Tension値を取得する関数のみに用途を限定する） */
export function getTensionInstance() { 
    return getTensionReference(); 
}

/** Tensionレベルを安全に操作するための公開関数 */
export function addTension(amount) {
    const tension = getTensionReference();
    tension.add(amount); 
    updateState({}); 
}


// ---------------- (getCurrentState 関数群) ----------------

/** 最新の状態オブジェクトの参照を返す。 */
export function getCurrentState() { 
    return getStateReference(); 
}

/** 状態オブジェクトのディープコピー（JSON形式）を返す。 */
export function getCurrentStateJson() { 
    return JSON.parse(JSON.stringify(getStateReference())); 
}


// =========================================================================
// ヘルパー関数
// =========================================================================

/**
 * 必須: 常に最新かつ操作可能なLogosStateのオブジェクト参照を返す
 * 🌟 外部からの破壊を防ぐため、シャローコピーを返す
 */
export function getMutableState() {
    return { ...getStateReference() }; 
}

/**
 * コアシステムをリセットし、口座情報を削除する。
 */
export function deleteAccounts() { 
    localStorage.removeItem(PERSISTENCE_KEY_ACCOUNTS);
    localStorage.removeItem(PERSISTENCE_KEY_TENSION);
    localStorage.removeItem(PERSISTENCE_KEY_ACTIVE_USER);

    _LogosState = null; 
    window.MSGAI_TENSION_CORE = null; // グローバルインスタンスもリセット
    
    // 再初期化
    const state = getStateReference(); 
    state.status_message = "全口座情報とTensionレベルをリセットしました。";
    updateState(state);
    return state.status_message; 
}

/**
 * 現在のアクティブユーザーを変更する。
 */
export function setActiveUser(username) {
    const state = getStateReference();
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
    const state = getStateReference();
    const balance = state.accounts[state.active_user][currency];
    return balance !== undefined ? balance : 0.00;
}
