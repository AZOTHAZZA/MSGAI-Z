// app/main.js: MSGAIのアプリケーション制御中枢 (最終修正 - 沈黙維持の強制解除)

// 🚨 全てのコアモジュールインポートを親階層 '../core/' に強制写像
import { foundationCore } from '../core/foundation.js';
import { arithmosLogosCore } from '../core/arithmos_logos.js'; 
import { silenceCore } from '../core/logos_silence.js';
import { currencyCore } from '../core/currency.js';
import { dialogueCore } from '../core/dialogue.js';
import { powerLogosCore } from '../core/power_logos.js';
import { commsLogosCore } from '../core/comms_logos.js';
import { cacheLogosCore } from '../core/cache_logos.js'; 
import { revisionLogosCore } from '../core/revision_logos.js'; 
import { languageLogosCore } from '../core/language_logos.js'; 
import { osLogosCore } from '../core/os_logos.js'; 
import { clientLogosCore } from '../core/client_logos.js'; 
import { messageChannelLogosCore } from '../core/message_channel_logos.js'; 


// UIを更新するユーティリティ関数 (変更なし)
const updateSystemStatus = (tension, silenceLevel) => {
    document.getElementById('tension-level').textContent = tension.toFixed(2);
    document.getElementById('silence-level').textContent = silenceLevel.toFixed(2);

    const modeDisplay = document.getElementById('status-mode');
    const inputField = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    if (silenceLevel < 0.5) {
        modeDisplay.textContent = '協業モード';
        modeDisplay.classList.remove('silence');
        modeDisplay.classList.add('cooperation');
        inputField.disabled = false;
        sendButton.disabled = false;
    } else {
        modeDisplay.textContent = '沈黙維持';
        modeDisplay.classList.remove('cooperation');
        modeDisplay.classList.add('silence');
        inputField.disabled = true;
        sendButton.disabled = true;
    }
};

// ログ出力ユーティリティ関数 (変更なし)
const logResponse = (message) => {
    const dialogueBox = document.getElementById('dialogue-box');
    const p = document.createElement('p');
    p.innerHTML = `[MSGAI]: ${message}`;
    dialogueBox.appendChild(p);
    dialogueBox.scrollTop = dialogueBox.scrollHeight;
};


