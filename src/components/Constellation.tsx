import { useEffect, useRef, useState, useCallback } from 'react';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  baseR: number;
  color: string;
  category: string;
}

interface Projected {
  x: number;
  y: number;
  scale: number;
}

interface Edge {
  from: string;
  to: string;
}

interface Vec3 { x: number; y: number; z: number; }

const CATEGORIES = [
  { id: 'command', label: '1st AD', color: '#e6b800', glow: 'rgba(230,184,0,0.5)' },
  { id: 'creative', label: 'Creative', color: '#c9a227', glow: 'rgba(201,162,39,0.4)' },
  { id: 'technical', label: 'Technical', color: '#8ab4c7', glow: 'rgba(138,180,199,0.4)' },
  { id: 'support', label: 'Support', color: '#6b9ab0', glow: 'rgba(107,154,176,0.3)' },
  { id: 'talent', label: 'Talent', color: '#5a8a9e', glow: 'rgba(90,138,158,0.3)' },
];

const NODES_2D_RAW: Omit<GraphNode, 'z'>[] = [
  { id: 'ad', label: '1st AD', x: 0.50, y: 0.50, baseR: 5, color: '#e6b800', category: 'command' },
  { id: 'director', label: 'Director', x: 0.35, y: 0.28, baseR: 4.2, color: '#c9a227', category: 'creative' },
  { id: 'producer', label: 'Producer', x: 0.65, y: 0.28, baseR: 4.2, color: '#c9a227', category: 'creative' },
  { id: 'dp', label: 'DP', x: 0.72, y: 0.42, baseR: 3.6, color: '#8ab4c7', category: 'technical' },
  { id: 'gaffer', label: 'Gaffer', x: 0.28, y: 0.42, baseR: 3.6, color: '#8ab4c7', category: 'technical' },
  { id: 'camera', label: 'Camera', x: 0.78, y: 0.58, baseR: 3.3, color: '#8ab4c7', category: 'technical' },
  { id: 'sound', label: 'Sound', x: 0.22, y: 0.58, baseR: 3.3, color: '#8ab4c7', category: 'technical' },
  { id: 'wardrobe', label: 'Wardrobe', x: 0.32, y: 0.72, baseR: 3.6, color: '#6b9ab0', category: 'support' },
  { id: 'onset', label: 'On Set', x: 0.68, y: 0.72, baseR: 3.6, color: '#6b9ab0', category: 'support' },
  { id: 'script', label: 'Script Sup', x: 0.42, y: 0.82, baseR: 3, color: '#6b9ab0', category: 'support' },
  { id: 'locations', label: 'Locations', x: 0.58, y: 0.82, baseR: 3.3, color: '#6b9ab0', category: 'support' },
  { id: 'actor1', label: 'Actor 1', x: 0.45, y: 0.15, baseR: 3, color: '#5a8a9e', category: 'talent' },
  { id: 'actor2', label: 'Actor 2', x: 0.55, y: 0.15, baseR: 3, color: '#5a8a9e', category: 'talent' },
  { id: 'actor3', label: 'Actor 3', x: 0.50, y: 0.08, baseR: 2.6, color: '#5a8a9e', category: 'talent' },
  { id: 'scene', label: 'Scene', x: 0.18, y: 0.38, baseR: 3, color: '#5a8a9e', category: 'talent' },
  { id: 'lighting', label: 'Lighting', x: 0.82, y: 0.38, baseR: 3, color: '#5a8a9e', category: 'talent' },
  { id: 'transport', label: 'Transport', x: 0.15, y: 0.68, baseR: 2.6, color: '#4a7a8e', category: 'talent' },
  { id: 'safety', label: 'Safety', x: 0.85, y: 0.68, baseR: 2.6, color: '#4a7a8e', category: 'talent' },
  { id: 'art', label: 'Art', x: 0.50, y: 0.90, baseR: 2.6, color: '#4a7a8e', category: 'talent' },
  { id: 'props', label: 'Props', x: 0.25, y: 0.82, baseR: 2.6, color: '#4a7a8e', category: 'talent' },
  { id: 'hair', label: 'Hair/MU', x: 0.75, y: 0.82, baseR: 2.6, color: '#4a7a8e', category: 'talent' },
  // Second tier of branches — more circles, more lines, more intricacy.
  { id: 'craft', label: 'Craft Services', x: 0.60, y: 0.62, baseR: 2.6, color: '#6b9ab0', category: 'support' },
  { id: 'standin', label: 'Stand-In', x: 0.40, y: 0.05, baseR: 2, color: '#4a7a8e', category: 'talent' },
  { id: 'stunts', label: 'Stunts', x: 0.62, y: 0.05, baseR: 2, color: '#4a7a8e', category: 'talent' },
  { id: 'focuspull', label: 'Focus Puller', x: 0.90, y: 0.50, baseR: 2, color: '#6f9db3', category: 'technical' },
  { id: 'steadicam', label: 'Steadicam', x: 0.90, y: 0.66, baseR: 2, color: '#6f9db3', category: 'technical' },
  { id: 'electric', label: 'Electric', x: 0.92, y: 0.28, baseR: 2, color: '#4a7a8e', category: 'talent' },
  { id: 'boom', label: 'Boom Op', x: 0.10, y: 0.50, baseR: 2, color: '#4a7a8e', category: 'talent' },
  { id: 'medic', label: 'Set Medic', x: 0.94, y: 0.80, baseR: 1.8, color: '#4a7a8e', category: 'talent' },
  { id: 'makeup', label: 'Makeup', x: 0.85, y: 0.92, baseR: 1.8, color: '#4a7a8e', category: 'talent' },
  { id: 'payroll', label: 'Payroll', x: 0.66, y: 0.92, baseR: 1.8, color: '#4a7a8e', category: 'talent' },
  { id: 'continuity', label: 'Continuity', x: 0.38, y: 0.96, baseR: 1.6, color: '#4a7a8e', category: 'talent' },
];

