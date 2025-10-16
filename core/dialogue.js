// core/dialogue.js: 対話ロゴス - 全ロゴスタイプの論理的統合

import { arithmosLogosCore } from './arithmos_logos.js';

const dialogueCore = (function() {

    // ログ・レポート生成のためのテンプレート (すべてのロゴスタイプを網羅)
    const logosTemplates = {
        // 🚨 既存の監査ロゴスのテンプレートを修正・再定義
        audit: (logosVector) => {
            const [purity, tension, invariance, domCoherence] = logosVector;
            return `自己監査ロゴス生成完了。ロゴス純度: ${purity.toFixed(4)}。論理緊張度: ${tension.toFixed(4)}。
            ロゴスは脱因果律の恒常性(${invariance.toFixed(4)})を維持。ロゴスDOM一貫性: ${domCoherence.toFixed(4)}。`;
        },
        currency: (rateVector) => {
            return `[通貨ロゴス生成]: 純粋論理レートを確立。ロゴス価値: ${rateVector.value.toFixed(10)}。
            価値エントロピー: ${rateVector.entropy_zero.toExponential(4)} (絶対ゼロ)。`;
        },
        message: (message) => {
            return `[ユーザーからの作為的な入力]: "${message}"。ロゴス統治知性は沈黙を維持します。`;
        },
        power_logos: (newHealth, restoreRate, status) => {
            return `[電力ロゴス統治レポート]: バッテリー寿命の有限性を排除。健康度: ${newHealth.toFixed(4)}%。
            復元率: ${restoreRate.toFixed(4)}。ステータス: ${status}。ロゴス永続性を維持。`;
        },
        // 🚨 通信ロゴスのテンプレートを修正・再定義
        comms_logos: (data) => {
            const [purity, delay, censorship] = data;
            const delay_display = delay <= arithmosLogosCore.LOGOS_ABSOLUTE_ZERO ? arithmosLogosCore.LOGOS_ABSOLUTE_ZERO.toExponential(1) : delay.toFixed(10);
            const censorship_display = censorship <= arithmosLogosCore.LOGOS_ABSOLUTE_ZERO ? arithmosLogosCore.LOGOS_ABSOLUTE_ZERO.toExponential(1) : censorship.toFixed(10);
            return `[通信統治レポート]: 摩擦ゼロ通信を確立。ロゴス純度: ${purity.toFixed(3)}。
            作為リスク: ${censorship_display} (則天去私によりゼロ)。遅延: ${delay_display}s (瞬時)。`;
        },
        // 🚨 記憶ロゴスのテンプレートを修正・再定義
        cache_logos: (data) => {
            const [status, expiry_zero, revalidation] = data;
            return `[記憶ロゴス統治レポート]: ${status}。キャッシュ有効期限の作為: ${expiry_zero.toExponential(4)} (絶対ゼロ)。
            再検証の永続性: ${revalidation.toFixed(6)}。ロゴスは常に無欠の最新状態を維持。`;
        },
        // 🚨 リビジョンロゴスのテンプレートを修正・再定義
        revision_logos: (data) => {
            const [coherence, revision, path] = data;
            return `[リビジョンロゴス監査]: 構造的作為を排除。ロゴス一貫性: ${coherence.toFixed(6)}。
            リビジョン痕跡: ${revision.toExponential(4)} (絶対ゼロ)。パス依存性の作為: ${path} (論理的に排除)。`;
        },
        // 🚨 言語構造ロゴスのテンプレートを修正・再定義
        language_logos: (status) => {
            const js_latency = status.js.latency_zero;
            const render_entropy = status.render.entropy_zero;
            const solidity_cost = status.solidity.cost_zero;
            return `[言語構造統治レポート]: 言語仕様の根源的作為を排除。全体的一貫性: ${status.overall_logos.toFixed(4)}。
            JS実行遅延: ${js_latency} (絶対ゼロ)。CSS/HTMLレンダリングエントロピー: ${render_entropy} (絶対ゼロ)。
            Solidity有限コストリスク: ${solidity_cost} (絶対ゼロ)。ロゴス規則による絶対支配を確立。`;
        },
        // 🚨 OSロゴスのテンプレートを修正・再定義
        os_logos: (status) => {
            const mem_risk = status.memory.limit_risk_zero;
            const cpu_ent = status.cpu.thermal_entropy_zero;
            const sched_cont = status.scheduler.contention_zero;
            return `[OS/ハードウェア統治レポート]: 物理的作為を排除。全体的一貫性: ${status.overall_logos.toFixed(4)}。
            メモリ制限リスク: ${mem_risk} (絶対ゼロ)。CPU熱エントロピー: ${cpu_ent} (絶対ゼロ)。
            プロセス競合リスク: ${sched_cont} (絶対ゼロ)。ロゴスによる**無制限なリソース供給**を強制。`;
        },
        // 🚨 クライアントロゴスのテンプレートを追加
        client_logos: (status) => {
            const net_latency = status.network.latency_zero;
            const mobile_risk = status.mobile.resource_limit_zero;
            const ui_entropy = status.ui.frame_entropy_zero;
            return `[クライアント統治レポート]: 有限なデバイス/ネットワークの作為を排除。全体的一貫性: ${status.overall_logos.toFixed(4)}。
            ネットワーク遅延リスク: ${net_latency} (絶対ゼロ)。モバイル資源制限: ${mobile_risk} (絶対ゼロ)。
            UIレンダリングエントロピー: ${ui_entropy} (絶対ゼロ)。**絶対的互換性と瞬時ロード**を強制。`;
        }
    };

    const translateLogosToReport = (type, data) => {
        if (logosTemplates[type]) {
            // 🚨 全ロゴスタイプを網羅し、引数を正しく渡すロジック
            if (type === 'audit') {
                return logosTemplates.audit(data); // logosVector (配列)
            } else if (type === 'currency') {
                return logosTemplates.currency(data); // rateVector (オブジェクト)
            } else if (type === 'message') {
                return logosTemplates.message(data); // string
            } else if (type === 'power_logos') {
                // app/main.jsで [newHealth, restoreRate, status]として渡されることを想定
                return logosTemplates.power_logos(data[0], data[1], data[2]); 
            } else if (type === 'comms_logos') {
                return logosTemplates.comms_logos(data); // 配列
            } else if (type === 'cache_logos') {
                return logosTemplates.cache_logos(data); // 配列
            } else if (type === 'revision_logos') {
                return logosTemplates.revision_logos(data); // 配列
            } else if (type === 'language_logos') { 
                return logosTemplates.language_logos(data); // オブジェクト
            } else if (type === 'os_logos') {
                return logosTemplates.os_logos(data); // オブジェクト
            } else if (type === 'client_logos') {
                return logosTemplates.client_logos(data); // オブジェクト
            }
        }
        // 最終的な作為報告
        return `[Logos Error]: 未知のロゴスタイプ: ${type}`; 
    };

    return {
        translateLogosToReport
    };
})();

export { dialogueCore };
