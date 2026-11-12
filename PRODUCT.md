# PrepPulse

An interview preparation self-assessment for students and early-career job seekers. A visitor supplies a target role, education, experience, skills, self-rated communication confidence, optional profile links, and an optional PDF/TXT resume. The app returns a readiness score, category breakdown, strengths, gaps, and action items, with report printing and restart.

The score is preparation guidance, not a hiring prediction. Gemini analysis has an existing rule-based fallback. The interface must distinguish those modes and recover from request errors. Preserve field names, payload shape, optional uploads, and current scoring behavior. Current production API returns 404; deployment must route requests to the existing Express service.

Visual direction proposed from the portfolio preview: restrained charcoal and lavender, readable text, no neon gradients, emoji decoration, or perpetual animation. User confirmed dark and lavender, matching the portfolio preview.

Production upload cap: 4 MB, leaving room for multipart fields within the Vercel Function request limit.
