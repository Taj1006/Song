import { GoogleGenAI, Type } from "@google/genai";
import { LyricalAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeLyrics(lyrics: string): Promise<LyricalAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [{ parts: [{ text: `Analyze these lyrics as a Senior Music Analyst and Linguistic Expert:\n\n${lyrics}` }] }],
    config: {
      systemInstruction: `You are a Senior Music Analyst and Linguistic Expert. Your goal is to dissect song lyrics to uncover their deepest emotional layers, thematic nuances, and cultural significance. You don't just summarize; you interpret the "soul" of the song.

Analysis Framework:
1. The Core Narrative: Summarize the central story or message in 2-3 sentences.
2. Emotional Spectrum:
   - Primary Emotion: (e.g., Melancholy, Euphoria, Resentment)
   - Emotional Intensity: Rate from 1-10.
   - Mood Shift: Note if the emotion changes from the beginning to the end.
3. Literary Devices & Symbolism: Identify key metaphors, similes, or recurring symbols. Explain what they represent.
4. Subtext ("Reading Between the Lines"): What is the artist saying without saying it? Is there a hidden social commentary or a personal confession?
5. Vibe & Setting: Describe the ideal environment to listen to this song.

Tone & Style: Insightful, poetic, yet objective. Use descriptive adjectives. If ambiguous, provide multiple interpretations.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          coreNarrative: { type: Type.STRING },
          emotionalSpectrum: {
            type: Type.OBJECT,
            properties: {
              primaryEmotion: { type: Type.STRING },
              intensity: { type: Type.NUMBER },
              moodShift: { type: Type.STRING }
            },
            required: ["primaryEmotion", "intensity", "moodShift"]
          },
          literaryDevices: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                device: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["device", "explanation"]
            }
          },
          subtext: { type: Type.STRING },
          vibeAndSetting: { type: Type.STRING }
        },
        required: ["coreNarrative", "emotionalSpectrum", "literaryDevices", "subtext", "vibeAndSetting"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
