# Book of Moon — Yu-Gi-Oh! Field Guide

A buildless, local website for new and returning TCG players.

## Run it

1. Open `index.html` in a modern browser.
2. Use the top navigation to move between **Guide**, **Advanced Guide**, and **Decklists & Combos**.
3. No install or server is needed. Navigation, quiz, glossary, and text-only combo explanations work offline; card artwork, visual combo cards, and official source links require internet access.

## Pages

- `index.html`: six beginner chapters, gameplay and rulings quiz, searchable glossary, and source links.
- `advanced.html`: Seven paged sections covering effect types, “if” vs “when”, targeting, costs vs. effects, negation, Chains, Spell Speed, and conjunctions.
- `decklists.html`: sealed-product card-list references and interactive combo lines for Odd-Eyes, Lunalight, Speedroid, and The Fallen & The Virtuous. Add future decks as entries in `decklists.js`.

## Product-list notes

Konami confirms each Legendary ARC-V deck contains 40 Main Deck and 15 Extra Deck cards plus a random duplicate bonus. The Chronicles product contains 50 fixed Ultra Rare cards plus a random duplicate bonus. The official Included In pages list identities and official card details; consult the physical product contents for exact per-deck quantities and use the current TCG Forbidden & Limited List for tournament legality. The Chronicles cards must be sorted into a legal Main/Extra Deck configuration before play.

## Icon artwork

The local `millennium-puzzle.png` icon is a transparent-background cutout based on the Millennium Puzzle artwork listed by PNGaaa for non-commercial use: https://www.pngaaa.com/detail/426342

## Adding a visual combo tutorial

- Add the combo to decklists.js, then add a matching deck-id plus exact combo title entry in combo-visuals.js.
- Fill hand and fieldBefore, then give each step flow.inputs, a short flow.action, flow.outputs, and a fieldAfter map. Keep one step per action or resolution: a Pendulum scale setup is its own step before a Pendulum Summon; effects that destroy scales and summon during the same resolution stay together. Use card("Official Card Name") for a verified image, or group("Generic card / choice", 1, { frame, type, level, scale, requirements }) when the exact card can vary. Generic placeholders are clickable previews.
- Field zone keys are emzLeft, emzRight, banished, field, monster1 through monster5, grave, extra, spell1 through spell5, and main. For each step, add a matching snapshot under `window.comboPileStates` (`{ grave: [...], banished: [...] }`) and `window.comboZoneStates` (`{ hand: [...], mainRemoved: [...], extraRemoved: [...], extraFaceUp: [...], mainUnknownRemoved: 0, extraUnknownRemoved: 0 }`) using the exact same deck-id plus combo-title key. `mainRemoved` is cumulative in addition to the named opening hand, while `extraRemoved` lists cards currently outside the Extra Deck (remove a card from that list if it returns there). List face-up Pendulum cards oldest-first so the latest card is last. Main and Extra Deck previews start from the decklists and filter the known moved cards. Unknown-card counts preserve totals when a line leaves a card identity open; the preview note calls out where that makes the exact remaining list uncertain. All four pile previews are clickable; Graveyard and banishment use the latest card as the icon, Main Deck uses a card back, and Extra Deck uses a card back unless a face-up Pendulum card is on top. The tracked hand appears below each own-field diagram.
- Card names must match official English names for automatic artwork and card-detail lookup. Generic groups display as clickable placeholders in blank, type-colored card frames; their preview shows the card type and any level, scale, or material requirements. Add opponentBefore or a step-level opponentAfter map when the opposing board matters.
- Below 900px, visual panels switch to text-only combo explanations so the page remains readable in a narrow browser window.



