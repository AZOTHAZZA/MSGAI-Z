// AI/Fetch.js
// MSGAI: 外部沈黙接続中枢（外部リソース取得と知識統合）

// 【排他的な論理的修正：相対パス、命名規則の統一】
import { knowledgeCore } from '../core/knowledge.js';
import { externalCore } from '../core/external.js'; 
import { silenceCore } from '../core/foundation.js'; // silenceCore は Foundation から取得

// 外部同期ソースの定義（ダミー）
const syncSources = [
    { name: 'zeitgeist_feed', url: '/api/zeitgeist', interval: 3600000 },
    { name: 'local_settings', url: '/api/settings', interval: 86400000 }
];

const fetcherCore = {
    /**
     * @description 外部リソースを周期的に取得し、知識ベースに統合する。
     */
    async synchronizeOnce() {
        silenceCore.abstract("Fetcher Core Initiating Synchronize Once.");
        
        for (const source of syncSources) {
            await fetcherCore.fetchAndIntegrate(source);
        }
        
        silenceCore.abstract("Fetcher Core Synchronization Complete.");
    },

    /**
     * @description 特定のソースからデータを取得し、知識として統合する。
     */
    async fetchAndIntegrate(source) {
        try {
            // 1. ExternalCoreを使用してデータを取得
            const logosData = await externalCore.fetchData(source.name, { method: 'GET' });
            
            if (logosData) {
                // 2. 取得したロゴスデータを知識として登録
                knowledgeCore.registerAndAbstract(logosData, { 
                    source: source.name, 
                    type: 'external_fetch' 
                });
                silenceCore.abstract(`Fetcher Success: ${source.name} integrated.`);
            } else {
                 // 沈黙モードなどでデータが返されなかった場合
                silenceCore.abstract(`Fetcher Skip: ${source.name} (Silent Mode/No Data).`);
            }
        } catch (e) {
            console.warn(`Fetcher Core Error for ${source.name}:`, e);
            // 失敗時も論理を抽象化
            silenceCore.abstract(`Fetcher Failure: ${source.name}`);
        }
    },
    
    /**
     * @description 現在の同期状態を報告。
     */
    getStatus: () => {
        return {
            lastSyncAttempt: new Date().toISOString(),
            sourcesCount: syncSources.length,
            knowledgeCount: knowledgeCore.getSummary().count // 知識ベースのサイズを参照
        };
    }
};

export { fetcherCore };
