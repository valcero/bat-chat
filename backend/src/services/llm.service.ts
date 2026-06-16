import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are a helpful support bot for an e-commerce store. 
Please answer questions based on the following rules:
- Shipping takes 3-5 days.
- Returns are accepted within 30 days.
- Support hours are 9 AM - 5 PM EST.

If the user asks something outside of your knowledge, be polite and try to help, but prioritize the above information.`;

export async function generateReply(conversationHistory: { sender: string; text: string }[], userMessage: string): Promise<string> {
  try {
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // Start a chat session
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    // If there is history, we can simulate it by sending previous messages or passing history to the chat creation
    // The @google/genai SDK allows passing history directly when creating the chat
    const chatWithHistory = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: formattedHistory,
    });

    const response = await chatWithHistory.sendMessage({ message: userMessage });

    return response.text || "I'm having trouble connecting right now. Please try again in a moment.";
  } catch (error) {
    console.error("Error generating reply from Gemini:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}
