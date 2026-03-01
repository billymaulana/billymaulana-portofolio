# Case Study Methodology — Awwwards Winners

Reference document for structuring portfolio case studies, developer spotlights,
blog write-ups, video walkthroughs, and submission strategy for Awwwards recognition.
Distilled from patterns observed across SOTD/SOTM/SOTY winners.

---

## 1. Case Study Structure Template

Winning Awwwards case studies follow a consistent 11-section arc.
Each section serves a specific narrative purpose.

### 1.1 Hero Section

- **Full-bleed visual** — browser mockup, animated screenshot, or video loop.
- Show the site in its most impressive state (usually homepage above-fold).
- Include project title, client name, year, and your role in a minimal overlay.
- Use the actual project's color palette and typography as styling cues.

### 1.2 Project Overview

- **One paragraph** (3-5 sentences) summarizing what the project is.
- Mention the client's industry, project scope (redesign, launch, campaign).
- Highlight what makes it noteworthy in one clear sentence.
- Key metadata block: Client, Role, Year, Duration, Team Size, Tech Stack, URL.

### 1.3 Challenge / Brief

- What problem did the client face? What constraint was interesting?
- Frame it as a tension: "The brand needed X, but the existing site was Y."
- Include quantifiable stakes when possible (traffic, conversion, brand perception).
- Keep it honest — jury members spot exaggerated briefs.

### 1.4 Concept & Direction

- The creative idea that solved the brief.
- Show mood boards, references, early sketches, or direction decks.
- Explain the "why" behind the visual direction (not just "we liked blue").
- Connect concept to the challenge — the concept should feel inevitable.

### 1.5 Design Process

- **Visual progression**: wireframes, lo-fi, hi-fi, final.
- Typography selection rationale (why this font system).
- Color theory application (what the palette communicates).
- Grid system and layout logic (show the underlying structure).
- Component design: show key UI elements in isolation.
- Include real iteration artifacts — before/after comparisons resonate.

### 1.6 Motion & Interaction Design

- **Video or GIF** for every significant interaction.
- Explain the motion principle (spring physics, easing curves, stagger logic).
- Show the interaction flow: trigger, animation, resolution.
- Demonstrate hover states, page transitions, scroll-linked animations.
- If using shaders/WebGL, include a technical breakdown with visuals.

### 1.7 Technical Deep-Dive

- Architecture diagram (framework, rendering, state management).
- Performance metrics: Lighthouse scores, Core Web Vitals, bundle size.
- Shader/WebGL implementation details (GLSL snippets, FBO diagrams).
- Accessibility approach: how you handled reduced motion, keyboard nav, ARIA.
- Custom tools or libraries built for the project.

### 1.8 Responsive & Adaptive Design

- Side-by-side comparisons: desktop, tablet, mobile.
- Explain what changes per breakpoint (not just resizing).
- Show how WebGL/canvas effects degrade or adapt on mobile.
- Touch interaction alternatives for mouse-dependent features.

### 1.9 Results & Impact

- Before/after metrics (performance, engagement, brand recognition).
- Awards received, press mentions, community reception.
- Client testimonial (even one sentence adds credibility).
- Link to live site and any recognition badges.

### 1.10 Credits

- List every team member with their role.
- Credit collaborators, font foundries, photographers, clients.
- Awwwards jury values transparency — never claim solo credit for team work.

### 1.11 Next Project / Navigation

- Transition to the next case study with a visual teaser.
- Use a page transition that reinforces your design language.
- Include a clear CTA to return to overview or contact.

---

## 2. Codrops Developer Spotlight Format

Codrops-style write-ups are technical deep-dives aimed at developer audiences.
They serve a dual purpose: community contribution and technical credibility.

### Structure

```
1. Introduction / Demo Link
   - Embed or link to live demo immediately.
   - One paragraph context: what the effect is, where it's used.

2. Core Concept
   - Explain the algorithm/technique in plain language.
   - Use diagrams for spatial concepts (FBO ping-pong, SDF fields).

3. Implementation Walkthrough
   - Step-by-step code with commentary.
   - Start from the simplest version, layer complexity.
   - Show the GLSL / JS in tandem.

4. Performance Considerations
   - GPU profiling results (frame times, draw calls).
   - Optimization techniques applied.
   - Fallback strategy for low-end devices.

5. Accessibility
   - How the effect respects prefers-reduced-motion.
   - Fallback for screen readers.

6. Source Code / Resources
   - Link to repo or CodePen.
   - List inspirations and references.
```

