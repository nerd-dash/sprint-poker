# Requirements Checklist: Planning Poker Session Application

Purpose: Unit-tests-for-English checklist validating the quality of requirements in `specs/001-poker-session-app`.

Created: 2025-12-31

Focus: Reviewer-focused, standard depth. Audience: PR Reviewer.

## Requirement Completeness

- [X] CHK001 - Are all primary user journeys (create → join → vote → reveal → clear) explicitly listed in the spec? [Completeness, Spec §User Scenarios] [Spec §User Scenarios](specs/001-poker-session-app/spec.md#L18)
- [X] CHK002 - Are all functional requirements necessary to support the primary journeys present (session creation, join, voting, reveal, clear)? [Completeness, Spec §FR-001..FR-012] [Spec §FR-001..FR-012](specs/001-poker-session-app/spec.md#L197-L208)
- [X] CHK003 - Are non-functional requirements (performance, latency, mobile support, accessibility) present and mapped to relevant user journeys? [Completeness, Spec §Success Criteria] [Spec §Success Criteria](specs/001-poker-session-app/spec.md#L230)
- [X] CHK004 - Are all required error states and failure modes documented (invalid session ID, capacity exceeded, expired session, network disconnect)? [Completeness, Spec §Acceptance Scenarios, Edge Cases] [Spec §Edge Cases](specs/001-poker-session-app/spec.md#L157)

## Requirement Clarity

- [X] CHK005 - Is the session identifier format and generation mechanism clearly specified and measurable (length, charset, uniqueness guarantees)? [Clarity, Spec §FR-001, Clarifications] [Spec §FR-001](specs/001-poker-session-app/spec.md#L197) [Clarifications](specs/001-poker-session-app/spec.md#L10)
- [X] CHK006 - Is the facilitator role and its exact privileges defined (who can reveal/clear, rules on transfer or absence)? [Clarity, Spec §User Scenarios, Edge Cases] [User Story 1](specs/001-poker-session-app/spec.md#L20) [Edge Cases](specs/001-poker-session-app/spec.md#L161)
- [X] CHK007 - Is the concept of "inactivity" and the 1-hour timeout precisely defined (what actions count, when timer resets)? [Clarity, Spec §Edge Cases, FR-015] [Timeout Behaviour](specs/001-poker-session-app/spec.md#L164) [Spec §FR-015](specs/001-poker-session-app/spec.md#L211)
- [X] CHK008 - Is the checkmark/badge accessibility requirement specified with an accessible label and behavior for screen readers? [Clarity, Spec §FR-007] [Spec §FR-007](specs/001-poker-session-app/spec.md#L203)

## Requirement Consistency

- [X] CHK009 - Are participant capacity rules consistent across spec, plan, and tasks (max 20 per session referenced in Edge Cases and FR-014)? [Consistency, Spec §Edge Cases, FR-014] [Spec §Edge Cases](specs/001-poker-session-app/spec.md#L157) [Spec §FR-014](specs/001-poker-session-app/spec.md#L210)
- [X] CHK010 - Are timeout/grace period values consistent between user scenarios and foundation plan (30s grace, 1h session expiry)? [Consistency, Spec §Clarifications, Plan §Heartbeat/Connection Tracking] [Spec §Clarifications](specs/001-poker-session-app/spec.md#L13) [Plan §Heartbeat/Connection Tracking](specs/001-poker-session-app/plan.md#L374)
- [X] CHK011 - Are statements about "no persistence" consistent with success criteria and verification strategy (e.g., SC-008 + Constitution Principle I)? [Consistency, Spec §FR-016, Spec §SC-008, Plan §Privacy Guardrails] [Spec §FR-016](specs/001-poker-session-app/spec.md#L212) [Spec §SC-008](specs/001-poker-session-app/spec.md#L242) [Plan §Privacy Guardrails](specs/001-poker-session-app/plan.md#L379)

## Acceptance Criteria Quality

- [X] CHK012 - Are success metrics measurable and tied to specific journeys (e.g., create session <10s, reveal latency <500ms)? [Measurability, Spec §SC-001..SC-003] [Spec §SC-001](specs/001-poker-session-app/spec.md#L234) [Spec §SC-003](specs/001-poker-session-app/spec.md#L236)
- [X] CHK013 - Are acceptance criteria mapped to verifiable test types (unit/integration/E2E) in the plan or tasks? [Measurability, Plan §Testing, Tasks] [Plan §Testing](specs/001-poker-session-app/plan.md#L301) [Tasks](specs/001-poker-session-app/tasks.md#L1)
- [X] CHK014 - Are performance thresholds (load times, feedback timings) realistic and accompanied by measurement method (e.g., Lighthouse, latency monitoring)? [Measurability, Spec §SC-003, Plan §Performance Goals] [Spec §SC-003](specs/001-poker-session-app/spec.md#L236) [Plan §Performance Goals](specs/001-poker-session-app/plan.md#L26)

## Scenario Coverage

- [X] CHK015 - Are primary, alternate, exception, and recovery scenarios covered for the voting lifecycle (normal vote, change vote, reveal with incomplete votes, facilitator absent)? [Coverage, Spec §User Scenarios, Edge Cases] [User Scenarios](specs/001-poker-session-app/spec.md#L18) [Edge Cases](specs/001-poker-session-app/spec.md#L157)
- [X] CHK016 - Are multi-device and mobile scenarios specified with clear breakpoint requirements and interaction expectations? [Coverage, Spec §User Story 7, Spec §SC-007] [User Story 7](specs/001-poker-session-app/spec.md#L125) [Spec §SC-007](specs/001-poker-session-app/spec.md#L238)
- [X] CHK017 - Is concurrency/load behavior specified for the "20+ participants" case and the expected system response defined? [Coverage, Spec §Edge Cases, FR-014, SC-004] [Spec §Edge Cases](specs/001-poker-session-app/spec.md#L157) [Spec §FR-014](specs/001-poker-session-app/spec.md#L210) [Spec §SC-004](specs/001-poker-session-app/spec.md#L237)

## Edge Case Coverage

- [X] CHK018 - Is the behavior for facilitator disconnection defined for all time-frames (within 30s grace, after 30s) and are consequences unambiguous? [Edge Case, Spec §Edge Cases] [Spec §Edge Cases](specs/001-poker-session-app/spec.md#L161)
- [X] CHK019 - Are duplicate display-name handling rules described clearly (naming convention, user-facing text)? [Edge Case, Spec §Edge Cases, FR-022] [Spec §FR-022](specs/001-poker-session-app/spec.md#L218)
- [X] CHK020 - Is the offline/reconnect behavior defined for partial network outages including local caching expectations and sync guarantees? [Edge Case, Spec §Edge Cases] [Spec §Offline/Recover](specs/001-poker-session-app/spec.md#L181)

## Non-Functional Requirements

- [X] CHK021 - Are accessibility requirements (WCAG AA) specified with testable checkpoints (keyboard nav, ARIA labels, color contrast)? [NFR, Plan §Constitution IV, Spec §FR-007] [Plan §Constitution IV](specs/001-poker-session-app/plan.md#L74) [Spec §FR-007](specs/001-poker-session-app/spec.md#L203)
- [X] CHK022 - Are performance requirements quantifiable and scoped to specific user journeys and environments (3G, 20 users)? [NFR, Spec §SC-001..SC-006, Plan §Performance Goals] [Spec §SC-001](specs/001-poker-session-app/spec.md#L234) [Plan §Performance Goals](specs/001-poker-session-app/plan.md#L26)
- [X] CHK023 - Are security/privacy requirements measurable (no persistence, sanitization rules, XSS prevention) and mapped to verification steps? [NFR, Spec §FR-016, FR-020, Plan §Privacy Guardrails] [Spec §FR-016](specs/001-poker-session-app/spec.md#L212) [Spec §FR-020](specs/001-poker-session-app/spec.md#L216) [Plan §Privacy Guardrails](specs/001-poker-session-app/plan.md#L379)

## Dependencies & Assumptions

- [X] CHK024 - Are external dependencies (Socket.IO, SSR, hosting constraints) and their impact on requirements explicitly documented? [Dependencies, Plan §Technical Context] [Plan §Technical Context](specs/001-poker-session-app/plan.md#L12)
- [X] CHK025 - Are assumptions about browser support and connectivity surfaced and justified for acceptance testing (last 2 browser versions, synchronous use)? [Assumption, Spec §Assumptions] [Spec §Assumptions](specs/001-poker-session-app/spec.md#L245)
- [X] CHK026 - Is the in-memory-only storage assumption and its operational limits (100 sessions, memory footprint) documented and validated as an explicit requirement? [Assumption, Plan §Complexity Tracking, Spec §Dependencies] [Plan §Complexity Tracking](specs/001-poker-session-app/plan.md#L40) [Spec §Dependencies](specs/001-poker-session-app/spec.md#L253)

## Ambiguities & Conflicts

- [X] CHK027 - Are any ambiguous terms used (e.g., "fast loading", "minimal disruption") quantified or flagged for clarification? [Ambiguity, Spec §Success Criteria] [Spec §Success Criteria](specs/001-poker-session-app/spec.md#L230)
- [X] CHK028 - Do any requirements conflict (e.g., zero logging vs. operational monitoring needs) and is a resolution path documented? [Conflict, Plan §Privacy Guardrails] [Plan §Privacy Guardrails](specs/001-poker-session-app/plan.md#L379)

## Traceability & References

- [X] CHK029 - Is each functional requirement linked to at least one acceptance criterion and test type (unit/integration/E2E) for traceability? [Traceability, Spec §Requirements, Plan §Testing] [Spec §Requirements](specs/001-poker-session-app/spec.md#L193) [Plan §Testing](specs/001-poker-session-app/plan.md#L301)
- [X] CHK030 - Is an ID scheme for requirements and acceptance criteria established and used consistently across spec, plan, tasks, and contracts? [Traceability, Spec §Requirements] [Spec §Requirements](specs/001-poker-session-app/spec.md#L193)

## Delivery Risks & Mitigations

 - [X] CHK031 - Are high-risk requirements identified (real-time sync, <500ms latency, no persistence) and mitigations documented? [Risk, Plan §Performance Goals, Plan §Privacy Guardrails] [Plan §Performance Goals](specs/001-poker-session-app/plan.md#L26) [Plan §Privacy Guardrails](specs/001-poker-session-app/plan.md#L379)
	 - Decision: Team has chosen not to document additional mitigations for the identified risks in this scope. This is an accepted project decision for the MVP.
- [X] CHK032 - Are rollback or recovery expectations documented for server process restarts (what happens to in-memory sessions)? [Risk/Recovery, Spec §Out of Scope, Edge Cases] [Spec §Out of Scope](specs/001-poker-session-app/spec.md#L262)  
	- Decision: No session or vote data is persisted. On server restart sessions are lost; clients must display a clear "Session unavailable or expired" error and offer to create a new session. This enforces the privacy-by-design constraint (no persistence).

## Final Sanity Checks

 - [X] CHK033 - Are UX-level visible behaviors (e.g., error text for expired session) specified with exact copy or a placeholder requirement to avoid UX gaps? [Clarity, Spec §Acceptance Scenarios] [Spec §Acceptance Scenarios](specs/001-poker-session-app/spec.md#L49) [Spec §FR-017](specs/001-poker-session-app/spec.md#L213)
	 - Decision: Use Angular Material layout and components for error and feedback UI to avoid UX gaps; exact copy to follow Material patterns.
 - [X] CHK034 - Are internationalization/encoding considerations (special characters in display names) covered and testable? [Coverage, Spec §Edge Cases, FR-020, FR-021] [Spec §FR-020](specs/001-poker-session-app/spec.md#L216) [Spec §FR-021](specs/001-poker-session-app/spec.md#L217)
	 - Decision: MVP will be English-only; full i18n deferred to future work.

---

Notes:

- Many items reference `Spec` sections; reviewers should annotate which section (line/paragraph) satisfies each checklist item or mark with [Gap] when missing.
- This file is intentionally created as a new checklist for the feature; run again to append additional domain-specific checklists (security.md, performance.md) if needed.
