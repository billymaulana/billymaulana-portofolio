# UX & Accessibility — Awwwards Developer Award

Reference document covering usability criteria, navigation patterns, scroll UX,
perceived performance, interaction feedback, accessibility requirements, mobile UX,
testing checklists, and applied UX psychology for Awwwards-winning sites.
Developer Award threshold: jury score > 7 with strong technical + usability marks.

---

## 1. Awwwards Usability Criteria

Usability accounts for **30% of the total Awwwards score**. Jury evaluates:

### What Jury Looks For

- **Intuitive navigation**: Can a first-time visitor find content within 3 seconds?
- **Readable typography**: Sufficient contrast, appropriate line lengths (45-75 chars), clear hierarchy.
- **Functional interactions**: Every interactive element provides feedback and has purpose.
- **Loading experience**: Site feels fast or provides meaningful loading states.
- **Cross-browser consistency**: Works in Chrome, Firefox, Safari, and Edge.
- **Mobile experience**: Not an afterthought — a deliberate, usable mobile design.
- **Error handling**: 404 pages, broken states, and edge cases handled gracefully.
- **Content accessibility**: Text is selectable, links are distinguishable, forms work.

### Common Usability Failures

| Failure | Impact | Fix |
|---------|--------|-----|
| No visible navigation on first load | Immediate confusion | Show nav or clear entry affordance |
| Scroll-jacking without escape hatch | Frustration, bounce | Allow natural scroll alongside custom |
| Unresponsive hover/click states | Feels broken | Add transition feedback within 100ms |
| Text over busy backgrounds | Unreadable content | Add overlay, bg-blur, or text shadow |
| Auto-playing audio/video | Instant tab close | Always muted by default, user-initiated |
| Infinite loading with no feedback | Perceived crash | Skeleton, progress bar, or animation |
| Cursor hijacking without fallback | Inaccessible | Maintain browser cursor option |

### Scoring Nuance

- Jury members are designers and developers — they evaluate differently.
- **Designer jury** weighs visual polish and layout usability.
- **Developer jury** checks source code, performance, accessibility, and semantic HTML.
- A Developer Award specifically requires technical excellence visible in code.

---

## 2. Navigation UX

### Fullscreen Overlay Navigation

Common pattern in Awwwards winners (used by 60%+ of SOTD sites):

```
Trigger:     Hamburger icon or text label ("Menu")
Transition:  Slide-in, clip-path reveal, or morph animation (300-500ms)
Layout:      Full-viewport overlay with large typography links
Background:  Blurred/dimmed page content or solid color
Close:       X button, ESC key, clicking outside, or scroll gesture
```

**Requirements**:
- `aria-expanded` on trigger button, toggled on open/close.
- `aria-hidden="true"` on page content when overlay is active.
- Focus trap: Tab cycles within the overlay when open.
- First focusable element receives focus on open.
- ESC key closes the overlay and returns focus to trigger.

### Hamburger vs Persistent Nav

| Pattern | When to Use | Awwwards Context |
|---------|-------------|------------------|
| Hamburger | Single-page portfolios, immersive experiences | Most common in winners |
| Persistent top bar | Multi-page sites, content-heavy | Less common but valid |
| Hidden until scroll | Scroll-triggered reveal | Good for hero-first layouts |
| Side rail / vertical | Experimental, editorial | High creativity score potential |

### Scroll Position Indicators

- Progress bar (top of viewport) — shows how far through the page.
- Section dots (right edge) — shows current section in a fixed vertical nav.
- Numbered steps — good for sequential/linear narratives.
- All indicators should be accessible: `role="progressbar"` or `role="navigation"` with `aria-label`.

### Keyboard Navigation

- All navigation links reachable via Tab.
- Visible focus indicators on every interactive element.
- Enter/Space activates links and buttons.
- Arrow keys navigate within menu groups.
- Skip-to-content link as first focusable element on page.

### ARIA Patterns for Navigation

```html
<nav aria-label="Main navigation">
  <button
    aria-expanded="false"
    aria-controls="nav-menu"
    aria-label="Open menu"
  >Menu</button>
  <div id="nav-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
    <ul role="list">
      <li><a href="#about">About</a></li>
      <li><a href="#work">Work</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </div>
</nav>
```

---

## 3. Scroll UX

### Smooth Scroll Implementation

