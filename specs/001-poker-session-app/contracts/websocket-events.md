# WebSocket API Contracts

**Feature**: Planning Poker Session Application  
**Date**: 2025-12-31  
**Phase**: 1 - Design  
**Protocol**: Socket.IO v4.x

## Overview

This document defines all WebSocket events (client→server and server→client) for real-time session communication. Events use Socket.IO's event-based messaging with JSON payloads.

## Connection

### Client Connects

```typescript
// Client initiates connection
import { io } from 'socket.io-client';

const socket = io('http://localhost:4200', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

socket.on('connect', () => {
  // Connected. Privacy guardrail: do not log socket IDs, session IDs, display names, or votes.
});
```

### Server Acknowledges

Server automatically assigns socket ID. No custom handshake required.

---

## Client → Server Events

### 1. Create Session

**Event**: `createSession`

**Description**: Facilitator creates a new estimation session

**Payload**:

```typescript
interface CreateSessionRequest {
  facilitatorName: string; // Display name of facilitator
}
```

**Response** (acknowledgment):

```typescript
interface CreateSessionResponse {
  success: boolean;
  sessionId?: string;
  sessionUrl?: string;
  error?: string;
}
```

**Validation**:

- `facilitatorName`: 1-50 characters, sanitized

**Example**:

```typescript
socket.emit('createSession', { facilitatorName: 'Alice' }, (response: CreateSessionResponse) => {
  if (response.success) {
    // Handle success (e.g., navigate to response.sessionUrl). Avoid logging session IDs.
  }
});
```

---

### 2. Join Session

**Event**: `joinSession`

**Description**: Participant joins an existing session

**Payload**:

```typescript
interface JoinSessionRequest {
  sessionId: string;
  displayName: string;
}
```

**Response** (acknowledgment):

```typescript
interface JoinSessionResponse {
  success: boolean;
  participant?: {
    id: string;
    displayName: string;
    isFacilitator: boolean;
  };
  session?: {
    id: string;
    participants: Array<{
      id: string;
      displayName: string;
      isFacilitator: boolean;
      hasVoted: boolean;
    }>;
    isRevealed: boolean;
    votes?: Map<string, number>; // Only if isRevealed
  };
  error?: string;
}
```

**Validation**:

- `sessionId`: 11 characters, matches pattern
- `displayName`: 1-50 characters, sanitized
- Session exists and has capacity < 20

**Error Cases**:

- Session not found: `{ success: false, error: 'Session not found' }`
- Session full: `{ success: false, error: 'Session at capacity (20 participants)' }`
- Invalid name: `{ success: false, error: 'Invalid display name' }`

**Example**:

```typescript
socket.emit(
  'joinSession',
  { sessionId: 'V1StGXR8_Z5', displayName: 'Bob' },
  (response: JoinSessionResponse) => {
    if (response.success) {
      // Handle success (e.g., render participant list). Avoid logging participant/session identifiers.
    }
  }
);
```

---

### 3. Submit Vote

**Event**: `submitVote`

**Description**: Participant casts or changes their vote

**Payload**:

```typescript
interface SubmitVoteRequest {
  sessionId: string;
  value: number; // Must be in [0, 1, 2, 3, 5, 8, 13, 21]
}
```

**Response** (acknowledgment):

```typescript
interface SubmitVoteResponse {
  success: boolean;
  error?: string;
}
```

**Validation**:

- `value`: Must be Fibonacci number in allowed set
- Participant must be in session
- Session must not be revealed (cannot vote after reveal)

**Error Cases**:

- Invalid value: `{ success: false, error: 'Invalid vote value' }`
- Already revealed: `{ success: false, error: 'Cannot vote after reveal' }`

**Example**:

```typescript
socket.emit(
  'submitVote',
  { sessionId: 'V1StGXR8_Z5', value: 5 },
  (response: SubmitVoteResponse) => {
    if (response.success) {
      // Update UI state.
    }
  }
);
```

---

### 4. Reveal Votes

**Event**: `revealVotes`

**Description**: Facilitator reveals all votes (only facilitator can trigger)

**Payload**:

```typescript
interface RevealVotesRequest {
  sessionId: string;
  force?: boolean; // If true, reveal even with incomplete votes
}
```

**Response** (acknowledgment):

```typescript
interface RevealVotesResponse {
  success: boolean;
  warning?: string; // e.g., "3 participants haven't voted"
  error?: string;
}
```

**Validation**:

- Only facilitator can reveal
- If not all voted and `force` is false, return warning

**Example**:

```typescript
socket.emit(
  'revealVotes',
  { sessionId: 'V1StGXR8_Z5', force: true },
  (response: RevealVotesResponse) => {
    if (response.success) {
      // Update UI state.
    }
  }
);
```

---

### 5. Clear Votes

**Event**: `clearVotes`

