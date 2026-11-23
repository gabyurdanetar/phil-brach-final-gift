# Phil Brach · The Final Gift — homepage mockup

First-draft homepage for Phil Brach’s book *The Final Gift: A Spirituality of Estate Gift Planning* (Sophia Institute Press, February 16, 2027).

Static site, no build step and no dependencies: `index.html`, `styles.css`, `main.js`, `assets/`.

## Run it

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

## What’s on the page

| Section (from the copy outline) | Treatment |
| --- | --- |
| Hero | Headline + one-line description, Preorder / Take the Pledge, live countdown to release, 3D book with pointer tilt |
| Ribbons | Two crossed “gift ribbons” scrolling in opposite directions |
| Block 1 · The idea in brief | “paperwork” is struck through as you scroll; the three pillars become items in a signed, sealed bequest |
| Block 2 · Book feature | The hero book travels down the page, spins, lands in the arch and opens to an “Inside” page |
| Block 3 · Pledge | Gift boxes of every size drifting in parallax (“whatever the size of your gift”) |
| Block 4 · Foreword quote | Two coins (the widow’s mites) turn with scroll; the quote inks in word by word |
| Block 5 · Work with Phil | Arch portrait placeholder, rotating badge, count-up stats, bulk-order card, newsletter form |
| Footer | Navigation, contact, socials (links pending) |

## Mockup conventions

- **Draft notes**: the “Show draft notes” button reveals the open questions from the copy doc (primary CTA, pledge wording, Cardinal Dolan approval, bio confirmation).
- Links to pages that don’t exist yet (Learn More, pledge, bulk orders, Work with Phil, Contact) point to sections on this page.
- The newsletter form validates the email but sends nothing.
- `noindex, nofollow` is set while this is a draft.

## Motion & accessibility

- The travelling book runs on screens ≥ 1024px wide; smaller screens get a static book that opens in place.
- `prefers-reduced-motion` turns off all scroll choreography and shows the final state of every element.
- Semantic landmarks, skip link, keyboard-accessible nav and menu (Esc closes), visible focus states, live region on the form.
