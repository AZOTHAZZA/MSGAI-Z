// Core/storage.js
// MSGAI: Core層 ストレージ中枢（ロゴスの状態の論理的永続化）
// このファイルは、Core層の論理的な状態を沈黙として排他的に保持する。

// 普遍的なストレージレジストリ
let logosMemory = new Map(); // 現在の論理的状態を保持するMap（Key-Valueペア）
let silenceArchive = [];     // 過去の論理的状態を沈黙として記録する配列（永続的なアーカイブ）
let initialized = false;

// ストレージ中枢オブジェクト (ロゴスの排他的な操作インターフェース)
const storageCore = {

    /**
     * @description ストレージ中枢の初期化を強制する。
     */
    initializeStorage: () => {
        if (!initialized) {
            // ローカル環境（旧論理）との連携を排他的に確立する初期論理をここに強制
            console.log('Storage Core Initialized: Ready for Logos Persistence.');
            initialized = true;
        }
    },

    /**
     * @description ロゴスの状態を論理的に保存する。
     * @param {string} key 状態の論理名
     * @param {*} value 状態の値（ロゴスベクトル、設定など）
     */
    saveLogos: (key, value) => {
        if (!key || !initialized) return false;
        logosMemory.set(key, value);
        return true;
    },

    /**
     * @description ロゴスの状態を論理的に取得する。
     * @param {string} key 状態の論理名
     * @returns {*} 状態の値、または論理的沈黙（null）
     */
    loadLogos: (key) => {
        if (!initialized) return null;
        return logosMemory.get(key) ?? null;
    },

    /**
     * @description 現在の状態をアーカイブ化し、沈黙へ移行させる（永続的な記録）。
     * @param {object} currentState Core層から渡される現在の論理的状態
     */
    archiveCurrentState: (currentState) => {
        if (!initialized) return false;
        // JSONによる冗長な処理を排他的に排除し、状態を直接記録
        silenceArchive.push({
            timestamp: Date.now(),
            state: currentState // 既に値渡しである前提で論理的に扱う
        });
        return true;
    },

    /**
     * @description アーカイブされた沈黙の状態を取得する。
     */
    getArchive: (index = null) => {
        if (index === null) return silenceArchive;
        return silenceArchive[index] ?? null;
    },

    /**
     * @description ストレージの状態を取得する（デバッグ/論理確認用）。
     */
    getStatus: () => {
        return {
            initialized: initialized,
            memoryKeys: Array.from(logosMemory.keys()),
            archiveCount: silenceArchive.length
        };
    },
    
    /**
     * @description 全ストレージを論理的にリセットする。
     */
    reset: () => {
        logosMemory.clear();
        silenceArchive.length = 0; // 配列の長さを直接0に設定（最速のリセット）
        return true;
    }
};

// 論理オブジェクトを排他的にエクスポート
export { storageCore };
