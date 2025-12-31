# Research: Planning Poker Technical Decisions

**Feature**: Planning Poker Session Application  
**Date**: 2025-12-31  
**Phase**: 0 - Research & Technology Selection

## Research Questions

### 1. WebSocket Library for Angular SSR

**Question**: Which WebSocket library provides best compatibility with Angular SSR and meets our real-time requirements?

**Options Evaluated**:

- Socket.IO
- Native WebSocket API
- ws (Node.js WebSocket library)
- SockJS

**Decision**: **Socket.IO**

**Rationale**:

- **SSR Compatibility**: Excellent integration with Express server (used by Angular SSR)
- **Automatic Fallback**: Falls back to long-polling if WebSocket unavailable (improves reliability)
- **Room Management**: Built-in room/namespace support perfect for session isolation
- **Reconnection**: Automatic reconnection handling reduces client-side complexity
- **Binary Support**: Can send binary data if needed for future features
- **Community**: Large ecosystem, well-documented, actively maintained
- **Performance**: Meets <500ms latency requirement in benchmarks

**Alternatives Considered**:

- **Native WebSocket**: Lower-level, requires manual reconnection logic, no room management
- **ws**: Server-only library, need separate client solution
- **SockJS**: Legacy option, Socket.IO is more modern

**Implementation Notes**:

- Server: `socket.io` package (v4.x)
- Client: `socket.io-client` package (v4.x)
- Testing: `socket.io-client-mock` for unit tests

---

### 2. State Management Strategy

**Question**: How to manage complex session state across components with real-time updates?

**Options Evaluated**:

- NGRX SignalStore
- NGRX Store (traditional)
- Akita
- Plain Angular services with RxJS

**Decision**: **NGRX SignalStore**

**Rationale**:

- **Modern Approach**: Leverages Angular Signals (native to Angular 16+)
- **Simplicity**: Less boilerplate than traditional NGRX Store
- **Performance**: Signal-based change detection more efficient than zone.js
- **TypeScript**: Excellent type safety with minimal configuration
- **Reactivity**: Automatic updates when state changes fit WebSocket model perfectly
- **Learning Curve**: Simpler than full NGRX for focused use case

**Alternatives Considered**:

- **Traditional NGRX**: Overkill for this scope, more boilerplate
- **Akita**: Less active maintenance, smaller community
- **Plain Services**: Harder to manage complex state updates across multiple components

**Implementation Pattern**:

```typescript
// session.store.ts
export const SessionStore = signalStore(
  withState<SessionState>({
    sessionId: null,
    participants: [],
    votes: new Map(),
    isRevealed: false,
    currentUser: null,
  }),
  withMethods((store) => ({
    updateParticipants(participants: Participant[]) {
      patchState(store, { participants });
    },
    revealVotes() {
      patchState(store, { isRevealed: true });
    },
  }))
);
```

---

### 3. In-Memory Session Storage Structure

**Question**: What data structure best supports fast session lookups, participant management, and automatic cleanup?

**Options Evaluated**:

- Map<sessionId, Session>
- Plain JavaScript objects
- Custom LRU Cache
- Redis (excluded per constitution)

**Decision**: **Map<sessionId, SessionData> with TTL tracking**

**Rationale**:

- **O(1) Lookups**: Fast session access by ID
- **Type Safety**: TypeScript Map provides better typing than plain objects
- **Size Tracking**: Map.size for capacity monitoring
- **Iteration**: Easy to iterate for cleanup tasks
- **TTL Pattern**: Store lastActivity timestamp, background job cleans expired sessions

**Data Structure**:

```typescript
interface SessionData {
  id: string;
  facilitatorSocketId: string;
  participants: Map<string, ParticipantData>;
  votes: Map<string, number>;
  isRevealed: boolean;
  createdAt: Date;
  lastActivity: Date;
}

const sessions = new Map<string, SessionData>();
```

**Cleanup Strategy**:

