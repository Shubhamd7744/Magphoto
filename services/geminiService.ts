import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "../constants";

// Helper to convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64 string"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
        ],
      },
    });

    // Extract the generated image
    // Gemini 2.5 Flash Image returns the image in the response candidates
    // Iterate to find the image part
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated.");
    }

    let generatedImageBase64: string | undefined;

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = part.inlineData.data;
        break; 
      }
    }

    if (!generatedImageBase64) {
      // Sometimes models might refuse and return text only
      const textPart = parts.find(p => p.text);
      if (textPart) {
        throw new Error(`The model returned text instead of an image: "${textPart.text}"`);
      }
      throw new Error("No image data found in response.");
    }

    return `data:image/png;base64,${generatedImageBase64}`;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};