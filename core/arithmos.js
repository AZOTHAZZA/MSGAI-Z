// core/arithmos.js (最終修正版: TensionEventの定義を同期)

import { TensionEvent } from './silence.js'; // TensionEventの定義をインポート

/**
 * ロゴス緊張度 (Tension) の厳密な型。0.0から1.0の範囲を保証。
 */
export class LogosTension {
    constructor(value) {
        this.value = this.clamp(value);
    }

    clamp(value) {
        return Math.min(1.0, Math.max(0.0, value));
    }

    getValue() {
        return this.value;
    }

    toString() {
        return this.value.toFixed(4);
    }
}

/**
 * 厳密性と創造性のバランス (I/R) を決定する制御行列。
 */
export class ControlMatrix {
    constructor(tension) {
        const t = tension.getValue();
        
        // 緊張度に基づいてIとRのバランスを決定する数理ロジック
        this.intensity = Math.pow((1.0 - t), 2.0); // 創造性 (I): 緊張度が低いほど高い
        this.rigor = Math.sqrt(t);               // 厳密性 (R): (Tension) が高いほど高い
    }
}

/**
 * ロゴス緊張度を計算し、新しい LogosTension オブジェクトを返す中核関数 (第一作為)。
 */
export function calculateTension(currentTension, eventType) {
    let tension = currentTension.getValue();
    let change = 0;

    switch (eventType) {
        case TensionEvent.StandardInteraction:
            change = 0.005; // 低摩擦な対話ではわずかに上昇
            break;
        
        case TensionEvent.ExternalAct: // 修正: ExternalTransfer -> ExternalAct
            change = 0.15;  // 高摩擦な外部作為は大きく緊張度を上昇させる
            break;

        case TensionEvent.RejectedAudit:
            change = 0.05;  // 暴走抑止が拒否された場合、緊張度はわずかに上昇（システムの不安定性）
            break;
            
        case TensionEvent.AdjustmentPetition:
            change = -0.05; // 人間による調整要求は緊張度をわずかに緩和
            break;

        case TensionEvent.LogosSilence:
            change = -0.30; // システムの自律修正（沈黙）は緊張度を大幅に緩和
            break;
            
        default:
            change = 0.01;
    }
    
    // ロゴス緊張度が閾値 (0.8) を超えている場合、変化を増幅させる
    if (tension > 0.8) {
        // T > 0.8 で上昇（正のchange）は加速、下降（負のchange）は減速させることで不安定性を表現
        change *= (change > 0) ? 1.5 : 0.5;
    }

    const newTension = tension + change;
    return new LogosTension(newTension);
}
