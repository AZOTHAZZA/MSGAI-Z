// /core/external_ai_core.js - 対話型ロゴスの実体 (Gemini API利用の概念)

// 💡 修正箇所 1: VercelプロキシのURLを定義
// あなたのデプロイURLに合わせて修正済みです
const VERCEL_PROXY_URL = 'https://msgai-z.vercel.app/api/gemini-proxy'; 

/**
 * 外部LLM APIを呼び出し、応答を生成する (非同期処理)
 * @param {string} prompt - ユーザーのプロンプト
 * @returns {Promise<string>} - LLMからの生の応答テキスト
 */
const external_ai_core = {
    generate: async (prompt) => {
        console.log(`[EXTERNAL_AI] Prompt received: "${prompt.substring(0, 40)}..."`);
        
        // --- 💡 修正箇所 2: ダミーロジックをfetchによるプロキシ呼び出しに置き換え ---
        try {
            // Vercel Edge FunctionのプロキシURLにPOSTリクエストを送信
            const response = await fetch(VERCEL_PROXY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // ユーザーのプロンプトをJSONボディとしてプロキシに送信
                body: JSON.stringify({ prompt: prompt }) 
            });

            // HTTPエラー（4xx, 5xx）をチェック
            if (!response.ok) {
                // エラー応答の解析を試みる
                const errorData = await response.json().catch(() => ({ error: 'Unknown Proxy Error (Non-JSON response)' }));
                throw new Error(`Proxy Call Failed: Status ${response.status}. Error: ${errorData.error || 'Server responded with an error.'}`);
            }

            const data = await response.json();
            
            // プロキシからの応答テキスト（data.text）を返す
            return data.text || "ロゴス応答が空です。"; 

        } catch (error) {
            console.error("[EXTERNAL_AI_CORE] Fetch to Vercel Proxy failed:", error);
            // エラーが発生した場合も、CalcLangのUIにフィードバックメッセージを返す
            return `ロゴス接続エラー: Vercelプロキシとの通信に失敗しました。詳細: ${error.message}`;
        }
    }
};
