# Student Attendance Management System

## Overview

This is a **Student Attendance Management System** built with fingerprint biometric verification using Arduino hardware integration. The system enables educational institutions to register students, verify their attendance through fingerprint scanning, and generate comprehensive attendance reports. The application features a dashboard-based interface with real-time hardware connection monitoring and serial communication with Arduino fingerprint sensors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query for server state management and data fetching
- Shadcn/ui component library based on Radix UI primitives
- Tailwind CSS for styling with custom design system

**Design System:**
- Material Design principles adapted for educational institutions
- Custom color tokens supporting light/dark themes via CSS variables
- System-based dashboard layout (not a landing page) with persistent sidebar navigation
- Fixed header showing connection status and global controls
- Responsive grid layouts for data tables, forms, and dashboard cards

**Component Structure:**
- Modular component architecture with separate UI primitives (`/components/ui`)
- Feature-specific components for attendance, student management, and fingerprint scanning
- Shared layout components (AppSidebar, ConnectionStatus, PortSelector)
- Form components with react-hook-form integration

**State Management Approach:**
- Local component state for UI interactions (scanning status, modal visibility)
- TanStack Query for server data caching and synchronization
- React Context avoided in favor of prop drilling for clearer data flow
- Mock data currently used throughout; designed for easy API integration

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for type safety
- Custom middleware for request logging with duration tracking
- Vite middleware integration for development with HMR support
- HTTP server setup prepared for WebSocket upgrades (for real-time Arduino communication)

**API Design:**
- RESTful API structure with `/api` prefix convention
- Routes defined in `server/routes.ts` (currently minimal, prepared for expansion)
- Storage abstraction layer via `IStorage` interface
- In-memory storage implementation (`MemStorage`) as development placeholder

**Planned Features:**
- Serial port communication API for Arduino fingerprint sensor
- Real-time event streaming for fingerprint scan results
- CRUD endpoints for students, attendance records, and system administration

### Data Storage

**Database Solution:**
- PostgreSQL via Neon serverless database
- Drizzle ORM for type-safe database queries and schema management
- Connection pooling via `@neondatabase/serverless` with WebSocket support

**Schema Design:**

**Students Table:**
- Serial primary key with optional fingerprint ID mapping
- Personal information (name, grade, section, contact details)
- Guardian information for emergency contacts
- Photo URL for visual identification
- Registration timestamp tracking

**Attendances Table:**
- Serial primary key for each attendance record
- Fingerprint ID reference (not foreign key - allows orphaned records)
- Denormalized student data (name, grade) for historical accuracy
- Subject/class tracking
- Date and time stamps stored as text (intentional design choice)

**Users Table:**
- UUID primary key for administrator accounts
- Username/password authentication (prepared for future auth implementation)

**Migration Strategy:**
- Drizzle Kit for schema migrations
- Schema defined in shared directory for client/server type sharing
- Push-based deployment with `db:push` script

### External Dependencies

**Arduino Hardware Integration:**
- Serial port communication for fingerprint sensor control
- Planned protocols: enrollment, verification, deletion commands
- Real-time status updates and scan result streaming
- Configurable baud rates (9600, 57600, 115200)
- Port auto-detection with manual override options

**Third-Party Services:**
- Neon Database (serverless PostgreSQL hosting)
- Google Fonts CDN (Inter, Roboto Mono for UI typography)
- Material Symbols font for iconography

**Key NPM Dependencies:**
- `@neondatabase/serverless` - PostgreSQL client with edge runtime support
- `drizzle-orm` and `drizzle-kit` - ORM and migration tooling
- `@tanstack/react-query` - Async state management
- `@radix-ui/*` - Headless UI component primitives
- `wouter` - Minimal routing library
- `class-variance-authority` and `clsx` - Utility-first styling
- `date-fns` - Date manipulation and formatting
- `zod` - Runtime type validation via `drizzle-zod`

**Development Tools:**
- TypeScript for type safety across full stack
- ESBuild for server bundling in production
- TSX for TypeScript execution in development
- Replit-specific plugins for cloud development environment

**Authentication & Sessions:**
- Session management prepared via `connect-pg-simple` (PostgreSQL session store)
- User authentication schema defined but not yet implemented
- Designed for future expansion with passport.js or similar

**File Upload Strategy:**
- Student photos stored as URLs (external hosting assumed)
- No direct file upload implementation yet
- Prepared for integration with cloud storage (S3, Cloudinary, etc.)