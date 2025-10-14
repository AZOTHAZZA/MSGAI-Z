// sw.js
// MSGAI: Service Worker (PWA機能とオフラインキャッシング)

// 【排他的な論理的修正：バージョンアップとキャッシュリスト最小化】
// 🚨 最終修正: バージョンを上げて強制アップデート (msga-v5へ)
const CACHE_NAME = 'msga-v5'; 

// 🚨 最終修正: 確実な2ファイル（ルートとインデックス）のみに絞り込む
// これ以外のファイルは、パスの問題を避けるため全て削除します。
const CACHE_ASSETS = [
    './',           // PWAが動作するMSGAIのルートURL
    './index.html'
];

/**
 * インストールイベント: Service Workerが初めて登録されたときに実行される。
 * 最小限の必須アセットをキャッシュする。
 */
self.addEventListener('install', (event) => {
    // インストール失敗の原因となっていた Cache.addAll() を実行
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('SW: Opened cache and trying to add minimal assets...');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => {
                console.log('SW Installation Success: Minimal assets cached.');
            })
            .catch((e) => {
                // 🚨 このエラーが報告されていた問題の核心です。
                console.error('SW Installation Failed (Cache.addAll Error):', e);
                // 失敗しても SW の登録自体は続行させる（promiseはrejectされない）
            })
    );
});


/**
 * アクティベートイベント: 古いキャッシュをクリーンアップする。
 */
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('SW: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // クライアントを即座に制御する（Service Workerの即時有効化）
    return self.clients.claim();
});


/**
 * フェッチイベント: ネットワークリクエストを傍受し、キャッシュを優先する。
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // キャッシュに見つかった場合はそれを返す
                if (response) {
                    return response;
                }
                // キャッシュにない場合はネットワークリクエストを行う
                return fetch(event.request);
            })
            .catch((error) => {
                // オフライン時のフォールバック処理をここに記述（省略）
                console.error('SW Fetch Error:', error);
            })
    );
});