**Description**: Facilitator clears all votes to start new round (only facilitator can trigger)

**Payload**:

```typescript
interface ClearVotesRequest {
  sessionId: string;
}
```

**Response** (acknowledgment):

```typescript
interface ClearVotesResponse {
  success: boolean;
  error?: string;
}
```

**Validation**:

- Only facilitator can clear
- Typically called after votes are revealed

**Example**:

```typescript
socket.emit('clearVotes', { sessionId: 'V1StGXR8_Z5' }, (response: ClearVotesResponse) => {
  if (response.success) {
    console.log('Votes cleared');
  }
});
```

---

### 6. Connection Tracking (Automatic)

**Implementation**: Socket.IO Built-in Ping/Pong

**Description**: Socket.IO automatically manages connection health

**Configuration**:

- Server sends ping every 25 seconds
- Client responds with pong automatically
- If no pong received within 30 seconds, connection marked as disconnected

**Client**: No action required - Socket.IO client handles pong responses automatically

**Server Configuration**:

```typescript
const io = new Server(server, {
  pingTimeout: 30000, // 30s wait for pong
  pingInterval: 25000, // 25s between pings
});
```

**Last Activity Tracking**: Update participant `lastSeen` timestamp on any event (join, vote, reveal, clear)

---

## Server → Client Events

### 1. Participant Joined

**Event**: `participantJoined`

**Description**: Broadcast when a new participant joins the session

**Payload**:

```typescript
interface ParticipantJoinedEvent {
  participant: {
    id: string;
    displayName: string;
    isFacilitator: boolean;
    hasVoted: boolean;
  };
  totalParticipants: number;
}
```

**Recipients**: All participants in the session (including the new one)

**Example**:

```typescript
socket.on('participantJoined', (data: ParticipantJoinedEvent) => {
  console.log(`${data.participant.displayName} joined`);
  // Update participant list in UI
});
```

---

### 2. Participant Left

**Event**: `participantLeft`

**Description**: Broadcast when a participant disconnects or is removed

**Payload**:

```typescript
interface ParticipantLeftEvent {
  participantId: string;
  displayName: string;
  reason: 'disconnect' | 'timeout';
  totalParticipants: number;
}
```

**Recipients**: All remaining participants in the session

**Example**:

```typescript
socket.on('participantLeft', (data: ParticipantLeftEvent) => {
  console.log(`${data.displayName} left (${data.reason})`);
  // Remove from participant list in UI
});
```

---

### 3. Vote Submitted

**Event**: `voteSubmitted`

**Description**: Broadcast when any participant submits/changes their vote

**Payload**:

```typescript
interface VoteSubmittedEvent {
  participantId: string;
  hasVoted: boolean; // Always true for this event
  votedCount: number;
  totalParticipants: number;
}
```

**Recipients**: All participants in the session

**Note**: Vote value is NOT included (concealed until reveal)

**Example**:

```typescript
socket.on('voteSubmitted', (data: VoteSubmittedEvent) => {
  console.log(`${data.votedCount}/${data.totalParticipants} voted`);
  // Update participant list to show checkmark
});
```

---

### 4. Votes Revealed

**Event**: `votesRevealed`

**Description**: Broadcast when facilitator reveals votes

**Payload**:

```typescript
interface VotesRevealedEvent {
  votes: Array<{
    participantId: string;
    displayName: string;
    value: number | null; // null if didn't vote
  }>;
  statistics: {
    votedCount: number;
    totalParticipants: number;
    consensus: boolean;
    average: number;
    median: number;
    distribution: Record<number, number>; // value → count
  };
}
```

**Recipients**: All participants in the session

**Example**:

```typescript
socket.on('votesRevealed', (data: VotesRevealedEvent) => {
  console.log('Votes:', data.votes);
  console.log('Average:', data.statistics.average);
  // Display results in UI
});
```

---

### 5. Votes Cleared

**Event**: `votesCleared`

**Description**: Broadcast when facilitator clears votes for new round

**Payload**:

```typescript
interface VotesClearedEvent {
  clearedAt: number; // Timestamp
}
```

**Recipients**: All participants in the session

**Example**:

```typescript
socket.on('votesCleared', (data: VotesClearedEvent) => {
  console.log('Starting new round');
  // Reset voting UI, clear results
});
```

---

### 6. Session Expired

**Event**: `sessionExpired`

**Description**: Sent when session is removed due to 1-hour inactivity timeout

**Payload**:

```typescript
interface SessionExpiredEvent {
  sessionId: string;
  reason: 'inactivity';
  message: string;
}
```

**Recipients**: All participants still connected to the session

**Example**:

```typescript
socket.on('sessionExpired', (data: SessionExpiredEvent) => {
  console.log('Session expired:', data.message);
  // Redirect to home page with notification
});
```

---

### 7. Error

**Event**: `error`

**Description**: Server sends error for invalid operations

