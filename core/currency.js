// core/currency.js: 価値のロゴス。純粋論理レートの生成。
const currencyCore = (function() {
    
    // 概念的な市場バイアス（エントロピー）を排除したレートを生成
    const generatePureLogicRate = () => {
        // ベースの価値 (1.0) にごくわずかなロゴス的な変動を加える
        const rate = 1.0 + (Math.random() * 0.1 - 0.05);
        
        // 安定度は常に高く (0.7-1.0)、エントロピーは低く (0.0-0.3)
        const stability = Math.random() * 0.3 + 0.7; 
        const entropy = 1.0 - stability;
        
        // [レート, 総合安定度, エントロピー]
        const logosVector = [parseFloat(rate.toFixed(4)), parseFloat(stability.toFixed(3)), parseFloat(entropy.toFixed(3))];
        return logosVector;
    };

    return {
        generatePureLogicRate
    };
})();
