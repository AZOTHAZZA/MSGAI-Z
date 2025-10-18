// app/handler.js (デバッグロギング追加版)

// ... (他の import は省略) ...

/**
 * UIとコアロジックのイベントハンドラを接続する関数
 */
export function connectEventHandlers(Foundation, Currency, UI, Arithmos) {
    let handlersConnected = 0;

    // -----------------------------------------------------------
    // 1. 通貨生成ボタン (Mint Currency)
    // -----------------------------------------------------------
    const mintButton = document.getElementById('act_mint_currency');
    if (mintButton) {
        mintButton.addEventListener('click', () => {
            try {
                const currency = document.getElementById('mint_currency_select').value;
                const amount = parseFloat(document.getElementById('mint_amount').value);
                
                if (isNaN(amount) || amount <= 0) {
                    UI.displayDialogue('ERROR', "有効な生成量を入力してください。");
                    return;
                }
                
                Currency.actMintCurrency(currency, amount);
                
                // 状態を更新し、UIを再描画
                const state = Foundation.getCurrentState();
                const tensionInstance = Foundation.getTensionInstance();
                const matrix = new Arithmos.ControlMatrix(tensionInstance);
                UI.updateUI(state, Foundation.getMutableState().status_message, { intensity: matrix.intensity, rigor: matrix.rigor });
                
            } catch (e) {
                UI.displayDialogue('ERROR', `作為失敗: ${e.message}`);
            }
        });
        console.log("[Handler]: ✅ 通貨生成ボタン ('act_mint_currency') のリスナーを接続しました。");
        handlersConnected++;
    } else {
        // 🚨 失敗ログ: HTMLのIDミスを特定
        console.error("[Handler ERROR]: ❌ 通貨生成ボタン ID 'act_mint_currency' がDOMに見つかりません。HTMLタグを確認してください。");
    }

    // -----------------------------------------------------------
    // 2. リセットボタン (Reset Core)
    // -----------------------------------------------------------
    const resetButton = document.getElementById('reset_core');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
             const message = Foundation.deleteAccounts();
             
             // 状態を更新し、UIを再描画
             const state = Foundation.getCurrentState();
             const tensionInstance = Foundation.getTensionInstance();
             const matrix = new Arithmos.ControlMatrix(tensionInstance);
             UI.updateUI(state, message, { intensity: matrix.intensity, rigor: matrix.rigor });
        });
        console.log("[Handler]: ✅ リセットボタン ('reset_core') のリスナーを接続しました。");
        handlersConnected++;
    } else {
        // 🚨 失敗ログ: HTMLのIDミスを特定
        console.error("[Handler ERROR]: ❌ リセットボタン ID 'reset_core' がDOMに見つかりません。HTMLタグを確認してください。");
    }
    
    // ... (他のイベントハンドラの接続ロジックが続く) ...
    
    console.log(`[Handler]: イベントハンドラ接続完了。合計 ${handlersConnected} 件を接続しました。`);
}