### Tone

- Tutorial, not showcase. Teach, don't brag.
- Use first-person sparingly. Focus on the technique, not the author.
- Include "gotchas" and things that went wrong — builds trust.

---

## 3. Portfolio Case Study Best Practices

### Optimal Count

- **3 to 5 case studies** is the sweet spot for a solo portfolio.
- Fewer than 3 feels thin; more than 6 dilutes attention.
- Quality beats quantity every time — jury spends 2-3 minutes per site max.

### Depth Tiers

| Tier | Count | Depth | Purpose |
|------|-------|-------|---------|
| Hero | 1-2 | Full 11-section treatment | Awwwards submission anchor |
| Featured | 2-3 | 6-8 sections (skip wireframes, reduce process) | Portfolio depth |
| Archive | 3-5 | Card with title, thumbnail, tags, one-liner | Shows range without overhead |

### Personal Projects vs Client Work

- **Personal projects** are acceptable and often win SOTD — especially portfolios.
- Frame personal work as "self-initiated" with clear goals, not "just for fun."
- Show the same rigor as client work: brief, concept, execution, results.
- For portfolio sites: treat yourself as the client with real constraints.

### Narrative Arc

- Every case study should read like a story: tension, insight, resolution.
- Open with the most visually impressive artifact.
- End with impact — what changed because this work exists.
- Avoid chronological process dumps: curate the journey.

---

## 4. Video Walkthrough Best Practices

### Structure

```
0:00 - 0:05   Title card (project name, your name, year)
0:05 - 0:15   Hero shot — most impressive visual moment
0:15 - 0:45   Full page scroll-through at natural pace
0:45 - 1:15   Interaction highlights (hover, click, transitions)
1:15 - 1:30   Mobile/responsive demonstration
1:30 - 1:45   Technical detail (DevTools, shader editor, or code)
1:45 - 2:00   Closing card (URL, social handles)
```

### Timing

- **60-120 seconds** total for Awwwards submission videos.
- Never exceed 2 minutes — jury has limited time.
- Front-load the best moments in the first 10 seconds.

### Recording Tips

- Record at 1440p or 4K, export at 1080p for sharp downscale.
- Use a clean browser (no bookmarks bar, no extensions visible).
- Smooth, deliberate mouse movements — avoid jittery cursor.
- Record at 60fps for fluid motion showcase.
- Use screen recording tools: OBS (free), ScreenFlow (macOS), Kap (macOS, lightweight).

### Audio

- No voiceover for Awwwards submissions (keep it visual).
- Subtle ambient music optional — must match the project's mood.
- If adding music, use royalty-free sources (Artlist, Epidemic Sound).

### Export

- Format: MP4 (H.264) or WebM.
- Max file size: keep under 50MB for fast loading.
- Host on Vimeo (preferred for quality) with direct link.

---

## 5. Medium/Blog Case Studies

### Format

- **1500-2500 words** is the sweet spot for technical case studies.
- Lead with a full-width image or video embed.
- Break text with visuals every 200-300 words.
- Use code blocks with syntax highlighting for technical sections.

### Tone

- Conversational but precise. Not academic, not chatty.
- First person singular for solo work, first person plural for team.
- Acknowledge limitations and trade-offs — honesty builds credibility.
- Write for the developer who wants to learn the technique.

### What Makes Compelling

- **Specificity**: "We used a 128x128 velocity FBO" beats "We optimized the shader."
- **Visual proof**: Every claim should have a screenshot or video.
- **Tension**: What almost didn't work? What was the breakthrough moment?
- **Actionable takeaways**: Reader should learn something they can apply.
- **Metrics**: Frame rates, Lighthouse scores, load times with evidence.

### Distribution

- Publish on personal blog first (SEO ownership).
- Cross-post to Medium, dev.to, or Hashnode with canonical URL.
- Share on Twitter/X with a thread summarizing key insights.
- Submit to Codrops, CSS-Tricks, or Smashing Magazine for wider reach.

