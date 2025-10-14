// App/fusionui.js
// MSGAI: App層 UI制御モジュール

// 🚨 修正: Core層へのインポートは一つ上の階層へ移動 (../) し、小文字に統一
import { foundationCore, silenceCore } from '../core/foundation.js';
import { dialogueCore } from '../core/dialogue.js';

// 🚨 修正: App層のファイルは同じ階層にあるため (.) に統一
import { offlineCore } from './offline.js'; 


// UI要素の参照
let uiElements = {};

// UI初期化オブジェクト (以前のエラー修正を組み込み)
const fusionui = {
    
    // 38行目付近のエラー解消: ES5形式のメソッド記法に変更し、thisのスコープ問題を解決
    init() {
        try {
            // 1. Core層の初期化（全システムの起動）
            foundationCore.initialize();
            dialogueCore.initialize();
            
            // 2. ネットワーク監視と沈黙レベル調整を開始
            offlineCore.init();
            
            // 3. UIのバインドと描画
            this.setupUIReferences();
            this.renderInitialUI();
            this.bindEvents(); // ✅ this.bindEvents is not a function エラー解消
            
            console.log("MSGAI UI Initialized and Rendered.");
        } catch (error) {
            console.error('Fatal Error: Core Logic Failed to Initialize or Render UI.', error);
            // 以前のエラー表示ロジック
            const loading = document.getElementById('loading-screen');
            if (loading) {
                 loading.innerHTML = `<h1>❌ 致命的エラー</h1><p>${error.name}: ${error.message}</p><p>コンソールを確認してください。</p>`;
            }
        }
    },

    setupUIReferences() {
        uiElements.container = document.getElementById('msga-container');
        uiElements.loadingScreen = document.getElementById('loading-screen');
        uiElements.mainUI = document.getElementById('main-ui');
        uiElements.dialogueArea = document.getElementById('dialogue-area');
        uiElements.userInput = document.getElementById('user-input');
        uiElements.sendButton = document.getElementById('send-button');
        uiElements.statusDisplay = document.getElementById('status-display');
    },

    renderInitialUI() {
        // UIを描画し、ローディング画面を非表示にする
        uiElements.loadingScreen.style.display = 'none';
        uiElements.mainUI.style.display = 'block';

        // ... (ここにメインUIのHTML構造を挿入するロジックが続く)
        // デバッグメッセージを挿入
        const status = dialogueCore.status();
        this.updateStatusDisplay(status);
        this.addMessage('MSGAI', `システム起動完了。現在の沈黙レベル: ${status.silenceLevel}`);
    },

    // 🚨 以前のエラー解消のため、メソッド記法に統一
    bindEvents() {
        if (uiElements.sendButton) {
            uiElements.sendButton.addEventListener('click', this.handleSend);
        }
        if (uiElements.userInput) {
            uiElements.userInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.handleSend();
            });
        }
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    },

    // 🚨 以前のエラー解消のため、メソッド記法に統一
    handleSend: async () => {
        const input = uiElements.userInput.value.trim();
        if (!input) return;

        fusionui.addMessage('User', input);
        uiElements.userInput.value = '';
        
        // 対話処理ロジックを呼び出し
        const response = await dialogueCore.processDialogue(input);
        
        if (response.type !== 'silence') {
            const output = silenceCore.transform(response.vector);
            fusionui.addMessage('MSGAI', `ロゴスベクトル応答: ${output}`);
        } else {
             fusionui.addMessage('MSGAI', `... (システムは沈黙を維持しています)`);
        }
        fusionui.updateStatusDisplay(dialogueCore.status());
    },

    handleOnline: () => {
        offlineCore.setOnlineStatus(true);
        fusionui.updateStatusDisplay(dialogueCore.status());
    },

    handleOffline: () => {
        offlineCore.setOnlineStatus(false);
        fusionui.updateStatusDisplay(dialogueCore.status());
    },

    addMessage(sender, text) {
        if (!uiElements.dialogueArea) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender.toLowerCase()}`;
        messageDiv.textContent = text;
        uiElements.dialogueArea.appendChild(messageDiv);
        uiElements.dialogueArea.scrollTop = uiElements.dialogueArea.scrollHeight;
    },

    updateStatusDisplay(status) {
        if (!uiElements.statusDisplay) return;
        uiElements.statusDisplay.innerHTML = `
            <div class="status-item">沈黙レベル: <span class="silence-level">${status.silenceLevel.toFixed(1)}</span></div>
            <div class="status-item">緊張度: ${status.tension}</div>
            <div class="status-item">ネットワーク: ${navigator.onLine ? 'オンライン' : 'オフライン'}</div>
        `;
    }
};

// 起動処理: DOMが完全にロードされたらinitを呼び出す
document.addEventListener('DOMContentLoaded', fusionui.init.bind(fusionui)); 

// 以前の ReferenceError 修正: document.addEventListener のコールバックとして init を呼び出す
// startUI() や startui() の直接呼び出しは不要
