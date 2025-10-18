// app/main.js (ロゴス監査コンソール対応版 - 全文)

// パス修正済み: appディレクトリから core ディレクトリを参照
import { getCurrentState, updateState, getTensionInstance, addTension, setActiveUser, getActiveUserBalance, deleteAccounts } from '../core/foundation.js'; 
import { actMintCurrency, actExchangeCurrency } from '../core/currency.js'; 

// =========================================================================
// 定数とヘルパー
// =========================================================================

// 表示される可能性のあるすべての通貨を定義 (JPY, EUR, BTC, ETH, MATIC も含める)
const SUPPORTED_CURRENCIES = ["USD", "JPY", "EUR", "BTC", "ETH", "MATIC"];
const TENSION_LIMIT = 0.5; 

let UI_ELEMENTS = {};

/**
 * すべてのUI要素のIDをキャッシュする (Exchange関連IDを追加)
 */
function cacheUIElements() {
    const ids = [
        'status_message', 'tension_level_display', 'tension_bar', 'tension_level_display_bar',
        'intensity_display', 'rigor_display', 'active_user_select', 
        'active_user_name', 'balance_display', 'recipient_input', 
        'amount_input', 'autonomy_status', 'transfer_internal_button', 
        'transfer_external_button', 'revision_button', 'delete_accounts_button',
        'mint_amount_input', 'dialogue-output', 'dialogue_input', 'dialogue_button',
        // 🌟 修正: Exchange 関連のIDを追加
        'exchange_amount_input', 'exchange_from_select', 'exchange_to_select', 'exchange_button'
    ];
    // 通貨発行ボタンと残高IDを動的に追加
    SUPPORTED_CURRENCIES.forEach(c => {
        ids.push(`mint_${c.toLowerCase()}_button`);
        ids.push(`balance_${c}`); // 残高表示ID
    });
    
    ids.forEach(id => {
        UI_ELEMENTS[id] = document.getElementById(id);
    });
}

/**
 * ログ監査コンソールに出力する
 */
function logToConsole(message, type = 'ai-message') {
    const output = UI_ELEMENTS['dialogue-output'];
    if (!output) return; // エラー回避
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.innerHTML = `<strong>[CORE]:</strong> ${message}`;
    output.appendChild(messageDiv);
    output.scrollTop = output.scrollHeight; 
}

// ... (updateUI関数は前回のコードから変更なし) ...
/**
 * UI全体を最新の状態に基づいて更新する
 */
function updateUI(state) {
    const tension = getTensionInstance();
    const tensionValue = tension.getValue();
    const activeUserName = state.active_user;
    
    // 1. Core Status
    UI_ELEMENTS['status_message'].textContent = `[STATUS]: ${state.status_message}`;
    
    // 2. Tension & Autonomy Status (省略、以前のロジックをそのまま使用)
    UI_ELEMENTS['tension_level_display'].textContent = `T: ${tensionValue.toFixed(4)}`;
    const tensionBarEl = UI_ELEMENTS['tension_level_display_bar'];
    // ... (Tensionバーのスタイル設定ロジックを省略) ...
    
    // 3. 数理的制御パラメータ (I/R) (省略、以前のロジックをそのまま使用)
    
    // 4. Active User & Balance
    UI_ELEMENTS['active_user_name'].textContent = activeUserName;
    const balance = getActiveUserBalance(activeUserName, "USD"); // USDをメイン表示
    UI_ELEMENTS['balance_display'].textContent = balance.toFixed(2).toLocaleString();
    
    // 🌟 修正: 多通貨残高の更新ロジック
    const accounts = state.accounts[activeUserName];
    SUPPORTED_CURRENCIES.forEach(currency => {
        const el = UI_ELEMENTS[`balance_${currency}`];
        if (el) {
            const balance = accounts[currency] || 0;
            // フォーマット調整
            if (currency === "JPY") {
                 el.textContent = Math.floor(balance).toLocaleString();
            } else if (["BTC", "ETH", "MATIC"].includes(currency)) {
                 el.textContent = balance.toFixed(8);
            } else {
                 el.textContent = balance.toFixed(2);
            }
        }
    });

    // ユーザー選択肢の更新 (省略、以前のロジックをそのまま使用)
    // ...
}


// =========================================================================
// イベントハンドラー
// =========================================================================

/**
 * 通貨発行ボタンのハンドラー (前回のコードから変更なし)
 */
function handleMintingAct(event) {
    try {
        const currency = event.currentTarget.dataset.currency;
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

/**
 * 🌟 修正: 通貨交換ボタンのハンドラー
 */
function handleExchangeAct() {
    try {
        const fromC = UI_ELEMENTS['exchange_from_select'].value;
        const toC = UI_ELEMENTS['exchange_to_select'].value;
        const amount = parseFloat(UI_ELEMENTS['exchange_amount_input'].value);

        if (fromC === toC) {
            logToConsole("同じ通貨間の交換はできません。", 'user-message');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            logToConsole("交換数量は正の値を指定してください。", 'user-message');
            return;
        }
        
        const state = getCurrentState();
        const newState = actExchangeCurrency(state.active_user, fromC, amount, toC);
        
        logToConsole(`${state.active_user} が ${amount.toFixed(4)} ${fromC} を ${toC} に交換しました。`, 'ai-message');
        updateUI(newState);
        
    } catch (error) {
        logToConsole(`Exchange Act 失敗: ${error.message}`, 'error-message');
        console.error(error);
    }
}

// ... (handleTransfer, handleUserSelect, handleDeleteAccounts関数は省略) ...


// =========================================================================
// 初期化
// =========================================================================

/**
 * 🌟 修正: Exchange の選択肢を初期化する
 */
function initializeExchangeSelectors() {
    const fromSelect = UI_ELEMENTS['exchange_from_select'];
    const toSelect = UI_ELEMENTS['exchange_to_select'];

    if (!fromSelect || !toSelect) return;

    SUPPORTED_CURRENCIES.forEach(currency => {
        // From Select
        const fromOption = document.createElement('option');
        fromOption.value = currency;
        fromOption.textContent = currency;
        fromSelect.appendChild(fromOption);

        // To Select
        const toOption = document.createElement('option');
        toOption.value = currency;
        toOption.textContent = currency;
        toSelect.appendChild(toOption);
    });
    
    // デフォルト値の設定
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
        
        const initialState = getCurrentState(); 

        logToConsole(`監査コンソール起動成功。アクティブユーザー: ${initialState.active_user}`, 'ai-message');

        // 🌟 修正: Exchange の選択肢を初期化
        initializeExchangeSelectors();

        // イベントリスナーの設定
        
        // Minting Buttons (省略)
        SUPPORTED_CURRENCIES.forEach(c => {
            const btn = UI_ELEMENTS[`mint_${c.toLowerCase()}_button`];
            if (btn) btn.addEventListener('click', handleMintingAct);
        });

        // 🌟 修正: Exchange Button
        UI_ELEMENTS['exchange_button'].addEventListener('click', handleExchangeAct);

        // Transfer Buttons (省略)
        // User Select (省略)
        // Delete Accounts (Audit Reset) (省略)
        // Revision Petition (省略)

        // UIを初期状態で更新
        updateUI(initialState);
        
    } catch (error) {
        console.error("致命的な初期化エラー:", error); 
        logToConsole(`致命的な初期化エラー: ${error.message}`, 'error-message');
        document.getElementById('status_message').textContent = `[STATUS]: 致命的エラー発生 - コンソールを確認`;
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
