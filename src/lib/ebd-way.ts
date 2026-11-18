/**
 * Pure graph logic for "show the way from Start to a result" in an EBD diagram.
 *
 * The graph is built from the `<title>` texts of the Graphviz nodes (`KEY`) and edges (`SRC->DST`) of the inlined
 * SVG. This module has no DOM and no Svelte dependencies; a thin adapter in svg-container.svelte reads the titles
 * and applies the result as CSS classes. See docs/outcome-highlight-design.md.
 */

export type NodeKind = "start" | "note" | "result" | "step";

export interface EbdGraph {
  /** all node titles in document order */
  nodes: string[];
  /** valid edges; `index` is the position in the edge title list that was passed to `buildGraph` */
  edges: { index: number; src: string; dst: string }[];
  kinds: Map<string, NodeKind>;
}

export interface ResultGroup {
  /** group key: result code (`A02`, `A**`), `Ende` or the (note) text of the box */
  key: string;
  /** text for the select: the key, shortened for note-only results */
  label: string;
  kind: "code" | "ende" | "note";
  /** titles of the boxes of this group */
  nodes: string[];
}

export interface Way {
  /** false if no box of the group can be reached from `Start`; all sets are empty then */
  reachable: boolean;
  nodesOnWay: Set<string>;
  /** edge indices (positions in the edge title list given to `buildGraph`) */
  edgesOnWay: Set<number>;
  nodesOnEveryWay: Set<string>;
  edgesOnEveryWay: Set<number>;
}

export const START = "Start";
export const WILDCARD_KEY = "A**";
const ENDE = "Ende";
const MAX_LABEL_LENGTH = 60;

// a result code that continues to a next step carries the number of that step as suffix: `A12_320`
const CONTINUING_RESULT = /^([A-Z]\d+|A\*\*|A[A-Z]\d)_\d+$/;
const RESULT_CODE = /^([A-Z]\d+|A\*\*|A[A-Z]\d)$/;

/** Splits an edge title at the first `->`; null if that is not possible. */
export function parseEdgeTitle(title: string): [string, string] | null {
  const at = title.indexOf("->");
  if (at <= 0 || at + 2 >= title.length) return null;
  return [title.slice(0, at), title.slice(at + 2)];
}

/** The group a result box belongs to (see the design document). */
export function groupKeyOf(title: string): string {
  const continuing = CONTINUING_RESULT.exec(title);
  if (continuing) return continuing[1];
  if (title.startsWith("A**: ")) return WILDCARD_KEY;
  return title;
}

export function buildGraph(
  nodeTitles: string[],
  edgeTitles: string[],
): EbdGraph {
  const known = new Set(nodeTitles);
  const edges: EbdGraph["edges"] = [];
  const hasOutgoing = new Set<string>();
  edgeTitles.forEach((title, index) => {
    const parts = parseEdgeTitle(title);
    if (!parts) return;
    const [src, dst] = parts;
    if (!known.has(src) || !known.has(dst)) return;
    edges.push({ index, src, dst });
    hasOutgoing.add(src);
  });

  // a placeholder diagram ("kein Entscheidungsbaum notwendig", single node `Empty`) has no Start and no results
  const hasStart = known.has(START);
  const kinds = new Map<string, NodeKind>();
  for (const title of nodeTitles) {
    let kind: NodeKind;
    if (title === START) kind = "start";
    else if (title.startsWith("msi_")) kind = "note";
    else if (!hasStart) kind = "step";
    else if (!hasOutgoing.has(title) || CONTINUING_RESULT.test(title))
      kind = "result";
    else kind = "step";
    kinds.set(title, kind);
  }
  return { nodes: [...nodeTitles], edges, kinds };
}

function shorten(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > MAX_LABEL_LENGTH
    ? `${flat.slice(0, MAX_LABEL_LENGTH - 1).trimEnd()}…`
    : flat;
}

/**
 * All result groups of the graph: codes in natural order, then `Ende`, then note-only results (in document order).
 */
