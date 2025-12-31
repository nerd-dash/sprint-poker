# Performance Checklist: Planning Poker Session Application

Purpose: Define measurable performance requirements, testing methods, and recovery/rollback expectations.

Created: 2025-12-31

- [X] PERF001 - Is "fast loading" quantified with concrete thresholds and test conditions (e.g., initial page load <2s on 3G, measured with Lighthouse vX)? [Spec §SC-005]
- [X] PERF002 - Is reveal latency requirement (<500ms) tied to measurement methods and environments (client+server latency tests, synthetic and real-world)? [Spec §SC-003]
- [X] PERF003 - Are visual feedback timing requirements quantified (95% actions <100ms) and testable under load? [Spec §SC-006]
- [X] PERF004 - Are load conditions for 20 concurrent participants defined with expected behavior and measurement plan (latency, message loss, memory use)? [Spec §SC-004]
- [X] PERF005 - Is degradation behavior defined (what UI/UX is shown when latency > threshold or capacity reached)? [Coverage, Edge Cases]  
	- Behavior: display a clear user-facing error message when latency/capacity thresholds are exceeded; provide guidance to retry or wait and show ephemeral non-identifying status (e.g., "Connection unstable — please retry").
- [X] PERF006 - Are performance test types and CI integration specified (local load tests, Playwright scenarios, synthetic latency injection)? [Plan §Testing]
- [X] PERF007 - Are recovery and rollback expectations documented for server restarts (what happens to in-memory sessions, expected user messaging, potential persistence exemptions)? [Risk/Recovery, Spec §Out of Scope]  
	- Decision: No session or vote data is persisted. On server restart sessions are lost; clients should display an "Session unavailable or expired" error and offer to create a new session. This enforces the privacy-by-design constraint (no persistence).
- [X] PERF008 - Is monitoring instrumentation defined (which metrics are collected, redaction rules consistent with privacy guardrails)? [Plan §Performance Goals, Plan §Privacy Guardrails]
- [X] PERF009 - Are performance acceptance thresholds included in traceability (which success criteria map to which tests)? [Traceability, Spec §Success Criteria]
