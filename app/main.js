// app/main.js (ControlMatrix引数修正版)

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
        // 1. キャッシュ/ストレージの初期化と監査ログを出力 (ここは省略)

        // 2. コア状態の取得
        // UI表示用のデータとして取得 (tension_levelは数値)
        const stateData = Foundation.getCurrentState(); 

        // 🌟 修正: ControlMatrixのためにTensionインスタンスを直接取得
        const tensionInstance = Foundation.getTensionInstance();
        
        // 3. I/Rパラメータの計算
        // 🌟 修正: ControlMatrixにTensionインスタンスを渡す
        const matrix = new Arithmos.ControlMatrix(tensionInstance);
        const matrixData = { 
            intensity: matrix.intensity, 
            rigor: matrix.rigor 
        };
        
        // 4. UIの初期描画
        UI.updateUI(stateData, "システム監査コンソールが起動しました。", matrixData);
        
        // 5. イベントハンドラの接続
        Handler.connectEventHandlers(Foundation, Currency, UI, Arithmos);

    } catch (error) {
        // 致命的なエラーが発生した場合の処理
        console.error("致命的な初期化エラー:", error);
        
        const statusElement = document.getElementById('autonomy_status');
        if (statusElement) {
             statusElement.textContent = '暴走抑止ステータス: **FATAL ERROR**';
             statusElement.style.color = 'var(--color-alert-red)';
        }
        
        if (UI.displayDialogue) {
            UI.displayDialogue('CORE_STATUS', `❌ 致命的な初期化エラーが発生しました: ${error.message}`);
        }
    }
    
    console.log("main.js: アプリケーション初期化完了。");
}

document.addEventListener('DOMContentLoaded', initializeApp);
