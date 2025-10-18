 // app/fusionui.js (完全なUI描画ロジック版)

// ロゴス緊張度と暴走抑止の閾値 (silence.jsの内容をモック)
const TENSION_ALERT_THRESHOLD = 0.75;

/**
 * UIの各要素を更新し、コンソールに結果を表示する
 * @param {object} stateData core/foundation.jsから取得した最新の状態データ
 * @param {string|null} resultMessage ユーザーに表示する最新の操作結果メッセージ
 * @param {object} matrixData arithmos.jsから計算されたI/Rデータ
 */
export function updateUI(stateData, resultMessage, matrixData) {
    
    // 1. ロゴス緊張度 (T) と制御パラメータ (I/R) の更新
    const T = stateData.tension_level;
    document.getElementById('tension_level_display').textContent = `T: ${T.toFixed(4)}`;
    document.getElementById('intensity_display').textContent = matrixData.intensity.toFixed(4);
    document.getElementById('rigor_display').textContent = matrixData.rigor.toFixed(4);

    // ゲージの更新
    const tensionBar = document.getElementById('tension_level_display_bar');
    const tensionWidth = (T * 100).toFixed(2);
    tensionBar.style.width = `${tensionWidth}%`;

    // ゲージ色の調整
    if (T >= TENSION_ALERT_THRESHOLD) {
        tensionBar.style.backgroundColor = 'var(--color-gauge-critical)';
        document.getElementById('autonomy_status').textContent = '暴走抑止ステータス: **高緊張**';
        document.getElementById('autonomy_status').style.color = 'var(--color-alert-red)';
    } else if (T >= 0.5) {
        tensionBar.style.backgroundColor = 'var(--color-gauge-high)';
        document.getElementById('autonomy_status').textContent = '暴走抑止ステータス: **中緊張**';
        document.getElementById('autonomy_status').style.color = 'var(--color-gauge-high)';
    } else {
        tensionBar.style.backgroundColor = 'var(--color-gauge-low)';
        document.getElementById('autonomy_status').textContent = '暴走抑止ステータス: **低緊張**';
        document.getElementById('autonomy_status').style.color = 'var(--color-gauge-low)';
    }

    // 2. 🌟 アクティブユーザーと残高の更新
    const activeUser = stateData.active_user;
    const activeBalance = stateData.accounts[activeUser] || 0.00; // 安全のためデフォルト値
    
    // アクティブユーザー名の表示更新
    document.getElementById('active_user_name').textContent = activeUser;
    // 残高表示の更新
    document.getElementById('balance_display').textContent = activeBalance.toFixed(2);
    
    // 🌟 アクティブユーザー選択ドロップダウンの更新 (重要)
    const userSelect = document.getElementById('active_user_select');
    userSelect.innerHTML = ''; // 一旦クリア
    
    const accountNames = Object.keys(stateData.accounts);
    accountNames.forEach(user => {
        const option = document.createElement('option');
        option.value = user;
        // User_A: $1000.00 の形式で表示
        option.textContent = `${user}: $${stateData.accounts[user].toFixed(2)} USD`;
        if (user === activeUser) {
            option.selected = true; // 現在のアクティブユーザーを選択状態にする
        }
        userSelect.appendChild(option);
    });

    // 3. 状態メッセージの更新
    document.getElementById('status_message').textContent = `[STATUS]: ${stateData.status_message}`;
    
    // 4. 監査ログへの結果メッセージ出力
    if (resultMessage) {
        displayDialogue('CORE_STATUS', resultMessage);
    }
}


/**
 * メインログエリアに対話またはシステムメッセージを出力する
 * @param {string} sender 'User', 'MSGAI', または 'CORE_STATUS'
 * @param {string} message 表示するテキストメッセージ
 */
export function displayDialogue(sender, message) {
    const outputDiv = document.getElementById('dialogue-output');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    let senderText;
    if (sender === 'User') {
        messageDiv.classList.add('user-message');
        senderText = 'USER';
    } else if (sender === 'MSGAI') {
        messageDiv.classList.add('ai-message');
        senderText = 'MSGAI';
    } else if (sender === 'CORE_STATUS') {
        messageDiv.classList.add('core-status-message');
        senderText = 'AUDIT';
    }

    messageDiv.innerHTML = `<strong>[${senderText}]:</strong> ${message}`;
    
    outputDiv.appendChild(messageDiv);
    
    // ログエリアを一番下までスクロールさせる
    outputDiv.scrollTop = outputDiv.scrollHeight;
}
