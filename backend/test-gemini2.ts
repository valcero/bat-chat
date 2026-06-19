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

async function test() {
  try {
    const formattedHistory = []; // Empty history

    const chatWithHistory = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: formattedHistory,
    });

    const response = await chatWithHistory.sendMessage({ message: "Hello" });

    console.log("Response:", response.text);
  } catch (error) {
    console.error("Error generating reply from Gemini:", error);
  }
}

test();
