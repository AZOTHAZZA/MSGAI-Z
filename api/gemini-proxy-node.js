// /api/gemini-proxy-node.js - Vercel Serverless Function (Node.js)

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=";

// Node.js Serverless Functionでは、この export 形式が一般的
export default async (request, response) => { 
    // Node.js環境では、req.method が使われる（Edgeとは異なる）
    if (request.method !== 'POST') {
        response.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        // 💡 修正箇所: request.body を使用（Node.js環境での標準的なJSON解析）
        // Vercelが自動的に request.body をJSONオブジェクトとして提供してくれる
        const requestBody = request.body; 
        const prompt = requestBody.prompt;
        
        if (!apiKey) {
            response.status(500).json({ error: "API_KEY is not configured in Vercel Environment Variables." });
            return;
        }
        if (!prompt) {
             response.status(400).json({ error: 'Prompt is required' });
             return;
        }
        
        // Gemini APIの生のHTTP呼び出し
        const geminiResponse = await fetch(GEMINI_API_URL + apiKey, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            })
        });

        const geminiData = await geminiResponse.json();
        
        // 応答の検証
        if (!geminiResponse.ok || geminiData.error) {
            const errorDetail = geminiData.error ? geminiData.error.message : geminiResponse.statusText;
            throw new Error(`Gemini API Error: ${errorDetail}`);
        }

        const responseText = geminiData.candidates[0].content.parts[0].text;

        // 成功応答をCalcLangフロントエンドに返す
        response.status(200).json({ text: responseText });

    } catch (error) {
        console.error("Internal Function Error:", error.message);
        response.status(500).json({ error: `Function Failed: ${error.message}` });
    }
}
