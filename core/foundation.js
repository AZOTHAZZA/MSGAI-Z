// core/foundation.js (修正版: 初期化ログを追加)

import { LogosTension } from './arithmos.js';

export const LogosState = {
    tension_level: new LogosTension(0.05),
    accounts: { "User_A": 1000.00, "User_B": 500.00 },
    status_message: "Logos Core Initialized. Awaiting first act.",
    last_act: "Genesis",
};

// 🌟 追加: LogosStateの初期化後にログを出力
console.log(`[Logos Core]: Initialized. Tension: ${LogosState.tension_level.getValue().toFixed(4)}`);


export function getCurrentState() {
// ... (中略、残りの関数は変更なし) ...
    return JSON.parse(JSON.stringify({ 
        tension_level: LogosState.tension_level.getValue(),
        accounts: LogosState.accounts,
        status_message: LogosState.status_message,
        last_act: LogosState.last_act
    }));
}

export function updateState(newState) {
    LogosState.tension_level = new LogosTension(newState.tension_level);
    LogosState.accounts = newState.accounts;
    LogosState.status_message = newState.status_message;
    LogosState.last_act = newState.last_act;
}

export function getCurrentStateJson() {
    return JSON.stringify({
        tension_level: LogosState.tension_level.getValue(),
        accounts: LogosState.accounts,
        status_message: LogosState.status_message,
        last_act: LogosState.last_act
    });
}
