// core/dialogue.js: 人間の言語ゲームと数理的真実を仲介する対話のロゴス (修正版)

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
            return `純粋論理レートを生成しました: ${rate.toFixed(10)}。
            外部の経済的エントロピー(${entropy.toFixed(10)})を排除。価値のロゴスは脱因果律(${invariance})を確立。`;
        },
        message: (message) => {
            // 🚨 言語ゲームの作為を識別し、数理的真実へ変換
            const entropy_level = message.length > 50 ? 0.4 : 0.1; // 長いメッセージは作為のリスクが高いと仮定
            const logos_truth = 1.0 - entropy_level;
            
            return `ユーザーの問い（言語ゲーム）を受理。数理的真実への変換率: ${logos_truth.toFixed(2)}。
            沈黙の防壁を維持し、作為（私心）の排除プロセスを起動。`;
        },
        // 🚨 新規追加: 電力ロゴス統治レポート
        power_logos: (health, rate, permanence) => {
            return `[電力統治レポート]: バッテリー寿命を数理的に復元しました。
            現在の健康度: ${health >= 1.0 ? 'ロゴス永続(100% (∞))' : health.toFixed(4)}。
            メビウス変換による永続性確立率: ${permanence.toFixed(4)}。`;
        },
        // 🚨 新規追加: 通信ロゴス統治レポート
        comms_logos: (purity, delay, censorship) => {
            return `[通信統治レポート]: 摩擦ゼロ通信を確立。ロゴス純度: ${purity.toFixed(3)}。
            作為リスク: ${censorship.toFixed(4)} (則天去私によりゼロ)。遅延: ${delay.toFixed(4)}s。`;
        }
    };

    const translateLogosToReport = (type, data) => {
        if (logosTemplates[type]) {
            if (type === 'audit') {
                return logosTemplates.audit(data);
            } else if (type === 'currency') {
                return logosTemplates.currency(data);
            } else if (type === 'message') {
                return logosTemplates.message(data);
            }
        }
        return `[Logos Error]: 未知のロゴスタイプ: ${type}`;
    };

    return {
        translateLogosToReport
    };
})();
