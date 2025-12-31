# Implementation Plan: Planning Poker Session Application

**Branch**: `001-poker-session-app` | **Date**: 2025-12-31 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-poker-session-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Building a real-time Planning Poker web application using Angular (latest with SSR enabled) where the SSR Node.js server handles WebSocket coordination for session management and voting. No separate backend or database - all session state maintained in-memory on the SSR server. NGRX SignalStore for client-side state management. Socket.IO chosen for WebSocket implementation due to excellent Angular SSR compatibility, automatic fallback mechanisms, and built-in room management.

## Technical Context

**Language/Version**: TypeScript 5.x, Angular (latest version) with SSR enabled, Node.js 20+  
**Primary Dependencies**:

- Frontend: @angular/core, @ngrx/signals, socket.io-client
- Backend (SSR Server): @angular/ssr, socket.io, express
  **Storage**: In-memory only (Map/Set data structures on Node server)  
  **Testing**:
- Unit: Jasmine/Karma (Angular default)
- Integration: Playwright for E2E
- WebSocket: socket.io-client-mock for testing
  **Target Platform**: Web (Desktop + Mobile browsers, Chrome/Firefox/Safari/Edge last 2 versions)  
  **Project Type**: Web application (Angular SSR - unified frontend/backend in single project)  
  **Performance Goals**:
- Initial page load < 2s on 3G
- WebSocket message latency < 500ms
- Support 20 concurrent participants per session
- Client bundle < 500KB gzipped
  **Constraints**:
- Zero persistent storage (constitution principle I)
- TDD mandatory (constitution principle III)
- Cyclomatic complexity max 5 per function (constitution principle II)
- WCAG 2.1 AA accessibility compliance (constitution principle IV)
  **Scale/Scope**:
- MVP: 8 user stories (4 P1, 3 P2, 1 P3)
- ~15-20 components
- ~10 services
- In-memory capacity: 100 concurrent sessions max (practical server limit)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### ✅ Principle I: Privacy by Design (NON-NEGOTIABLE)

- **Requirement**: Zero persistent storage of user data
- **Implementation Strategy**: All session data stored in Map<sessionId, SessionState> on SSR server; cleared on timeout or disconnect
- **Verification**: Code review checklist + integration tests verifying no database/file writes
- **Status**: ✅ COMPLIANT - Architecture uses only in-memory storage

### ✅ Principle II: Code Quality Standards

- **Requirement**: Cyclomatic complexity max 5, type safety, SRP, DRY
- **Implementation Strategy**:
  - TypeScript strict mode enabled
  - ESLint complexity rule enforced (max-complexity: 5)
  - Each Angular component/service has single responsibility
- **Verification**: CI/CD pipeline runs ESLint complexity checks
- **Status**: ✅ COMPLIANT - Tooling enforces standards

### ✅ Principle III: Testing Requirements (NON-NEGOTIABLE)

- **Requirement**: TDD with 80% coverage, tests before implementation
- **Implementation Strategy**:
  - Write unit tests for services/stores first
  - Write component tests before component implementation
  - Integration tests for WebSocket flows
  - Coverage enforced in CI
- **Verification**: Jest/Karma coverage reports + CI pipeline blocks on <80%
- **Status**: ✅ COMPLIANT - TDD workflow enforced

### ✅ Principle IV: User Experience Consistency

- **Requirement**: Max 3 clicks to action, 100ms feedback, mobile-first, WCAG 2.1 AA
- **Implementation Strategy**:
  - Angular Material for accessibility foundation
  - Loading states on all async operations
  - Responsive breakpoints (320px+)
  - ARIA labels on all interactive elements
- **Verification**: Lighthouse accessibility audit, manual keyboard/screen reader testing
- **Status**: ✅ COMPLIANT - Angular Material + design system ensures compliance

### ✅ Principle V: Performance Standards

- **Requirement**: <2s load, <500ms latency, 20 users/session, <500KB bundle
- **Implementation Strategy**:
  - Angular SSR for fast initial load
  - Lazy loading for route modules
  - Socket.IO for efficient WebSocket communication
  - Bundle analyzer to monitor size
- **Verification**: Lighthouse performance audit, WebSocket latency monitoring
- **Status**: ✅ COMPLIANT - SSR + optimization strategies meet targets

### ✅ Principle VI: Simplicity and Maintainability

- **Requirement**: YAGNI, minimal deps, framework-agnostic domain logic
- **Implementation Strategy**:
  - Core session logic in plain TypeScript classes (domain/)
  - UI framework code separated (presentation/)
  - Justify each new npm package
- **Verification**: Dependency audit in code review
- **Status**: ✅ COMPLIANT - Clean architecture separates concerns

## Project Structure

### Documentation (this feature)

