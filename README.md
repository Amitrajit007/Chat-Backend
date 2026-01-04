# Chat Backend

A real-time chat application backend built with **Socket.IO**, **Express**, **TypeScript**, and **MongoDB**. This project provides a scalable WebSocket-based messaging system with direct messaging (DM) capabilities, message persistence, rate limiting, and content moderation.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Socket Events](#socket-events)
- [REST API Endpoints](#rest-api-endpoints)
- [Database Schema](#database-schema)
- [Usage Examples](#usage-examples)
- [Rate Limiting & Moderation](#rate-limiting--moderation)

---

##  Features

- **Real-time Messaging**: Instant bidirectional communication using Socket.IO
- **Direct Messaging (DM)**: Private one-on-one chat rooms
- **Message Persistence**: All messages stored in MongoDB for chat history
- **Online Presence**: Track and broadcast online users
- **Rate Limiting**: Prevent spam with automatic message throttling (3 messages/minute)
- **Content Moderation**: Automatic filtering of inappropriate content
- **Message History API**: Retrieve past messages via REST endpoint

- **TypeScript**: Full type safety across client, server, and shared types
- **CLI Client**: Command-line interface for testing and demonstration

---

## Architecture

### System Overview

```
┌─────────────────┐
│  Client A       │──┐
│  (Socket.IO)    │  │
└─────────────────┘  │
                     ├──► ┌──────────────────┐      ┌─────────────┐
┌─────────────────┐  │    │  Backend Server  │──────│  MongoDB    │
│  Client B       │──┤    │  (Express +      │      │  (Messages) │
│  (Socket.IO)    │  │    │   Socket.IO)     │      └─────────────┘
└─────────────────┘  │    └──────────────────┘
                     │
┌─────────────────┐  │
│  Client C       │──┘
│  (Socket.IO)    │
└─────────────────┘
```

### Message Flow

```
Client A
  └─ emit("dm-message", text)
       │
       ▼
    Backend
       ├─ Validate & Rate Limit
       ├─ Save to MongoDB
       └─ io.to(room).emit("dm-message", message)
            │
            ▼
         Client A + Client B
            └─ on("dm-message") → Display message
```

---

## Tech Stack

### Server
- **Node.js** with **TypeScript**
- **Express** - HTTP server and REST API
- **Socket.IO** - WebSocket communication
- **MongoDB** with **Mongoose(ORM)** - Message persistence
- **dotenv** - Environment configuration
- **CORS** - Cross-origin resource sharing

### Client
- **Socket.IO Client** - WebSocket client library
- **TypeScript** - Type-safe client code
- **Node.js readline** - CLI interface

### Shared
- **TypeScript** - Shared type definitions between client and server

---

## Project Structure

```
.
├── README.md
├── client
│   ├── cli.js
│   ├── cli.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── test.ts
│   ├── tsconfig.json
│   └── utils
├── packages
│   ├── package-lock.json
│   └── shared
│       ├── dist
│       │   ├── index.d.ts
│       │   └── types
│       │       ├── historyMessage.d.ts
│       │       └── socket.d.ts
│       ├── package.json
│       ├── src
│       │   ├── index.ts
│       │   └── types
│       │       ├── historyMessage.ts
│       │       └── socket.ts
│       └── tsconfig.json
├── server
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── config
│   │   │   └── dbConnection.ts
│   │   ├── controller
│   │   │   └── msgHistory.controller.ts
│   │   ├── index.ts
│   │   ├── model
│   │   │   └── chat.ts
│   │   ├── routes
│   │   │   └── messageHistory.route.ts
│   │   ├── service
│   │   │   └── messageHistory.service.ts
│   │   ├── sockets
│   │   │   ├── disconnect.ts
│   │   │   ├── dmMessages.ts
│   │   │   ├── index.ts
│   │   │   ├── presence.state.ts
│   │   │   ├── setUsername.ts
│   │   │   ├── startDm.ts
│   │   │   └── typeIndicator.ts
│   │   ├── tsconfig.json
│   │   └── utils
│   │       ├── roomId.ts
│   │       └── time.ts
│   └── test
│       ├── client-test-1.ts
│       ├── client-test-2.ts
│       ├── client-test-3.ts
│       └── client-test-4.ts
└── update
    └── update.md
```

---

##  Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Amitrajit007/Chat-Backend.git
   cd Chat-backend
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Install shared package dependencies**
   ```bash
   cd ../packages/shared
   npm install
   npm run build  # Compile TypeScript types
   ```

### Configuration

Create a `.env` file in the `server/` directory:

```env
PORT=5000
Atlas_URI=mongodb://localhost:27017/chat-app
# Or use MongoDB Atlas:
# Atlas_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app
```

### Running the Application

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start client instances** (in separate terminals)
   ```bash
   # Terminal 1 - User "alice" chatting with "bob"
   cd client
   npx ts-node cli.ts alice bob

   # Terminal 2 - User "bob" chatting with "alice"
   npx ts-node cli.ts bob alice
   ```

---

## 🔌 Socket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `set-username` | `string` | Set the username for the connected socket |
| `start-dm` | `string` | Start a DM session with target user |
| `dm-message` | `string` | Send a message in the current DM room |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `online-users` | `string[]` | Broadcast list of currently online users |
| `dm-message` | `ChatMessage` | Receive a message in the DM room |
| `dm-error` | `string \| ChatMessage` | Error notification (rate limit, moderation, etc.) |

### ChatMessage Type

```typescript
type ChatMessage = {
  roomId: string;    // Sorted usernames: "alice,bob"
  id: string;        // Socket ID
  from: string;      // Sender username
  text: string;      // Message content
  time: string;      // Formatted timestamp
}
```

---

## REST API Endpoints

### Get Message History

Retrieve past messages between two users.

**Endpoint:** `GET /lastmessages`

**Query Parameters:**
- `from` (string, required) - First username
- `to` (string, required) - Second username
- `limit` (number, optional) - Number of messages to retrieve (default: 50)

**Example Request:**
```bash
curl "http://localhost:5000/lastmessages?from=alice&to=bob&limit=10"
```

**Example Response:**
```json
{
  "messages": [
    {
      "_id": "69504c825064e368c4dae44a",
      "roomId": "alice,bob",
      "id": "jxKCSoWK6t4p8vojAAAD",
      "from": "bob",
      "text": "Hello Alice!",
      "to": "alice",
      "time": "03/01/2026, 3:15:22 am",
      "__v": 0
    },
    {
      "_id": "69504c815064e368c4dae446",
      "roomId": "alice,bob",
      "id": "t9iOkd-d9NTVirfnAAAB",
      "from": "alice",
      "text": "Hi Bob!",
      "to": "bob",
      "time": "03/01/2026, 3:15:18 am",
      "__v": 0
    }
  ]
}

```

### Health Check

**Endpoint:** `GET /health`

**Response:** `OK`

### Server Status

**Endpoint:** `GET /`

**Response:**
```json
{
  "msg": "Active @ 5000"
}
```

---

## Database Schema

### Message Collection

```javascript
{
  roomId: String,      // Sorted usernames (e.g., "alice,bob")
  id: String,          // Socket ID of sender
  from: String,        // Sender username
  text: String,        // Message content
  to: String,          // Recipient username
  time: String,        // Formatted timestamp
}
```

**Indexes:**
- `{ roomId: 1, createdAt: -1 }` - Optimized for message history queries

---

## Usage Examples

### Example Console Output

**Server Console:**
```bash
Listening at 5000
MongoDB connected successfully
Online :  [ 'alice' ]

alice is connected in room : alice,bob

Online :  [ 'alice', 'bob' ]

bob is connected in room : alice,bob
Client disconnect with id:  z9WzkUGusKb34sPoAAAB

Online :  [ 'bob' ]

Client disconnect with id:  nC_ruxh2t6tDAIWrAAAD

No one is Online
```

**John's Console:**
```bash
Chatting with alex
Type messages and press Enter...

online: [ 'You' ]
online: [ 'You', 'alex' ]
> Hello Alex
You : Hello Alex          4/1/2026, 2:22:38 am
alex : Hey John          4/1/2026, 2:22:50 am
> How are you ?
You : How are you ?          4/1/2026, 2:23:07 am
alex : I'm good , thanks          4/1/2026, 2:23:36 am
Caught Ctrl+C
Closing connection...
Disconnected
```

**Alex's Console:**
```bash
Chatting with alex
Type messages and press Enter...

online: [ 'You' ]
online: [ 'You', 'alex' ]
> Hello Alex
You : Hello Alex          4/1/2026, 2:22:38 am
alex : Hey John          4/1/2026, 2:22:50 am
> How are you ?
You : How are you ?          4/1/2026, 2:23:07 am
alex : I'm good , thanks          4/1/2026, 2:23:36 am
Caught Ctrl+C
Closing connection...
Disconnected
```
### Testing

**Run Client 1 Test:**
```bash
npm run client-test-1
```

**Run Client 2 Test:**
```bash
npm run client-test-2
```

---

## Rate Limiting & Moderation

### Rate Limiting

- **Limit:** 3 messages per minute per user
- **Penalty:** 5-second mute on exceeding limit
- **Error Message:** `"Too many messages. Muted for 5s."`

### Content Moderation

Messages containing the following keywords are automatically rejected:
- `"war"`
- `"gun"`
These are just examples, you can add more keywords to the `server\src\sockets\dmMessages.ts` file.

**Rejected Message Response:**
```
Error: Message is not accepted
```

### Implementation Details

Rate limiting is implemented per socket connection:
```typescript
socket.data.rate = {
  count: 0,           // Messages sent in current window
  lastReset: Date.now(), // Window start time
  mutedUntil: 0       // Timestamp when mute expires
}
```

---

## Notes

- **socket.id** is a temporary identifier assigned per connection, used for debugging and logging
- **Room IDs** are generated by sorting usernames alphabetically to ensure consistency (e.g., `"alice,bob"` regardless of who initiates)
- **Timestamps** are formatted in local time: `"DD/MM/YYYY, HH:MM:SS am/pm"`
- All messages are persisted to MongoDB for chat history
