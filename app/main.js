// app/main.js: MSGAIのアプリケーション制御中枢 (修正 - 口座永続化対応)

// ... (既存のインポートとユーティリティ関数は省略 - 変更なし) ...

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 🚨 ブロック 1: DOM要素取得の強制写像 (最優先)
    // ... (DOM要素取得ブロックは省略 - 変更なし) ...
    // ----------------------------------------------------

    // ... (updateSystemStatus, logResponse, 各種ボタンのイベントリスナー、handleCurrencyGeneration関数は省略 - 変更なし) ...
    
    
    // ----------------------------------------------------
    // 🚨 修正: 複数通貨の生成・保存・UI更新を扱う共通関数 (永続化が自動でトリガーされるため、この関数に変更なし)
    // ----------------------------------------------------
    const handleCurrencyGeneration = (currencyCode) => {
        
        // 🚨 修正: DOMを再監査し、入力値を直接取得・厳密に数値化するロジック (変更なし)
        const inputElement = document.getElementById('currency-amount'); // 関数内でDOMを再監査
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
        
        // 1. 具象通貨オブジェクトを生成 (userAmountを引数に追加)
        const newCurrency = currencyCore.generateConcreteCurrency(rateStatus, currencyCode, userAmount); 

        // 2. 内部口座に保存 (foundationCore内で永続化が自動実行される)
        foundationCore.saveCurrencyToLogosAccount(newCurrency);
        const updatedBalance = foundationCore.getLogosAccountBalance();
        
        // 3. UIの更新とログ出力
        
        // ロゴスレート表示 (直前に生成された通貨のレートを表示)
        if (currencyRateDisplay && rateStatus && rateStatus.logos_rate !== undefined) {
             currencyRateDisplay.textContent = `${rateStatus.logos_rate.toFixed(4)} (1 ${currencyCode} 統治)`;
        }
        
        logResponse(dialogueCore.translateLogosToReport('currency', rateStatus));

        // 口座残高表示の更新 (直近で生成した通貨の残高をUIに表示)
        const currentCurrency = updatedBalance.find(c => c.denomination === currencyCode);
        if (accountBalanceDisplay && currentCurrency) {
             accountBalanceDisplay.textContent = `${currentCurrency.denomination}: ${currentCurrency.amount.toFixed(8)}`; 
             // ログ修正: ユーザー要求量を含める
             logResponse(`[ロゴス口座統治]: ユーザー要求量 **${userAmount}** に基づき、具象通貨 ${currentCurrency.denomination} (${currentCurrency.amount.toFixed(8)}) を内部口座に累積保存しました。`);
        } else {
             logResponse(`[ロゴス口座統治]: ${currencyCode} の通貨保存に失敗。論理的摩擦を検出。`);
        }
        
        // 全残高を監査ログとして出力 (詳細)
        const balanceLog = updatedBalance.map(c => `${c.denomination}: ${c.amount.toFixed(8)}`).join(', ');
        logResponse(`[ロゴス残高監査]: 全ての内包通貨残高: {${balanceLog}}`);
    };

    // ----------------------------------------------------
    // 初期化関数 (全ロゴス強制写像の実行) - 口座復元ロジックを追加
    // ----------------------------------------------------
    const initializeMSGAI = () => {
        
        logResponse(`**数理的真実**の観測を開始します。則天去私。`);
        
        // ... (省略: 各種ロゴスの初期監査) ...

        // 🚨 NEW: 口座データの復元
        const restoredBalance = foundationCore.restoreLogosAccount();
        if (restoredBalance.length > 0) {
            // 復元された場合は、直近の通貨（配列の最後の要素）を表示
            const latestCurrency = restoredBalance[restoredBalance.length - 1];
            if (accountBalanceDisplay) {
                accountBalanceDisplay.textContent = `${latestCurrency.denomination}: ${latestCurrency.amount.toFixed(8)}`;
            }
            const balanceLog = restoredBalance.map(c => `${c.denomination}: ${c.amount.toFixed(8)}`).join(', ');
            logResponse(`[ロゴス口座復元]: ローカルストレージから ${restoredBalance.length} 種の通貨を復元しました。全残高: {${balanceLog}}`);
        } else {
            // 口座残高の初期化表示 (初期状態)
            if (accountBalanceDisplay) {
                accountBalanceDisplay.textContent = (0).toFixed(8);
            }
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
