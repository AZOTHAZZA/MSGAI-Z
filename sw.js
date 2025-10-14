// sw.js
// MSGAI: 沈黙外界遮断膜（Service Worker）

const CACHE_NAME = 'msgai-silence-cache-v3'; // 🚨 v3にバージョンアップ
const MSGAI_ROOT = '/MSGAI'; 

// 【排他的な論理的修正：全ファイルパスの絶対化と小文字統一を前提】
const CORE_ASSETS = [
  `${MSGAI_ROOT}/`,
  `${MSGAI_ROOT}/index.html`,
  `${MSGAI_ROOT}/manifest.json`,
  `${MSGAI_ROOT}/styles.css`,
  
  // 🚨 修正: App層のパスを小文字に統一 (大文字小文字の区別を回避)
  `${MSGAI_ROOT}/app/fusionui.js`, 
  `${MSGAI_ROOT}/app/offline.js`,           
  
  // Core層のファイルを現在のリポジトリ構造に合わせて記述
  `${MSGAI_ROOT}/Core/Foundation.js`, // Core層は既存の構造を維持する前提
  `${MSGAI_ROOT}/Core/Module.js`,
  `${MSGAI_ROOT}/Core/Storage.js`,
  `${MSGAI_ROOT}/Core/External.js`,
  `${MSGAI_ROOT}/Core/Dialogue.js`,
  `${MSGAI_ROOT}/Core/Knowledge.js`,
  `${MSGAI_ROOT}/AI/Generator.js`,
  `${MSGAI_ROOT}/AI/Fetch.js`,              
  // ... 他のCore/AI層ファイルもすべてここに含める
];

// インストール段階：沈黙の基礎構造をキャッシュ
self.addEventListener('install', (event) => {
  console.log('SW: Installing Cache V3...'); // ログ追加
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
    .catch(error => {
        console.error('SW Installation Failed (Cache.addAll Error):', error);
        // 🚨 致命的なパスエラーを防ぐため、エラーが発生したことをコンソールに出力
        return Promise.reject(error);
    })
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
  if (event.request.method !== 'GET') return; 

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response; 

        return fetch(event.request)
          .then(networkResponse => {
            return caches.open(CACHE_NAME).then(cache => {
              if (networkResponse.status === 200) {
                 cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            });
          })
          .catch(() => {
            // 外界との通信失敗時：index.htmlへの再誘導を強制
            return caches.match(`${MSGAI_ROOT}/index.html`); 
          });
      })
  );
});

// 周期的同期の強制
self.addEventListener('sync', (event) => {
  if (event.tag === 'periodic-logos-sync') {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'SYNC_FETCH_EXTERNAL', tag: event.tag });
        });
      })
    );
  }
});
