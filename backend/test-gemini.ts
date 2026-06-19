import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    const chatWithHistory = ai.chats.create({
      model: "gemini-2.5-flash",
      history: [
        { role: "user", parts: [{ text: "hello" }] }
      ],
    });

    const response = await chatWithHistory.sendMessage({ message: "hi" });
    console.log("Success:", response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

run();
