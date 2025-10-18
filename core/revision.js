// core/revision.js

import { getCurrentState, updateState } from './foundation.js';
import { calculateTension } from './ai_control.js';
import { LogosTension } from './arithmos.js';
import { TensionEvent } from './silence.js';

/**
 * 緊張度に基づき、自律的な自己修正（リビジョン）を開始する。
 */
export function initiateAutonomousRevision() {
    const state = getCurrentState();
    const currentTension = new LogosTension(state.tension_level);
    const tension = currentTension.getValue();
    
    // 緊張度が高く、かつ条件が満たされた場合にトリガー（ここでは簡易的な模擬）
    if (tension >= 0.8 && Math.random() > 0.6) {
        
        // 1. 緊張度の強制リセット（沈黙によるコスト）
        const newTension = calculateTension(currentTension, TensionEvent.LogosSilence);
        state.tension_level = newTension.getValue();

        // 2. 修正内容の決定
        const revisionType = "Parameter Optimization";

        state.status_message = `🔄 自律的修正完了。${revisionType}を最適化。`;
        state.last_act = "Autonomous Revision";
        
        updateState(state);
        
        // 中立的なメッセージを返す
        return `システムが自律的に内部構成を修正し、${revisionType}へシフトしました。現在のセキュリティレベル: ${state.tension_level.toFixed(2)}`;

    } else {
        throw new Error("自己修正の条件が満たされていません。");
    }
}
