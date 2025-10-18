// app/handler.js (HTML構造対応版)

/**
 * UIとコアロジックのイベントハンドラを接続する関数
 */
export function connectEventHandlers(Foundation, Currency, UI, Arithmos) {
    let handlersConnected = 0;

    // -----------------------------------------------------------
    // 1. 通貨生成ボタン (Mint Currency) - 複数ボタン対応
    // -----------------------------------------------------------
    // 全てのミントボタンを取得 (mint-jpy, mint-usdなど)
    const mintButtons = document.querySelectorAll('.action-mint');
    const mintAmountInput = document.getElementById('mint_amount_input');
    
    mintButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', () => {
                try {
                    const currency = button.getAttribute('data-currency'); // data-currencyから通貨を取得
                    const amount = parseFloat(mintAmountInput.value);
                    
                    if (isNaN(amount) || amount <= 0) {
                        UI.displayDialogue('ERROR', "有効な生成量を入力してください。");
                        return;
                    }
                    
                    // コア作為を実行
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
            console.log(`[Handler]: ✅ 通貨生成ボタン (${button.id}) のリスナーを接続しました。`);
            handlersConnected++;
        }
    });


    // -----------------------------------------------------------
    // 2. 口座削除/リセットボタン
    // -----------------------------------------------------------
    // 🌟 修正: IDを 'reset_core' から 'delete_accounts_button' に変更
    const deleteAccountsButton = document.getElementById('delete_accounts_button');
    if (deleteAccountsButton) {
        deleteAccountsButton.addEventListener('click', () => {
             const message = Foundation.deleteAccounts();
             
             // 状態を更新し、UIを再描画
             const state = Foundation.getCurrentState();
             const tensionInstance = Foundation.getTensionInstance();
             const matrix = new Arithmos.ControlMatrix(tensionInstance);
             UI.updateUI(state, message, { intensity: matrix.intensity, rigor: matrix.rigor });
        });
        console.log("[Handler]: ✅ 口座削除/リセットボタン ('delete_accounts_button') のリスナーを接続しました。");
        handlersConnected++;
    } else {
        console.error("[Handler ERROR]: ❌ 口座削除ボタン ID 'delete_accounts_button' がDOMに見つかりません。");
    }
    
    // -----------------------------------------------------------
    // 3. その他の主要なボタンの接続（追加で接続が必要なもの）
    // -----------------------------------------------------------
    
    // 内部送金ボタン
    const internalTransferButton = document.getElementById('transfer_internal_button');
    if (internalTransferButton) {
        internalTransferButton.addEventListener('click', () => {
            UI.displayDialogue('INFO', '内部送金作為を実行します (ロジック未実装)');
            // TODO: Currency.actTransferInternal を呼び出すロジックを追加
        });
        console.log("[Handler]: ✅ 内部送金ボタンのリスナーを接続しました。");
        handlersConnected++;
    }

    // 外部送金ボタン
    const externalTransferButton = document.getElementById('transfer_external_button');
    if (externalTransferButton) {
        externalTransferButton.addEventListener('click', () => {
            UI.displayDialogue('INFO', '外部送金作為を実行します (ロジック未実装)');
            // TODO: Currency.actTransferExternal を呼び出すロジックを追加
        });
        console.log("[Handler]: ✅ 外部送金ボタンのリスナーを接続しました。");
        handlersConnected++;
    }
    
    // 対話実行ボタン
    const dialogueButton = document.getElementById('dialogue_button');
    if (dialogueButton) {
        dialogueButton.addEventListener('click', () => {
            UI.displayDialogue('INFO', '対話作為を実行します (ロジック未実装)');
            // TODO: 対話処理ロジックを追加
        });
        console.log("[Handler]: ✅ 対話実行ボタンのリスナーを接続しました。");
        handlersConnected++;
    }
    
    // アクティブユーザー切り替えドロップダウン
    const userSelect = document.getElementById('active_user_select');
    if (userSelect) {
        userSelect.addEventListener('change', (event) => {
            const selectedUser = event.target.value;
            Foundation.setActiveUser(selectedUser);
            
            // 状態を更新し、UIを再描画
            const state = Foundation.getCurrentState();
            const tensionInstance = Foundation.getTensionInstance();
            const matrix = new Arithmos.ControlMatrix(tensionInstance);
            UI.updateUI(state, `ユーザーを ${selectedUser} に切り替えました。`, { intensity: matrix.intensity, rigor: matrix.rigor });
        });
        console.log("[Handler]: ✅ ユーザー切り替えリスナーを接続しました。");
        handlersConnected++;
    }


    console.log(`[Handler]: イベントハンドラ接続完了。合計 ${handlersConnected} 件を接続しました。`);
}
