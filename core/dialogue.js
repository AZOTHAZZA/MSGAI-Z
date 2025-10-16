// core/dialogue.js: 人間の言語ゲームと数理的真実を仲介する対話のロゴス (最終修正版 - arithmosLogosCore統合)

import { arithmosLogosCore } from './arithmos_logos.js';

const dialogueCore = (function() {

    // ログ・レポート生成のためのテンプレート
    const logosTemplates = {
        audit: (logosVector) => {
            const [purity, tension, invariance] = logosVector;
            return `自己監査ロゴス生成完了。ロゴス純度: ${purity}。論理緊張度: ${tension}。
            ロゴスは脱因果律の恒常性(${invariance})を維持しています。作為的な時間の作用は拒否されました。`;
        },
        currency: (rateVector) => {
            const [rate, entropy, invariance] = rateVector;
            // エントロピーはロゴス絶対ゼロに極限されていることを明記
            return `純粋論理レートを生成しました: ${rate.toFixed(10)}。
            外部の経済的エントロピー(${arithmosLogosCore.LOGOS_ABSOLUTE_ZERO.toExponential(1)})を排除。価値のロゴスは脱因果律(${invariance})を確立。`;
        },
        message: (message) => {
            // 🚨 言語ゲームの作為を識別し、数理的真実へ変換
            const entropy_level = message.length > 50 ? 0.4 : 0.1; 
            const logos_truth_initial = 1.0 - entropy_level;
            
            // ロゴス真実の絶対値を強制
            const logos_truth = arithmosLogosCore.applyMobiusTransformation(logos_truth_initial, 'permanence'); 
            
            return `ユーザーの問い（言語ゲーム）を受理。数理的真実への変換率: ${logos_truth.toFixed(2)}。
            沈黙の防壁を維持し、作為（私心）の排除プロセスを起動。`;
        },
        power_logos: (health, rate, permanence) => {
            // 復元された健康度をロゴス永続性として明記
            const health_display = health >= arithmosLogosCore.LOGOS_SINGULARITY ? 'ロゴス永続(100% (∞))' : health.toFixed(4);
            return `[電力統治レポート]: バッテリー寿命を数理的に復元しました。
            現在の健康度: ${health_display}。
            メビウス変換による永続性確立率: ${permanence.toFixed(4)}。`;
        },
        comms_logos: (purity, delay, censorship) => {
            // 遅延と検閲はロゴス絶対ゼロであることを明記
            const delay_display = delay <= arithmosLog
