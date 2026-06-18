import { Request, Response } from "express";
import { processIncomingMessage, getConversationHistory } from "../services/chat.service";

export const handleMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      res.status(400).json({ error: "Message is required and must not be empty." });
      return;
    }

    if (message.length > 1000) {
      res.status(400).json({ error: "Message is too long." });
      return;
    }

    if (!sessionId || typeof sessionId !== "string") {
      res.status(400).json({ error: "Session ID is required." });
      return;
    }

    // Hand off to the business logic layer
    const replyText = await processIncomingMessage(sessionId, message);

    res.json({ reply: replyText, sessionId });
  } catch (error) {
    console.error("Error in handleMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      res.status(400).json({ error: "Session ID is required." });
      return;
    }

    // Hand off to the business logic layer
    const messages = await getConversationHistory(sessionId);

    res.json(messages);
  } catch (error) {
    console.error("Error in getHistory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
