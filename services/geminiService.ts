
import { GoogleGenAI } from "@google/genai";

// Obtener la API key desde las variables de entorno
const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ API_KEY environment variable not set. Please configure GEMINI_API_KEY in your environment.");
}

// Inicializar el cliente de Google Gemini AI
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const getAiResponse = async (prompt: string, systemInstruction: string): Promise<string> => {
  // Verificar que la API key esté configurada
  if (!API_KEY || !ai) {
    const errorMsg = "❌ Error: API key is not configured. Please set the GEMINI_API_KEY environment variable.";
    console.error(errorMsg);
    return errorMsg;
  }

  try {
    console.log("🤖 Sending request to Gemini AI...");
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.95,
      }
    });
    
    console.log("✅ Response received from Gemini AI");
    return response.text || "No response received from AI.";
    
  } catch (error) {
    console.error("❌ Error fetching AI response:", error);
    
    // Manejar diferentes tipos de errores
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return "❌ Error: Invalid API key. Please check your GEMINI_API_KEY configuration.";
      }
      if (error.message.includes('quota')) {
        return "❌ Error: API quota exceeded. Please try again later.";
      }
      if (error.message.includes('network')) {
        return "❌ Error: Network connection issue. Please check your internet connection.";
      }
    }
    
    return "❌ Sorry, I encountered an error while processing your request. Please try again.";
  }
};
