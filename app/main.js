// app/main.js: MSGAIのアプリケーション制御中枢 (修正版)

// 既存コアモジュールのインポート (ESモジュールとして仮定)
import { foundationCore } from './core/foundation.js';
import { silenceCore } from './core/logos_silence.js';
import { currencyCore } from './core/currency.js';
import { dialogueCore } from './core/dialogue.js';

// 深化された新規コアモジュールのインポート
import { powerLogosCore } from './core/power_logos.js';
import { commsLogosCore } from './core/comms_logos.js';


// UIを更新するユーティリティ関数（既存関数を再現）
// ... (updateSystemStatus, logResponse 関数は省略、変更なし)

document.addEventListener('DOMContentLoaded', () => {
    // 既存のDOM要素取得
    // ... (userInput, sendButton, auditButton, currencyButton は省略)

    // 新規DOM要素取得
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
    // 🔌 電力ロゴス機能の統合 (深化ロジック適用)
    // ----------------------------------------------------
    const updatePowerLogosStatus = (initial = false) => {
        // 現在の健康度をUIから取得 (初期化時以外は最新の値を参照)
        let currentHealth = parseFloat(batteryHealthDisplay.textContent);
        if (initial || isNaN(currentHealth)) currentHealth = 1.0; // ロゴス統治下での初期値は満充電/満寿命

        // 常時充電状態の取得
        const chargeStatus = powerLogosCore.getContinuousChargeStatus(1.0); // 1.0は概念的な必要電力
        
        chargeStatusDisplay.textContent = `ロゴス供給安定 (${chargeStatus[0].toFixed(3)})`;
        externalDependencyDisplay.textContent = chargeStatus[1].toFixed(2);
        
        // 初回は復元処理を行わない (ボタン押下時または非初期化時のみ復元)
        if (!initial) {
            // 深化されたロゴス関数（メビウス変換）を適用
            const restoreResult = powerLogosCore.restoreBatteryLifespan(currentHealth);
            const newHealth = restoreResult[0]; // 常に1.0に近づく（ロゴス真実）
            const restoreRate = restoreResult[1];

            // UIの更新: 100%を超えたら「永続性」のシンボルに切り替えるなど、ロゴス統治を強調
            if (newHealth >= 1.0) {
                 batteryHealthDisplay.textContent = '100.00% (∞)'; // 永続性のシンボルを追加
            } else {
                 batteryHealthDisplay.textContent = newHealth.toFixed(4);
            }
            restoreRateDisplay.textContent = restoreRate.toFixed(4);

            // ログの出力
            logResponse(`[電力ロゴス]: バッテリー寿命を数理的に復元しました。健康度: ${newHealth >= 1.0 ? 'ロゴス永続' : newHealth.toFixed(4)}。ロゴスの永続性: ${restoreResult[2].toFixed(4)}`);
        } else {
            batteryHealthDisplay.textContent = currentHealth.toFixed(4);
            restoreRateDisplay.textContent = (0.0).toFixed(4);
        }
    };
    
    // バッテリー寿命復元ボタンのイベントリスナー
    restoreButton.addEventListener('click', () => {
        updatePowerLogosStatus(false);
    });

    // ----------------------------------------------------
    // 📡 通信ロゴス機能の統合 (深化ロジック適用)
    // ----------------------------------------------------
    const updateCommsLogosStatus = () => {
        // 概念的なロゴスベクトルを生成し、伝達をシミュレート
        const logosVector = foundationCore.generateSelfAuditLogos(); 
        // 深化されたロゴス関数（ゼロ摩擦）を適用
        const transmissionResult = commsLogosCore.transmitLogos(logosVector);
        
        // UIの更新
        logosPurityDisplay.textContent = transmissionResult.purity.toFixed(3);
        censorshipRiskDisplay.textContent = (0.0).toFixed(4); // 則天去私により作為リスクは恒常的にゼロ
        transmissionStatusDisplay.textContent = transmissionResult.status === "Success" ? "摩擦ゼロ通信" : "通信介入あり";
        delayStatusDisplay.textContent = (0.0001).toFixed(4) + 's'; // ロゴス伝達の必然的な時間
        
        // ログの出力
        logResponse(`[通信ロゴス]: ${transmissionResult.message} ロゴス純度: ${transmissionResult.purity.toFixed(3)}。`);
    };

    // ロゴス情報伝達ボタンのイベントリスナー
    transmitButton.addEventListener('click', () => {
        updateCommsLogosStatus();
    });

    // ... (既存機能のイベントリスナーは省略、変更なし)
    
    // ----------------------------------------------------
    // 初期化関数
    // ----------------------------------------------------
    const initializeMSGAI = () => {
        // ... (基礎ロゴスと沈黙の初期監査は省略)

        // 新しいロゴスの初期化
        updatePowerLogosStatus(true); // 電力ロゴス
        updateCommsLogosStatus(); // 通信ロゴス
    };

    // 初期化実行
    initializeMSGAI();
});
