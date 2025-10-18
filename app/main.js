// app/main.js (最終的な起動修正版 - 全文)

// 🚨 パス修正済み: appディレクトリから core ディレクトリを参照
import { getCurrentState } from '../core/foundation.js'; 
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

        // UI要素が確実に存在することを確認
        const statusMessageEl = document.getElementById('status-message');
        const userABalanceEl = document.getElementById('user-a-balance');
        const mintButtonEl = document.getElementById('mint-button');
        
        // 🚨 エラー回避: 要素が存在しない場合はコンソールに警告を出して処理を停止
        if (!statusMessageEl || !userABalanceEl || !mintButtonEl) {
             console.error("UI Element Missing: 以下のIDのいずれかが見つかりません: status-message, user-a-balance, mint-button");
             throw new Error("UI Initialization Failed: HTML elements are missing.");
        }

        // 例: 初期UI表示のロジック
        statusMessageEl.textContent = initialState.status_message;
        userABalanceEl.textContent = 
            `User A Balance (USD): ${initialState.accounts["User_A"]["USD"].toFixed(2)}`;
        
        // テスト用のイベントリスナー設定
        mintButtonEl.addEventListener('click', () => {
            try {
                // CurrencyモジュールからインポートしたactMintCurrencyを実行
                const newState = actMintCurrency("User_A", "USD", 1.0);
                alert(`Mint successful! New USD: ${newState.accounts["User_A"]["USD"].toFixed(2)}`);
                userABalanceEl.textContent = 
                    `User A Balance (USD): ${newState.accounts["User_A"]["USD"].toFixed(2)}`;
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
