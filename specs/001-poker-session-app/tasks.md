# Tasks: Planning Poker Session Application

**Input**: Design documents from `/specs/001-poker-session-app/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Tests are NOT listed as separate tasks as this breakdown assumes Test-Driven Development (TDD) will be integrated during implementation of each task per Constitution Principle III (Testing Requirements - MANDATORY). When implementing any task, write tests FIRST, ensure they fail, then implement code to pass tests (Red-Green-Refactor cycle). This ensures 80% coverage minimum and TDD compliance.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a single Angular SSR project with unified frontend/backend:

- **Frontend**: `src/app/` (components, services, stores)
- **Backend**: `src/server/` (Express + Socket.IO)
- **Tests**: `tests/` (e2e, integration)

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Angular SSR project with all required dependencies

- [ ] T001 **PREREQUISITE**: Navigate to sprint-poker root directory (`C:\Users\flavio\sprint-poker`). Create Angular (latest version) project with SSR enabled using `ng new . --ssr --style=scss --routing --skip-git` (--name option not needed as directory already named sprint-poker). This generates project files in current directory, not a nested subdirectory.
- [ ] T002 [P] Install frontend dependencies: `npm install socket.io-client @ngrx/signals nanoid`
- [ ] T003 [P] Install backend dependencies: `npm install socket.io express`
- [ ] T004 [P] Install dev dependencies: `npm install -D @types/node socket.io-client-mock playwright @playwright/test`
- [ ] T005 Configure TypeScript strict mode in tsconfig.json and tsconfig.server.json
- [ ] T006 [P] Configure ESLint with max-complexity rule set to 5 in .eslintrc.json
- [ ] T007 [P] Setup Angular Material: `ng add @angular/material` with default theme
- [ ] T008 Create project folder structure: src/app/core/, src/app/domain/, src/app/features/, src/app/shared/, src/server/
- [ ] T009 [P] Create Playwright config in playwright.config.ts
- [ ] T010 [P] Setup environment configuration in src/environments/

**Checkpoint**: Project structure initialized - ready for foundational implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 [P] Create VotingDeck model with Fibonacci values (0,1,2,3,5,8,13,21) in src/app/domain/models/voting-deck.model.ts
- [ ] T012 [P] Create Session model interface with validation rules in src/app/domain/models/session.model.ts
- [ ] T013 [P] Create Participant model interface with validation rules in src/app/domain/models/participant.model.ts
- [ ] T014 [P] Create Vote model interface with validation rules in src/app/domain/models/vote.model.ts
- [ ] T015 Create session validators (name sanitization, length checks) in src/app/domain/validators/session-validators.ts
- [ ] T016 Create sanitization utility for display names in src/app/shared/utils/sanitization.utils.ts
- [ ] T017 Create session ID generator using nanoid in src/app/shared/utils/session-id-generator.ts
- [ ] T018 Create in-memory session store Map in src/server/websocket/session-store.ts
- [ ] T019 Create custom Express server wrapper in src/server/server.ts that imports Angular SSR app
- [ ] T020 Attach Socket.IO to Express server with ping/pong config (pingTimeout: 30000, pingInterval: 25000) in src/server/server.ts
- [ ] T021 Create rate limiter middleware with per-action limits in src/server/middleware/rate-limiter.middleware.ts
- [ ] T022 Create session validator middleware in src/server/middleware/session-validator.middleware.ts
- [ ] T023 Create duplicate name handler utility in src/server/utils/duplicate-name-handler.ts
- [ ] T024 Create session cleanup timer (1-hour inactivity) in src/server/utils/session-cleanup.ts
- [ ] T025 Create WebSocket service wrapper for Socket.IO client in src/app/core/services/websocket.service.ts
- [ ] T026 Create session storage service for browser session temp data in src/app/core/services/session-storage.service.ts
- [ ] T027 Create session-active route guard in src/app/core/guards/session-active.guard.ts
- [ ] T028 Setup routing configuration in src/app/app.routes.ts with home, join/:sessionId, session/:sessionId routes
- [ ] T029 [P] Create shared error-message component in src/app/shared/components/error-message/
- [ ] T030 [P] Create shared loading-spinner component in src/app/shared/components/loading-spinner/
- [ ] T031 [P] Create shared copy-link component in src/app/shared/components/copy-link/
- [ ] T032 Setup Socket.IO event handler structure in src/server/websocket/socket-handler.ts with setupSocketHandlers function
- [ ] T033 Configure SCSS variables and mixins in src/styles/\_variables.scss and src/styles/\_mixins.scss

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Session Creation and Sharing (Priority: P1) 🎯 MVP

**Goal**: Facilitators can create a session and receive a shareable URL to invite participants

**Independent Test**: Create a session via home page, verify unique session ID generated, confirm shareable URL contains session ID, verify facilitator can access session

### Implementation for User Story 1

- [ ] T034 [P] [US1] Create home component with "Create New Session" form in src/app/features/home/home.component.ts
- [ ] T035 [P] [US1] Create home component template with Material button and form in src/app/features/home/home.component.html
- [ ] T036 [P] [US1] Create home component styles in src/app/features/home/home.component.scss
- [ ] T037 [US1] Implement createSession WebSocket event handler in src/server/websocket/socket-handler.ts
- [ ] T038 [US1] Add createSession client method in WebSocket service (src/app/core/services/websocket.service.ts)
- [ ] T039 [US1] Connect home component to WebSocket service for session creation
- [ ] T040 [US1] Generate unique session URL with format base_url/session/{sessionId} in home component
- [ ] T041 [US1] Display session URL with copy-link component in home component template
- [ ] T042 [US1] Store session ID and facilitator flag in session storage service
- [ ] T043 [US1] Navigate to session/:sessionId route after creation
- [ ] T044 [US1] Add rate limiting to createSession event (3 per minute per socket)
- [ ] T045 [US1] Add error handling for session creation failures in home component

**Checkpoint**: User Story 1 complete - facilitators can create sessions and get shareable links

---

## Phase 4: User Story 2 - Participant Joining (Priority: P1)

**Goal**: Team members can join a session using a shared URL and identify themselves with a display name

**Independent Test**: Navigate to session URL, enter display name, verify joined participant appears in session, verify real-time updates when others join

### Implementation for User Story 2

- [ ] T046 [P] [US2] Create join component with display name input form in src/app/features/join/join.component.ts
- [ ] T047 [P] [US2] Create join component template with Material input and button in src/app/features/join/join.component.html
- [ ] T048 [P] [US2] Create join SignalStore for managing join state in src/app/features/join/join.store.ts
- [ ] T049 [US2] Implement joinSession WebSocket event handler in src/server/websocket/socket-handler.ts
- [ ] T050 [US2] Add joinSession client method in WebSocket service (src/app/core/services/websocket.service.ts)
- [ ] T051 [US2] Add session existence validation in session validator middleware
- [ ] T052 [US2] Add 20-participant capacity check in joinSession handler
- [ ] T053 [US2] Implement duplicate name handling with number suffix in backend and display in participant-list component (John → John (2))
- [ ] T054 [US2] Apply display name sanitization in joinSession handler
- [ ] T055 [US2] Implement participantJoined broadcast event in socket-handler.ts
- [ ] T056 [US2] Add participantJoined listener in WebSocket service
- [ ] T057 [US2] Create session component container in src/app/features/session/session.component.ts
- [ ] T058 [US2] Create session SignalStore for managing session state in src/app/features/session/session.store.ts
- [ ] T059 [US2] Create participant-list component in src/app/features/session/components/participant-list/
- [ ] T060 [US2] Display participant names in participant-list component template
- [ ] T061 [US2] Update session store when participantJoined event received
- [ ] T062 [US2] Navigate from join to session/:sessionId after successful join
- [ ] T063 [US2] Implement participantLeft broadcast event in socket-handler.ts for disconnect handling
- [ ] T064 [US2] Add participantLeft listener in WebSocket service
- [ ] T065 [US2] Remove participant from session store when participantLeft received
- [ ] T066 [US2] Add 30-second grace period before removing disconnected participant
- [ ] T067 [US2] Add rate limiting to joinSession event (5 per minute per socket)
- [ ] T068 [US2] Add error handling for invalid session ID in join component
- [ ] T069 [US2] Add error handling for capacity exceeded in join component
- [ ] T070 [US2] Add error handling for empty display name in join component

**Checkpoint**: User Story 2 complete - participants can join sessions and see each other in real-time

---

## Phase 5: User Story 3 - Concealed Voting (Priority: P1)

**Goal**: Participants can select estimates from a Fibonacci deck without seeing others' votes, with checkmark indicators showing voting status

**Independent Test**: Join a session, select an estimate, verify vote is recorded, confirm checkmark appears next to name, verify other participants cannot see vote value

### Implementation for User Story 3

- [ ] T071 [P] [US3] Create voting-deck component displaying Fibonacci cards in src/app/features/session/components/voting-deck/
- [ ] T072 [P] [US3] Style voting-deck cards with Material design in voting-deck.component.scss
- [ ] T073 [P] [US3] Add card selection handler in voting-deck component
- [ ] T074 [US3] Implement submitVote WebSocket event handler in src/server/websocket/socket-handler.ts
- [ ] T075 [US3] Add submitVote client method in WebSocket service (src/app/core/services/websocket.service.ts)
- [ ] T076 [US3] Store vote in session votes Map in submitVote handler
- [ ] T077 [US3] Update participant hasVoted flag when vote submitted
- [ ] T078 [US3] Implement voteSubmitted broadcast event (without vote value) in socket-handler.ts
- [ ] T079 [US3] Add voteSubmitted listener in WebSocket service
- [ ] T080 [US3] Update session store hasVoted status when voteSubmitted received
- [ ] T081 [US3] Add checkmark icon next to participant names who have voted in participant-list component
- [ ] T082 [US3] Add ARIA label "has voted" for accessibility on checkmark icons
- [ ] T083 [US3] Validate vote value is in Fibonacci sequence in submitVote handler
- [ ] T084 [US3] Allow vote changes by replacing previous vote in session votes Map
- [ ] T085 [US3] Disable voting-deck when votes are revealed (isRevealed = true)
- [ ] T086 [US3] Add visual feedback (card highlight) when vote is selected
- [ ] T087 [US3] Add rate limiting to submitVote event (10 per minute per participant)
- [ ] T088 [US3] Update lastActivity timestamp when vote submitted

**Checkpoint**: User Story 3 complete - participants can vote with concealed values and voting indicators

---

## Phase 6: User Story 4 - Simultaneous Reveal (Priority: P1)

**Goal**: Facilitators can reveal all votes simultaneously with confirmation for incomplete votes, enabling team discussion

**Independent Test**: Cast votes as multiple participants, trigger reveal as facilitator, verify all votes display simultaneously, test incomplete vote confirmation dialog

### Implementation for User Story 4

- [ ] T089 [P] [US4] Create facilitator-controls component in src/app/features/session/components/facilitator-controls/
- [ ] T090 [P] [US4] Add "Reveal Votes" button in facilitator-controls template (visible only to facilitator)
- [ ] T091 [P] [US4] Create vote-results component in src/app/features/session/components/vote-results/
- [ ] T092 [US4] Implement revealVotes WebSocket event handler in src/server/websocket/socket-handler.ts
- [ ] T093 [US4] Add revealVotes client method in WebSocket service (src/app/core/services/websocket.service.ts)
- [ ] T094 [US4] Check if all participants have voted in revealVotes handler
- [ ] T095 [US4] Return incomplete vote count in revealVotes acknowledgment if not all voted
- [ ] T096 [US4] Show Material dialog with incomplete vote warning in facilitator-controls component
- [ ] T097 [US4] Display count of non-voters and proceed/cancel options in confirmation dialog
- [ ] T098 [US4] Set session isRevealed flag to true in revealVotes handler
- [ ] T099 [US4] Implement votesRevealed broadcast event with all vote values in socket-handler.ts
- [ ] T100 [US4] Add votesRevealed listener in WebSocket service
- [ ] T101 [US4] Update session store with revealed votes when votesRevealed received
- [ ] T102 [US4] Display participant names and vote values in vote-results component
- [ ] T103 [US4] Show "not voted" indicator for participants without votes in vote-results component
- [ ] T104 [US4] Hide voting-deck and show vote-results when isRevealed = true
- [ ] T105 [US4] Ensure new participants joining see revealed state correctly
- [ ] T106 [US4] Add rate limiting to revealVotes event (20 per minute per facilitator)
- [ ] T107 [US4] Validate facilitator privilege in revealVotes handler
- [ ] T108 [US4] Update lastActivity timestamp when reveal triggered

**Checkpoint**: User Story 4 complete - facilitators can reveal votes with proper confirmation flow

---

## Phase 7: User Story 5 - Round Management (Priority: P2)

**Goal**: Facilitators can clear votes and start new estimation rounds without creating a new session

**Independent Test**: Complete a voting round (vote + reveal), clear votes, verify session returns to empty voting state, confirm participants retained

### Implementation for User Story 5

- [ ] T109 [P] [US5] Add "Clear Votes" button in facilitator-controls component template
- [ ] T110 [US5] Implement clearVotes WebSocket event handler in src/server/websocket/socket-handler.ts
- [ ] T111 [US5] Add clearVotes client method in WebSocket service (src/app/core/services/websocket.service.ts)
- [ ] T112 [US5] Clear all votes from session votes Map in clearVotes handler
- [ ] T113 [US5] Reset all participant hasVoted flags to false in clearVotes handler
- [ ] T114 [US5] Set session isRevealed flag to false in clearVotes handler
- [ ] T115 [US5] Implement votesCleared broadcast event in socket-handler.ts
- [ ] T116 [US5] Add votesCleared listener in WebSocket service
- [ ] T117 [US5] Reset session store to empty voting state when votesCleared received
- [ ] T118 [US5] Hide vote-results and show voting-deck when votes cleared
- [ ] T119 [US5] Remove checkmark icons from all participants in participant-list
- [ ] T120 [US5] Validate facilitator privilege in clearVotes handler
- [ ] T121 [US5] Add rate limiting to clearVotes event (20 per minute per facilitator)
- [ ] T122 [US5] Update lastActivity timestamp when votes cleared

**Checkpoint**: User Story 5 complete - facilitators can manage multiple estimation rounds

---

## Phase 8: User Story 6 - Session Presence Awareness (Priority: P2)

**Goal**: Participants see real-time voting status indicators and presence updates for better coordination

**Independent Test**: Join as multiple participants, observe real-time participant list updates, verify checkmark indicators appear when voting, test disconnect/reconnect scenarios

### Implementation for User Story 6

- [ ] T123 [P] [US6] Add online status indicator (green dot) to participant-list component
- [ ] T124 [P] [US6] Style participant-list with clear visual hierarchy in participant-list.component.scss
- [ ] T125 [US6] Display facilitator badge/icon next to facilitator name in participant-list
- [ ] T126 [US6] Update participant lastSeen timestamp on any message in socket-handler.ts
- [ ] T127 [US6] Implement disconnect handler that waits 30 seconds before removal in socket-handler.ts
- [ ] T128 [US6] Show "reconnecting" state for participants in grace period
- [ ] T129 [US6] Remove participant after 30-second timeout and broadcast participantLeft
- [ ] T130 [US6] Handle reconnection within grace period by restoring participant state
- [ ] T131 [US6] Display total participant count in session header
- [ ] T132 [US6] Display vote progress indicator (X/Y voted) in session component
- [ ] T133 [US6] Add ARIA live region for screen reader announcements when participants join/leave

**Checkpoint**: User Story 6 complete - enhanced presence awareness and voting status visibility

---

## Phase 9: User Story 7 - Mobile-Responsive Voting (Priority: P2)

**Goal**: Application adapts to mobile devices (320px+) with touch-friendly interface

**Independent Test**: Access application on mobile device and desktop, complete full voting cycle on both, verify responsive layout at various screen sizes

### Implementation for User Story 7

- [ ] T134 [P] [US7] Add responsive breakpoints to \_variables.scss (mobile: 320px, tablet: 768px, desktop: 1024px)
- [ ] T135 [P] [US7] Create mobile-responsive mixins in \_mixins.scss
- [ ] T136 [US7] Update home component layout for mobile in home.component.scss
- [ ] T137 [US7] Update join component layout for mobile in join.component.scss
- [ ] T138 [US7] Update session component layout with flexible grid in session.component.scss
- [ ] T139 [US7] Make voting-deck cards wrap/scroll on small screens in voting-deck.component.scss
- [ ] T140 [US7] Ensure minimum 44x44px touch targets for all buttons per WCAG
- [ ] T141 [US7] Make participant-list scrollable on mobile in participant-list.component.scss
- [ ] T142 [US7] Make vote-results scrollable on mobile in vote-results.component.scss
- [ ] T143 [US7] Test responsive layout at 320px, 375px, 768px, 1024px viewports
- [ ] T144 [US7] Add viewport meta tag in index.html for proper mobile scaling
- [ ] T145 [US7] Ensure copy-link component works with mobile clipboard API

**Checkpoint**: User Story 7 complete - mobile-responsive interface for all features

---

## Phase 10: User Story 8 - Session Timeout Management (Priority: P3)

**Goal**: Automatic cleanup of inactive sessions after 1 hour to prevent memory accumulation

**Independent Test**: Create a session, let it sit idle for 1 hour, verify session removed from memory, verify expired session shows error message

### Implementation for User Story 8

- [ ] T146 [US8] Start session cleanup interval timer (check every 5 minutes) in src/server/utils/session-cleanup.ts
- [ ] T147 [US8] Check lastActivity timestamp for all sessions in cleanup routine
- [ ] T148 [US8] Remove sessions with lastActivity > 1 hour from session store
- [ ] T149 [US8] Broadcast sessionExpired event to all participants in expiring session
- [ ] T150 [US8] Add sessionExpired listener in WebSocket service
- [ ] T151 [US8] Redirect to home page with expiration message when sessionExpired received
- [ ] T152 [US8] Disconnect all sockets in expired session
- [ ] T153 [US8] Update lastActivity timestamp on join, vote, reveal, clear actions
- [ ] T154 [US8] Show clear error message when attempting to join expired session
- [ ] T155 [US8] Log session cleanup events for monitoring
- [ ] T156 [US8] Ensure cleanup timer is started when server starts

**Checkpoint**: User Story 8 complete - session timeout and memory management implemented

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T157 [P] Add loading states to all async operations (create, join, vote, reveal, clear)
- [ ] T158 [P] Add comprehensive ARIA labels to all interactive elements
- [ ] T159 [P] Implement keyboard navigation support (tab order, enter/space for buttons)
- [ ] T160 [P] Add focus indicators that meet WCAG 2.1 AA contrast requirements
- [ ] T161 Configure bundle size monitoring with Angular CLI budget in angular.json (max 500KB gzipped)
- [ ] T162 Enable lazy loading for session route module in app.routes.ts
- [ ] T163 [P] Add error logging to server with structured format
- [ ] T164 [P] Add client-side error boundary for graceful error handling
- [ ] T165 [P] Update README.md with project description, setup instructions, and development commands
- [ ] T166 [P] Create API documentation in docs/api.md based on websocket-events.md
- [ ] T167 Add Socket.IO connection state indicators (connected/disconnected/reconnecting)
- [ ] T168 Add retry logic for failed WebSocket connections in websocket.service.ts
- [ ] T169 [P] Run ESLint complexity check across all code files
- [ ] T170 [P] Run Lighthouse accessibility audit on all routes
- [ ] T171 [P] Run Lighthouse performance audit on all routes
- [ ] T172 Verify quickstart.md instructions work end-to-end
- [ ] T173 Verify all constitution principles compliance (Privacy, Quality, Testing, UX, Performance, Simplicity)
- [ ] T174 Create production build configuration in angular.json with optimizations
- [ ] T175 Document deployment instructions for SSR + Socket.IO in docs/deployment.md

**Checkpoint**: Application polished and ready for production deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
- **User Stories (Phases 3-10)**: All depend on Foundational phase completion
  - User stories CAN proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 11)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Depends on Foundational - No dependencies on US1 (can run parallel)
- **User Story 3 (P1)**: Depends on US2 completion (needs participant joining) - Can run after US1+US2
- **User Story 4 (P1)**: Depends on US3 completion (needs voting) - Sequential after US3
- **User Story 5 (P2)**: Depends on US4 completion (needs reveal before clear) - Sequential after US4
- **User Story 6 (P2)**: Depends on US2 completion (needs participant list) - Can run parallel with US3-5
- **User Story 7 (P2)**: Can run parallel with any story after Foundational - UI styling only
- **User Story 8 (P3)**: Depends on US1 completion (needs session creation) - Can run parallel with US3-7

### Within Each User Story

- Models before services
- Services before endpoints/handlers
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: T002, T003, T004, T006, T007, T009, T010 can run in parallel

**Phase 2 (Foundational)**: T011-T014, T029-T031 can run in parallel

**Phase 3 (US1)**: T034, T035, T036 can run in parallel

**Phase 4 (US2)**: T046, T047, T048 can run in parallel; after join handler complete, T059-T060 can run parallel

**Phase 5 (US3)**: T071, T072, T073 can run in parallel

**Phase 6 (US4)**: T089, T090, T091 can run in parallel

**Phase 7 (US5)**: T109 can run parallel with handler implementation

**Phase 8 (US6)**: T123, T124, T125 can run in parallel

**Phase 9 (US7)**: T134, T135 can run in parallel; T136-T142 can run in parallel after

**Phase 11 (Polish)**: T157-T160, T163-T164, T165-T166, T169-T171 can run in parallel

### Story Parallelization

Once Foundational complete:

- **Parallel Track 1**: US1 → US3 → US4 → US5 (main voting flow)
- **Parallel Track 2**: US2 → US6 (participant management)
- **Parallel Track 3**: US7 (responsive design - can run anytime)
- **Parallel Track 4**: US8 (session cleanup - can run anytime after US1)

---

## Parallel Example: User Story 1

```bash
# Phase 3 parallel tasks
git checkout -b us1-session-creation
# Terminal 1: Frontend components
(T034, T035, T036 in parallel)
# Terminal 2: Backend handler
T037
# After both complete, proceed sequentially with T038-T045
```

---

## Implementation Strategy

### MVP Definition (Phase 3-6: User Stories 1-4)

The **Minimum Viable Product** includes only P1 user stories:

- ✅ Session Creation and Sharing (US1)
- ✅ Participant Joining (US2)
- ✅ Concealed Voting (US3)
- ✅ Simultaneous Reveal (US4)

This MVP delivers complete Planning Poker functionality: create session → join → vote → reveal

### Incremental Delivery

After MVP validation, add P2 features:

- Round Management (US5) - enables multi-item estimation
- Session Presence Awareness (US6) - improves coordination
- Mobile-Responsive Voting (US7) - expands accessibility

Then add P3 features:

- Session Timeout Management (US8) - system health

### TDD Workflow (When Tests Added)

If tests are added later, follow this order:

1. Write contract test for WebSocket event → **ensure it fails**
2. Implement server handler → **test passes**
3. Write component test → **ensure it fails**
4. Implement component → **test passes**
5. Write E2E test → **ensure it fails**
6. Integrate components → **test passes**

---

## Task Summary

**Total Tasks**: 175

**Event Count Alignment**: 5 client→server events (createSession, joinSession, submitVote, revealVotes, clearVotes) - uses Socket.IO built-in ping/pong for connection health instead of custom heartbeat

**Task Count by Phase**:

- Phase 1 (Setup): 10 tasks
- Phase 2 (Foundational): 23 tasks
- Phase 3 (US1): 12 tasks
- Phase 4 (US2): 25 tasks
- Phase 5 (US3): 18 tasks
- Phase 6 (US4): 20 tasks
- Phase 7 (US5): 14 tasks
- Phase 8 (US6): 11 tasks
- Phase 9 (US7): 12 tasks
- Phase 10 (US8): 11 tasks
- Phase 11 (Polish): 19 tasks

**Task Count by User Story**:

- US1 (Session Creation): 12 tasks
- US2 (Participant Joining): 25 tasks
- US3 (Concealed Voting): 18 tasks
- US4 (Simultaneous Reveal): 20 tasks
- US5 (Round Management): 14 tasks
- US6 (Session Presence): 11 tasks
- US7 (Mobile Responsive): 12 tasks
- US8 (Session Timeout): 11 tasks

**Parallel Opportunities**: 41 tasks marked with [P] for parallel execution

**Independent Test Criteria**: Each user story phase includes specific test scenario for validation

**MVP Scope**: Phase 1-6 (Tasks T001-T108) - 90 tasks for complete MVP with 4 P1 user stories

**Format Validation**: ✅ All tasks follow required checklist format with checkbox, ID, labels, and file paths
