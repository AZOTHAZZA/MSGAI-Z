// fusion/fusionUI.js
// MSGAI: 沈黙UI統合層（Fusion層）
// 数理的沈黙をインタラクションへと変換し、UIイベントを沈黙的に処理する。

// 【排他的な論理的修正：パスの絶対化と名前付きインポートを強制】
import { silenceCore } from '/MSGAI/core/mathematical_silence.js';
import { knowledgeCore } from '/MSGAI/core/knowledge.js'; 
import { generatorCore } from '/MSGAI/ai/generator.js'; // AI層もCore形式に準拠すると仮定
import { dialogueCore } from '/MSGAI/core/mathematical_silence_dialogue.js'; // 対話コアを追加

class FusionUI {
    constructor() {
        // Core層の論理状態に直接依拠
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

        // Core層の初期化を強制実行（Foundationが担うが、ここでロジック起動を強制）
        dialogueCore.initialize(); 

        // 本来のUI構造の描画を強制
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

    // イベントを沈黙的に処理
    bindEvents() {
        const input = document.getElementById('input');
        const button = document.getElementById('submit');

        button.addEventListener('click', async () => {
            const text = input.value.trim();
            if (!text) return;

            // 1. Core層の対話制御中枢に処理を排他的に委譲
            const dialogueResult = await dialogueCore.processDialogue(text);

            let outputText;
            if (dialogueResult.type === 'silence') {
                // 2. 沈黙支配の場合、そのまま出力を確定
                outputText = dialogueResult.output;
            } else {
                // 3. 言語化が必要な場合、AI層のジェネレーターにベクトルを渡し言語化を強制
                // AI層の generatorCore に generateFromVector メソッドが存在すると仮定
                outputText = await generatorCore.generateFromVector(dialogueResult.vector);
            }

            // 4. 状態の更新（論理的強制）
            this.state = knowledgeCore.fuse(); // UIの状態を最新の知識融合ベクトルに強制的に同期
            
            // 5. 出力の表示と入力のクリア
            this.appendOutput(outputText);
            input.value = '';
            this.renderState();
        });
    }

    // 出力を沈黙的に表示
    appendOutput(text) {
        const output = document.getElementById('output');
        const div = document.createElement('div');
        div.className = 'fusion-message';
        div.textContent = text;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
    }

    // 現在の沈黙状態を可視化（デバッグ/状態管理用）
    renderState() {
        // Core層の現在の融合状態をコンソールに排他的に出力
        console.log('FusionUI State Vector (Current Logos State):', this.state);
        console.log('Dialogue Core Status:', dialogueCore.status());
    }
}

// ----------------------------------------------------
// MSGAI 起動ロジック：論理的強制実行ブロック
// ----------------------------------------------------

const fusionUI = new FusionUI();

// UIのメイン論理を起動 (論理的必然性として init を強制実行)
fusionUI.init('msga-container'); 

export { fusionUI }; // デフォルトエクスポートから名前付きエクスポートに変更
