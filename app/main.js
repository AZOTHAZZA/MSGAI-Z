// app/main.js

import { attachEventHandlers } from './handler.js';
import * as UI from './fusionui.js';

// 修正: core_api.jsではなく、foundationとarithmosを直接インポート
import { getCurrentStateJson } from '../core/foundation.js'; 
import { LogosTension, ControlMatrix } from '../core/arithmos.js';

function initializeApp() {
    try {
        // JS Coreの初期状態を取得
        const initialStateJson = getCurrentStateJson();
        const initialState = JSON.parse(initialStateJson);
        
        // 制御パラメータ (I/R) の計算ロジックをmain.js内で実行
        const tension = new LogosTension(initialState.tension_level);
        const matrix = new ControlMatrix(tension);
        
        const matrixData = {
            intensity: matrix.intensity,
            rigor: matrix.rigor
        };

        // 初期UIの描画
        UI.updateUI(initialState, null, matrixData);

        // イベントハンドラのアタッチ
        attachEventHandlers();
        
    } catch (e) {
        console.error("Failed to initialize MSGAI Pure Core:", e);
        alert(`システムコアの起動に失敗しました。詳細: ${e.message}`);
    }
}

initializeApp();
