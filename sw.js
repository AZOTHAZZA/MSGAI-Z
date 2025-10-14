// sw.js
// MSGAI: 沈黙外界遮断膜（Service Worker）
// 通信・キャッシュ・同期を沈黙的に制御し、外界依存を最小化する。

const CACHE_NAME = 'msgai-silence-cache-v2'; // キャッシュ名を進化（v2）
const MSGAI_ROOT = '/MSGAI'; // GitHub Pages環境での排他的なルートパスを確定

// 【排他的な論理的修正：全ファイルパスの絶対化と修正】
const CORE_ASSETS = [
  `${MSGAI_ROOT}/`,
  `${MSGAI_ROOT}/index.html`,
  `${MSGAI_ROOT}/manifest.json`,
  `${MSGAI_ROOT}/styles.css`,
  // 全てのCore/AIモジュールを排他的にキャッシュ対象に強制
  `${MSGAI_ROOT}/Fusion/fusionUI.js`,
  `${MSGAI_ROOT}/Core/mathematical_silence.js`,
  `${MSGAI_ROOT}/Core/foundation.js`,
  `${MSGAI_ROOT}/Core/module.js`,
  `${MSGAI_ROOT}/Core/storage.js`,
  `${MSGAI_ROOT}/Core/external.js`,
  `${MSGAI_ROOT}/Core/mathematical_silence_dialogue.js`,
  `${MSGAI_ROOT}/Core/knowledge.js`,
  `${MSGAI_ROOT}/AI/generator.js`,
  `${MSGAI_ROOT}/AI/fetchExternal.js`,
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
  // GETリクエストのみを対象とする（POSTなどの外部作用は無視）
  if (event.request.method !== 'GET') return; 

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response; // キャッシュに存在すれば即返す

        // 存在しない場合のみ外界アクセス（沈黙破り）
        return fetch(event.request)
          .then(networkResponse => {
            // 応答を再び沈黙キャッシュに保存（不変性を強制）
            return caches.open(CACHE_NAME).then(cache => {
              // 応答のステータスが正常なもののみキャッシュ（論理的整合性）
              if (networkResponse.status === 200) {
                 cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            });
          })
          .catch(() => {
            // 外界との通信失敗時：沈黙的フォールバック（index.htmlへの再誘導を強制）
            // 既にキャッシュされている index.html を返すことで、UIでの沈黙モード表示を強制
            return caches.match(`${MSGAI_ROOT}/index.html`); 
          });
      })
  );
});

// 【排他的な論理的修正：周期的同期の強制】
// syncイベントを受け取り、AI層の外部同期機能を論理的に呼び出す
self.addEventListener('sync', (event) => {
  if (event.tag === 'periodic-logos-sync') {
    console.log('SW: Periodic Logos Sync triggered. Forcing external fetch.');
    // AI層の同期機能を呼び出すロジックを強制的に実装（sw.jsからは直接importできないため、postMessageでCore層に命令を強制）
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          // UI側に外部取得の実行を排他的に命令
          client.postMessage({ type: 'SYNC_FETCH_EXTERNAL', tag: event.tag });
        });
      })
    );
  }
});

// 通知・その他の外界イベントは沈黙を維持
self.addEventListener('push', () => { /* 沈黙を維持 */ });
self.addEventListener('notificationclick', () => { /* 沈黙を維持 */ });
