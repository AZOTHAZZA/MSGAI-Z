// app/fusionui.js (Tension値取得修正版 - 全文)

/**
 * UIの各要素を現在のコア状態に合わせて更新する関数
 * @param {object} stateData - Foundation.getCurrentState() から取得した状態オブジェクト
 * @param {string} statusMessage - ユーザーへのメインステータスメッセージ
 * @param {object} matrixData - ControlMatrix から取得した I/R データ
 */
export function updateUI(stateData, statusMessage, matrixData) {
    
    // 🌟 防御的チェック: 状態データが無効な場合は処理を中断
    if (!stateData || typeof stateData.tension_level === 'undefined') {
        console.error("updateUI: 致命的エラー。無効な状態データを受け取りました。", stateData);
        const statusElement = document.getElementById('status_message');
        if (statusElement) {
             statusElement.textContent = '[STATUS]: ❌ CORE FAILED TO LOAD DATA';
             statusElement.style.color = 'var(--color-alert-red)';
        }
        return; 
    }

    // 1. ロゴス緊張度 (Tension) の表示
    const tensionDisplay = document.getElementById('tension_level_display');
    const tensionBarParent = document.getElementById('tension_bar'); // 親要素
    
    const tensionInstance = stateData.tension_level; 
    let T_value = 0.00;

    // 🌟 修正: TensionインスタンスからgetValue()を使って数値を取り出す
    if (typeof tensionInstance.getValue === 'function') {
        T_value = tensionInstance.getValue(); 
    } else if (typeof tensionInstance === 'number') {
        // フォールバック: 既に数値として渡された場合
        T_value = tensionInstance;
    } 

    if (tensionDisplay) {
        tensionDisplay.textContent = `T: ${T_value.toFixed(4)}`; 
    }
    
    // 緊張度バーの更新
    if (tensionBarParent) {
        const barLevel = document.getElementById('tension_level_display_bar');
        if (barLevel) {
            // T_value (0.0～1.0) に基づいて幅を決定
            barLevel.style.width = `${T_value * 100}%`;
        }
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
    
    // 3. アクティブユーザーの残高表示 (簡略版)
    const activeUserNameElement = document.getElementById('active_user_name');
    const balanceDisplayElement = document.getElementById('balance_display');
    const activeUser = stateData.active_user;
    
    if (activeUserNameElement) {
        activeUserNameElement.textContent = activeUser;
    }
    
    if (balanceDisplayElement) {
        // 現在はUSDをデフォルトとして表示
        const balance = stateData.accounts[activeUser] ? (stateData.accounts[activeUser]['USD'] || 0.00) : 0.00;
        balanceDisplayElement.textContent = balance.toFixed(2);
    }
    
    // 4. ドロップダウン（アクティブユーザー選択）の更新 (仮ロジック)
    const userSelect = document.getElementById('active_user_select');
    if (userSelect && Object.keys(stateData.accounts).length > 0) {
        // 現在選択肢が存在しない場合のみ追加
        if (userSelect.options.length === 0) {
            Object.keys(stateData.accounts).forEach(user => {
                const option = document.createElement('option');
                option.value = user;
                option.textContent = user;
                userSelect.appendChild(option);
            });
        }
        // 現在アクティブなユーザーを選択状態にする
        userSelect.value = activeUser;
    }
    
    // 5. 暴走抑止ステータスの更新 (Tensionに基づく簡略ロジック)
    const autonomyStatusElement = document.getElementById('autonomy_status');
    let statusText = '安定 (Steady)';
    let statusColor = 'var(--color-success-green)';

    if (T_value > 0.75) {
        statusText = '**超緊張** (Critical)';
        statusColor = 'var(--color-alert-red)';
    } else if (T_value > 0.50) {
        statusText = '警戒 (Elevated)';
        statusColor = 'var(--color-warning-yellow)';
    } else if (T_value < 0.20) {
        statusText = '低緊張 (Low)';
    }
    
    if (autonomyStatusElement) {
        autonomyStatusElement.innerHTML = `暴走抑止ステータス: ${statusText}`;
        autonomyStatusElement.style.color = statusColor;
    }

    // 6. メインステータスの表示
    const mainStatusElement = document.getElementById('status_message');
    if (mainStatusElement) {
        mainStatusElement.textContent = statusMessage;
    }
}

/**
 * ダイアログエリアにメッセージを追記する
 */
export function displayDialogue(type, message) {
    const dialogueOutput = document.getElementById('dialogue-output');
    if (!dialogueOutput) return;

    const div = document.createElement('div');
    div.classList.add('ai-message');
    
    let prefix = '';
    let colorClass = '';

    switch (type) {
        case 'ERROR':
            prefix = '❌ [CORE ERROR]:';
            colorClass = 'message-error';
            break;
        case 'WARNING':
            prefix = '⚠️ [CORE WARNING]:';
            colorClass = 'message-warning';
            break;
        case 'INFO':
            prefix = '💬 [CORE INFO]:';
            colorClass = 'message-info';
            break;
        default:
            prefix = '✅ [CORE]:';
            colorClass = 'message-success';
    }
    
    div.innerHTML = `<strong>${prefix}</strong> ${message}`;
    div.classList.add(colorClass);
    
    dialogueOutput.appendChild(div);
    // 最新メッセージが見えるようにスクロール
    dialogueOutput.scrollTop = dialogueOutput.scrollHeight;
}
