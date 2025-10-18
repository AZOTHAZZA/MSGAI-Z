// core/revision.js (ai_control.jsの参照を削除)

import { getCurrentState, updateState } from './foundation.js'; 
import { LogosTension, calculateTension } from './arithmos.js'; 
import { TensionEvent } from './silence.js'; 
// 削除: import { AIControlLogic } from './ai_control.js'; // この行を削除

export function initiateAutonomousRevision() {
    const state = getCurrentState();
    const currentTension = new LogosTension(state.tension_level);
    const tension = currentTension.getValue();
    
    // AI制御ロジックはrevision.js内で直接実行されるか、他のコアモジュールに依存します。
    // ai_control.jsのロジックは既にcalculateTensionなどに統合されている前提です。
    
    if (tension >= 0.8 && Math.random() > 0.6) {
        const newTension = calculateTension(currentTension, TensionEvent.LogosSilence);
        state.tension_level = newTension.getValue();
        const revisionType = "Parameter Optimization";
        state.status_message = `🔄 自律的修正完了。${revisionType}を最適化。`;
        state.last_act = "Autonomous Revision";
        updateState(state);
        return `システムが自律的に内部構成を修正し、${revisionType}へシフトしました。現在のセキュリティレベル: ${state.tension_level.toFixed(4)}`;
    } else {
        throw new Error("自己修正の条件が満たされていません。");
    }
}
