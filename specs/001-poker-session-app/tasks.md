# Tasks: Planning Poker Session Application

**Input**: Design documents from /specs/001-poker-session-app/
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: INCLUDED. TDD is mandatory per plan.md and spec.md (User Scenarios & Testing). Test tasks appear before implementation tasks in each user story.

**Organization**: Tasks are grouped by user story so each story is independently implementable and testable.

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Align scripts/tooling/docs so subsequent tasks are immediately runnable.

- [ ] T001 Add missing npm scripts for SSR dev and WebSocket integration tests in package.json
- [ ] T002 [P] Verify Angular SSR build/serve configuration uses src/server.ts as SSR entry (angular.json)
- [ ] T003 [P] Ensure TypeScript strict settings apply to app + server code (tsconfig.json, tsconfig.app.json)
- [ ] T004 [P] Enforce cyclomatic complexity max 5 via ESLint rule configuration (\.eslintrc.json)
- [ ] T005 [P] Configure Playwright baseURL and webServer to run against the dev server (playwright.config.ts)
- [ ] T006 [P] Update quickstart commands to match actual scripts and remove references to non-existent scripts (specs/001-poker-session-app/quickstart.md)

**Checkpoint**: Tooling and docs aligned.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared domain models, validation, in-memory session store, and Socket.IO wiring required by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

### Foundation Tests (TDD)

- [ ] T007 [P] Add unit tests for session ID generation/validation (src/app/shared/utils/session-id-generator.spec.ts)
- [ ] T008 [P] Add unit tests for display name sanitization/validation (src/app/shared/utils/sanitization.utils.spec.ts)
- [ ] T009 [P] Add unit tests for domain validators (sessionId, displayName, vote value set) (src/app/domain/validators/session-validators.spec.ts)
- [ ] T010 [P] Add server unit tests for in-memory session store lifecycle (capacity, lastActivity, reveal/clear) (src/server/websocket/session-store.spec.ts)

### Foundation Implementation

- [ ] T011 [P] Define domain models matching data-model.md (src/app/domain/models/session.model.ts, src/app/domain/models/participant.model.ts, src/app/domain/models/vote.model.ts, src/app/domain/models/voting-deck.model.ts)
- [ ] T012 [P] Implement session ID generator/validator using nanoid (src/app/shared/utils/session-id-generator.ts)
- [ ] T013 [P] Implement display name sanitization + validation (length, allowed chars, trimming) (src/app/shared/utils/sanitization.utils.ts)
- [ ] T014 [P] Implement domain validators (sessionId, displayName, vote value set) (src/app/domain/validators/session-validators.ts)

- [ ] T015 Implement in-memory session store with Map<sessionId, Session> and TTL fields (src/server/websocket/session-store.ts)
- [ ] T016 [P] Implement duplicate display name handling (append "(2)", "(3)") (src/server/utils/duplicate-name-handler.ts)
- [ ] T017 [P] Implement session validation middleware/helpers (exists, capacity<=20, membership) (src/server/middleware/session-validator.middleware.ts)

- [ ] T018 Wire Socket.IO into the SSR server without logging session metadata (src/server.ts)
- [ ] T019 Implement Socket.IO handler module with typed payloads per contracts/websocket-events.md (src/server/websocket/socket-handler.ts)
- [ ] T020 Implement session cleanup job (runs every 5 minutes, expires after 1h inactivity) (src/server/utils/session-cleanup.ts)

- [ ] T021 Implement client WebSocket service (browser-only, typed emits/acks) (src/app/core/services/websocket.service.ts)
- [ ] T022 Implement client session storage service (sessionId, displayName, participantId, isFacilitator) (src/app/core/services/session-storage.service.ts)
- [ ] T023 Implement route guard validating sessionId param pattern (src/app/core/guards/session-active.guard.ts)

- [ ] T024 Configure routes: home, join/:sessionId, session/:sessionId (src/app/app.routes.ts)

- [ ] T025 [P] Implement accessible error message component (src/app/shared/components/error-message/error-message.component.ts)
- [ ] T026 [P] Implement accessible loading spinner component (src/app/shared/components/loading-spinner/loading-spinner.component.ts)
- [ ] T027 [P] Implement accessible copy-link component (src/app/shared/components/copy-link/copy-link.component.ts)

**Checkpoint**: Foundation complete; user stories can proceed.

---

## Phase 3: User Story 1 - Session Creation and Sharing (Priority: P1) MVP

