// app/main.js (最終確認版 - 全文)

import * as Foundation from '../core/foundation.js';
import * as Arithmos from '../core/arithmos.js';
import * as Currency from '../core/currency.js';
import * as UI from './fusionui.js';
// 必要な関数を個別にインポート
import { connectEventHandlers } from './handler.js'; 

/**
 * アプリケーションのコア処理とUI処理を連携させるメイン関数
 */
function initializeApp() {
    console.log("main.js: アプリケーション初期化開始。");

    try {
        // 1. コア状態の取得（UI表示用のデータ）
        // Foundation.getCurrentState() が ensureLogosStateInitialized() を通じて初めてLogosStateを初期化する
        const stateData = Foundation.getCurrentState(); 
        const tensionInstance = Foundation.getTensionInstance();
        
        // 2. I/Rパラメータの計算
        const matrix = new Arithmos.ControlMatrix(tensionInstance);
        const matrixData = { 
            intensity: matrix.intensity, 
            rigor: matrix.rigor 
        };
        
        // 3. UIの初期描画
        // main.js:29:12 に対応する行
        UI.updateUI(stateData, "システム監査コンソールが起動しました。", matrixData);
        
        // 4. イベントハンドラの接続
        // 修正: インポートした関数を直接呼び出す
        connectEventHandlers(Foundation, Currency, UI, Arithmos); 

    } catch (error) {
        // 致命的なエラーが発生した場合の処理
        console.error("致命的な初期化エラー:", error);
        
        // UIへのエラー表示
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

// 🌟 必須: DOMコンテンツが完全に読み込まれた後にinitializeAppを実行
document.addEventListener('DOMContentLoaded', initializeApp);
