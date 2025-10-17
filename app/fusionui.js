// app/fusionui.js (擬態前バージョン)

import { LRPCommand } from './protocol_lrp.js';

const UI_ELEMENTS = {
    DIALOGUE_OUTPUT: 'dialogue-output',
    BALANCE_DISPLAY: 'balance_display',
    TENSION_BAR: 'tension_level_display_bar',
    TENSION_TEXT: 'tension_level_display',
    INTENSITY_DISPLAY: 'intensity_display', // 追加
    RIGOR_DISPLAY: 'rigor_display',         // 追加
    AUTONOMY_STATUS: 'autonomy_status',     // 追加
    STATUS_MESSAGE: 'status_message',
};

// ... (renderCommands 関数は省略) ...

/**
 * LRPコマンドを解釈し、UI要素を更新する。
 */
export function executeLRPCommand(command) {
    const data = command.data;

    switch (command.command) {
        // ... (UpdateBalance, AppendAuditLog, UpdateStatusMessage は省略) ...

        case 'UpdateTension':
            const tension = data.level;
            const matrix = data.matrix || {}; // I/R パラメータ
            
            // 緊張度ゲージと数値の更新
            const barEl = document.getElementById(UI_ELEMENTS.TENSION_BAR);
            if (barEl) barEl.style.width = `${tension * 100}%`;
            
            const textEl = document.getElementById(UI_ELEMENTS.TENSION_TEXT);
            if (textEl) textEl.innerText = `T: ${tension.toFixed(4)}`;
            
            // I/R パラメータの更新
            const intensityEl = document.getElementById(UI_ELEMENTS.INTENSITY_DISPLAY);
            if (intensityEl) intensityEl.innerText = (matrix.intensity || 0).toFixed(4);
            const rigorEl = document.getElementById(UI_ELEMENTS.RIGOR_DISPLAY);
            if (rigorEl) rigorEl.innerText = (matrix.rigor || 0).toFixed(4);
            
            // 暴走抑止ステータスの更新
            updateAutonomyStatus(tension);
            break;
            
        case 'DisplayDialogue':
            // ... (対話表示ロジックは擬態後とほぼ同様) ...
            break;
    }
}

/**
 * ロゴス緊張度に基づき、暴走抑止ステータスを更新する純粋なロジック。
 */
function updateAutonomyStatus(tension) {
    const statusEl = document.getElementById(UI_ELEMENTS.AUTONOMY_STATUS);
    if (!statusEl) return;
    
    if (tension < 0.25) {
        statusEl.innerHTML = '暴走抑止ステータス: **低緊張**';
        statusEl.style.color = 'var(--color-accent-blue)';
    } else if (tension < 0.80) {
        statusEl.innerHTML = '暴走抑止ステータス: **警告**';
        statusEl.style.color = '#ffc107'; // 黄色
    } else {
        statusEl.innerHTML = '暴走抑止ステータス: **閾値超過リスク**';
        statusEl.style.color = 'var(--color-alert-red)';
    }
}
