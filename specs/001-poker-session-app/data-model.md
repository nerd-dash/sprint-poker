# Data Model: Planning Poker

**Feature**: Planning Poker Session Application  
**Date**: 2025-12-31  
**Phase**: 1 - Design

## Overview

This document defines the core domain entities for the Planning Poker application. All entities exist **in-memory only** (no database persistence per constitution). Models are defined as TypeScript interfaces/classes with validation rules.

## Entity Relationship Diagram

```
Session (1) ←──── (facilitator) ──── Participant (1)
   │                                       │
   │                                       │
   ├──── (participants) ───→ Participant (*)
   │
   └──── (votes) ───→ Vote (*) ───→ Participant (1)
```

## Core Entities

### 1. Session

Represents an active estimation meeting.

#### Properties

| Property        | Type                       | Required | Constraints      | Description                               |
| --------------- | -------------------------- | -------- | ---------------- | ----------------------------------------- |
| `id`            | `string`                   | Yes      | 11 chars, nanoid | Unique session identifier                 |
| `facilitatorId` | `string`                   | Yes      | -                | Socket ID of session creator              |
| `participants`  | `Map<string, Participant>` | Yes      | Max 20           | Connected participants (key = socketId)   |
| `votes`         | `Map<string, Vote>`        | Yes      | -                | Current round votes (key = participantId) |
| `isRevealed`    | `boolean`                  | Yes      | -                | Whether votes are visible                 |
| `createdAt`     | `Date`                     | Yes      | -                | Session creation timestamp                |
| `lastActivity`  | `Date`                     | Yes      | -                | Last interaction timestamp                |

#### Validation Rules

```typescript
interface SessionValidation {
  id: {
    pattern: /^[A-Za-z0-9_-]{11}$/;
    unique: true;
  };
  participants: {
    maxSize: 20;
    minSize: 0;
  };
  lastActivity: {
    maxAge: 3600000; // 1 hour in ms
  };
}
```

#### State Transitions

```
[Created] → [Active] → [Revealed] → [Cleared] → [Active]
                ↓
            [Expired] (after 1h inactivity)
```

#### Lifecycle

- **Creation**: Facilitator creates session, receives unique URL
- **Active**: Participants join, cast votes
- **Revealed**: Facilitator triggers reveal, votes become visible
- **Cleared**: Facilitator clears votes, returns to Active state
- **Expired**: No activity for 1 hour, session removed from memory

#### Example

```typescript
const session: Session = {
  id: "V1StGXR8_Z5",
  facilitatorId: "socket-abc123",
  participants: new Map([
    [
      "socket-abc123",
      {
        /* Participant */
      },
    ],
    [
      "socket-def456",
      {
        /* Participant */
      },
    ],
  ]),
  votes: new Map([
    ["socket-abc123", { participantId: "socket-abc123", value: 5 }],
  ]),
  isRevealed: false,
  createdAt: new Date("2025-12-31T10:00:00Z"),
  lastActivity: new Date("2025-12-31T10:05:00Z"),
};
```

---

### 2. Participant

Represents a person in the estimation session.

#### Properties

| Property        | Type      | Required | Constraints           | Description                 |
| --------------- | --------- | -------- | --------------------- | --------------------------- |
| `id`            | `string`  | Yes      | Socket ID             | Unique within session       |
| `displayName`   | `string`  | Yes      | 1-50 chars, sanitized | User-provided name          |
| `isFacilitator` | `boolean` | Yes      | -                     | Has control privileges      |
| `hasVoted`      | `boolean` | Yes      | -                     | Cast vote for current round |
| `connectedAt`   | `Date`    | Yes      | -                     | Join timestamp              |
| `lastSeen`      | `Date`    | Yes      | -                     | Last activity timestamp     |

#### Validation Rules

```typescript
interface ParticipantValidation {
  displayName: {
    minLength: 1;
    maxLength: 50;
    pattern: /^[\p{L}\p{N}\s\-_'.]+$/u; // Unicode letters, numbers, spaces, basic punctuation
    sanitize: true; // Remove HTML tags
  };
  lastSeen: {
    maxAge: 30000; // 30 seconds before disconnect
  };
}
```

