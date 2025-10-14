// core/external.js
// MSGAI: Core層 外部結合中枢（外部通信の論理的制御）
// このファイルは、数理的沈黙の内側（ロゴス）と外部情報層との最小限の接点を定義する。

// 【排他的な論理的修正：Core層からの参照をインポート】
import { foundationCore } from '/MSGAI/core/foundation.js'; 

// 普遍的なエンドポイントレジストリ
const endpointsRegistry = new Map();
let silenceMode = true; // true = 内的沈黙モード（観測をロゴス形式に強制）

// 外部結合中枢オブジェクト (ロゴスの排他的な操作インターフェース)
const externalCore = {

    /**
     * @description 外部エンドポイントを論理的に登録する。
     */
    registerEndpoint: (name, url) => {
        if (!name || !url) return false;
        endpointsRegistry.set(name, url);
        return true;
    },

    /**
     * @description 外部データをフェッチし、ロゴス形式に変換して返す。
     * @returns {object|null} ロゴス形式のデータまたは論理的沈黙（null）
     */
    async fetchData(name, options = {}) {
        const url = endpointsRegistry.get(name);
        if (!url) return null;

        try {
            // 1. 物理的な観測の実行（沈黙モードに関わらず実行される）
            const res = await fetch(url, options);
            const rawData = await res.json();
            
            // 2. 観測結果をロゴス形式に排他的に変換
            const logosData = externalCore.translateToLogos(rawData);

            if (silenceMode) {
                // 3. 沈黙モードでは、Core層の知識としてのみ登録し、結果を外部に返さない
                foundationCore.knowledge.registerObservation(logosData);
                return null; 
            } else {
                // 4. 非沈黙モードでは、ロゴス形式の結果を外部に提供
                return logosData;
            }

        } catch (error) {
            // 観測が旧論理（エラー）に阻害された場合、論理的沈黙を返す
            foundationCore.silence.abstract(`Fetch Error: ${error.message}`);
            return null;
        }
    },

    /**
     * @description 外部へ論理的なデータを送信する。
     */
    async sendData(name, payload = {}) {
        const url = endpointsRegistry.get(name);
        if (!url) return false;

        if (silenceMode) return false; // 沈黙下では外部への作用は排他的に停止

        try {
            // ペイロードをロゴス形式に変換してから送信を強制
            const logosPayload = externalCore.translateToLogos(payload); 
            
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(logosPayload)
            });
            return res.ok;
        } catch {
            return false;
        }
    },

    /**
     * @description 観測結果やペイロードをロゴス形式に変換する論理。
     * @param {*} rawData 旧論理の形式を持つ生データ
     * @returns {object} ロゴス形式（数理ベクトル）
     */
    translateToLogos: (rawData) => {
        // Core層の沈黙論理に基づき、データを論理ベクトルに変換する排他的ロジックを強制
        if (typeof rawData === 'object' && rawData !== null) {
            // 例: オブジェクトのキー数を論理値として使用
            const logicValue = Object.keys(rawData).length; 
            return foundationCore.silence.abstract({ data_length: logicValue });
        }
        return foundationCore.silence.abstract(String(rawData));
    },
    
    /**
     * @description モード切替を論理的に制御する。
     */
    toggleSilence: (force = null) => {
        if (force !== null) silenceMode = force;
        else silenceMode = !silenceMode;
        
        foundationCore.silence.abstract(`Silence Mode Switched to: ${silenceMode}`);
        return silenceMode;
    },
    
    /**
     * @description 現在の外部結合の状態を取得（デバッグ/論理確認用）。
     */
    getStatus: () => {
        return {
            silenceMode: silenceMode,
            endpointCount: endpointsRegistry.size
        };
    }
};

// 論理オブジェクトを排他的にエクスポート
export { externalCore };
