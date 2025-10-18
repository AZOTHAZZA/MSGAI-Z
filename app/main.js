// app/main.js のインポート部分の修正

// 🚨 修正後のパス: ディレクトリを一つ上がってから(..)、coreフォルダ内のfoundation.jsを参照
import { getCurrentState, actMintCurrency } from '../core/foundation.js'; 
// 🚨 修正: Arithmosモジュールへの直接依存を削除しました。

/**
 * アプリケーションの初期化を行う。
 * 状態をロードし、初期UIの構築やイベントリスナーの設定を行う。
 */
function initializeApp() {
    try {
        console.log("MSGAI Core System Initializing...");

        // 🌟 修正: getCurrentStateを呼び出すことで、
        // Foundation内部でTensionの健全性チェックとロードが完了する
        const initialState = getCurrentState(); // L23: Foundationの初期化をトリガー

        console.log("Initial state loaded successfully:", initialState);

        // 致命的なエラーの原因となっていたコードを削除
        // ❌ let controlMatrix = new Arithmos.ControlMatrix(); 
        // ❌ console.log("ControlMatrix initialized:", controlMatrix);

        // 例: 初期UI表示のロジック
        document.getElementById('status-message').textContent = initialState.status_message;
        document.getElementById('user-a-balance').textContent = 
            `User A Balance (USD): ${initialState.accounts["User_A"]["USD"].toFixed(2)}`;
        
        // テスト用のイベントリスナー設定（例としてactMintCurrencyを呼び出す）
        document.getElementById('mint-button').addEventListener('click', () => {
            try {
                const newState = actMintCurrency("User_A", "USD", 1.0);
                alert(`Mint successful! New USD: ${newState.accounts["User_A"]["USD"].toFixed(2)}`);
                document.getElementById('user-a-balance').textContent = 
                    `User A Balance (USD): ${newState.accounts["User_A"]["USD"].toFixed(2)}`;
            } catch (error) {
                console.error("Mint operation failed:", error);
                alert("Mint failed. See console for details.");
            }
        });

        console.log("MSGAI Initialization complete.");

    } catch (error) {
        // L39: 致命的な初期化エラー
        console.error("致命的な初期化エラー:", error); 
        document.body.innerHTML = '<h1>システム起動エラー</h1><p>コア初期化に失敗しました。コンソールを確認してください。</p>';
    }
}

// ドキュメントが完全にロードされた後に初期化関数を呼び出す
document.addEventListener('DOMContentLoaded', initializeApp);
