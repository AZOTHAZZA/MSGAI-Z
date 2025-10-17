// core/foundation.js

import { LogosTension } from './arithmos.js';

/**
 * システム全体の状態を厳密に定義する。
 */
export const LogosState = {
    tension_level: new LogosTension(0.05),
    accounts: {
        "User_A": 1000.00,
        "User_B": 500.00
    },
    status_message: "Logos Core Initialized. Awaiting first act.",
    last_act: "Genesis",
};

/**
 * 現在のロゴス状態を取得する。
 */
export function getCurrentState() {
    // ディープコピーを返すことで、ミューテーションを制御する
    return JSON.parse(JSON.stringify({ 
        tension_level: LogosState.tension_level.getValue(),
        accounts: LogosState.accounts,
        status_message: LogosState.status_message,
        last_act: LogosState.last_act
    }));
}

/**
 * 状態を更新する。
 */
export function updateState(newState) {
    LogosState.tension_level = new LogosTension(newState.tension_level);
    LogosState.accounts = newState.accounts;
    LogosState.status_message = newState.status_message;
    LogosState.last_act = newState.last_act;
}

/**
 * 状態をJSON文字列で取得する (UI連携用)。
 */
export function getCurrentStateJson() {
    return JSON.stringify({
        tension_level: LogosState.tension_level.getValue(),
        accounts: LogosState.accounts,
        status_message: LogosState.status_message,
        last_act: LogosState.last_act
    });
}
