// app/main.js (全機能復元版 - 全文)

// パス修正済み: appディレクトリから core ディレクトリを参照
import { getCurrentState, getTensionInstance } from '../core/foundation.js'; 
// 🚨 Exchange機能のために actExchangeCurrency をインポート
import { actMintCurrency, actExchangeCurrency } from '../core/currency.js'; 

// 表示される可能性のあるすべての通貨
const SUPPORTED_CURRENCIES = ["USD", "JPY", "EUR", "BTC", "ETH", "MATIC"];

// UIを更新するためのヘルパー関数
function updateUI(state) {
    const tensionInstance = getTensionInstance();
    const tensionValue = tensionInstance.getValue() * 100; // パーセント表示

    // 1. System Status
    document.getElementById('status-message').textContent = state.status_message;
    document.getElementById('last-act').textContent = state.last_act;
    
    // 2. Tension Level
    document.getElementById('tension-level').textContent = `${tensionValue.toFixed(6)}%`;

    // 3. Balances (User A)
    const user = state.active_user;
    const accounts = state.accounts[user];
    
    SUPPORTED_CURRENCIES.forEach(currency => {
        const el = document.getElementById(`balance-${currency}`);
        if (el) {
            const balance = accounts[currency] || 0;
            // JPYなどの整数を扱う通貨と、小数を扱う通貨でフォーマットを分ける
            el.textContent = (currency === "JPY") ? Math.floor(balance).toLocaleString() : balance.toFixed(8);
        }
    });
}

/**
 * アプリケーションの初期化を行う。
 */
function initializeApp() {
    try {
        console.log("MSGAI Core System Initializing...");

        // 状態をロード
        const initialState = getCurrentState(); 
        const activeUser = initialState.active_user;

        console.log("Initial state loaded successfully:", initialState);

        // 必須UI要素の取得
        const mintButtonEl = document.getElementById('mint-button');
        const mintCurrencySelectEl = document.getElementById('mint-currency-select');
        const mintAmountInputEl = document.getElementById('mint-amount-input');
        
        const exchangeButtonEl = document.getElementById('exchange-button');
        const fromCurrencySelectEl = document.getElementById('from-currency-select');
        const toCurrencySelectEl = document.getElementById('to-currency-select');
        const exchangeAmountInputEl = document.getElementById('exchange-amount-input');

        // エラーチェック（省略）
        
        // 初期のUI更新
        updateUI(initialState);
        
        // ===================================
        // Mint (発行) イベントリスナー
        // ===================================
        mintButtonEl.addEventListener('click', () => {
            try {
                const currency = mintCurrencySelectEl.value;
                const amount = parseFloat(mintAmountInputEl.value);

                if (isNaN(amount) || amount <= 0) {
                    alert("発行量は正の値を入力してください。");
                    return;
                }
                
                const newState = actMintCurrency(activeUser, currency, amount);
                updateUI(newState);
                console.log(`[UI Act] Mint Successful: ${amount} ${currency}`);
                
            } catch (error) {
                console.error("Mint operation failed:", error);
                alert("Mint failed. See console for details: " + error.message);
            }
        });

        // ===================================
        // Exchange (交換) イベントリスナー
        // ===================================
        exchangeButtonEl.addEventListener('click', () => {
            try {
                const fromC = fromCurrencySelectEl.value;
                const toC = toCurrencySelectEl.value;
                const amount = parseFloat(exchangeAmountInputEl.value);

                if (fromC === toC) {
                    alert("同じ通貨間の交換はできません。");
                    return;
                }
                if (isNaN(amount) || amount <= 0) {
                    alert("交換量は正の値を入力してください。");
                    return;
                }
                
                const newState = actExchangeCurrency(activeUser, fromC, amount, toC);
                updateUI(newState);
                console.log(`[UI Act] Exchange Successful: ${amount} ${fromC} -> ${toC}`);

            } catch (error) {
                console.error("Exchange operation failed:", error);
                alert("Exchange failed. See console for details: " + error.message);
            }
        });

        console.log("MSGAI Initialization complete. All features ready.");

    } catch (error) {
        // 致命的な初期化エラー
        console.error("致命的な初期化エラー:", error); 
        document.body.innerHTML = '<h1>システム起動エラー</h1><p>コア初期化に失敗しました。コンソールを確認してください。</p>';
    }
}

// ドキュメントが完全にロードされた後に初期化関数を呼び出す
document.addEventListener('DOMContentLoaded', initializeApp);