#### Display Name Handling

**Duplicate Names**: System appends number suffix

- "John" → "John (2)" → "John (3)"
- Logic: Check existing names, append next available number

**Sanitization**: Remove HTML/script tags, trim whitespace

#### Example

```typescript
const participant: Participant = {
  id: "socket-abc123",
  displayName: "Alice Smith",
  isFacilitator: true,
  hasVoted: true,
  connectedAt: new Date("2025-12-31T10:00:00Z"),
  lastSeen: new Date("2025-12-31T10:05:00Z"),
};
```

---

### 3. Vote

Represents a single estimate for the current item.

#### Properties

| Property        | Type     | Required | Constraints                  | Description       |
| --------------- | -------- | -------- | ---------------------------- | ----------------- |
| `participantId` | `string` | Yes      | Socket ID                    | Voter identifier  |
| `value`         | `number` | Yes      | Fibonacci: 0,1,2,3,5,8,13,21 | Selected estimate |
| `submittedAt`   | `Date`   | Yes      | -                            | Vote timestamp    |

#### Validation Rules

```typescript
interface VoteValidation {
  value: {
    allowedValues: [0, 1, 2, 3, 5, 8, 13, 21];
  };
}
```

#### Lifecycle

- **Submission**: Participant selects card, vote stored
- **Change**: Participant can change vote before reveal (replaces previous)
- **Reveal**: Votes become visible to all
- **Clear**: All votes deleted when facilitator starts new round

#### Example

```typescript
const vote: Vote = {
  participantId: "socket-abc123",
  value: 5,
  submittedAt: new Date("2025-12-31T10:03:00Z"),
};
```

---

### 4. VotingDeck

Represents available estimation values (fixed configuration).

#### Properties

| Property | Type       | Required | Constraints | Description        |
| -------- | ---------- | -------- | ----------- | ------------------ |
| `values` | `number[]` | Yes      | Fixed       | Fibonacci sequence |
| `name`   | `string`   | Yes      | -           | Deck identifier    |

#### Example

```typescript
const votingDeck: VotingDeck = {
  name: "Fibonacci",
  values: [0, 1, 2, 3, 5, 8, 13, 21],
};
```

**Note**: VotingDeck is a constant, not stored per session. Only one deck supported in MVP.

---

## Derived Data

### Vote Statistics (Computed)

Not stored, calculated on-demand during reveal.

```typescript
interface VoteStatistics {
  votes: Array<{ participantName: string; value: number }>;
  votedCount: number;
  totalParticipants: number;
  consensus: boolean; // All votes equal
  average: number;
  median: number;
  distribution: Map<number, number>; // value → count
}

function calculateStatistics(session: Session): VoteStatistics {
  const votes = Array.from(session.votes.values());
  const participants = Array.from(session.participants.values());

  return {
    votes: votes.map((v) => ({
      participantName: session.participants.get(v.participantId)!.displayName,
      value: v.value,
    })),
    votedCount: votes.length,
    totalParticipants: participants.length,
    consensus: new Set(votes.map((v) => v.value)).size === 1,
    average: votes.reduce((sum, v) => sum + v.value, 0) / votes.length,
    median: calculateMedian(votes.map((v) => v.value)),
    distribution: votes.reduce((map, v) => {
      map.set(v.value, (map.get(v.value) || 0) + 1);
      return map;
    }, new Map()),
  };
}
```

---

## Server-Side Storage Structure

### In-Memory Store

