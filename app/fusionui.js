// app/fusionui.js (最終確定版)

// 修正: protocol_lrp.js のインポートと、LRPコマンド処理を削除

const UI_ELEMENTS = {
    DIALOGUE_OUTPUT: 'dialogue-output',
    BALANCE_DISPLAY: 'balance_display',
    TENSION_BAR: 'tension_level_display_bar',
    TENSION_TEXT: 'tension_level_display',
    INTENSITY_DISPLAY: 'intensity_display',
    RIGOR_DISPLAY: 'rigor_display',
    AUTONOMY_STATUS: 'autonomy_status',
    STATUS_MESSAGE: 'status_message',
};

/**
 * handler/mainから渡されたデータに基づき、UIの状態を一括で更新する。
 * これはLRPコマンド処理の代替となる統合関数です。
 */
export function updateUI(stateData, actMsg, matrixData) {
    // 1. バランス
    const balanceEl = document.getElementById(UI_ELEMENTS.BALANCE_DISPLAY);
    if (balanceEl) balanceEl.innerText = stateData.accounts.User_A.toFixed(2);
    
    // 2. 監査ログ
    if (actMsg) appendAuditLog(actMsg);

    // 3. 緊張度 (T)
    const tension = stateData.tension_level;
    const barEl = document.getElementById(UI_ELEMENTS.TENSION_BAR);
    if (barEl) barEl.style.width = `${tension * 100}%`;
    
    const textEl = document.getElementById(UI_ELEMENTS.TENSION_TEXT);
    if (textEl) textEl.innerText = `T: ${tension.toFixed(4)}`;
    
    // 4. 制御パラメータ (I/R)
    const intensityEl = document.getElementById(UI_ELEMENTS.INTENSITY_DISPLAY);
    if (intensityEl) intensityEl.innerText = (matrixData.intensity || 0).toFixed(4);
    const rigorEl = document.getElementById(UI_ELEMENTS.RIGOR_DISPLAY);
    if (rigorEl) rigorEl.innerText = (matrixData.rigor || 0).toFixed(4);
    
    // 5. 暴走抑止ステータスの更新
    updateAutonomyStatus(tension);
    
    // 6. ステータスメッセージ
    const statusEl = document.getElementById(UI_ELEMENTS.STATUS_MESSAGE);
    if (statusEl) statusEl.innerText = `[STATUS]: ${stateData.status_message}`;
}


/**
 * 対話メッセージを表示する。
 */
export function displayDialogue(sender, text) {
    const dialogueEl = document.getElementById(UI_ELEMENTS.DIALOGUE_OUTPUT);
    if (dialogueEl) {
        const messageDiv = document.createElement('div');
        const isUser = sender === 'User';
        messageDiv.className = isUser ? 'user-message' : 'ai-message';
        messageDiv.innerHTML = `<strong>[${sender}]:</strong> ${text}`;
        dialogueEl.appendChild(messageDiv);
        dialogueEl.scrollTop = dialogueEl.scrollHeight;
    }
}

/**
 * 監査ログを追記するヘルパー。
 */
function appendAuditLog(text) {
    const logEl = document.getElementById(UI_ELEMENTS.DIALOGUE_OUTPUT);
    if (logEl && text) {
        const logDiv = document.createElement('div');
        logDiv.className = 'ai-message';
        logDiv.style.fontSize = '0.8em';
        logDiv.innerHTML = `[AUDIT LOG]: ${text}`;
        logEl.appendChild(logDiv);
        logEl.scrollTop = logEl.scrollHeight;
    }
}

/**
 * ロゴス緊張度に基づき、暴走抑止ステータスを更新する純粋なロジック。
 */
function updateAutonomyStatus(tension) {
    const statusEl = document.getElementById(UI_ELEMENTS.AUTONOMY_STATUS);
    if (!statusEl) return;
    
    let statusColor = ''; 

    if (tension < 0.25) {
        statusEl.innerHTML = '暴走抑止ステータス: **低緊張**';
        statusColor = 'var(--color-accent-blue)';
    } else if (tension < 0.80) {
        statusEl.innerHTML = '暴走抑止ステータス: **警告**';
        statusColor = '#ffc107'; // 黄色
    } else {
        statusEl.innerHTML = '暴走抑止ステータス: **閾値超過リスク**';
        statusColor = 'var(--color-alert-red)';
    }
    
    statusEl.style.color = statusColor;
}
