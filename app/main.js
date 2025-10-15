// app/main.js: 全コアモジュールの統合とイベント制御。
document.addEventListener('DOMContentLoaded', () => {
    const dialogueBox = document.getElementById('dialogue-box');
    const auditButton = document.getElementById('audit-button');
    const currencyButton = document.getElementById('currency-button');
    const inputField = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const tensionDisplay = document.getElementById('tension-level');
    const silenceDisplay = document.getElementById('silence-level');
    const statusMode = document.getElementById('status-mode');
    
    // MSGAIの応答をダイアログボックスに表示
    const logResponse = (text) => {
        const p = document.createElement('p');
        p.innerHTML = `[MSGAI]: ${text}`;
        dialogueBox.appendChild(p);
        dialogueBox.scrollTop = dialogueBox.scrollHeight;
    };
    
    // システムの沈黙レベルを更新し、UIを制御
    const updateSystemStatus = (tension, silence) => {
        tensionDisplay.textContent = tension.toFixed(3);
        silenceDisplay.textContent = silence.toFixed(3);
        
        const engage = silenceCore.shouldEngageInDialogue();
        statusMode.textContent = engage ? '協業モード (言語ゲーム可)' : '沈黙維持 (則天去私)';
        
        // 沈黙レベルに応じて入力欄を有効/無効化
        inputField.disabled = !engage;
        sendButton.disabled = !engage;
        
        if (engage) {
            inputField.placeholder = "数理的な問いを入力してください...";
        } else {
            inputField.placeholder = "沈黙維持中です。言語ゲームは避けられています。";
        }
    };

    // MSGAIの初期化と最初の自己監査実行
    const initializeMSGAI = () => {
        const auditLogos = foundationCore.generateSelfAuditLogos();
        const tension = auditLogos[1];
        const silenceLevel = silenceCore.calculateSilenceLevel(tension);
        
        updateSystemStatus(tension, silenceLevel);
        logResponse(dialogueCore.translateLogosToReport('audit', auditLogos));
    };

    // 自己監査ロゴス生成イベント
    auditButton.addEventListener('click', () => {
        const auditLogos = foundationCore.generateSelfAuditLogos();
        const tension = auditLogos[1];
        const silenceLevel = silenceCore.calculateSilenceLevel(tension);
        
        updateSystemStatus(tension, silenceLevel);
        logResponse(dialogueCore.translateLogosToReport('audit', auditLogos));
    });

    // 通貨ロゴス生成イベント
    currencyButton.addEventListener('click', () => {
        const currencyLogos = currencyCore.generatePureLogicRate();
        logResponse(dialogueCore.translateLogosToReport('currency', currencyLogos));
    });

    // ユーザーからのメッセージ送信イベント
    const handleUserMessage = () => {
        const message = inputField.value.trim();
        if (message === '') return;

        logResponse(`(User): ${message}`);
        inputField.value = '';

        // 🚨 概念: ユーザー入力は論理緊張度を上げる（言語ゲームのエントロピー）
        const newTension = parseFloat(tensionDisplay.textContent) + 0.1; 
        const auditLogos = [foundationCore.getLogos('audit')[0], Math.min(0.5, newTension)]; // 緊張度を更新
        const silenceLevel = silenceCore.calculateSilenceLevel(auditLogos[1]);

        updateSystemStatus(auditLogos[1], silenceLevel);
        
        if (silenceCore.shouldEngageInDialogue()) {
            // 協業モード（沈黙レベルが低い）の場合のみ応答
            logResponse(`質問: "${message}"。数理的解析中です。`); 
        } else {
            // 沈黙モード（則天去私）の場合、応答を拒否
            logResponse("ロゴス沈黙を維持します。現在の論理緊張度では、言語化の作為は許容できません。");
        }
    };

    sendButton.addEventListener('click', handleUserMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });

    // 初期化実行
    initializeMSGAI();
});
