// core/app/fusionui.js

// 具象的なUI表示を制御し、ロゴスシステムの情報をユーザーに伝達する層

// ターゲットのUI要素を取得 (HTMLのIDに依存)
const chatWindow = document.getElementById('chat-window');
const destinationTypeSelect = document.getElementById('destination-type-select');
const internalFields = document.getElementById('internal-transfer-fields');
const externalFields = document.getElementById('external-transfer-fields');
const statusMessage = document.getElementById('status-message');
const tensionLevelSpan = document.getElementById('tension-level');
const accountBalanceSpan = document.getElementById('account-balance');

// =========================================================================
// 1. 基本UIヘルパー
// =========================================================================

/**
 * 現在設定されているユーザーネームを取得する。
 * @returns {string} 現在のユーザーネーム
 */
export function getCurrentUserName() {
    return document.getElementById('username-input').value;
}

/**
 * チャットウィンドウに新しいメッセージバブルを表示する。
 */
export function displayChatBubble(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble chat-bubble--${sender === 'MSGAI' ? 'msgaicore' : 'user'}`;
    bubble.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

/**
 * ステータスメッセージを専用エリアに表示する。
 */
export function displayStatusMessage(message, type) {
    statusMessage.innerText = message;
    statusMessage.className = `status-message status-message--${type}`; 
}

// =========================================================================
// 2. 金融作為UI制御（出島ゲートの切り替え）
// =========================================================================

/**
 * 送金種別に応じてUIフィールドを切り替える。
 */
function handleDestinationTypeChange(event) {
    const type = event.target.value;
    const sendButton = document.getElementById('send-transfer-button');
    
    if (type === 'INTERNAL') {
        internalFields.style.display = 'block';
        externalFields.style.display = 'none';
        sendButton.innerText = '内部移動作為を実行 (低摩擦)';
    } else if (type === 'EXTERNAL') {
        internalFields.style.display = 'none';
        externalFields.style.display = 'block';
        // 外部送金は高摩擦であることを視覚的に強調（純粋JS版でも論理は維持）
        sendButton.innerText = '外部送金/出金作為を実行 (擬似高摩擦)'; 
    }
}

// =========================================================================
// 3. ダッシュボード表示の更新
// =========================================================================

/**
 * ロゴス・ダッシュボードの表示を更新する。
 */
export function updateLogosDashboard(state) {
    tensionLevelSpan.innerText = state.tensionLevel.toFixed(4);
    
    // 緊張度に基づいて視覚的な警告を与える
    if (state.tensionLevel > 0.8) {
        tensionLevelSpan.style.color = 'red';
    } else {
        tensionLevelSpan.style.color = 'green';
    }

    accountBalanceSpan.innerText = `${state.accountBalance.toFixed(2)} USD`;
    displayStatusMessage('ダッシュボード状態を更新しました。', 'info');
}

// =========================================================================
// 4. 初期化とイベントリスナーの登録
// =========================================================================

// 送金種別によるUI切り替えのイベントリスナー
destinationTypeSelect.addEventListener('change', handleDestinationTypeChange);

// 初期状態の表示を設定
window.onload = () => {
    destinationTypeSelect.dispatchEvent(new Event('change'));
    displayStatusMessage('MSGAIフロントエンド (純粋JSモード) 起動。', 'info');
};
