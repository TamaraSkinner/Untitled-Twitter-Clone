📜 Scrollr - The Wizarding Social Scrying Pool
Scrollr is a real-time social platform designed for wizards to share their latest spells, incantations, and potion recipes. It features a unique "Consult the Orb" AI integration that transforms standard text into dark, gothic wizardry.

✨ Key Features
Wizard Authentication: Secure portal entry using JWT-based "Magic Tokens".

Real-time Scrying Pool: A live global feed powered by WebSockets (Socket.io) that updates instantly when new spells are cast.

Consult the Orb (AI): Integrated OpenAI GPT-3.5/4 logic that rewrites user posts into mysterious, ancient incantations.

Dynamic Identity: Automated slug generation (e.g., @gandalf_the_grey) based on your unique wizard name.

Responsive Cauldron: An auto-expanding spell-casting area that grows as your magic flows.

🛠️ Tech Stack
Backend

Node.js & Express: Core server architecture.

PostgreSQL: Relational database for storing wizards and their spells.

Socket.io: Real-time bidirectional event handling.

OpenAI API: The "Orb" logic for AI text transformation.

Frontend

Vanilla JavaScript: Lightweight, reactive DOM manipulation.

CSS3: Custom dark-themed wizardry with a responsive layout.

🚀 Quick Start
1. Prepare the Ingredients (Prerequisites)

Node.js 18+

PostgreSQL Database

OpenAI API Key

2. Initialize the Cauldron

Bash
cd backend
npm install
3. Set Environmental Wards Create a .env file in the backend folder:

Code snippet
PORT=3000
DATABASE_URL=your_postgres_url
TOKEN_SECRET=your_secret_magic_phrase
OPENAI_API_KEY=your_orb_key
4. Ignite the Server

Bash
node server.js
🏆 Submission Highlights
AI Integration: Seamless "Incantify" feature that bridges modern LLMs with a fantasy UI.

Real-world Architecture: Implements industry-standard JWT authentication and WebSocket synchronization.

Data Integrity: Uses PostgreSQL JOINs to ensure every spell correctly attributes its original creator.

📜 License
MIT License - Scrollr Hackathon Project