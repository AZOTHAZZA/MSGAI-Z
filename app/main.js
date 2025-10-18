// app/main.js (最終修正版)

import { attachEventHandlers } from './handler.js';
import * as UI from './fusionui.js';

// 修正: core_api.jsではなく、必要なコアモジュールを直接インポート
import { getCurrentStateJson } from '../core/foundation.js'; 
import { LogosTension, ControlMatrix } from '../core/arithmos.js';

// 追加: キャッシュ排除のコアをインポート
import { cacheLogosCore } from '../core/cache_logos.js'; 

function initializeApp() {
    try {
        // 1. キャッシュ排除の作為を最初に実行 (Logosの永続性を確保)
        const cacheStatus = cacheLogosCore.applyCacheForcedInvalidation();
        console.log(`[Cache Logos Status]: ${cacheStatus.status}`);
        
        // 2. JS Coreの初期状態を取得
        const initialStateJson = getCurrentStateJson();
        const initialState = JSON.parse(initialStateJson);
        
        // 3. 制御パラメータ (I/R) の計算ロジックを実行
        const tension = new LogosTension(initialState.tension_level);
        const matrix = new ControlMatrix(tension);
        
        const matrixData = {
            intensity: matrix.intensity,
            rigor: matrix.rigor
        };

        // 4. 初期UIの描画
        UI.updateUI(initialState, null, matrixData);

        // 5. イベントハンドラのアタッチ
        attachEventHandlers();
        
    } catch (e) {
        console.error("Failed to initialize MSGAI Pure Core:", e);
        // UI上でユーザーにもエラーを通知
        alert(`システムコアの起動に失敗しました。詳細: ${e.message}`);
    }
}

initializeApp();
