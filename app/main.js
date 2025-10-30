// app/main.js (旧版 MSGAI 実行ロジック - コア直接呼び出し)

// 💡 コア機能のインポート
// 旧版では、LLMやmtc_ai_controlを経由せず、これらの関数を直接呼び出していました。
import { 
    getCurrentState, 
    setActiveUser, 
    deleteAccounts, 
    actTransfer 
} from './core/foundation.js';
import { 
    actMintCurrency, 
    actExchangeCurrency 
} from './core/currency.js';


// -------------------------------------------------------------------------
// 🧠 ユーザー入力の解析 (旧版のシンプルなパーサー)
// -------------------------------------------------------------------------

/**
 * ユーザー入力のテキストを解析し、実行可能なActコマンド構造に変換する。
 * 旧版では、このシンプルなパーサーがコマンドを直接コア機能にマッピングしていました。
 * @param {string} input - ユーザーの入力テキスト
 * @param {string} activeUser - 現在のアクティブユーザー
 * @returns {object} { command: string, params: object } または { command: 'NO_OPERATION' }
 */
function parseUserInput(input, activeUser) {
    const parts = input.trim().split(/\s+/).filter(p => p.length > 0);
    if (parts.length === 0) {
        return { command: 'NO_OPERATION' };
    }
    
    const commandType = parts[0].toLowerCase();

    try {
        if (commandType === 'mint' && parts.length >= 3) {
            // 例: Mint 100 JPY
            return {
                command: 'actMintCurrency',
                params: {
                    user: activeUser,
                    amount: parseFloat(parts[1]),
                    currency: parts[2].toUpperCase()
                }
            };
        }
        
        if (commandType === 'transfer' && parts.length >= 5 && parts[3].toLowerCase() === 'to') {
            // 例: Transfer 50 USD to User_B
            return {
                command: 'actTransfer',
                params: {
                    sender: activeUser,
                    amount: parseFloat(parts[1]),
                    currency: parts[2].toUpperCase(),
                    recipient: parts[4]
                }
            };
        }

        if (commandType === 'exchange' && parts.length >= 6 && parts[4].toLowerCase() === 'to') {
            // 例: Exchange 1000 JPY to USD
            return {
                command: 'actExchangeCurrency',
                params: {
                    user: activeUser,
                    fromAmount: parseFloat(parts[1]),
                    fromCurrency: parts[2].toUpperCase(),
                    toCurrency: parts[5].toUpperCase()
                }
            };
        }

    } catch (e) {
        console.error("Parsing failed due to format error:", e);
    }

    return { command: 'NO_OPERATION', reason: 'Unrecognized command format.' };
}

// -------------------------------------------------------------------------
// 🚀 実行制御とUI接続 (旧版)
// -------------------------------------------------------------------------

/**
 * ユーザー入力を処理し、コア機能を直接実行する。
 */
async function handleUserInput(userInput) {
    const currentState = getCurrentState();
    const activeUser = currentState.active_user;
    
    // 1. 入力を解析
    const parsedCommand = parseUserInput(userInput, activeUser);
    
    if (parsedCommand.command === 'NO_OPERATION') {
        console.log(`[Parser] NO OPERATION: ${parsedCommand.reason || 'Input not recognized.'}`);
        updateUIAfterExecution("コマンドが認識できませんでした。");
        return;
    }

    // 2. コア機能の直接呼び出し
    let statusMessage = "実行成功";
    try {
        const params = parsedCommand.params;
        let newState;

        switch (parsedCommand.command) {
            case 'actTransfer':
                newState = actTransfer(params.sender, params.recipient, params.amount, params.currency);
                break;
            case 'actMintCurrency':
                newState = actMintCurrency(params.user, params.currency, params.amount);
                break;
            case 'actExchangeCurrency':
                newState = actExchangeCurrency(params.user, params.fromCurrency, params.fromAmount, params.toCurrency);
                break;
            default:
                statusMessage = "未定義のコマンド";
                throw new Error(`Command not implemented: ${parsedCommand.command}`);
        }
        
        statusMessage = `${parsedCommand.command} を実行しました。`;
        console.log(`[Execution] Command: ${parsedCommand.command}, New State:`, newState);

    } catch (error) {
        statusMessage = `実行失敗: ${error.message}`;
        console.error("[Execution Error]", error);
    }
    
    // 3. UIの更新
    updateUIAfterExecution(statusMessage);
}

// UI更新とイベントリスナーは前回のものを使用（状態表示ロジックは流用）
function updateUIAfterExecution(message = "状態更新完了") {
    const state = getCurrentState();
    const accountsDiv = document.getElementById('accounts-display');
    const statusDiv = document.getElementById('status-message');
    
    if (statusDiv) {
        statusDiv.textContent = `STATUS: ${message} | TENSION: ${state.tension.value.toFixed(5)} | USER: ${state.active_user}`;
    }

    if (accountsDiv) {
        let html = `<div class="account-card bg-gray-700 p-4 rounded-lg shadow-lg mb-4">
                <h3 class="text-xl font-bold text-yellow-300 mb-2">Active User: ${state.active_user}</h3>
            </div>`;
        
        for (const user in state.accounts) {
            html += `<div class="account-card bg-gray-800 p-3 rounded-md mb-2 shadow-md">`;
            html += `<p class="font-semibold text-blue-300">${user} Accounts:</p>`;
            for (const currency in state.accounts[user]) {
                const balance = state.accounts[user][currency];
                html += `<span class="text-sm text-gray-200 mr-4">${currency}: ${balance.toFixed(4)}</span>`;
            }
            html += `</div>`;
        }
        accountsDiv.innerHTML = html;
    }
    
    console.log("最新の状態:", state);
}


document.addEventListener('DOMContentLoaded', () => {
    const inputElement = document.getElementById('user-input'); 
    const submitButton = document.getElementById('submit-button'); 
    const userSelect = document.getElementById('user-select');
    const deleteButton = document.getElementById('delete-accounts-button');
    
    if (!inputElement || !submitButton || !userSelect || !deleteButton) {
        console.error("UI要素が見つかりません。index.htmlのIDを確認してください。");
        return;
    }

    // ユーザー選択肢の初期化
    const state = getCurrentState();
    for (const user in state.accounts) {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = user;
        userSelect.appendChild(option);
    }
    userSelect.value = state.active_user;

    // イベントリスナーの設定
    const submitAction = () => {
        const userInput = inputElement.value;
        handleUserInput(userInput);
        inputElement.value = ''; // 入力フィールドをクリア
    };
    
    userSelect.addEventListener('change', (e) => {
        setActiveUser(e.target.value);
        updateUIAfterExecution("ユーザー切り替え完了");
    });
    
    deleteButton.addEventListener('click', () => {
        // UI側の確認ダイアログはCanvasでは動作しないが、ログとして残す
        if (confirm("全てのアカウントとTensionデータをリセットしますか？")) { 
            deleteAccounts();
            updateUIAfterExecution("データリセット完了");
            console.log("アカウントデータが初期状態にリセットされました。");
        }
    });

    submitButton.addEventListener('click', submitAction);
    inputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitAction();
        }
    });

    // 初期状態の表示
    updateUIAfterExecution("コア起動完了");
    console.log("旧版MSGAI Front-End Ready. 直接コア機能を呼び出します。");
});

