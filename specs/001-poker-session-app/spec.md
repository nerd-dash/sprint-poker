# Feature Specification: Planning Poker Session Application

**Feature Branch**: `001-poker-session-app`  
**Created**: 2025-12-31  
**Status**: Draft  
**Input**: User description: "Build a lightweight web application for Scrum teams to run Planning Poker estimation sessions with real-time, concealed voting and session facilitation"

## Clarifications

### Session 2025-12-31

- Q: Should the system provide a short alphanumeric code (like "ABC-123") that users type in, or only a full URL that they click/copy? → A: Full URL only (e.g., "https://app.com/session/abc123xyz") - users click link to join
- Q: How long should the system wait before removing a disconnected participant from the session? → A: 30 seconds - grace period for network hiccups
- Q: What specific visual indicator should show that a participant has voted (without revealing the value)? → A: Checkmark or badge icon next to participant name
- Q: Should the facilitator be able to force reveal even if not everyone has voted, or should reveal be blocked until all vote? → A: Allow force reveal with confirmation dialog (proceed anyway or cancel)
- Q: What defines "inactivity" for session timeout - should the 1-hour timer reset when participants join/vote/disconnect, or only when facilitator takes action? → A: Any participant activity (join, vote, reveal, clear) resets the timer

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Session Creation and Sharing (Priority: P1)

As a Scrum Master, I need to quickly create an estimation session and share it with my team so we can begin voting immediately without any setup delays.

**Why this priority**: This is the entry point for the entire application. Without the ability to create and share sessions, no other functionality is possible. This represents the minimal viable product.

**Independent Test**: Can be fully tested by creating a session, receiving a shareable link/code, and verifying the session exists. Delivers immediate value by enabling facilitators to start sessions.

**Acceptance Scenarios**:

