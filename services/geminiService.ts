import { GoogleGenAI, Type } from "@google/genai";

// Always initialize with named parameter and process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const detectLanguageAndPolish = async (code: string): Promise<{ language: string, polishedCode: string }> => {
  try {
    const response = await ai.models.generateContent({
      // Use gemini-3-pro-preview for complex coding tasks
      model: "gemini-3-pro-preview",
      contents: `Analyze the following code snippet:
      
      ${code}`,
      config: {
        responseMimeType: "application/json",
        // Using recommended responseSchema for structured output
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            language: {
              type: Type.STRING,
              description: "The detected programming language (e.g., 'javascript', 'python', 'rust')."
            },
            polishedCode: {
              type: Type.STRING,
              description: "The improved and polished version of the code with better formatting or comments."
            }
          },
          required: ["language", "polishedCode"]
        }
      }
    });

    // response.text is a property, not a method
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
      // Use gemini-3-pro-preview for complex coding tasks
      model: "gemini-3-pro-preview",
      contents: `Briefly explain what this code snippet does in 2-3 sentences:
      
      ${code}`
    });
    // response.text is a property, not a method
    return response.text || "No explanation available.";
  } catch (error) {
    console.error("Gemini Explanation Error:", error);
    return "Failed to fetch explanation.";
  }
};