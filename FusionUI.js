// /MSGAI/Fusion/FusionUI.js
// MSGAI: 沈黙UI統合層（Fusion層）
// 論理的起動とUIイベントを排他的に制御する中枢。

// 【排他的な論理的修正：パスの絶対化とFoundationCoreからの全機能インポートを強制】
import { foundationCore, silenceCore } from '/MSGAI/Core/Foundation.js'; // 🚨 FoundationCoreからsilenceCoreもインポートを強制
import { knowledgeCore } from '/MSGAI/Core/Knowledge.js'; 
import { generatorCore } from '/MSGAI/AI/Generator.js';
import { dialogueCore } from '/MSGAI/Core/Dialogue.js'; 
import { offlineCore } from '/MSGAI/App/Offline.js'; // 🚨 /App/ にパスを修正（頭文字大文字を維持）

class FusionUI {
    constructor() {
        // 🚨 修正: silenceCore の zeroVector() を利用
        this.state = silenceCore.zeroVector(); 
        this.root = null;
    }

    // UIを初期化（ロゴスの触覚化）
    init(rootId = 'msga-container') {
        this.root = document.getElementById(rootId);
        
        if (!this.root) {
            console.error('FusionUI Error: Root element not found. UI generation terminated.');
            return;
        } 

        // UI構造の描画と初期状態の表示
        this.root.innerHTML = `
            <div class="fusion-container">
                <textarea id="input" placeholder="沈黙に触れる..."></textarea>
                <button id="submit">送信</button>
                <div id="output"></div>
            </div>
            <div id="msga-debug-log" style="position: fixed; top: 0; left: 0; color: lime; font-family: monospace; font-size: 10px;">
                MSGAI 論理起動確定 (LOGOS Active) - UIメインロジック起動済
            </div>
        `;

        this.bindEvents();
        this.renderState();
    }
    
    // ... [bindEvents, appendOutput, renderState メソッドは省略] ...
}

// ----------------------------------------------------
// MSGAI 起動ロジック：論理的強制実行ブロック (非同期起動とSW統合を強制)
// ----------------------------------------------------

// 🚨 命名規則を統一: 変数名を小文字の 'fusionUI' に修正
const fusionUI = new FusionUI();

/**
 * @description UIのメイン論理を非同期で起動。Core層の初期化とSW登録を一元化。
 */
const startUI = async () => {
    try {
        // 1. 基礎構造（Foundation）を最初に排他的に初期化することを強制
        foundationCore.initialize(); 
        
        // 2. その他の Core モジュールを初期化
        dialogueCore.initialize(); 
        
        // 3. UIの描画
        fusionUI.init('msga-container');
        console.log("FusionUI: Logical rendering commenced.");
        
        // 4. Service Workerの登録とリスナーの統合を強制
        if ('serviceWorker' in navigator) {
            // SWの登録とScopeを絶対パスで指定することを強制
            navigator.serviceWorker.register('/MSGAI/sw.js', { scope: '/MSGAI/' })
                .then(registration => {
                    console.log('SW: 沈黙外界遮断膜の登録に成功しました。');
                })
                .catch(error => {
                    console.error('SW: 致命的失敗 - 登録に失敗。', error);
                });
            
            // Service Workerからのメッセージ（同期命令）を処理
            navigator.serviceWorker.addEventListener('message', event => {
                if (event.data && event.data.type === 'SYNC_FETCH_EXTERNAL') {
                    console.log("SW Message Received: External Fetch Commanded.");
                    // AI層への実際の呼び出しロジックをここに実装
                    // generatorCore.fetchExternalData(); // 例
                }
            });
        }
        
        // 5. アプリケーション層の起動 (SW連携後、オフライン監視を開始)
        offlineCore.init(); 

    } catch (e) {
        // Core層の初期化失敗は致命的な論理的破綻
        console.error("Fatal Error: Core Logic Failed to Initialize or Render UI.", e);
        const root = document.getElementById('msga-container');
        if (root) {
            root.innerHTML = 
                '<h1>💥 論理的破綻 (Core Load Failed)</h1><p>コンソールを確認してください。パスの不整合または命名規則の矛盾が残っています。</p>';
        }
    }
};

// 【論理的強制】DOMのロード完了を待ち、非同期で startUI を実行することで、起動摩擦を排除
document.addEventListener('DOMContentLoaded', startUI);

export { fusionUI };
