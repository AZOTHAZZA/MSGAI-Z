// sw.js
// MSGAI: Service Worker (PWAとオフライン論理の制御)

// 🚨 修正: バージョンを強制的に引き上げ、古いキャッシュを排除
const CACHE_NAME = 'msga-v4'; 

// 🚨 修正: キャッシュするファイルを最小限の相対パスに絞り込み、404を回避
const CACHE_ASSETS = [
    './',           // ルートURL (https://azothazza.github.io/MSGAI/)
    './index.html',

    // 🚨 修正: 動作確認済みの正しい相対パス（小文字統一を前提）
    './app/fusionui.js', 
    './styles.css', 

    // Core層の主要なファイルは、最も基本的なものに絞る
    './Core/Foundation.js',
    './Core/Knowledge.js', 
    
    // 依存関係にある他の Core, AI, App 層のファイルも、
    // ここに適切な相対パスで追加する必要があります。
    // 例:
    // './Core/Dialogue.js',
    // './AI/Generator.js',
    // './app/offline.js',
];

// ----------------------------------------------------
// 1. インストール (キャッシュのセットアップ)
// ----------------------------------------------------
self.addEventListener('install', (event) => {
    console.log('SW: Installing and opening cache...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('SW: Pre-caching assets...');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => {
                console.log('SW: Installation successful.');
                // 既存のService Workerが終了するのを待たず、すぐにアクティベート
                return self.skipWaiting();
            })
            .catch((error) => {
                // 🚨 このエラーが頻繁に出ていました。404の原因を特定するためにログを出力
                console.error('SW Installation Failed (Cache.addAll Error):', error);
            })
    );
});

// ----------------------------------------------------
// 2. アクティベート (古いキャッシュのクリーンアップ)
// ----------------------------------------------------
self.addEventListener('activate', (event) => {
    console.log('SW: Activating and clearing old cache...');
    event.waitUntil(
        // 現在のバージョン（CACHE_NAME）以外のキャッシュを全て削除
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('SW: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('SW: Activation complete.');
            return self.clients.claim();
        })
    );
});

// ----------------------------------------------------
// 3. フェッチ (ネットワーク戦略: Cache-First)
// ----------------------------------------------------
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // キャッシュに見つかった場合はそれを返す
                if (response) {
                    return response;
                }
                
                // キャッシュに見つからない場合はネットワークから取得
                return fetch(event.request);
            })
            .catch((error) => {
                // ネットワークとキャッシュの両方で失敗した場合のフォールバック処理
                console.error('SW Fetch failed:', event.request.url, error);
            })
    );
});

// ----------------------------------------------------
// 4. メッセージング（Foundation Coreとの連携を想定）
// ----------------------------------------------------
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
