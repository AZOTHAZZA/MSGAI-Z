// app/main.js (エラー処理調整版)

import * as Foundation from '../core/foundation.js';
import * as Arithmos from '../core/arithmos.js';
import * as Currency from '../core/currency.js';
import * as UI from './fusionui.js';
import * as Handler from './handler.js';

/**
 * アプリケーションのコア処理とUI処理を連携させるメイン関数
 */
function initializeApp() {
    console.log("main.js: アプリケーション初期化開始。");

    try {
        // 1. キャッシュ/ストレージの初期化と監査ログを出力（ダミー関数と仮定）
        // initializeCacheLogos(); // 実行するとエラーになる可能性があるためコメントアウト

        // 2. コア状態の取得とUIの初期描画
        const stateData = Foundation.getCurrentState(); 
        
        // 3. I/Rパラメータの計算
        const matrix = new Arithmos.ControlMatrix(stateData.tension_level);
        const matrixData = { intensity: matrix.intensity, rigor: matrix.rigor };
        
        // 4. UIの初期描画
        UI.updateUI(stateData, "システム監査コンソールが起動しました。", matrixData);
        
        // 5. イベントハンドラの接続
        Handler.connectEventHandlers(Foundation, Currency, UI, Arithmos);

    } catch (error) {
        // 致命的なエラーが発生した場合の処理
        console.error("致命的な初期化エラー:", error);
        
        // UIがまだ動作しているか不明なため、直接要素を操作
        const statusElement = document.getElementById('autonomy_status');
        if (statusElement) {
             statusElement.textContent = '暴走抑止ステータス: **FATAL ERROR**';
             statusElement.style.color = 'var(--color-alert-red)';
        }
        
        // ログエリアに通知
        if (UI.displayDialogue) {
            UI.displayDialogue('CORE_STATUS', `❌ 致命的な初期化エラーが発生しました: ${error.message}`);
        } else {
            console.error("UIシステムもロードできていません。");
        }
    }
    
    console.log("main.js: アプリケーション初期化完了。");
}

// ドキュメントが完全に読み込まれた後にinitializeAppを実行
document.addEventListener('DOMContentLoaded', initializeApp);
