// app/main.js (最終修正版 - 全文)

import { 
    getCurrentState, 
    getTensionInstance, 
    addTension, 
    setActiveUser, 
    actTransfer, // 💡 追加: actTransfer
    deleteAccounts 
} from '../core/foundation.js'; 
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
        'active_user_name', 'recipient_input', 
        'amount_input', 'autonomy_status', 'transfer_internal_button', 
        'transfer_external_button', 'revision_button', 'delete_accounts_button',
        'mint_amount_input', 'dialogue-output', 'dialogue_input', 'dialogue_button',
        'exchange_amount_input', 'exchange_from_select', 'exchange_to_select', 
        'exchange_button',
        'mint_currency_select', 'mint_execute_button', 'css_reset_button'
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
    const tensionValue = tension.getValue ? tension.getValue() : tension.value; // tension.getValue()が未定義の場合を考慮
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
// イベントハンドラー (作為)
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

/**
 * 送金 (Transfer Act) ハンドラー - 残高消費ロジックを実装
 */
function handleTransfer(isExternal) {
    const CURRENCY = 'USD'; // 通貨はUSD固定
    
    try {
        let recipient = UI_ELEMENTS['recipient_input'].value;
        const amount = parseFloat(UI_ELEMENTS['amount_input'].value);
        const state = getCurrentState();

        if (isNaN(amount) || amount <= 0) { 
             logToConsole("有効な数量を指定してください。", 'user-message'); return; 
        }
        
        // 外部送金の場合、受取人を "External_Gateway" に強制設定（監査のため）
        if (isExternal) {
            if (!recipient || recipient === 'User_B' || recipient === 'User_C') {
                 recipient = 'External_Gateway'; 
            } else {
                 recipient = 'External_Gateway (' + recipient + ')'; 
            }
        }
        
        if (!recipient || recipient === state.active_user) { 
             logToConsole("有効な受取人を指定してください。", 'user-message'); return; 
        }
        
        // 1. 残高消費と移動の実行 (actTransferを使用)
        const newState = actTransfer(state.active_user, recipient, amount, CURRENCY);
        
        // Tensionの計算と増加
        const tensionAmount = isExternal ? amount * 0.0001 : amount * 0.00001;
        addTension(tensionAmount); 
        
        const actType = isExternal ? '外部送金（高摩擦）' : '内部送金（低摩擦）';
        
        // ログ表示
        logToConsole(`${state.active_user} が ${recipient} へ **$${amount.toFixed(2)} ${CURRENCY}** を ${actType} しました。Tensionが${tensionAmount.toFixed(6)}増加。`, 'ai-message');
        updateUI(newState);
        
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
    if (confirm("🚨 警告: 全ての口座情報とTensionを削除し、システムを初期状態にリセットします。よろしいですか？")) {
        deleteAccounts();
        logToConsole("全ての口座情報と状態が削除され、システムは初期状態にリセットされました。", 'error-message');
        // 強制リロード
        window.location.reload(); 
    }
}


// =========================================================================
// UI配色リセット機能
// =========================================================================

// 復元したい安全なCSSの全文を文字列として定義 (index.htmlの<style>タグの内容と同期)
const CSS_DEFAULT_STATE = `
    /* 🌟 UI全体の色と基本レイアウトの最終復元 🌟 */
    body { 
        display: flex; 
        font-family: 'Segoe UI', 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif; 
        margin: 0; 
        background-color: #f0f0f0; 
    }
    
    h2 { margin-top: 0; padding-top: 5px; border-bottom: 2px solid #ddd; padding-bottom: 5px; }
    h3 { margin-top: 0; margin-bottom: 10px; font-size: 1.1em; }

    #sidebar { 
        width: 350px; 
        background-color: #fff; 
        padding: 20px; 
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); 
    }
    #main-content { 
        flex-grow: 1; 
        padding: 20px; 
        display: flex; 
        flex-direction: column; 
        background-color: #f0f0f0; 
    }
    .gauge-area { 
        border: 1px solid #ddd; 
        padding: 15px; 
        margin-top: 15px; 
        border-radius: 5px; 
        background-color: #fff;
    }
    
    /* フォームとラベルのレイアウト修正 */
    .gauge-area label {
        display: block; 
        margin-top: 10px; 
        margin-bottom: 3px; 
        font-weight: bold;
    }
    .gauge-area input, .gauge-area select {
        width: 90%; 
        padding: 8px; 
        border: 1px solid #ccc; 
        border-radius: 3px; 
        box-sizing: border-box; 
        margin-top: 0;
        margin-bottom: 15px;
    }
    
    /* ボタンのスタイルと色分け */
    .action-button { width: 100%; padding: 10px; margin-top: 5px; border: none; border-radius: 4px; color: white; cursor: pointer; }
    .action-internal { background-color: #007bff; }
    .action-external { background-color: #ffc107; }
    .action-revision { background-color: #28a745; }
    #delete_accounts_button { background-color: #A6A6A6; }
    
    #mint_execute_button { background-color: #FFA500; } 
    #exchange_button { background-color: #007bff; } 

    /* Tension Bar Style */
    #tension_bar { background-color: #e9ecef; border-radius: 5px; height: 10px; margin-top: 5px; overflow: hidden; }
    #tension_level_display_bar { height: 100%; width: 0%; transition: width 0.3s; background-color: #dc3545; }
    
    /* Dialogue Console Style */
    #dialogue-output { flex-grow: 1; border: 1px solid #ddd; background-color: #fff; padding: 10px; overflow-y: scroll; margin-bottom: 10px; border-radius: 5px; }
    .ai-message { color: #007bff; margin-bottom: 5px; }
    .error-message { color: #dc3545; font-weight: bold; }
    #input-area { display: flex; }
    #dialogue_input { flex-grow: 1; padding: 10px; margin-right: 10px; }
    #dialogue_button { padding: 10px 15px; background-color: #6c757d; color: white; border: none; border-radius: 4px; }
    
    #autonomy_status { color: #dc3545; } 
`;

/**
 * UI配色を既定の安全な状態にリセットする (キャッシュ破壊込み)
 */
function resetCSS() {
    const styleElement = document.querySelector('style');
    const output = document.getElementById('dialogue-output');

    if (styleElement) {
        // 1. <style>タグの内容を、安全なデフォルトCSSで上書き
        styleElement.textContent = CSS_DEFAULT_STATE;
        
        output.innerHTML += `<div class="ai-message"><strong>[AUDIT]:</strong> UI配色を既定の安全な状態にリセットしました。</div>`;

        // 2. 🚨 キャッシュを無視した強制リロードを実行
        alert('UI配色をリセットします。OKを押すと、キャッシュを無視してページを強制再読み込みします。');
        window.location.reload(true); 

    } else {
        output.innerHTML += `<div class="error-message"><strong>[AUDIT ERROR]:</strong> CSSリセットに失敗しました。<style>タグが見つかりません。</div>`;
    }
}


// =========================================================================
// 初期化
// =========================================================================

/**
 * Mint と Exchange の選択肢を初期化する
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
    
    // デフォルト値の設定
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

        // イベントリスナーの追加
        if (UI_ELEMENTS['mint_execute_button']) {
            UI_ELEMENTS['mint_execute_button'].addEventListener('click', handleMintingExecuteAct);
        }
        if (UI_ELEMENTS['exchange_button']) {
            UI_ELEMENTS['exchange_button'].addEventListener('click', handleExchangeAct);
        }
        if (UI_ELEMENTS['transfer_internal_button']) { 
            UI_ELEMENTS['transfer_internal_button'].addEventListener('click', () => handleTransfer(false)); 
        }
        if (UI_ELEMENTS['transfer_external_button']) { 
            UI_ELEMENTS['transfer_external_button'].addEventListener('click', () => handleTransfer(true)); 
        }
        if (UI_ELEMENTS['active_user_select']) { 
            UI_ELEMENTS['active_user_select'].addEventListener('change', handleUserSelect); 
        }
        if (UI_ELEMENTS['delete_accounts_button']) { 
            UI_ELEMENTS['delete_accounts_button'].addEventListener('click', handleDeleteAccounts); 
        }
        // UI配色リセットボタン
        if (UI_ELEMENTS['css_reset_button']) {
             UI_ELEMENTS['css_reset_button'].addEventListener('click', resetCSS);
        }
        
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
