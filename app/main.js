// app/main.js (擬態前・純粋JSバージョン)

import { attachEventHandlers } from './event_handler.js';
import * as CoreAPI from '../core/core_api.js';
import { executeLRPCommand } from './ui_fusion.js';
import { LRPCommand } from './protocol_lrp.js';

function initializeApp() {
    try {
        // 1. Rust側のコア初期化関数は不要。JS Coreの初期状態を取得
        const initialStateJson = CoreAPI.getCurrentStateJson();
        const initialState = JSON.parse(initialStateJson);
        
        console.log("JS Pure Core State:", initialState);
        
        // 2. 制御パラメータ (I/R) の取得
        const matrixData = CoreAPI.getControlParameters(initialState.tension_level);

        // 3. 初期UIの描画 (監査UX)
        executeLRPCommand(new LRPCommand('UpdateTension', { 
            level: initialState.tension_level,
            matrix: matrixData 
        }));
        executeLRPCommand(new LRPCommand('UpdateBalance', { balance: initialState.accounts.User_A }));
        executeLRPCommand(new LRPCommand('UpdateStatusMessage', { message: initialState.status_message }));


        // 4. イベントハンドラのアタッチ
        attachEventHandlers();
        
    } catch (e) {
        console.error("Failed to initialize MSGAI Pure Core:", e);
        alert(`システムコアの起動に失敗しました。詳細: ${e.message}`);
    }
}

initializeApp();
