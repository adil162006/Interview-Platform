# Interview Platform

A modern, real-time collaborative platform for technical interviews. Connect with peers, solve coding problems together, and practice for interviews with live video calls, code execution, and messaging.

**GitHub Repository:** [adil162006/Interview-Platform](https://github.com/adil162006/Interview-Platform)

---

## 🌟 Features

### Core Features
- **User Authentication & Management**
  - Secure authentication using Clerk
  - Automatic user synchronization with MongoDB via Inngest webhooks
  - Profile management with custom images

- **Interactive Coding Sessions**
  - Create or join live coding sessions for specific interview problems
  - Browse available active sessions
  - Support for multiple difficulty levels (Easy, Medium, Hard)
  - Session status tracking (Active/Completed)
  - Save and retrieve recent sessions

- **Real-Time Video Calls**
  - Integrated video conferencing using Stream.io
  - Host and participant roles for session management
  - One-click video call initiation
  - Call disconnection and session management

- **Code Editor & Execution**
  - Monaco Editor integration for syntax-highlighted coding
  - Multi-language code execution via Piston API
  - Real-time output display
  - Code sharing between participants

- **Live Messaging**
  - Stream.io powered chat system
  - Per-session messaging channels
  - Automatic channel creation with session setup
  - Real-time message synchronization

- **Problem Bank**
  - Predefined interview problem set
  - Problems organized by difficulty
  - Problem descriptions, examples, and constraints
  - Problem-specific session creation

- **Dashboard**
  - Overview of active interview sessions
  - Quick stats and recent activity
  - Session navigation and management

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 with Vite
- Clerk React for authentication
- Stream.io Video React SDK for video calls
- Monaco Editor for code editing
- React Router for navigation
- Tailwind CSS + DaisyUI for styling
- React Query for server state management
- React Hot Toast for notifications

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose ODM
- Clerk Express middleware for authentication
- Stream.io SDK for video/chat services
- Inngest for event-driven workflows
- Cron jobs for scheduled tasks

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ├─ Authentication (Clerk)                                   │
│  ├─ Video Calls (Stream.io Video)                            │
│  ├─ Messaging (Stream.io Chat)                               │
│  └─ Code Editor (Monaco)                                     │
└────────────────────┬──────────────────────────────────────────┘
                     │ HTTP API
┌────────────────────▼──────────────────────────────────────────┐
│                  Backend (Express.js)                          │
│  ├─ Routes:                                                    │
│  │  ├─ /api/sessions (CRUD operations)                        │
│  │  └─ /api/chat (Stream tokens)                              │
│  ├─ Middleware:                                               │
│  │  ├─ Clerk Middleware (Auth)                                │
│  │  └─ protectRoute (Session verification)                    │
│  ├─ Webhooks:                                                 │
│  │  └─ /api/inngest (Clerk events)                            │
│  └─ External Services:                                        │
│     ├─ MongoDB (User & Session storage)                       │
│     ├─ Stream.io (Video & Chat)                               │
│     └─ Inngest (Event processing)                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎬 How Stream.io Works

Stream.io provides the backbone for real-time video conferencing and messaging in this application:

### Video Calls (Stream.io Video)

1. **Session Creation:**
   - When a user creates a new session, a unique `callId` is generated: `session_{timestamp}_{randomString}`
   - Backend creates a Stream video call object with session metadata (problem, difficulty)
   - Frontend initializes Stream Video Client with user and authentication token

2. **Call Participants:**
   - **Host:** Creates the session and initiates the video call
   - **Participant:** Joins existing session by connecting to the call ID
   - Both can see and hear each other in real-time

3. **Frontend Flow:**
   - `useStreamClient` hook manages Stream client initialization
   - Requires user authentication token from `/api/chat/token` endpoint
   - Initializes `StreamVideoClient` with API key, user, and token
   - `StreamCall` and `StreamVideo` components render the video interface

4. **Backend Integration:**
   - Stream Client SDK creates video call instances
   - Call metadata stored in `Session.callId` field
   - Video call persists for session duration

### Messaging (Stream.io Chat)

1. **Channel Creation:**
   - When a session is created, a dedicated messaging channel is created
   - Channel ID = `callId` (same as video call)
   - Channel name = `{problem} Session`
   - Creator set as initial member

2. **Chat Features:**
   - Real-time message synchronization
   - Members can view message history
   - Support for multimedia messages

3. **User Management:**
   - Users synced to Stream via Inngest webhooks
   - When Clerk creates/deletes user → Inngest triggers sync
   - Backend calls `upsertStreamUser()` / `deleteStreamUser()`

4. **Token Generation:**
   - Frontend requests Stream token via `/api/chat/token`
   - Backend uses `chatClient.createToken(clerkId)` to generate signed token
   - Token used to authenticate chat and video operations

### Data Flow Diagram

```
User Creates Session
    ↓
generateCallId() → "session_1731234567_abc123"
    ↓
    ├─→ Create MongoDB Session record with callId
    ├─→ streamClient.video.call("default", callId).getOrCreate()
    └─→ chatClient.channel("messaging", callId).create()
    ↓
Frontend joins call
    ├─→ Fetch Stream token: POST /api/chat/token
    ├─→ Initialize StreamVideoClient
    └─→ Connect to StreamCall with callId
    ↓
Messaging & Video Active
    ├─→ Real-time video feed
    ├─→ Real-time chat messages
    └─→ Code execution & sharing
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas URI)
- Stream.io account with API keys
- Clerk account with credentials
- Inngest account with API keys
- (Optional) Piston API for code execution

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/adil162006/Interview-Platform.git
   cd Interview-Platform
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

#### Backend Environment Variables (`.env`)

Create a `.env` file in the `backend/` directory with the following variables:

```dotenv
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DB_URL=mongodb+srv://{username}:{password}@{cluster}.mongodb.net/{dbname}?appName=Cluster0

# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Stream.io (Video & Chat)
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET_KEY=your_stream_api_secret

# Inngest (Event Processing)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

**Variable Descriptions:**

| Variable | Description | Source |
|----------|-------------|--------|
| `PORT` | Express server port | Default: 3000 |
| `NODE_ENV` | Environment (development/production) | Your choice |
| `DB_URL` | MongoDB connection string | MongoDB Atlas |
| `CLERK_PUBLISHABLE_KEY` | Clerk public key | Clerk Dashboard → Keys |
| `CLERK_SECRET_KEY` | Clerk secret key | Clerk Dashboard → Keys |
| `CLIENT_URL` | Frontend URL for CORS | Frontend base URL |
| `STREAM_API_KEY` | Stream.io API key | Stream.io Dashboard → API Keys |
| `STREAM_API_SECRET_KEY` | Stream.io secret key | Stream.io Dashboard → API Keys |
| `INNGEST_EVENT_KEY` | Inngest event key | Inngest Dashboard → Keys |
| `INNGEST_SIGNING_KEY` | Inngest signing key | Inngest Dashboard → Keys |

#### Frontend Environment Variables (`.env`)

Create a `.env` file in the `frontend/` directory with the following variables:

```dotenv
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx

# API Configuration
VITE_API_URL=http://localhost:3000/api

# Stream.io (Video & Chat)
VITE_STREAM_API_KEY=your_stream_api_key
```

**Variable Descriptions:**

| Variable | Description | Source |
|----------|-------------|--------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public key for frontend | Clerk Dashboard → Keys |
| `VITE_API_URL` | Backend API base URL | Backend server URL |
| `VITE_STREAM_API_KEY` | Stream.io API key | Stream.io Dashboard → API Keys |

### Running the Application

1. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:3000`

2. **Start Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`

---

## 📁 Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── sessionController.js    # Session CRUD & management
│   │   └── chatController.js       # Stream token generation
│   ├── models/
│   │   ├── User.js                 # User schema (Clerk + MongoDB)
│   │   └── Session.js              # Interview session schema
│   ├── routes/
│   │   ├── sessionRoutes.js        # /api/sessions endpoints
│   │   └── chatRoutes.js           # /api/chat endpoints
│   ├── middlewares/
│   │   └── protectRoute.js         # Auth verification middleware
│   ├── lib/
│   │   ├── db.js                   # MongoDB connection
│   │   ├── env.js                  # Environment variables
│   │   ├── inngest.js              # Inngest functions & webhooks
│   │   ├── stream.js               # Stream.io clients setup
│   │   └── cron.js                 # Scheduled jobs
│   └── server.js                   # Express app configuration
├── package.json
└── .env
```

### Frontend Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx            # Landing page
│   │   ├── DashBoardPage.jsx       # Dashboard with active sessions
│   │   ├── ProblemsPage.jsx        # Problem listing
│   │   ├── ProblemPage.jsx         # Problem details & create session
│   │   └── SessionPage.jsx         # Active session with video/code/chat
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation header
│   │   ├── VideoCallUI.jsx         # Stream video interface
│   │   ├── CodeEditorPanel.jsx     # Monaco editor
│   │   ├── OutputPanel.jsx         # Code execution output
│   │   ├── ProblemDescription.jsx  # Problem details
│   │   ├── ActiveSessions.jsx      # Available sessions list
│   │   ├── RecentSessions.jsx      # User's recent sessions
│   │   ├── StatsCards.jsx          # Dashboard stats
│   │   └── CreateSessionModal.jsx  # New session modal
│   ├── hooks/
│   │   ├── useSessions.js          # Session API hooks (React Query)
│   │   └── useStreamClient.js      # Stream client management
│   ├── lib/
│   │   ├── axios.js                # Axios instance with base URL
│   │   ├── stream.js               # Stream client initialization
│   │   ├── piston.js               # Code execution (Piston API)
│   │   └── utils.js                # Utility functions
│   ├── data/
│   │   └── problems.js             # Problem definitions
│   ├── App.jsx                     # Main app & routing
│   └── main.jsx                    # React entry point
├── package.json
└── .env
```

---

## 🔌 API Endpoints

### Sessions Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/sessions` | ✅ | Create a new session |
| `GET` | `/api/sessions` | ❌ | Get all active sessions |
| `GET` | `/api/sessions/my-sessions` | ✅ | Get user's completed sessions |
| `GET` | `/api/sessions/:id` | ❌ | Get session by ID |
| `POST` | `/api/sessions/:id/join` | ✅ | Join existing session |
| `POST` | `/api/sessions/:id/end` | ✅ | End a session |

### Chat Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/chat/token` | ✅ | Get Stream authentication token |

### Inngest Webhooks

| Endpoint | Event | Description |
|----------|-------|-------------|
| `/api/inngest` | `clerk/user.created` | Sync new user to MongoDB & Stream |
| `/api/inngest` | `clerk/user.deleted` | Delete user from MongoDB & Stream |

---

## 🔑 Key Workflows

### 1. User Registration & Onboarding

```
User Signs Up (Clerk)
    ↓
Clerk triggers webhook
    ↓
Inngest receives clerk/user.created event
    ↓
Backend creates User in MongoDB
    ↓
Backend syncs user to Stream.io (upsertStreamUser)
    ↓
User ready for sessions
```

### 2. Creating & Joining a Session

```
User creates session
    ↓
Backend generates unique callId
    ↓
Creates MongoDB Session record
    ↓
Creates Stream video call
    ↓
Creates messaging channel
    ↓
Frontend fetches session details
    ↓
Initializes Stream video client
    ↓
User can see video feed & messaging
    ↓
Other users can join via callId
```

### 3. Code Execution Flow

```
User writes code in Monaco editor
    ↓
Clicks "Run Code"
    ↓
Frontend sends code to Piston API
    ↓
Piston executes code
    ↓
Output returned to frontend
    ↓
Displayed in OutputPanel
```

---

## 🛠️ Configuration Guide

### Setting Up Clerk

1. Go to [Clerk Dashboard](https://clerk.com)
2. Create a new application
3. Copy `Publishable Key` and `Secret Key`
4. Add these to both `.env` files

### Setting Up Stream.io

1. Go to [Stream.io Dashboard](https://getstream.io)
2. Create a new app
3. Copy `API Key` and `API Secret`
4. Add these to both `.env` files
5. Enable Video & Chat features

### Setting Up Inngest

1. Go to [Inngest Dashboard](https://inngest.com)
2. Create a new account
3. Copy `Event Key` and `Signing Key`
4. Add these to backend `.env`
5. Configure webhook URL: `{your-server}/api/inngest`

### Setting Up MongoDB

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Add to backend `.env` as `DB_URL`

---

## 📝 Database Schema

### User Model

```javascript
{
  name: String,           // User's full name
  email: String,          // User's email (unique)
  profileImage: String,   // Profile picture URL
  clerkId: String,        // Clerk's unique user ID
  createdAt: Date,        // Account creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

### Session Model

```javascript
{
  problem: String,        // Interview problem name
  difficulty: String,     // easy | medium | hard
  host: ObjectId,         // Reference to User (session creator)
  participant: ObjectId,  // Reference to User (joined participant)
  status: String,         // active | completed
  callId: String,         // Stream video call ID
  createdAt: Date,        // Session creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

---

## 🎓 Usage Examples

### Creating a Session

1. Navigate to **Problems** page
2. Select a problem
3. Click **"Create Interview Session"**
4. Problem & difficulty auto-filled
5. Click **"Create"** → Session created
6. Video call & chat automatically initialized

### Joining a Session

1. Go to **Dashboard**
2. Browse **Active Sessions**
3. Click on a session
4. Click **"Join Session"**
5. Video call connects automatically
6. Start collaborating

### Running Code

1. In active session, write code in editor
2. Click **"Run Code"** button
3. Select language if needed
4. Output appears in **Output Panel**
5. Code visible to all participants

---

## 🚀 Deployment

### Deploy Backend (Vercel/Railway/Render)

1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables
4. Deploy!

### Deploy Frontend (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository
3. Set `VITE_API_URL` to production backend URL
4. Build: `npm run build`
5. Deploy!

### Important Notes

- Update `CLIENT_URL` in backend for CORS
- Update `VITE_API_URL` in frontend for API calls
- Ensure all Stream.io URLs are whitelisted
- Test Clerk authentication in production domain

---

## 📦 Dependencies

### Backend Key Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ORM
- **@clerk/express** - Authentication middleware
- **stream-chat** - Stream Chat SDK
- **@stream-io/node-sdk** - Stream Video SDK
- **inngest** - Event processing
- **cron** - Job scheduling
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend Key Dependencies

- **react** - UI framework
- **@clerk/clerk-react** - Authentication
- **@stream-io/video-react-sdk** - Video calling
- **stream-chat-react** - Chat UI
- **@monaco-editor/react** - Code editor
- **axios** - HTTP client
- **react-router** - Navigation
- **react-query** - Server state management
- **tailwindcss** - Styling
- **daisyui** - UI components

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to Stream"
- Verify `STREAM_API_KEY` is correct
- Check Stream.io dashboard for API key validity
- Ensure frontend has `VITE_STREAM_API_KEY`

### Issue: "Unauthorized" on protected routes
- Verify Clerk authentication is working
- Check `CLERK_PUBLISHABLE_KEY` in both `.env` files
- Ensure user is signed in before accessing protected pages

### Issue: MongoDB connection fails
- Verify `DB_URL` is correct
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure database user has correct permissions

### Issue: Video call not initializing
- Verify Clerk authentication is complete
- Check `/api/chat/token` returns valid token
- Ensure `callId` matches between frontend and backend
- Check browser console for Stream errors

### Issue: Inngest webhooks not triggered
- Verify webhook URL is correct in Inngest dashboard
- Check `INNGEST_SIGNING_KEY` is correct
- Review Inngest dashboard for event logs
- Ensure Clerk is configured to send webhooks

---

## 📞 Support & Contribution

For issues, questions, or contributions:
- Open an issue on [GitHub](https://github.com/adil162006/Interview-Platform/issues)
- Create a pull request with improvements
- Follow existing code style and patterns

---

## 📄 License

This project is open source and available under the ISC License.

---

## 🎯 Roadmap

- [ ] Code plagiarism detection
- [ ] AI-powered code review suggestions
- [ ] Interview performance analytics
- [ ] Problem difficulty ratings
- [ ] Session recording & playback
- [ ] Multiple language support
- [ ] Team/group sessions
- [ ] Mobile app (React Native)
- [ ] WebRTC fallback for Stream.io
- [ ] Automated test case evaluation

---

**Happy Coding! 🚀**
