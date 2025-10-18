// app/main.js (最終的な起動修正版 - 全文)

// 🚨 修正: Foundationからは状態管理機能のみをインポート
import { getCurrentState } from '../core/foundation.js'; 
// ✅ 修正: 実際の取引ロジックはCurrencyモジュールからインポート
import { actMintCurrency } from '../core/currency.js'; 

/**
 * アプリケーションの初期化を行う。
 * 状態をロードし、初期UIの構築やイベントリスナーの設定を行う。
 */
function initializeApp() {
    try {
        console.log("MSGAI Core System Initializing...");

        // FoundationのgetCurrentStateを呼び出すことで、
        // Tensionの健全性チェックとロードをトリガーする
        const initialState = getCurrentState(); 

        console.log("Initial state loaded successfully:", initialState);

        // 例: 初期UI表示のロジック
        document.getElementById('status-message').textContent = initialState.status_message;
        document.getElementById('user-a-balance').textContent = 
            `User A Balance (USD): ${initialState.accounts["User_A"]["USD"].toFixed(2)}`;
        
        // テスト用のイベントリスナー設定
        document.getElementById('mint-button').addEventListener('click', () => {
            try {
                // CurrencyモジュールからインポートしたactMintCurrencyを実行
                const newState = actMintCurrency("User_A", "USD", 1.0);
                alert(`Mint successful! New USD: ${newState.accounts["User_A"]["USD"].toFixed(2)}`);
                document.getElementById('user-a-balance').textContent = 
                    `User A Balance (USD): ${newState.accounts["User_A"]["USD"].toFixed(2)}`;
            } catch (error) {
                console.error("Mint operation failed:", error);
                alert("Mint failed. See console for details.");
            }
        });

        console.log("MSGAI Initialization complete. Core logic is stable.");

    } catch (error) {
        console.error("致命的な初期化エラー:", error); 
        document.body.innerHTML = '<h1>システム起動エラー</h1><p>コア初期化に失敗しました。コンソールを確認してください。</p>';
    }
}

// ドキュメントが完全にロードされた後に初期化関数を呼び出す
document.addEventListener('DOMContentLoaded', initializeApp);
