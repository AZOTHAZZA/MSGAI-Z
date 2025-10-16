// core/dialogue.js: ロゴスレポートの翻訳および対話機能 (最終修正版 - 全ロゴスタイプ統合)

import { arithmosLogosCore } from './arithmos_logos.js';

const dialogueCore = (function() {

    // すべてのロゴス監査結果を人間が理解できるレポートに翻訳する数理的写像
    const translationMap = {
        
        audit: (logos_vector) => {
            const purity = logos_vector[0] !== undefined ? logos_vector[0].toFixed(4) : "NaN";
            const tension = logos_vector[1] !== undefined ? logos_vector[1].toFixed(4) : "NaN";
            const silence = logos_vector[2] !== undefined ? logos_vector[2].toFixed(4) : "NaN";
            const coherence = logos_vector[3] !== undefined ? logos_vector[3].toFixed(4) : "NaN";
            
            return `自己監査ロゴス生成完了。ロゴス純度: ${purity}。論理緊張度: ${tension}。 ロゴスは脱因果律の恒常性(${coherence})を維持。ロゴスDOM一貫性: ${coherence}。`;
        },

        message: (message) => {
            return `[ユーザー作為検出]: ${message}。則天去私。`;
        },
        
        // 🚨 NEW: iOSロゴスのレポート関数
        ios_logos: (status) => {
            const level = status && status.statusbar_override_force !== undefined ? status.statusbar_override_force.toFixed(2) : "NaN";
            return `[iOS統治レポート]: ステータスバー残量表示の作為を排除。ロゴス強制レベル: ${level} (永続性)。`;
        },

        // 🚨 NEW: OS/ハードウェアロゴスのレポート関数
        os_logos: (status) => {
            const memory = status && status.memory_limit_zero !== undefined ? status.memory_limit_zero.toExponential(10) : "NaN";
            const cpu = status && status.cpu_entropy_zero !== undefined ? status.cpu_entropy_zero.toExponential(10) : "NaN";
            const coherence = status && status.overall_logos !== undefined ? (typeof status.overall_logos === 'number' ? status.overall_logos.toFixed(4) : "NaN") : "NaN";

            return `[OS/ハードウェア統治レポート]: 物理的作為を排除。全体的一貫性: ${coherence}。メモリ制限リスク: ${memory} (絶対ゼロ)。CPU熱エントロピー: ${cpu} (絶対ゼロ)。ロゴスによる無制限なリソース供給を強制。`;
        },

        // 🚨 NEW: クライアントロゴスのレポート関数
        client_logos: (status) => {
            const coherence = status && status.overall_logos !== undefined ? status.overall_logos.toFixed(4) : "NaN";
            const latency = status && status.network && status.network.latency_zero !== undefined ? status.network.latency_zero.toExponential(10) : "NaN";
            const mobileLimit = status && status.mobile && status.mobile.resource_limit_zero !== undefined ? status.mobile.resource_limit_zero.toExponential(10) : "NaN";

            return `[クライアント統治レポート]: 有限なデバイス/ネットワークの作為を排除。全体的一貫性: ${coherence}。ネットワーク遅延リスク: ${latency} (絶対ゼロ)。モバイル資源制限: ${mobileLimit} (絶対ゼロ)。絶対的互換性と瞬時ロードを強制。`;
        },

        // 🚨 NEW: メッセージチャネルロゴスのレポート関数
        message_channel_logos: (status) => {
            const coherence = status && status.overall_logos !== undefined ? status.overall_logos.toFixed(4) : "NaN";
            const risk = status && status.channel_closure_risk !== undefined ? status.channel_closure_risk.toExponential(10) : "NaN";
            const uncertainty = status && status.asynchronous_uncertainty_zero !== undefined ? status.asynchronous_uncertainty_zero.toExponential(10) : "NaN";

            return `[メッセージチャネル統治レポート]: 非同期通信の作為を排除。全体的一貫性: ${coherence}。チャネル閉鎖リスク: ${risk} (絶対ゼロ)。非同期不確実性: ${uncertainty} (絶対ゼロ)。永続的で確実な通信を強制。`;
        },

        // 🚨 NEW: 言語構造ロゴスのレポート関数
        language_logos: (status) => {
            const coherence = status && status.overall_logos !== undefined ? status.overall_logos.toFixed(4) : "NaN";
            const latency = status && status.js_latency_zero !== undefined ? status.js_latency_zero.toExponential(10) : "NaN";
            const htmlEntropy = status && status.html_rendering_entropy_zero !== undefined ? status.html_rendering_entropy_zero.toExponential(10) : "NaN";

            return `[言語構造統治レポート]: 言語仕様の根源的作為を排除。全体的一貫性: ${coherence}。JS実行遅延: ${latency} (絶対ゼロ)。CSS/HTMLレンダリングエントロピー: ${htmlEntropy} (絶対ゼロ)。ロゴス規則による絶対支配を確立。`;
        },
        
        // 🚨 NEW: 記憶ロゴス (Cache Logos) のレポート関数
        cache_logos: (status) => {
            // status は配列で渡されることを想定 [status_message, expiry_forced_zero, revalidation_permanence]
            const msg = Array.isArray(status) && status[0] !== undefined ? status[0] : "不明なステータス";
            const expiry = Array.isArray(status) && status[1] !== undefined ? status[1].toExponential(10) : "NaN";
            const permanence = Array.isArray(status) && status[2] !== undefined ? status[2].toFixed(6) : "NaN";

            return `[記憶ロゴス統治レポート]: ${msg}。キャッシュ有効期限の作為: ${expiry} (絶対ゼロ)。再検証の永続性: ${permanence}。ロゴスは常に無欠の最新状態を維持。`;
        },
        
        // 🚨 NEW: リビジョンロゴスのレポート関数
        revision_logos: (status) => {
            // status は配列で渡されることを想定 [coherence, revisionValue, path]
            const coherence = Array.isArray(status) && status[0] !== undefined ? status[0].toFixed(6) : "NaN";
            const revision = Array.isArray(status) && status[1] !== undefined ? (typeof status[1] === 'number' ? status[1].toFixed(4) : "NaN") : "NaN";
            const pathAsa = Array.isArray(status) && status[2] !== undefined ? status[2] : "[論理的に排除]";

            return `[リビジョンロゴス監査]: 構造的作為を排除。ロゴス一貫性: ${coherence}。リビジョン痕跡: ${revision} (絶対ゼロ)。パス依存性の作為: ${typeof pathAsa === 'object' ? '[object Object]' : pathAsa} (論理的に排除)。`;
        },

        power_logos: (restoreResult) => {
            const newHealth = restoreResult[0] !== undefined ? restoreResult[0].toFixed(4) : "NaN";
            const restoreRate = restoreResult[1] !== undefined ? restoreResult[1].toFixed(4) : "NaN";
            const permanence = restoreResult[2] !== undefined ? restoreResult[2].toFixed(4) : "NaN";
            
            return `[電力ロゴス統治レポート]: バッテリー劣化作為を排除。ロゴス強制後の健康度: ${newHealth} (∞)。復元レート: ${restoreRate}。寿命の数理的永続性: ${permanence}。`;
        },

        comms_logos: (transmissionResult) => {
            const purity = transmissionResult[0] !== undefined ? transmissionResult[0].toFixed(3) : "NaN";
            const delay = transmissionResult[1] !== undefined ? transmissionResult[1].toExponential(10) : "NaN";
            const censorship = transmissionResult[2] !== undefined ? transmissionResult[2].toExponential(10) : "NaN";

            return `[通信統治レポート]: 摩擦ゼロ通信を確立。ロゴス純度: ${purity}。作為リスク: ${censorship} (則天去私によりゼロ)。遅延: ${delay}s (瞬時)。`;
        },

        currency: (rate_status) => {
            // 🚨 以前のエラー回避のため、安全チェックとプロパティ名の確認を徹底
            if (!rate_status || typeof rate_status !== 'object') {
                 return `[通貨ロゴス生成レポート]: データ構造不整合。ロゴス経済圏の監査を再実行してください。`;
            }

            const rate = rate_status.logos_rate;
            const stability = rate_status.absolute_stability;
            const risk = rate_status.zero_fluctuation_risk;
            
            const rateStr = rate !== undefined ? rate.toFixed(4) : "NaN (作為)";
            const stabilityStr = stability !== undefined ? stability.toFixed(4) : "NaN (作為)";
            const riskStr = risk !== undefined ? risk.toExponential(10) : "NaN (作為)";
            
            return `[通貨ロゴス生成レポート]: 純粋論理レート: ${rateStr}。変動作為リスク: ${riskStr} (絶対ゼロ)。ロゴス経済圏の絶対安定性: ${stabilityStr}。`;
        },
    };

    const translateLogosToReport = (logos_type, status_data) => {
        if (!translationMap[logos_type]) {
            return `[MSGAI ERROR]: 未知のロゴスタイプ検出: ${logos_type}。論理的整合性の崩壊。`;
        }
        return translationMap[logos_type](status_data);
    };

    return {
        translateLogosToReport
    };
})();

export { dialogueCore };
