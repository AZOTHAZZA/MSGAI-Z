// fusionui.js (updateUI 防御的修正版)

// ... (他の import や UI ヘルパー関数は省略) ...

/**
 * UIの各要素を現在のコア状態に合わせて更新する関数
 * @param {object} stateData - Foundation.getCurrentState() から取得した状態オブジェクト
 * @param {string} statusMessage - ユーザーへのメインステータスメッセージ
 * @param {object} matrixData - ControlMatrix から取得した I/R データ
 */
export function updateUI(stateData, statusMessage, matrixData) {
    // 🌟 修正: 状態データが不正な場合の防御的チェック
    if (!stateData || typeof stateData.tension_level === 'undefined' || typeof stateData.accounts === 'undefined') {
        console.error("updateUI: 致命的エラー。無効な状態データを受け取りました。初期化エラーの可能性があります。", stateData);
        
        const statusElement = document.getElementById('status_message');
        if (statusElement) {
             statusElement.textContent = '[STATUS]: ❌ CORE FAILED TO LOAD DATA';
             statusElement.style.color = 'var(--color-alert-red)';
        }
        
        // 処理を安全に中断
        return; 
    }

    const T = stateData.tension_level; 
    const activeUser = stateData.active_user;
    const balanceData = stateData.accounts[activeUser];
    
    // 1. ロゴス緊張度 (Tension) の表示
    const tensionDisplay = document.getElementById('tension_level_display');
    const tensionBar = document.getElementById('tension_level_display_bar');
    
    if (tensionDisplay) {
        tensionDisplay.textContent = `T: ${T.toFixed(4)}`;
    }
    if (tensionBar) {
        // Tは 0.0 から 1.0 の範囲を想定
        tensionBar.style.width = `${T * 100}%`;
    }

    // 2. 制御パラメータ (I/R) の表示
    const intensityDisplay = document.getElementById('intensity_display');
    const rigorDisplay = document.getElementById('rigor_display');

    if (intensityDisplay && matrixData) {
        intensityDisplay.textContent = matrixData.intensity.toFixed(4);
    }
    if (rigorDisplay && matrixData) {
        rigorDisplay.textContent = matrixData.rigor.toFixed(4);
    }

    // 3. アクティブユーザーの残高表示
    const balanceDisplay = document.getElementById('balance_display');
    const activeUserNameDisplay = document.getElementById('active_user_name');
    
    // ユーザーと残高が確実に存在する場合のみ更新
    if (activeUserNameDisplay) {
        activeUserNameDisplay.textContent = activeUser;
    }
    if (balanceDisplay && balanceData && balanceData["USD"] !== undefined) {
        // デフォルトでUSDを表示
        balanceDisplay.textContent = balanceData["USD"].toFixed(2);
    }
    
    // 4. アクティブユーザー選択ドロップダウンの更新 (未実装の場合はスキップ)
    const userSelect = document.getElementById('active_user_select');
    if (userSelect) {
        // ユーザーリストを生成または更新 (ロジックは省略)
        if (userSelect.options.length === 0) {
            Object.keys(stateData.accounts).forEach(user => {
                const option = document.createElement('option');
                option.value = user;
                option.textContent = user;
                userSelect.appendChild(option);
            });
        }
        userSelect.value = activeUser;
    }
    
    // 5. メインステータスの表示
    const mainStatusElement = document.getElementById('status_message');
    if (mainStatusElement) {
        mainStatusElement.textContent = statusMessage;
    }
}

// ... (他の export された関数が続く) ...

// export function displayDialogue(title, message) { /* ... */ } 
