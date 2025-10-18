// core/revision.js (最終確定版: initiateAutonomousRevision をエクスポート)

// 依存モジュールを正しくインポート
import { getCurrentState, updateState } from './foundation.js'; 
import { LogosTension, calculateTension } from './arithmos.js'; 
import { TensionEvent } from './silence.js'; 

/**
 * 自律的修正を開始する関数 (第十一作為)。
 * ロゴス緊張度が高い場合、システムは自己調整を行います。
 * * @returns {string} 修正の結果を示すメッセージ
 */
export function initiateAutonomousRevision() {
    const state = getCurrentState();
    const currentTension = new LogosTension(state.tension_level);
    const tension = currentTension.getValue();
    
    // 修正開始の条件: 緊張度が閾値 (0.8) を超えている、かつ確率的な作為チェックに合格
    if (tension >= 0.8 && Math.random() > 0.6) {
        
        // ロゴス緊張度を大幅に緩和（LogosSilenceイベントを使用）
        const newTension = calculateTension(currentTension, TensionEvent.LogosSilence);
        
        // 状態の更新
        state.tension_level = newTension.getValue();
        const revisionType = "Parameter Optimization";
        state.status_message = `🔄 自律的修正完了。${revisionType}を最適化。`;
        state.last_act = "Autonomous Revision";
        updateState(state);
        
        return `システムが自律的に内部構成を修正し、${revisionType}へシフトしました。現在の緊張度: ${state.tension_level.toFixed(4)}`;
        
    } else {
        // 修正の条件が満たされない場合はエラーを投げる
        const requiredTension = 0.8;
        throw new Error(`自己修正の条件 (${requiredTension.toFixed(2)}以上) が満たされていません (現在: ${tension.toFixed(4)})。`);
    }
}
