import { prisma } from "../lib/prisma";
import { generateReply } from "./llm.service";
import { Message } from "@prisma/client";

/**
 * Core business logic for processing an incoming chat message.
 * This is decoupled from HTTP requests so it can be reused for WhatsApp, IG, etc.
 * 
 * @param sessionId - A unique identifier for the user/session.
 * @param text - The text message sent by the user.
 * @returns The AI's generated reply text.
 */
export async function processIncomingMessage(sessionId: string, text: string): Promise<string> {
  // 1. Fetch conversation or create one if it doesn't exist
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

  // 2. Save the user's message to the database
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "user",
      text: text,
    }
  });

  // 3. Extract the history to provide context to the LLM
  const history = conversation.messages.map(msg => ({
    sender: msg.sender,
    text: msg.text,
  }));

  // 4. Call the LLM service to generate a response
  const replyText = await generateReply(history, text);

  // 5. Save the AI's reply to the database
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "ai",
      text: replyText,
    }
  });

  return replyText;
}

/**
 * Core business logic for retrieving a conversation history.
 * 
 * @param sessionId - A unique identifier for the user/session.
 * @returns An array of Messages or an empty array if not found.
 */
export async function getConversationHistory(sessionId: string): Promise<Message[]> {
  const conversation = await prisma.conversation.findUnique({
    where: { sessionId },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' }
      }
    }
  });

  return conversation?.messages || [];
}
