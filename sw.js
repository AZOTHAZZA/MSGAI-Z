// sw.js
// MSGAI: 沈黙外界遮断膜（Service Worker）
// 通信・キャッシュ・同期を沈黙的に制御し、外界依存を最小化する。

const CACHE_NAME = 'msgai-silence-cache-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.css',
  '/scripts/main.js',
  '/ai/generator.js',
  '/core/mathematical_silence.js'
];

// インストール段階：沈黙の基礎構造をキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// アクティベート：古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// フェッチ：沈黙的優先順位（キャッシュ優先・外界後回し）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュに存在すれば即返す（沈黙優先）
        if (response) return response;

        // 存在しない場合のみ外界アクセス（沈黙破り）
        return fetch(event.request)
          .then(networkResponse => {
            // 応答を再び沈黙キャッシュに保存
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => {
            // 外界との通信失敗時：沈黙的フォールバック
            return new Response('🕯️ Silence Mode Active (Offline)', {
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
          });
      })
  );
});

// 通知・同期・外界イベントの抑制
self.addEventListener('push', () => { /* 沈黙を維持 */ });
self.addEventListener('sync', () => { /* 沈黙を維持 */ });
self.addEventListener('notificationclick', () => { /* 沈黙を維持 */ });