# Phil Brach · The Final Gift — homepage mockup

Homepage draft for Phil Brach’s book *The Final Gift: A Spirituality of Estate Gift Planning* (Sophia Institute Press, February 16, 2027).

Live draft: https://gabyurdanetar.github.io/phil-brach-final-gift/

Static site, no build step and no dependencies: `index.html`, `styles.css`, `main.js`, `assets/`.

## Direction (round 2, from the client’s design notes)

- Serious, contemplative tone; generous white space. References the client liked: oliverburkeman.com/fourthousandweeks and holymomentsbook.com.
- No decorative motion. The only transitions are button and link hover states.
- No eyebrow labels; “Phil Brach” set as a serif wordmark.
- The Final Gift Pledge and Cardinal Dolan’s “The widow’s mite has not been repealed” are given prominence; a dedicated bulk-orders section supports the parish mission.
- The author portrait frame is a placeholder until headshots arrive.

## Sections

Hero (cover + headline) · The idea in brief · The book (with “Inside the book”) · The Final Gift Pledge · Foreword quote · Bulk orders for parishes · Work with Phil · Email signup · Footer

## Mockup conventions

- **Show draft notes** (bottom right) reveals open questions: primary CTA, pledge wording, Cardinal Dolan approval, bio confirmation.
- Links to pages that don’t exist yet point to sections on this page.
- The newsletter form validates the email but sends nothing.
- `noindex, nofollow` is set while this is a draft.

## Run locally

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```