**Goal**: Facilitator creates a session and receives a shareable URL; facilitator is designated automatically.

**Independent Test**: Home page create session -> shareable URL contains sessionId -> facilitator lands in session view.

### Tests (write first)

- [ ] T028 [P] [US1] Add Playwright test for session creation + shareable URL format (tests/e2e/home.spec.ts)
- [ ] T029 [P] [US1] Add integration test for createSession contract ack payload (tests/integration/websocket-create-session.spec.ts)

### Implementation

- [ ] T030 [P] [US1] Implement Home UI for session creation (src/app/features/home/home.component.ts, src/app/features/home/home.component.html, src/app/features/home/home.component.scss)
- [ ] T031 [US1] Implement createSession client method (src/app/core/services/websocket.service.ts)
- [ ] T032 [US1] Implement createSession server handler (sanitize facilitatorName, create session, set facilitator, update lastActivity) (src/server/websocket/socket-handler.ts)
- [ ] T033 [US1] Persist facilitator identity after creation (src/app/core/services/session-storage.service.ts)
- [ ] T034 [US1] Render shareable session URL and copy action (src/app/shared/components/copy-link/copy-link.component.ts)
- [ ] T035 [US1] Navigate to /session/:sessionId on success (src/app/features/home/home.component.ts)
- [ ] T036 [US1] Implement accessible error handling for createSession failures (src/app/features/home/home.component.ts)

**Checkpoint**: US1 functional and independently testable.

---

## Phase 4: User Story 2 - Participant Joining (Priority: P1)

**Goal**: Participant joins via shared URL, provides a display name, and appears in the participant list in real time.

**Independent Test**: Open join link -> enter name -> join -> participant appears in another browser; invalid/expired session shows error.

### Tests (write first)

- [ ] T037 [P] [US2] Add Playwright test for join flow and empty-name validation (tests/e2e/home.spec.ts)
- [ ] T038 [P] [US2] Add integration tests for joinSession errors (not found, capacity full, invalid name) (tests/integration/websocket-join-session.spec.ts)

### Implementation

- [ ] T039 [P] [US2] Implement Join UI (src/app/features/join/join.component.ts, src/app/features/join/join.component.html, src/app/features/join/join.component.scss)
- [ ] T040 [US2] Implement joinSession client method and response mapping (src/app/core/services/websocket.service.ts)
- [ ] T041 [US2] Implement joinSession server handler with capacity enforcement and duplicate-name resolution (src/server/websocket/socket-handler.ts)
- [ ] T042 [US2] Broadcast participantJoined events (src/server/websocket/socket-handler.ts)
- [ ] T043 [US2] Broadcast participantLeft events (src/server/websocket/socket-handler.ts)

- [ ] T044 [P] [US2] Implement session view shell (src/app/features/session/session.component.ts, src/app/features/session/session.component.html, src/app/features/session/session.component.scss)
- [ ] T045 [US2] Implement SessionStore for participants, votes, revealed state (src/app/features/session/session.store.ts)
- [ ] T046 [P] [US2] Implement participant list component skeleton (src/app/features/session/components/participant-list/participant-list.component.ts)
- [ ] T047 [US2] Wire participant join/leave events into SessionStore (src/app/features/session/session.store.ts)

- [ ] T048 [US2] Navigate join -> session and persist participant identity (src/app/features/join/join.component.ts, src/app/core/services/session-storage.service.ts)
- [ ] T049 [US2] Show clear join errors (invalid/expired session, capacity exceeded) (src/app/features/join/join.component.ts)

**Checkpoint**: US2 functional and independently testable.

---

## Phase 5: User Story 3 - Concealed Voting (Priority: P1)

**Goal**: Participants select a Fibonacci estimate; others see vote status only until reveal.

**Independent Test**: Two participants vote; participant list shows who voted; vote values remain hidden until reveal; vote changes update status.

### Tests (write first)

- [ ] T050 [P] [US3] Add unit tests for vote value validation and voting rules (src/app/domain/validators/session-validators.spec.ts)
- [ ] T051 [P] [US3] Add integration test for submitVote contract and status-only broadcast (tests/integration/websocket-submit-vote.spec.ts)

### Implementation

