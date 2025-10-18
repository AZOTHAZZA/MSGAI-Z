// app/main.js (最終修正版: インポートパスを修正)

// 🌟 修正: パスの二重指定を解消し、正しい相対パスを指定

// core/foundation.jsから状態取得関数をインポート
import { getCurrentStateJson } from '../core/foundation.js'; // 修正: ./core -> ../core
// app/handler.jsからイベントハンドラ接続関数をインポート
import { attachEventHandlers } from './handler.js'; // 修正: ./app/handler.js -> ./handler.js
// app/fusionui.jsからUI更新関数をインポート
import * as UI from './fusionui.js'; // 修正: ./app/fusionui.js -> ./fusionui.js
// core/cache_logos.jsから初期化関数をインポート
import { initializeCacheLogos } from '../core/cache_logos.js'; // 修正: ./core -> ../core

import { LogosTension, ControlMatrix } from '../core/arithmos.js'; // 修正: ./core -> ../core


/**
 * コアアプリケーションの起動と初期化を行うメイン関数
 */
function initializeApp() {
    console.log("main.js: アプリケーション初期化開始。");

    try {
        // 1. キャッシュ/ストレージの初期化と監査ログを出力
        initializeCacheLogos(); 
        
        // 2. コア状態の取得
        const initialStateJson = getCurrentStateJson();
        const initialState = JSON.parse(initialStateJson);

        // 3. I/Rパラメータの計算 (UI初期描画用)
        const tension = new LogosTension(initialState.tension_level);
        const matrix = new ControlMatrix(tension);
        const matrixData = {
            intensity: matrix.intensity,
            rigor: matrix.rigor
        };

        // 4. UIの初期描画
        UI.updateUI(initialState, "コア状態のロードとUI初期化を完了しました。", matrixData);


        // 5. イベントハンドラの接続
        attachEventHandlers(); 

    } catch (error) {
        console.error("致命的な初期化エラー:", error);
        document.getElementById('status_message').textContent = `[FATAL ERROR]: 初期化中に致命的なエラーが発生しました: ${error.message}`;
        // エラー発生時もログエリアに通知
        UI.displayDialogue('CORE_STATUS', `❌ 致命的な初期化エラー: ${error.message}`);
    }
    
    console.log("main.js: アプリケーション初期化完了。");
}

// エントリポイント: HTMLのDOMが完全に読み込まれた後に実行を保証
document.addEventListener('DOMContentLoaded', initializeApp);
