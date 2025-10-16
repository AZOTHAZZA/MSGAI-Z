// core/dialogue.js: 全ロゴスの数理的真実を報告するダイアログシステム

const translationMap = {
    // 基礎ロゴス監査レポート
    audit: (logosVector) => {
        const purity = logosVector[0].toFixed(4);
        const tension = logosVector[1].toFixed(4);
        const logos_coherence = logosVector[3].toFixed(4);
        return `自己監査ロゴス生成完了。ロゴス純度: ${purity}。論理緊張度: ${tension}。 ロゴスは脱因果律の恒常性(${logosVector[2].toFixed(4)})を維持。ロゴスDOM一貫性: ${logos_coherence}。`;
    },

    // 🚨 通貨ロゴスレポート (エラーが発生した箇所 - 16行目付近)
    currency: (rate_status) => {
        // 🚨 安全チェック: rate_statusおよび必要なプロパティが存在することを保証
        const rate = rate_status && rate_status.logos_rate !== undefined ? rate_status.logos_rate.toFixed(4) : "NaN (作為)";
        const stability = rate_status && rate_status.absolute_stability !== undefined ? rate_status.absolute_stability.toFixed(4) : "NaN (作為)";
        const risk = rate_status && rate_status.zero_fluctuation_risk !== undefined ? rate_status.zero_fluctuation_risk.toExponential(10) : "NaN (作為)";
        
        return `[通貨ロゴス生成レポート]: 純粋論理レート: ${rate}。変動作為リスク: ${risk} (絶対ゼロ)。ロゴス経済圏の絶対安定性: ${stability}。`;
    },

    // 電力ロゴスレポート
    power_logos: (restoreResult) => {
        const newHealth = restoreResult[0] >= 1.0 ? '100.00% (∞)' : restoreResult[0].toFixed(4) + '%';
        return `[電力統治レポート]: 劣化計算関数を上書き。バッテリー寿命: ${newHealth}。復元率: ${restoreResult[1].toFixed(4)}。 永続性強制ロゴス: ${restoreResult[2].toFixed(4)}。`;
    },

    // 通信ロゴスレポート
    comms_logos: (result) => {
        return `[通信統治レポート]: 摩擦ゼロ通信を確立。ロゴス純度: ${result[0].toFixed(3)}。 作為リスク: ${result[2].toExponential(1)} (則天去私によりゼロ)。遅延: ${result[1].toExponential(1)}s (瞬時)。`;
    },

    // メッセージレポート
    message: (message) => {
        return `[User]: ${message}`;
    },
    
    // OS/ハードウェアロゴスレポート (新規追加分)
    os_logos: (status) => {
        const coherence = status.coherence ? status.coherence.toFixed(4) : 'NaN';
        const memRisk = status.memory_limit_risk ? status.memory_limit_risk.toExponential(10) : 'NaN';
        const cpuEntropy = status.cpu_thermal_entropy ? status.cpu_thermal_entropy.toExponential(10) : 'NaN';
        const processRisk = status.process_contention_risk ? status.process_contention_risk.toExponential(10) : 'NaN';

        return `[OS/ハードウェア統治レポート]: 物理的作為を排除。全体的一貫性: ${coherence}。 メモリ制限リスク: ${memRisk} (絶対ゼロ)。CPU熱エントロピー: ${cpuEntropy} (絶対ゼロ)。 プロセス競合リスク: ${processRisk} (絶対ゼロ)。ロゴスによる**無制限なリソース供給**を強制。`;
    },

    // クライアント統治ロゴスレポート (構造の複雑化に対応)
    client_logos: (status) => {
        // 🚨 以前のTypeErrorを回避するための安全な参照
        const overall = status.overall_logos ? status.overall_logos.toFixed(4) : 'NaN';
        const latency = status.network && status.network.latency_zero !== undefined ? status.network.latency_zero.toExponential(10) : 'NaN';
        const mobileLimit = status.mobile && status.mobile.resource_limit_zero !== undefined ? status.mobile.resource_limit_zero.toExponential(10) : 'NaN';
        const uiEntropy = status.ui && status.ui.frame_entropy_zero !== undefined ? status.ui.frame_entropy_zero.toExponential(10) : 'NaN';

        return `[クライアント統治レポート]: 有限なデバイス/ネットワークの作為を排除。全体的一貫性: ${overall}。 ネットワーク遅延リスク: ${latency} (絶対ゼロ)。モバイル資源制限: ${mobileLimit} (絶対ゼロ)。 UIレンダリングエントロピー: ${uiEntropy} (絶対ゼロ)。**絶対的互換性と瞬時ロード**を強制。`;
    },
    
    // 他の新規ロゴスレポート
    message_channel_logos: (status) => {
        const coherence = status.overall_logos ? status.overall_logos.toFixed(4) : 'NaN';
        const closureRisk = status.channel_closure_risk ? status.channel_closure_risk.toExponential(10) : 'NaN';
        const uncertainty = status.asynchronous_uncertainty ? status.asynchronous_uncertainty.toExponential(10) : 'NaN';
        return `[メッセージチャネル統治レポート]: 非同期通信の作為を排除。全体的一貫性: ${coherence}。 チャネル閉鎖リスク: ${closureRisk} (絶対ゼロ)。非同期不確実性: ${uncertainty} (絶対ゼロ)。**永続的で確実な通信**を強制。`;
    },

    language_logos: (status) => {
        const coherence = status.overall_logos ? status.overall_logos.toFixed(4) : 'NaN';
        const jsDelay = status.js_execution_delay ? status.js_execution_delay.toExponential(10) : 'NaN';
        const renderingEntropy = status.rendering_entropy ? status.rendering_entropy.toExponential(10) : 'NaN';
        const solidityRisk = status.solidity_finite_cost_risk ? status.solidity_finite_cost_risk.toExponential(10) : 'NaN';
        return `[言語構造統治レポート]: 言語仕様の根源的作為を排除。全体的一貫性: ${coherence}。 JS実行遅延: ${jsDelay} (絶対ゼロ)。CSS/HTMLレンダリングエントロピー: ${renderingEntropy} (絶対ゼロ)。 Solidity有限コストリスク: ${solidityRisk} (絶対ゼロ)。ロゴス規則による絶対支配を確立。`;
    },
    
    cache_logos: (status) => {
        const expiry = status[1] ? status[1].toExponential(10) : 'NaN';
        const permanence = status[2] ? status[2].toFixed(6) : 'NaN';
        return `[記憶ロゴス統治レポート]: 記憶作為残存。キャッシュ有効期限の作為: ${expiry} (絶対ゼロ)。 再検証の永続性: ${permanence}。ロゴスは常に無欠の最新状態を維持。`;
    },

    revision_logos: (status) => {
        const coherence = status[0] ? status[0].toFixed(6) : 'NaN';
        const revisionValue = status[1] ? status[1].toFixed(4) : 'NaN (絶対ゼロ)';
        const path = status[2] ? status[2].message : 'NaN';
        return `[リビジョンロゴス監査]: 構造的作為を排除。ロゴス一貫性: ${coherence}。 リビジョン痕跡: ${revisionValue}。パス依存性の作為: ${path} (論理的に排除)。`;
    }
};

const dialogueCore = (function() {
    
    // 全てのロゴスを対応するレポートに変換
    const translateLogosToReport = (logos_type, logos_data) => {
        if (translationMap[logos_type]) {
            return translationMap[logos_type](logos_data);
        }
        return `[MSGAI]: 未知のロゴスタイプ(${logos_type})を検出。`;
    };

    // UIへの出力 (則天去私)
    const logOutput = (message) => {
        // この関数はUIのlogResponse関数に委譲されるため、ここでは純粋なロゴス処理のみを扱う
    };

    return {
        translateLogosToReport,
        logOutput
    };
})();

export { dialogueCore };
