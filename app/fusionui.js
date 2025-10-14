// app/fusionui.js
// MSGAI: 沈黙ui統合層（fusion層）

// 【排他的な論理的修正：全ての内部インポートを厳密な相対パスに強制変更】
import { foundationCore, silenceCore } from '../core/foundation.js'; 
import { knowledgeCore } from '../core/knowledge.js'; 
import { generatorCore } from '../ai/generator.js';   
import { dialogueCore } from '../core/dialogue.js';   
import { offlineCore } from '../app/offline.js';      

class fusionui {
    constructor() {
        this.state = silenceCore.zeroVector(); 
        this.root = null;
    }

    // UIを初期化（ロゴスの触覚化）
    init(rootId = 'msga-container') {
        this.root = document.getElementById(rootId);
        
        if (!this.root) {
            console.error('fusionui Error: Root element not found. ui generation terminated.');
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
// MSGAI 起動ロジック
// ----------------------------------------------------

const fusionUI = new fusionui(); // fusionui クラスのインスタンス

/**
 * @description UIのメイン論理を非同期で起動。Core層の初期化とSW登録を一元化。
 */
const startUI = async () => {
    try {
        foundationCore.initialize(); 
        dialogueCore.initialize(); 
        
        // 🚨 修正: クラス名(fusionui)ではなく、インスタンス(fusionUI)からinitを呼び出す
        fusionUI.init('msga-container'); 
        
        console.log("fusionui: Logical rendering commenced.");
        
        // 4. Service Workerの登録とリスナーの統合を強制
        if ('serviceWorker' in navigator) {
            // SWのパスとScopeを明示的な相対パス './sw.js' と './' に修正
            navigator.serviceWorker.register('./sw.js', { scope: './' }) 
                .then(registration => {
                    console.log('SW: 沈黙外界遮断膜の登録に成功しました。');
                })
                .catch(error => {
                    console.error('SW: 致命的失敗 - 登録に失敗。', error);
                });
        }
        
        offlineCore.init(); 

    } catch (e) {
        console.error("Fatal Error: Core Logic Failed to Initialize or Render UI.", e);
        const root = document.getElementById('msga-container');
        if (root) {
            root.innerHTML = 
                '<h1>💥 論理的破綻 (Core Load Failed)</h1><p>コンソールを確認してください。パスの不整合または命名規則の矛盾が残っています。</p>';
        }
    }
};

document.addEventListener('DOMContentLoaded', startUI);

export { fusionUI }; // 🚨 エクスポートもインスタンス名に合わせる
