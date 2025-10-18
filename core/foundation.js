// core/foundation.js (最終最終最終決定版 - 参照隠蔽)

import { createLogosTension } from './arithmos.js'; 

// 永続化キーと初期値の定義 (変更なし)
const PERSISTENCE_KEY_ACCOUNTS = 'msgaicore_accounts';
const PERSISTENCE_KEY_TENSION = 'msgaicore_tension';
const PERSISTENCE_KEY_ACTIVE_USER = 'msgaicore_active_user';

const INITIAL_ACCOUNTS = { 
    "User_A": { "USD": 1000.00, "JPY": 0.00, "EUR": 0.00, "BTC": 0.00, "ETH": 0.00, "MATIC": 0.00 },
    "User_B": { "USD": 500.00, "JPY": 0.00, "EUR": 0.00, "BTC": 0.00, "ETH": 0.00, "MATIC": 0.00 }
};
const INITIAL_TENSION_VALUE = 0.05; 
const INITIAL_ACTIVE_USER = "User_A";

// =========================================================================
// 状態ロード関数 (防御的なロード) - 変更なし
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

function loadPersistedTensionValue() {
    try {
        const persisted = localStorage.getItem(PERSISTENCE_KEY_TENSION);
        if (!persisted) return INITIAL_TENSION_VALUE;
        const t = parseFloat(persisted);
        if (!isNaN(t) && t >= 0 && t <= 1.0) {
            console.log(`[Logos Foundation]: 永続化されたTension (${t.toFixed(4)}) を読み込みました。`);
            return t;
        }
    } catch (e) {
        console.warn("[Logos Foundation WARNING]: 緊張度情報の読み込みに失敗、初期値を使用。", e);
    }
    return INITIAL_TENSION_VALUE; 
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
// LogosState & LogosTension のカプセル化ロジック
// =========================================================================

// 🌟 修正: グローバルなlet変数を内部的な名前で定義し、クロージャ内で保護
let _LogosState = null;
let _LogosTensionInstance = null;

/**
 * LogosStateの初期化を行う。破損チェックは行わない。
 */
function loadInitialState() {
    if (_LogosState === null) {
        console.log("[Foundation]: LogosStateを初期化中...");
        _LogosState = { 
            // 🌟 修正: tension_level プロパティを削除
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
 * 🌟 核心修正: Tensionインスタンスの参照を取得・修復する単一責任クロージャ
 */
function getTensionReference() {
    if (_LogosTensionInstance === null) {
        // 🌟 修正: createLogosTensionで初期化
        _LogosTensionInstance = createLogosTension(loadPersistedTensionValue());
        console.log("[Foundation]: Tension機能構造体を初期ロードしました。");
    }
    
    // 破損していれば修復する防御ロジック (単一集中化)
    // 🌟 修正: 'value'プロパティによる状態値の取得に変更
    if (typeof _LogosTensionInstance.add !== 'function') {
        console.warn("[Logos Foundation WARNING]: Tension機能構造体が破損していました。再構築します。");
        
        const value = (typeof _LogosTensionInstance.value === 'number') 
            ? _LogosTensionInstance.value 
            : INITIAL_TENSION_VALUE;
            
        // 新しい機能構造体で置き換え
        _LogosTensionInstance = createLogosTension(value);
        // 修復後は即座に永続化し安定化を図る
        updateState({}); 
    }
    return _LogosTensionInstance;
}

/**
 * LogosStateへの単一エントリポイント
 */
function getStateReference() {
    // 常にTensionの健全性を先に保証
    getTensionReference();
    
    // LogosStateのロードを保証し、その参照を返す
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
        // 🌟 修正: getTensionReference()から値を取得
        localStorage.setItem(PERSISTENCE_KEY_TENSION, getTensionReference().getValue().toString());
        localStorage.setItem(PERSISTENCE_KEY_ACTIVE_USER, _LogosState.active_user);
        
        console.log("[Logos Foundation]: 状態の永続化に成功しました。");

    } catch (e) {
        console.error("[Logos Foundation ERROR]: 状態の永続化に失敗しました。", e);
    }
}


/** LogosTension機能構造体の参照を返す。（Tension値を取得する関数のみに用途を限定する） */
export function getTensionInstance() { 
    // 常に健全な参照を取得
    return getTensionReference(); 
}

/** Tensionレベルを安全に操作するための公開関数 */
export function addTension(amount) {
    // 🌟 修正: 常に健全な参照を取得 (修復は getTensionReference 内で完了)
    const tension = getTensionReference();
    
    tension.add(amount); 
    
    // 最終永続化
    updateState({}); // LogosStateは変更しないが、Tensionの値を永続化
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
    _LogosTensionInstance = null; // Tensionもリセット
    
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
