# Spur Support: AI Live Chat

Hey there! 👋 Welcome to my submission for the AI customer support chatbot. 

This project simulates a live e-commerce support agent. It's built with a modern React frontend and a rock-solid Express backend, glued together with a PostgreSQL database and powered by Google's Gemini 2.5 Flash model. 

Below you'll find everything you need to know about how to spin this up locally, how the architecture was designed, and the decisions made along the way.

---

## 🚀 How to Run Locally

To get this project running on your own machine, you'll need two terminal windows open: one for the backend, and one for the frontend.

### 1. Database Setup
We use Docker to quickly spin up a local PostgreSQL instance. From the root of the project, run:
```bash
docker-compose up -d
```
*(Note: We map this to port `5433` locally to avoid conflicts if you already have Postgres running natively on `5432`!)*

### 2. Configure Environment Variables
Navigate to the `backend/` directory and create a `.env` file:
```env
DATABASE_URL="postgresql://admin:adminpassword@localhost:5433/aichat?schema=public"
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3001
```

### 3. Initialize the Backend
Inside the `backend/` directory, install the dependencies and push the Prisma schema to your newly created database:
```bash
cd backend
npm install
npx prisma db push
npx prisma generate
```

### 4. Start the Servers
- **Backend**: In the `backend/` directory, start the server:
  ```bash
  npm run dev
  ```
- **Frontend**: Open a new terminal in the root directory, install dependencies, and start Vite:
  ```bash
  npm install
  npm run dev
  ```

Navigate to `http://localhost:5173` in your browser. You should see the chat widget floating in the bottom right corner. Say hello!

---

## 🏗️ Architecture Overview

I intentionally engineered the backend to be as clean, decoupled, and extensible as possible. The structure is separated into strict layers:

- **Routes (`chat.routes.ts`)**: Defines the API endpoints.
- **Controllers (`chat.controller.ts`)**: Acts purely as the HTTP layer. It parses the request, validates the input (rejecting empty messages or massive text dumps), and handles HTTP response codes.
- **Services (`chat.service.ts` & `llm.service.ts`)**: This is where the core business logic lives. 

**Interesting Design Decision (Separation of Concerns):** 
I deliberately ripped the database and LLM logic out of the controller and put it into `chat.service.ts`. The `processIncomingMessage()` function accepts a `sessionId` and `text`, talks to Prisma, talks to Gemini, and returns the response. 
Why? Because if we want to hook up a WhatsApp or Instagram webhook tomorrow, we don't have to rewrite any database logic. The new `whatsapp.controller.ts` would simply parse the webhook payload and pass it straight into the exact same `chatService` function.

---

## 🤖 LLM Notes

- **Provider**: I used **Google Gemini (Gemini 2.5 Flash)** via the `@google/genai` SDK. It's incredibly fast, which makes the live-chat experience feel snappy and responsive.
- **Prompting Strategy**: The LLM is initialized with a strict `SYSTEM_INSTRUCTION` that grounds it as a helpful e-commerce support agent. It's pre-loaded with domain knowledge about shipping times (3-5 days), return policies (30 days), and support hours. 
- **Context Awareness**: The backend fetches the entire conversation history from the database and feeds it into the LLM context window on every message, ensuring the AI remembers previous context perfectly.

---

## ⚖️ Trade-offs & "If I had more time..."

While I'm proud of this implementation, given an 8-12 hour timebox, there are always things left on the cutting room floor:

1. **Authentication & Session Management**: Right now, sessions are tracked via a simple UUID stored in the frontend's `localStorage`. If I had more time, I'd implement true user authentication (like JWTs or NextAuth) so users could log in across devices and see their past support tickets.
2. **Cost Control Limits**: I've prevented massive input text dumps from hitting the API, but I haven't implemented strict `maxOutputTokens` capping on the Gemini API call itself. For a real production app, capping tokens and rate-limiting IPs would be essential to prevent malicious cost-draining.
3. **Optimistic UI Updates**: Currently, the UI waits for the backend to confirm the user's message before showing the "Agent is typing..." indicator. With more time, I'd implement a fully optimistic UI to make the chat feel truly instantaneous on slow networks.

Thanks for checking out the project! 🦇
