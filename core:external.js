// core/external.js
// MSGAI: Core層 外部結合モジュール
// 数理的沈黙の内側（ロゴス）と外部情報層との最小限の接点を定義する。

class External {
    constructor() {
        this.endpoints = new Map();
        this.listeners = [];
        this.silenceMode = true; // true = 内的沈黙モード
    }

    // 外部エンドポイントを登録
    registerEndpoint(name, url) {
        if (!name || !url) return false;
        this.endpoints.set(name, url);
        return true;
    }

    // 外部データをフェッチ（沈黙モードを尊重）
    async fetchData(name, options = {}) {
        const url = this.endpoints.get(name);
        if (!url) return null;

        if (this.silenceMode) {
            // 沈黙下では観測のみ行い、結果を外部へ拡散しない
            try {
                const res = await fetch(url, options);
                return await res.json();
            } catch {
                return null;
            }
        } else {
            // 通常通信モード
            try {
                const res = await fetch(url, options);
                return await res.json();
            } catch {
                return null;
            }
        }
    }

    // 外部送信（必要最低限）
    async sendData(name, payload = {}) {
        const url = this.endpoints.get(name);
        if (!url) return false;

        if (this.silenceMode) return false; // 沈黙下では送信禁止

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            return res.ok;
        } catch {
            return false;
        }
    }

    // リスナー登録（外部反応監視）
    addListener(callback) {
        if (typeof callback === "function") {
            this.listeners.push(callback);
        }
    }

    // 外部イベント通知（沈黙下では反応を内部にのみ留める）
    notify(event) {
        if (!event) return;
        this.listeners.forEach(fn => {
            try {
                fn(event, this.silenceMode);
            } catch {}
        });
    }

    // モード切替
    toggleSilence(force = null) {
        if (force === true) this.silenceMode = true;
        else if (force === false) this.silenceMode = false;
        else this.silenceMode = !this.silenceMode;
    }
}

// 単一インスタンスとしてエクスポート
const external = new External();
export default external;