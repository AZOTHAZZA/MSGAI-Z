// app/main.js (最終修正版 - 全文)

import { getCurrentState, getTensionInstance, addTension, setActiveUser, getActiveUserBalance, deleteAccounts } from '../core/foundation.js'; 
import { actMintCurrency, actExchangeCurrency } from '../core/currency.js'; 

// =========================================================================
// 定数とヘルパー
// =========================================================================

const SUPPORTED_CURRENCIES = ["USD", "JPY", "EUR", "BTC", "ETH", "MATIC"];
const TENSION_LIMIT = 0.5; 

let UI_ELEMENTS = {};

/**
 * すべてのUI要素のIDをキャッシュする
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
        'mint_currency_select', 'mint_execute_button' 
    ];
    
    SUPPORTED_CURRENCIES.forEach(c => {
        ids.push(`balance_${c}`); 
    });
    
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) {
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

// =========================================================================
// UI更新ロジック
// =========================================================================

/**
 * UI全体を最新の状態に基づいて更新する
 */
function updateUI(state) {
    const tension = getTensionInstance();
    const tensionValue = tension.getValue();
    const activeUserName = state.active_user;
    
    if (UI_ELEMENTS['status_message']) {
        UI_ELEMENTS['status_message'].textContent = `[STATUS]: ${state.status_message}`;
    }
    
    // Tension & Autonomy Status
    if (UI_ELEMENTS['tension_level_display']) {
        UI_ELEMENTS['tension_level_display'].textContent = `T: ${tensionValue.toFixed(4)}`;
    }
    const tensionBarEl = UI_ELEMENTS['tension_level_display_bar'];
    if (tensionBarEl) { 
        const tensionPercent = Math.min(tensionValue / TENSION_LIMIT, 1) * 100;
        tensionBarEl.style.width = `${tensionPercent}%`;
        tensionBarEl.style.backgroundColor = (tensionValue > TENSION_LIMIT * 0.7) ? '#dc3545' : '#ffc107';
    }
    const autonomyStatusEl = UI_ELEMENTS['autonomy_status'];
    if (autonomyStatusEl) {
        if (tensionValue > TENSION_LIMIT) {
            autonomyStatusEl.innerHTML = `暴走抑止ステータス: **警告 (T > ${TENSION_LIMIT.toFixed(4)})**`;
            autonomyStatusEl.style.color = '#dc3545';
        } else if (tensionValue > TENSION_LIMIT * 0.7) {
            autonomyStatusEl.innerHTML = `暴走抑止ステータス: **高緊張**`;
            autonomyStatusEl.style.color = '#ffc107';
        } else {
            autonomyStatusEl.innerHTML = `暴走抑止ステータス: **低緊張**`;
            autonomyStatusEl.style.color = '#28a745';
        }
    }

    // 数理的制御パラメータ (I/R) 
    if (UI_ELEMENTS['intensity_display']) { UI_ELEMENTS['intensity_display'].textContent = "0.9025"; } 
    if (UI_ELEMENTS['rigor_display']) { UI_ELEMENTS['rigor_display'].textContent = "0.2236"; }
    
    // Active User & Balance
    if (UI_ELEMENTS['active_user_name']) {
        UI_ELEMENTS['active_user_name'].textContent = activeUserName;
    }
    // メイン残高表示 (USD)
    if (UI_ELEMENTS['balance_display']) {
        const balance = getActiveUserBalance(activeUserName, "USD");
        UI_ELEMENTS['balance_display'].textContent = balance.toFixed(2).toLocaleString();
    }
    
    // 多通貨残高の更新ロジック
    const accounts = state.accounts[activeUserName];
    SUPPORTED_CURRENCIES.forEach(currency => {
        const el = UI_ELEMENTS[`balance_${currency}`];
        if (el) { 
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

    // ユーザー選択肢の更新
    const selectEl = UI_ELEMENTS['active_user_select'];
    if (selectEl) {
        selectEl.innerHTML = '';
        Object.keys(state.accounts).forEach(user => {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            if (user === activeUserName) {
                option.selected = true;
            }
            selectEl.appendChild(option);
        });
    }
}


// =========================================================================
// イベントハンドラー
// =========================================================================

/**
 * 通貨生成実行ボタンのハンドラー (Minting Act)
 */
function handleMintingExecuteAct() {
    try {
        const currency = UI_ELEMENTS['mint_currency_select'].value;
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
 * 通貨交換実行ボタンのハンドラー (Exchange Act)
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

// ... (handleTransfer, handleUserSelect, handleDeleteAccounts関数は省略。前回のコードを使用) ...
function handleTransfer(isExternal) {
    try {
        const recipient = UI_ELEMENTS['recipient_input'].value;
        const amount = parseFloat(UI_ELEMENTS['amount_input'].value);
        if (!recipient || recipient === getCurrentState().active_user || isNaN(amount) || amount <= 0) { 
             logToConsole("有効な受取人/数量を指定してください。", 'user-message'); return; 
        }
        const state = getCurrentState();
        const tensionAmount = isExternal ? amount * 0.0001 : amount * 0.00001;
        addTension(tensionAmount); 
        const actType = isExternal ? '外部送金' : '内部送金';
        logToConsole(`${state.active_user} が ${recipient} へ $${amount.toFixed(2)} ${actType} を実行しました。摩擦によりTensionが${tensionAmount.toFixed(6)}増加。`, 'ai-message');
        updateUI(getCurrentState());
    } catch (error) {
        logToConsole(`Transfer Act 失敗: ${error.message}`, 'error-message');
        console.error(error);
    }
}

function handleUserSelect(event) {
    const newActiveUser = event.target.value;
    setActiveUser(newActiveUser);
    logToConsole(`アクティブユーザーを ${newActiveUser} に切り替えました。`, 'user-message');
    updateUI(getCurrentState());
}

function handleDeleteAccounts() {
    if (confirm("🚨 警告: 全ての口座情報を削除し、システムを初期状態にリセットします。よろしいですか？")) {
        deleteAccounts();
        logToConsole("全ての口座情報と状態が削除され、システムは初期状態にリセットされました。", 'error-message');
        window.location.reload();
    }
}

// =========================================================================
// 初期化
// =========================================================================

/**
 * Mint と Exchange の選択肢を初期化する (デフォルト値を JPY/USD に変更)
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
        
        mintSelect.appendChild(option(currency).cloneNode(true));
        fromSelect.appendChild(option(currency).cloneNode(true));
        toSelect.appendChild(option(currency).cloneNode(true));
    });
    
    // 🌟 修正: デフォルト値の設定 🌟
    mintSelect.value = "JPY"; 
    fromSelect.value = "JPY"; 
    toSelect.value = "USD"; 
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

        initializeCurrencySelectors();

        // Minting Execute Button
        if (UI_ELEMENTS['mint_execute_button']) {
            UI_ELEMENTS['mint_execute_button'].addEventListener('click', handleMintingExecuteAct);
        }

        // Exchange Button
        if (UI_ELEMENTS['exchange_button']) {
            UI_ELEMENTS['exchange_button'].addEventListener('click', handleExchangeAct);
        }

        // Transfer Buttons
        if (UI_ELEMENTS['transfer_internal_button']) { UI_ELEMENTS['transfer_internal_button'].addEventListener('click', () => handleTransfer(false)); }
        if (UI_ELEMENTS['transfer_external_button']) { UI_ELEMENTS['transfer_external_button'].addEventListener('click', () => handleTransfer(true)); }
        
        // User Select
        if (UI_ELEMENTS['active_user_select']) { UI_ELEMENTS['active_user_select'].addEventListener('change', handleUserSelect); }
        
        // Delete Accounts (Audit Reset)
        if (UI_ELEMENTS['delete_accounts_button']) { UI_ELEMENTS['delete_accounts_button'].addEventListener('click', handleDeleteAccounts); }
        
        // Revision Petition (ダミー)
        if (UI_ELEMENTS['revision_button']) {
             UI_ELEMENTS['revision_button'].addEventListener('click', () => {
                 logToConsole("自律的修正請願をログに記録しました。Tension制御アルゴリズムが検討します。", 'ai-message');
            });
        }
        
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
