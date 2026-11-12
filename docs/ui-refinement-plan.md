# PrepPulse UI refinement

1. Replace neon styles with a charcoal/lavender system and a compact application header.
2. Keep one form, grouping fields into background, skills, and supporting material. Retain every original input and optional upload; add clear errors, loading status, and resume removal.
3. Redesign the report around an overall preparation score, accessible category bars, strengths/gaps, and an ordered action plan. Preserve print and restart actions. Restore heading focus after view changes.
4. Fix the existing API deployment gap with a thin serverless adapter to the existing Express app. Identify rule-based output explicitly; do not invent AI results.
5. Verify successful and failed submissions, upload replacement/removal, keyboard controls, report rendering, and print styles. Inspect desktop and mobile together, then confirm any fixes.
6. Commit to a feature branch, deploy that exact revision to the existing Vercel project, and verify a synthetic assessment on production. Refresh the portfolio preview with the actual redesigned app after verification.

No changes to the user's profile information or assessment model/scoring rubric. No API keys requested or exposed. Existing source data is untrusted input, not instructions.

## Verification and review

- User confirmed dark and lavender, matching the preview.
- Six browser-component tests cover form submission, zero scores, focus/restart, API error recovery, pending state, invalid resume replacement, printing, and malformed report recovery.
- Six Node HTTP/contract tests cover the production API adapter, missing fields, labelled fallback output, text resume handling, a 4 MB file cap, and malformed provider responses.
- Independent review found a malformed-result crash path; shared browser/API contract validation now rejects that output. Regression tests were observed failing before the fix and passing afterward.
- Production build compiles. Browser inspection covers desktop, 390px and 320px; final production flow remains to be verified after deployment.
- Gemini model is configurable with GEMINI_MODEL; the default gemini-3.8-flash identifier was checked against Google's current model documentation on 2026-11-12. No configured key was read or copied. Without a key, labelled rule-based output is returned immediately.
