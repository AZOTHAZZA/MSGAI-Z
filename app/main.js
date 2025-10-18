// app/main.js (修正版: 適切な初期化シーケンスを保証)

// core/foundation.jsから状態取得関数をインポート
import { getCurrentStateJson } from './core/foundation.js';
// app/handler.jsからイベントハンドラ接続関数をインポート
import { attachEventHandlers } from './app/handler.js';
// app/fusionui.jsからUI更新関数をインポート
import * as UI from './app/fusionui.js';
// core/cache_logos.jsから初期化関数をインポート
import { initializeCacheLogos } from './core/cache_logos.js'; 

import { LogosTension, ControlMatrix } from './core/arithmos.js';


/**
 * コアアプリケーションの起動と初期化を行うメイン関数
 */
function initializeApp() {
    console.log("main.js: アプリケーション初期化開始。");

    try {
        // 1. キャッシュ/ストレージの初期化と監査ログを出力
        // LocalStorageの強制クリアとログの出力を行う
        initializeCacheLogos(); 
        
        // 2. コア状態の取得 (この時点でLogosStateは永続化データからロードされている)
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
        // 🌟 この呼び出しが非常に重要。DOM要素に値を設定し、ユーザーリストを生成します。
        // これにより、後続のイベントハンドラが要素を見つけられるようになります。
        UI.updateUI(initialState, "コア状態のロードとUI初期化を完了しました。", matrixData);


        // 5. イベントハンドラの接続
        // 🌟 DOMが完全に描画された後でなければ、この処理は機能しません。
        attachEventHandlers(); 

    } catch (error) {
        console.error("致命的な初期化エラー:", error);
        document.getElementById('status_message').textContent = `[FATAL ERROR]: 初期化中に致命的なエラーが発生しました: ${error.message}`;
        // エラー発生時もログエリアに通知
        UI.displayDialogue('CORE_STATUS', `❌ 致命的な初期化エラー: ${error.message}`);
    }
    
    console.log("main.js: アプリケーション初期化完了。");
}

// 🌟 エントリポイント: HTMLのDOMが完全に読み込まれた後に実行を保証
document.addEventListener('DOMContentLoaded', initializeApp);
