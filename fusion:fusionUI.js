// fusion/fusionUI.js
// MSGAI: 沈黙UI統合層（Fusion層）
// 数理的沈黙をインタラクションへと変換し、UIイベントを沈黙的に処理する。

import { silenceCore } from '../core/mathematical_silence.js';
import knowledge from '../core/knowledge.js';
import generator from '../ai/generator.js';

class FusionUI {
    constructor() {
        this.root = null;
        this.state = silenceCore.zeroVector(); // 初期状態はゼロベクトル（数理的沈黙）
    }

    // UIを初期化（ロゴスの触覚化）
    init(rootId = 'msga-container') {
        this.root = document.getElementById(rootId);
        
        // 論理的確認: root要素の存在を排他的に確認
        if (!this.root) {
            console.error('FusionUI Error: Root element not found. UI generation terminated.');
            // 要素が見つからない場合、論理的描画は停止
            return;
        }

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

            // 1. 沈黙的登録と抽象化（ロゴスへの変換）
            knowledge.register(text, { timestamp: Date.now() });
            const vector = silenceCore.abstract(text); // テキストを数理ベクトルに変換
            
            // 2. 応答ベクトルの取得と生成
            const responseVector = knowledge.retrieve(vector);
            const outputText = await generator.generateFromVector(responseVector);

            // 3. 状態の更新（論理的強制）
            this.state = silenceCore.combine(this.state, responseVector);
            
            // 4. 出力の表示と入力のクリア
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
        // スクロールを最新の状態に強制（論理的順序の維持）
        output.scrollTop = output.scrollHeight;
    }

    // 現在の沈黙状態を可視化（デバッグ/状態管理用）
    renderState() {
        // Core層の現在の状態をコンソールに排他的に出力
        console.log('FusionUI State Vector (Current Logos State):', this.state);
    }
}

// ----------------------------------------------------
// MSGAI 起動ロジック：論理的強制実行ブロック
// ----------------------------------------------------

const fusionUI = new FusionUI();

// UIのメイン論理を起動 (論理的必然性として init を強制実行)
// index.htmlのidと一致させるため、'msga-container' を排他的に強制
fusionUI.init('msga-container'); 

export default fusionUI;
