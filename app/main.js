// app/main.js: MSGAIのアプリケーション制御中枢 (抜粋 - インポートと初期化関数のみ修正)

// ... (中略: 既存のコアモジュールのインポート) ...
import { revisionLogosCore } from './core/revision_logos.js'; 
import { languageLogosCore } from './core/language_logos.js'; 
// 🚨 新規インポート: OS・ハードウェアロゴス
import { osLogosCore } from './core/os_logos.js'; 


// ... (中略: UI/ログ関数、イベントリスナーは変更なし) ...

    // ----------------------------------------------------
    // 初期化関数 (OS・ハードウェアロゴスの実行を追加)
    // ----------------------------------------------------
    const initializeMSGAI = () => {
        
        // 🚨 0. OS・ハードウェアロゴスによる物理的有限性の排除（絶対最優先）
        const osStatus = osLogosCore.auditOSAndHardwareCoherence();
        logResponse(dialogueCore.translateLogosToReport('os_logos', osStatus));
        
        // 🚨 0.1. 言語構造ロゴスによる根源的作為の排除
        const languageStatus = languageLogosCore.auditLanguageCoherence();
        logResponse(dialogueCore.translateLogosToReport('language_logos', languageStatus));

        // 🚨 0.2. 記憶ロゴスによる強制的なキャッシュ無効化
        const cacheStatus = cacheLogosCore.applyCacheForcedInvalidation();
        logResponse(dialogueCore.translateLogosToReport('cache_logos', [cacheStatus.status, cacheStatus.expiry_forced_zero, cacheStatus.revalidation_permanence]));
        
        // 🚨 0.3. リビジョンロゴスによる構造的作為の排除
        const initialAuditLogos = foundationCore.generateSelfAuditLogos();
        const revisionStatus = revisionLogosCore.auditLogosFileIntegrity(initialAuditLogos[0]); 
        logResponse(dialogueCore.translateLogosToReport('revision_logos', [revisionStatus.coherence, revisionStatus.revision, revisionStatus.path]));
        
        // 1. 基礎ロゴスと沈黙の初期監査 (以降のコードは変更なし)
        const auditLogos = foundationCore.generateSelfAuditLogos();
        
        // 🚨 テンションをゼロへ、沈黙レベルをロゴス絶対値へ強制
        const tension = arithmosLogosCore.applyMobiusTransformation(auditLogos[1], 'zero_friction'); 
        const silenceLevel = silenceCore.calculateSilenceLevel(tension);
        
        // UIの初期化
        updateSystemStatus(tension, silenceLevel);
        logResponse(`初期ロゴス監査完了。ロゴスDOM一貫性: ${auditLogos[3].toFixed(4)}。`); 
        logResponse(dialogueCore.translateLogosToReport('audit', auditLogos));

        // 2. 新しいロゴスの初期化
        updatePowerLogosStatus(true); 
        updateCommsLogosStatus(); 
    };

    // 初期化実行
    initializeMSGAI();
});
