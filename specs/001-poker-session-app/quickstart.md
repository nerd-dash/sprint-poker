# Quickstart Guide: Sprint Poker

**Feature**: Planning Poker Session Application  
**Date**: 2025-12-31  
**Audience**: Developers setting up the project for the first time

## Prerequisites

- Node.js 20+ ([Download](https://nodejs.org/))
- npm 10+ (comes with Node.js)
- Git
- Code editor (VS Code recommended)
- Google Chrome (only supported browser)

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd sprint-poker
```

### 2. Checkout Feature Branch

```bash
git checkout 001-poker-session-app
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Verify Angular CLI

```bash
npx ng version
```

Expected output should show Angular (latest) with SSR support.

## Project Structure Overview

```
sprint-poker/
├── src/
│   ├── app/              # Angular application
│   │   ├── core/         # Singleton services (WebSocket, guards)
│   │   ├── domain/       # Business logic (framework-agnostic)
│   │   ├── features/     # Feature modules (home, join, session)
│   │   └── shared/       # Reusable components & utilities
│   └── server/           # SSR Node.js server + Socket.IO
│       ├── server.ts     # Express + Socket.IO setup
│       └── websocket/    # WebSocket handlers & session store
├── tests/
│   ├── e2e/              # Playwright end-to-end tests
│   └── integration/      # WebSocket integration tests
└── specs/                # Feature specifications & planning docs
```

## Development Workflow

### Running the Application

#### Start SSR Development Server

```bash
npm run dev:ssr
```

This command:

1. Builds the Angular app with SSR
2. Starts the Node.js server on `http://localhost:4200`
3. Enables Socket.IO WebSocket server
4. Watches for file changes (hot reload)

**Access the app**: Open `http://localhost:4200` in your browser

#### Start Client-Only (No SSR)

For faster development iteration on UI only:

```bash
npm start
```

App runs on `http://localhost:4200` but WebSocket features won't work without SSR server.

### Running Tests

#### Unit Tests (Angular default runner)

```bash
npm test
```

Runs unit tests via `ng test` (Angular 21 uses Vitest under the hood). Must maintain 80%+ coverage per constitution.

#### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run e2e
```

#### Integration Tests (WebSocket)

```bash
npm run test:integration
```

Tests real-time Socket.IO communication flows.

### Code Quality Checks

#### Linting

```bash
npm run lint
```

Enforces:

- Cyclomatic complexity max 5
- TypeScript strict mode
- Code style consistency

#### Format Code

```bash
npm run format
```

Uses Prettier to auto-format all files.

## Creating Your First Session

### 1. Start the Server

```bash
npm run dev:ssr
```

### 2. Open Browser

Navigate to `http://localhost:4200`

### 3. Create Session

1. Click "Create New Session" button
2. Enter your name (e.g., "Alice")
3. You'll see a session URL like: `http://localhost:4200/session/V1StGXR8_Z5`
4. Copy this URL to share with participants

### 4. Join as Participant (New Tab/Browser)

1. Open the session URL in a new tab or incognito window
2. Enter your name (e.g., "Bob")
3. Click "Join Session"

### 5. Vote

1. As "Bob", click a card from the voting deck (e.g., "5")
2. Notice checkmark appears next to your name
3. Other participants see you voted but not your value

### 6. Reveal (Facilitator Only)

1. As "Alice" (facilitator), click "Reveal Votes"
2. All participants see everyone's votes simultaneously
3. View statistics (average, consensus, distribution)

### 7. Start New Round

1. As facilitator, click "Clear Votes"
2. Everyone's votes are cleared
3. Ready to estimate next item

## Key Development Files

### WebSocket Service

**File**: `src/app/core/services/websocket.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:4200', {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });
  }

  createSession(name: string): Promise<CreateSessionResponse> {
    return new Promise((resolve) => {
      this.socket.emit('createSession', { facilitatorName: name }, resolve);
    });
  }

  // ... other methods
}
```

### Session Store (NGRX Signals)

**File**: `src/app/features/session/session.store.ts`

```typescript
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

interface SessionState {
  sessionId: string | null;
  participants: Participant[];
  isRevealed: boolean;
  // ... other state
}

export const SessionStore = signalStore(
  { providedIn: 'root' },
  withState<SessionState>({
    /* initial state */
  }),
  withMethods((store) => ({
    updateParticipants(participants: Participant[]) {
      patchState(store, { participants });
    },
  }))
);
```

### Server Socket Handler

**File**: `src/server/websocket/socket-handler.ts`

```typescript
import { Server, Socket } from 'socket.io';
import { sessionStore } from './session-store';

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    // Privacy guardrail: do not log socket IDs, session IDs, display names, or votes.

    socket.on('createSession', (data, callback) => {
      const sessionId = sessionStore.createSession(socket.id);
      callback({ success: true, sessionId });
    });

    // ... other handlers
  });
}
```

## Testing Your Changes

### TDD Workflow (Required by Constitution)

1. **Write Test First** (Red)

```typescript
// vote-calculator.spec.ts
it('should calculate median vote', () => {
  const votes = [1, 2, 3, 5, 8];
  expect(calculateMedian(votes)).toBe(3);
});
```

2. **Run Test** (see it fail)

```bash
npm test
```

3. **Implement** (Green)

```typescript
// vote-calculator.ts
export function calculateMedian(votes: number[]): number {
  const sorted = [...votes].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
```

4. **Run Test** (see it pass)

```bash
npm test
```

5. **Refactor** (if needed, keeping tests green)

## Common Development Tasks

### Add New Component

```bash
ng generate component features/session/components/vote-summary
```

### Add New Service

```bash
ng generate service domain/services/vote-calculator
```

### Add New Route

Edit `src/app/app.routes.ts`:

```typescript
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'session/:id', component: SessionComponent },
  // Add new route here
];
```

### Add WebSocket Event Handler

1. Define event in `specs/001-poker-session-app/contracts/websocket-events.md`
2. Add TypeScript interface in `src/shared/types/websocket-events.ts`
3. Implement handler in `src/server/websocket/socket-handler.ts`
4. Add client method in `src/app/core/services/websocket.service.ts`

## Debugging

### WebSocket Connection Issues

```typescript
// In browser console
const socket = io('http://localhost:4200', {
  transports: ['websocket'],
  debug: true,
});

socket.on('connect', () => console.log('Connected'));
socket.on('disconnect', () => console.log('Disconnected'));
socket.on('error', (err) => console.error('Error:', err));
```

### Check Session Store

Add debug endpoint in `src/server/server.ts`:

```typescript
app.get('/debug/sessions', (req, res) => {
  res.json({
    count: sessionStore.getSessionCount(),
    sessions: sessionStore.getAllSessions(),
  });
});
```

Visit `http://localhost:4200/debug/sessions`

### View Angular Signals State

Use Angular DevTools browser extension:

1. Install from Chrome/Firefox store
2. Open DevTools → Angular tab
3. View component tree and signal values

## Environment Configuration

### Development

Edit `src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  websocketUrl: 'http://localhost:4200',
  sessionTimeout: 3600000, // 1 hour
  maxParticipants: 20,
};
```

### Production

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: true,
  websocketUrl: 'https://your-domain.com',
  sessionTimeout: 3600000,
  maxParticipants: 20,
};
```

## Build for Production

### Build Angular SSR App

```bash
npm run build:ssr
```

Output: `dist/sprint-poker/`

### Run Production Server

```bash
npm run serve:ssr
```

Server starts on port 4000 (configurable).

## Accessibility Testing

### Lighthouse Audit

```bash
npm run lighthouse
```

Generates accessibility report. Must score 90+ per constitution.

### Keyboard Navigation Testing

Manually test:

- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close modals
- Arrow keys for card selection

### Screen Reader Testing

- **macOS**: VoiceOver (Cmd+F5)
- **Windows**: NVDA (free) or JAWS
- **Linux**: Orca

Verify all interactive elements have proper ARIA labels.

## Performance Monitoring

### Bundle Size Check

```bash
npm run analyze
```

Opens bundle analyzer. Must keep total < 500KB gzipped.

### WebSocket Latency

Add timing in client:

```typescript
const start = Date.now();
socket.emit('submitVote', data, (response) => {
  const latency = Date.now() - start;
  console.log('Latency:', latency, 'ms');
  // Should be < 500ms per constitution
});
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 4200
npx kill-port 4200

# Or use different port
ng serve --port 4201
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### WebSocket Not Connecting

1. Check SSR server is running (`npm run dev:ssr`)
2. Verify no CORS issues (should be same-origin)
3. Check browser console for errors
4. Try disabling browser extensions

### Tests Failing

```bash
# Clear Karma cache
rm -rf .angular

# Reinstall Playwright
npx playwright install --force
```

## Next Steps

1. Review [spec.md](spec.md) for full requirements
2. Check [data-model.md](data-model.md) for entity definitions
3. Read [websocket-events.md](contracts/websocket-events.md) for API contracts
4. Follow TDD: write tests before implementing features
5. Run `npm run lint` before committing
6. Ensure all tests pass: `npm test && npm run e2e`

## Getting Help

- **Specifications**: `/specs/001-poker-session-app/`
- **Constitution**: `.specify/memory/constitution.md`
- **Angular Docs**: https://angular.dev
- **Socket.IO Docs**: https://socket.io/docs/v4/
- **NGRX Signals**: https://ngrx.io/guide/signals

## Quick Reference Commands

```bash
# Development
npm run dev:ssr          # Start SSR dev server
npm start                # Start client-only dev
npm test                 # Run unit tests
npm run e2e              # Run E2E tests
npm run lint             # Check code quality

# Build
npm run build:ssr        # Production build
npm run serve:ssr        # Serve production build

# Analysis
npm run analyze          # Bundle size analysis
npm run lighthouse       # Accessibility audit
```

Happy coding! 🎯