```text
specs/001-poker-session-app/
├── plan.md              # This file
├── research.md          # Phase 0: WebSocket lib evaluation, SSR patterns
├── data-model.md        # Phase 1: Session, Participant, Vote models
├── quickstart.md        # Phase 1: Setup + first session instructions
├── contracts/           # Phase 1: WebSocket message schemas
└── checklists/
    └── requirements.md  # Validation checklist
```

### Source Code (repository root)

```text
sprint-poker/
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton services
│   │   │   ├── services/
│   │   │   │   ├── websocket.service.ts          # Socket.IO client wrapper
│   │   │   │   └── session-storage.service.ts    # Browser session temp storage
│   │   │   └── guards/
│   │   │       └── session-active.guard.ts
│   │   ├── domain/                  # Framework-agnostic business logic
│   │   │   ├── models/
│   │   │   │   ├── session.model.ts
│   │   │   │   ├── participant.model.ts
│   │   │   │   ├── vote.model.ts
│   │   │   │   └── voting-deck.model.ts
│   │   │   ├── services/
│   │   │   │   ├── session-manager.ts            # Session lifecycle logic
│   │   │   │   └── vote-calculator.ts            # Vote statistics
│   │   │   └── validators/
│   │   │       └── session-validators.ts
│   │   ├── features/
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts             # Landing + create session
│   │   │   │   ├── home.component.html
│   │   │   │   ├── home.component.spec.ts
│   │   │   │   └── home.component.scss
│   │   │   ├── join/
│   │   │   │   ├── join.component.ts             # Enter display name
│   │   │   │   └── join.store.ts                 # NGRX SignalStore
│   │   │   └── session/
│   │   │       ├── session.component.ts          # Main session container
│   │   │       ├── session.store.ts              # NGRX SignalStore
│   │   │       ├── components/
│   │   │       │   ├── voting-deck/
│   │   │       │   │   ├── voting-deck.component.ts
│   │   │       │   │   └── voting-deck.component.spec.ts
│   │   │       │   ├── participant-list/
│   │   │       │   │   ├── participant-list.component.ts
│   │   │       │   │   └── participant-list.component.spec.ts
│   │   │       │   ├── vote-results/
│   │   │       │   │   ├── vote-results.component.ts
│   │   │       │   │   └── vote-results.component.spec.ts
│   │   │       │   └── facilitator-controls/
│   │   │       │       ├── facilitator-controls.component.ts
│   │   │       │       └── facilitator-controls.component.spec.ts
│   │   │       └── session-routing.module.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── copy-link/                    # Reusable copy-to-clipboard
│   │   │   │   ├── error-message/
│   │   │   │   └── loading-spinner/
│   │   │   └── utils/
│   │   │       ├── session-id-generator.ts
│   │   │       └── sanitization.utils.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   ├── app.config.server.ts                  # SSR-specific config
│   │   └── app.routes.ts
│   ├── server/                                    # SSR Node.js server
│   │   ├── server.ts                              # Express + Socket.IO setup
│   │   ├── websocket/
│   │   │   ├── socket-handler.ts                  # Socket.IO event handlers
│   │   │   └── session-store.ts                   # In-memory session Map
│   │   ├── middleware/
│   │   │   ├── session-validator.middleware.ts
│   │   │   └── rate-limiter.middleware.ts
│   │   └── utils/
│   │       ├── session-cleanup.ts                 # 1-hour timeout logic
│   │       └── duplicate-name-handler.ts
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── styles.scss
│   └── index.html
├── tests/
│   ├── e2e/
│   │   ├── session-flow.spec.ts                   # Complete user journey
│   │   ├── voting-flow.spec.ts
│   │   └── facilitator-flow.spec.ts
│   ├── integration/
│   │   ├── websocket-connection.spec.ts
│   │   └── session-synchronization.spec.ts
│   └── fixtures/
│       └── test-data.ts
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.server.json
└── playwright.config.ts
```

**Structure Decision**: Single Angular SSR project with unified frontend/backend. The `src/app/` contains Angular components and client-side logic, while `src/server/` contains the Node.js SSR server extended with Socket.IO for WebSocket handling. This architecture leverages Angular's built-in SSR capabilities while adding real-time communication without a separate backend service.

## Complexity Tracking

> No constitution violations - all principles satisfied by chosen architecture.

---

## Phase 0: Research - ✅ COMPLETE

**Status**: Completed 2025-12-31  
**Output**: [research.md](research.md)

### Decisions Made

1. **WebSocket Library**: Socket.IO v4 (best Angular SSR compatibility, room management, auto-reconnect)
2. **State Management**: NGRX SignalStore (modern, simpler than full NGRX, signal-based reactivity)
3. **In-Memory Storage**: Map<sessionId, SessionData> with TTL tracking
4. **Session ID**: nanoid (11 chars, URL-safe, cryptographically strong)
5. **Sanitization**: Angular DomSanitizer + regex validation
6. **Update Pattern**: Granular event types (participantJoined, voteSubmitted, etc.)
7. **Mobile Strategy**: Angular Material + custom Flexbox (WCAG 2.1 AA compliant)
8. **Testing**: Multi-layer (socket.io-mock for unit, real Socket.IO for integration, Playwright for E2E)

