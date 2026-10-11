# NatureQuest AI 🌿 — Touch Grass Daily

An open-source, full-stack AI-powered outdoor adventure web application built for the **"Touch Grass"** theme.

NatureQuest AI turns screen fatigue into mindful nature habits. It generates personalized outdoor micro-quests using **Google Gemini**, identifies plants and wildlife through multimodal AI vision, records observations in a personal **Nature Journal**, and gamifies outdoor consistency with levels, badges, and streaks.

---

## 🌟 Key Features

1. **AI Quest Generator**:
   - Tailored outdoor challenges based on duration (5 to 60 mins), difficulty, activity (Walking, Plant Observation, Bird Watching, Photography, Mindfulness, Litter Cleanup), and setting (Park, Garden, Backyard, Neighborhood).
   - Generates actionable tasks, safety reminders, and XP rewards.
   - Powered by official **Google Gen AI SDK** with structured Pydantic validation and **curated offline fallback quests**.
   - Zero-footprint Leave No Trace ethics (never encourages foraging toxic species, trespassing, or disturbing habitats).

2. **Nature Explorer & Flora Identification**:
   - Upload or snap photos of plants, leaves, fungi, or wildlife.
   - Provides common name, scientific name, confidence score, botanical characteristics, and ecological facts.
   - Uses **Google Gemini Vision** with graceful fallback to built-in naturalist knowledge.

3. **Field Nature Journal**:
   - Comprehensive CRUD interface to catalog observed species and sensory reflections.
   - Filter by category (Plant, Tree, Fungi, Bird, Insect, Other) and instant keyword search.

4. **Gamification & Habit Analytics**:
   - XP leveling formula: $\text{Level } N = 100 \times (N - 1)^{1.5} \text{ XP}$.
   - Anti-duplication reward verification on the backend.
   - Visual 7-day outdoor minutes bar chart powered by Recharts.
   - Dynamic achievement badges (First Step Outdoors, Trail Blazer, Curious Naturalist, Fresh Air Habit).

5. **Security & Privacy**:
   - Backend API keys never exposed to client or browser bundles.
   - Password hashing with Bcrypt and JWT token handling.
   - Guest exploration mode enabled for seamless evaluation.
   - Full JSON data export for user privacy and data portability.

---

## 🎨 Color Palette & Design System

- **Forest green**: `#245C43` (Primary brand & buttons)
- **Leaf green**: `#A8D5A2` (Accents & borders)
- **Pale mint**: `#EAF5E9` (Pill badges & highlights)
- **Soft sage**: `#D6E8D1` (Dividers & subtle borders)
- **Cream background**: `#F8FBF5` (Page background)
- **Primary text**: `#18382A`
- **Secondary text**: `#6F8174`
- **Accent yellow**: `#E7C76A` (Trophies & XP sparkles)

---

## 🏗️ Architecture & Monorepo Structure

```
Hactoberfest/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py         # REST API endpoints (Auth, Quests, Discoveries, Dashboard)
│   │   ├── core/
│   │   │   ├── config.py         # Pydantic settings & environment variables
│   │   │   └── security.py       # Bcrypt hashing & JWT token authentication
│   │   ├── db/
│   │   │   └── session.py        # SQLAlchemy engine & session factory
│   │   ├── models/
│   │   │   └── models.py         # SQLAlchemy ORM models (User, Quest, Discovery, etc.)
│   │   ├── schemas/
│   │   │   └── schemas.py        # Pydantic request/response schemas
│   │   ├── services/
│   │   │   ├── ai_service.py     # Google GenAI SDK integration & safe fallback engine
│   │   │   ├── vision_service.py # Vision identification provider
│   │   │   └── gamification.py   # XP calculations, streaks, and achievement rules
│   │   └── main.py               # FastAPI application entrypoint
│   ├── tests/
│   │   └── test_backend.py       # Automated pytest test suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/page.tsx # Dashboard with Recharts & XP summary
│   │   │   ├── quests/page.tsx    # AI Quest Generator form & cards
│   │   │   ├── explorer/page.tsx  # Nature Explorer with photo upload & vision ID
│   │   │   ├── journal/page.tsx   # Nature Journal with search & category filters
│   │   │   ├── profile/page.tsx   # Profile, preferences, and data export
│   │   │   ├── layout.tsx         # Root layout with responsive navigation & footer
│   │   │   └── page.tsx           # Landing page with hero & how-it-works
│   │   ├── components/            # Reusable Navbar, Footer, etc.
│   │   ├── lib/api.ts             # Fetch API client helper
│   │   └── types/index.ts         # Shared TypeScript interfaces
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm**
- **Python** 3.10+
- (Optional) **Docker** & **Docker Compose**

---

### Method 1: Local Development (Quickstart)

#### 1. Start Backend (FastAPI)
```bash
cd backend

# Create & activate virtual environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
pip install email-validator

# Run database migrations / start server
python -m uvicorn app.main:app --reload --port 8000
```
Backend will be live at `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

#### 2. Start Frontend (Next.js)
```bash
cd frontend

# Install packages
npm install

# Start Next.js development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

### Method 2: Run with Docker Compose
```bash
docker-compose up --build
```
This starts PostgreSQL, FastAPI on port `8000`, and Next.js on port `3000`.

---

## 🔑 Gemini AI Configuration

To enable live Google Gemini quest generation and vision identification:
1. Copy `.env.example` to `.env` in the root or `backend/` folder.
2. Obtain a key from [Google AI Studio](https://aistudio.google.com/).
3. Add your key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
GEMINI_MODEL="gemini-2.5-flash"
```
*Note: If no API key is provided, NatureQuest AI automatically runs in seamless fallback mode with curated outdoor quests and naturalist demo identification.*

---

## 🧪 Running Automated Tests

Run the backend test suite:
```bash
cd backend
$env:PYTHONPATH="."
.\venv\Scripts\pytest -v tests
```
Tests cover:
- AI structured response schema validation
- AI fallback quest generation logic
- XP level calculation formulas
- Duplicate quest reward prevention
- Nature Journal CRUD flows
- Health check endpoints

---

## 📜 License

MIT License. Free and open source for community exploration and wellness!