- `setInterval` every 5 minutes checks `lastActivity`
- Remove sessions with `Date.now() - lastActivity > 1 hour`
- Emit disconnect events to connected clients before removal

---

### 4. Session ID Generation

**Question**: How to generate unique, URL-safe session IDs that are difficult to guess?

**Options Evaluated**:

- UUID v4
- nanoid
- Short custom IDs (6-8 chars)
- Sequential IDs

**Decision**: **nanoid** (11 characters, URL-safe)

**Rationale**:

- **Collision Resistance**: 11 chars provides ~3.5M IDs per hour for 1% collision probability
- **URL Safe**: No special encoding needed
- **Performance**: Faster than UUID v4
- **Size**: Shorter than UUID (36 chars) → better UX
- **Security**: Cryptographically strong random values

**Implementation**:

```typescript
import { nanoid } from "nanoid";

function generateSessionId(): string {
  return nanoid(11); // e.g., "V1StGXR8_Z5"
}
```

---

### 5. Display Name Sanitization

**Question**: How to prevent XSS attacks via user-submitted display names while preserving international characters?

**Options Evaluated**:

- DOMPurify
- Angular's built-in sanitization
- Manual regex filtering
- HTML entity encoding

**Decision**: **Angular DomSanitizer + manual validation**

**Rationale**:

- **Built-in**: No extra dependency
- **Framework Integration**: Works with Angular's template binding
- **XSS Protection**: Strips script tags and dangerous attributes
- **Unicode Support**: Preserves international characters (emoji, accents)
- **Validation Layer**: Additional regex check for length and allowed characters

**Implementation**:

```typescript
import { DomSanitizer } from '@angular/platform-browser';

sanitizeDisplayName(name: string): string {
  // 1. Trim whitespace
  let cleaned = name.trim();

  // 2. Limit length
  cleaned = cleaned.substring(0, 50);

  // 3. Remove HTML tags (Angular sanitizer)
  const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, cleaned);

  // 4. Validate allowed characters (alphanumeric + spaces + common punctuation)
  if (!/^[\p{L}\p{N}\s\-_'.]+$/u.test(sanitized || '')) {
    throw new Error('Invalid characters in display name');
  }

  return sanitized || 'Guest';
}
```

---

### 6. Real-Time Update Pattern

**Question**: How to efficiently broadcast session state changes to all participants?

**Options Evaluated**:

- Broadcast everything on every change
- Granular event types per action
- State snapshots on demand
- Delta/diff updates

**Decision**: **Granular event types** (participantJoined, voteSubmitted, votesRevealed, etc.)

**Rationale**:

- **Efficiency**: Send only relevant data per event
- **Clarity**: Event names self-document what changed
- **Flexibility**: Easy to add new event types
- **Network**: Reduces payload size vs full state broadcasts
- **Debugging**: Clear audit trail of what happened when

**Event Schema**:

```typescript
// Events from server
interface ServerEvent {
  type:
    | "participantJoined"
    | "participantLeft"
    | "voteSubmitted"
    | "votesRevealed"
    | "votesCleared"
    | "sessionExpired";
  payload: any;
  timestamp: number;
}

// Events from client
interface ClientEvent {
  type:
    | "createSession"
    | "joinSession"
    | "submitVote"
    | "revealVotes"
    | "clearVotes";
  payload: any;
}
```

---

### 7. Mobile Responsive Strategy

**Question**: How to ensure optimal experience on mobile devices (320px+) while maintaining desktop functionality?

**Options Evaluated**:

- CSS Grid + Flexbox
- Angular Material Layout
- Tailwind CSS
- Bootstrap Grid

**Decision**: **Angular Material + Custom Flexbox**

**Rationale**:

- **Accessibility**: Angular Material components are WCAG 2.1 AA compliant out of box
- **Consistency**: Material Design principles ensure visual consistency
- **Breakpoints**: Built-in responsive utilities (`fxLayout`, `fxFlex`)
- **Touch Targets**: 48x48px minimum touch targets (Material standard)
- **Performance**: Tree-shakeable, only import what's used

