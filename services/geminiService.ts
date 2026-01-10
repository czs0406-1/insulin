
/**
 * 离线版本：不调用 Gemini API。
 * 所有的交互都在 InteractiveExpert 组件中通过本地状态管理。
 */
export const getGeminiResponse = async (prompt: string): Promise<string | undefined> => {
  console.warn("AI 咨询服务已切换至本地数字专家模式，不产生外部 API 调用。");
  return undefined;
};
