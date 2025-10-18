// app/fusionui.js (多通貨ポートフォリオ表示対応版)

// ロゴス緊張度と暴走抑止の閾値
const TENSION_ALERT_THRESHOLD = 0.75;
const PRIMARY_CURRENCY = "USD"; // メインの残高表示に使用する通貨

/**
 * UIの各要素を更新し、コンソールに結果を表示する
 * @param {object} stateData core/foundation.jsから取得した最新の状態データ
 * @param {string|null} resultMessage ユーザーに表示する最新の操作結果メッセージ
 * @param {object} matrixData arithmos.jsから計算されたI/Rデータ
 */
export function updateUI(stateData, resultMessage, matrixData) {
    
    // 1. TENSION/I/R の更新 (変更なし)
    const T = stateData.tension_level;
    document.getElementById('tension_level_display').textContent = `T: ${T.toFixed(4)}`;
    document.getElementById('intensity_display').textContent = matrixData.intensity.toFixed(4);
    document.getElementById('rigor_display').textContent = matrixData.rigor.toFixed(4);

    // ... (ゲージの更新ロジックは省略、変更なし) ...
    const tensionBar = document.getElementById('tension_level_display_bar');
    const tensionWidth = (T * 100).toFixed(2);
    tensionBar.style.width = `${tensionWidth}%`;
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

    // 2. 🌟 アクティブユーザーと残高の更新 (多通貨対応)
    const activeUser = stateData.active_user;
    const userAccounts = stateData.accounts;
    const activePortfolio = userAccounts[activeUser] || {};
    
    // 2-1. メインヘッダー表示 (PRIMARY_CURRENCY: USD)
    document.getElementById('active_user_name').textContent = activeUser;
    const primaryBalance = activePortfolio[PRIMARY_CURRENCY] || 0.00;
    document.getElementById('balance_display').textContent = primaryBalance.toFixed(2);

    // 2-2. 🌟 全通貨ポートフォリオリストの動的生成
    // HTMLに <div id="active_portfolio_list"> が存在することを前提とします。
    const portfolioListContainer = document.getElementById('active_portfolio_list');
    
    // ポートフォリオリストが存在しない場合、ユーザー残高表示の下に一時的に表示領域を作成します
    // これにより、index.htmlの変更がなくても多通貨情報が確認できます。
    if (!portfolioListContainer) {
        // user_balance_display の後に挿入
        const userBalanceP = document.getElementById('user_balance_display');
        const newDiv = document.createElement('div');
        newDiv.id = 'active_portfolio_list';
        newDiv.style.marginTop = '5px';
        newDiv.style.borderTop = '1px solid #444';
        newDiv.style.paddingTop = '5px';
        userBalanceP.parentNode.insertBefore(newDiv, userBalanceP.nextSibling);
    }
    const targetContainer = document.getElementById('active_portfolio_list');
    targetContainer.innerHTML = ''; // クリア

    Object.keys(activePortfolio).forEach(currency => {
        const amount = activePortfolio[currency];
        const p = document.createElement('p');
        p.style.fontSize = '0.9em';
        p.style.margin = '2px 0';
        p.textContent = `  - ${currency}: ${amount.toFixed(4)}`;
        targetContainer.appendChild(p);
    });

    // 2-3. アクティブユーザー選択ドロップダウンの更新
    const userSelect = document.getElementById('active_user_select');
    userSelect.innerHTML = ''; 
    
    Object.keys(userAccounts).forEach(user => {
        const totalUsd = userAccounts[user][PRIMARY_CURRENCY] || 0.00;
        const option = document.createElement('option');
        option.value = user;
        option.textContent = `${user} (USD: ${totalUsd.toFixed(2)})`;
        if (user === activeUser) {
            option.selected = true; 
        }
        userSelect.appendChild(option);
    });

    // 3. 状態メッセージの更新 (変更なし)
    document.getElementById('status_message').textContent = `[STATUS]: ${stateData.status_message}`;
    
    // 4. 監査ログへの結果メッセージ出力 (変更なし)
    if (resultMessage) {
        displayDialogue('CORE_STATUS', resultMessage);
    }
}


/**
 * メインログエリアに対話またはシステムメッセージを出力する (変更なし)
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
    
    outputDiv.scrollTop = outputDiv.scrollHeight;
}