### ADRs (Architecture Decision Records)

- **ADR-001**: No separate backend - extend Angular SSR Node server with Socket.IO
- **ADR-002**: In-memory only storage (constitution compliance)
- **ADR-003**: WebSocket over HTTP polling (performance <500ms requirement)

---

## Phase 1: Design - ✅ COMPLETE

**Status**: Completed 2025-12-31

### Artifacts Created

✅ **Data Model** ([data-model.md](data-model.md))

- 4 core entities: Session, Participant, Vote, VotingDeck
- Validation rules for all properties
- State transition diagrams
- Memory footprint analysis (~3KB per session, 300KB max for 100 sessions)

✅ **API Contracts** ([contracts/websocket-events.md](contracts/websocket-events.md))

- 5 client→server events (createSession, joinSession, submitVote, revealVotes, clearVotes)
- 7 server→client events (participantJoined, participantLeft, voteSubmitted, votesRevealed, votesCleared, sessionExpired, error)
- Full TypeScript type definitions
- Error codes and validation rules
- Socket.IO room management strategy

✅ **Quickstart Guide** ([quickstart.md](quickstart.md))

- Prerequisites and setup instructions
- Development workflow (dev server, testing, debugging)
- TDD workflow examples
- Common development tasks
- Troubleshooting guide

✅ **Project Structure**

- Single Angular SSR project
- Frontend: `src/app/` (Angular components, services, stores)
- Backend: `src/server/` (Express + Socket.IO handlers)
- Tests: `tests/` (e2e, integration)

### Constitution Re-Check

All principles verified compliant:

- ✅ Privacy by Design: In-memory only, no persistence
- ✅ Code Quality: TypeScript strict, ESLint complexity:5, SRP/DRY
- ✅ Testing: TDD workflow, 80% coverage requirement, mocking strategy
- ✅ UX: Angular Material (WCAG 2.1 AA), 3-click rule, 100ms feedback
- ✅ Performance: SSR for <2s load, Socket.IO for <500ms latency, <500KB bundle
- ✅ Simplicity: Minimal deps justified, domain logic isolated, YAGNI

---

## Phase 2: Task Breakdown - NOT STARTED

Phase 2 is handled by the `/speckit.tasks` command (not part of `/speckit.plan`).

**Next Steps**:

1. Review plan.md, research.md, data-model.md, contracts/, and quickstart.md
2. Run `/speckit.tasks` to generate task.md with development tasks
3. Begin implementation following TDD workflow

---

## Summary

**Implementation Approach**: Angular (latest) SSR with Socket.IO for real-time coordination

**Key Technologies**:

- Frontend: Angular (latest), NGRX SignalStore, Socket.IO client
- Backend: Node.js 20+ (SSR server), Socket.IO server, Express
- Testing: Jasmine/Karma, Playwright, socket.io-mock
- Styling: Angular Material, SCSS

**Architecture**: Single unified project - Angular SSR server extended with Socket.IO for WebSocket handling. No separate backend or database. All session state in-memory on Node.js process.

**Constitution Compliance**: ✅ All 6 principles verified compliant

**Readiness**: ✅ Ready for Phase 2 (task breakdown) and implementation

---

## Implementation Clarifications (2025-12-31)

### 1. Socket.IO Server Integration

**Decision**: Create custom server wrapper that imports Angular server

**Approach**:

- Create `src/server/server.ts` that wraps Angular's SSR application
- Attach Socket.IO to the Express instance before Angular handles routes
- Preserves Angular SSR functionality while adding WebSocket support

**Implementation Pattern**:

```typescript
// src/server/server.ts
import { app } from "./app"; // Angular SSR app
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./websocket/socket-handler";

const server = createServer(app);
const io = new Server(server);

setupSocketHandlers(io);

const PORT = process.env["PORT"] || 4200;
server.listen(PORT);
```

### 2. Heartbeat/Connection Tracking

**Decision**: Use Socket.IO's built-in ping/pong mechanism

**Configuration**:

- Socket.IO automatically sends ping frames every 25 seconds (default)
- Server marks client disconnected if no pong received within 20 seconds
- No custom heartbeat event needed
- Update `lastSeen` timestamp on any message from client (not separate heartbeat)

**Server Configuration**:

```typescript
const io = new Server(server, {
  pingTimeout: 30000, // 30s to wait for pong response
  pingInterval: 25000, // 25s between ping frames
});
```

### 3. Rate Limiting Configuration

**Decision**: Per-action rate limits

**Limits**:

- **Vote submission**: 10 per minute per participant
- **Join session**: 5 per minute per socket
- **Create session**: 3 per minute per socket
- **Reveal/Clear votes**: 20 per minute per facilitator

**Implementation**: Use in-memory Map tracking timestamps per socket ID and action type