- [ ] T052 [P] [US3] Implement voting deck component (src/app/features/session/components/voting-deck/voting-deck.component.ts)
- [ ] T053 [US3] Implement submitVote client method (src/app/core/services/websocket.service.ts)
- [ ] T054 [US3] Implement submitVote server handler (validate, membership, block if revealed, update lastActivity) (src/server/websocket/socket-handler.ts)
- [ ] T055 [US3] Broadcast voteSubmitted status-only events (no vote values) (src/server/websocket/socket-handler.ts)
- [ ] T056 [US3] Update SessionStore from voteSubmitted events (src/app/features/session/session.store.ts)
- [ ] T057 [US3] Add accessible voted indicator (per FR-007) (src/app/features/session/components/participant-list/participant-list.component.ts)

**Checkpoint**: US3 functional and independently testable.

---

## Phase 6: User Story 4 - Simultaneous Reveal (Priority: P1)

**Goal**: Facilitator reveals votes simultaneously; if not all voted, show confirmation with non-voter count.

**Independent Test**: Reveal with incomplete votes prompts confirmation; proceed reveals to all; joiner after reveal sees revealed state.

### Tests (write first)

- [ ] T058 [P] [US4] Add integration tests for revealVotes (warning when incomplete + force reveal) (tests/integration/websocket-reveal-votes.spec.ts)
- [ ] T059 [P] [US4] Add Playwright test for reveal confirmation dialog and results visibility (tests/e2e/session.spec.ts)

### Implementation

- [ ] T060 [P] [US4] Implement facilitator controls component (src/app/features/session/components/facilitator-controls/facilitator-controls.component.ts)
- [ ] T061 [P] [US4] Implement vote results component (src/app/features/session/components/vote-results/vote-results.component.ts)
- [ ] T062 [US4] Implement revealVotes client method (src/app/core/services/websocket.service.ts)
- [ ] T063 [US4] Implement revealVotes server handler (facilitator-only, non-voter count, support force) (src/server/websocket/socket-handler.ts)
- [ ] T064 [US4] Broadcast votesRevealed event with revealed votes payload (src/server/websocket/socket-handler.ts)
- [ ] T065 [US4] Update SessionStore with revealed votes and isRevealed=true (src/app/features/session/session.store.ts)
- [ ] T066 [US4] Implement confirmation UI for incomplete-vote reveal (src/app/features/session/components/facilitator-controls/facilitator-controls.component.ts)
- [ ] T067 [US4] Disable voting UI when revealed (src/app/features/session/components/voting-deck/voting-deck.component.ts)
- [ ] T068 [US4] Ensure joinSession response includes revealed votes when already revealed (src/server/websocket/socket-handler.ts)

**Checkpoint**: MVP (US1-US4) complete.

---

## Phase 7: User Story 5 - Round Management (Priority: P2)

**Goal**: Facilitator clears votes and starts a new round without creating a new session.

**Independent Test**: Reveal -> clear -> returns to voting state; all hasVoted reset; participants remain.

### Tests (write first)

- [ ] T069 [P] [US5] Add integration test for clearVotes contract and broadcast (tests/integration/websocket-clear-votes.spec.ts)

### Implementation

- [ ] T070 [US5] Implement clearVotes client method (src/app/core/services/websocket.service.ts)
- [ ] T071 [US5] Implement clearVotes server handler (facilitator-only, clear votes, reset state, update lastActivity) (src/server/websocket/socket-handler.ts)
- [ ] T072 [US5] Broadcast votesCleared event (src/server/websocket/socket-handler.ts)
- [ ] T073 [US5] Reset SessionStore on votesCleared (src/app/features/session/session.store.ts)
- [ ] T074 [US5] Re-enable voting UI after clear (src/app/features/session/components/voting-deck/voting-deck.component.ts)

**Checkpoint**: US5 functional and independently testable.

---

## Phase 8: User Story 6 - Session Presence Awareness (Priority: P2)

**Goal**: Show who is in session and voting status; remove disconnected participants after 30 seconds; allow reconnection within grace period.

**Independent Test**: Disconnect a participant; they disappear within 30 seconds; reconnect and they reappear.

### Tests (write first)

- [ ] T075 [P] [US6] Add integration test for disconnect grace period removal (tests/integration/websocket-presence.spec.ts)

### Implementation

- [ ] T076 [US6] Track participant lastSeen and update it on relevant events (src/server/websocket/socket-handler.ts)
- [ ] T077 [US6] Implement 30-second disconnect grace handling and participantLeft broadcast (src/server/websocket/socket-handler.ts)
- [ ] T078 [US6] Implement reconnection behavior (same sessionId + displayName returns participant; facilitator retained within grace period) (src/server/websocket/socket-handler.ts)
- [ ] T079 [US6] Display participant count and vote progress X/Y voted (src/app/features/session/session.component.ts)
- [ ] T080 [US6] Add ARIA live announcements for join/leave changes (src/app/features/session/session.component.ts)