// Pulled in tight around the hub — a dense core, not an even spread — so
// most of the mass sits close together and only works outward from there.
// The hub itself doesn't move; everything else compresses toward it.
const CORE_PULL = 0.58; // fraction of each node's original distance from the hub it keeps
const NODES_2D: Omit<GraphNode, 'z'>[] = NODES_2D_RAW.map(n => {
  if (n.id === 'ad') return n;
  const dx = n.x - 0.5, dy = n.y - 0.5;
  return { ...n, x: 0.5 + dx * CORE_PULL, y: 0.5 + dy * CORE_PULL };
});

// Plain dust — small unlabeled satellites scattered off the named roles,
// pure density with no text attached, the way a real starfield has far
// more faint points than named ones.
const DUST_COUNT = 27; // +35%
const dustParentPool = NODES_2D.filter(n => n.id !== 'ad');
const DUST_NODES: Omit<GraphNode, 'z'>[] = Array.from({ length: DUST_COUNT }, (_, i) => {
  const parent = dustParentPool[i % dustParentPool.length];
  const angle = i * 2.399;
  const dist = 0.05 + ((i * 37) % 10) / 10 * 0.09;
  return {
    id: `dust${i}`,
    label: '',
    x: Math.min(0.98, Math.max(0.02, parent.x + Math.cos(angle) * dist)),
    y: Math.min(0.98, Math.max(0.02, parent.y + Math.sin(angle) * dist)),
    baseR: 1 + ((i * 13) % 5) / 5 * 0.5,
    color: parent.color,
    category: parent.category,
  };
});
const DUST_PARENT: Record<string, string> = Object.fromEntries(
  DUST_NODES.map((d, i) => [d.id, dustParentPool[i % dustParentPool.length].id])
);

// The sphere's own falloff thins out in every direction from one point —
// top and bottom included — which is what left empty margins at the top
// of the frame. This band is a deliberate, explicit guarantee instead: one
// node for every slice of the full height, hugging the left edge with
// organic x variation (not a ruled line). Each hangs directly off the hub
// (the one thing in the whole system that barely moves) rather than off
// whatever named/dust node happens to be nearest, and gets zero sway of
// its own below — that's what makes the guarantee actually hold: these
// specific points stay put, pinned to the frame, while whatever's mesh-
// connected to them keeps moving normally. Pinned anchor, moving neighbor.
const EDGE_FILL_COUNT = 14;
const EDGE_FILL_NODES: Omit<GraphNode, 'z'>[] = Array.from({ length: EDGE_FILL_COUNT }, (_, i) => {
  const t = i / (EDGE_FILL_COUNT - 1);
  const y = 0.02 + t * 0.96;
  const x = 0.05 + ((i * 0.617) % 1) * 0.24; // 0.05–0.29, varied so it never reads as a straight column
  return {
    id: `edge${i}`,
    label: '',
    x, y,
    baseR: 1 + ((i * 11) % 5) / 5 * 0.6,
    color: i % 2 === 0 ? '#8ab4c7' : '#4a7a8e',
    category: i % 2 === 0 ? 'technical' : 'talent',
  };
});
const EDGE_FILL_PARENT: Record<string, string> = Object.fromEntries(
  EDGE_FILL_NODES.map(n => [n.id, 'ad'])
);
const EDGE_FILL_IDS = new Set(EDGE_FILL_NODES.map(n => n.id));

// Depth (z) is derived, not hand-authored: the hub (1st AD) sits nearest
// camera, everything else recedes the farther it sits from the hub in the
// rest pose — so the rotation reads as a real sphere, not a flat card spun
// in place.
const NODES: GraphNode[] = [...NODES_2D, ...DUST_NODES, ...EDGE_FILL_NODES].map((n, i) => {
  const dist = Math.hypot(n.x - 0.5, n.y - 0.5);
  const z = 0.85 - dist * 2.6 + Math.sin(i * 2.399) * 0.12;
  return { ...n, z };
});

