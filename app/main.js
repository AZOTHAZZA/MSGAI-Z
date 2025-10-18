// app/main.js (情報表示強化版 - 全文)

// パス修正済み: appディレクトリから core ディレクトリを参照
import { getCurrentState, getTensionInstance } from '../core/foundation.js'; 
import { actMintCurrency } from '../core/currency.js'; 

// UIを更新するためのヘルパー関数
function updateUI(state) {
    const tensionInstance = getTensionInstance();
    const tensionValue = tensionInstance.getValue() * 100; // パーセント表示のため

    // 1. System Status
    document.getElementById('status-message').textContent = state.status_message;
    document.getElementById('last-act').textContent = state.last_act;
    
    // 2. Tension Level
    document.getElementById('tension-level').textContent = `${tensionValue.toFixed(4)}%`;

    // 3. Balances (User A)
    const user = state.active_user;
    const accounts = state.accounts[user];
    
    // USD残高
    document.getElementById('balance-USD').textContent = (accounts["USD"] || 0.00).toFixed(2);
    // JPY残高
    document.getElementById('balance-JPY').textContent = Math.floor(accounts["JPY"] || 0);

    // 他の通貨も必要に応じてここで更新ロジックを追加
}

/**
 * アプリケーションの初期化を行う。
 */
function initializeApp() {
    try {
        console.log("MSGAI Core System Initializing...");

        // Foundationを呼び出し、状態をロード
        const initialState = getCurrentState(); 

        console.log("Initial state loaded successfully:", initialState);

        // UI要素の存在チェックと初期表示
        const mintButtonEl = document.getElementById('mint-button');

        if (!mintButtonEl || !document.getElementById('tension-level') || !document.getElementById('balance-USD')) {
             console.error("UI Element Missing: HTML要素のIDが不足しています。index.htmlを確認してください。");
             throw new Error("UI Initialization Failed.");
        }
        
        // 初期のUI更新
        updateUI(initialState);
        
        // テスト用のイベントリスナー設定
        mintButtonEl.addEventListener('click', () => {
            try {
                // CurrencyモジュールからインポートしたactMintCurrencyを実行
                const newState = actMintCurrency(initialState.active_user, "USD", 1.0);
                
                // UIを更新
                updateUI(newState);

                console.log(`[UI Act] Mint Successful. New State:`, newState);
                
            } catch (error) {
                console.error("Mint operation failed:", error);
                alert("Mint failed. See console for details.");
            }
        });

        console.log("MSGAI Initialization complete. Core logic is stable.");

    } catch (error) {
        // 致命的な初期化エラー
        console.error("致命的な初期化エラー:", error); 
        document.body.innerHTML = '<h1>システム起動エラー</h1><p>コア初期化に失敗しました。コンソールを確認してください。</p>';
    }
}

// ドキュメントが完全にロードされた後に初期化関数を呼び出す
document.addEventListener('DOMContentLoaded', initializeApp);
