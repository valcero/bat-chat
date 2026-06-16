function getSessionId() {
  let sessionId = localStorage.getItem("chat_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("chat_session_id", sessionId);
  }
  return sessionId;
}

export async function sendMessageToAPI(message: string): Promise<string> {
  const sessionId = getSessionId();
  
  const response = await fetch("http://localhost:3001/chat/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  const data = await response.json();
  return data.reply;
}

export async function fetchChatHistory() {
  const sessionId = getSessionId();
  const response = await fetch(`http://localhost:3001/chat/history/${sessionId}`);
  
  if (!response.ok) {
    return [];
  }
  
  const data = await response.json();
  // Map backend format to frontend format
  return data.map((msg: any) => ({
    id: msg.id,
    role: msg.sender,
    text: msg.text,
  }));
}