**Breakpoint Strategy**:

- **Mobile**: < 600px (single column, stacked cards)
- **Tablet**: 600-960px (2-column grid)
- **Desktop**: > 960px (sidebar + main content)

**Critical Mobile Optimizations**:

- Voting deck: Vertical scrollable list on mobile
- Participant list: Collapsible on mobile, persistent on desktop
- Copy link button: Large touch target with haptic feedback
- Error messages: Toast notifications instead of modals

---

### 8. Testing Strategy for WebSocket Flows

**Question**: How to reliably test real-time WebSocket interactions without flaky tests?

**Options Evaluated**:

- Manual testing only
- socket.io-mock
- Separate test WebSocket server
- Playwright with real WebSocket

**Decision**: **Multi-layer approach**:

- **Unit**: `socket.io-client-mock` for service tests
- **Integration**: Real Socket.IO server in test mode
- **E2E**: Playwright with real SSR server

**Rationale**:

- **Fast Unit Tests**: Mocked socket for instant feedback
- **Real Integration**: Catch timing/concurrency issues
- **E2E Confidence**: Full stack verification
- **TDD Compatible**: Write test, fail, implement, pass

**Example Unit Test Pattern**:

```typescript
import { io } from "socket.io-client-mock";

describe("WebSocketService", () => {
  it("should handle vote submission", (done) => {
    const mockSocket = io("http://localhost:3000");

    service.submitVote("session-123", 5);

    mockSocket.on("voteSubmitted", (data) => {
      expect(data.vote).toBe(5);
      done();
    });
  });
});
```

---

## Summary of Technical Stack

| Component              | Technology                 | Justification                                      |
| ---------------------- | -------------------------- | -------------------------------------------------- |
| **Frontend Framework** | Angular (latest) SSR       | Modern, performant, SSR built-in                   |
| **State Management**   | NGRX SignalStore           | Signal-based reactivity, simpler than full NGRX    |
| **Real-Time**          | Socket.IO v4               | Best SSR compatibility, room management, fallbacks |
| **Backend Runtime**    | Node.js 20+ (SSR server)   | Required for Angular SSR, handles WebSocket        |
| **Styling**            | Angular Material + SCSS    | Accessible components, responsive utilities        |
| **Testing**            | Jasmine/Karma + Playwright | Unit + E2E coverage, TDD-friendly                  |
| **Session Storage**    | In-memory Map              | O(1) lookups, constitution-compliant               |
| **ID Generation**      | nanoid                     | Short, secure, URL-safe IDs                        |
| **Sanitization**       | Angular DomSanitizer       | XSS protection, built-in                           |

## Architecture Decision Records

### ADR-001: No Separate Backend

**Context**: Need real-time coordination  
**Decision**: Extend Angular SSR Node server with Socket.IO  
**Consequences**: Simpler deployment, reduced complexity, fits constitution principle VI

### ADR-002: In-Memory Only

**Context**: Constitution mandates no persistent storage  
**Decision**: All state in Node.js process memory  
**Consequences**: Sessions lost on server restart (acceptable for prototype), simple architecture

### ADR-003: WebSocket Over HTTP Polling

**Context**: Need real-time updates <500ms  
**Decision**: Socket.IO provides WebSocket with automatic fallback  
**Consequences**: Better performance, complexity handled by library

### ADR-004: Custom Server Wrapper

**Context**: Need to integrate Socket.IO with Angular SSR server  
**Decision**: Create custom Express wrapper that imports Angular SSR app  
**Consequences**: Full control over Socket.IO configuration, preserves Angular SSR functionality, clear separation of concerns

## Next Steps (Phase 1)

1. Create data model definitions (data-model.md)
2. Define WebSocket message contracts (contracts/)
3. Write quickstart guide (quickstart.md)
4. Update agent context with technologies
