# VEXORA — Premium digital agency website

A responsive, dark cinematic agency website concept built with semantic HTML, structured CSS, browser JavaScript, and two real Three.js WebGL scenes. The main hero uses procedural 3D geometry and lighting—not a video or flat rotating image.

## Project structure

- `index.html` — page sections, navigation, metadata, concept portfolio and project form
- `styles.css` — responsive visual system, typography, layouts, motion and reduced-motion fallback
- `script.js` — accessible navigation, scroll reveals, WebGL scenes and client-side form validation

## Run locally

Because the site uses JavaScript ES modules and an import map, serve the folder over HTTP instead of opening `index.html` directly.

### Python

```bash
cd vexora-website
python -m http.server 8000
```

Open `http://localhost:8000` in a modern browser.

Alternatively, use VS Code with the Live Server extension. Internet access is required for Google Fonts and the Three.js CDN. If WebGL is unavailable, the rest of the page remains accessible; the 3D canvases are hidden after initialization errors.

## Form configuration — required before launch

The project inquiry form currently validates fields in the browser only. **It does not send or store messages.** In `script.js`, set `endpoint` in the form submit handler to a real HTTPS endpoint provided by a form service or your own server. The endpoint must accept a JSON POST containing name, business, email, service, budget, timeline and message. Confirm the endpoint's expected schema and CORS rules before use. For a production site, validate all fields server-side, add spam protection/rate limiting, publish a privacy notice, and avoid putting secret API credentials in frontend code.

## Before publishing

1. Confirm the VEXORA name and domain are available and appropriate for use.
2. Replace `https://example.com/` in the canonical URL with the final HTTPS domain; configure the Open Graph image and favicon as desired.
3. Add verified email, phone, WhatsApp and social details only if you want them public.
4. Replace the three clearly labelled concept projects with real work as it becomes available. Do not present them as client case studies.
5. Connect and test any payment, e-commerce, chatbot, booking, SEO, automation or email integrations. The page describes these as services; it does not silently claim integrations are already configured.
6. Configure the inquiry form endpoint and test successful and failed submissions end-to-end.
7. Check mobile, keyboard navigation, contrast, page speed, browser console and screen-reader behavior on target devices.
8. Add `robots.txt`, `sitemap.xml`, analytics only with appropriate consent, and structured data only for verified business details.
9. Review final copy, legal/privacy requirements, domain, hosting and any third-party subscription costs.

## Notes

- The visual identity is a temporary typographic VEXORA mark, not a finalized trademark-cleared logo.
- No fake client logos, testimonials, awards, company history, staff counts, or business metrics are included.
- Project portfolio panels are CSS-built concept art, labelled as concepts.
- Reduced-motion preferences disable reveal/title motion and reduce 3D rotation. 3D animation is paused when its canvas is outside the viewport.
- No deployment has been performed.

## Latest interaction and motion pass
- The hero sculpture and services network now use stronger eased pointer-following rotation and positional parallax across their visual containers.
- Hero headings animate line-by-line; content reveals on scroll with staggered timing; portfolio artwork and captions receive restrained entrance and hover motion.
- Reduced-motion preferences remain respected, while the 3D scenes keep a slower, gentler ambient movement.
- Cursor-following is designed for mouse/trackpad; touch devices retain the ambient animation and normal scrolling.


## Motion update
The current motion pass uses direct cursor tracking for both WebGL sculptures and IntersectionObserver-based scroll reveals for headings, service rows, project artwork, process steps, principles, footer groups, and form fields. Cursor motion is intentionally responsive; motion is softened when the visitor's operating system requests reduced motion.


## Cinematic text and scroll motion
The `motion.js` file is loaded as a regular deferred script, separately from the Three.js module. This is intentional: text and section entrance animations still work if the 3D CDN fails to load. It sequences the hero eyebrow, headline lines, subtitle, buttons, and footer, then reveals headings, body copy, all ten service rows, portfolio panels, process steps, form, and footer groups as they enter the viewport. The motion layer uses IntersectionObserver and falls back to visible content when unavailable. Respect for the operating system's reduced-motion preference is preserved.


## Water planet animation fix
The Services water planet runs a continuous Three.js shader and rotation loop, and safely restarts its render loop when the canvas re-enters the viewport. Text entrances are set to approximately 1.5 seconds.


## Expanded multi-page edition
- `services.html`, `work.html`, `about.html`, `process.html`, and `contact.html` are standalone pages.
- `universe.html` is the Orbital Lab with eight real-time Three.js object scenes.
- `object-gallery.js` builds and animates the object gallery; each canvas is a real WebGL scene, not a static illustration.
- Text entrance animation durations are configured for approximately 1 second in `motion.js`.
- The main home page and its existing `script.js` are preserved so the original hero sculpture and services-section water planet remain in place.
- Run through a local HTTP server (`npx serve .`) rather than opening HTML files directly.


## Cinematic redesign pass (V2)

This progressive enhancement adds a shared cinematic CSS layer and a dependency-free interaction layer across all seven HTML pages. Included: restrained pointer spotlight on desktop, animated capabilities marquee, magnetic CTA micro-motion, gentle project-card tilt, section atmospheric lighting, dynamic year, current-section navigation state, and a back-to-top control. The original Three.js scenes, existing page content, 10 service offerings, navigation, and contact form behavior are preserved. All effects respect reduced-motion preferences and avoid hover-only content.

The [0m`assets/vexora-showcase.png` file is an optional VEXORA social/brand preview asset; it is not loaded into the page layout by default.

Run locally without Python: open a terminal in this folder and run `npx serve .` (Node.js required), or use VS Code Live Server. The site is not deployed.


## VEXORA V6 palette and business-page reliability update
- The 10 industry concept pages now load a shared stylesheet located beside the pages (`businesses/business-page.css`) and their interaction script using sibling-relative paths. This avoids relying on root-relative asset paths when opening `/businesses/salon` without a trailing slash.
- Industry pages use a slightly deeper muted-violet palette, clearer responsive layouts, visible focus states and styled interactive catalog/forms.
- Homepage violet palette and business gallery contrast have been refined.
- Business demo forms remain local-only; they do not transmit customer requests.
