# Chat AI Backend

The backend server for Chat AI, a conversational AI platform that provides intelligent chat capabilities with customizable system prompts.

## Features

- User authentication and authorization
- Chat session management
- Message handling with AI responses
- System prompt management
- Admin dashboard functionality

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- OpenAI GPT-4 Integration
- LangChain
- LangSmith (for tracing and monitoring)

## Project Structure

```
chat-ai-back/
├── api/                 # Main API entry point
├── controllers/         # Request handlers
│   ├── adminController.js
│   ├── authController.js
│   └── chatController.js
├── models/             # MongoDB models
│   ├── Message.js
│   ├── Session.js
│   ├── SystemPrompt.js
│   └── User.js
├── middlewares/        # Express middlewares
│   └── authMiddleware.js
├── routes/             # API routes
│   ├── admin.js
│   ├── auth.js
│   ├── chat.js
│   └── knowledge.js
├── .env                # Environment variables
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## Setup

1. Clone the repository:

```bash
git clone https://github.com/Abula28/chat-ai-back
cd chat-ai-back
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES_IN=24h
OPENAI_API_KEY=your_openai_api_key

LANGSMITH_TRACING=langsmith_trasing
LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
LANGSMITH_API_KEY=your_langsmith_api_key
LANGSMITH_PROJECT=your_langsmith_project
```

4. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/check-in` - Verify user session

### Chat

- `POST /api/chat/session` - Create a new chat session
- `GET /api/chat/sessions` - Get all user's chat sessions
- `GET /api/chat/session/:id/messages` - Get messages for a specific session
- `POST /api/chat` - Send a new message

### Admin

- `GET /api/admin/messages` - Get all messages
- `DELETE /api/admin/message/:id` - Delete a message
- `GET /api/admin/sessions` - Get all sessions
- `DELETE /api/admin/session/:id` - Delete a session
- `GET /api/admin/prompts` - Get all system prompts
- `POST /api/admin/prompt` - Create a new system prompt
- `PUT /api/admin/prompt/:id` - Update a system prompt
- `DELETE /api/admin/prompt/:id` - Delete a system prompt

### Knowledge

- `GET /api/knowledge` - Get all system prompts

## Environment Variables

| Variable           | Description                          | Required           |
| ------------------ | ------------------------------------ | ------------------ |
| MONGODB_URI        | MongoDB connection string            | Yes                |
| JWT_SECRET_KEY     | Secret key for JWT token generation  | Yes                |
| JWT_EXPIRES_IN     | JWT token expiration time            | No (default: 24h)  |
| OPENAI_API_KEY     | OpenAI API key for GPT-4 integration | Yes                |
| PORT               | Server port                          | No (default: 8000) |
| LANGSMITH_TRACING  | Enable LangSmith tracing             | Yes                |
| LANGSMITH_ENDPOINT | LangSmith API endpoint               | Yes                |
| LANGSMITH_API_KEY  | LangSmith API key                    | Yes                |
| LANGSMITH_PROJECT  | LangSmith project name               | Yes                |

## Dependencies

- express: ^5.1.0
- mongoose: ^8.13.2
- jsonwebtoken: ^9.0.2
- bcrypt: ^5.1.1
- bcryptjs: ^2.4.3
- dotenv: ^16.4.7
- cors: ^2.8.5
- express-validator: ^7.2.1
- @langchain/core: ^0.3.44
- @langchain/openai: ^0.5.5
- langchain: ^0.3.21
- openai: ^4.28.0

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
