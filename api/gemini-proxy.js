// /api/gemini-proxy.js - Vercel Edge Function (エラー回避のための最終版)

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=";

export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        // 💡 修正箇所: JSONボディを安全に解析
        // request.json() を呼び出し、結果をrequestBodyに代入
        const requestBody = await request.json(); 
        const prompt = requestBody.prompt; // requestBodyから直接 prompt プロパティを取得
        
        if (!apiKey) {
            throw new Error("API_KEY is not configured in Vercel Environment Variables.");
        }
        if (!prompt) {
             return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
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

        return new Response(JSON.stringify({ text: responseText }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (error) {
        console.error("Internal Function Error:", error.message);
        return new Response(JSON.stringify({ error: `Function Failed: ${error.message}` }), { status: 500 });
    }
}
