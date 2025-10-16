// core/external_finance_logos.js

// LNP通信プロトコルと監査機能は、既に定義されたモジュールに依存（Rust非依存の前提を維持）
import { sendLNPRequest, receiveLNPResponse } from './logos_network_protocol.js'; 

/**
 * 外部への送金/出金という高摩擦な作為をトリガーする。
 * この関数は、Rustコアの厳密な監査を要求する唯一の経路となる。
 * * @param {string} userName - 送金実行主体のユーザーネーム (作為の帰属のため必須)
 * @param {string} denomination - 通貨単位 (例: 'USD', 'ETH')
 * @param {number} amount - 送金額
 * @param {string} externalAddress - 宛先アドレス/口座情報 (具象的な摩擦)
 * @param {string} platformName - 送金先プラットフォーム (例: 'BINANCE', 'UNISWAP')
 * @returns {Promise<{transactionId: string, tensionIncrease: number}>} - 取引結果とロゴス緊張度フィードバック
 */
export async function initiateExternalTransfer(userName, denomination, amount, externalAddress, platformName) {
    if (!userName || !denomination || !amount || !externalAddress || !platformName) {
        // 具象的な摩擦: 入力値の不足
        console.error("[JS摩擦]: 全ての入力フィールドが必須です。");
        throw new Error("送金に必要な情報が不足しています。");
    }

    console.log(`[JS作為開始]: ${userName} が ${platformName} への送金を要求。`);

    // 1. Rustコアへの要求をLNPペイロードとして構成 (外部関数呼び出しの代わり)
    const actionPayload = {
        action: 'EXECUTE_EXTERNAL_TRANSFER',
        actor: userName, // NEW: ユーザーネームを作為の主体として明記
        data: {
            denomination,
            amount,
            externalAddress,
            platformName, 
        },
        audit_tag: 'HIGH_FRICTION_FINANCE_ACT', 
    };

    const requestPacket = {
        commands: [actionPayload] 
        // LNPは厳密なプロトコルのため、他のメタデータも含むが簡略化
    };

    try {
        // 2. LNPを介してRustコア（WASM）に作為を要求 (非同期通信)
        const stream = await sendLNPRequest(requestPacket); 
        const responsePacket = await receiveLNPResponse(stream);

        // 3. Rustコアからの応答を評価
        const coreResponse = responsePacket.response; 

        if (coreResponse.status === 'REJECTED_BY_LOGOS_TENSION') {
            // Rustコアによる作為の拒否（鎖国による防衛）
            throw new Error(`ロゴス緊張度過剰のため送金を拒否されました。現在の緊張度: ${coreResponse.tension}`);
        }
        
        if (coreResponse.status !== 'SUCCESS') {
            // Rustコアが監査に失敗した、または外部API接続で失敗した
            throw new Error(`Rustコア監査失敗: ${coreResponse.reason || '不明なエラー'}`);
        }

        console.log(`[JS作為完了]: 取引ID ${coreResponse.transactionId} を確認。`);
        return {
            transactionId: coreResponse.transactionId,
            tensionIncrease: coreResponse.newTension - coreResponse.oldTension // 緊張度の変化をフィードバック
        };

    } catch (error) {
        // 具象的な摩擦: ネットワークエラーや予期せぬ通信障害
        console.error(`[致命的な通信摩擦]: ${error.message}`);
        throw new Error('送金中に深刻な通信摩擦が発生しました。システムを再起動してください。');
    }
}
