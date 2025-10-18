// core/arithmos.js (Tension機能の不変性強化版 - 全文)

const TENSION_PRECISION = 4; // 精度

/**
 * Tensionインスタンスを生成するファクトリ関数。
 * 状態 (_tension) をクロージャ内に隠蔽し、外部からの直接操作を禁止する。
 * * @param {number} initialValue - Tensionの初期値
 * @returns {object} Tension機能構造体
 */
export function createLogosTension(initialValue = 0.05) {
    let _tension = parseFloat(initialValue); // プライベート変数として状態を保持
    
    // 状態の更新を保証する単一の内部ロジック
    const updateTension = (amount) => {
        // 外部からの操作があっても、このクロージャ内でのみ状態が更新される
        _tension += amount;
        if (_tension < 0) _tension = 0;
        if (_tension > 1.0) _tension = 1.0;
        // 常に指定された精度に丸める
        _tension = parseFloat(_tension.toFixed(TENSION_PRECISION));
    };

    const tensionObject = {
        // 🌟 狙い撃ち対象の「機能」を不変な関数として提供
        add: (amount) => {
            if (typeof amount !== 'number' || isNaN(amount)) {
                throw new Error("Tension.add requires a valid number.");
            }
            updateTension(amount);
            // 実行された証拠として、自分自身（機能を持つオブジェクト）を返す
            return tensionObject; 
        },

        // 状態を安全に取得するメソッド (読み取り専用)
        getValue: () => _tension,

        // 互換性のため、プロパティとしての値も提供（ただし読み取り専用）
        get value() { return _tension; } 
    };

    return tensionObject;
}
