// core/foundation.js (究極の最終安定版 - グローバル不動化 + ループ回避)

import { createLogosTension } from './arithmos.js'; 

// ... (定数、ロード関数は変更なし) ...

// =========================================================================
// LogosState & LogosTension のカプセル化ロジック
// =========================================================================

let _LogosState = null; 
// _LogosTensionInstance はグローバル (window.MSGAI_TENSION_CORE) に固定されるため、ここでは不要

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
 * 🚨 updateState の呼び出しを削除
 */
function getTensionReference() {
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
        
        // 🚨 修正: 無限ループ回避のため updateState({}) を削除！
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
        
        // 🌟 修正: グローバルインスタンスから直接値を取得し、getTensionReference() の再帰呼び出しを回避
        const tensionInstance = window.MSGAI_TENSION_CORE;
        const tensionValue = (tensionInstance && typeof tensionInstance.getValue === 'function')
            ? tensionInstance.getValue().toString()
            : loadPersistedTensionValue().toString(); // 破損時リカバリ
        
        localStorage.setItem(PERSISTENCE_KEY_TENSION, tensionValue);
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
    updateState({}); // Tension値の更新後、updateStateを呼び出し永続化
}

// ... (getCurrentState, getMutableState, deleteAccounts, setActiveUser, getActiveUserBalance は変更なし) ...
