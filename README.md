# Phil Brach · The Final Gift — homepage mockup

Homepage draft for Phil Brach’s book *The Final Gift: A Spirituality of Estate Gift Planning* (Sophia Institute Press, February 16, 2027).

Live draft: https://gabyurdanetar.github.io/phil-brach-final-gift/

Static site, no build step and no dependencies: `index.html`, `styles.css`, `main.js`, `assets/`.

## Direction (from the client’s design notes, rounds 1–2)

- Serious, contemplative tone; generous white space. References the client liked: oliverburkeman.com/fourthousandweeks and holymomentsbook.com.
- Motion is gentle and purposeful (round 2 notes): each block eases in as you scroll, the cover tilts slightly toward the pointer on hover, the parish stack fans out, and the pledge seal settles like a stamp. All of it switches off with prefers-reduced-motion.
- No eyebrow labels; “Phil Brach” set as a serif wordmark.
- Cardinal Dolan’s “The widow’s mite has not been repealed” sits right after the hero, set large.
- The Final Gift Pledge carries its own seal (inline SVG, reusable as a badge); a dedicated bulk-orders section supports the parish mission.
- Top navigation: The Final Gift · The Pledge · Work with Phil · Buy the Book.
- The author portrait frame is a placeholder until headshots arrive.

## Sections

Hero (cover + headline) · Cardinal Dolan quote · The idea in brief · The book (with “Inside the book”) · The Final Gift Pledge · Bulk orders for parishes · Work with Phil · Email signup · Footer

## Mockup conventions

- **Show draft notes** (bottom right) reveals open questions: primary CTA, pledge wording, Cardinal Dolan approval, bio confirmation.
- Links to pages that don’t exist yet point to sections on this page.
- The newsletter form validates the email but sends nothing.
- `noindex, nofollow` is set while this is a draft.

## Run locally

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```
