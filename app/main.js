// app/main.js (UI統一・初期残高0対応版 - 全文)

import { getCurrentState, getTensionInstance, addTension, setActiveUser, getActiveUserBalance, deleteAccounts } from '../core/foundation.js'; 
import { actMintCurrency, actExchangeCurrency } from '../core/currency.js'; 

// =========================================================================
// 定数とヘルパー
// =========================================================================

const SUPPORTED_CURRENCIES = ["USD", "JPY", "EUR", "BTC", "ETH", "MATIC"];
const TENSION_LIMIT = 0.5; 

let UI_ELEMENTS = {};

/**
 * すべてのUI要素のIDをキャッシュする (IDを統一)
 */
function cacheUIElements() {
    const ids = [
        'status_message', 'tension_level_display', 'tension_bar', 'tension_level_display_bar',
        'intensity_display', 'rigor_display', 'active_user_select', 
        'active_user_name', 'balance_display', 'recipient_input', 
        'amount_input', 'autonomy_status', 'transfer_internal_button', 
        'transfer_external_button', 'revision_button', 'delete_accounts_button',
        'mint_amount_input', 'dialogue-output', 'dialogue_input', 'dialogue_button',
        'exchange_amount_input', 'exchange_from_select', 'exchange_to_select', 
        'exchange_button',
        // 🌟 修正: MintingボタンIDを統一 (単一の実行ボタン)
        'mint_currency_select', 'mint_execute_button' 
    ];
    // 残高IDを動的に追加
    SUPPORTED_CURRENCIES.forEach(c => {
        ids.push(`balance_${c}`); 
    });
    
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) {
            // ログコンソールが機能しない場合の致命的エラーチェック
            if (id === 'status_message' || id === 'tension_level_display') {
                 console.error(`Missing critical UI element ID: ${id}`);
                 throw new Error(`Critical UI element missing: ${id}. Check index.html.`);
            }
        }
        UI_ELEMENTS[id] = el;
    });
}

function logToConsole(message, type = 'ai-message') {
    const output = UI_ELEMENTS['dialogue-output'];
    if (!output) return; 
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.innerHTML = `<strong>[CORE]:</strong> ${message}`;
    output.appendChild(messageDiv);
    output.scrollTop = output.scrollHeight; 
}

// ... (updateUI関数は前回のコードをそのまま使用) ...
function updateUI(state) {
    const tension = getTensionInstance();
    const tensionValue = tension.getValue();
    const activeUserName = state.active_user;
    
    if (UI_ELEMENTS['status_message']) {
        UI_ELEMENTS['status_message'].textContent = `[STATUS]: ${state.status_message}`;
    }
    
    // 2. Tension & Autonomy Status (省略。ロジックは前回通り)
    if (UI_ELEMENTS['tension_level_display']) {
        UI_ELEMENTS['tension_level_display'].textContent = `T: ${tensionValue.toFixed(4)}`;
    }
    const tensionBarEl = UI_ELEMENTS['tension_level_display_bar'];
    if (tensionBarEl) { /* ... Tension Bar Logic ... */ }
    const autonomyStatusEl = UI_ELEMENTS['autonomy_status'];
    if (autonomyStatusEl) { /* ... Autonomy Status Logic ... */ }

    // 3. 数理的制御パラメータ (I/R) (省略。ロジックは前回通り)
    if (UI_ELEMENTS['intensity_display']) { UI_ELEMENTS['intensity_display'].textContent = "0.9025"; } 
    if (UI_ELEMENTS['rigor_display']) { UI_ELEMENTS['rigor_display'].textContent = "0.2236"; }
    
    // 4. Active User & Balance
    if (UI_ELEMENTS['active_user_name']) {
        UI_ELEMENTS['active_user_name'].textContent = activeUserName;
    }
    // メイン残高表示
    if (UI_ELEMENTS['balance_display']) {
        const balance = getActiveUserBalance(activeUserName, "USD");
        UI_ELEMENTS['balance_display'].textContent = balance.toFixed(2).toLocaleString();
    }
    
    // 多通貨残高の更新ロジック
    const accounts = state.accounts[activeUserName];
    SUPPORTED_CURRENCIES.forEach(currency => {
        const el = UI_ELEMENTS[`balance_${currency}`];
        if (el) { // 要素が存在する場合のみ更新
            const balance = accounts[currency] || 0;
            if (currency === "JPY") {
                 el.textContent = Math.floor(balance).toLocaleString();
            } else if (["BTC", "ETH", "MATIC"].includes(currency)) {
                 el.textContent = balance.toFixed(8);
            } else {
                 el.textContent = balance.toFixed(2);
            }
        }
    });

    // ユーザー選択肢の更新 (省略。ロジックは前回通り)
    const selectEl = UI_ELEMENTS['active_user_select'];
    if (selectEl) { /* ... User Select Logic ... */ }
}


// =========================================================================
// イベントハンドラー
// =========================================================================

/**
 * 🌟 修正: 通貨生成実行ボタンのハンドラー
 */