- Use Lenis, Locomotive Scroll, or native `scroll-behavior: smooth`.
- Lerp factor between 0.05-0.12 for natural feel (0.08 is a safe default).
- Always allow native scroll as fallback if library fails to load.
- Disable smooth scroll when `prefers-reduced-motion: reduce` is active.

### Scrolljacking Rules

Scrolljacking (overriding native scroll behavior) is divisive. Rules for doing it right:

**Acceptable**:
- Parallax speed adjustments (content moves at different rates).
- Scroll-linked opacity and transform animations (GSAP ScrollTrigger).
- Horizontal scroll sections with clear visual affordance.
- Snap-to-section with momentum preservation.

**Unacceptable**:
- Completely overriding scroll direction or speed without user control.
- Locking scroll for animation sequences longer than 2 seconds.
- Breaking browser back/forward navigation.
- Preventing address bar show/hide on mobile.
- Removing scroll position memory (user returns to top on back navigation).

### Animation Restraint

- Not every element needs a scroll animation. Animate what matters.
- **Entry animations**: Once per session. Don't re-trigger on scroll-up.
- **Parallax**: Subtle (10-30% speed difference). Heavy parallax causes nausea.
- **Stagger**: Max 5-7 items. Beyond that, stagger delay makes content feel slow.
- **Duration**: Scroll animations should complete within visible viewport travel.
- **Overlap**: Avoid two competing animations visible simultaneously.

### ScrollTrigger Best Practices

```javascript
// Pin a section for scroll-linked animation
ScrollTrigger.create({
  trigger: '.section',
  start: 'top top',
  end: '+=200%',
  pin: true,
  scrub: 0.5,           // Smooth scrub (not instant)
  anticipatePin: 1,      // Prevent jump on pin start
  invalidateOnRefresh: true,  // Recalculate on resize
})
```

- Always call `ScrollTrigger.refresh()` after dynamic content loads.
- Use `scrub: true` or small numeric values (0.3-1) for smooth feel.
- Set `anticipatePin: 1` to prevent visual jump when pinning starts.

---

## 4. Loading & Perceived Performance

### Preloader UX

A preloader is expected on Awwwards-caliber sites. It serves three purposes:
1. Hide layout shifts during asset loading.
2. Set the mood and brand tone before content appears.
3. Give WebGL/shader time to compile and warm up.

**Preloader Pattern**:
```
Phase 1 (0-2s):     Logo or brand mark animation
Phase 2 (2-4s):     Progress indicator (real or simulated)
Phase 3 (4-5s):     Exit animation (clip-path, fade, slide)
Phase 4:            Hero content fully visible and interactive
```

**Rules**:
- Maximum 5 seconds total. Longer is unacceptable.
- Show real progress when possible (asset count, percentage).
- Preloader animation should preview the site's motion language.
- After first visit, skip or abbreviate the preloader (use sessionStorage).
- Provide a "skip" affordance for returning visitors.

### Skeleton Screens

- Use for content that loads asynchronously (images, API data).
- Match the layout dimensions of final content to prevent reflow.
- Animate with a subtle shimmer (left-to-right gradient pulse).
- Replace with real content using a crossfade, not a hard swap.

### Progressive Loading

- **Critical path**: HTML, CSS, above-fold fonts, hero image/video.
- **Deferred**: Below-fold images, WebGL shaders, analytics, non-critical JS.
- **Lazy**: Case study images, video embeds, social widgets.
- Use `loading="lazy"` on images and `<link rel="preload">` for critical assets.
- IntersectionObserver for triggering below-fold WebGL initialization.

### Perceived Performance Techniques

| Technique | Effect | Implementation |
|-----------|--------|----------------|
| Optimistic UI | Feels instant | Show result before server confirms |
| Skeleton screens | Content is "loading" | CSS shapes matching final layout |
| Progressive images | Quick preview | Tiny placeholder, blur-up to full |
| Font preloading | No FOIT/FOUT | `<link rel="preload" as="font">` |
| Staggered reveal | Content "arrives" | 50-100ms delay between elements |
| Smooth transitions | No jarring swaps | Crossfade between states (200-300ms) |

---

## 5. Interaction Feedback

### State Machine Approach

Every interactive element should have defined states:

```
idle → hover → active → loading → success/error → idle
```

