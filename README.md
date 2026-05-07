# Neura Flow — Kanban Task Management App

A full-stack Kanban-style task management application built with the MERN stack, featuring real-time drag-and-drop, team collaboration, and user authentication.

Kanban Board:
- <img width="800" height="355" alt="ezgif-8fb1fdd1c90102d5" src="https://github.com/user-attachments/assets/dbe2bc37-d0e9-4f7e-b7ce-a961c5adcdea" />

Create Task: 
- <img width="800" height="355" alt="Create task gif" src="https://github.com/user-attachments/assets/3d021c92-b4fd-475e-baea-230bc8757212" />

MongoDB Atlas
- <img width="800" height="355" alt="MongoDB Atlas" src="https://github.com/user-attachments/assets/2fb51115-21a8-4c2f-9ca5-ca9e0114d15e" />


***

## Tech Stack

### Frontend
- **Next.js 15** (App Router, React Server Components where appropriate)
- **React** with **Redux Toolkit** for state management
- **TypeScript** — strict mode, no `any`
- **Tailwind CSS** with custom design tokens from DESIGN.md
- **react-hook-form** + **Zod** for form validation
- **@dnd-kit** for drag-and-drop interactions
- **Sonner** for toast notifications

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** authentication via **httpOnly cookies**
- **bcryptjs** for password hashing

***

## Challenge Requirements Compliance

This project fulfills all **SGUI Technical Challenge - Fullstack Developer** requirements:

### ✅ Core Application Requirements
- **Two screens with separate routes**: `/` (Kanban board), `/create` (task creation)
- **Main board**: Three columns (To Do, In Progress, Done) with tasks organized by status
- **Task fields**: Title (required), Due Date (required), Description (optional)
- **Move tasks**: Drag-and-drop between columns + context menu (excludes current column)
- **Maintain order**: Tasks reordered within columns via complex backend logic (`PATCH /api/tasks/:id`)
- **Create task form**: `/create` with validation (empty title, invalid/past dates rejected)
- **Data persistence**: MongoDB + Mongoose with title, description, status, order, teamId fields
- **Redux abstraction**: All server interactions via thunks; zero direct API calls in components
- **UX feedback**: Skeleton loaders, toast notifications (create/move/error), smooth animations
- **Responsive design**: Mobile-first Tailwind with breakpoints (mobile, tablet, desktop)

### ✅ Tech Stack Constraints
- **Frontend**: React 19, Redux Toolkit, TypeScript (strict, no `any`), Tailwind CSS, @dnd-kit
- **Backend**: Node.js, Express.js, TypeScript (strict)
- **Database**: MongoDB with Mongoose models
- **No `any` types**: 100% typed codebase across client and server
- **Git repository**: Initialized and committed throughout development

### ✅ AI/LLM & MCP Usage
- **Stitch MCP integration**: Used for design system generation and token validation
- **DESIGN.md**: Created and followed as single source of truth (colors, typography, spacing, components)
- **CLAUDE.md & GEMINI.md** : Agent instruction file defining architecture, constraints, and acceptance criteria
- **Skills used**: 
  - `stitch-design`: Design system generation and refinement
  - `design-md`: DESIGN.md synthesis from Stitch project
  - `taste-design`: Premium UI standards (typography scale, tonal depths, elevation)
  - `react-components`: Component-driven architecture guidance
  - `vercel-react-best-practices`: Performance optimization (parallel async, memoization, bundle size)
  - `typescript-magician`: Strict typing, eliminated `any` instances
  - `web-design-guidelines`: UI/UX compliance and accessibility
- **Conversation documented**: Full transcript in `/Conversation` folder showing all decisions and rationale
- **Architecture role**: Developer maintained full control; AI tools orchestrated for acceleration, not generation

### ✅ Bonus Features (Optional — Implemented)
- **User authentication**: Register, login, logout with JWT httpOnly cookies (XSS-safe)
- **Team management**: Create teams, switch between teams
- **Multi-team support**: Single user belongs to multiple teams; boards scoped per team
- **Protected routes**: `/` and `/create` require authentication; redirect to `/login` if needed

***

## Features

