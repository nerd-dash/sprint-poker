# Sprint Poker App - Development Documentation

Welcome to the Sprint Poker development guide. This documentation outlines best practices, architecture decisions, and coding standards for this project.

## Quick Links

- **[Architecture Guide](./architecture/README.md)** - Folder structure, boundaries, and layer responsibilities
- **[Code Patterns](./patterns/README.md)** - Common patterns for components, services, state management
- **[Development Guides](./guides/README.md)** - Step-by-step guides for common tasks
- **[TypeScript/Angular Standards](./guides/typescript-angular.md)** - Language and framework best practices

## Key Principles

1. **Layered Architecture** - Clear separation of concerns (models → utils → app/server layers)
2. **Type Safety** - Strict TypeScript with minimal `any` usage
3. **Accessibility First** - All code must pass AXE checks and meet WCAG AA standards
4. **Zero Persistence** - Privacy by design, no user data stored
5. **Test-Driven Development** - Tests written before implementation

## Project Tech Stack

- **Angular 21** with standalone components
- **NGRX SignalStore** for state management
- **Socket.IO** for real-time WebSocket communication
- **Express** for SSR server
- **TypeScript 5.9** strict mode
- **Vitest + Playwright** for testing

## Getting Started

```bash
npm install
npm start          # Dev server on port 4200
npm test           # Run tests
npm run e2e        # Playwright e2e tests
npm run lint       # ESLint with boundary checks
```

## Before You Code

1. Read [Architecture Guide](./architecture/README.md)
2. Check [Code Patterns](./patterns/README.md) for your use case
3. Follow ESLint boundaries (they're enforced automatically)
4. Write tests first (TDD approach)