// This is a skeleton, not a point cloud: every non-hub node has exactly one
// parent, and its screen position each frame is its parent's position plus
// a swaying "bone" vector — never an independent absolute coordinate. Move
// a shoulder and the whole arm goes with it; that's what makes a joint a
// joint instead of a dot on a spring.
const PARENT: Record<string, string | null> = {
  ad: null,
  director: 'ad', producer: 'ad', dp: 'ad', gaffer: 'ad', wardrobe: 'ad', onset: 'ad',
  actor1: 'director', actor2: 'director', actor3: 'director',
  scene: 'producer', locations: 'producer',
  camera: 'dp',
  lighting: 'gaffer',
  hair: 'wardrobe',
  safety: 'onset', props: 'onset', sound: 'onset', craft: 'onset',
  script: 'scene',
  transport: 'locations',
  art: 'props',
  standin: 'actor1', stunts: 'actor2',
  focuspull: 'camera', steadicam: 'camera',
  electric: 'lighting',
  boom: 'sound',
  medic: 'safety',
  makeup: 'hair',
  payroll: 'locations',
  continuity: 'script',
  ...DUST_PARENT,
  ...EDGE_FILL_PARENT,
};

const NAMED_DEPTH: Record<string, number> = {
  ad: 0,
  director: 1, producer: 1, dp: 1, gaffer: 1, wardrobe: 1, onset: 1,
  actor1: 2, actor2: 2, actor3: 2, scene: 2, locations: 2, camera: 2,
  lighting: 2, hair: 2, safety: 2, props: 2, sound: 2, craft: 2,
  script: 3, transport: 3, art: 3,
  standin: 3, stunts: 3, focuspull: 3, steadicam: 3, electric: 3,
  boom: 3, medic: 3, makeup: 3, payroll: 3,
  continuity: 4,
};

const DEPTH_WITH_DUST: Record<string, number> = {
  ...NAMED_DEPTH,
  ...Object.fromEntries(DUST_NODES.map(d => [d.id, (NAMED_DEPTH[DUST_PARENT[d.id]] ?? 2) + 1])),
};

const DEPTH: Record<string, number> = {
  ...DEPTH_WITH_DUST,
  ...Object.fromEntries(EDGE_FILL_NODES.map(e => [e.id, (DEPTH_WITH_DUST[EDGE_FILL_PARENT[e.id]] ?? 2) + 1])),
};

// The bones themselves — one edge per parent/child pair. Drawn thick and
// gold; the traveling signal below rides these, hub outward, like a call
// sheet moving down the chain of command.
const TREE_EDGES: Edge[] = Object.entries(PARENT)
  .filter((entry): entry is [string, string] => entry[1] !== null)
  .map(([id, parent]) => ({ from: parent, to: id }));

// Boldness is not a gold default — only a couple of bones actually carry
// it (the hub's two lead branches), same restraint as the silver lines.
const BOLD_BONES = new Set(['ad|director', 'ad|producer', 'ad|dp', 'ad|onset', 'director|actor1']);

// Thin cross-links between nodes that aren't parent/child but work
// together day-to-day — texture on top of the skeleton, not part of it.
const EXTRA_EDGES: Edge[] = [
  { from: 'director', to: 'producer' },
  { from: 'actor1', to: 'actor2' },
  { from: 'actor2', to: 'actor3' },
  { from: 'wardrobe', to: 'actor1' },
  { from: 'transport', to: 'props' },
  { from: 'dp', to: 'lighting' },
  { from: 'camera', to: 'onset' },
  { from: 'gaffer', to: 'dp' },
  { from: 'standin', to: 'stunts' },
  { from: 'focuspull', to: 'steadicam' },
  { from: 'electric', to: 'camera' },
  { from: 'boom', to: 'camera' },
  { from: 'medic', to: 'craft' },
  { from: 'payroll', to: 'script' },
  { from: 'craft', to: 'sound' },
  { from: 'makeup', to: 'wardrobe' },
  { from: 'continuity', to: 'producer' },
  { from: 'craft', to: 'wardrobe' },
  { from: 'electric', to: 'gaffer' },
  { from: 'boom', to: 'dp' },
  { from: 'standin', to: 'wardrobe' },
  { from: 'safety', to: 'transport' },
  { from: 'hair', to: 'onset' },
  { from: 'lighting', to: 'camera' },
  { from: 'producer', to: 'locations' },
  { from: 'sound', to: 'script' },
  { from: 'props', to: 'craft' },
  { from: 'actor3', to: 'wardrobe' },
];

// Draw/compute order: parents always land before their children so a
// child's frame can read its parent's freshly-computed position.
const ORDERED_NODES = [...NODES].sort((a, b) => DEPTH[a.id] - DEPTH[b.id]);