### Core (Required)
- **Kanban Board** — Tasks organized into three columns: To Do, In Progress, Done
- **Task Cards** — Each task displays title, due date, and optional description
- **Drag & Drop** — Smooth drag-and-drop between columns with visual feedback and floating card animation
- **Context Menu** — Move tasks between columns via a dropdown menu (shows only valid target columns, excluding the current one)
- **Task Order** — Order is maintained within each column and updated when tasks are moved
- **Create Task** — Dedicated form view at `/create` with validation (empty title, invalid date, etc.)
- **Data Persistence** — All tasks stored in MongoDB via Mongoose models (title, description, status, order)
- **Redux State Management** — All server interactions (fetch, create, update tasks) go through Redux Toolkit; no direct API calls in components
- **Loading Indicators** — Skeleton loaders and loading states during data fetch/update
- **Toast Notifications** — User-friendly notifications for task creation, movement, and errors
- **Responsive UI** — Works across mobile, tablet, and desktop screen sizes

### Bonus (Optional — Implemented)
- **User Authentication** — Register, login, logout with JWT httpOnly cookies (XSS-safe, no token in localStorage)
- **Team Management** — Create teams, switch between teams; each team has its own Kanban board
- **Multi-Team Support** — A single user can belong to multiple teams and switch boards via the team switcher in the header
- **Protected Routes** — Board and Create Task pages require authentication; unauthenticated users are redirected to `/login` with redirect preservation

***

## Application Structure

```
client/
├── src/
│   ├── app/
│   │   ├── (auth)/                      # Authentication route group
│   │   │   ├── layout.tsx               # Centered auth container
│   │   │   ├── login/page.tsx           # Login form with validation
│   │   │   └── register/page.tsx        # Register form with validation
│   │   ├── (protected)/                 # Protected route group (auth required)
│   │   │   ├── layout.tsx               # Session check + redirect to /login
│   │   │   ├── page.tsx                 # Kanban board (main view)
│   │   │   └── create/page.tsx          # Create task form
│   │   └── layout.tsx                   # Root layout with Redux provider
│   ├── components/
│   │   ├── board/                       # Kanban board components
│   │   │   ├── KanbanBoard.tsx          # Main board container + task fetch
│   │   │   ├── KanbanColumn.tsx         # Single column (To Do/In Progress/Done)
│   │   │   ├── TaskCard.tsx             # Draggable task card with context menu
│   │   │   ├── TaskList.tsx             # Sortable task list
│   │   │   ├── BoardDnDProvider.tsx     # Drag-drop context (@dnd-kit)
│   │   │   ├── DragContext.tsx          # Custom context for drag state
│   │   │   ├── MenuContext.tsx          # Custom context for task menu state
│   │   │   ├── SkeletonCard.tsx         # Loading skeleton
│   │   │   └── DropIndicator.tsx        # Visual drop feedback
│   │   ├── forms/
│   │   │   └── CreateTaskForm.tsx       # Form with Zod validation
│   │   ├── layout/
│   │   │   └── ProtectedHeader.tsx      # Shared header (title, breadcrumb, team switcher, user menu)
│   │   ├── team/
│   │   │   ├── TeamSwitcher.tsx         # Team selection dropdown + inline create
│   │   │   └── UserMenu.tsx             # User avatar + logout
│   │   ├── ui/                          # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── FormField.tsx            # Labeled input wrapper
│   │   └── providers/
│   │       ├── StoreProvider.tsx        # Redux provider
│   │       └── ToasterProvider.tsx      # Sonner toaster
│   ├── store/
│   │   ├── store.ts                     # Redux store configuration
│   │   ├── hooks.ts                     # useAppDispatch, useAppSelector
│   │   └── slices/
│   │       ├── authSlice.ts             # User auth state, login/register/logout thunks
│   │       ├── teamsSlice.ts            # Team state, team selection, create/add/remove members
│   │       └── tasksSlice.ts            # Task state, fetch/create/update/delete thunks
│   ├── lib/
│   │   ├── api/                         # API service layer
│   │   │   ├── index.ts                 # Axios instance + error extraction
│   │   │   ├── auth.ts                  # Auth endpoints
│   │   │   ├── teams.ts                 # Team endpoints
│   │   │   └── tasks.ts                 # Task endpoints
│   │   └── utils/                       # Utilities (date formatting, etc.)
│   ├── types/
│   │   └── index.ts                     # Shared TypeScript types
│   └── styles/
│       └── globals.css                  # Tailwind + custom design tokens

server/
├── src/
│   ├── models/
│   │   ├── User.ts                      # User schema + bcryptjs hashing
│   │   ├── Team.ts                      # Team schema (members array with roles)
│   │   └── Task.ts                      # Task schema (title, description, status, order, teamId)
│   ├── routes/
│   │   ├── auth.ts                      # POST /api/auth, /api/auth/login, /api/auth/logout, GET /api/auth/me
│   │   ├── teams.ts                     # GET/POST /api/teams, /api/teams/:id/members
│   │   └── tasks.ts                     # GET/POST/PATCH/DELETE /api/tasks with complex reordering logic
│   ├── middleware/
│   │   ├── auth.ts                      # JWT verification middleware
│   │   ├── teamAuth.ts                  # Team membership verification
│   │   ├── validation.ts                # Request validation schemas
│   │   └── errorHandler.ts              # Global error handling
│   ├── utils/
│   │   ├── jwt.ts                       # Token generation/verification
│   │   ├── ApiError.ts                  # Custom error class
│   ├── types/
│   │   └── index.ts                     # Shared TypeScript types
│   ├── config/
│   │   └── db.ts                        # MongoDB connection
│   ├── app.ts                           # Express app setup with middleware
│   ├── index.ts                         # Server entry point
│   ├── seed.ts                          # Database seed script (demo users, teams, tasks)
│   └── routes/
│       └── tasks.test.ts                # Comprehensive Jest test suite (697 lines, 16 test suites)

Root
├── DESIGN.md                            # Design system source of truth (colors, typography, spacing, components)
├── CLAUDE.md                            # AI agent instruction file (constraints, skills, architecture rules)
├── README.md                            # This file
├── Conversation/                        # Full development conversation & architectural decisions
│   ├── claude-code-main-workflow.txt    # Claude Code session: feature development
│   ├── antigravity-stitch-design.txt    # Stitch MCP integration & design synthesis
│   └── [additional session files]
└── .git/                                # Git repository
```