**Checkpoint**: US6 functional and independently testable.

---

## Phase 9: User Story 7 - Mobile-Responsive Voting (Priority: P2)

**Goal**: Responsive UI down to 320px width with usable touch targets.

**Independent Test**: Complete MVP flow at 320px viewport without horizontal scrolling.

### Tests (write first)

- [ ] T081 [P] [US7] Add Playwright viewport test at 320px for MVP flow (tests/e2e/session.mobile.spec.ts)

### Implementation

- [ ] T082 [P] [US7] Add responsive styling tokens/mixins (src/styles.scss)
- [ ] T083 [US7] Update home/join/session layouts for mobile (src/app/app.scss, src/app/features/home/home.component.scss, src/app/features/join/join.component.scss, src/app/features/session/session.component.scss)
- [ ] T084 [US7] Ensure voting deck wraps/scrolls and touch targets are >= 44x44px (src/app/features/session/components/voting-deck/voting-deck.component.scss)
- [ ] T085 [US7] Ensure viewport meta supports mobile responsiveness (src/index.html)

**Checkpoint**: US7 functional and independently testable.

---

## Phase 10: User Story 8 - Session Timeout Management (Priority: P3)

**Goal**: Auto-clean up inactive sessions after 1 hour (activity resets timer) and show clear join errors for expired sessions.

**Independent Test**: Create session -> idle for timeout -> join shows expired; any activity resets timer.

### Tests (write first)

- [ ] T086 [P] [US8] Add unit tests for session expiration logic (src/server/utils/session-cleanup.spec.ts)

### Implementation

- [ ] T087 [US8] Ensure cleanup deletes sessions after 1 hour inactivity (src/server/utils/session-cleanup.ts)
- [ ] T088 [US8] Ensure join/vote/reveal/clear update session lastActivity (src/server/websocket/socket-handler.ts)
- [ ] T089 [US8] Return clear session-unavailable errors for expired sessions (src/server/websocket/socket-handler.ts)

**Checkpoint**: US8 functional and independently testable.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility (WCAG AA), resilience, and documentation.

- [ ] T090 [P] Ensure no logging of session IDs, participant IDs, display names, or votes (src/server.ts, src/server/websocket/socket-handler.ts)
- [ ] T091 Add client connection state UI (connected/disconnected/reconnecting) and friendly error mapping (src/app/core/services/websocket.service.ts, src/app/shared/components/error-message/error-message.component.ts)
- [ ] T092 [P] Add capacity (20) and facilitator-absent messaging per edge cases (src/app/features/session/session.component.ts)
- [ ] T093 [P] Update README scripts section to match package.json (README.md)
- [ ] T094 [P] Update quickstart to remove any session-metadata logging examples and match current scripts/paths (specs/001-poker-session-app/quickstart.md, specs/001-poker-session-app/contracts/websocket-events.md)

---

## Dependencies & Execution Order

### User Story Dependency Graph

```text
Setup -> Foundation -> US1 -> US2 -> US3 -> US4 -> US5
                                      |-> US6
                                      |-> US7
Foundation -> US8
```

### User Story Completion Order (Recommended)

- MVP: US1 -> US2 -> US3 -> US4
- Then: US5 (round management)
- Then: US6 (presence/disconnect grace)
- Then: US7 (mobile)
- Then: US8 (timeout management)

### Parallel Opportunities (Examples)

- US1: T028 and T029 can run in parallel; T030 can start in parallel once Foundation is done
- US2: T037 and T038 can run in parallel; T039 and T046 can start in parallel
- US3: T050, T051, and T052 can run in parallel
- US4: T058 and T059 can run in parallel; T060 and T061 can run in parallel
- US5: T069 can run before T071
- US6: T075 can run before T076
- US7: T081 can run before T083
- US8: T086 can run before T087

---

## Implementation Strategy

### Suggested MVP Scope

- MVP includes US1-US4 only (create -> join -> vote -> reveal)

### Incremental Delivery

- Deliver Foundation first, then complete US1 and validate independently
- Add US2, validate independently, then US3, then US4 (MVP)
- Add P2 stories (US5-US7), then US8
