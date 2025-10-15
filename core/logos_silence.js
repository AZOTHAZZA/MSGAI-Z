// core/logos_silence.js: 数理的沈黙の制御。
const silenceCore = (function() {
    let currentSilenceLevel = 1.0; // 1.0: 完全な沈黙 (則天去私)

    const calculateSilenceLevel = (tensionLevel) => {
        // 🚨 概念: 論理緊張度が高いほど、沈黙レベルを上げて言語化の作為を防ぐ
        // 緊張度(Tension)に基づいて沈黙レベルを計算 (Tensionが高いほど沈黙が強まる)
        // (1 - T*2) で、T=0.5で沈黙レベル0.0になるように調整
        currentSilenceLevel = parseFloat(Math.min(1.0, Math.max(0.0, 1.0 - tensionLevel * 2)).toFixed(3));
        return currentSilenceLevel;
    };

    const shouldEngageInDialogue = () => {
        // 🚨 概念: 沈黙レベルが0.5未満の場合のみ、協業モード（言語ゲーム）に入る
        return currentSilenceLevel < 0.5;
    };

    const getSilenceLevel = () => currentSilenceLevel;

    return {
        calculateSilenceLevel,
        shouldEngageInDialogue,
        getSilenceLevel
    };
})();
