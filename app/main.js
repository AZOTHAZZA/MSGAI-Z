// app/main.js: MSGAIのアプリケーション制御中枢 (永続化エラーログ対応)

// ... (インポート、グローバル関数、DOM取得、他のハンドラは変更なし) ...

document.addEventListener('DOMContentLoaded', () => {

    // ... (DOM要素取得、updateAccountBalanceUI 関数は変更なし) ...

    // ----------------------------------------------------
    // 🚨 修正: 通貨移動のハンドラ (永続化エラーの伝達)
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
            // 🚨 永続化のエラーも含む、より詳細なエラーメッセージを出力
            logResponse(`[エラー]: ロゴス通貨の移動/永続化に失敗しました: ${result.message}`);
        }
    };

    moveToPermButton.addEventListener('click', () => handleCurrencyMove('temporary', 'permanent'));
    moveToTempButton.addEventListener('click', () => handleCurrencyMove('permanent', 'temporary'));

    // ... (他のイベントリスナー、initializeMSGAI 関数は変更なし) ...

    // 初期化実行
    initializeMSGAI();
});