```typescript
// server/websocket/session-store.ts

class SessionStore {
  private sessions: Map<string, SessionData>;
  private cleanupInterval: NodeJS.Timer;

  constructor() {
    this.sessions = new Map();
    this.startCleanupJob();
  }

  createSession(facilitatorSocketId: string): string {
    const id = nanoid(11);
    const now = new Date();

    this.sessions.set(id, {
      id,
      facilitatorId: facilitatorSocketId,
      participants: new Map(),
      votes: new Map(),
      isRevealed: false,
      createdAt: now,
      lastActivity: now,
    });

    return id;
  }

  getSession(id: string): SessionData | undefined {
    return this.sessions.get(id);
  }

  updateLastActivity(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
    }
  }

  private startCleanupJob(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const oneHour = 3600000;

      for (const [id, session] of this.sessions.entries()) {
        if (now - session.lastActivity.getTime() > oneHour) {
          this.sessions.delete(id);
          // Emit sessionExpired event to connected clients
        }
      }
    }, 300000); // Check every 5 minutes
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.sessions.clear();
  }
}

export const sessionStore = new SessionStore();
```

---

## Client-Side State Structure

### NGRX SignalStore Schema

```typescript
// features/session/session.store.ts

interface SessionState {
  // Session info
  sessionId: string | null;
  sessionUrl: string | null;

  // Current user
  currentUser: {
    id: string;
    displayName: string;
    isFacilitator: boolean;
  } | null;

  // Participants
  participants: Participant[];

  // Voting state
  currentVote: number | null;
  votes: Map<string, number>; // participantId → value
  isRevealed: boolean;

  // Statistics (only populated after reveal)
  voteStats: VoteStatistics | null;

  // Connection state
  isConnected: boolean;
  isJoining: boolean;
  error: string | null;
}

export const SessionStore = signalStore(
  { providedIn: "root" },
  withState<SessionState>({
    sessionId: null,
    sessionUrl: null,
    currentUser: null,
    participants: [],
    currentVote: null,
    votes: new Map(),
    isRevealed: false,
    voteStats: null,
    isConnected: false,
    isJoining: false,
    error: null,
  }),
  withMethods(/* ... */)
);
```

---

## Validation Utilities

### Session ID Validator

```typescript
// shared/utils/validators.ts

export function isValidSessionId(id: string): boolean {
  return /^[A-Za-z0-9_-]{11}$/.test(id);
}
```

### Display Name Sanitizer

```typescript
export function sanitizeDisplayName(name: string): string {
  // Trim whitespace
  let cleaned = name.trim();

  // Limit length
  cleaned = cleaned.substring(0, 50);

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, "");

  // Validate pattern
  if (!/^[\p{L}\p{N}\s\-_'.]+$/u.test(cleaned)) {
    throw new Error("Invalid display name characters");
  }

  return cleaned || "Guest";
}
```

### Vote Value Validator

```typescript
const ALLOWED_VOTES = [0, 1, 2, 3, 5, 8, 13, 21];

export function isValidVote(value: number): boolean {
  return ALLOWED_VOTES.includes(value);
}
```

---

## Memory Management

### Capacity Limits

| Resource                            | Limit      | Enforcement                                            |
| ----------------------------------- | ---------- | ------------------------------------------------------ |
| Total sessions                      | 100        | Server rejects new session creation when limit reached |
| Participants per session            | 20         | Server rejects join attempts when session at capacity  |
| Session lifetime                    | 1 hour     | Automatic cleanup job removes expired sessions         |
| Participant disconnect grace period | 30 seconds | Remove from session if no activity within 30s          |

### Memory Footprint Estimation

Per session (20 participants):

- Session object: ~500 bytes
- 20 Participants: ~2KB (100 bytes each)
- 20 Votes: ~400 bytes (20 bytes each)
- **Total per session**: ~3KB

Max capacity (100 sessions): **~300KB** (negligible for Node.js)

---

## Type Definitions Export

All types exported from central location:

```typescript
// domain/models/index.ts

export interface Session {
  /* ... */
}
export interface Participant {
  /* ... */
}
export interface Vote {
  /* ... */
}
export interface VotingDeck {
  /* ... */
}
export interface VoteStatistics {
  /* ... */
}

export const FIBONACCI_DECK: VotingDeck = {
  name: "Fibonacci",
  values: [0, 1, 2, 3, 5, 8, 13, 21],
};
```

This ensures consistency between client and server type definitions.
