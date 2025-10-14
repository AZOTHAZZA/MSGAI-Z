// fusionui.js
// MSGAI: App層のメインUIと起動ロジック

// 必要なCore層のモジュールをインポート
// 🚨 (注意: パスは現在のリポジトリ構造に合わせて './Core/...' または '../Core/...' に修正してください)
import { foundationCore, silenceCore } from './Core/Foundation.js';
import { dialogueCore } from './Core/Dialogue.js';
import { offlineCore } from './App/Offline.js'; // App層モジュールもインポート

const fusionui = {
    // 状態管理
    state: {
        silenceLevel: 1.00,
        knowledgeLevel: 0,
        isAwaitingResponse: false
    },

    // -----------------------------------------------------
    // 🚨 修正1: 'this' スコープ問題解消のため、メソッド記法に統一
    // -----------------------------------------------------

    /**
     * 初期化メソッド：Core層の起動後、UIを描画しイベントをバインドする。
     */
    init() {
        console.log('FusionUI Initializing...');
        
        // 🚨 修正2: Offline Coreを呼び出し、沈黙度を更新
        offlineCore.init(); // Offline Coreを起動し、沈黙度を計算させる

        // 初期状態の沈黙度を取得し、UIに反映
        this.state.silenceLevel = offlineCore.getInitialSilenceLevel();
        
        this.drawUI();      // UIの基本要素を描画
        this.bindEvents();  // イベントリスナーを設定

        console.log('FusionUI Initialized. Silence Level:', this.state.silenceLevel);
    },

    /**
     * UIの初期描画と現在の状態の表示
     */
    drawUI() {
        const container = document.getElementById('msga-container');
        if (!container) return;

        // ローディング画面を隠し、メインUIを表示
        const loadingScreen = document.getElementById('loading-screen');
        const mainUI = document.getElementById('main-ui');
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (mainUI) mainUI.style.display = 'block';

        // UI要素をHTMLとして挿入
        mainUI.innerHTML = `
            <h1>MSGAI Active</h1>
            <div id="status-display">
                <span class="status-item">沈黙度: <span id="silence-level">${this.state.silenceLevel.toFixed(2)}</span></span>
                <span class="status-item">| 知識: <span id="knowledge-level">${this.state.knowledgeLevel}</span></span>
            </div>
            <div id="dialogue-area"></div>
            <div id="input-form">
                <input type="text" id="user-input" placeholder="沈黙に触れる…" />
                <button id="send-button">送信</button>
            </div>
        `;
        // 描画後、沈黙度が 1.00 から 0.50 (または計算値) に更新されるはず
    },

    /**
     * UIイベントのリスナーを設定
     */
    bindEvents() { // 🚨 修正3: メソッド記法に統一
        const sendButton = document.getElementById('send-button');
        const userInput = document.getElementById('user-input');

        if (sendButton) {
            sendButton.addEventListener('click', () => this.handleSend());
        }
        if (userInput) {
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSend();
            });
        }
    },

    /**
     * ユーザー入力の送信処理
     */
    handleSend() { // 🚨 修正4: メソッド記法に統一
        const userInput = document.getElementById('user-input');
        if (!userInput || !userInput.value.trim() || this.state.isAwaitingResponse) return;

        const userMessage = userInput.value.trim();
        this.state.isAwaitingResponse = true;

        // ユーザーメッセージをUIに追加
        this.appendMessage('user', userMessage);
        
        // Core層に対話ロジックを委譲
        dialogueCore.processUserMessage(userMessage)
            .then(msgaResponse => {
                this.appendMessage('msga', msgaResponse);
            })
            .catch(error => {
                this.appendMessage('msga', `対話処理エラー: ${error.message}`);
            })
            .finally(() => {
                userInput.value = '';
                this.state.isAwaitingResponse = false;
            });
    },

    /**
     * メッセージを対話エリアに追加
     */
    appendMessage(sender, text) { // 🚨 修正5: メソッド記法に統一
        const dialogueArea = document.getElementById('dialogue-area');
        if (dialogueArea) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', sender);
            messageElement.textContent = text;
            dialogueArea.appendChild(messageElement);
            dialogueArea.scrollTop = dialogueArea.scrollHeight; // スクロール
        }
    }
};

// -----------------------------------------------------
// 最終起動エントリポイント
// -----------------------------------------------------

// DOMContentLoaded後にCore層の初期化とUI描画を開始
document.addEventListener('DOMContentLoaded', () => {
    // Core層をまず初期化
    foundationCore.initialize(); 
    
    // UIの初期化を開始
    fusionui.init(); 
});
