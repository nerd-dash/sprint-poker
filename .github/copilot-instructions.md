You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Architecture Overview

This is a real-time Planning Poker application with **unified frontend/backend** architecture:

- **Angular 21 SSR** application (single project, not separate frontend/backend)
- **Socket.IO WebSocket** integration on SSR server ([src/server.ts](src/server.ts))
- **In-memory only** storage (no database, no persistence) - privacy by design
- **NGRX SignalStore** for client state management ([src/app/features/session/session.store.ts](src/app/features/session/session.store.ts))

Key files:

- [src/server.ts](src/server.ts): Express + Socket.IO server setup with Angular SSR
- [src/server/websocket/socket-handler.ts](src/server/websocket/socket-handler.ts): WebSocket event handlers
- [src/server/websocket/session-store.ts](src/server/websocket/session-store.ts): In-memory session state (Map-based)
- [src/app/core/services/websocket.service.ts](src/app/core/services/websocket.service.ts): Client WebSocket wrapper
- [specs/001-poker-session-app/contracts/websocket-events.md](specs/001-poker-session-app/contracts/websocket-events.md): WebSocket API contract

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use **NGRX SignalStore** (`signalStore`, `withState`, `withMethods`, `patchState`) for feature stores
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead
- Example pattern: [src/app/features/session/session.store.ts](src/app/features/session/session.store.ts)

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## WebSocket Patterns

- Client: Use [WebSocketService](src/app/core/services/websocket.service.ts) wrapper around socket.io-client
- Server: Handlers in [socket-handler.ts](src/server/websocket/socket-handler.ts) emit to rooms and use acknowledgments
- All WebSocket events defined in [websocket-events.md](specs/001-poker-session-app/contracts/websocket-events.md)
- Server-side session state in `sessionStore` (Map-based, in-memory only)
- Use `socket.join(sessionId)` for room-based broadcasting
- Always use acknowledgment callbacks for client→server events

## Validation & Sanitization

- Domain validators in [src/app/domain/validators/session-validators.ts](src/app/domain/validators/session-validators.ts)
- Sanitization utilities in [src/app/shared/utils/sanitization.utils.ts](src/app/shared/utils/sanitization.utils.ts)
- Always validate on **both** client and server
- Allowed votes: Fibonacci sequence `[0, 1, 2, 3, 5, 8, 13, 21]`

## Testing

- **Unit tests**: Angular test runner (Vitest-backed) - run with `npm test` (do NOT use watch mode)
- **Integration tests**: Vitest + real Socket.IO server in [tests/integration/](tests/integration/)
- **E2E tests**: Playwright (Chrome-only) in [tests/e2e/](tests/e2e/)
- TDD mandatory: Write tests before implementation
- Max cyclomatic complexity: 5 per function

## Privacy Guardrails (NON-NEGOTIABLE)

- **Zero persistence**: No database, no file writes, no logs containing user data
- Do NOT log: socket IDs, session IDs, display names, votes, or any identifiable data
- Session data exists only in `sessionStore` Map (cleared on timeout/disconnect)
- Comment violations with `// Privacy guardrail: ...`

## Performance Requirements

- Initial page load < 2s on 3G
- WebSocket latency < 500ms
- Client bundle < 500KB gzipped
- Support 20 concurrent participants per session

## Development Workflow

- Run dev server: `npm start` (Angular SSR + Socket.IO on port 4200)
- Build: `npm run build` (outputs to `dist/sprint-poker-app/`)
- E2E: `npm run e2e`
- All specs/plans in [specs/001-poker-session-app/](specs/001-poker-session-app/)
- Feature branches: `001-poker-session-app` or similar numbered format