---

## 6. Studio Process Documentation

### Immersive Garden Approach

Immersive Garden (multiple SOTY winner) documents their process with:

- **Concept phase**: Mood boards shared publicly, showing creative exploration.
- **Prototyping**: WebGL proof-of-concept videos before full build.
- **Iteration artifacts**: Show the messy middle, not just polished output.
- **Team credits**: Every project page names individual contributors.
- **Behind-the-scenes**: Short BTS videos showing the team at work.

### Lusion Pipeline

Lusion (formerly known for their Three.js work) follows:

- **R&D spikes**: Dedicated experimentation time before project kick-off.
- **Shader library**: Internal tools documented and occasionally open-sourced.
- **Performance budgets**: Set early and tested throughout development.
- **Device testing matrix**: Documented which effects run on which hardware.
- **Post-mortem**: Internal write-up of what went well and what to improve.

### Active Theory Methodology

Active Theory (now part of MediaMonks/S4 Capital) documented:

- **Technology-first briefs**: Start with what's technically possible, then design around it.
- **WebGL prototyping**: Rapid proof-of-concept before design phase.
- **Collaborative tools**: Real-time design-dev feedback loops using shared environments.
- **Open-source contributions**: Releasing tools and experiments to the community.

### Applying Studio Methods as a Solo Developer

- Maintain a personal R&D log (shader experiments, prototype videos).
- Document your "studio pipeline" even if it's just you.
- Show process artifacts in case studies — proves craft, not just output.
- Open-source one technique per project for community credibility.

---

## 7. Submission Strategy

### Thumbnail

- **1400x960px** recommended size.
- Show the hero section in its most visually striking state.
- Avoid browser chrome in the thumbnail — crop to content.
- Use the project's actual colors; do not add artificial overlays.
- Test at small sizes (200px wide) — must be legible and eye-catching.

### Video

- Upload to Vimeo or YouTube (Vimeo preferred for quality).
- 60-90 seconds showcasing the best moments.
- Start with the "wow" moment, not the loading screen.
- Include responsive views briefly (5-10 seconds).

### Timing

- **Submit Tuesday through Thursday** — jury is most active mid-week.
- Avoid submitting during major holidays or award seasons (CSS Design Awards, FWA).
- Monitor the Awwwards calendar for conference weeks (jury may be traveling).
- Best months: September through November (industry is focused, pre-holiday push).

### Optimization Before Submission

- Run Lighthouse audit — aim for 90+ on Performance, Accessibility, Best Practices.
- Test on real mobile devices (not just DevTools emulation).
- Verify all interactions work in Chrome, Firefox, and Safari.
- Check that `prefers-reduced-motion` fallbacks are in place.
- Ensure fonts load quickly (preload critical fonts, use `font-display: swap`).
- Verify og:image, og:title, og:description for social sharing.
- Test from multiple geographic locations (use WebPageTest or similar).

### Categories & Tags

- Choose the most specific category (Portfolio, Agency, E-commerce, etc.).
- Add relevant technology tags (WebGL, GSAP, Three.js, etc.).
- Include design style tags (Minimal, Experimental, Typography, etc.).
- Tag all team members with their Awwwards profiles.

### After Submission

- Share on social media the day it goes live on Awwwards.
- Ask your network to view (not vote-brigade) — organic traffic matters.
- Respond to comments on the Awwwards page.
- If you win SOTD, update your portfolio with the badge.
- Write a blog post about the project while attention is high.

---

## 8. Sources

- Awwwards submission guidelines: awwwards.com/submit
- Awwwards jury evaluation criteria: awwwards.com/about-evaluation
- Codrops collective articles: tympanus.net/codrops (technical write-up format)
- Immersive Garden process: immersive-g.com (studio documentation examples)
- Lusion works: lusion.co (shader-focused case studies)
- Active Theory archive: activetheory.net (technology-first methodology)
- Smashing Magazine case study format: smashingmagazine.com/category/case-studies
- Google Web Vitals documentation: web.dev/vitals (performance benchmarks)
- OBS Project: obsproject.com (screen recording)
- Kap: getkap.co (macOS screen recording)
- Vimeo upload guidelines: vimeo.com/help/compression
