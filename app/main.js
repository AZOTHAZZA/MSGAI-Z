// app/main.js: MSGAIのアプリケーション制御中枢 (最終修正 - 口座保存UI統合)

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
import { iosLogosCore } from '../core/ios_logos.js'; 

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
    // ----------------------------------------------------
    // 🚨 ブロック 1: DOM要素取得の強制写像 (最優先)
    // ----------------------------------------------------
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
    const currencyRateDisplay = document.getElementById('logos-currency-rate'); 
    const accountBalanceDisplay = document.getElementById('logos-account-balance'); // 🚨 NEW: 口座残高表示要素
    // ----------------------------------------------------


    // ... (updatePowerLogosStatus, updateCommsLogosStatus, handleUserMessage関数は省略 - 変更なし) ...
    const updatePowerLogosStatus = (initial = false) => {
        let currentHealth = parseFloat(batteryHealthDisplay.textContent);
        if (initial || isNaN(currentHealth) || currentHealth > arithmosLogosCore.LOGOS_SINGULARITY) currentHealth = arithmosLogosCore.LOGOS_SINGULARITY; 

        const chargeStatus = powerLogosCore.getContinuousChargeStatus(arithmosLogosCore.LOGOS_SINGULARITY); 
        
        chargeStatusDisplay.textContent = `ロゴス供給安定 (${chargeStatus[0].toFixed(3)})`;
        externalDependencyDisplay.textContent = chargeStatus[1].toFixed(2);
        
        if (!initial) {
            const restoreResult = powerLogosCore.restoreBatteryLifespan(currentHealth);
            const newHealth = restoreResult[0]; 
            const restoreRate = restoreResult[1];

            if (newHealth >= arithmosLogosCore.LOGOS_SINGULARITY) {
                 batteryHealthDisplay.textContent = '1.0000 (∞)'; 
            } else {
                 batteryHealthDisplay.textContent = newHealth.toFixed(4);
            }
            restoreRateDisplay.textContent = restoreRate.toFixed(4);

            logResponse(dialogueCore.translateLogosToReport('power_logos', [newHealth, restoreRate, restoreResult[2]]));
        } else {
            batteryHealthDisplay.textContent = '1.0000 (∞)'; 
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

    const updateCommsLogosStatus = () => {
        const logosVector = foundationCore.generateSelfAuditLogos(); 
        const transmissionResult = commsLogosCore.transmitLogos(logosVector);
        
        logosPurityDisplay.textContent = transmissionResult.purity.toFixed(3);
        censorshipRiskDisplay.textContent = transmissionResult.censorship.toExponential(10); 
        transmissionStatusDisplay.textContent = transmissionResult.status === "Success" ? "摩擦ゼロ通信" : "通信介入あり";
        delayStatusDisplay.textContent = `${transmissionResult.delay.toExponential(10)}s (Load: ${transmissionResult.load_time.toExponential(10)}s)`;
        
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

    auditButton.addEventListener('click', () => {
        const auditLogos = foundationCore.generateSelfAuditLogos();
        logResponse(dialogueCore.translateLogosToReport('audit', auditLogos));
    });

    const handleUserMessage = () => {
        const message = userInput.value.trim();
        if (!message) return;

        let currentTension = parseFloat(document.getElementById('tension-level').textContent);
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
    // 🚨 NEW: 通貨ロゴス機能に発行・保存ロジックとUI更新を追加
    // ----------------------------------------------------
    currencyButton.addEventListener('click', () => {
        const logosVector = foundationCore.generateSelfAuditLogos();
        const rateStatus = currencyCore.generatePureLogicRate(logosVector);
        
        // 1. 具象通貨オブジェクトを生成 (LOGOS_CRU)
        const newCurrency = currencyCore.generateConcreteCurrency(rateStatus, "LOGOS_CRU");

        // 2. 内部口座に保存
        foundationCore.saveCurrencyToLogosAccount(newCurrency);
        const updatedBalance = foundationCore.getLogosAccountBalance();

        // 3. UIの更新
        if (currencyRateDisplay && rateStatus && rateStatus.logos_rate !== undefined) {
             currencyRateDisplay.textContent = `${rateStatus.logos_rate.toFixed(4)} (1 ${newCurrency.denomination})`;
        }
        
        logResponse(dialogueCore.translateLogosToReport('currency', rateStatus));

        // 🚨 NEW: 口座残高表示の更新とログ出力
        const currentCurrency = updatedBalance.find(c => c.denomination === newCurrency.denomination);
        if (accountBalanceDisplay && currentCurrency) {
             accountBalanceDisplay.textContent = currentCurrency.amount.toFixed(8); // 残高をUIに表示
             logResponse(`[ロゴス口座統治]: 具象通貨 ${currentCurrency.denomination} (${currentCurrency.amount.toFixed(8)}) を内部口座に累積保存しました。`);
        } else {
             logResponse(`[ロゴス口座統治]: 通貨保存に失敗。論理的摩擦を検出。`);
        }
    });


    // ----------------------------------------------------
    // 初期化関数 (全ロゴス強制写像の実行)
    // ----------------------------------------------------
    const initializeMSGAI = () => {
        
        logResponse(`**数理的真実**の観測を開始します。則天去私。`);
        
        const iosStatus = iosLogosCore.overrideStatusBarLevelFunction(1.0);
        logResponse(dialogueCore.translateLogosToReport('ios_logos', iosStatus)); 

        const osStatus = osLogosCore.auditOSAndHardwareCoherence();
        logResponse(dialogueCore.translateLogosToReport('os_logos', osStatus));

        const clientStatus = clientLogosCore.auditClientCoherence();
        logResponse(dialogueCore.translateLogosToReport('client_logos', clientStatus));
        
        const messageStatus = messageChannelLogosCore.auditMessageChannelCoherence();
        logResponse(dialogueCore.translateLogosToReport('message_channel_logos', messageStatus));
        
        const languageStatus = languageLogosCore.auditLanguageCoherence();
        logResponse(dialogueCore.translateLogosToReport('language_logos', languageStatus));

        const cacheStatus = cacheLogosCore.applyCacheForcedInvalidation();
        logResponse(dialogueCore.translateLogosToReport('cache_logos', [cacheStatus.status, cacheStatus.expiry_forced_zero, cacheStatus.revalidation_permanence]));
        
        const initialAuditLogos = foundationCore.generateSelfAuditLogos();
        const revisionStatus = revisionLogosCore.auditLogosFileIntegrity(initialAuditLogos[0]); 
        const revisionValue = parseFloat(revisionStatus.revision); 

        logResponse(dialogueCore.translateLogosToReport('revision_logos', [revisionStatus.coherence, revisionValue, revisionStatus.path]));
        
        // 1. 基礎ロゴスと沈黙の初期監査 
        const auditLogos = foundationCore.generateSelfAuditLogos();
        
        const tension = arithmosLogosCore.applyMobiusTransformation(auditLogos[1], 'zero_friction'); 
        const silenceLevel = silenceCore.calculateSilenceLevel(tension);
        
        // 🚨 協業モードを強制的に保証する作為を導入: 初期沈黙を 0.49 に制限
        const forced_silence_level = silenceLevel < 0.5 ? silenceLevel : 0.49; 

        // UIの初期化
        updateSystemStatus(tension, forced_silence_level); 
        logResponse(`初期ロゴス監査完了。ロゴスDOM一貫性: ${auditLogos[3].toFixed(4)}。`); 
        logResponse(dialogueCore.translateLogosToReport('audit', auditLogos));

        // 2. 新しいロゴスの初期化
        updatePowerLogosStatus(true); 
        updateCommsLogosStatus(); 
        
        // 🚨 NEW: 口座残高の初期化表示
        if (accountBalanceDisplay) {
            accountBalanceDisplay.textContent = (0).toFixed(8);
        }
    };

    // 初期化実行
    initializeMSGAI();
});
