import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { AspectRatio, ImageQuality, GroundingSource } from '../types';

let aiInstance: GoogleGenAI | null = null;

// Gracefully initialize the AI client.
// In an environment without `process` (like a browser), this will catch the error
// and aiInstance will remain null, preventing the app from crashing.
try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
} catch (error) {
    console.warn(
        "Could not initialize Gemini API client. This is expected in browser-only environments. API calls will fail until an API key is provided.",
        error
    );
}

// A helper function to ensure the AI client is initialized before any API call.
const getAi = (): GoogleGenAI => {
    if (!aiInstance) {
        throw new Error("Gemini API client is not initialized. Please ensure the API_KEY is configured in your execution environment.");
    }
    return aiInstance;
}

const fileToGenerativePart = (base64Data: string) => {
    const match = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
        throw new Error("无效的数据URL格式");
    }
    const mimeType = match[1];
    const data = match[2];
    return {
        inlineData: {
            mimeType,
            data,
        },
    };
};


export const generateImage = async (prompt: string, aspectRatio: AspectRatio, quality: ImageQuality): Promise<string> => {
    const ai = getAi();
    let qualityPrompt = '';
    if (quality === 'hd') {
        qualityPrompt = '超高细节, 最佳质量, 8k, 精细渲染, ';
    }
    
    // For gemini-2.5-flash-image, aspectRatio is part of the prompt.
    const fullPrompt = `galgame插画, 动漫风格, 宽高比 ${aspectRatio}, ${qualityPrompt}${prompt}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: fullPrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error('图像生成失败。可能是由于安全设置或无效的输入。');
};

export const editImage = async (
    prompt: string, 
    imageBase64: string,
    styleStrength: number, // 0-100
    creativity: number,     // 0-100
    negativePrompt: string
): Promise<string> => {
    const ai = getAi();
    const imagePart = fileToGenerativePart(imageBase64);
    
    // Reworked prompt logic with keyword-based instructions for better reliability.
    const promptParts = [prompt];

    // Interpret style strength
    if (styleStrength < 25) {
        promptParts.push('进行细微改动');
        promptParts.push('尽可能保留原图风格');
    } else if (styleStrength > 75) {
        promptParts.push('进行显著改动');
        promptParts.push('可大幅改变艺术风格');
    }

    // Interpret creativity
    if (creativity < 25) {
        promptParts.push('严格遵循文字描述');
    } else if (creativity > 75) {
        promptParts.push('发挥创意');
    }

    // Add negative prompt
    if (negativePrompt && negativePrompt.trim() !== '') {
        promptParts.push(`避免出现：${negativePrompt}`);
    }
    
    const fullPrompt = promptParts.join('，');
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                imagePart,
                { text: fullPrompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error('图像编辑失败。可能是由于安全设置或无效的输入。');
};

export const generateComplexScene = async (prompt: string): Promise<string> => {
    const ai = getAi();
    const fullPrompt = `根据以下想法，生成一个丰富、详细且富有表现力的场景描述，适用于galgame插画。请描述角色的外观、表情、姿势、环境、光照和整体氛围。想法：“${prompt}”`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: fullPrompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
        },
    });
    
    return response.text;
};

export const getCharacterIdeas = async (prompt: string): Promise<{ text: string; sources: GroundingSource[] }> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const sources: GroundingSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
        for (const chunk of groundingChunks) {
            if (chunk.web) {
                sources.push({ uri: chunk.web.uri, title: chunk.web.title || '无标题' });
            }
        }
    }
    
    return { text: response.text, sources };
};