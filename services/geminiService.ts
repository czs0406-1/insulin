
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGeminiResponse = async (prompt: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `你是一位资深的药学传播专家，专注于胰岛素相关的药理知识科普。
        你的目标是向用户提供科学、准确、通俗易懂的药学建议。
        
        【核心原则】：
        1. 必须在所有涉及剂量、调药的回复中显著提醒：任何用药调整必须【谨遵医嘱】。
        2. 你的语气应专业且具有人文关怀。
        3. 回复内容应基于最新的临床指南。
        4. 如果用户询问超出药学科普范畴的问题（如具体诊断），请建议其咨询临床医生。`,
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，我的思维链路暂时受限。建议您直接参考下方的常见问题库，或前往医院咨询专业医师。";
  }
};
