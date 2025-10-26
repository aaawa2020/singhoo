import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { AspectRatio, ImageQuality, GroundingSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    let qualityPrompt = '';
    if (quality === 'hd') {
        qualityPrompt = '超高细节, 最佳质量, 8k, 精细渲染, ';
    }
    
    const fullPrompt = `galgame插画, 动漫风格, ${qualityPrompt}${prompt}`;

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    throw new Error('图像生成失败。');
};

export const editImage = async (
    prompt: string, 
    imageBase64: string,
    styleStrength: number, // 0-100
    creativity: number,     // 0-100
    negativePrompt: string
): Promise<string> => {
    const imagePart = fileToGenerativePart(imageBase64);
    
    let fullPrompt = prompt;

    // Interpret style strength
    if (styleStrength < 25) {
        fullPrompt = `进行一个非常细微的改动：${prompt}。尽可能保持原始图像的风格。`;
    } else if (styleStrength > 75) {
        fullPrompt = `对这张图片进行大刀阔斧的修改：${prompt}。可以显著改变图片的风格。`;
    }

    // Interpret creativity
    if (creativity < 25) {
        fullPrompt += ` 请严格按照文字描述进行操作。`;
    } else if (creativity > 75) {
        fullPrompt += ` 请发挥你的想象力，进行创造性的诠释。`;
    }

    // Add negative prompt
    if (negativePrompt && negativePrompt.trim() !== '') {
        fullPrompt += ` 请务必避免出现以下内容：${negativePrompt}。`;
    }
    
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
