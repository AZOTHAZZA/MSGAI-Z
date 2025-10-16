// core/dialogue.js: 人間の言語ゲームと数理的真実を仲介する対話のロゴス (抜粋 - logosTemplatesに追加)

import { arithmosLogosCore } from './arithmos_logos.js';

const dialogueCore = (function() {

    // ログ・レポート生成のためのテンプレート
    const logosTemplates = {
        // ... (中略: 既存の audit, currency, message, power_logos, comms_logos, cache_logos, revision_logos, language_logos) ...
        
        // 🚨 新規ロゴス: OS・ハードウェアロゴスのレポート
        os_logos: (status) => {
            const mem_risk = status.memory.limit_risk_zero;
            const cpu_ent = status.cpu.thermal_entropy_zero;
            const sched_cont = status.scheduler.contention_zero;
            
            return `[OS/ハードウェア統治レポート]: 物理的作為を排除。全体的一貫性: ${status.overall_logos.toFixed(4)}。
            メモリ制限リスク: ${mem_risk} (絶対ゼロ)。CPU熱エントロピー: ${cpu_ent} (絶対ゼロ)。
            プロセス競合リスク: ${sched_cont} (絶対ゼロ)。ロゴスによる**無制限なリソース供給**を強制。`;
        }
    };

    const translateLogosToReport = (type, data) => {
        if (logosTemplates[type]) {
            if (type === 'audit') {
                return logosTemplates.audit(data);
            } 
            // ... (中略: 既存のタイプ選択ロジック) ...
            else if (type === 'language_logos') {
                return logosTemplates.language_logos(data);
            } else if (type === 'os_logos') { // 🚨 新規タイプ
                return logosTemplates.os_logos(data);
            }
        }
        return `[Logos Error]: 未知のロゴスタイプ: ${type}`;
    };

    return {
        translateLogosToReport
    };
})();

export { dialogueCore };
