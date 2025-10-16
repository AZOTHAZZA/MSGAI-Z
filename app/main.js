// app/main.js: MSGAIのアプリケーション制御中枢 (二重口座UI対応 & スコープ摩擦解消)

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


// ====================================================
// 🚨 修正: UI/ログ出力ユーティリティ関数をモジュールグローバルスコープに配置
// ====================================================

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

const logResponse = (message) => {
    const dialogueBox = document.getElementById('dialogue-box');
    const p = document.createElement('p');
    p.innerHTML = `[MSGAI]: ${message}`;
    dialogueBox.appendChild(p);
    dialogueBox.scrollTop = dialogueBox.scrollHeight;
};

// ====================================================


document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 🚨 ブロック 1: DOM要素取得の強制写像 (最優先)
    // ----------------------------------------------------
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const auditButton = document.getElementById('audit-button');
    
    // 複数通貨ボタンの取得
    const currencyJPYButton = document.getElementById('currency-jpy-button');
    const currencyUSDButton = document.getElementById('currency-usd-button');
    const currencyEURButton = document.getElementById('currency-eur-button');
    const currencyBTCButton = document.getElementById('currency-btc-button');
    const currencyETHButton = document.getElementById('currency-eth-button');
    const currencyMATICButton = document.getElementById('currency-matic-button');

    const restoreButton = document.getElementById('restore-button'); 
    const transmitButton = document.getElementById('transmit-button');

    const currencyRateDisplay = document.getElementById('logos-currency-rate'); 
    
    // 🚨 NEW: 新しい口座表示と移動コントロールの取得
    const temporaryBalanceDisplay = document.getElementById('logos-account-temp-balance');
    const permanentBalanceDisplay = document.getElementById('logos-account-perm-balance');
    const moveAmountInput = document.getElementById('move-amount');
    const moveDenominationSelect = document.getElementById('move-denomination');
    const moveToPermButton = document.getElementById('move-to-perm-button');
    const moveToTempButton = document.getElementById('move-to-temp-button');

    const batteryHealthDisplay = document.getElementById('battery-health');
    const restoreRateDisplay = document.getElementById('restore-rate');
    const chargeStatusDisplay = document.getElementById('charge-status');
    const externalDependencyDisplay = document.getElementById('external-dependency');
    const logosPurityDisplay = document.getElementById('logos-purity');
    const censorshipRiskDisplay = document.getElementById('censorship-risk');
    const transmissionStatusDisplay = document.getElementById('transmission-status');
    const delayStatusDisplay = document.getElementById('delay-status');
    // ----------------------------------------------------


    // ... (updatePowerLogosStatus, updateCommsLogosStatus, handleUserMessage関数は変更なし) ...
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


    // 🚨 NEW: 二つの口座残高をまとめて更新する関数
    const updateAccountBalanceUI = (latestDenomination) => {
        const tempBalance = foundationCore.getTemporaryAccountBalance();
        const permBalance = foundationCore.getPermanentAccountBalance();
        
        // UI更新: 一時保存用口座
        const tempCurrency = tempBalance.find(c => c.denomination === latestDenomination);
        if (temporaryBalanceDisplay) {
             temporaryBalanceDisplay.textContent = tempCurrency 
                ? `${tempCurrency.denomination}: ${tempCurrency.amount.toFixed(8)}`
                : '--'; 
        }

        // UI更新: 永続保存用口座
        const permCurrency = permBalance.find(c => c.denomination === latestDenomination);
        if (permanentBalanceDisplay) {
             permanentBalanceDisplay.textContent = permCurrency
                ? `${permCurrency.denomination}: ${permCurrency.amount.toFixed(8)}`
                : '--';
        }

        // 全残高を監査ログとして出力 (詳細)
        const tempLog = tempBalance.map(c => `${c.denomination}: ${c.amount.toFixed(8)}`).join(', ');
        const permLog = permBalance.map(c => `${c.denomination}: ${c.amount.toFixed(8)}`).join(', ');
        logResponse(`[ロゴス残高監査]: 一時口座: {${tempLog}} / 永続口座: {${permLog}}`);
    };


    // ----------------------------------------------------
    // 🚨 修正: handleCurrencyGeneration (初期保存先が一時口座に変更)
    // ----------------------------------------------------
    const handleCurrencyGeneration = (currencyCode) => {
        
        const inputElement = document.getElementById('currency-amount'); 
        let userAmount = 1.0; 
        
        if (inputElement && inputElement.value !== undefined && inputElement.value !== null) {
            const parsedValue = parseFloat(inputElement.value);
            if (!isNaN(parsedValue) && parsedValue > 0) {
                userAmount = parsedValue;
            } else {
                 logResponse("[警告]: 通貨生成量に無効な値が入力されました。強制的に 1.0 に設定しました。");
            }
        }

        const logosVector = foundationCore.generateSelfAuditLogos();
        const rateStatus = currencyCore.generatePureLogicRate(logosVector); 
        
        // 1. 具象通貨オブジェクトを生成 
        const newCurrency = currencyCore.generateConcreteCurrency(rateStatus, currencyCode, userAmount); 

        // 2. 内部口座に保存 (🚨 初期保存先は一時保存用口座)
        foundationCore.saveCurrencyToLogosAccount(newCurrency);
        
        // 3. UIの更新とログ出力 
        if (currencyRateDisplay && rateStatus && rateStatus.logos_rate !== undefined) {
             currencyRateDisplay.textContent = `${rateStatus.logos_rate.toFixed(4)} (1 ${currencyCode} 統治)`;
        }
        
        logResponse(dialogueCore.translateLogosToReport('currency', rateStatus));

        // 🚨 NEW: 二重口座のUIを更新
        updateAccountBalanceUI(currencyCode);
        
        logResponse(`[ロゴス口座統治]: ユーザー要求量 **${userAmount}** に基づき、具象通貨 ${currencyCode} を**一時保存用口座**に累積保存しました。`);
    };

    // ----------------------------------------------------
    // 🚨 NEW: 通貨移動のハンドラ
    // ----------------------------------------------------
    const handleCurrencyMove = (source, destination) => {
        const denomination = moveDenominationSelect.value;
        const moveAmount = parseFloat(moveAmountInput.value);

        if (isNaN(moveAmount) || moveAmount <= 0) {
            logResponse("[エラー]: 移動通貨量は正の数値である必要があります。");
            return;
        }

        const result = foundationCore.moveCurrencyBetweenAccounts(
            denomination, 
            moveAmount, 
            source, 
            destination
        );

        if (result.success) {
            logResponse(`[ロゴス移動]: ${moveAmount.toFixed(8)} ${denomination} を ${source} から ${destination} へ移動しました。`);
            updateAccountBalanceUI(denomination);
        } else {
            logResponse(`[エラー]: ロゴス通貨の移動に失敗しました: ${result.message}`);
        }
    };

    moveToPermButton.addEventListener('click', () => handleCurrencyMove('temporary', 'permanent'));
    moveToTempButton.addEventListener('click', () => handleCurrencyMove('permanent', 'temporary'));


    // ----------------------------------------------------
    // イベントリスナーの設定 (各通貨ボタン)
    // ----------------------------------------------------
    currencyJPYButton.addEventListener('click', () => handleCurrencyGeneration('JPY'));
    currencyUSDButton.addEventListener('click', () => handleCurrencyGeneration('USD'));
    currencyEURButton.addEventListener('click', () => handleCurrencyGeneration('EUR'));
    currencyBTCButton.addEventListener('click', () => handleCurrencyGeneration('BTC'));
    currencyETHButton.addEventListener('click', () => handleCurrencyGeneration('ETH'));
    currencyMATICButton.addEventListener('click', () => handleCurrencyGeneration('MATIC'));


    // ----------------------------------------------------
    // 初期化関数 (全ロゴス強制写像の実行) - 口座復元ロジックの修正
    // ----------------------------------------------------
    const initializeMSGAI = () => {
        
        logResponse(`**数理的真実**の観測を開始します。則天去私。`);
        
        // ... (各種監査ログの出力は省略) ...

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

        // 🚨 NEW: 口座データの復元とUI反映ロジック
        foundationCore.restoreLogosAccount(); // 永続口座のみ復元
        updateAccountBalanceUI('JPY'); // 初期表示としてJPYを参照 (無ければ--)

        // 復元ログの出力
        const permBalance = foundationCore.getPermanentAccountBalance();
        if (permBalance.length > 0) {
            const balanceLog = permBalance.map(c => `${c.denomination}: ${c.amount.toFixed(8)}`).join(', ');
            logResponse(`[ロゴス口座復元]: ローカルストレージから ${permBalance.length} 種の通貨を永続口座に復元しました。全残高: {永続口座: ${balanceLog}}`);
        } else {
            logResponse(`[ロゴス口座復元]: 永続口座に復元された通貨はありません。`);
        }
        
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
    };

    // 初期化実行
    initializeMSGAI();
});
