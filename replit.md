# LifeOS Terminal - Personal Management System

## Overview

LifeOS is a terminal-based personal management system built as a full-stack web application. It provides a unique command-line interface for managing tasks, tracking moods, writing reflections, and maintaining personal productivity through familiar terminal commands.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Components**: Radix UI with shadcn/ui component library
- **Styling**: Tailwind CSS with custom terminal-themed color scheme
- **State Management**: React hooks with local storage persistence
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Development**: tsx for development server
- **Build**: esbuild for production bundling
- **Storage**: PostgreSQL database with Drizzle ORM
- **Database**: Neon serverless PostgreSQL with connection pooling

### Key Design Decisions

**Terminal Interface Choice**: The application mimics a real terminal environment to provide a familiar and efficient interface for power users who prefer command-line interactions over traditional GUI applications.

**Component-Based UI**: Uses shadcn/ui components for consistent design while maintaining the terminal aesthetic through custom CSS variables and terminal-specific styling.

**Database Persistence**: Uses PostgreSQL database with Drizzle ORM for reliable data persistence across sessions and devices.

## Key Components

### Terminal System
- **TerminalWindow**: Main interface component that renders the terminal chrome and manages the terminal session
- **CommandInput**: Handles user input with features like command history navigation, tab completion, and real-time suggestions
- **CommandOutput**: Displays command results with proper formatting and error handling
- **Command Parser**: Processes and executes commands with a modular command system

### Data Models
- **Tasks**: Personal to-do items with priority levels and completion tracking
- **Moods**: Emotional state logging with timestamps and optional notes
- **Reflections**: Journal entries for personal reflection and growth
- **Command History**: Tracks all executed commands for session management

### Hooks Architecture
- **useTerminal**: Central hook managing terminal state, command execution, and data persistence
- **useCommandParser**: Handles command parsing, validation, and suggestion generation
- **useLocalStorage**: Provides type-safe localStorage integration with React state

## Data Flow

1. **User Input**: Commands entered through the terminal input component
2. **Command Processing**: Commands parsed and validated through the command parser
3. **Database Operations**: Data modifications sent to PostgreSQL via REST API endpoints
4. **State Updates**: UI state refreshed from database after successful operations
5. **UI Updates**: Terminal history updates to show command results and system feedback
6. **Persistence**: All data automatically persisted to PostgreSQL database

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, TypeScript)
- Express.js for server infrastructure
- Vite for development and build tooling

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography

### Database and ORM
- Drizzle ORM configured for PostgreSQL integration
- @neondatabase/serverless for cloud database connectivity
- Connection pooling with connect-pg-simple for sessions

### Development Tools
- tsx for TypeScript execution in development
- esbuild for production builds
- PostCSS for CSS processing

## Deployment Strategy

**Development Environment**:
- Replit-optimized with specific modules (nodejs-20, web, postgresql-16)
- Hot reload with Vite development server
- Automatic port forwarding on port 5000

**Production Build**:
- Frontend: Vite builds static assets to dist/public
- Backend: esbuild bundles server code to dist/index.js
- Deployment: Configured for Replit's autoscale deployment target

**Database Strategy**:
- Development: PostgreSQL database with Drizzle ORM for consistent development experience
- Production: Neon serverless PostgreSQL with connection pooling
- Schema management with drizzle-kit for database migrations

## Changelog

```
Changelog:
- June 26, 2025. Initial setup with React terminal interface and localStorage
- June 26, 2025. Database integration: Migrated from localStorage to PostgreSQL with Drizzle ORM, added REST API endpoints, updated command system for async database operations
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```