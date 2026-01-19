# MP Request Portal

## Overview

A citizen request and complaint portal for an Egyptian Member of Parliament (د. عوض أبو النجا). The application allows constituents to submit service requests and complaints across categories like hospitals, roads, schools, and sewage. Submissions are stored in PostgreSQL and automatically synced to Google Sheets via Google Apps Script for external tracking. Users can optionally create accounts to auto-fill their personal information on future submissions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom Egypt-themed color palette (red/gold)
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Fonts**: Cairo (body) and Amiri (headings) for Arabic text support
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: REST endpoints defined in `shared/routes.ts` with Zod validation
- **Development**: tsx for hot-reload, Vite middleware for frontend assets
- **Production**: esbuild bundles server, Vite builds static frontend

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` - defines:
  - `requests` table: citizen info, request type, category, description, image URL, and status
  - `users` table: email, password (bcrypt hashed), name, phone, nationalId, occupation, address, villageCouncil
- **Migrations**: Drizzle Kit with `db:push` command
- **External Sync**: Google Apps Script for Google Sheets backup (fire-and-forget pattern)

### Authentication
- **Password Hashing**: bcryptjs with salt rounds of 10
- **Session Storage**: Client-side localStorage (user data without password)
- **Auth Context**: React context at `client/src/contexts/AuthContext.tsx`
- **Auth Modal**: Login/register modal at `client/src/components/AuthModal.tsx`
- **Auto-fill**: RequestForm auto-fills user data when logged in, clears on logout

### Team Admin System
- **Session Auth**: express-session for team member authentication
- **Team Login**: `/team` page for team member login/registration
- **Team Dashboard**: `/team/dashboard` with category-filtered requests and stats
- **Category Access Control**: Team members can only view/update requests in their assigned category
- **Admin Registration**: Requires ADMIN_KEY environment variable to register new team members
- **Status Management**: Team members can update request status (pending, in_progress, completed, rejected)

### File Upload System
- **Object Storage**: Google Cloud Storage via Replit's sidecar integration
- **Upload Flow**: Presigned URL pattern - client requests URL from `/api/uploads/request-url`, then uploads directly to storage
- **Client Library**: Uppy with AWS S3 compatible plugin

### Key API Endpoints
- `POST /api/requests` - Create new citizen request
- `GET /api/requests` - List all requests
- `GET /api/stats` - Get dashboard statistics (total, completed, pending)
- `POST /api/uploads/request-url` - Get presigned upload URL
- `POST /api/auth/register` - Register new user account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/user/:id` - Get user profile by ID

### Team Admin API Endpoints (Protected)
- `POST /api/team/register` - Register new team member (requires ADMIN_KEY)
- `POST /api/team/login` - Team member login
- `POST /api/team/logout` - Team member logout
- `GET /api/team/session` - Check current session
- `GET /api/team/requests` - Get requests for member's category
- `GET /api/team/stats` - Get stats for member's category
- `PATCH /api/requests/:id/status` - Update request status (category-verified)

## External Dependencies

### Third-Party Services
- **Google Apps Script**: Google Sheets sync via custom endpoint (supports read, write, update operations)
- **Gmail SMTP**: Email notifications to citizens upon request submission
- **Google Cloud Storage**: File uploads via Replit sidecar (localhost:1106)
- **Google Fonts**: Cairo and Amiri font families

### Database
- **PostgreSQL**: Connection via `DATABASE_URL` environment variable
- **ORM**: Drizzle with node-postgres driver

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `PUBLIC_OBJECT_SEARCH_PATHS` - Optional paths for public file access
- `SESSION_SECRET` - Secret for express-session
- `ADMIN_KEY` - Required for team member registration (default: "awad2025admin")