- **Idle**: Default visual state. Must be clearly interactive (cursor, color, underline).
- **Hover**: Visual change within 100ms. Scale, color shift, or reveal animation.
- **Active**: Press/click state. Slight scale-down or color darken.
- **Loading**: Spinner, progress, or skeleton. Never leave user wondering.
- **Success/Error**: Clear visual confirmation. Green/red or icon change.
- **Disabled**: Reduced opacity (0.4-0.5), `cursor: not-allowed`, `aria-disabled="true"`.

### Custom Cursor

Custom cursors are a signature of Awwwards-winning sites.

**Implementation Rules**:
- Use CSS `cursor: none` on the body, render custom cursor via JS.
- Apply smooth interpolation (lerp 0.1-0.2) for fluid follow.
- Change cursor shape/size on interactive elements (grow on hover, arrow on links).
- Maintain native cursor fallback for right-click context menus.
- Hide custom cursor on touch devices (`pointer: coarse` media query).
- Custom cursor must not block click targets (use `pointer-events: none`).

```css
@media (pointer: coarse) {
  .custom-cursor { display: none; }
  * { cursor: auto !important; }
}
```

### Micro-Animations

- **Button hover**: Scale 1.02-1.05 + slight shadow increase (200ms, ease-out).
- **Link hover**: Underline draw-in or color shift (150ms).
- **Card hover**: Lift + shadow (transform: translateY(-4px), 200ms).
- **Toggle**: Smooth slide with spring physics (300ms).
- **Tooltip**: Fade + slight translateY (150ms delay, 200ms animation).
- All micro-animations respect `prefers-reduced-motion`.

### Magnetic Elements

Elements that subtly follow the cursor within a threshold radius:

```javascript
// Magnetic effect: element follows cursor within radius
function magneticEffect(element, radius = 50, strength = 0.3) {
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < radius) {
      const pull = (1 - dist / radius) * strength
      element.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`
    }
  })
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'translate(0, 0)'
    element.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  })
}
```

- Apply to CTAs, nav items, and logo.
- Keep strength subtle (0.2-0.4). Too strong feels glitchy.
- Disable on touch devices.

---

## 6. Accessibility Requirements

### WCAG 2.1 AA Minimum

Awwwards does not officially require WCAG compliance, but Developer Award jury
evaluates accessibility. These are non-negotiable for a high score:

- **Color contrast**: 4.5:1 for normal text, 3:1 for large text (18px+ bold or 24px+ regular).
- **Focus indicators**: Visible on all interactive elements. Custom styles allowed, but must be clear.
- **Keyboard operability**: All functionality available via keyboard.
- **Text alternatives**: `alt` on images, `aria-label` on icon-only buttons.
- **Semantic HTML**: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`.
- **Language attribute**: `<html lang="en">` declared.
- **Page title**: Descriptive `<title>` on every page.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Per-composable approach** (preferred over global override):
- Check `window.matchMedia('(prefers-reduced-motion: reduce)')` in each animation module.
- Replace motion with instant state changes (opacity 0 to 1 with no transition).
- WebGL: render static frame instead of animated loop.
- Parallax: disable entirely, show flat layout.
- Page transitions: crossfade only, no spatial movement.

### Focus Indicators

```css
/* Custom focus ring that works on dark backgrounds */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 2px;
}

/* Remove default outline only when custom is applied */
:focus:not(:focus-visible) {
  outline: none;
}
```

- Never use `outline: none` without replacement.
- Focus ring must be visible against both light and dark backgrounds.
- Use `focus-visible` (not `focus`) to avoid showing rings on mouse click.

### Skip Navigation

```html
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <nav><!-- navigation --></nav>
  <main id="main-content" tabindex="-1">
    <!-- page content -->
  </main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 16px;
  z-index: 9999;
  padding: 8px 16px;
  background: var(--color-accent);
  color: #fff;
}
.skip-link:focus {
  top: 16px;
}
```

### ARIA for Canvas / WebGL

Canvas and WebGL content is invisible to screen readers. Mitigate with:

```html
<div role="img" aria-label="Interactive fluid simulation responding to mouse movement">
  <canvas id="fluid-canvas" aria-hidden="true"></canvas>
</div>
```

- Wrap `<canvas>` in a `role="img"` container with descriptive `aria-label`.
- Set `aria-hidden="true"` on the canvas element itself.
- Ensure all meaningful content is also available in DOM text (not canvas-only).
- If canvas contains interactive UI (rare), use `role="application"` with full ARIA.

---

## 7. Mobile UX

