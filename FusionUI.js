// /MSGAI/Fusion/FusionUI.js
// MSGAI: 沈黙UI統合層（Fusion層）

// 【排他的な論理的修正：FoundationCoreを追加し、パスと命名規則を統一】
import { foundationCore } from '/MSGAI/Core/Foundation.js'; // FoundationCore を追加 (silenceCoreの代替)
import { knowledgeCore } from '/MSGAI/Core/Knowledge.js'; 
import { generatorCore } from '/MSGAI/AI/Generator.js';
import { dialogueCore } from '/MSGAI/Core/Dialogue.js'; 
import { offlineCore } from '/MSGAI/App/Offline.js'; // 🚨 /App/ にパスを修正

class FusionUI {
    constructor() {
        // 🚨 修正: silenceCore の代わりに foundationCore を利用する (論理的な代替)
        this.state = foundationCore.zeroVector(); 
        this.root = null;
    }

    // UIを初期化（ロゴスの触覚化）
    init(rootId = 'msga-container') {
        this.root = document.getElementById(rootId);
        
        if (!this.root) {
            console.error('FusionUI Error: Root element not found. UI generation terminated.');
            return;
        } 
        
        // ... [UI構造の描画、bindEvents, renderState はそのまま] ...
    }
    // ... [メソッドの定義はそのまま] ...
}

// ----------------------------------------------------
// MSGAI 起動ロジック：論理的強制実行ブロック (非同期起動を強制)
// ----------------------------------------------------

// 🚨 命名規則を統一: 変数名を小文字の 'fusionUI' に修正
const fusionUI = new FusionUI();

/**
 * @description UIのメイン論理を非同期で起動。Core層の初期化を排他的に実行。
 */
const startUI = async () => {
    try {
        // 1. 基礎構造（Foundation）を最初に排他的に初期化することを強制
        foundationCore.initialize(); 
        
        // 2. その他の Core モジュールを初期化
        dialogueCore.initialize(); // DialogueはFoundationに依存
        
        // 3. UIの描画
        fusionUI.init('msga-container');
        console.log("FusionUI: Logical rendering commenced.");
        
        // 4. アプリケーション層の起動
        offlineCore.init(); 

    } catch (e) {
        // ... [エラー処理はそのまま] ...
    }
};

document.addEventListener('DOMContentLoaded', startUI);

export { fusionUI };
