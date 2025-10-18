// ai/generator.js

import { getCurrentState, updateState } from '../core/foundation.js'; // 修正: ../core/foundation
import { LogosTension, calculateTension, ControlMatrix } from '../core/arithmos.js'; // 修正: ../core/arithmos
import { TensionEvent } from '../core/silence.js'; // 修正: ../core/silence

function generateDialogueText(prompt, intensity, rigor) {
    const tone = intensity > rigor ? "創造的" : "厳密";
    return `${tone}なトーンで、ユーザーの問い「${prompt}」に客観的に応答します。`;
}

export function actDialogue(username, prompt) {
    const state = getCurrentState();
    const currentTension = new LogosTension(state.tension_level);

    const newTension = calculateTension(currentTension, TensionEvent.StandardInteraction);
    const matrix = new ControlMatrix(newTension);

    state.tension_level = newTension.getValue();
    state.last_act = `Dialogue Act by ${username}`;
    
    const responseText = generateDialogueText(prompt, matrix.intensity, matrix.rigor);
    
    updateState(state);
    return responseText;
}