### Touch Alternatives for Mouse Effects

| Desktop Effect | Mobile Alternative |
|---------------|-------------------|
| Hover reveal | Tap to reveal, or show by default |
| Cursor follow | Remove entirely |
| Magnetic elements | Disable magnetic, keep tap targets |
| Parallax (mouse) | Device orientation parallax or disable |
| Drag interaction | Swipe gesture with momentum |
| Custom cursor | Hide, use native touch feedback |

### Thumb Zone Design

- **Primary actions**: Bottom center (easy thumb reach).
- **Navigation trigger**: Top-right or bottom-right.
- **Minimum touch target**: 44x44px (Apple HIG) or 48x48dp (Material).
- **Spacing between targets**: Minimum 8px gap.
- **Avoid top-left for critical actions**: Hardest reach zone on mobile.

### WebGL Tiering

Not all devices can run the same WebGL effects. Implement a tiering system:

```javascript
function getDeviceTier() {
  const gl = document.createElement('canvas').getContext('webgl2')
  if (!gl) return 'low'

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : ''

  // Check for integrated/low-end GPUs
  const isLowEnd = /intel|mali|adreno 3|adreno 4|powervr/i.test(renderer)
  const isMobile = /android|iphone|ipad/i.test(navigator.userAgent)
  const cores = navigator.hardwareConcurrency || 2

  if (isLowEnd || (isMobile && cores <= 4)) return 'low'
  if (isMobile) return 'medium'
  return 'high'
}
```

| Tier | Resolution | Effects | FBO Size |
|------|-----------|---------|----------|
| High | 1x DPR | All shaders, full particles | 512-1024 |
| Medium | 0.75x DPR | Simplified shaders, fewer particles | 256-512 |
| Low | 0.5x DPR | CSS-only fallback, static images | None |

### Safe Areas (Notch / Dynamic Island)

```css
/* Respect device safe areas */
.header {
  padding-top: env(safe-area-inset-top, 0px);
}
.footer {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.page {
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}
```

- Always use `env(safe-area-inset-*)` for fixed/sticky elements.
- Set `<meta name="viewport" content="..., viewport-fit=cover">` to enable.
- Test on iPhone with notch/dynamic island and Android with camera cutouts.

---

## 8. Testing & QA Checklist

### Browser Testing

- [ ] Chrome (latest, latest-1)
- [ ] Firefox (latest, latest-1)
- [ ] Safari (latest macOS, latest iOS)
- [ ] Edge (latest, Chromium-based)
- [ ] Samsung Internet (if targeting Asian markets)

### Device Testing

- [ ] Desktop: 1920x1080, 2560x1440, 3840x2160
- [ ] Laptop: 1440x900, 1366x768
- [ ] Tablet: iPad Pro 12.9", iPad 10.9", Galaxy Tab
- [ ] Mobile: iPhone 15 Pro Max, iPhone SE, Pixel 8, Galaxy S24
- [ ] Touch: Test all interactions with touch (not just mouse simulation)

### Performance Testing

- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] Lighthouse Best Practices > 90
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) / Interaction to Next Paint (INP) < 200ms
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Total bundle size < 500KB (gzipped, excluding images)
- [ ] WebGL frame rate > 30fps on medium-tier devices
- [ ] No memory leaks after 5 minutes of interaction (check DevTools Memory tab)

### Accessibility Testing

- [ ] axe DevTools audit: 0 critical/serious violations
- [ ] Keyboard-only navigation: all content reachable
- [ ] Screen reader test (VoiceOver on macOS/iOS, NVDA on Windows)
- [ ] Color contrast check (all text meets 4.5:1 or 3:1 for large)
- [ ] Reduced motion: all animations disabled or simplified
- [ ] Focus indicators visible on all interactive elements
- [ ] Skip-to-content link present and functional
- [ ] `lang` attribute set on `<html>`
- [ ] All images have `alt` attributes
- [ ] ARIA attributes valid (no misused roles)

### Pre-Submission Checklist

- [ ] All links functional (no 404s)
- [ ] Favicon and touch icons present
- [ ] Open Graph and Twitter Card meta tags
- [ ] Canonical URL set
- [ ] robots.txt and sitemap.xml present
- [ ] HTTPS with valid certificate
- [ ] No console errors or warnings
- [ ] Analytics/tracking implemented (but not affecting performance)
- [ ] Content proofread (no typos, consistent tone)
- [ ] Legal: privacy policy if collecting data

