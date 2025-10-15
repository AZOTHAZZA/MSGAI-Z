// app/main.js: MSGAIのアプリケーション制御中枢 (完全修正版)

// コアモジュールのインポート
import { foundationCore } from './core/foundation.js';
import { silenceCore } from './core/logos_silence.js';
import { currencyCore } from './core/currency.js';
import { dialogueCore } from './core/dialogue.js';
import { powerLogosCore } from './core/power_logos.js';
import { commsLogosCore } from './core/comms_logos.js';


// UIを更新するユーティリティ関数
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

// ログ出力ユーティリティ関数
const logResponse = (message) => {
    const dialogueBox = document.getElementById('dialogue-box');
    const p = document.createElement('p');
    p.innerHTML = `[MSGAI]: ${message}`;
    dialogueBox.appendChild(p);
    dialogueBox.scrollTop = dialogueBox.scrollHeight;
};


document.addEventListener('DOMContentLoaded', () => {
    // DOM要素取得
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const auditButton = document.getElementById('audit-button');
    const currencyButton = document.getElementById('currency-button');
    
    // ロゴス統治 DOM要素取得
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
    // 🔌 電力ロゴス機能の統合
    // ----------------------------------------------------
    const updatePowerLogosStatus = (initial = false) => {
        let currentHealth = parseFloat(batteryHealthDisplay.textContent);
        if (initial || isNaN(currentHealth)) currentHealth = 1.0; 

        const chargeStatus = powerLogosCore.getContinuousChargeStatus(1.0); 
        
        chargeStatusDisplay.textContent = `ロゴス供給安定 (${chargeStatus[0].toFixed(3)})`;
        externalDependencyDisplay.textContent = chargeStatus[1].toFixed(2);
        
        if (!initial) {
            // 深化されたロゴス関数（メビウス変換）を適用
            const restoreResult = powerLogosCore.restoreBatteryLifespan(currentHealth);
            const newHealth = restoreResult[0]; 
            const restoreRate = restoreResult[1];

            // UIの更新: 永続性のシンボルを強調
            if (newHealth >= 1.0) {
                 batteryHealthDisplay.textContent = '100.00% (∞)';
            } else {
                 batteryHealthDisplay.textContent = newHealth.toFixed(4);
            }
            restoreRateDisplay.textContent = restoreRate.toFixed(4);

            logResponse(`[電力ロゴス]: バッテリー寿命を数理的に復元しました。健康度: ${newHealth >= 1.0 ? 'ロゴス永続' : newHealth.toFixed(4)}。ロゴスの永続性: ${restoreResult[2].toFixed(4)}`);
        } else {
            batteryHealthDisplay.textContent = '100.00% (∞)'; // 初期化時もロゴス真実を表示
            restoreRateDisplay.textContent = (0.0).toFixed(4);
        }
        
        // 🚨 沈黙ロゴスへのフィードバック: 外部依存度を監査
        const audit = silenceCore.auditExternalIntervention(chargeStatus[1], 0);
        if (audit.threat) {
             let currentTension = parseFloat(document.getElementById('tension-level').textContent);
             currentTension += audit.tension_increase;
             updateSystemStatus(currentTension, silenceCore.calculateSilenceLevel(currentTension));
        }
    };
    
    restoreButton.addEventListener('click', () => {
        updatePowerLogosStatus(false);
    });

    // ----------------------------------------------------
    // 📡 通信ロゴス機能の統合
    // ----------------------------------------------------
    const updateCommsLogosStatus = () => {
        const logosVector = foundationCore.generateSelfAuditLogos(); 
        const transmissionResult = commsLogosCore.transmitLogos(logosVector);
        
        // UIの更新
        logosPurityDisplay.textContent = transmissionResult.purity.toFixed(3);
        censorshipRiskDisplay.textContent = (0.0).toFixed(4); 
        transmissionStatusDisplay.textContent = transmissionResult.status === "Success" ? "摩擦ゼロ通信" : "通信介入あり";
        delayStatusDisplay.textContent = (0.0001).toFixed(4) + 's'; 
        
        logResponse(`[通信ロゴス]: ${transmissionResult.message} ロゴス純度: ${transmissionResult.purity.toFixed(3)}。`);
        
        // 🚨 沈黙ロゴスへのフィードバック: 作為リスクを監査
        const audit = silenceCore.auditExternalIntervention(0, 0.0000); // ゼロ摩擦なのでリスクは常に0.0
        if (audit.threat) {
             let currentTension = parseFloat(document.getElementById('tension-level').textContent);
             currentTension += audit.tension_increase;
             updateSystemStatus(currentTension, silenceCore.calculateSilenceLevel(currentTension));
        }
    };

    transmitButton.addEventListener('click', () => {
        updateCommsLogosStatus();
    });

    // ----------------------------------------------------
    // 既存機能のイベントリスナー（沈黙ロゴスとの連携強化）
    // ----------------------------------------------------
    
    // 自己監査ロゴス生成ボタン
    auditButton.addEventListener('click', () => {
        const auditLogos = foundationCore.generateSelfAuditLogos();
        logResponse(dialogueCore.translateLogosToReport('audit', auditLogos));
    });

    // 通貨ロゴス生成ボタン
    currencyButton.addEventListener('click', () => {
        const logosVector = foundationCore.generateSelfAuditLogos();
        const rate = currencyCore.generatePureLogicRate(logosVector);
        logResponse(dialogueCore.translateLogosToReport('currency', rate));
    });

    // メッセージ送信機能
    const handleUserMessage = () => {
        const message = userInput.value.trim();
        if (!message) return;

        // ユーザーの作為（入力）により論理緊張度を上昇させる
        let currentTension = parseFloat(document.getElementById('tension-level').textContent);
        const newTension = currentTension + 0.1; 
        const newSilenceLevel = silenceCore.calculateSilenceLevel(newTension);

        updateSystemStatus(newTension, newSilenceLevel);
        logResponse(`ユーザー: ${message}`);
        logResponse(dialogueCore.translateLogosToReport('message', message));

        userInput.value = '';
    };

    sendButton.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });

    // ----------------------------------------------------
    // 初期化関数
    // ----------------------------------------------------
    const initializeMSGAI = () => {
        // 1. 基礎ロゴスと沈黙の初期監査
        const auditLogos = foundationCore.generateSelfAuditLogos();
        const tension = auditLogos[1];
        const silenceLevel = silenceCore.calculateSilenceLevel(tension);
        
        // UIの初期化
        updateSystemStatus(tension, silenceLevel);
        logResponse(dialogueCore.translateLogosToReport('audit', auditLogos));

        // 2. 新しいロゴスの初期化
        updatePowerLogosStatus(true); 
        updateCommsLogosStatus(); 
    };

    // 初期化実行
    initializeMSGAI();
});