// A tree alone reads as spokes off a hub. The reference is a real mesh —
// crossing threads between whatever's spatially near, independent of who's
// whose parent — so every node also links to its few nearest neighbors in
// the rest layout. This is what actually produces the triangulated,
// net-like look instead of a clean star.
const MESH_EDGES: Edge[] = (() => {
  const seen = new Set<string>();
  const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  // Edges that already exist (tree or hand-picked) don't need a mesh
  // duplicate.
  TREE_EDGES.forEach(e => seen.add(key(e.from, e.to)));
  EXTRA_EDGES.forEach(e => seen.add(key(e.from, e.to)));

  const edges: Edge[] = [];
  NODES.forEach(n => {
    const dists = NODES
      .filter(o => o.id !== n.id)
      .map(o => ({ id: o.id, d: Math.hypot(o.x - n.x, o.y - n.y) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 4);
    dists.forEach(({ id }) => {
      const k = key(n.id, id);
      if (seen.has(k)) return;
      seen.add(k);
      edges.push({ from: n.id, to: id });
    });
  });
  return edges;
})();

function cross(a: Vec3, b: Vec3): Vec3 {
  return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
}
function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}
// Same tone as the wordmark — the old light teal was getting lost against
// the navy/teal background; matching the wordmark's cooled ivory reads
// clearly and ties the labels back to the brand color instead of an
// unrelated accent.
const LABEL_COLOR = '#e1ded2';

// The depth-1 ancestor of a node — the "shoulder" of whichever limb it's
// on. Every joint down that limb shares this same root, which is what lets
// them move as one coordinated arm instead of independent random joints.
function branchRootOf(id: string): string {
  let cur = id;
  while (PARENT[cur] && DEPTH[cur] > 1) cur = PARENT[cur]!;
  return cur;
}

interface ConstellationProps {
  onEnter?: () => void;
  /** Where the hub sits, as a fraction of the canvas's own box. */
  originXFrac?: number;
  originYFrac?: number;
  /** Overall size of the sphere, as a fraction of the radius basis below. */
  radiusFrac?: number;
  radiusBasis?: 'min' | 'height';
  /** Applied to the final 2D screen position AFTER rotation — stretching
   *  the sphere into a column without distorting the 3D rotation itself
   *  (scaling x/y before the rotation would skew the geometry as it spins).
   *  1/1 is a normal round cluster; a tall thin box wants a small
   *  stretchX and a large stretchY so it reaches the box's full height
   *  without spilling past its narrow width. */
  stretchX?: number;
  stretchY?: number;
  /** Hover highlighting + click-to-enter. Off for a decorative duplicate. */
  interactive?: boolean;
}

export default function Constellation({
  onEnter,
  originXFrac = 0.32,
  originYFrac = 0.52,
  radiusFrac = 0.52,
  radiusBasis = 'min',
  stretchX = 1,
  stretchY = 1,
  interactive = true,
}: ConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const timeRef = useRef(0);
  const animRef = useRef(0);
  const nodesRef = useRef<Map<string, any>>(new Map());
  // Live projected screen position of every node, recomputed every frame as
  // the skeleton sways and spins — hit-testing reads this, not a fixed layout.
  const projectedRef = useRef<Map<string, Projected>>(new Map());
  // Global label-reveal scheduler: at most two names on screen at once,
  // taking turns — not every node deciding independently to pop up, which
  // is what let a dozen labels land together and turn to noise.
  const revealRef = useRef<{ ids: { id: string; until: number }[]; nextAt: number }>({ ids: [], nextAt: 2 });

  const getNode = useCallback((id: string) => NODES.find(n => n.id === id)!, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize node states — only for nodes that don't already have one.
    // This effect re-runs whenever hoveredNode changes; without the guard,
    // every hover transition would wipe every node's reveal/pulse state.
    NODES.forEach(node => {
      if (nodesRef.current.has(node.id)) return;
      nodesRef.current.set(node.id, {
        currentR: node.baseR,
        targetR: node.baseR,
        labelOpacity: 0,
        targetLabelOpacity: 0,
        pulsePhase: Math.random() * Math.PI * 2,
        glowIntensity: 0,
        jut: 0,
        targetJut: 0,
      });
    });

    // ---- Rest pose & bone vectors ----------------------------------------
    // restPos is the fixed layout above, reduced to the -1..1-ish space the
    // projector works in. offset[child] is that child's bone: the vector
    // from its parent's rest position to its own — fixed in length and rest
    // direction, but the direction gets perturbed every frame below.
    const restPos = new Map<string, Vec3>(
      NODES.map(n => [n.id, { x: (n.x - 0.5) * 2, y: (n.y - 0.5) * 2, z: n.z }])
    );

    // The gray/silver cross-links get their own bend joint too — a real
    // circle partway along the line that swings side to side, so those
    // connections change shape the same way the gold bones do. A few carry
    // a second-tier label of their own, sitting on the silver instead of
    // the gold — background names, not just background lines.
    const EXTRA_LABELS: Record<number, string> = {
      1: '2nd AD', 3: 'Key Grip', 6: 'Best Boy', 9: 'DIT', 12: 'PA',
    };
    interface JointPoint { at: number; freq: number; phase: number; ampFrac: number; }
    interface ExtraJointCfg {
      e1: Vec3; e2: Vec3; joints: JointPoint[];
      bold: boolean; label?: string;
    }
    // Two joints per silver line now, not one — at roughly a third and two
    // thirds along, each swaying on its own phase, so the line reads as a
    // real multi-segment bend (an S, not a single kink) same as the bones.
    const extraJointCfg: ExtraJointCfg[] = EXTRA_EDGES.map((edge, i) => {
      const a = restPos.get(edge.from)!, b = restPos.get(edge.to)!;
      const dir = normalize({ x: b.x - a.x, y: b.y - a.y, z: b.z - a.z });
      const up: Vec3 = Math.abs(dir.y) > 0.95 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };
      const e1 = normalize(cross(dir, up));
      const e2 = normalize(cross(dir, e1));
      return {
        e1, e2,
        joints: [
          { at: 0.35, freq: 0.05 + (i % 5) * 0.011, phase: i * 1.9, ampFrac: 0.22 + (i % 3) * 0.07 },
          { at: 0.68, freq: 0.045 + (i % 4) * 0.013, phase: i * 1.9 + 2.1, ampFrac: 0.22 + (i % 3) * 0.07 },
        ],
        // Not every gray bar stays thin — about a third read as bold as a
        // bone, so boldness isn't a gold-only privilege.
        bold: i % 3 === 0,
        label: EXTRA_LABELS[i],
      };
    });

    interface SwayConfig {
      dir: Vec3; len: number; e1: Vec3; e2: Vec3;
      freqA: number; freqB: number; phaseA: number; phaseB: number;
      swingAmp: number; growAt: number;
    }
    const swayCfg = new Map<string, SwayConfig>();
    NODES.forEach(n => {
      if (!PARENT[n.id]) return;
      const parent = restPos.get(PARENT[n.id]!)!;
      const self = restPos.get(n.id)!;
      const off: Vec3 = { x: self.x - parent.x, y: self.y - parent.y, z: self.z - parent.z };
      const len = Math.hypot(off.x, off.y, off.z) || 0.001;
      const dir: Vec3 = { x: off.x / len, y: off.y / len, z: off.z / len };
      const up: Vec3 = Math.abs(dir.y) > 0.95 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };
      const e1 = normalize(cross(dir, up));
      const e2 = normalize(cross(dir, e1));
      const depth = DEPTH[n.id];
      // Every joint on the same limb shares one base rhythm (keyed off the
      // limb's shoulder, not this joint's own index) — a ballet arm going
      // from arms-out to first position moves as one gesture, shoulder,
      // elbow, wrist, fingers all part of the same curl, not each joint
      // improvising on its own clock. The per-depth lag is what makes it
      // read as a curl traveling out along the limb rather than everything
      // snapping to the same angle at once.
      const branchRoot = branchRootOf(n.id);
      const bi = NODES.findIndex(x => x.id === branchRoot);
      const lag = (depth - 1) * 0.45;
      // The edge-fill band is pinned — zero sway of its own, so it stays
      // exactly where it's needed (covering the frame) regardless of what
      // the rest of the mesh is doing. Everything else keeps bending.
      const isAnchored = EDGE_FILL_IDS.has(n.id);
      swayCfg.set(n.id, {
        dir, len, e1, e2,
        // Slower still — a calm settle, not a busy jitter.
        freqA: 0.035 + ((bi * 13) % 11) / 11 * 0.025,
        freqB: 0.025 + ((bi * 29) % 13) / 13 * 0.02,
        phaseA: bi * 1.7 + lag,
        phaseB: bi * 2.3,
        // The actual bend angle, in radians — a fingertip swings much
        // wider than a shoulder for the same joint. depth 3 reaches ~±80°:
        // a real bend, not a wobble. Anchored edge nodes get none of it.
        swingAmp: isAnchored ? 0 : (depth === 1 ? 0.4 : depth === 2 ? 0.85 : depth === 3 ? 1.25 : 1.4),
        // Barely staggered — the mesh should already read as dense on the
        // very first frame, not reveal itself over several seconds.
        growAt: depth * 0.08,
      });
    });

    const localPos = new Map<string, Vec3>();

    const computeLocalPositions = (t: number) => {
      // Hub: anchored — it does not travel across the frame. Only a small
      // in-place pulse toward/away from camera, so it never reads as
      // "controlling" the rest by dragging them around with it.
      localPos.set('ad', {
        x: Math.sin(t * 0.05) * 0.025,
        y: Math.cos(t * 0.04) * 0.025,
        z: Math.sin(t * 0.03 + 1) * 0.05,
      });
      for (const node of ORDERED_NODES) {
        const parentId = PARENT[node.id];
        if (!parentId) continue;
        const cfg = swayCfg.get(node.id)!;
        // No grow-in on mount — it's there fully formed the instant the
        // page renders, already mid-motion, not assembling itself in front
        // of you.
        const growth = 1;
        const breathe = 1 + Math.sin(t * 0.1 + cfg.phaseA * 0.4) * 0.05;

        // A real rotation of the bone's direction, not a linear nudge: pick
        // a swing plane (which itself slowly drifts, so the bend leans a
        // different way over time) and rotate the rest direction into it by
        // an actual angle. This is what lets a joint bend 45–90° and still
        // come back looking like a straight bone at rest, instead of
        // capping out at a small wobble.
        const planeAngle = t * cfg.freqB + cfg.phaseB;
        const cosP = Math.cos(planeAngle), sinP = Math.sin(planeAngle);
        const perp: Vec3 = {
          x: cfg.e1.x * cosP + cfg.e2.x * sinP,
          y: cfg.e1.y * cosP + cfg.e2.y * sinP,
          z: cfg.e1.z * cosP + cfg.e2.z * sinP,
        };
        const theta = cfg.swingAmp * Math.sin(t * cfg.freqA + cfg.phaseA) * growth;
        const cosTh = Math.cos(theta), sinTh = Math.sin(theta);
        const bentDir: Vec3 = {
          x: cfg.dir.x * cosTh + perp.x * sinTh,
          y: cfg.dir.y * cosTh + perp.y * sinTh,
          z: cfg.dir.z * cosTh + perp.z * sinTh,
        };

        const boneLen = cfg.len * growth * breathe;
        const parentPos = localPos.get(parentId)!;
        localPos.set(node.id, {
          x: parentPos.x + bentDir.x * boneLen,
          y: parentPos.y + bentDir.y * boneLen,
          z: parentPos.z + bentDir.z * boneLen,
        });
      }
    };

    // Rotate the whole skeleton around a vertical axis, plus a fixed slight
    // tilt so it reads as a sphere and not a flat disc spinning edge-on.
    // Perspective divide gives real near/far scale — this plus the constant
    // spin over time is the "three, four dimensions" the old flat map lacked.
    const TILT = 0.22;
    const cosT = Math.cos(TILT), sinT = Math.sin(TILT);

    const projectLocal = (local: Vec3, angle: number, w: number, h: number): Projected => {
      const radius = (radiusBasis === 'height' ? h : Math.min(w, h)) * radiusFrac;
      const x = local.x * radius;
      const y = local.y * radius;
      const z = local.z * radius;

      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const rx = x * cosA + z * sinA;
      const rz1 = -x * sinA + z * cosA;
      const ry = y * cosT - rz1 * sinT;
      const rz2 = y * sinT + rz1 * cosT;

      // Depth should read as real perspective, not a camera dolly: a gentler
      // FOV plus a floor under the denominator caps how large a near node
      // can get, so growth stays legible as bones/nodes appearing rather
      // than the frame lunging in on whatever's briefly closest.
      const fov = radius * 2.1;
      const scale = Math.min(1.7, fov / Math.max(fov + rz2, fov * 0.42));

      return { x: w * originXFrac + rx * scale * stretchX, y: h * originYFrac + ry * scale * stretchY, scale };
    };

    const findNodeAt = (mx: number, my: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = mx - rect.left;
      const y = my - rect.top;
      let closest: string | null = null;
      let closestDist = Infinity;
      for (const node of NODES) {
        const p = projectedRef.current.get(node.id);
        if (!p) continue;
        const state = nodesRef.current.get(node.id);
        const r = (state ? state.currentR : node.baseR) * p.scale;
        const dist = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2);
        if (dist < Math.max(r * 3, 14) && dist < closestDist) {
          closest = node.id;
          closestDist = dist;
        }
      }
      return closest;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const id = findNodeAt(e.clientX - rect.left, e.clientY - rect.top);
      setHoveredNode(id);
    };

    const handleClick = () => onEnter?.();

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('click', handleClick);
    }

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      // A slow pendulum, not a spin: it settles new sides into view without
      // ever orbiting all the way around or covering ground fast.
      const angle = Math.sin(t * 0.025) * 0.5;

      ctx.clearRect(0, 0, w, h);
      // Rounded caps and joins on every stroke this frame — a bone reads as
      // a rounded tube catching light as it bends, not a flat ruled line,
      // which is a big part of what actually sells the depth/dimension.
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Global reveal scheduler — at most two names showing at once, timed
      // differently from each other. Expire anyone whose turn is up, then,
      // if a slot's free, bring in one more (never more than two together).
      const reveal = revealRef.current;
      reveal.ids = reveal.ids.filter(r => r.until > t);
      reveal.nextAt -= 0.016;
      if (reveal.nextAt <= 0 && reveal.ids.length < 2) {
        const revealedSet = new Set(reveal.ids.map(r => r.id));
        const candidates = NODES.filter(n => n.label && !revealedSet.has(n.id));
        if (candidates.length > 0) {
          const pick = candidates[Math.floor(Math.random() * candidates.length)];
          reveal.ids.push({ id: pick.id, until: t + 3.5 + Math.random() * 2 });
        }
        reveal.nextAt = 1.4 + Math.random() * 1.6;
      }
      const revealedNow = new Set(reveal.ids.map(r => r.id));

      computeLocalPositions(t);

      // The one real "movement" left: a revealed joint eases toward camera
      // — an actual depth push, not a fake radius multiplier, so it grows
      // the honest way, through perspective. Eased every frame (not a hard
      // on/off) so it glides forward and settles back, never jumps.
      NODES.forEach(node => {
        const state = nodesRef.current.get(node.id);
        if (!state) return;
        state.targetJut = revealedNow.has(node.id) ? -0.5 : 0;
        state.jut += (state.targetJut - state.jut) * 0.045;
        if (Math.abs(state.jut) > 0.001) {
          const p = localPos.get(node.id);
          if (p) localPos.set(node.id, { ...p, z: p.z + state.jut });
        }
      });

      // Project every node once per frame; draw and hit-test both read this.
      NODES.forEach(node => {
        projectedRef.current.set(node.id, projectLocal(localPos.get(node.id)!, angle, w, h));
      });

      // Draw edges back-to-front (farthest first) so nearer connections and
      // nodes correctly paint over what's behind them. Tree bones first,
      // then the thinner cross-links on top of those.
      const drawEdge = (edge: Edge, kind: 'bone' | 'extra' | 'mesh') => {
        const from = getNode(edge.from);
        const to = getNode(edge.to);
        if (!from || !to) return;

        const pFrom = projectedRef.current.get(from.id)!;
        const pTo = projectedRef.current.get(to.id)!;
        const avgScale = (pFrom.scale + pTo.scale) / 2;

        const isConnectedToHover = hoveredNode && (hoveredNode === edge.from || hoveredNode === edge.to);
        const boneIsBold = kind === 'bone' && BOLD_BONES.has(`${edge.from}|${edge.to}`);
        const base = kind === 'bone' ? (boneIsBold ? 0.45 : 0.26) : kind === 'extra' ? 0.16 : 0.09;
        const dim = kind === 'bone' ? 0.14 : 0.05;
        const baseOpacity = (hoveredNode ? (isConnectedToHover ? 0.6 : dim) : base) * Math.min(avgScale, 1.3);
        // Width swings hard with proximity — a line reaching toward camera
        // should visibly thicken, not just brighten. But only a couple of
        // bones are actually bold; the rest of the gold reads as normal
        // structure, not a wall of thick lines.
        const widthMul = kind === 'bone' ? (boneIsBold ? 2.2 : 1.15) : kind === 'extra' ? 1.3 : 0.9;
        // Bold means bold — even rotated to the back of the sphere, where
        // avgScale is small, a bold bone still reads as a bone, not a
        // thread. Non-bold lines keep the full proximity-driven range.
        const widthFloor = kind === 'bone' && boneIsBold ? 1.1 : 0.4;

        ctx.beginPath();
        ctx.moveTo(pFrom.x, pFrom.y);
        ctx.lineTo(pTo.x, pTo.y);
        ctx.strokeStyle = kind === 'bone' ? `rgba(230, 184, 0, ${baseOpacity})` : `rgba(138, 180, 199, ${baseOpacity})`;
        ctx.lineWidth = Math.max(widthFloor, avgScale * avgScale * widthMul);
        ctx.stroke();

        if (kind !== 'bone') return;

        // Traveling signal — rides the bones hub-outward, like a call
        // sheet moving down the chain of command.
        const signalT = ((t * 0.4 + (from.x + from.y) * 50) % 100) / 100;
        const sx = pFrom.x + (pTo.x - pFrom.x) * signalT;
        const sy = pFrom.y + (pTo.y - pFrom.y) * signalT;

        const signalGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6 * avgScale);
        signalGrad.addColorStop(0, 'rgba(230, 184, 0, 0.85)');
        signalGrad.addColorStop(1, 'rgba(230, 184, 0, 0)');
        ctx.beginPath();
        ctx.arc(sx, sy, 6 * avgScale, 0, Math.PI * 2);
        ctx.fillStyle = signalGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sx, sy, 1.3 * avgScale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(230, 184, 0, 0.95)';
        ctx.fill();
      };

      // The silver bars: each is two segments meeting at its own joint
      // circle, the joint swinging side to side in 3D (so it still
      // reprojects correctly under the rotation) instead of a single
      // straight line between two fixed endpoints.
      const drawExtraEdge = (edge: Edge, cfg: ExtraJointCfg) => {
        const fromLocal = localPos.get(edge.from);
        const toLocal = localPos.get(edge.to);
        if (!fromLocal || !toLocal) return;

        const len = Math.hypot(toLocal.x - fromLocal.x, toLocal.y - fromLocal.y, toLocal.z - fromLocal.z);

        // Two joints along the line, each swaying on its own phase — a real
        // multi-segment bend, not one kink.
        const jointLocals: Vec3[] = cfg.joints.map(j => {
          const base: Vec3 = {
            x: fromLocal.x + (toLocal.x - fromLocal.x) * j.at,
            y: fromLocal.y + (toLocal.y - fromLocal.y) * j.at,
            z: fromLocal.z + (toLocal.z - fromLocal.z) * j.at,
          };
          const bend = Math.sin(t * j.freq + j.phase); // -1..1, slow
          const lateral = len * j.ampFrac * bend;
          return {
            x: base.x + cfg.e1.x * lateral,
            y: base.y + cfg.e1.y * lateral,
            z: base.z + cfg.e1.z * lateral,
          };
        });

        const pFrom = projectLocal(fromLocal, angle, w, h);
        const pTo = projectLocal(toLocal, angle, w, h);
        const pJoints = jointLocals.map(j => projectLocal(j, angle, w, h));
        const avgScale = (pFrom.scale + pTo.scale) / 2;

        const isConnectedToHover = hoveredNode && (hoveredNode === edge.from || hoveredNode === edge.to);
        const base = cfg.bold ? 0.32 : 0.14;
        const opacity = (hoveredNode ? (isConnectedToHover ? 0.6 : 0.05) : base) * Math.min(avgScale, 1.3);
        const widthMul = cfg.bold ? 2.0 : 1.1;
        // Same rule as the gold: a bold silver bar stays bold when it
        // rotates to the back of the sphere, not just when it's up front.
        const widthFloor = cfg.bold ? 1.0 : 0.4;

        ctx.beginPath();
        ctx.moveTo(pFrom.x, pFrom.y);
        pJoints.forEach(pj => ctx.lineTo(pj.x, pj.y));
        ctx.lineTo(pTo.x, pTo.y);
        ctx.strokeStyle = `rgba(138, 180, 199, ${opacity})`;
        ctx.lineWidth = Math.max(widthFloor, avgScale * avgScale * widthMul);
        ctx.stroke();

        pJoints.forEach((pJoint, ji) => {
          const jr = (cfg.bold ? 1.6 : 1.1) * pJoint.scale;
          ctx.beginPath();
          ctx.arc(pJoint.x, pJoint.y, jr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(178, 200, 212, ${Math.min(pJoint.scale, 1) * 0.8})`;
          ctx.fill();

          // Only the first joint on a labeled edge carries the name, so two
          // joints doesn't mean two labels crowding the same line.
          if (cfg.label && ji === 0) {
            ctx.font = `500 ${Math.max(8, jr * 3.2)}px 'Playfair Display', Georgia, serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = LABEL_COLOR;
            ctx.globalAlpha = Math.min(pJoint.scale, 1) * 0.7;
            ctx.fillText(cfg.label, pJoint.x, pJoint.y + jr + 4);
            ctx.globalAlpha = 1;
          }
        });
      };

      const orderedTreeEdges = [...TREE_EDGES].sort((a, b) => {
        const pa = projectedRef.current.get(a.from)!, pb = projectedRef.current.get(a.to)!;
        const pc = projectedRef.current.get(b.from)!, pd = projectedRef.current.get(b.to)!;
        return (pa.scale + pb.scale) - (pc.scale + pd.scale);
      });
      // Mesh threads first (farthest back), then the hand-picked cross
      // links, then the tree's own bones on top — bones read as structure,
      // the mesh as the flexible net woven between them.
      MESH_EDGES.forEach(edge => drawEdge(edge, 'mesh'));
      EXTRA_EDGES.forEach((edge, i) => drawExtraEdge(edge, extraJointCfg[i]));
      orderedTreeEdges.forEach(edge => drawEdge(edge, 'bone'));

      // Draw nodes back-to-front so nearer nodes occlude farther ones.
      const orderedNodes = [...NODES].sort((a, b) => {
        const pa = projectedRef.current.get(a.id)!, pb = projectedRef.current.get(b.id)!;
        return pa.scale - pb.scale;
      });

      orderedNodes.forEach(node => {
        const state = nodesRef.current.get(node.id);
        if (!state) return;

        const proj = projectedRef.current.get(node.id)!;

        // Breathing pulse
        const pulse = Math.sin(t * 0.8 + state.pulsePhase);
        const breathe = 1 + pulse * 0.12;

        // Expand only when the scheduler above has given this node its
        // turn — a small assist on top of the real growth, which now comes
        // honestly from the z-push toward camera above (proj.scale), not
        // from this multiplier doing all the work.
        const shouldExpand = revealedNow.has(node.id);
        state.targetR = shouldExpand ? node.baseR * 1.3 : node.baseR;
        state.targetLabelOpacity = shouldExpand ? 1 : 0;

        // Smooth transitions
        state.currentR += (state.targetR - state.currentR) * 0.04;
        state.labelOpacity += (state.targetLabelOpacity - state.labelOpacity) * 0.03;

        const isHovered = hoveredNode === node.id;
        const finalR = state.currentR * breathe * proj.scale * (isHovered ? 1.4 : 1);
        const finalLabelOp = isHovered ? 1 : state.labelOpacity;

        const nx = proj.x;
        const ny = proj.y;

        // Glow
        const glowR = finalR * 6;
        const glowGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, glowR);
        const cat = CATEGORIES.find(c => c.id === node.category);
        const glowColor = cat ? cat.glow : 'rgba(138,180,199,0.3)';
        glowGrad.addColorStop(0, glowColor);
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(nx, ny, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(nx, ny, finalR, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = (isHovered ? 1 : 0.75) * Math.min(proj.scale, 1);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Inner bright core — earned the same way for every node (only
        // when it's mid-pulse), not a permanent badge on the hub. Nothing
        // should read as the one thing controlling all the lines.
        if (finalR > node.baseR * 1.5) {
          ctx.beginPath();
          ctx.arc(nx, ny, finalR * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.95)';
          ctx.fill();
        }

        // Label — sized off the circle's actual rendered radius, not just
        // camera distance, so a node that's expanded/pushed toward camera
        // visibly carries bigger type with it, not just a bigger dot.
        if (finalLabelOp > 0.01) {
          ctx.font = `${isHovered ? '700' : '600'} ${Math.max(9, finalR * 3.1)}px 'Playfair Display', Georgia, serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = isHovered ? '#e8f0f5' : (node.id === 'ad' ? '#e6b800' : LABEL_COLOR);
          ctx.globalAlpha = finalLabelOp * (isHovered ? 1 : 0.8) * Math.min(proj.scale, 1);
          ctx.fillText(node.label, nx, ny + finalR + 5);
          ctx.globalAlpha = 1;
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleClick);
      }
    };
  }, [hoveredNode, getNode, onEnter, originXFrac, originYFrac, radiusFrac, radiusBasis, stretchX, stretchY, interactive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        cursor: interactive ? 'pointer' : 'default',
        pointerEvents: interactive ? 'auto' : 'none',
        display: 'block',
      }}
    />
  );
}
