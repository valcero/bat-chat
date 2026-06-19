import { processIncomingMessage } from "./src/services/chat.service";

async function test() {
  try {
    const reply = await processIncomingMessage("test-session", "hello from test script");
    console.log("Reply:", reply);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
