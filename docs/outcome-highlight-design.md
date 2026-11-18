# Click a result, see the way to it (design)

Date: 2026-11-18. Base: branch `fix/ebd-loader-only-ebd-tables` (PR #771).

## Why

A user who received a result code of an EBD (e.g. `A02`) wants to see which checks lead to it. The product owner
chose "click a result box in the diagram, the way to it lights up" over a picker with an explanation panel. An
independent design review (second agent, with checks on all FV2610 data) decided the points below.

## Decisions

1. **The highlight is computed from the inlined SVG alone.** No `<EBD>.outcomes.json` is fetched in this version
   and the shipped data does not change (the pre-build cleanup of PR #771 stays as it is, `.dot` files stay).
   Reason: computed from the outcomes file, the way has dark gaps in 515 of 2,072 FV2610 outcomes (result boxes of
   other codes that lie on the way are not reported as steps there) and 435 outcome keys do not equal a box title.
   Computed from the SVG edges, the set of steps equals the library's `certain_steps ∪ possible_steps` for all
   2,072 outcomes, it also works for format versions before FV2510, and nothing has to be downloaded.
2. Strength is decided **per box and per arrow**: "on every way" if removing it cuts `Start` off from the result.
3. A drag must not act as a click.
4. A small native `<select>` "Ergebnis hervorheben" is added: it is the keyboard path and the way to find a result
   in large diagrams. It is a selector only, no explanation panel.
5. A status chip names the selection and doubles as legend.

## Graph from the SVG

Graphviz output: every node is `<g class="node"><title>KEY</title>…`, every edge
`<g class="edge"><title>SRC-&gt;DST</title>…`. Read titles via `textContent` (entities decoded), never from raw
markup. Build adjacency from the edge titles (split at the first `->`; keys of real data contain no `->`; if a
title cannot be split, ignore that edge).

A diagram without a `Start` node is a placeholder ("kein Entscheidungsbaum notwendig", a single node titled
`Empty`; about a third of the diagrams). It has no result groups at all: the select is disabled and nothing is
clickable.

Classification of nodes by title:

- `Start`: the start. Nodes whose title starts with `msi_` (multi-step instruction notes) and Graphviz clusters are
  neither steps nor results; they are never faded and never clickable.
- **Result box**: a node without outgoing edge, or a node whose title matches
  `^([A-Z]\d+|A\*\*|A[A-Z]\d)_\d+$` (a result that continues to a next step). Result codes are not only `Axx`
  (`AA1`, `AC1`, `AF2` exist).
- everything else is a step.

**Result group** (what one click/selection means): the title without the `_<n>` suffix of a continuing result; a
title starting with `A**: ` belongs to group `A**`; any other title is its own group (a code, `Ende`, or a note
text). One group can have several boxes (14 cases in FV2610, e.g. `E_0026` `A03`).

## The way to a result group

Let T be the boxes of the group.

- Forward: nodes reachable from `Start`, where the walk does not continue beyond a node of T (a way ends at the
  first box of the group it reaches).
- Backward: nodes from which a node of T is reachable (in the graph restricted the same way).
- **On the way** = nodes in both sets (including `Start` and T), and the edges between two such nodes whose source
  is not in T. Edges leaving a box of T are not on the way.
- **On every way** (certain): a node or edge on the way whose removal leaves no way from `Start` to any node of T.
  Everything else on the way is "only on some ways". Graphs have at most a few hundred nodes; compute on selection.
- If no node of T is reachable from `Start`: nothing is highlighted, the chip says so.

## Behaviour

- Click on a result box (hit test with `closest('g.node')`; clicks land on text/polygon children) selects its
  group. Clicking a box of the selected group again, clicking the empty background, pressing `Esc`, choosing the
  empty entry in the select, or the `×` in the chip clears. Changing the EBD or format version clears.
- A click is ignored if the pointer moved more than 4 px between mousedown and mouseup (panning).
- Result boxes show a pointer cursor; steps do not.
- Selected state: on-every-way boxes/arrows at full strength with a thicker outline; only-on-some-ways
  boxes/arrows with **dashed** outline and reduced opacity; everything else strongly faded. Colour is never the
  only signal. `msi_*` notes and clusters keep their normal look.
- `<select>` "Ergebnis hervorheben" in the existing toolbar area, listing the groups: codes in natural order, then
  `Ende`, then note-only results (text shortened to about 60 characters), first entry empty ("kein Ergebnis
  gewählt"). It shares state with the click. Choosing from the select pans/zooms so that the highlighted way fits
  the view; a click in the diagram does not move the view.
- Status chip while something is selected, e.g.
  `A02 – Weg hervorgehoben:  ▬ auf jedem Weg   ┅ nur auf manchen Wegen   [×]`, with conditional additions:
  "2 Kästen mit A03" (group with several boxes); "Dieses EBD hat ein Ergebnis A** – Ihr Code kann auch von dort
  stammen" (an `A**` group exists and a different group is selected); "vom Start aus nicht erreichbar".
- The hint at the bottom left of the diagram gains "Ergebnis anklicken: Weg hervorheben".
- Downloads (SVG, PlantUML) are unchanged and export the plain diagram: the highlight must be done with CSS classes
  on the live DOM (prefixed, e.g. `ebdway-…`, scoped to the container; the inlined SVG ships a global
  `<style>.cls-1{…}`), not by editing `svgContent`.

## Not in this version

Explanation panel, answers per step, deep link to a selected result, fetching the outcomes file, keyboard focus on
individual SVG boxes (the select is the keyboard path), lighting the wildcard way when a literal code is clicked
(the chip line covers it), moving the view after a click, touch panning (the existing pan is mouse-only; unchanged).

## Verification

The repo has no test framework and none is added.

- Keep the graph logic in a plain TypeScript module without DOM or Svelte dependencies beyond a small adapter that
  reads titles from the SVG element, so it can be exercised directly.
- Cross-check against the Python library on real data: for every EBD of FV2610 that has an outcomes file in
  `static/ebd/FV2610/`, the set of step numbers on the way to each group must equal `certain_steps ∪
possible_steps` of the matching outcome entry, and the on-every-way steps must equal `certain_steps` (the review
  established 2,072 of 2,072 with reference scripts in
  `/tmp/claude-1000/-home-konstantin-rebdhuhn/e3fbbda3-4db5-4d87-9a40-587aa8e98863/scratchpad/rev/`).
- Headless browser check on the built site for a small EBD (`E_0003`), a wildcard one (`E_0061`), a looped one
  (`E_0259`), a large one (`E_0594`): click, select, clear, drag-does-not-select, Esc; screenshots.
