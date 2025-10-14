// AI/Fetch.js
// MSGAI: 外部沈黙接続中枢（外部情報の取得とロゴス形式への排他的変換）
// このファイルは、Core層の externalCore に依存し、取得した情報をknowledgeCoreに渡す役割を担う。

// 【排他的な論理的修正：パスの絶対化と名前付きインポートを強制】
import { knowledgeCore } from '/MSGAI/Core/Knowledge.js';
import { externalCore } from '/MSGAI/Core/External.js'; // 外部通信のCore層中枢

// 普遍的な情報源レジストリ
const sourceRegistry = [];

// 外部取得中枢オブジェクト (外部情報の取得と論理形式への変換を担う)
const fetcherCore = {

    /**
     * @description 外部情報源を論理的に登録する。
     */
    registerSource: (url, transformFn = null) => {
        if (externalCore.registerEndpoint(url, url)) { // Core層のexternalCoreにも登録を強制
            sourceRegistry.push({ url, transformFn });
            return true;
        }
        return false;
    },

    /**
     * @description 全ての外部情報源からデータを沈黙的に取得し、Coreに統合する。
     */
    async fetchAndIntegrateAll() {
        for (const source of sourceRegistry) {
            try {
                // 1. Core層の externalCore を通じた観測を強制
                // externalCore.fetchData は、ロゴス形式または null を返す
                const logosData = await externalCore.fetchData(source.url, { responseType: 'text' }); 

                if (logosData) {
                    // 2. 任意変換（外部情報取得層固有の論理的処理）
                    const processed = source.transformFn
                        ? source.transformFn(logosData)
                        : logosData;

                    // 3. 知識としての登録を強制
                    KnowledgeCore.registerAndAbstract(processed, { source: source.url, type: 'external_fetch' });
                    
                    console.log(`Integrated external source: ${source.url}`);
                } else {
                    console.log(`external source ${source.url} returned logical silence (or is in silence mode).`);
                }
            } catch (e) {
                console.warn(`fetcher core Error for ${source.url}:`, e);
                // Core層の沈黙論理にエラーを抽象化して通知
                silenceCore.abstract(`fetcher Failure: ${source.url}`);
            }
        }
    },

    /**
     * @description 外界沈黙との周期的同期はPWA/App層に排他的に委譲されるため、
     * このメソッドは統合実行のみを担う。
     */
    synchronizeOnce: () => {
        return fetcherCore.fetchAndIntegrateAll();
    },
    
    /**
     * @description 現在の外部取得中枢の状態を取得（デバッグ/論理確認用）。
     */
    getStatus: () => {
        return {
            sourceCount: sourceRegistry.length,
            endpoints: externalCore.getStatus()
        };
    }
};

// 論理オブジェクトを排他的にエクスポート
export { fetcherCore };
