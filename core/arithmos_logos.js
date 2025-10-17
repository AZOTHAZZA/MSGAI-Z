// core/arithmos.js

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
        this.rigor = Math.sqrt(t);               // 厳密性 (R): 緊張度が高いほど高い
    }
}
