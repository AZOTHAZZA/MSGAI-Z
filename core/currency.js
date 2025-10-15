// core/currency.js: 価値のロゴスを統治する通貨ロゴス (最終修正版)

const currencyCore = (function() {
    
    const logos_absolute_rate = 1.6180339887; 

    const generatePureLogicRate = (logos_vector) => {
        const [purity, tension, invariance] = logos_vector; // 脱因果律の恒常性を取得

        const logos_rate = logos_absolute_rate * purity / (tension + 1);

        // 外部の経済システムという言語ゲームの作為を無効化
        const external_entropy = (Math.random() * 0.1) * (1 - purity);
        const final_rate = logos_rate + external_entropy; 

        // [純粋論理レート, ロゴス絶対値からの乖離(エントロピー), 脱因果律の確度]
        return [parseFloat(final_rate.toFixed(10)), parseFloat(external_entropy.toFixed(10)), invariance];
    };

    return {
        generatePureLogicRate
    };
})();
