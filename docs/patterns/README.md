# Code Patterns

Common patterns used in Sprint Poker development.

## Table of Contents

- [State Management with SignalStore](#state-management-with-signalstore)
- [WebSocket Service Pattern](#websocket-service-pattern)
- [Feature Component Structure](#feature-component-structure)
- [Validation Pattern](#validation-pattern)
- [Form Pattern](#form-pattern)

## State Management with SignalStore

### Basic Store Setup

```ts
// src/app/features/session/session.store.ts
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { Session, Vote } from '@models/session.model';

interface SessionState {
  sessions: Map<string, Session>;
  currentSessionId: string | null;
  isLoading: boolean;
}

const initialState: SessionState = {
  sessions: new Map(),
  currentSessionId: null,
  isLoading: false,
};

export const SessionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setLoading(loading: boolean) {
      patchState(store, { isLoading: loading });
    },

    addSession(session: Session) {
      const sessions = new Map(store.sessions());
      sessions.set(session.id, session);
      patchState(store, { sessions });
    },

    addVote(sessionId: string, vote: Vote) {
      const session = store.sessions().get(sessionId);
      if (!session) return;

      const updated = {
        ...session,
        votes: [...session.votes, vote],
      };

      const sessions = new Map(store.sessions());
      sessions.set(sessionId, updated);
      patchState(store, { sessions });
    },
  })),
  withComputed((store) => ({
    currentSession: computed(() => {
      const id = store.currentSessionId();
      return id ? store.sessions().get(id) : null;
    }),

    sessionCount: computed(() => store.sessions().size),
  })),
);
```

### Using the Store in a Component

```ts
// src/app/features/session/session.component.ts
import { Component, inject } from '@angular/core';
import { SessionStore } from './session.store';

@Component({
  selector: 'app-session',
  template: `
    <div>
      <h1>{{ store.currentSession()?.title }}</h1>
      <p>Participants: {{ store.currentSession()?.participants.length }}</p>
      @if (store.isLoading()) {
        <p>Loading...</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionComponent {
  store = inject(SessionStore);
}
```

## WebSocket Service Pattern

### Service Definition

```ts
// src/app/core/services/websocket.service.ts
import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: Socket | null = null;
  private connected$ = new BehaviorSubject(false);

  connect(): void {
    if (this.socket) return;

    this.socket = io(window.location.origin, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      this.connected$.next(true);
    });

    this.socket.on('disconnect', () => {
      this.connected$.next(false);
    });
  }

  // Emit with acknowledgment
  emit<T = void>(event: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.socket?.emit(event, data, (ack: T) => {
        if (ack) resolve(ack);
        else reject(new Error(`No acknowledgment for ${event}`));
      });
    });
  }

  // Listen for events
  on<T>(event: string): Observable<T> {
    return new Observable((observer) => {
      this.socket?.on(event, (data: T) => {
        observer.next(data);
      });
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  get isConnected(): Observable<boolean> {
    return this.connected$.asObservable();
  }
}
```

### Using WebSocket in a Component

```ts
// src/app/features/session/vote.component.ts
export class VoteComponent {
  private ws = inject(WebSocketService);
  private sessionStore = inject(SessionStore);

  async submitVote(sessionId: string, vote: number) {
    try {
      const result = await this.ws.emit('vote:submit', {
        sessionId,
        vote,
      });

      this.sessionStore.addVote(sessionId, result);
    } catch (error) {
      console.error('Vote submission failed', error);
    }
  }
}
```

## Feature Component Structure

### Recommended File Organization

```
src/app/features/session/
├── components/
│   ├── session-header/
│   │   ├── session-header.component.ts
│   │   └── session-header.component.spec.ts
│   ├── vote-card/
│   │   ├── vote-card.component.ts
│   │   └── vote-card.component.spec.ts
│   └── results/
│       ├── results.component.ts
│       └── results.component.spec.ts
├── session.routes.ts
├── session.store.ts
├── session.store.spec.ts
└── session.component.ts
```

### Feature Routes Pattern

```ts
// src/app/features/session/session.routes.ts
import { Routes } from '@angular/router';
import { SessionComponent } from './session.component';

export const SESSION_ROUTES: Routes = [
  {
    path: ':id',
    component: SessionComponent,
    children: [
      {
        path: 'results',
        loadComponent: () =>
          import('./components/results/results.component').then((m) => m.ResultsComponent),
      },
    ],
  },
];
```

## Validation Pattern

### Shared Validators

```ts
// src/utils/validators/vote.validator.ts
import { Vote } from '@models/vote.model';

const ALLOWED_VOTES: Vote[] = [0, 1, 2, 3, 5, 8, 13, 21];

export function isValidVote(vote: number): boolean {
  return ALLOWED_VOTES.includes(vote);
}

export function validateSessionId(id: string): boolean {
  return id.length > 0 && id.length <= 50;
}
```

### Using Validators in Components

```ts
// src/app/features/session/vote.component.ts
import { isValidVote } from '@utils/validators/vote.validator';

export class VoteComponent {
  submitVote(vote: number): void {
    if (!isValidVote(vote)) {
      console.error('Invalid vote:', vote);
      return;
    }
    // Process vote
  }
}
```

## Form Pattern

### Reactive Forms with Validation

```ts
// src/app/features/session/create-session.component.ts
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-create-session',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input
        formControlName="title"
        placeholder="Session title"
        [attr.aria-label]="'Session title'"
      />

      <button type="submit" [disabled]="!form.valid" [attr.aria-label]="'Create session'">
        Create
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSessionComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });

  onSubmit(): void {
    if (!this.form.valid) return;

    const { title, description } = this.form.value;
    // Dispatch to store or service
  }
}
```
