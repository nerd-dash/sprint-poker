# Sprint Poker

A lightweight, real-time web application for Scrum team estimation meetings using the Planning Poker technique. Built with Angular SSR and Socket.IO for optimal performance and privacy.

## 🎯 Overview

Sprint Poker enables Scrum teams to conduct efficient estimation sessions where:

- **Facilitators** create sessions and invite participants via shareable URLs
- **Participants** join sessions and submit estimates privately
- **Real-time voting** with simultaneous reveal to avoid anchoring bias
- **Zero persistence** - all data exists only in memory during active sessions

## ✨ Features

### Core Functionality

- **Session Creation**: Generate unique session URLs for team estimation
- **Participant Joining**: Join sessions via shared links with display name
- **Concealed Voting**: Private voting using Fibonacci sequence (0, 1, 2, 3, 5, 8, 13, 21)
- **Simultaneous Reveal**: All votes revealed at once to prevent influence
- **Session Management**: Clear votes, manage participants, automatic cleanup

### Technical Features

- **Real-time Communication**: WebSocket-based updates with <500ms latency
- **Mobile Responsive**: Works on all devices (320px+ screens)
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Performance Optimized**: <2s initial load, <500KB bundle size
- **Privacy First**: No data persistence, in-memory only storage

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nerd-dash/sprint-poker.git
cd sprint-poker
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm start
```

4. Open your browser to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Angular 21 (latest) with SSR, TypeScript, Angular Material
- **Backend**: Node.js with Express + Socket.IO (unified SSR server)
- **State Management**: NGRX SignalStore (modern Angular signals)
- **Testing**: Angular test runner (Vitest-backed) for unit tests, Playwright (Chrome-only) for E2E
- **Styling**: SCSS with custom design system

### Project Structure

```
src/
├── app/
│   ├── core/           # Singleton services and guards
│   ├── domain/         # Business logic models and validators
│   ├── features/       # Feature-specific components
│   └── shared/         # Reusable components and utilities
├── server/             # WebSocket handlers and middleware
└── environments/       # Configuration files
```

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### End-to-End Tests

```bash
npm run e2e
```

### Test Coverage

- Unit tests: 80%+ coverage required
- Integration tests for WebSocket flows
- E2E tests for critical user journeys

## 📋 Development Workflow

This project follows strict development principles:

### Constitution Principles

1. **Privacy by Design**: Zero persistent storage
2. **Code Quality**: Max complexity 5, TypeScript strict mode
3. **TDD Mandatory**: Tests before implementation
4. **UX Consistency**: 3-click max, 100ms feedback, WCAG AA
5. **Performance**: <2s load, <500ms latency
6. **Simplicity**: YAGNI, minimal dependencies
7. **Incremental Development**: Small commits, feature branches, PR reviews

### Branching Strategy

- `main`: Production-ready code
- `feature/TXXX-description`: Feature branches for each task
- Create PRs when features are complete (max 20 files or 2000 lines)

### Commit Guidelines

- Small, focused commits (max 20 files or 2000 lines)
- Clear, descriptive commit messages
- Logical units of work

## 📚 Documentation

Complete project documentation is available in `specs/001-poker-session-app/`:

- `spec.md`: Feature specifications and user stories
- `plan.md`: Implementation plan and architecture decisions
- `data-model.md`: Domain models and validation rules
- `contracts/`: WebSocket event specifications
- `tasks.md`: Development task breakdown
- `checklists/`: Quality validation checklists

## 🤝 Contributing

1. Create a feature branch for your task
2. Write tests first (TDD)
3. Implement with small commits
4. Create PR when feature is complete
5. Ensure all tests pass and constitution principles are followed

## 📄 License

This project is part of the Spec Kit methodology demonstration.

## 🙏 Acknowledgments

Built following the Spec Kit approach for specification-driven development with comprehensive documentation and quality validation.