***

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd neura-flow

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Variables

**Server** — create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/neura-flow
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

**Client** — create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Running the App

```bash
# Start the server (from /server)
npm run dev

# Start the client (from /client)
npm run dev
```

- Client: http://localhost:3000
- Server: http://localhost:5000

***

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout (clears cookie) |
| GET | `/api/auth/me` | Get current user (session restore) |

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | Get all teams for current user |
| POST | `/api/teams` | Create new team |
| POST | `/api/teams/:id/members` | Add member by email |
| DELETE | `/api/teams/:id/members/:userId` | Remove member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks?teamId=:id` | Get tasks for a team |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task (status, order, title, etc.) |
| DELETE | `/api/tasks/:id` | Delete task |

***

## Design System

The UI is built on a design system generated from the Stitch project (`3944817413764104981`) and documented in `DESIGN.md`.

Key tokens:
- **Primary color**: `#008378` (teal)
- **Background**: `#F5FAF8`
- **Surface**: `#FFFFFF`
- **Error**: `#BA1A1A`
- **Typography scale**: 4px baseline grid, fluid spacing
- **Border radius**: 8px cards, 4px inputs

***

## State Management

All server interactions are abstracted through Redux Toolkit slices:

| Slice | Manages |
|-------|---------|
| `authSlice` | User session, login/register/logout thunks, session restore |
| `teamsSlice` | Teams list, current team selection, create/add/remove members |
| `tasksSlice` | Tasks per team, create/update/reorder/delete |

Selectors use `createSelector` for memoization. No direct API calls in components.

***

## Development Approach: AI-Orchestrated Architecture

**Role**: Developer as architect orchestrating Claude Code, Stitch MCP, and AI skills (not code generation).

### How This Project Was Built