**Payload**:

```typescript
interface ErrorEvent {
  code: string;
  message: string;
  details?: any;
}
```

**Error Codes**:

- `SESSION_NOT_FOUND`: Session doesn't exist
- `SESSION_FULL`: Capacity reached
- `INVALID_NAME`: Display name validation failed
- `INVALID_VOTE`: Vote value not in allowed set
- `PERMISSION_DENIED`: Non-facilitator tried facilitator action
- `ALREADY_REVEALED`: Tried to vote after reveal

**Example**:

```typescript
socket.on('error', (data: ErrorEvent) => {
  console.error(`Error ${data.code}:`, data.message);
  // Show error notification in UI
});
```

---

## Socket.IO Rooms

Sessions use Socket.IO rooms for efficient broadcasting:

```typescript
// Server joins participant to session room
socket.join(`session:${sessionId}`);

// Broadcast to all in session
io.to(`session:${sessionId}`).emit('votesRevealed', data);

// Broadcast to all except sender
socket.to(`session:${sessionId}`).emit('participantJoined', data);
```

---

## Connection States

### Client Connection Lifecycle

```typescript
socket.on('connect', () => {
  // Connected, can now emit events
  console.log('Connected');
});

socket.on('disconnect', (reason) => {
  // Disconnected (network, server restart, etc.)
  console.log('Disconnected:', reason);

  if (reason === 'io server disconnect') {
    // Server forced disconnect (kicked)
    // Do not reconnect automatically
  } else {
    // Temporary disconnect, will auto-reconnect
    showReconnectingIndicator();
  }
});

socket.on('reconnect', (attemptNumber) => {
  // Successfully reconnected
  console.log('Reconnected after', attemptNumber, 'attempts');

  // Re-join session if was in one
  if (currentSessionId) {
    socket.emit('joinSession', {
      sessionId: currentSessionId,
      displayName: currentUserName,
    });
  }
});

socket.on('reconnect_failed', () => {
  // All reconnection attempts failed
  console.error('Could not reconnect');
  showConnectionErrorMessage();
});
```

---

## Security Considerations

1. **Input Validation**: All payloads validated on server before processing
2. **Sanitization**: Display names sanitized to prevent XSS
3. **Authorization**: Facilitator actions check `isFacilitator` flag
4. **Rate Limiting**: Per-action limits to prevent abuse:
   - Vote submission: 10 per minute per participant
   - Join session: 5 per minute per socket
   - Create session: 3 per minute per socket
   - Reveal/Clear votes: 20 per minute per facilitator
   - Implementation: In-memory Map tracking timestamps per socket+action
5. **Session Verification**: Verify session exists and participant is member before allowing actions

---

## Testing Contracts

### Unit Test Example (Mock Socket)

```typescript
describe('WebSocket Events', () => {
  it('should handle vote submission', (done) => {
    const mockSocket = createMockSocket();

    mockSocket.emit('submitVote', { sessionId: 'test', value: 5 }, (response) => {
      expect(response.success).toBe(true);
      done();
    });

    mockSocket.simulateServerResponse('submitVote', { success: true });
  });
});
```

### Integration Test Example (Real Socket)

```typescript
describe('Session Flow', () => {
  let facilitatorSocket: Socket;
  let participantSocket: Socket;

  beforeAll(async () => {
    facilitatorSocket = io('http://localhost:4200');
    participantSocket = io('http://localhost:4200');
    await Promise.all([waitForConnection(facilitatorSocket), waitForConnection(participantSocket)]);
  });

  it('should create and join session', (done) => {
    facilitatorSocket.emit('createSession', { facilitatorName: 'Alice' }, (response) => {
      expect(response.success).toBe(true);
      const sessionId = response.sessionId!;

      participantSocket.emit('joinSession', { sessionId, displayName: 'Bob' }, (joinResponse) => {
        expect(joinResponse.success).toBe(true);
        done();
      });
    });
  });
});
```

---

## TypeScript Type Definitions

All contracts exported from shared types file:

```typescript
// shared/types/websocket-events.ts

// Client → Server
export interface CreateSessionRequest {
  /* ... */
}
export interface JoinSessionRequest {
  /* ... */
}
export interface SubmitVoteRequest {
  /* ... */
}
export interface RevealVotesRequest {
  /* ... */
}
export interface ClearVotesRequest {
  /* ... */
}

// Server → Client
export interface ParticipantJoinedEvent {
  /* ... */
}
export interface ParticipantLeftEvent {
  /* ... */
}
export interface VoteSubmittedEvent {
  /* ... */
}
export interface VotesRevealedEvent {
  /* ... */
}
export interface VotesClearedEvent {
  /* ... */
}
export interface SessionExpiredEvent {
  /* ... */
}
export interface ErrorEvent {
  /* ... */
}
```

Import on client and server for type safety across the stack.
