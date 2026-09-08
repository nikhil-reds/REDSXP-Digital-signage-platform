# REDS Brand Design Guidelines

> Transcribed from **REDS_Brand Book_R2** (17-slide PDF, 960 × 540 pt).
> Covers the two sections the book contains: **Colors** (slides 1–9) and **Typography** (slides 10–17).
> Every rule, hex value, scale step and do/don't below is taken from that document. Anything added for
> implementation convenience is explicitly marked **_(derived)_**.

---

## Table of contents

1. [Core principle](#1-core-principle)
2. [Foundation colors](#2-foundation-colors)
3. [Logo colors](#3-logo-colors)
4. [Green — full scale](#4-green--full-scale)
5. [Secondary family & combinations](#5-secondary-family--combinations)
6. [Functional color — Red & Amber](#6-functional-color--red--amber)
7. [Neutrals — Cool & Warm Gray](#7-neutrals--cool--warm-gray)
8. [Gradients](#8-gradients)
9. [Contrast & accessibility](#9-contrast--accessibility)
10. [Typefaces](#10-typefaces)
11. [Type scale formula](#11-type-scale-formula)
12. [Type scale → token / role → UI mapping](#12-type-scale--token--role--ui-mapping)
13. [Type scale & line height](#13-type-scale--line-height)
14. [Large formats](#14-large-formats)
15. [Tracking](#15-tracking)
16. [Leading](#16-leading)
17. [Flush left](#17-flush-left)
18. [Punctuation](#18-punctuation)
19. [Master do / don't checklist](#19-master-do--dont-checklist)
20. [Appendix A — full hex index](#appendix-a--full-hex-index)
21. [Appendix B — errata found in the source PDF](#appendix-b--errata-found-in-the-source-pdf)
22. [Appendix C — design tokens _(derived)_](#appendix-c--design-tokens-derived)

---

## 1. Core principle

> **Green at the core.**
>
> "One color carries the brand: a single, deliberate green, set against black and off-white.
> Every other hue in this system exists to serve it — never to compete with it."

Everything downstream follows from that sentence:

- There is exactly **one** hero color. Green is never one option among several.
- Every other hue (teal, blue, red, amber, grays) is **subordinate** and has a defined job.
- Adding a hue that is not in this book is out of system.

---

## 2. Foundation colors

The three colors the whole system is built on.

| Role | Name | Hex |
| --- | --- | --- |
| Brand hero | **Green 60** | `#0BDA51` |
| Foundation | **Black** | `#292929` |
| Foundation | **Off-white** | `#F6F6F3` |

**Do**

- Treat `#0BDA51` as the single brand hero. Every green in the system is derived from it.
- Set green against black or off-white — that is the intended contrast environment.

**Don't**

- Don't introduce a second "brand" color.
- Don't let any other hue compete with green for attention.

---

## 3. Logo colors

Three approved wordmark lockups, and only three:

| # | Background | Wordmark | Notes |
| --- | --- | --- | --- |
| 1 | Green `#0BDA51` | Black `#292929` | Green field, dark mark |
| 2 | Black `#292929` | Green `#0BDA51` | Dark field, green mark |
| 3 | Off-white `#F6F6F3` | Green `#0BDA51` | Light field, green mark |

Notes:

- The `™` sits at the upper right of the wordmark in all three lockups.
- Each lockup uses only foundation colors — no tint step, no secondary hue, no gradient behind the mark.

---

## 4. Green — full scale

Ten tonal steps generated from the brand hero, `#0BDA51` — **Green 60**.
Used to build **depth, hierarchy and state without introducing new hues**.

| Step | Hex |
| --- | --- |
| 100 | `#023112` |
| 90 | `#04531F` |
| 80 | `#06792D` |
| 70 | `#08A03C` |
| **60 — brand hero** | **`#0BDA51`** |
| 50 | `#33F575` |
| 40 | `#64F796` |
| 30 | `#94FAB6` |
| 20 | `#C5FCD7` |
| 10 | `#E7FEEF` |

**Do**

- Use the tonal steps for depth, hierarchy and interaction states (hover, pressed, disabled, surfaces).
- Stay inside this ramp when you need "more green" or "less green".

**Don't**

- Don't invent an intermediate green by eye — use a defined step.
- Don't reach for a new hue when a tonal step will do the job.

---

## 5. Secondary family & combinations

> "The color family subdivides cleanly for smaller applications.
> **Always drop from the warm end first. Green stays present at every step.**"

### Secondary family

| Name | Hex |
| --- | --- |
| Green | `#0BDA51` |
| Teal | `#1FBF8A` |
| Blue | `#0B8793` |
| Black | `#292929` |
| Off-white | `#F6F6F3` |

### Approved combinations

| Combination | Colors |
| --- | --- |
| 1-color | Green only — `#0BDA51` |
| 2-color | Green, Teal — `#0BDA51` + `#1FBF8A` |
| 3-color | Green, Teal, Blue — `#0BDA51` + `#1FBF8A` + `#0B8793` |

The order matters: green is never dropped, teal is dropped before green, blue is dropped before teal.

### Combinations to avoid

Shown explicitly as forbidden pairings in the book:

| Forbidden pairing | As drawn in the book |
| --- | --- |
| ❌ Green + Red | `#0BDA51` + `#D32735` |
| ❌ Green + Magenta | `#0BDA51` + `#B9219E` |
| ❌ Green + Purple | `#0BDA51` + `#7A2DB9` |

(The magenta and purple are illustrative "foreign hue" examples — they are not palette values.)

**Do**

- Reduce the palette from the warm end first when an application gets smaller.
- Keep green present in every reduced palette, all the way down to 1-color.

**Don't**

- Don't pair green with red, magenta or purple.
- Don't build a palette that drops green while keeping teal or blue.

---

## 6. Functional color — Red & Amber

> "**Reserved exclusively for system feedback error and warning states.
> Never used decoratively, never adjacent to Green.**"

### Red — error scale

| Step | Hex |
| --- | --- |
| 100 | `#350D11` |
| 90 | `#581319` |
| 80 | `#811821` |
| 70 | `#A81F2A` |
| **60 — error base** | **`#D32735`** |
| 50 | `#DE4F5B` |
| 40 | `#E47C84` <sup>†</sup> |
| 30 | `#EBA8AD` |
| 20 | `#F3CED1` |
| 10 | `#FAEBEC` |

### Amber — warning scale

| Step | Hex |
| --- | --- |
| 100 | `#3A2909` |
| 90 | `#60440B` |
| 80 | `#8B610E` |
| 70 | `#B67F11` |
| **60 — warning base** | **`#E5A015`** |
| 50 | `#ECB341` |
| 40 | `#EFC571` |
| 30 | `#F3D7A0` |
| 20 | `#F7E8CA` |
| 10 | `#FBF5E9` |

<sup>†</sup> The printed label on the slide reads `#E47CB4`; the actual swatch is `#E47C84`. See
[Appendix B](#appendix-b--errata-found-in-the-source-pdf).

**Do**

- Use red only for error states, amber only for warning states.
- Use the tonal steps for backgrounds, borders and text within an error/warning component.

**Don't**

- Don't use red or amber decoratively — not in illustration, not in charts, not as an accent.
- Don't place red or amber adjacent to green.

---

## 7. Neutrals — Cool & Warm Gray

> "Two neutral moods, matched step for step. Cool Gray carries a faint blue cast; Warm Gray a faint
> red-brown cast. **Choose one mood per application — never mix them.**"

### Cool Gray — hue 220°

| Step | Hex |
| --- | --- |
| 100 | `#212121` |
| 90 | `#333538` |
| 80 | `#474B52` <sup>†</sup> |
| 70 | `#5B616B` |
| 60 | `#737A87` |
| 50 | `#8F949E` |
| 40 | `#ACAFB4` |
| 30 | `#C8C9CB` |
| 20 | `#E1E1E0` |
| 10 | `#F3F2F2` |

### Warm Gray — hue 30°

| Step | Hex |
| --- | --- |
| 100 | `#212121` |
| 90 | `#383633` |
| 80 | `#534D46` |
| 70 | `#6C635A` |
| 60 | `#887D72` |
| 50 | `#9F968E` |
| 40 | `#B5B0AB` |
| 30 | `#CBC9C8` |
| 20 | `#E0E0E0` |
| 10 | `#F2F2F3` |

Both ramps share step 100 (`#212121`) and are matched step for step.

<sup>†</sup> The printed label on the neutrals slide reads `#474852`; the actual swatch — and the value
reprinted on the Gradients slide — is `#474B52`. See [Appendix B](#appendix-b--errata-found-in-the-source-pdf).

**Do**

- Pick one neutral mood (cool or warm) and use it consistently across a whole application.

**Don't**

- Don't mix cool and warm grays in the same application or layout.

---

## 8. Gradients

### Approved gradients

Brand gradients (all start or stay inside the Green–Teal–Blue family):

| From | To |
| --- | --- |
| `#0BDA51` | `#1FBF8A` |
| `#0BDA51` | `#0B8793` |
| `#0BDA51` | `#292929` |
| `#1FBF8A` | `#0B8793` |

Cool Gray gradients (never more than 4 tonal steps apart):

| From | To |
| --- | --- |
| `#333538` | `#737A87` |
| `#474B52` | `#ACAFB4` |
| `#737A87` | `#C8C9CB` |
| `#8F949E` | `#F3F2F2` |

### DON'T — the four gradient rules

| Rule | Detail |
| --- | --- |
| **No foreign hues** | Never blend outside the Green–Teal–Blue family (e.g. no purple, red, or yellow). |
| **No extreme tonal jumps** | Do not skip more than 4 tonal steps (e.g. Green directly to Off-white `#F6F6F3`). |
| **No warm gray gradients** | Warm Grays (hue 30°) carry red-brown undertones that clash with green — **keep them solid**. |
| **No neutral mixing** | Never blend Cool and Warm Grays in the same transition or layout. |

---

## 9. Contrast & accessibility

> "Guidance on which text/background colour pairings meet **WCAG AA contrast standards (4.5:1 for body
> text)**. Use this reference when applying secondary and functional colours to ensure legible,
> accessible content."

### ✅ Approved pairings

| Text | on Background |
| --- | --- |
| Black `#292929` | Green `#0BDA51` |
| Black `#292929` | Teal `#1FBF8A` |
| White `#FFFFFF` | Blue `#0B8793` |
| Green `#0BDA51` | Black `#292929` |
| White `#FFFFFF` | Black `#292929` |
| Black `#292929` | White `#FFFFFF` |
| White `#FFFFFF` | Red `#D32735` |
| Black `#292929` | Amber `#E5A015` |
| Amber `#E5A015` | Black `#292929` |

### ❌ Rejected pairings

| Text | on Background |
| --- | --- |
| White `#FFFFFF` | Green `#0BDA51` |
| Black `#292929` | Blue `#0B8793` |
| Green `#0BDA51` | Blue `#0B8793` |
| White `#FFFFFF` | Teal `#1FBF8A` |
| Green `#0BDA51` | Teal `#1FBF8A` |
| Green `#0BDA51` | White `#FFFFFF` |
| Black `#292929` | Red `#D32735` |
| White `#FFFFFF` | Amber `#E5A015` |
| Red `#D32735` | Black `#292929` |

Pattern worth internalising: **green and teal are dark-text surfaces; blue and red are light-text
surfaces; amber is a dark-text surface.** Green is never legible on teal, blue or white at body size.

---

## 10. Typefaces

> "**Sora and Source Sans 3 are final.** Sora carries headlines and display moments;
> Source Sans 3 carries body copy and UI text."

| Typeface | Role |
| --- | --- |
| **Sora** | Headlines, display moments |
| **Source Sans 3** | Body copy, UI text |

Both are shown with full uppercase, lowercase and numeral sets (`ABCDEFGHIJKLM`,
`abcdefghijklm`, `0123456789`).

One documented crossover: **button labels are set in Sora Semibold at 16px** (see the type-scale
mapping below).

**Do**

- Sora for headlines and display.
- Source Sans 3 for body and UI.

**Don't**

- Don't substitute another typeface — the pairing is final.
- Don't set long body copy in Sora.

---

## 11. Type scale formula

> "Our scale is built from a single base size and a repeating step function, so every heading and label
> stays proportional at any size. **The base assumes a 12pt starting point.**"

The ten scale steps:

`12` · `14` · `16` · `20` · `24` · `32` · `42` · `48` · `60` · `84` px

**Do**

- Pick a size from the scale.

**Don't**

- Don't invent an off-scale size.

---

## 12. Type scale → token / role → UI mapping

| Font size | Token / role | UI component mapping |
| --- | --- | --- |
| 84px | Display / Hero | Main landing page hero headline |
| 60px | H1 | Major section / page titles |
| 48px | H2 | Primary section headers |
| 42px | H3 | Modal titles, feature headings |
| 32px | H4 | Subsection titles, large card headers |
| 24px | H5 / Title | Standard card titles, widget headers |
| 20px | H6 / Subtitle | Card subtitles, prominent list headers |
| 16px | Body Lead / Button | Primary body text, button labels (**Sora, Semibold**) |
| 14px | Body | Standard body copy, table content |
| 12px | Caption / Label | Form field labels (uppercase), navigation items, helper text |

Note: **form field labels are uppercase** at 12px.

---

## 13. Type scale & line height

> "Line height increases as text gets smaller and tightens as it gets larger.
> **Use the pairing below rather than picking leading by eye.**"

| Size (pt/px) | Line height (pt/px) | Proportional gap | Application level |
| --- | --- | --- | --- |
| 12 | 16 | +4px | 1x (Screen / UI) |
| 14 | 18 | +4px | 1x (Screen / UI) |
| 16 | 22 | +6px | 1x (Screen / UI) |
| 20 | 26 | +6px | 1x (Screen / UI) |
| 24 | 32 | +8px | 1x (Screen / UI) |
| 32 | 40 | +8px | 1x (Screen / UI) |
| 42 | 50 | +8px | 1x (Screen / UI) |
| 48 | 52 | +4px | 1x (Screen / UI) |
| 60 | 64 | +4px | 1x (Screen / UI) |
| 84 | 88 | +4px | 1x (Screen / UI) |
| 96 | 128 | +32px | 4x (Environmental / Signage) |
| 108 | 116 | +8px | Formula step |
| 136 | 148 | +12px | Formula step |
| 168 | 180 | +12px | Formula step |
| 192 | 256 | +64px | 8x (Hero Digital Signage) |
| 204 | 216 | +12px | Formula step |
| 244 | 256 | +12px | Formula step |
| 288 | 300 | +12px | Extended display |

**Do**

- Take size **and** line height as a pair from this table.

**Don't**

- Don't set leading by eye.
- Don't keep small-text leading when you scale up, or large-text leading when you scale down.

---

## 14. Large formats

> "The farther away someone stands, the smaller our type looks — even if the file is the same size on
> your screen. A label that reads fine on a laptop disappears on digital signage or event displays.
> To compensate, **multiply the point size (and line height) by the same factor at every step-up**,
> using the scale you already picked for that piece of type."

| Level | Name | Applications |
| --- | --- | --- |
| **1x** | Handheld & Screen | Mobile apps, web platform, desktop dashboards |
| **4x** | Environmental & Exhibition | Wayfinding, kiosk displays, booth signage |
| **8x** | Large Scale Digital Signage | Hero billboards, venue projections, backdrop displays |

**Do**

- Multiply **both** point size and line height by the same factor.
- Keep the scale step you already chose; only the multiplier changes.

**Don't**

- Don't ship 1x type to signage or event displays.
- Don't scale the size without scaling the line height.

---

## 15. Tracking

> "**Sora is drawn tight;** give headlines a touch of letter-spacing so they don't clump —
> **but don't overdo it**, or the letters lose intent and fall apart."

| | Example | Verdict |
| --- | --- | --- |
| ✅ | `REDS` with a touch of letter-spacing | Correct |
| ❌ | `REDS` with no letter-spacing | Clumped |
| ❌ | `R E D S` over-tracked | Spaced out, loses intent |

---

## 16. Leading

> "Tight leading on a big headline reads as confident. That same tightness on a paragraph makes it
> exhausting to read. **Loosen up as the type gets smaller.**"

| | Example | Verdict |
| --- | --- | --- |
| ✅ | Paragraph set with the line height from §13 | Correct |
| ❌ | Paragraph set with headline-tight leading | Exhausting to read |

---

## 17. Flush left

> "**Left-align body copy:** it gives the eye a home edge to return to on every line —
> centered and justified paragraphs make readers hunt for the start of the next line."

| | Example | Verdict |
| --- | --- | --- |
| ✅ | Left-aligned paragraph | Correct |
| ❌ | Centered paragraph | Reader hunts for the start of each line |
| ❌ | Justified paragraph | Same problem |

> **Note:** this rule's heading and description are present in the source PDF but sit underneath the
> slide background, so they do not appear when the file is viewed. The two example panels below them
> *are* visible. See [Appendix B](#appendix-b--errata-found-in-the-source-pdf).

---

## 18. Punctuation

> "Correct marks read as intentional. **Straight quotes and hyphens standing in for their curly,
> longer counterparts read as a typo.**"

### Apostrophes

> "Use a curly apostrophe for possessives and contractions. **Use straight primes only for feet,
> inches, minutes and seconds.**"

| | Example |
| --- | --- |
| ✅ | `REDS’ platform` |
| ❌ | `REDS' platform` |

### Quotes

> "Use left and right curly quotation marks. **Avoid the straight quotes left over from typewriters.**"

| | Example |
| --- | --- |
| ✅ | `“Seamlessly integrated.”` |
| ❌ | `"Seamlessly integrated."` |

### Em dash

> "Use the em-dash to set off a strong aside. **Hyphens (-) and double hyphens (--) are not substitutes.**"

| | Example |
| --- | --- |
| ✅ | `REDS — now in version two — elevates digital brand experiences.` |
| ❌ | `REDS - now in version two - elevates digital brand experiences.` |

---

## 19. Master do / don't checklist

### Color

| ✅ Do | ❌ Don't |
| --- | --- |
| Treat `#0BDA51` as the single brand hero | Introduce a second brand color |
| Set green against black `#292929` or off-white `#F6F6F3` | Let another hue compete with green |
| Use the 10-step green ramp for depth, hierarchy and state | Invent an off-ramp green by eye |
| Drop the palette from the warm end first | Drop green while keeping teal or blue |
| Keep green present in every reduced palette | Pair green with red, magenta or purple |
| Reserve red for errors and amber for warnings only | Use red or amber decoratively |
| Keep red and amber away from green | Place red or amber adjacent to green |
| Pick one neutral mood (cool **or** warm) per application | Mix cool and warm grays |
| Keep warm grays solid | Build a gradient from warm grays |
| Blend only within Green–Teal–Blue | Blend to purple, red or yellow |
| Keep gradients within 4 tonal steps | Jump green straight to off-white |
| Check every text/background pair against §9 | Set green text on teal, blue or white |

### Typography

| ✅ Do | ❌ Don't |
| --- | --- |
| Sora for headlines and display | Set long body copy in Sora |
| Source Sans 3 for body and UI | Substitute another typeface |
| Set button labels in Sora Semibold 16px | Mix in an off-scale size |
| Pick sizes from `12/14/16/20/24/32/42/48/60/84` | Pick leading by eye |
| Pair size and line height from the §13 table | Reuse 1x type on signage |
| Multiply size **and** line height for 4x / 8x formats | Scale size without scaling line height |
| Give Sora headlines a touch of letter-spacing | Leave headlines clumped, or over-track them |
| Loosen leading as type gets smaller | Use headline-tight leading on paragraphs |
| Left-align body copy | Center or justify paragraphs |
| Use `’` `“` `”` `—` | Use `'` `"` `-` `--` as substitutes |
| Use straight primes only for feet/inches/minutes/seconds | Use straight primes as apostrophes |
| Uppercase 12px form-field labels | — |

---

## Appendix A — full hex index

| Hex | Name / role |
| --- | --- |
| `#0BDA51` | Green 60 — brand hero |
| `#292929` | Foundation Black |
| `#F6F6F3` | Foundation Off-white |
| `#1FBF8A` | Teal (secondary) |
| `#0B8793` | Blue (secondary) |
| `#023112` `#04531F` `#06792D` `#08A03C` | Green 100 / 90 / 80 / 70 |
| `#33F575` `#64F796` `#94FAB6` `#C5FCD7` `#E7FEEF` | Green 50 / 40 / 30 / 20 / 10 |
| `#350D11` `#581319` `#811821` `#A81F2A` | Red 100 / 90 / 80 / 70 |
| `#D32735` | Red 60 — error base |
| `#DE4F5B` `#E47C84` `#EBA8AD` `#F3CED1` `#FAEBEC` | Red 50 / 40 / 30 / 20 / 10 |
| `#3A2909` `#60440B` `#8B610E` `#B67F11` | Amber 100 / 90 / 80 / 70 |
| `#E5A015` | Amber 60 — warning base |
| `#ECB341` `#EFC571` `#F3D7A0` `#F7E8CA` `#FBF5E9` | Amber 50 / 40 / 30 / 20 / 10 |
| `#212121` `#333538` `#474B52` `#5B616B` `#737A87` | Cool Gray 100 / 90 / 80 / 70 / 60 |
| `#8F949E` `#ACAFB4` `#C8C9CB` `#E1E1E0` `#F3F2F2` | Cool Gray 50 / 40 / 30 / 20 / 10 |
| `#212121` `#383633` `#534D46` `#6C635A` `#887D72` | Warm Gray 100 / 90 / 80 / 70 / 60 |
| `#9F968E` `#B5B0AB` `#CBC9C8` `#E0E0E0` `#F2F2F3` | Warm Gray 50 / 40 / 30 / 20 / 10 |
| `#FFFFFF` | Pure white — used in the contrast matrix |

Two further colors appear as **deck furniture only**, not as brand values:

| Hex | Where |
| --- | --- |
| `#231F20` | The slide canvas background of the brand book itself |
| `#FF1319` | The red rule above every "don't" example panel |

Note that the deck's own canvas (`#231F20`) is **not** the specified Foundation Black (`#292929`).
Use `#292929`.

---

## Appendix B — errata found in the source PDF

Three discrepancies between what the slides *say* and what they *are*. Trust the swatch, not the label.

| # | Slide | Issue |
| --- | --- | --- |
| 1 | Functional color — Red & Amber | Red 40 is labelled `#E47CB4`; the swatch is `#E47C84`. The label transposes the last two digits into a pink. |
| 2 | Neutral — Cool & Warm | Cool Gray 80 is labelled `#474852`; the swatch is `#474B52` — and the Gradients slide reprints it correctly as `#474B52`. |
| 3 | Tracking / Leading slide | The **Flush left** heading and its description are drawn *before* the slide background and are therefore hidden in the rendered PDF. The rule is recovered in [§17](#17-flush-left). |

Two smaller notes:

- On the Neutral slide the step **100** swatch (`#212121`) *is* drawn for both ramps, but it is
  effectively invisible against the deck's `#231F20` canvas, so the row reads as starting at 90.
- The body copy on the brand book's own Tracking slide uses a straight apostrophe in "don't",
  which the Punctuation slide forbids.

---

## Appendix C — design tokens _(derived)_

Not in the PDF — a direct transcription of the values above into CSS custom properties for use in this
codebase.

```css
:root {
  /* Foundation */
  --reds-green: #0bda51;
  --reds-black: #292929;
  --reds-offwhite: #f6f6f3;

  /* Green ramp */
  --reds-green-100: #023112;
  --reds-green-90:  #04531f;
  --reds-green-80:  #06792d;
  --reds-green-70:  #08a03c;
  --reds-green-60:  #0bda51;
  --reds-green-50:  #33f575;
  --reds-green-40:  #64f796;
  --reds-green-30:  #94fab6;
  --reds-green-20:  #c5fcd7;
  --reds-green-10:  #e7feef;

  /* Secondary */
  --reds-teal: #1fbf8a;
  --reds-blue: #0b8793;

  /* Functional — error */
  --reds-red-100: #350d11;
  --reds-red-90:  #581319;
  --reds-red-80:  #811821;
  --reds-red-70:  #a81f2a;
  --reds-red-60:  #d32735;
  --reds-red-50:  #de4f5b;
  --reds-red-40:  #e47c84;
  --reds-red-30:  #eba8ad;
  --reds-red-20:  #f3ced1;
  --reds-red-10:  #faebec;

  /* Functional — warning */
  --reds-amber-100: #3a2909;
  --reds-amber-90:  #60440b;
  --reds-amber-80:  #8b610e;
  --reds-amber-70:  #b67f11;
  --reds-amber-60:  #e5a015;
  --reds-amber-50:  #ecb341;
  --reds-amber-40:  #efc571;
  --reds-amber-30:  #f3d7a0;
  --reds-amber-20:  #f7e8ca;
  --reds-amber-10:  #fbf5e9;

  /* Cool Gray — hue 220° (pick ONE mood per application) */
  --reds-cool-100: #212121;
  --reds-cool-90:  #333538;
  --reds-cool-80:  #474b52;
  --reds-cool-70:  #5b616b;
  --reds-cool-60:  #737a87;
  --reds-cool-50:  #8f949e;
  --reds-cool-40:  #acafb4;
  --reds-cool-30:  #c8c9cb;
  --reds-cool-20:  #e1e1e0;
  --reds-cool-10:  #f3f2f2;

  /* Warm Gray — hue 30° (never gradient, never mixed with cool) */
  --reds-warm-100: #212121;
  --reds-warm-90:  #383633;
  --reds-warm-80:  #534d46;
  --reds-warm-70:  #6c635a;
  --reds-warm-60:  #887d72;
  --reds-warm-50:  #9f968e;
  --reds-warm-40:  #b5b0ab;
  --reds-warm-30:  #cbc9c8;
  --reds-warm-20:  #e0e0e0;
  --reds-warm-10:  #f2f2f3;

  /* Approved gradients */
  --reds-gradient-brand:      linear-gradient(90deg, #0bda51, #1fbf8a);
  --reds-gradient-brand-deep: linear-gradient(90deg, #0bda51, #0b8793);
  --reds-gradient-brand-dark: linear-gradient(90deg, #0bda51, #292929);
  --reds-gradient-teal-blue:  linear-gradient(90deg, #1fbf8a, #0b8793);
  --reds-gradient-cool-1:     linear-gradient(90deg, #333538, #737a87);
  --reds-gradient-cool-2:     linear-gradient(90deg, #474b52, #acafb4);
  --reds-gradient-cool-3:     linear-gradient(90deg, #737a87, #c8c9cb);
  --reds-gradient-cool-4:     linear-gradient(90deg, #8f949e, #f3f2f2);

  /* Typography */
  --reds-font-display: "Sora", sans-serif;
  --reds-font-body: "Source Sans 3", sans-serif;

  --reds-size-display: 84px;  --reds-lh-display: 88px;
  --reds-size-h1: 60px;       --reds-lh-h1: 64px;
  --reds-size-h2: 48px;       --reds-lh-h2: 52px;
  --reds-size-h3: 42px;       --reds-lh-h3: 50px;
  --reds-size-h4: 32px;       --reds-lh-h4: 40px;
  --reds-size-h5: 24px;       --reds-lh-h5: 32px;
  --reds-size-h6: 20px;       --reds-lh-h6: 26px;
  --reds-size-body-lead: 16px;--reds-lh-body-lead: 22px;
  --reds-size-body: 14px;     --reds-lh-body: 18px;
  --reds-size-caption: 12px;  --reds-lh-caption: 16px;

  /* Large-format multipliers */
  --reds-scale-screen: 1;        /* mobile, web, dashboards        */
  --reds-scale-environmental: 4; /* wayfinding, kiosk, booth       */
  --reds-scale-signage: 8;       /* billboards, projections, walls */
}
```
