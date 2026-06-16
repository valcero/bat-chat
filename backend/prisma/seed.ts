import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting DB seeding...");

  // Create a dummy conversation
  const dummySessionId = "test-session-123";
  
  const conversation = await prisma.conversation.upsert({
    where: { sessionId: dummySessionId },
    update: {},
    create: {
      sessionId: dummySessionId,
    },
  });

  console.log(`Created/found conversation with id: ${conversation.id}`);

  // Create a dummy message
  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "user",
      text: "Hello, this is a test message!",
    },
  });

  console.log(`Created message with id: ${message.id}`);
  console.log("DB seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
