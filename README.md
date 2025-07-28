# LifeOS Terminal - Personal Management System

A beautiful terminal-style personal productivity application built with React, TypeScript, and MongoDB.

## Features

- 🖥️ **Terminal Interface**: Authentic command-line experience for productivity management
- 📝 **Task Management**: Add, list, and complete tasks with priority levels
- 😊 **Mood Tracking**: Log your emotional state with notes and timestamps
- 💭 **Journaling**: Write and store personal reflections
- 🗄️ **Database Storage**: MongoDB with Mongoose for reliable data persistence
- 🔄 **Real-time Updates**: Live terminal with command history and suggestions

## Commands Available

- `help` - Show all available commands
- `add-task <description>` - Add a new task
- `list-tasks` - Display all tasks with completion status
- `complete-task <id>` - Mark a task as completed
- `log-mood <mood> [note]` - Record your mood (happy, neutral, sad, excited, tired, stressed)
- `reflect <content>` - Write a journal entry or reflection
- `list-reflections` - Show recent reflections
- `history` - View command history
- `status` - Display system statistics
- `clear` - Clear the terminal screen

## Quick Start

### Prerequisites

- Node.js 20+ installed
- MongoDB database (MongoDB Atlas free tier or local MongoDB)

### Installation

1. **Extract the files** from the zip
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Windows Users Only:**
   Replace the original `package.json` with `package-windows.json`:
   ```bash
   # On Windows Command Prompt or PowerShell:
   copy package-windows.json package.json
   ```
   ```bash
   # On macOS/Linux:
   cp package-windows.json package.json
   ```

4. **Set up your MongoDB database:**
   - **Option A:** Use MongoDB Atlas (free tier):
     - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
     - Create a free cluster
     - Get your connection string
   - **Option B:** Install MongoDB locally
   - Copy `.env.example` to `.env` and add your database URL:
   ```
   DATABASE_URL="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/terminalos?retryWrites=true&w=majority"
   ```

5. **Start the application:**
   ```bash
   npm run dev
   ```

6. **Open your browser** to `http://localhost:5000`

### Troubleshooting

**Windows Error: 'NODE_ENV' is not recognized**
- Make sure you replaced `package.json` with `package-windows.json` (step 3 above)
- This adds cross-platform environment variable support

**Database Connection Issues:**
- Verify your `DATABASE_URL` in the `.env` file
- For MongoDB Atlas, copy the connection string exactly as provided
- Make sure to replace `<username>` and `<password>` with your actual credentials

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components (terminal, forms)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Application pages
│   │   └── utils/          # Utilities and command logic
├── server/                 # Express.js backend
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API endpoints
│   └── storage.ts         # Data access layer
├── shared/                 # Shared TypeScript types
│   └── schema.ts          # Database schema and types
└── package.json           # Dependencies and scripts
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, TanStack Query
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Build Tools**: Vite, esbuild
- **UI Components**: Radix UI with shadcn/ui

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/terminalos?retryWrites=true&w=majority"
NODE_ENV="development"
PORT=5000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Database Schema

The application uses MongoDB collections:

- **tasks** - Personal to-do items with priority and completion tracking
- **moods** - Emotional state logs with timestamps and notes
- **reflections** - Journal entries and personal thoughts
- **commandhistories** - Terminal command history for session management

## Deployment

### Using Azure App Service (Recommended)
1. Push your code to GitHub
2. Create an Azure App Service
3. Connect it to your GitHub repository
4. Set up MongoDB Atlas for the database
5. Configure environment variables in Azure

### Using Railway or Vercel
1. Connect your GitHub repository
2. Set up MongoDB Atlas (free tier available)
3. Configure environment variables
4. Deploy automatically from main branch

### Manual Deployment
1. Set up a MongoDB database (recommended: MongoDB Atlas)
2. Configure environment variables
3. Run `npm run build` to build the application
4. Deploy the built application to your hosting provider
5. Ensure your hosting service runs `npm start` to start the server

## Contributing

This is a personal productivity tool, but feel free to customize it for your needs:

1. Modify commands in `client/src/utils/commands.ts`
2. Add new database tables in `shared/schema.ts`
3. Create new API endpoints in `server/routes.ts`
4. Customize the terminal interface in `client/src/components/terminal/`

## License

MIT License - feel free to use this for personal or educational purposes.

## Support

This application was built as a demonstration of modern full-stack development with React, TypeScript, and MongoDB. For questions about the codebase, refer to the inline documentation and comments.