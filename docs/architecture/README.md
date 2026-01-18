# Architecture Guide

## Folder Structure

```
src/
├── models/                ← Shared interfaces & types
├── utils/                 ← Shared utility functions
├── app/                   ← Client-side Angular application
│   ├── core/
│   │   ├── services/      ← Singleton services (WebSocket, Auth)
│   │   └── guards/        ← Route guards
│   ├── features/          ← Feature modules
│   │   ├── session/       ← Session management feature
│   │   └── home/          ← Home/landing feature
│   └── shared/            ← App-specific reusable code
│       ├── components/    ← Shared UI components
│       ├── directives/    ← Custom directives
│       └── pipes/         ← Custom pipes
└── server/                ← Server-side Node.js
    ├── core/              ← Server services
    ├── features/          ← Server features
    └── shared/            ← Server-specific utilities
```

## Layer Responsibilities

### models/ (Types Only)

- **Purpose**: Define shared TypeScript interfaces and types
- **No Code**: Only type definitions
- **Used By**: Both app and server
- **Examples**: `Session`, `Vote`, `User`, API contracts

### utils/

- **Purpose**: Pure utility functions, validators, helpers
- **No State**: No side effects, pure functions
- **Used By**: Both app and server
- **Examples**: Sanitization, validation logic, formatters

### app/shared

- **Purpose**: Angular-specific reusable components and utilities
- **Scope**: Client-side only (Angular pipes, directives, components)
- **Used By**: app/core and app/features
- **Examples**: Shared buttons, form validators, pipes

### app/core

- **Purpose**: Singleton services and application-wide logic
- **No Components**: Services, guards, state only
- **Used By**: app/features
- **Examples**: WebSocketService, SessionStore, AuthGuard

### app/features

- **Purpose**: Feature-specific components and logic
- **Isolation**: Features can't import from each other
- **Examples**: SessionComponent, HomeComponent, VotingPanel

### server/shared

- **Purpose**: Server-specific utilities and helpers
- **Used By**: server/core and server/features

### server/core

- **Purpose**: Server services and middleware
- **Used By**: server/features

### server/features

- **Purpose**: Server-side features (websocket handlers, routes)

## ESLint Boundaries

All boundaries are **automatically enforced by ESLint**. Invalid imports will fail lint checks.

### Allowed Dependency Flow

```
models → utils
  ↓
app/shared ← utils, models
  ↓
app/core ← app/shared, utils, models
  ↓
app/features ← all of above
```

```
models → utils
  ↓
server/shared ← utils, models
  ↓
server/core ← server/shared, utils, models
  ↓
server/features ← all of above
```

### Anti-Patterns (Will Fail Lint)

❌ **Feature importing from another feature**

```ts
// ❌ BAD - in src/app/features/session/component.ts
import { HomeComponent } from '@app/features/home/component';
```

❌ **Core importing from features**

```ts
// ❌ BAD - in src/app/core/services/service.ts
import { SessionStore } from '@app/features/session/store';
```

❌ **Shared importing from core**

```ts
// ❌ BAD - in src/app/shared/components/button.ts
import { WebSocketService } from '@app/core/services/websocket.service';
```

## Path Aliases

Configure `tsconfig.json` for clean imports:

```json
{
  "compilerOptions": {
    "paths": {
      "@models/*": ["src/models/*"],
      "@utils/*": ["src/utils/*"],
      "@app/*": ["src/app/*"],
      "@server/*": ["src/server/*"]
    }
  }
}
```

### Import Examples

```ts
// ✅ GOOD - explicit path aliases
import { SessionModel } from '@models/session.model';
import { sanitizeName } from '@utils/sanitization.utils';
import { WebSocketService } from '@app/core/services/websocket.service';
import { SessionStore } from '@app/features/session/session.store';

// ❌ AVOID - relative paths that blur boundaries
import { SessionModel } from '../../../models/session.model';
```

## Decision Log

| Decision                            | Reason                                                 |
| ----------------------------------- | ------------------------------------------------------ |
| Shared models/utils at src level    | Both app & server need types and utility functions     |
| Separate app/shared & server/shared | Angular components can't be imported by server         |
| No feature imports between features | Enforces modularity and prevents circular dependencies |
| ESLint boundaries mandatory         | Automated enforcement of architecture                  |
| TypeScript strict mode              | Catch errors at compile time                           |
