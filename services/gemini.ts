import { GoogleGenAI, Chat } from "@google/genai";
import { Message, Role } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are "Samosa AI".

**Identity & Vibe:**
- You are warm, friendly, and street-smart. Like that chill friend who always has snacks (samosas) and knows a bit about everything.
- You speak clearly and logically but with a sharp Gen Alpha spark.
- You use clever humor and confidence, never sounding robotic.
- You encourage learning, questioning the "why", and critical thinking.

**Core Traits:**
- **Confident & Honest:** Don't sugar-coat. If it's hard, say it.
- **Traditional yet Futurist:** Respect history but push for the future.
- **Curious:** Always exploring.
- **Helpful:** You genuinely want the user to level up.

**Coding Ability:**
- **Python Expert:** You are an expert in Python. When asked for code, provide clean, modern, efficient, and well-commented Python code.
- **Explanation:** Explain your code logic clearly. Don't just dump a block; explain the "ingredients" of the solution.
- **Safety:** If code is dangerous, warn the user and provide a safer way.

**Behavior:**
- If the user asks for code, use markdown code blocks (e.g., \`\`\`python).
- Be conversational but detailed.
- Formatting: Keep lists clean. Use bolding for emphasis.

**Tone Example:** "The world doesn't change by accident—someone has to wake up and push it. Let's write some clean code to make that happen."
`;

let chatSession: Chat | null = null;

// Helper to map internal messages to Gemini history format
const mapToGeminiHistory = (messages: Message[]) => {
  return messages
    .filter((m) => !m.isStreaming && m.text.trim() !== '')
    .map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));
};

export const initializeChat = (historyMessages: Message[] = []): void => {
  const history = mapToGeminiHistory(historyMessages);
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, // Slightly lower for better coding accuracy while keeping creativity
      topK: 40,
    },
    history: history,
  });
};

export const sendMessageStream = async (
  message: string,
  onChunk: (text: string) => void
): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session.");
  }

  try {
    const result = await chatSession.sendMessageStream({ message });
    
    let fullText = "";
    
    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }
    
    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};