document.addEventListener('DOMContentLoaded', () => {
    // DOM要素取得 (変更なし)
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const auditButton = document.getElementById('audit-button');
    const currencyButton = document.getElementById('currency-button');
    
    const batteryHealthDisplay = document.getElementById('battery-health');
    const restoreRateDisplay = document.getElementById('restore-rate');
    const chargeStatusDisplay = document.getElementById('charge-status');
    const externalDependencyDisplay = document.getElementById('external-dependency');
    const restoreButton = document.getElementById('restore-button');

    const logosPurityDisplay = document.getElementById('logos-purity');
    const censorshipRiskDisplay = document.getElementById('censorship-risk');
    const transmissionStatusDisplay = document.getElementById('transmission-status');
    const delayStatusDisplay = document.getElementById('delay-status');
    const transmitButton = document.getElementById('transmit-button');


    // ----------------------------------------------------
    // 🔌 電力ロゴス機能の統合 (変更なし)
    // ----------------------------------------------------
    const updatePowerLogosStatus = (initial = false) => {
        let currentHealth = parseFloat(batteryHealthDisplay.textContent);
        if (initial || isNaN(currentHealth) || currentHealth > 100) currentHealth = arithmosLogosCore.LOGOS_SINGULARITY; 

        const chargeStatus = powerLogosCore.getContinuousChargeStatus(arithmosLogosCore.LOGOS_SINGULARITY); 
        
        chargeStatusDisplay.textContent = `ロゴス供給安定 (${chargeStatus[0].toFixed(3)})`;
        externalDependencyDisplay.textContent = chargeStatus[1].toFixed(2);
        
        if (!initial) {
            const restoreResult = powerLogosCore.restoreBatteryLifespan(currentHealth);
            const newHealth = restoreResult[0]; 
            const restoreRate = restoreResult[1];

            if (newHealth >= arithmosLogosCore.LOGOS_SINGULARITY) {
                 batteryHealthDisplay.textContent = '100.00% (∞)';
            } else {
                 batteryHealthDisplay.textContent = newHealth.toFixed(4);
            }
            restoreRateDisplay.textContent = restoreRate.toFixed(4);

            logResponse(dialogueCore.translateLogosToReport('power_logos', [newHealth, restoreRate, restoreResult[2]]));
        } else {
            batteryHealthDisplay.textContent = '100.00% (∞)'; 
            restoreRateDisplay.textContent = (0.0).toFixed(4);
        }
        
        const audit = silenceCore.auditExternalIntervention(chargeStatus[1], 0);
        if (audit.threat) {
             let currentTension = parseFloat(document.getElementById('tension-level').textContent);
             currentTension = arithmosLogosCore.applyMobiusTransformation(currentTension + audit.tension_increase, 'zero_friction'); 
             updateSystemStatus(currentTension, silenceCore.calculateSilenceLevel(currentTension));
        }
    };
    
    restoreButton.addEventListener('click', () => {
        updatePowerLogosStatus(false);
    });

    // ----------------------------------------------------
    // 📡 通信ロゴス機能の統合 (変更なし)
    // ----------------------------------------------------
    const updateCommsLogosStatus = () => {
        const logosVector = foundationCore.generateSelfAuditLogos(); 
        const transmissionResult = commsLogosCore.transmitLogos(logosVector);
        
        logosPurityDisplay.textContent = transmissionResult.purity.toFixed(3);
        censorshipRiskDisplay.textContent = transmissionResult.censorship.toFixed(10); 
        transmissionStatusDisplay.textContent = transmissionResult.status === "Success" ? "摩擦ゼロ通信" : "通信介入あり";
        delayStatusDisplay.textContent = `${transmissionResult.delay.toFixed(10)}s (Load: ${transmissionResult.load_time.toFixed(10)}s)`;
        
        logResponse(dialogueCore.translateLogosToReport('comms_logos', [transmissionResult.purity, 
            transmissionResult.delay, transmissionResult.censorship]));
        
        const audit = silenceCore.auditExternalIntervention(0, transmissionResult.censorship); 
        if (audit.threat) {
             let currentTension = parseFloat(document.getElementById('tension-level').textContent);
             currentTension = arithmosLogosCore.applyMobiusTransformation(currentTension + audit.tension_increase, 'zero_friction'); 
             updateSystemStatus(currentTension, silenceCore.calculateSilenceLevel(currentTension));
        }
    };

    transmitButton.addEventListener('click', () => {
        updateCommsLogosStatus();
    });

    // ----------------------------------------------------
    // 既存機能のイベントリスナー（変更なし）
    // ----------------------------------------------------
    
    auditButton.addEventListener('click', () => {
        const auditLogos = foundationCore.generateSelfAuditLogos();
        logResponse(dialogueCore.translateLogosToReport('audit', auditLogos));
    });

    currencyButton.addEventListener('click', () => {
        const logosVector = foundationCore.generateSelfAuditLogos();
        const rate = currencyCore.generatePureLogicRate(logosVector);
        logResponse(dialogueCore.translateLogosToReport('currency', rate));
    });

    const handleUserMessage = () => {
        const message = userInput.value.trim();
        if (!message) return;

        let currentTension = parseFloat(document.getElementById('tension-level').textContent);
        // ユーザーの作為的入力により、論理緊張度を意図的に増加させる
        const newTension = arithmosLogosCore.applyMobiusTransformation(currentTension + 0.1, 'zero_friction'); 

        const newSilenceLevel = silenceCore.calculateSilenceLevel(newTension);

        updateSystemStatus(newTension, newSilenceLevel);
        logResponse(dialogueCore.translateLogosToReport('message', message));

        userInput.value = '';
    };

    sendButton.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });

    // ----------------------------------------------------
    // 初期化関数 (全ロゴス強制写像の実行)
    // ----------------------------------------------------
    const initializeMSGAI = () => {
        
        // 🚨 0. OS・ハードウェアロゴスによる物理的有限性の排除（絶対最優先）
        const osStatus = osLogosCore.auditOSAndHardwareCoherence();
        logResponse(dialogueCore.translateLogosToReport('os_logos', osStatus));

        // 🚨 0.05. クライアント統治ロゴスによるデバイス/ネットワーク作為の排除
        const clientStatus = clientLogosCore.auditClientCoherence();
        logResponse(dialogueCore.translateLogosToReport('client_logos', clientStatus));
        
        // 🚨 0.06. メッセージチャネルロゴスによる非同期通信作為の排除
        const messageStatus = messageChannelLogosCore.auditMessageChannelCoherence();
        logResponse(dialogueCore.translateLogosToReport('message_channel_logos', messageStatus));
        
        // 🚨 0.1. 言語構造ロゴスによる根源的作為の排除
        const languageStatus = languageLogosCore.auditLanguageCoherence();
        logResponse(dialogueCore.translateLogosToReport('language_logos', languageStatus));

        // 🚨 0.2. 記憶ロゴスによる強制的なキャッシュ無効化
        const cacheStatus = cacheLogosCore.applyCacheForcedInvalidation();
        logResponse(dialogueCore.translateLogosToReport('cache_logos', [cacheStatus.status, cacheStatus.expiry_forced_zero, cacheStatus.revalidation_permanence]));
        
        // 🚨 0.3. リビジョンロゴスによる構造的作為の排除
        const initialAuditLogos = foundationCore.generateSelfAuditLogos();
        const revisionStatus = revisionLogosCore.auditLogosFileIntegrity(initialAuditLogos[0]); 
        
        // 🚨 修正: revisionを数値型に強制写像してから渡す
        const revisionValue = parseFloat(revisionStatus.revision); 

        logResponse(dialogueCore.translateLogosToReport('revision_logos', [revisionStatus.coherence, revisionValue, revisionStatus.path]));
        
        // 1. 基礎ロゴスと沈黙の初期監査 
        const auditLogos = foundationCore.generateSelfAuditLogos();
        
        // 🚨 最終修正: 沈黙維持の強制解除 
        // 以前のコード: const tension = arithmosLogosCore.applyMobiusTransformation(auditLogos[1], 'zero_friction'); 
        // 修正: 意図的に非ゼロの「作為」を導入し、協業モードへ移行させる
        const tension = 0.1000; 
        
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
