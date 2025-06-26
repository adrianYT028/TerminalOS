# LifeOS Terminal - Personal Management System

A beautiful terminal-style personal productivity application built with React, TypeScript, and PostgreSQL.

## Features

- 🖥️ **Terminal Interface**: Authentic command-line experience for productivity management
- 📝 **Task Management**: Add, list, and complete tasks with priority levels
- 😊 **Mood Tracking**: Log your emotional state with notes and timestamps
- 💭 **Journaling**: Write and store personal reflections
- 🗄️ **Database Storage**: PostgreSQL with Drizzle ORM for reliable data persistence
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
- PostgreSQL database (local or cloud)

### Installation

1. **Extract the files** from the zip
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your database:**
   - Create a PostgreSQL database
   - Copy `.env.example` to `.env` and add your database URL:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/lifeos"
   ```

4. **Initialize the database:**
   ```bash
   npm run db:push
   ```

5. **Start the application:**
   ```bash
   npm run dev
   ```

6. **Open your browser** to `http://localhost:5000`

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
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tools**: Vite, esbuild
- **UI Components**: Radix UI with shadcn/ui

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
NODE_ENV="development"
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Database Schema

The application uses four main tables:

- **tasks** - Personal to-do items with priority and completion tracking
- **moods** - Emotional state logs with timestamps and notes
- **reflections** - Journal entries and personal thoughts
- **command_history** - Terminal command history for session management

## Deployment

### Using Replit (Recommended)
1. Fork this project on Replit
2. The database and environment are automatically configured
3. Click "Run" to start the application

### Manual Deployment
1. Set up a PostgreSQL database (recommended: Neon, Railway, or Supabase)
2. Configure environment variables
3. Run `npm run build` to build the application
4. Deploy the `dist` folder to your hosting provider
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

This application was built as a demonstration of modern full-stack development with React, TypeScript, and PostgreSQL. For questions about the codebase, refer to the inline documentation and comments.