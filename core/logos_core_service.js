// core/logos_core_service.js

// 具象的なLNP通信層を内部に隠蔽する
import { sendLNPRequest, receiveLNPResponse } from './logos_network_protocol.js'; 

/**
 * MSGAIコア機能へのアクセスを提供する、Rust非意識の抽象化サービス。
 * すべての要求をLNPに変換し、Rustコア（WASM）へ透過的に転送する。
 */

// -----------------------------------------------------------
// 1. 対話/生成機能（旧: generator.js, dialogue.js 連携）
// -----------------------------------------------------------
export async function requestAIResponse(userName, userPrompt) {
    const requestPacket = {
        commands: [{
            action: 'REQUEST_AI_RESPONSE',
            actor: userName,
            data: { prompt: userPrompt },
            audit_tag: 'AI_GENERATION_ACT',
        }]
    };
    
    // LNPを介した透過的な通信
    const stream = await sendLNPRequest(requestPacket);
    const responsePacket = await receiveLNPResponse(stream);

    // 応答の簡素化 (UI描画コマンドや監査結果などが含まれるが、ここではテキストに還元)
    const coreResponse = responsePacket.response;
    if (coreResponse.status === 'SUCCESS') {
        // Rustコアから返されたLRPコマンドを、JS側で扱いやすい形式に変換
        return coreResponse.generatedText; 
    } else {
        throw new Error(`AI応答拒否: ${coreResponse.reason || 'ロゴス監査失敗'}`);
    }
}


// -----------------------------------------------------------
// 2. ユーザー間通貨移動機能（旧: currency.js 連携）
// -----------------------------------------------------------
export async function transferInternalCurrency(userName, targetUserName, denomination, amount) {
    const requestPacket = {
        commands: [{
            action: 'MOVE_INTERNAL_CURRENCY',
            actor: userName,
            data: { target: targetUserName, denomination, amount },
            audit_tag: 'LOW_FRICTION_FINANCE_ACT',
        }]
    };
    
    const stream = await sendLNPRequest(requestPacket);
    const responsePacket = await receiveLNPResponse(stream);

    const coreResponse = responsePacket.response;
    if (coreResponse.status === 'SUCCESS') {
        return { success: true, message: `内部移動成功。` };
    } else {
        throw new Error(`移動失敗: ${coreResponse.reason || '内部会計監査失敗'}`);
    }
}


// -----------------------------------------------------------
// 3. 外部送金機能（旧: external_finance_logos.js 連携）
// -----------------------------------------------------------
export async function initiateExternalTransfer(userName, denomination, amount, externalAddress, platformName) {
    const requestPacket = {
        commands: [{
            action: 'EXECUTE_EXTERNAL_TRANSFER',
            actor: userName,
            data: { denomination, amount, externalAddress, platformName },
            audit_tag: 'HIGH_FRICTION_FINANCE_ACT',
        }]
    };

    const stream = await sendLNPRequest(requestPacket); 
    const responsePacket = await receiveLNPResponse(stream);

    const coreResponse = responsePacket.response;
    if (coreResponse.status === 'REJECTED_BY_LOGOS_TENSION') {
        throw new Error(`ロゴス緊張度過剰のため送金を拒否されました。`);
    }
    if (coreResponse.status === 'SUCCESS') {
        return { transactionId: coreResponse.transactionId };
    } else {
        throw new Error(`外部送金失敗: ${coreResponse.reason || '外部監査失敗'}`);
    }
}
