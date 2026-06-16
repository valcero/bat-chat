import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { generateReply } from "../services/llm.service";

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

    // Fetch conversation or create one
    let conversation = await prisma.conversation.findUnique({
      where: { sessionId },
      include: { messages: { orderBy: { timestamp: 'asc' } } }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { sessionId },
        include: { messages: true }
      });
    }

    // Extract history for the LLM context
    const history = conversation.messages.map(msg => ({
      sender: msg.sender,
      text: msg.text,
    }));

    // Save user message to DB
    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: "user",
        text: message,
      }
    });

    // Generate reply using LLM
    const replyText = await generateReply(history, message);

    // Save AI reply to DB
    const aiMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: "ai",
        text: replyText,
      }
    });

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

    const conversation = await prisma.conversation.findUnique({
      where: { sessionId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!conversation) {
      res.json([]);
      return;
    }

    res.json(conversation.messages);
  } catch (error) {
    console.error("Error in getHistory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
