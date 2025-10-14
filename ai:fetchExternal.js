// ai/fetchExternal.js
// MSGAI: 外部沈黙接続層（External Fetcher）
// 外界の情報を取得し、沈黙ベクトルに変換してCoreに統合する。

import { silenceCore } from '../core/mathematical_silence.js';
import knowledge from '../core/knowledge.js';

class ExternalFetcher {
    constructor() {
        this.sources = [];
    }

    // 外部情報源を登録
    registerSource(url, transformFn = null) {
        this.sources.push({ url, transformFn });
    }

    // 外部情報を沈黙的に取得・統合
    async fetchAndIntegrate() {
        for (const source of this.sources) {
            try {
                const response = await fetch(source.url);
                const data = await response.text();

                // 外界 → 沈黙ベクトルへの変換
                const abstracted = silenceCore.abstract(data);

                // 任意変換（例：文意抽出、圧縮）
                const processed = source.transformFn
                    ? source.transformFn(abstracted)
                    : abstracted;

                // 内部知識構造へ沈黙的に格納
                knowledge.register(source.url, processed);

                console.log(`Integrated external source: ${source.url}`);
            } catch (e) {
                console.warn(`External fetch failed for ${source.url}:`, e);
            }
        }
    }

    // 外界沈黙との同調（周期的同期）
    async synchronize(interval = 60000) {
        await this.fetchAndIntegrate();
        setInterval(() => this.fetchAndIntegrate(), interval);
    }
}

const fetchExternal = new ExternalFetcher();
export default fetchExternal;