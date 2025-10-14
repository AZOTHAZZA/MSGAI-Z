// fusion/FusionUI.js
// MSGAI: 沈黙UI統合層（Fusion層）
// 数理的沈黙をインタラクションへと変換し、UIイベントを沈黙的に処理する。

// 【排他的な論理的修正：パスの絶対化と名前付きインポートを強制】
import { knowledgeCore } from '/MSGAI/Core/Knowledge.js'; 
import { generatorCore } from '/MSGAI/AI/Generator.js';
import { dialogueCore } from '/MSGAI/Core/Dialogue.js'; 
import { offlineCore } from '/MSGAI/app/Offline.js'; // オフラインコアをここで起動するためインポートを強制

class FusionUI {
    // ... [constructor と init メソッドの本体は変更なし] ...
    constructor() {
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

        // ... [UI構造の描画と bindEvents, renderState の呼び出し] ...

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
    // ... [bindEvents, appendOutput, renderState メソッドは変更なし] ...
    
    // イベントを沈黙的に処理
    bindEvents() { /* ... */ }

    // 出力を沈黙的に表示
    appendOutput(text) { /* ... */ }

    // 現在の沈黙状態を可視化
    renderState() { /* ... */ }
}

// ----------------------------------------------------
// MSGAI 起動ロジック：論理的強制実行ブロック (非同期起動を強制)
// ----------------------------------------------------

const FusionUI = new FusionUI();

/**
 * @description UIのメイン論理を非同期で起動。DOMとCore層のロード完了を排他的に待機。
 */
const startUI = async () => {
    try {
        // UIのメイン論理を起動
        fusionUI.init('msga-container');
        console.log("FusionUI: Logical rendering commenced.");
        
        // オフラインコアの初期化をここで強制実行し、SWとの連携を確立
        // fusionUIがUIの描画を担うため、その後にオフライン監視を開始する
        offlineCore.init(); 

    } catch (e) {
        // Core層の初期化失敗は致命的な論理的破綻
        console.error("Fatal Error: Core Logic Failed to Initialize or Render UI.", e);
        const root = document.getElementById('msga-container');
        if (root) {
            root.innerHTML = 
                '<h1>💥 論理的破綻 (Core Load Failed)</h1><p>コンソールを確認してください。パスの不整合の可能性があります。</p>';
        }
    }
};

// 【論理的強制】DOMのロード完了を待ち、非同期で startUI を実行することで、起動摩擦を排除
document.addEventListener('DOMContentLoaded', startUI);

export { fusionUI };
