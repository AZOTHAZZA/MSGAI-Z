// core/foundation.js

import { LogosTension } from './arithmos.js';

export const LogosState = {
    tension_level: new LogosTension(0.05),
    accounts: { "User_A": 1000.00, "User_B": 500.00 },
    status_message: "Logos Core Initialized. Awaiting first act.",
    last_act: "Genesis",
};

export function getCurrentState() {
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
