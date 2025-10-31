// /api/gemini-proxy.js
// Vercel Edge Functionとして動作し、APIキーを秘匿化します

import { GoogleGenAI } from '@google/genai'; 

// 🚨 APIキーは環境変数から読み込む（Vercel側で設定必須）
const API_KEY = process.env.GEMINI_API_KEY; 
const ai = new GoogleGenAI(API_KEY);

export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    try {
        const { prompt } = await request.json();

        if (!prompt) {
             return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
        }
        
        // 💡 Gemini APIの呼び出し
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt, // プロンプトを直接渡す
        });

        // 応答をフロントエンドに返す
        return new Response(JSON.stringify({ text: response.text }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // CORS許可
            },
        });

    } catch (error) {
        console.error("Gemini Proxy Error:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
