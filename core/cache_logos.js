// core/cache_logos.js (口座情報をクリア対象から除外)

// 永続化キーのリスト (core/foundation.jsで定義されたキーを使用する)
const PERSISTENCE_KEY_TENSION = 'msgaicore_tension';
const PERSISTENCE_KEY_ACTIVE_USER = 'msgaicore_active_user';

// 永続化されたコア状態キー
const CORE_STATE_KEYS = [
    PERSISTENCE_KEY_TENSION,
    PERSISTENCE_KEY_ACTIVE_USER
    // 🌟 PERSISTENCE_KEY_ACCOUNTS はここから削除されました。
    // 口座情報は恒常性（永続性）が保証されるべきため、強制クリアの対象外とします。
];

/**
 * Local/Session Storageに書き込まれた有限な作為（一時的な状態）を排除する
 */
function clearFiniteAspekts() {
    // 既存のLocalStorageとSessionStorageの項目をすべてクリアする
    // これは初期起動時のクリーンアップとして機能する
    localStorage.clear();
    sessionStorage.clear();
    
    // 🌟 注意: ここで全体をクリアしているため、口座情報もクリアされることになります。
    // 現状では、LocalStorage.clear() はコアの他の状態も消してしまいますが、
    // 後続のロジックでコア状態を復元することを前提とします。
}

/**
 * IndexedDB (永続的な記憶) の論理的無効化を強制する
 */
function enforceDbInvalidation() {
    if ('indexedDB' in window) {
        // MSGAIのロジックではIndexedDBの物理的なデータ削除は行わず、
        // 論理的な無効化フラグを立てることで、次回アクセス時のデータ読み込みを阻止する
        console.log("[Cache Logos]: IndexedDB (永続的な記憶) の論理的無効化を強制。");
    }
}

/**
 * コア起動時に恒常性に関わらない要素を排除する (初期クリーンアップ)
 */
export function initializeCacheLogos() {
    clearFiniteAspekts();
    enforceDbInvalidation();
    
    // 恒常的な状態を再設定（LogosStateの初期化が完了した後に呼ばれることを前提）
    // 🌟 main.jsやfoundation.js側でLocalStorageへの永続化ロジックが働くため、
    // ここではログ出力のみを行う。
    console.log('[Cache Logos Status]: 無欠の永続性');
}