1. **Architecture-First**: Defined non-negotiable constraints in `CLAUDE.md` (no `any`, Redux-only API calls, tests required)
2. **Design System**: Generated visual language via Stitch MCP (`stitch-design`, `design-md`), synthesized into `DESIGN.md`
3. **Iterative Planning**: Plan → approval → implement → typecheck + lint + test gate at every step
4. **Manual Verification**: Tested drag-drop, auth flow, team-switching, form validation in browser before marking done
5. **AI Skills Orchestration**:
   - `stitch-design` → Design tokens and component specifications
   - `taste-design` → Premium UI standards (typography scale, tonal depths, elevation)
   - `vercel-react-best-practices` → Performance patterns (parallel async, memoization, bundle optimization)
   - `typescript-magician` → Strict typing, eliminated `any` instances
   - `web-design-guidelines` → UI/UX compliance and accessibility
6. **Full Control**: All code reviewed, understood, and approved before commit

### Key Architectural Decisions & Rationale

| Decision | Why | Trade-off |
|---|---|---|
| **Redux Toolkit** (not Context API) | Memoized selectors prevent re-render loops; team-scoped task isolation | More boilerplate |
| **Backend reindexing** (not frontend) | Single source of truth; complex column changes handled server-side | Coordination complexity |
| **@dnd-kit** (not React Beautiful DnD) | Lighter, framework-agnostic, full TypeScript support, zero `any` | Learning curve |
| **MongoDB + Mongoose** | Type-safe, schema validation, multi-tenant queries efficient | Schema migrations |
| **Zod + react-hook-form** | Type-safe validation schema reusable client/server | Two validation layers |
| **Next.js route groups** | Clean separation of auth/protected flows, middleware per layout | Nested structure |

### Problem-Solving Examples

**Infinite re-render on new team creation** → Added `useRef<string | null>(lastFetchedTeamId)` deduplication  
**Auth form collapsed to 50px width** → Applied `w-full max-w-[720px]` layout pattern from CLAUDE.md  
**Task order not persisted on drag** → Centralized reindexing in backend with 697-line test suite  

### Quality Gates

- ✅ `npm run typecheck` passes (strict TypeScript)
- ✅ `npm run lint` passes (ESLint)
- ✅ `npm run test` passes (17 test suites, 50+ assertions)
- ✅ Manual browser testing before each phase completion
- ✅ Zero `any` types in codebase

### Conversation & Decisions

Full development conversation documenting architectural decisions, problem-solving, and skill usage is in `/Conversation` folder:
- `claude-code` — Core feature development
- `antigravity` — Stitch MCP + design system synthesis
- Additional session files capturing all planning and implementation decisions

This demonstrates how AI tools were orchestrated to maintain quality, control, and architectural integrity.

***

## Scripts

### Client
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run typecheck    # TypeScript strict check
npm run lint         # ESLint
```

### Server
```bash
npm run dev          # Start with ts-node-dev (hot reload)
npm run build        # Compile TypeScript
npm run start        # Start compiled server
```

***

## Project Files & Documentation

### Core Documentation
| File | Purpose |
|------|---------|
| `DESIGN.md` | Design system source of truth (colors, typography, spacing, component specs) — enforced via CLAUDE.md constraints |
| `CLAUDE.md & GEMINI.md` | AI agent instruction file defining architecture, constraints (no `any`, Redux-only API calls, test requirements), and non-negotiables |
| `README.md` | This file — generated and maintained by agent, reviewed for accuracy |

### Development Artifacts
| Folder | Purpose |
|--------|---------|
| `/Conversation` | Full development transcript across multiple sessions |
| — `claude-code` | Claude Code session: core feature development, problem-solving, architectural decisions |
| — `antigravity` | Stitch MCP integration, design system synthesis, token validation |
| — `[additional sessions]` | Team management, auth flow, responsive design, bug fixes |
| `/server` | Backend (Express, MongoDB, Mongoose, JWT auth) |
| `/client` | Frontend (Next.js, React, Redux, Tailwind, @dnd-kit) |

### Code Quality Artifacts
| File | Purpose |
|------|---------|
| `server/src/routes/tasks.test.ts` | Comprehensive Jest test suite (697 lines, 16 test suites, 50+ assertions) covering CRUD, reordering, validation |
| `.git/` | Full commit history showing iterative development and decisions |

***

## License

MIT
