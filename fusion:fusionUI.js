// fusion/fusionUI.js
// MSGAI: 沈黙UI統合層（Fusion層）
// 数理的沈黙をインタラクションへと変換し、UIイベントを沈黙的に処理する。

import { silenceCore } from '../core/mathematical_silence.js';
import knowledge from '../core/knowledge.js';
import generator from '../ai/generator.js';

class FusionUI {
    constructor() {
        this.root = null;
        this.state = silenceCore.zeroVector();
    }

    // UIを初期化（ロゴスの触覚化）
    init(rootId = 'app') {
        this.root = document.getElementById(rootId);
        if (!this.root) {
            console.error('FusionUI Error: root element not found.');
            return;
        }

        this.root.innerHTML = `
            <div class="fusion-container">
                <textarea id="input" placeholder="沈黙に触れる..."></textarea>
                <button id="submit">送信</button>
                <div id="output"></div>
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

            // 沈黙的登録と出力生成
            knowledge.register(text, { timestamp: Date.now() });
            const vector = silenceCore.abstract(text);
            const responseVector = knowledge.retrieve(vector);
            const outputText = await generator.generateFromVector(responseVector);

            this.state = silenceCore.combine(this.state, responseVector);
            this.appendOutput(outputText);
            input.value = '';
        });
    }

    // 出力を沈黙的に表示
    appendOutput(text) {
        const output = document.getElementById('output');
        const div = document.createElement('div');
        div.className = 'fusion-message';
        div.textContent = text;
        output.appendChild(div);
    }

    // 現在の沈黙状態を可視化（デバッグ用）
    renderState() {
        console.log('FusionUI State Vector:', this.state);
    }
}

const fusionUI = new FusionUI();
export default fusionUI;