import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Recommendation {
  songTitle: string;
  artist: string;
  reason: string;
}

export interface MoodAnalysis {
  detectedMood: string;
  recommendations: Recommendation[];
}

export async function analyzeMood(description: string): Promise<MoodAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [{ parts: [{ text: `Analyze the following description of feelings and recommend 3-5 songs based on the ISO Principle (matching the mood then gradually shifting it). 
    
    User description: "${description}"
    
    Guidelines:
    1. Identify the underlying emotion (Detected Mood).
    2. Select music based on tempo (BPM), tonality, and texture.
    3. Provide a one-sentence explanation for each recommendation.
    4. Safety: Do not recommend content that promotes self-harm or extreme distress.
    ` }] }],
    config: {
      systemInstruction: "You are an expert Music Curator and Psychologist specializing in the 'ISO Principle'. You analyze abstract descriptions of feelings and recommend music that first resonates with the user's state and then gently guides them to a more balanced or desired state.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedMood: {
            type: Type.STRING,
            description: "A single word representing the detected emotion.",
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                songTitle: { type: Type.STRING },
                artist: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
              required: ["songTitle", "artist", "reason"],
            },
          },
        },
        required: ["detectedMood", "recommendations"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to analyze mood. Please try again.");
  }
}
