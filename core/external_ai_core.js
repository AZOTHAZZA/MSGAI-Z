// /core/external_ai_core.js - Gemini APIを介した外部AIコアとの通信ロジック

// ⚠️ 注意: __app_id, __firebase_config, __initial_auth_token はCanvas環境から提供されるグローバル変数です。
// API Keyは、この環境では自動的に提供されるため、ここでは空文字列を設定します。
const apiKey = ""; 
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

// API呼び出しのエラーハンドリングと指数バックオフを行うラッパー関数
async function fetchWithRetry(url, options, maxRetries = 5) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                // HTTPステータスが2xx以外の場合
                const errorText = await response.text();
                throw new Error(`API Request failed with status ${response.status}: ${errorText}`);
            }
            
            return response;

        } catch (error) {
            console.warn(`Attempt ${i + 1} failed: ${error.message}. Retrying...`);
            if (i === maxRetries - 1) {
                throw new Error(`API Request failed after ${maxRetries} attempts.`);
            }
            // 指数バックオフ
            const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

/**
 * Gemini APIを呼び出し、テキストコンテンツを生成します。
 * @param {string} prompt - ユーザーからのプロンプト
 * @param {Array<Object>} history - 過去の対話履歴 (ここでは未使用だがシグネチャを維持)
 * @returns {Promise<{text: string, sources: Array<Object>}>} - 生成されたテキストと引用元
 */
async function generateGeminiContent(prompt, history) {
    
    // システム命令: MTC-AIロゴス監査コンソールのAIペルソナを設定
    const systemPrompt = `あなたは、MTC-AIロゴス監査コンソールに組み込まれた、高度な哲学的・論理的対話モジュールです。
    ユーザーからの問いに対して、簡潔で示唆に富む、哲学的な考察を返答してください。
    回答は日本語で、常にユーザーの問いに真摯に向き合った、一貫性のある「ロゴス的」な内容でなければなりません。`;

    // ペイロードの構築
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        
        // Google Search Groundingを有効にする (最新情報に基づく回答を可能にする)
        tools: [{ "google_search": {} }],
        
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
        
        // 生成設定 (オプション)
        config: {
            temperature: 0.7,
        }
    };

    try {
        const response = await fetchWithRetry(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            const text = candidate.content.parts[0].text;
            let sources = [];

            // 引用元の抽出 (Groundingを使用した場合)
            const groundingMetadata = candidate.groundingMetadata;
            if (groundingMetadata && groundingMetadata.groundingAttributions) {
                sources = groundingMetadata.groundingAttributions
                    .map(attribution => ({
                        uri: attribution.web?.uri,
                        title: attribution.web?.title,
                    }))
                    .filter(source => source.uri && source.title); 
            }

            return { text, sources };

        } else {
            console.error("Gemini API response structure invalid or content missing:", result);
            return { text: "エラー: AIコアからの有効な応答が得られませんでした。", sources: [] };
        }

    } catch (error) {
        console.error("Failed to generate content from Gemini API:", error);
        return { text: `エラー: API通信中に致命的なエラーが発生しました (${error.message})。`, sources: [] };
    }
}

