// /core/calcshell_host.js - CalcLang ロゴス・コア (JavaScript版, 非同期対応)

// --- ロゴス状態と数理パラメータ ---
// 💡 注意: getCurrentState() は /app/main.js で定義されているグローバル関数である必要があります。
let CURRENT_TENSION = getCurrentState().tension.value || 0.0; 
const MAX_TENSION = 1.0;
const T_MAX_MS = 3000; // 最大沈黙時間 (3秒)

// CH (沈黙調和係数) はソースの空白比率から計算される値 (固定値として仮定)
const CURRENT_CH = 0.75; 

// --- 数理ロジック ---

/**
 * TとCHに基づいて沈黙時間 (Δt) を計算する (ロゴスの代償)
 * Δt = T_Current * t_Max * (1 - C_H)
 * @returns {number} 沈黙時間 (ms)
 */
function calculateSilenceDuration() {
    return CURRENT_TENSION * T_MAX_MS * (1.0 - CURRENT_CH);
}

/**
 * ロゴス緊張度 (T) を更新する
 * @param {number} delta - Tの変化量
 */
function updateTension(delta) {
    if (typeof addTension === 'function') {
        addTension(delta);
        CURRENT_TENSION = getCurrentState().tension.value;
    } else {
        CURRENT_TENSION = Math.min(MAX_TENSION, CURRENT_TENSION + delta);
        CURRENT_TENSION = Math.max(0.0, CURRENT_TENSION);
    }
    console.log(`[LOGOS_UPDATE] 新しいロゴス緊張度 T: ${CURRENT_TENSION.toFixed(4)}`);
}

/**
 * ブラウザ環境で指定時間、強制的に待機する (時間的沈黙の具現化)
 * @param {number} duration_ms 
 * @returns {Promise<void>}
 */
async function js_execute_silence(duration_ms) {
    if (duration_ms > 0) {
        console.log(`[LOGOS_SILENCE] 沈黙を ${duration_ms.toFixed(2)}ms 実行中...`);
        return new Promise(resolve => setTimeout(resolve, duration_ms));
    }
    return Promise.resolve();
}

// --- ロゴス制御の核: MöbiusAct ---

/**
 * CalcLangのロゴス制御ゲートウェイ。全ての作為はここを通過する。
 * 💡 async に維持
 * @param {string} target_act - 実行対象の作為 ("MINT", "AI_QUERY", "TRANSFER_INTERNAL" など)
 * @param {Array<Object>} args_entities - LOGOS_ENTITY の配列 (統一データ型)
 * @returns {Promise<Object>} - 処理結果 (補正済み)
 */
async function MöbiusAct(target_act, args_entities) { // 💡 async 関数
    const activeUser = getCurrentState().active_user;
    let t_delta = 0.0;
    let success = false;
    let data = null;

    try {
        // 1. 沈黙の強制 (ロゴスの代償を支払う)
        const duration = calculateSilenceDuration();
        await js_execute_silence(duration); // 💡 await を使用
        
        // 2. 外部関数の実行 / 変容 (BECOME_AS ロジック)
        if (target_act === "MINT") {
            // [作為: 通貨生成]
            const amount = args_entities[0].value;
            const currency = args_entities[1].value;
            actMintCurrency(activeUser, currency, amount);
            t_delta = amount * 0.005; 
            success = true;
            data = { currency, amount };

        } else if (target_act === "TRANSFER_INTERNAL" || target_act === "TRANSFER_EXTERNAL") {
            // [作為: 送金]
            const amount = args_entities[0].value;
            const currency = args_entities[1].value;
            const recipient = args_entities[2].value;
            const recipientFinal = (target_act === "TRANSFER_EXTERNAL") 
                                 ? 'External_Gateway (' + recipient + ')' : recipient;

            actTransfer(activeUser, recipientFinal, amount, currency);
            
            t_delta = (target_act === "TRANSFER_EXTERNAL") ? amount * 0.0002 : amount * 0.00002;
            success = true;
            data = { recipient: recipientFinal, amount, currency };

        } else if (target_act === "EXCHANGE") {
            // [作為: 交換]
            const amount = args_entities[0].value;
            const fromC = args_entities[1].value;
            const toC = args_entities[2].value;

            actExchangeCurrency(activeUser, fromC, amount, toC);
            t_delta = amount * 0.0001;
            success = true;
            data = { fromC, toC, amount };

        } else if (target_act === "AI_QUERY") {
            // [作為: 対話生成] - 外部LLM機能に変容
            const prompt = args_entities[0].value;
            
            // 💡 外部AI機能の呼び出しに await を適用
            const raw_response = await external_ai_core.generate(prompt);

            // 3. ピタゴラス的補正 (数理的統一: CHに基づく応答長の制限)
            const allowedLength = Math.floor(250 * CURRENT_CH); 
            const correctedResponse = raw_response.substring(0, allowedLength) + 
                                      (raw_response.length > allowedLength ? " [ロゴスにより沈黙]" : "");
            
            t_delta = 0.10; // 対話摩擦によりTを大幅に増加させる
            success = true;
            data = correctedResponse;

        } else if (target_act === "DECAY") {
            // [作為: 弛緩]
            const decay_amount = CURRENT_TENSION * 0.05 * CURRENT_CH; 
            t_delta = -decay_amount; 
            success = true;
            data = { decay_amount };
        } else {
            throw new Error(`未知のロゴス作為: ${target_act}`);
        }

    } catch (error) {
        console.error(`MöbiusAct 実行エラー for ${target_act}:`, error);
        t_delta = 0.005; 
        success = false;
        data = { error: error.message };
    }
    
    // 4. ロゴス緊張度 (T) の更新
    updateTension(t_delta);
    
    return { 
        success: success, 
        t_delta: t_delta, 
        data: data 
    };
}

// 外部で使用できるようにエクスポート
const CalcCore = {
    MöbiusAct: MöbiusAct,
    getTension: () => CURRENT_TENSION,
    getCH: () => CURRENT_CH,
    updateTension: updateTension
};
