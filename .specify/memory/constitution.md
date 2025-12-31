# Sprint Poker Constitution

## Product Context

Sprint Poker is a lightweight web application for Scrum team estimation meetings using the Planning Poker technique. The Scrum Master facilitates sessions where team members estimate work items collaboratively through simultaneous, concealed voting with no persistent storage of user data or session history.

## Core Principles

### I. Privacy by Design (NON-NEGOTIABLE)

All development must ensure zero persistence of user data:

- No PII, estimation data, or session metadata may be written to persistent storage (databases, logs, files, or third-party services)
- Session state exists only in memory for active sessions and must be discarded on session end or timeout
- No tracking, advertising, or analytics scripts permitted
- Code reviews must explicitly verify no unintended data persistence paths

**Rationale**: Privacy is a core product differentiator and user trust requirement for Planning Poker sessions.

### II. Code Quality Standards

All code must meet these quality requirements:

- Clear, self-documenting naming conventions for variables, functions, and components
- Single Responsibility Principle: each module/component has one well-defined purpose
- DRY (Don't Repeat Yourself): extract reusable logic into shared utilities or services
- Maximum function/method complexity limit: 5 cyclomatic complexity
- Type safety enforced (use TypeScript, type hints, or equivalent in chosen stack)
- Code must be reviewed for readability before merging

**Rationale**: High code quality enables maintainability and cross-framework learning opportunities.

### III. Testing Requirements (NON-NEGOTIABLE)

Test-Driven Development (TDD) is mandatory for all features:

- Tests must be written BEFORE implementation (Red-Green-Refactor cycle strictly enforced)
- Unit tests required for all business logic and data transformations (minimum 80% coverage)
- Integration tests required for real-time communication and session management
- Component/UI tests required for interactive voting and reveal functionality
- All tests must pass before code can be merged
- Mocking external dependencies (network, timers) is required for test reliability

**Rationale**: Comprehensive testing ensures reliability and enables confident refactoring across different technology implementations.

### IV. User Experience Consistency

All user interactions must follow these principles:

- Maximum 3 clicks/taps to reach any core action (join, vote, reveal, clear)
- Visual feedback required for all user actions within 100ms (loading states, confirmations)
- Responsive design required: mobile-first approach, functional on screens 320px and wider
- Accessibility required: WCAG 2.1 AA compliance (keyboard navigation, screen reader support, sufficient color contrast)
- Error messages must be clear, actionable, and user-friendly (no technical jargon)
- Consistent UI patterns across all screens (button styles, spacing, typography)

**Rationale**: Planning Poker sessions need quick, intuitive interactions to maintain meeting flow and include all participants.

### V. Performance Standards

Application must meet these performance requirements:

- Initial page load: < 2 seconds on 3G connection
- Real-time update latency: < 500ms from action to all connected clients
- Session capacity: support maximum 20 concurrent participants per session
- Memory management: automatic cleanup of inactive sessions within 1 hour
- Bundle size: keep client-side assets < 500KB (gzipped)
- No memory leaks: monitor and test for memory growth during extended sessions

**Rationale**: Performance directly impacts meeting efficiency and user satisfaction during live estimation sessions.

### VI. Simplicity and Maintainability

Development must prioritize simplicity:

- YAGNI (You Aren't Gonna Need It): implement only current requirements, avoid speculative features
- Minimal dependencies: evaluate and justify each external library or package added
- Framework-agnostic domain logic: business rules isolated from UI framework code
- Clear separation of concerns: presentation, business logic, and data layers distinct
- Documentation required for non-obvious design decisions and complex algorithms
- Prefer standard patterns over clever solutions

**Rationale**: Simplicity enables learning, framework portability, and long-term maintainability.

### VII. Incremental Development and Code Review

All development must follow incremental practices:

- Create small, focused commits during implementation (maximum 20 files or 2000 lines per commit, excluding markdown and mocks)
- When a feature or feature part is complete, create pull requests for review
- Pull requests must be reviewed and approved before merging
- Commits should represent logical units of work with clear, descriptive messages
- Feature branches should be used for development work

**Rationale**: Incremental development enables better code review, reduces merge conflicts, and maintains code quality through regular feedback.

## Development Workflow

- All changes must pass automated tests before merge
- Code reviews must verify compliance with principles I-VII
- Breaking changes to session behavior require explicit justification
- Performance regressions (>10% slower) must be explained and approved

## Governance

This constitution supersedes all other development practices. Amendments require:

1. Clear rationale for the change
2. Impact assessment on existing code
3. Version increment following semantic versioning
4. Update to related templates and documentation

**Version**: 1.1.0 | **Ratified**: 2025-12-31 | **Last Amended**: 2025-12-31