1. **Given** I am on the application home page, **When** I click "Create New Session", **Then** a unique session is created and I receive a shareable URL
2. **Given** I have created a session, **When** I copy the session URL, **Then** the URL contains a unique session identifier (e.g., https://app.com/session/abc123xyz) that others can click to join
3. **Given** I create a session, **When** the session is created, **Then** I am automatically designated as the facilitator with control privileges

---

### User Story 2 - Participant Joining (Priority: P1)

As a team member, I need to join an estimation session using a shared URL and identify myself so the facilitator knows who is present.

**Why this priority**: Essential for any collaborative functionality. Without participants joining, voting cannot occur. This is the second critical piece of the MVP.

**Independent Test**: Can be fully tested by using a session URL to join, providing a display name, and verifying presence in the session participant list.

**Acceptance Scenarios**:

1. **Given** I have received a session link, **When** I click the link, **Then** I am taken to the session join page
2. **Given** I am on the session join page, **When** I enter my display name and click "Join", **Then** I enter the session and can see other participants
3. **Given** I have joined a session, **When** another participant joins, **Then** I can see their name appear in the participant list in real-time
4. **Given** I attempt to join with an empty name, **When** I click "Join", **Then** I see an error message requesting a valid display name
5. **Given** I attempt to join an expired or non-existent session, **When** I submit the join request, **Then** I see a clear error message indicating the session is unavailable

---

### User Story 3 - Concealed Voting (Priority: P1)

As a team member, I need to select my estimate from a voting deck without seeing others' votes so my judgment isn't influenced by anchoring bias.

**Why this priority**: Core functionality of Planning Poker. Concealed voting is what differentiates Planning Poker from simple discussion and eliminates anchoring bias.

**Independent Test**: Can be fully tested by selecting an estimate, verifying it's hidden from others, and confirming the vote is recorded. Delivers the primary value proposition of Planning Poker.

**Acceptance Scenarios**:

1. **Given** I am in an active session, **When** I view the voting interface, **Then** I see a deck of estimation values (Fibonacci sequence: 0, 1, 2, 3, 5, 8, 13, 21)
2. **Given** I select an estimate, **When** I click on a card value, **Then** my vote is recorded and a checkmark/badge icon appears next to my name but my vote value is not revealed to others
3. **Given** I have cast a vote, **When** I view the participant list, **Then** I see a checkmark icon next to my name indicating I have voted but not my actual vote value
4. **Given** other participants have voted, **When** I view the participant list, **Then** I see checkmark icons next to their names showing who has voted but not their vote values
5. **Given** I have voted, **When** I change my mind before reveal, **Then** I can select a different card and my vote is updated

---

### User Story 4 - Simultaneous Reveal (Priority: P1)

As a facilitator, I need to reveal all votes simultaneously so the team can see everyone's estimates at once and begin discussion.

**Why this priority**: Completes the core Planning Poker cycle. Without reveal, votes remain hidden forever and no consensus discussion can begin. Essential for MVP.

**Independent Test**: Can be fully tested by having participants vote, triggering reveal, and verifying all votes become visible simultaneously to all participants.

**Acceptance Scenarios**:

1. **Given** participants have cast votes, **When** I (as facilitator) click "Reveal Votes", **Then** all votes are displayed simultaneously to all participants
2. **Given** votes are revealed, **When** participants view the results, **Then** they see each participant's name next to their vote value
3. **Given** not all participants have voted, **When** I attempt to reveal, **Then** I see a confirmation prompt indicating how many participants haven't voted yet and asking whether to proceed with reveal or cancel
4. **Given** I confirm the reveal with incomplete votes, **When** the reveal proceeds, **Then** all cast votes are displayed and non-voters are shown as "not voted" or similar indicator
5. **Given** I see the confirmation prompt for incomplete votes, **When** I cancel the reveal, **Then** the session remains in voting state and participants can continue voting
6. **Given** votes are revealed, **When** a new participant views the session, **Then** they see the revealed votes (state is synchronized)

---

### User Story 5 - Round Management (Priority: P2)

As a facilitator, I need to clear votes and start a new round for the next backlog item so the team can continue estimating without creating a new session.

**Why this priority**: Enables continuous estimation flow within one session. While P1 features enable single-item estimation, this allows efficient multi-item estimation which is the typical use case.

**Independent Test**: Can be fully tested by revealing votes, clearing them, and verifying the session returns to a fresh voting state while maintaining participants.

**Acceptance Scenarios**:

1. **Given** votes have been revealed, **When** I (as facilitator) click "Clear Votes", **Then** all votes are removed and the session returns to voting state
2. **Given** votes have been cleared, **When** participants view their interface, **Then** they see an empty voting state ready for the next item
3. **Given** votes are cleared, **When** participants rejoin the view, **Then** no previous vote data is visible (data is discarded)
4. **Given** I am clearing votes, **When** I initiate the clear action, **Then** all participants see the transition in real-time

---

### User Story 6 - Session Presence Awareness (Priority: P2)

As a participant or facilitator, I need to see who is currently in the session and their voting status so I know who we're waiting for.

**Why this priority**: Enhances facilitation effectiveness and meeting efficiency. While not required for basic voting, it significantly improves the user experience and coordination.

**Independent Test**: Can be fully tested by joining/leaving sessions and observing real-time participant list updates.

**Acceptance Scenarios**:

1. **Given** I am in a session, **When** I view the participant list, **Then** I see all currently connected participants with their display names
2. **Given** participants are voting, **When** I view the participant list, **Then** I see checkmark icons next to the names of participants who have voted
3. **Given** a participant disconnects, **When** the connection is lost, **Then** they are removed from the participant list within 30 seconds
4. **Given** a participant reconnects, **When** they rejoin with the same session and name, **Then** they reappear in the participant list

---

### User Story 7 - Mobile-Responsive Voting (Priority: P2)

As a team member using a mobile device, I need a responsive interface that works well on small screens so I can participate regardless of device.

**Why this priority**: Real-world estimation sessions often involve remote participants on various devices. Mobile support expands accessibility but isn't required for initial MVP validation.

**Independent Test**: Can be fully tested by accessing the application on mobile devices (320px width and up) and completing a full voting cycle.

**Acceptance Scenarios**:

1. **Given** I access the application on a mobile device, **When** the page loads, **Then** the interface adapts to my screen size with readable text and tappable buttons
2. **Given** I am voting on mobile, **When** I view the voting deck, **Then** cards are arranged in a scrollable or wrappable layout that fits my screen
3. **Given** I am viewing participants on mobile, **When** the list is displayed, **Then** participant names and voting indicators are clearly visible without horizontal scrolling

---

### User Story 8 - Session Timeout Management (Priority: P3)

As a system operator (automated), I need to automatically clean up inactive sessions after a period of inactivity to prevent memory accumulation.

**Why this priority**: Important for system health and resource management but not critical for user-facing functionality in initial versions. Can be added after core features are stable.

**Independent Test**: Can be fully tested by creating a session, letting it sit idle for the timeout period (1 hour), and verifying it's removed from memory.

**Acceptance Scenarios**:

1. **Given** a session has no participants, **When** 1 hour passes with no activity, **Then** the session is removed from memory and becomes inaccessible
2. **Given** participants attempt to join an expired session, **When** they use the old link, **Then** they see a clear error message indicating session expiration
3. **Given** a session has participants performing activities (joining, voting, revealing, clearing), **When** any activity occurs, **Then** the 1-hour inactivity timer resets

---

### Edge Cases

- What happens when the facilitator disconnects during a session?

  - **Facilitator Reconnection (within 30 seconds)**: If original facilitator returns within 30-second grace period, they retain facilitator status and all control privileges. Session state is preserved and resumes normal operation.
  - **Facilitator Timeout (after 30 seconds)**: If facilitator doesn't return within 30 seconds, they are removed from the session. No other participant automatically gains facilitator privileges. Remaining participants cannot trigger reveal or clear votes. Session becomes functionally read-only for voting operations until facilitator rejoins (or session expires after 1 hour inactivity).
  - **Session Continuity**: Participants can still see current session state but cannot trigger reveal or clear votes while facilitator is absent
  - **Timeout Behavior**: If no activity occurs for 1 hour (no participant joins, votes, reveals, or clears), session expires per timeout rules regardless of facilitator status

- How does the system handle 20+ participants trying to join simultaneously?

  - System must enforce maximum 20 participant limit per constitution
  - Additional join attempts receive clear error message about capacity

- What happens when participants have duplicate display names?

  - System allows duplicates but appends a number (e.g., "John", "John (2)", "John (3)")

- How does the system handle rapid vote changes (clicking multiple cards quickly)?

  - Only the most recent selection is recorded; UI provides immediate visual feedback

- What happens when network connectivity is lost during voting?

  - Votes are cached locally and sync when connection is restored within 30 seconds
  - If connection lost for more than 30 seconds, participant is removed from session and must rejoin
  - If connection lost during reveal, participant sees "reconnecting" state with 30-second countdown

- What happens when a participant tries to vote but the facilitator has already revealed?

  - Voting interface becomes disabled; participant sees revealed results

- How does the system handle special characters or very long names?
  - Display names limited to 50 characters
  - Special characters allowed but HTML/script tags sanitized

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow facilitators to create a new estimation session with a unique URL identifier (format: base_url/session/{unique_id})
- **FR-002**: System MUST generate a shareable URL that participants can click to join the session directly
- **FR-003**: System MUST allow participants to join an active session by providing a display name
- **FR-004**: System MUST maintain a real-time participant list showing all currently connected users
- **FR-005**: System MUST provide a voting interface with Fibonacci sequence values (0, 1, 2, 3, 5, 8, 13, 21)
- **FR-006**: System MUST conceal individual votes from all participants until reveal is triggered
- **FR-007**: System MUST display a checkmark or badge icon next to participants who have voted without revealing their vote values (icon must have accessible label for screen readers)
- **FR-008**: System MUST allow facilitators to trigger simultaneous reveal of all votes
- **FR-009**: System MUST prompt facilitators for confirmation when attempting to reveal with incomplete votes, showing count of non-voters and offering proceed/cancel options
- **FR-010**: System MUST display all participants' votes visibly after reveal is triggered, with non-voters clearly marked as "not voted"
- **FR-011**: System MUST allow facilitators to clear all votes and start a new estimation round
- **FR-012**: System MUST support participants changing their vote before reveal
- **FR-013**: System MUST synchronize session state in real-time across all connected participants
- **FR-014**: System MUST enforce maximum capacity of 20 concurrent participants per session
- **FR-015**: System MUST automatically remove inactive sessions from memory after 1 hour of inactivity (inactivity = no participant joins, votes, reveals, or clears)
- **FR-016**: System MUST prevent any session data (votes, names, history) from being persisted to storage
- **FR-017**: System MUST provide clear error messages for invalid operations (invalid session ID, capacity exceeded, empty name)
- **FR-018**: System MUST handle participant disconnections gracefully and remove them from the participant list after 30 seconds of inactivity
- **FR-019**: System MUST support participant reconnection within the 30-second grace period with minimal disruption to ongoing sessions
- **FR-020**: System MUST sanitize display names to prevent XSS attacks
- **FR-021**: System MUST limit display names to 50 characters maximum
- **FR-022**: System MUST handle duplicate display names by appending a differentiator

### Key Entities

- **Session**: Represents an active estimation meeting; contains unique identifier, facilitator reference, participant list, current voting state (concealed/revealed), and creation timestamp. Sessions exist only in memory.

- **Participant**: Represents a person in the session; contains display name, connection status, and current vote value. No persistent identifier or authentication.

- **Vote**: Represents a single estimation; contains selected card value and associated participant reference. Votes are ephemeral and cleared between rounds.

- **VotingDeck**: Represents the available estimation values; contains Fibonacci sequence (0, 1, 2, 3, 5, 8, 13, 21). Fixed configuration, not data storage.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Facilitators can create a session and share the link in under 10 seconds
- **SC-002**: Participants can join a session and cast their first vote in under 30 seconds
- **SC-003**: Vote reveal displays all votes simultaneously to all participants with less than 500ms latency
- **SC-004**: Application supports 20 concurrent participants per session without performance degradation
- **SC-005**: Application loads initial page in under 2 seconds on 3G connection
- **SC-006**: 95% of user actions (vote, reveal, clear) receive visual feedback within 100ms
- **SC-007**: Application functions correctly on mobile devices with screen widths down to 320px
- **SC-008**: Zero user data persisted to storage (verifiable through code review and monitoring)
- **SC-009**: Inactive sessions are cleaned up within 1 hour, preventing memory leaks
- **SC-010**: A full estimation round (create/join → vote → reveal → clear) can be completed without errors in under 2 minutes by a new user (verifiable via E2E and manual QA)

## Assumptions

- Participants have basic internet connectivity and modern web browsers (last 2 versions of Chrome, Firefox, Safari, Edge)
- Sessions are intended for synchronous use (all participants online at the same time)
- The Fibonacci sequence (0, 1, 2, 3, 5, 8, 13, 21) is the standard estimation deck for Planning Poker
- Display names are sufficient for participant identification within the session context (no email or authentication needed)
- Single facilitator per session is sufficient (no co-facilitator or facilitator transfer scenarios initially)
- Sessions are short-lived (typical estimation meeting is under 2 hours)
- No need for session history, voting analytics, or reporting features
- No integration with external tools (Jira, Azure Boards, etc.) in initial version

## Dependencies

- Real-time communication capability (WebSockets, Server-Sent Events, or similar technology for live updates)
- In-memory session storage (no database required for MVP)
- Basic hosting infrastructure with ability to maintain WebSocket connections

## Out of Scope

- User authentication or persistent accounts
- Historical data, analytics, or reporting on past sessions
- Integration with external project management tools
- Custom voting decks or configurable card values
- Multi-facilitator or facilitator transfer functionality
- Session recording or playback
- Chat or discussion features beyond the core voting functionality
- Team management or organization structure
- Session scheduling or calendar integration
- Email notifications or reminders
