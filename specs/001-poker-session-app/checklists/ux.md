# UX Checklist: Planning Poker Session Application

Purpose: Validate UX requirement clarity, copy for edge cases, accessibility, and keyboard navigation.

Created: 2025-12-31

- [x] UX001 - Are exact copy and tone defined for all critical user-facing error states (session expired, capacity exceeded, network lost)? [Coverage, Spec §FR-018]
  - Decision: Use Angular Material dialog/snackbar patterns and tone consistent with Material guidelines for error and recovery messaging.
- [x] UX002 - Are keyboard navigation and focus management requirements defined for all interactive controls (cards, vote buttons, reveal, copy link)? [Coverage, Accessibility]
- [x] UX003 - Is visual hierarchy specified for competing elements on the session screen (vote controls vs timer vs participants)? [Clarity, Spec §FR-007]
  - Decision: Follow Material Design layout and component hierarchy (primary actions prominent, timer secondary, participant list tertiary) to avoid UX gaps.
- [x] UX004 - Are responsive breakpoint behaviors specified for mobile/tablet/desktop including layout and interactions? [Completeness]
- [x] UX005 - Are loading, empty, and error states specified with content, accessible labels, and ARIA roles? [Accessibility, Edge Cases]
- [x] UX006 - Is i18n/localization strategy defined for copy and date/time formats? [Non-Functional, Spec §Assumptions]
  - Decision: MVP will be English-only; full i18n deferred.
- [x] UX007 - Are color contrast and focus styles defined and checked against AXE/WCAG AA? [Accessibility, Spec §NFR-Accessibility]
- [x] UX008 - Are success and failure messaging flows consistent and traceable to acceptance criteria? [Consistency, Traceability]
- [x] UX009 - Is the copy for the "copy link" action defined including feedback text and accessible announcements? [Clarity, Spec §FR-009]
  - Copy (snackbar): "Session link copied to clipboard."
  - Copy (error): "Unable to copy link — please try again."
  - ARIA announcement (polite): "Session link copied." Use `aria-live="polite"` on the feedback region.
  - Implementation note: Use Angular Material `MatSnackBar` for visual feedback and `aria-live` region for screen readers; ensure focus is not stolen when announcing.
- [x] UX010 - Are expectations for offline/poor network UX defined (grace period behavior, message retries)? [Edge Case, Spec §FR-014]
