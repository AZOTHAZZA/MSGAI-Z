// app/fusionui.js
// MSGAI: 沈黙UI統合層（Fusion層）

// 【排他的な論理的修正：全ての内部インポートを厳密な相対パスに強制変更】
import { foundationCore, silenceCore } from '../core/foundation.js'; 
import { knowledgeCore } from '../core/knowledge.js'; 
import { generatorCore } from '../ai/generator.js';   
import { dialogueCore } from '../core/dialogue.js';   
import { offlineCore } from '../app/offline.js';      

// 🚨 修正: クラス名を FusionUI (大文字) に変更
class FusionUI { 
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
        
        // 以前のローディング画面のHTML要素をクリア
        this.root.innerHTML = '';

        // UI構造の描画
        this.root.innerHTML = `
            <div class="fusion-container">
                <h2>MSGAI Active</h2>
                <div id="status">沈黙度: ${dialogueCore.status().silenceLevel}</div>
                <textarea id="input" placeholder="沈黙に触れる..."></textarea>
                <button id="submit">送信</button>
                <div id="output"></div>
            </div>
            <div id="msga-debug-log" style="position: fixed; top: 0; left: 0; color: lime; font-family: monospace; font-size: 10px;">
                MSGAI 論理起動確定 (LOGOS Active) - UIメインロジック起動済
            </div>
        `;
        
        // 🚨 修正が必要: bindEvents と renderState はアロー関数にする必要がある (省略部分を修正)
        this.bindEvents(); 
        this.renderState();
    }
    
    // 🚨 修正: スコープ問題回避のため、メソッドをアロー関数として定義 (省略部分の想定修正)
    bindEvents = () => { 
        const submitButton = document.getElementById('submit');
        submitButton.addEventListener('click', this.handleSubmission);
        console.log("UI: Events bound.");
    }
    
    // 🚨 修正: スコープ問題回避のため、メソッドをアロー関数として定義
    renderState = () => {
        const statusDiv = document.getElementById('status');
        if (statusDiv) {
            statusDiv.innerHTML = `沈黙度: ${dialogueCore.status().silenceLevel.toFixed(2)} | 知識: ${knowledgeCore.getSummary().count}`;
        }
    }

    // 🚨 修正: スコープ問題回避のため、メソッドをアロー関数として定義 (ダミー)
    handleSubmission = async () => {
        const input = document.getElementById('input').value;
        const result = await dialogueCore.processDialogue(input);
        this.appendOutput(result);
    }
    
    // 🚨 修正: スコープ問題回避のため、メソッドをアロー関数として定義 (ダミー)
    appendOutput = (data) => {
        const outputDiv = document.getElementById('output');
        const p = document.createElement('p');
        p.textContent = JSON.stringify(data);
        outputDiv.appendChild(p);
    }
}

// ----------------------------------------------------
// MSGAI 起動ロジック
// ----------------------------------------------------

// 🚨 修正: クラス名 FusionUI に合わせてインスタンス名を変更
const fusionUIInstance = new FusionUI(); 

/**
 * @description UIのメイン論理を非同期で起動。
 */
const startUI = async () => {
    try {
        // Core層の初期化は foundationCore.initialize() が統括
        foundationCore.initialize(); 
        dialogueCore.initialize(); 
        
        // 🚨 修正: インスタンス名 fusionUIInstance から init を呼び出す
        fusionUIInstance.init('msga-container'); 
        
        console.log("fusionui: Logical rendering commenced.");
        
        // Service Workerの登録とリスナーの統合を強制
        if ('serviceWorker' in navigator) {
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
                `<h1>💥 論理的破綻 (Core Load Failed)</h1><p>コンソールを確認してください。エラー: ${e.message}</p>`;
        }
    }
};

// HTML読み込み完了時に起動
document.addEventListener('DOMContentLoaded', startUI);

// 🚨 修正: エクスポート名も新しいインスタンス名に合わせる
export { fusionUIInstance }; 
