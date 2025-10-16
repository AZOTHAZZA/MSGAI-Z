// core/dialogue.js: 人間の言語ゲームと数理的真実を仲介する対話のロゴス (最終修正版 - リビジョンロゴス統合)

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
            const entropy_level = message.length