---

## 9. Psychology & UX Laws Applied

### Fitts's Law

> The time to reach a target is a function of target size and distance.

**Application**:
- Make CTAs large (min 48px height) and place them near likely cursor positions.
- "Contact" button should be in the corner nearest to where the cursor rests after scrolling.
- Navigation links: larger hit areas than visible text (padding, not just font size).
- Close buttons on overlays: place in top-right (predictable) and make generously sized.

### Hick's Law

> Decision time increases with the number and complexity of choices.

**Application**:
- Navigation: 4-6 items maximum. More creates decision paralysis.
- Project grid: Show 3-5 featured projects, archive the rest.
- CTAs: One primary action per viewport. Don't compete with secondary actions.
- Filter/sort: Progressive disclosure (show 3 options, expand for more).

### Miller's Law

> People can hold 7 plus/minus 2 items in working memory.

**Application**:
- Skills/technology lists: Group into 3-5 categories, max 7 items each.
- Navigation items: Stay within 5-7 total.
- Section content: Break long sections into 3-5 digestible sub-sections.
- Statistics: Show max 4 key numbers (years, projects, clients, awards).

### Jakob's Law

> Users spend most time on other sites and expect yours to work similarly.

**Application**:
- Logo in top-left links to home. Menu in top-right.
- Scroll down for more content. Horizontal scroll needs explicit affordance.
- Underlined or color-differentiated text is a link.
- Form inputs look like form inputs (border, background differentiation).
- Be creative with execution, not with basic navigation patterns.

### Doherty Threshold

> Productivity increases when interactions complete within 400ms.

**Application**:
- Hover states: respond within 100ms.
- Click feedback: visual change within 50ms.
- Page transitions: start within 100ms, complete within 400ms.
- Navigation menu open/close: 300-500ms total.
- If something takes longer than 400ms, show a loading indicator.

### Peak-End Rule

> People judge an experience based on its peak moment and the ending.

**Application**:
- **Peak**: Design one unforgettable moment (hero animation, transition, interaction).
- **End**: Contact section and footer should be polished, not afterthoughts.
- Invest disproportionately in the hero and the final section.
- A weak footer undermines the entire experience regardless of how good the hero was.
- The page transition when leaving is as important as the one when arriving.

### Von Restorff Effect (Isolation Effect)

> An item that stands out from its peers is more memorable.

**Application**:
- One accent color against monochrome makes CTAs unmissable.
- One animated element among static elements draws immediate attention.
- Break the grid intentionally for the most important content.
- Use scale contrast: one massive heading among smaller text.
- The portfolio's signature interaction should be unlike anything on other sites.

### Serial Position Effect

> People best remember items at the beginning and end of a list.

**Application**:
- Put your strongest project first and second-strongest last.
- In skill lists, lead with your primary expertise.
- Navigation: most important link first, contact/CTA last.
- Hero section and footer carry the most weight in memory.

### Aesthetic-Usability Effect

> Users perceive aesthetically pleasing designs as more usable.

**Application**:
- Visual polish directly increases perceived usability scores.
- Invest in typography, spacing, and color even for functional elements.
- A beautiful 404 page makes users forgive the error.
- Consistent visual language across all states (loading, empty, error) matters.
- This effect is why Awwwards Design (40%) and Usability (30%) are synergistic.

---

## 10. Sources

- Awwwards evaluation criteria: awwwards.com/about-evaluation
- WCAG 2.1 specification: w3.org/TR/WCAG21
- Web Content Accessibility Guidelines quick reference: w3.org/WAI/WCAG21/quickref
- MDN ARIA authoring practices: developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
- Google Core Web Vitals: web.dev/vitals
- Lighthouse documentation: developer.chrome.com/docs/lighthouse
- Lenis smooth scroll: lenis.darkroom.engineering
- GSAP ScrollTrigger: gsap.com/docs/v3/Plugins/ScrollTrigger
- Apple Human Interface Guidelines (touch targets): developer.apple.com/design/human-interface-guidelines
- Material Design accessibility: m3.material.io/foundations/accessible-design
- Laws of UX: lawsofux.com (Jon Yablonski)
- Nielsen Norman Group: nngroup.com (usability research)
- axe accessibility testing: deque.com/axe
- WebPageTest: webpagetest.org (cross-region performance testing)
- prefers-reduced-motion: developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