function handleMintingExecuteAct() {
    try {
        const currency = UI_ELEMENTS['mint_currency_select'].value; // ドロップダウンから通貨を取得
        const amount = parseFloat(UI_ELEMENTS['mint_amount_input'].value);
        
        if (isNaN(amount) || amount <= 0) {
            logToConsole("生成数量は正の値を指定してください。", 'user-message');
            return;
        }

        const state = getCurrentState();
        const newState = actMintCurrency(state.active_user, currency, amount);
        
        logToConsole(`${state.active_user} が ${amount.toFixed(2)} ${currency} を生成しました。Tensionが増加しました。`, 'ai-message');
        updateUI(newState);
        
    } catch (error) {
        logToConsole(`Minting Act 失敗: ${error.message}`, 'error-message');
        console.error(error);
    }
}

// ... (handleExchangeAct, handleTransfer, handleUserSelect, handleDeleteAccounts関数は省略。前回のコードを使用) ...
function handleExchangeAct() {
    try {
        const fromC = UI_ELEMENTS['exchange_from_select'].value;
        const toC = UI_ELEMENTS['exchange_to_select'].value;
        const amount = parseFloat(UI_ELEMENTS['exchange_amount_input'].value);
        if (fromC === toC || isNaN(amount) || amount <= 0) { /* ... Validation ... */ return; }
        const state = getCurrentState();
        const newState = actExchangeCurrency(state.active_user, fromC, amount, toC);
        logToConsole(`${state.active_user} が ${amount.toFixed(4)} ${fromC} を ${toC} に交換しました。`, 'ai-message');
        updateUI(newState);
    } catch (error) {
        logToConsole(`Exchange Act 失敗: ${error.message}`, 'error-message');
        console.error(error);
    }
}
function handleTransfer(isExternal) { /* ... Transfer Logic ... */ }
function handleUserSelect(event) { /* ... User Select Logic ... */ }
function handleDeleteAccounts() { /* ... Delete Accounts Logic ... */ }


// =========================================================================
// 初期化
// =========================================================================

/**
 * 🌟 修正: Mint と Exchange の選択肢を初期化する
 */
function initializeCurrencySelectors() {
    const mintSelect = UI_ELEMENTS['mint_currency_select'];
    const fromSelect = UI_ELEMENTS['exchange_from_select'];
    const toSelect = UI_ELEMENTS['exchange_to_select'];

    if (!mintSelect || !fromSelect || !toSelect) return;

    SUPPORTED_CURRENCIES.forEach(currency => {
        const option = (c) => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            return opt;
        };
        
        // Mint Select
        mintSelect.appendChild(option(currency).cloneNode(true));
        
        // From Select
        fromSelect.appendChild(option(currency).cloneNode(true));

        // To Select
        toSelect.appendChild(option(currency).cloneNode(true));
    });
    
    // デフォルト値の設定
    mintSelect.value = "USD";
    fromSelect.value = "USD";
    toSelect.value = "JPY";
}


/**
 * アプリケーションの初期化を行う。
 */
function initializeApp() {
    try {
        cacheUIElements();
        
        logToConsole("Logos Foundationを初期化中...", 'system-message');
        
        // 💡 foundation.js の INITIAL_STATE の USD 残高を 0 に修正する必要があります。
        const initialState = getCurrentState(); 

        logToConsole(`監査コンソール起動成功。アクティブユーザー: ${initialState.active_user}`, 'ai-message');

        // 通貨の選択肢を初期化
        initializeCurrencySelectors();

        // イベントリスナーの設定
        
        // 🌟 修正: Minting Execute Button
        if (UI_ELEMENTS['mint_execute_button']) {
            UI_ELEMENTS['mint_execute_button'].addEventListener('click', handleMintingExecuteAct);
        }

        // Exchange Button (省略)
        if (UI_ELEMENTS['exchange_button']) { /* ... Exchange Button Listener ... */ }

        // Transfer Buttons (省略)
        if (UI_ELEMENTS['transfer_internal_button']) { /* ... Transfer Internal Listener ... */ }
        if (UI_ELEMENTS['transfer_external_button']) { /* ... Transfer External Listener ... */ }
        
        // User Select (省略)
        if (UI_ELEMENTS['active_user_select']) { /* ... User Select Listener ... */ }
        
        // Delete Accounts (Audit Reset) (省略)
        if (UI_ELEMENTS['delete_accounts_button']) { /* ... Delete Accounts Listener ... */ }
        
        // Revision Petition (ダミー) (省略)
        if (UI_ELEMENTS['revision_button']) { /* ... Revision Button Listener ... */ }
        
        // UIを初期状態で更新
        updateUI(initialState);
        
    } catch (error) {
        console.error("致命的な初期化エラー:", error); 
        logToConsole(`致命的な初期化エラー: ${error.message}`, 'error-message');
        const statusEl = document.getElementById('status_message');
        if (statusEl) {
             statusEl.textContent = `[STATUS]: 致命的エラー発生 - コンソールを確認`;
        }
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
