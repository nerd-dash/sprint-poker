# Development Guides

Step-by-step guides for common development tasks.

## Available Guides

- **[TypeScript & Angular Standards](./typescript-angular.md)** - Coding standards and best practices
- **[Getting Started](./getting-started.md)** - First time setup
- **[Testing Guide](./testing.md)** - How to write tests
- **[WebSocket Guide](./websocket.md)** - WebSocket patterns and examples
- **[Deployment](./deployment.md)** - Building and deploying the app

## Quick Reference

### Setup

```bash
npm install
npm start
```

### Development

```bash
npm test       # Unit & integration tests
npm run lint   # Check code quality
npm run e2e    # E2E tests with Playwright
```

### Build

```bash
npm run build
```

### Check File Locations

- **Angular app**: `src/app/`
- **Server logic**: `src/server/`
- **Shared types/utils**: `src/models/`, `src/utils/`
- **Documentation**: `docs/`
- **Tests**: `*.spec.ts` files, `tests/e2e/`, `tests/integration/`