export function listResultGroups(graph: EbdGraph): ResultGroup[] {
  const byKey = new Map<string, ResultGroup>();
  for (const title of graph.nodes) {
    if (graph.kinds.get(title) !== "result") continue;
    const key = groupKeyOf(title);
    let group = byKey.get(key);
    if (!group) {
      const kind = RESULT_CODE.test(key)
        ? "code"
        : key === ENDE
          ? "ende"
          : "note";
      group = {
        key,
        label: kind === "note" ? shorten(key) : key,
        kind,
        nodes: [],
      };
      byKey.set(key, group);
    }
    group.nodes.push(title);
  }
  const rank = { code: 0, ende: 1, note: 2 };
  const groups = [...byKey.values()];
  // Array.prototype.sort is stable: note-only results stay in document order
  groups.sort((a, b) => {
    if (a.kind !== b.kind) return rank[a.kind] - rank[b.kind];
    if (a.kind !== "code") return 0;
    return a.key.localeCompare(b.key, "de", { numeric: true });
  });
  return groups;
}

function reachFrom(
  starts: Iterable<string>,
  adjacency: Map<string, string[]>,
  skip?: string,
): Set<string> {
  const seen = new Set<string>();
  const stack: string[] = [];
  for (const s of starts) {
    if (s !== skip && !seen.has(s)) {
      seen.add(s);
      stack.push(s);
    }
  }
  while (stack.length) {
    const current = stack.pop() as string;
    for (const next of adjacency.get(current) ?? []) {
      if (next !== skip && !seen.has(next)) {
        seen.add(next);
        stack.push(next);
      }
    }
  }
  return seen;
}

function emptyWay(): Way {
  return {
    reachable: false,
    nodesOnWay: new Set(),
    edgesOnWay: new Set(),
    nodesOnEveryWay: new Set(),
    edgesOnEveryWay: new Set(),
  };
}

/**
 * The way from `Start` to the boxes of one result group. A way ends at the first box of the group it reaches, so
 * edges leaving such a box are not on the way. "On every way" means: removing that node or edge leaves no way from
 * `Start` to any box of the group.
 */
export function computeWay(graph: EbdGraph, group: ResultGroup): Way {
  const targets = new Set(group.nodes);
  if (!graph.kinds.has(START) || targets.size === 0) return emptyWay();

  const forward = new Map<string, string[]>();
  const backward = new Map<string, string[]>();
  for (const { src, dst } of graph.edges) {
    if (targets.has(src)) continue;
    if (!forward.has(src)) forward.set(src, []);
    forward.get(src)?.push(dst);
    if (!backward.has(dst)) backward.set(dst, []);
    backward.get(dst)?.push(src);
  }

  const fromStart = reachFrom([START], forward);
  const toTargets = reachFrom(targets, backward);
  const nodesOnWay = new Set<string>();
  for (const node of fromStart) if (toTargets.has(node)) nodesOnWay.add(node);
  if (![...targets].some((t) => nodesOnWay.has(t))) return emptyWay();

  const edgesOnWayList = graph.edges.filter(
    ({ src, dst }) =>
      !targets.has(src) && nodesOnWay.has(src) && nodesOnWay.has(dst),
  );
  const edgesOnWay = new Set(edgesOnWayList.map((e) => e.index));

  // Restricted to the way, every path from Start to a target lies inside it, so cuts can be tested there.
  const wayAdjacency = new Map<string, { dst: string; index: number }[]>();
  for (const { src, dst, index } of edgesOnWayList) {
    if (!wayAdjacency.has(src)) wayAdjacency.set(src, []);
    wayAdjacency.get(src)?.push({ dst, index });
  }
  const reachesTarget = (skipNode?: string, skipEdge?: number): boolean => {
    if (skipNode === START) return false;
    const seen = new Set<string>([START]);
    const stack = [START];
    while (stack.length) {
      const current = stack.pop() as string;
      if (targets.has(current)) return true;
      for (const { dst, index } of wayAdjacency.get(current) ?? []) {
        if (index === skipEdge || dst === skipNode || seen.has(dst)) continue;
        seen.add(dst);
        stack.push(dst);
      }
    }
    return false;
  };

  const nodesOnEveryWay = new Set<string>();
  for (const node of nodesOnWay)
    if (!reachesTarget(node)) nodesOnEveryWay.add(node);
  const edgesOnEveryWay = new Set<number>();
  for (const index of edgesOnWay)
    if (!reachesTarget(undefined, index)) edgesOnEveryWay.add(index);

  return {
    reachable: true,
    nodesOnWay,
    edgesOnWay,
    nodesOnEveryWay,
    edgesOnEveryWay,
  };
}
