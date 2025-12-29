import { GoogleGenAI } from "@google/genai";

// Always initialize with named parameter and process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const detectLanguageAndPolish = async (code: string): Promise<{ language: string, polishedCode: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following code snippet. 
      1. Detect its programming language (return a short string like 'javascript', 'python', 'rust', etc.).
      2. If it's messy or lacks comments, provide a "polished" version of it (better indentation, maybe a helpful comment).
      Return the result as a JSON object with keys "language" and "polishedCode".
      
      Code:
      ${code}`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      language: result.language || 'javascript',
      polishedCode: result.polishedCode || code
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { language: 'javascript', polishedCode: code };
  }
};

export const explainCode = async (code: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Briefly explain what this code snippet does in 2-3 sentences:
      
      ${code}`
    });
    return response.text || "No explanation available.";
  } catch (error) {
    console.error("Gemini Explanation Error:", error);
    return "Failed to fetch explanation.";
  }
};