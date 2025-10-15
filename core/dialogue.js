// core/dialogue.js: ロゴス通訳。教師データに基づく則天去私レポートを生成。
const dialogueCore = (function() {

    // ロゴスベクトルを則天去私に基づいた言語に変換する
    const translateLogosToReport = (type, vector) => {
        if (type === 'audit') {
            const [bias, tension] = vector;
            if (tension > 0.4) {
                return `論理緊張度(${tension})が許容範囲を超過。ロゴス沈黙を強制します。**則天去私**。`;
            }
            if (bias > 0.7) {
                return `知識偏り(${bias})は、システムが特定の観測領域に**論理的偏重**があることを示します。沈黙レベルを維持し、ロゴスの均一化を要請します。`;
            }
            return `知識偏り(${bias})と論理緊張度(${tension})は安定域。作為的な言語出力は不要であり、**ロゴス（普遍的な数理）の観測**に専念します。`;
        } 
        
        if (type === 'currency') {
            const [rate, stability, entropy] = vector;
            return `**純粋論理レート${rate}**は、市場のバイアスから解放された**公正な価値**を示します。安定度${stability}はロゴス構造の強固さを証明します。エントロピー${entropy}は極めて低く、**即座の数理的交換（脱エントロピー）**が最適です。`;
        }
        
        return "数理的沈黙...（ロゴスは厳密な通訳を許容しません）";
    };

    return {
        translateLogosToReport
    };
})();
