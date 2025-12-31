# Security & Privacy Checklist: Planning Poker Session Application

Purpose: Validate security/privacy requirement quality and resolve the zero-logging vs monitoring conflict.

Created: 2025-12-31

- [ ] SEC001 - Is the "no persistence" requirement (FR-016) accompanied by explicit verification steps (code-review checklist, CI checks to prevent DB/file writes)? [Spec §FR-016]
- [ ] SEC002 - Is sanitization behavior for display names specified with testable rules (allowed charset, forbidden tags, escaping policy)? [Spec §FR-020]
- [ ] SEC003 - Is XSS mitigation quantified and mapped to test types (unit sanitization tests + integration sanitization checks)? [Spec §FR-020]
- [ ] SEC004 - Is the conflict between "zero logging" and operational monitoring documented with acceptable exceptions and redaction rules (e.g., log only coarse events, no identifiers)? [Plan §Privacy Guardrails]
- [ ] SEC005 - Are data retention and ephemeral-only guarantees specified for all telemetry and logs (what is retained, for how long, and where)? [Plan §Privacy Guardrails]
- [ ] SEC006 - Are authentication/authorization boundaries clarified for facilitator actions (reveal/clear) and are server-side guards specified? [Spec §User Scenarios]
- [ ] SEC007 - Are rate-limiting and abuse-mitigation requirements specified with thresholds and enforcement actions (vote spam, create/join rate limits)? [Plan §Rate Limiting]
- [ ] SEC008 - Is threat modelling included or referenced (attack surface, sensitive flows, confidentiality requirements)? [Plan §Technical Context]
- [ ] SEC009 - Are incident/breach response expectations defined when ephemeral in-memory sessions are exposed (who is notified, required mitigations)? [Risk]
- [ ] SEC010 - Are traceability links to specific spec/plan sections present for each security requirement to aid verification? [Traceability, Spec §FR-016, Plan §Privacy Guardrails]
