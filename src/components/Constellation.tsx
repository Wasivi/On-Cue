import { useRef, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';

/* ============================================================================
   Data model — same role graph as the original 2D constellation: a hub (1st
   AD) with department/role nodes hanging off it as a skeleton, plus a dust
   field for density. Positions here are a REST LAYOUT in unit space; actual
   per-frame positions are real 3D vectors computed once per frame below and
   handed straight to Three.js meshes — no manual projection or screen-space
   sorting, the renderer's own camera and depth buffer do that for real.
   ============================================================================ */

interface GraphNode {
  id: string;
  label: string;
  x: number; y: number; z: number;
  baseR: number;
  color: string;
  category: string;
}
interface Edge { from: string; to: string; }
interface Vec3 { x: number; y: number; z: number; }

const CATEGORIES = [
  { id: 'command', label: '1st AD', color: '#e6b800', glow: '#e6b800' },
  { id: 'creative', label: 'Creative', color: '#c9a227', glow: '#c9a227' },
  { id: 'technical', label: 'Technical', color: '#8ab4c7', glow: '#8ab4c7' },
  { id: 'support', label: 'Support', color: '#6b9ab0', glow: '#6b9ab0' },
  { id: 'talent', label: 'Talent', color: '#5a8a9e', glow: '#5a8a9e' },
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

// Pulled in tight around the hub so the mass reads as a dense core, not an
// even spread. The hub itself doesn't move; everything else compresses
// toward it.
const CORE_PULL = 0.58;
const NODES_2D: Omit<GraphNode, 'z'>[] = NODES_2D_RAW.map(n => {
  if (n.id === 'ad') return n;
  const dx = n.x - 0.5, dy = n.y - 0.5;
  return { ...n, x: 0.5 + dx * CORE_PULL, y: 0.5 + dy * CORE_PULL };
});

// Plain dust — small unlabeled satellites off the named roles, for density.
const DUST_COUNT = 20;
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
    baseR: 1 + ((i * 13) % 5) / 5 * 0.7,
    color: parent.color,
    category: parent.category,
  };
});
const DUST_PARENT: Record<string, string> = Object.fromEntries(
  DUST_NODES.map((d, i) => [d.id, dustParentPool[i % dustParentPool.length].id])
);

// Depth (z) is derived, not hand-authored: the hub sits nearest camera,
// everything else recedes the farther it sits from the hub in the rest
// pose — so the rest pose alone already reads as a sphere, not a flat disc.
const NODES: GraphNode[] = [...NODES_2D, ...DUST_NODES].map((n, i) => {
  const dist = Math.hypot(n.x - 0.5, n.y - 0.5);
  const z = 0.85 - dist * 2.6 + Math.sin(i * 2.399) * 0.12;
  return { ...n, z };
});

// A skeleton, not a point cloud: every non-hub node has exactly one parent,
// and its position each frame is its parent's position plus a swaying bone
// vector — never an independent absolute coordinate.
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
const DEPTH: Record<string, number> = {
  ...NAMED_DEPTH,
  ...Object.fromEntries(DUST_NODES.map(d => [d.id, (NAMED_DEPTH[DUST_PARENT[d.id]] ?? 2) + 1])),
};

const ORDERED_NODES = [...NODES].sort((a, b) => DEPTH[a.id] - DEPTH[b.id]);

// The bones themselves — one edge per parent/child pair. The traveling
// signal below rides these, hub outward, like a call sheet moving down the
// chain of command.
const TREE_EDGES: Edge[] = Object.entries(PARENT)
  .filter((entry): entry is [string, string] => entry[1] !== null)
  .map(([id, parent]) => ({ from: parent, to: id }));

// Only a couple of bones actually carry extra boldness — the hub's lead
// branches.
const BOLD_BONES = new Set(['ad|director', 'ad|producer', 'ad|dp', 'ad|onset', 'director|actor1']);

// Thin cross-links between nodes that aren't parent/child but work together
// day to day — texture on top of the skeleton, not part of it.
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

// A tree alone reads as spokes off a hub. Every node also links to its
// nearest neighbors in the rest layout, independent of parentage — that's
// what produces the triangulated, net-like look instead of a clean star.
const MESH_EDGES: Edge[] = (() => {
  const seen = new Set<string>();
  const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  TREE_EDGES.forEach(e => seen.add(key(e.from, e.to)));
  EXTRA_EDGES.forEach(e => seen.add(key(e.from, e.to)));

  const edges: Edge[] = [];
  NODES.forEach(n => {
    const dists = NODES
      .filter(o => o.id !== n.id)
      .map(o => ({ id: o.id, d: Math.hypot(o.x - n.x, o.y - n.y) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
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
function perpAxis(dir: Vec3): Vec3 {
  const up: Vec3 = Math.abs(dir.y) > 0.95 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };
  return normalize(cross(dir, up));
}

const LABEL_COLOR = '#e1ded2';

// The depth-1 ancestor of a node — the "shoulder" of whichever limb it's
// on. Every joint down that limb shares this root, which is what lets a
// whole arm move as one coordinated gesture instead of independent joints.
function branchRootOf(id: string): string {
  let cur = id;
  while (PARENT[cur] && DEPTH[cur] > 1) cur = PARENT[cur]!;
  return cur;
}

/* ============================================================================
   Physics — rest pose, bone-sway config, and bend config for lines. All of
   this is static (depends only on the graph above), so it's computed once
   at module load, not per render or per frame.
   ============================================================================ */

const restPos = new Map<string, Vec3>(
  NODES.map(n => [n.id, { x: (n.x - 0.5) * 2, y: (n.y - 0.5) * 2, z: n.z }])
);

interface SwayConfig {
  dir: Vec3; len: number; e1: Vec3; e2: Vec3;
  freqA: number; freqB: number; phaseA: number; phaseB: number;
  swingAmp: number;
}
const swayCfg = new Map<string, SwayConfig>();
NODES.forEach(n => {
  if (!PARENT[n.id]) return;
  const parent = restPos.get(PARENT[n.id]!)!;
  const self = restPos.get(n.id)!;
  const off: Vec3 = { x: self.x - parent.x, y: self.y - parent.y, z: self.z - parent.z };
  const len = Math.hypot(off.x, off.y, off.z) || 0.001;
  const dir: Vec3 = { x: off.x / len, y: off.y / len, z: off.z / len };
  const e1 = perpAxis(dir);
  const e2 = normalize(cross(dir, e1));
  const depth = DEPTH[n.id];
  const branchRoot = branchRootOf(n.id);
  const bi = NODES.findIndex(x => x.id === branchRoot);
  const lag = (depth - 1) * 0.45;
  swayCfg.set(n.id, {
    dir, len, e1, e2,
    freqA: 0.035 + ((bi * 13) % 11) / 11 * 0.025,
    freqB: 0.025 + ((bi * 29) % 13) / 13 * 0.02,
    phaseA: bi * 1.7 + lag,
    phaseB: bi * 2.3,
    swingAmp: depth === 1 ? 0.4 : depth === 2 ? 0.85 : depth === 3 ? 1.25 : 1.4,
  });
});

function computeLocalPositions(t: number, out: Map<string, Vec3>) {
  out.set('ad', {
    x: Math.sin(t * 0.05) * 0.025,
    y: Math.cos(t * 0.04) * 0.025,
    z: Math.sin(t * 0.03 + 1) * 0.05,
  });
  for (const node of ORDERED_NODES) {
    const parentId = PARENT[node.id];
    if (!parentId) continue;
    const cfg = swayCfg.get(node.id)!;
    const breathe = 1 + Math.sin(t * 0.1 + cfg.phaseA * 0.4) * 0.05;

    const planeAngle = t * cfg.freqB + cfg.phaseB;
    const cosP = Math.cos(planeAngle), sinP = Math.sin(planeAngle);
    const perp: Vec3 = {
      x: cfg.e1.x * cosP + cfg.e2.x * sinP,
      y: cfg.e1.y * cosP + cfg.e2.y * sinP,
      z: cfg.e1.z * cosP + cfg.e2.z * sinP,
    };
    const theta = cfg.swingAmp * Math.sin(t * cfg.freqA + cfg.phaseA);
    const cosTh = Math.cos(theta), sinTh = Math.sin(theta);
    const bentDir: Vec3 = {
      x: cfg.dir.x * cosTh + perp.x * sinTh,
      y: cfg.dir.y * cosTh + perp.y * sinTh,
      z: cfg.dir.z * cosTh + perp.z * sinTh,
    };

    const boneLen = cfg.len * breathe;
    const parentPos = out.get(parentId)!;
    out.set(node.id, {
      x: parentPos.x + bentDir.x * boneLen,
      y: parentPos.y + bentDir.y * boneLen,
      z: parentPos.z + bentDir.z * boneLen,
    });
  }
}

// Every bone and cross-link gets a little independent bend — a shared seed
// per limb (the branch root's index) so sibling lines on the same limb bend
// together instead of each wobbling on its own clock.
interface BendConfig { freq: number; phase: number; ampFrac: number; }
function bendConfigFor(seed: number): BendConfig {
  return {
    freq: 0.05 + (seed % 5) * 0.011,
    phase: seed * 1.9,
    ampFrac: 0.14 + (seed % 3) * 0.045,
  };
}
const boneBend = new Map<string, BendConfig>();
TREE_EDGES.forEach(e => {
  const bi = NODES.findIndex(n => n.id === branchRootOf(e.to));
  boneBend.set(`${e.from}|${e.to}`, bendConfigFor(bi));
});
const extraBend = new Map<string, BendConfig>();
EXTRA_EDGES.forEach(e => {
  const bi = NODES.findIndex(n => n.id === branchRootOf(e.from));
  extraBend.set(`${e.from}|${e.to}`, bendConfigFor(bi + 7));
});

const EDGE_SEGMENTS = 10;
function quadraticPoint(from: Vec3, ctrl: Vec3, to: Vec3, s: number): Vec3 {
  const inv = 1 - s;
  return {
    x: inv * inv * from.x + 2 * inv * s * ctrl.x + s * s * to.x,
    y: inv * inv * from.y + 2 * inv * s * ctrl.y + s * s * to.y,
    z: inv * inv * from.z + 2 * inv * s * ctrl.z + s * s * to.z,
  };
}
// Written as disconnected segment pairs (for <lineSegments>, not a strip)
// because the bare lowercase `line` JSX tag collides with the DOM's SVG
// <line> element under this project's "DOM" lib — lineSegments has no such
// collision.
function sampleQuadraticSegments(from: Vec3, ctrl: Vec3, to: Vec3, segments: number, out: Float32Array) {
  for (let i = 0; i < segments; i++) {
    const p0 = quadraticPoint(from, ctrl, to, i / segments);
    const p1 = quadraticPoint(from, ctrl, to, (i + 1) / segments);
    out[i * 6] = p0.x; out[i * 6 + 1] = p0.y; out[i * 6 + 2] = p0.z;
    out[i * 6 + 3] = p1.x; out[i * 6 + 4] = p1.y; out[i * 6 + 5] = p1.z;
  }
}

// Converts a node's authored baseR (tuned for the old 2D pixel system) into
// a sensible sphere radius in the new unit-local space the group lives in.
const SPHERE_SCALE = 0.055;

/* ============================================================================
   Scene — the actual R3F render tree. One useFrame loop drives every mesh
   and line imperatively (mutating refs, never calling setState for motion),
   the same "one big loop" shape as the original canvas version, just
   writing real Object3D transforms instead of 2D canvas paths.
   ============================================================================ */

interface SceneProps {
  onEnter?: () => void;
  originXFrac: number;
  originYFrac: number;
  radiusFrac: number;
  radiusBasis: 'min' | 'height';
  stretchX: number;
  stretchY: number;
  interactive: boolean;
}

function Scene({ onEnter, originXFrac, originYFrac, radiusFrac, radiusBasis, stretchX, stretchY, interactive }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nodeMeshRefs = useRef(new Map<string, THREE.Mesh>()).current;
  const signalRefs = useRef(new Map<string, THREE.Mesh>()).current;
  const jointRefs = useRef(new Map<string, THREE.Mesh>()).current;
  const boneGeoRefs = useRef(new Map<string, THREE.BufferGeometry>()).current;
  const extraGeoRefs = useRef(new Map<string, THREE.BufferGeometry>()).current;
  const meshLineGeoRef = useRef<THREE.BufferGeometry>(null);
  const localPos = useRef(new Map<string, Vec3>()).current;
  const revealState = useRef<{ ids: { id: string; until: number }[]; nextAt: number }>({ ids: [], nextAt: 2 }).current;
  const revealedKeyRef = useRef('');
  const nodeAnim = useRef(
    new Map(NODES.map(n => [n.id, {
      currentR: n.baseR, targetR: n.baseR,
      pulsePhase: ((n.x * 97 + n.y * 53) % 1) * Math.PI * 2,
      jut: 0, targetJut: 0,
    }]))
  ).current;

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const hoveredRef = useRef<string | null>(null);
  hoveredRef.current = hoveredId;

  useCursor(interactive && hoveredId !== null);

  const { viewport } = useThree();

  const handleEnter = useCallback(() => { if (interactive) onEnter?.(); }, [interactive, onEnter]);

  const meshEdgeArray = useMemo(() => new Float32Array(MESH_EDGES.length * 6), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const group = groupRef.current;
    if (!group) return;

    // Composition: derived from the live viewport, so the sphere's size and
    // anchor stay correct across window sizes with no manual resize code.
    const worldX = (originXFrac - 0.5) * viewport.width;
    const worldY = -(originYFrac - 0.5) * viewport.height;
    const baseRadius = (radiusBasis === 'height' ? viewport.height : Math.min(viewport.width, viewport.height)) * 0.5 * radiusFrac;
    const driftAmp = baseRadius * 0.045;

    group.position.set(
      worldX + Math.sin(t * 0.07) * driftAmp,
      worldY + Math.cos(t * 0.05) * driftAmp * 0.6,
      0
    );
    group.rotation.y = Math.sin(t * 0.025) * 0.5;
    group.rotation.x = 0.22;
    group.scale.set(baseRadius * stretchX, baseRadius * stretchY, baseRadius);

    computeLocalPositions(t, localPos);

    // Reveal scheduler: at most two labels on screen at once, taking turns.
    revealState.ids = revealState.ids.filter(r => r.until > t);
    revealState.nextAt -= 0.016;
    if (revealState.nextAt <= 0 && revealState.ids.length < 2) {
      const revealedSet = new Set(revealState.ids.map(r => r.id));
      const candidates = NODES.filter(n => n.label && !revealedSet.has(n.id));
      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        revealState.ids.push({ id: pick.id, until: t + 3.5 + Math.random() * 2 });
      }
      revealState.nextAt = 1.4 + Math.random() * 1.6;
    }
    const revealedNow = new Set(revealState.ids.map(r => r.id));
    const sortedKey = [...revealedNow].sort().join(',');
    if (sortedKey !== revealedKeyRef.current) {
      revealedKeyRef.current = sortedKey;
      setRevealedIds([...revealedNow]);
    }

    // Nodes: real z-push toward camera (a true dolly, not a faked radius),
    // breathing pulse, hover growth, and position — all applied directly.
    NODES.forEach(node => {
      const anim = nodeAnim.get(node.id)!;
      const mesh = nodeMeshRefs.get(node.id);
      const p = localPos.get(node.id);
      if (!mesh || !p) return;

      const shouldExpand = revealedNow.has(node.id);
      anim.targetJut = shouldExpand ? -0.16 : 0;
      anim.jut += (anim.targetJut - anim.jut) * 0.045;
      anim.targetR = shouldExpand ? node.baseR * 1.3 : node.baseR;
      anim.currentR += (anim.targetR - anim.currentR) * 0.04;

      mesh.position.set(p.x, p.y, p.z + anim.jut);

      const pulse = Math.sin(t * 0.8 + anim.pulsePhase);
      const breathe = 1 + pulse * 0.12;
      const isHovered = hoveredRef.current === node.id;
      mesh.scale.setScalar(anim.currentR * breathe * SPHERE_SCALE * (isHovered ? 1.4 : 1));
    });

    // Tree bones — bending gold structure, each with a traveling signal dot.
    TREE_EDGES.forEach(edge => {
      const key = `${edge.from}|${edge.to}`;
      const geo = boneGeoRefs.get(key);
      const from = localPos.get(edge.from), to = localPos.get(edge.to);
      if (!geo || !from || !to) return;

      const dir = normalize({ x: to.x - from.x, y: to.y - from.y, z: to.z - from.z });
      const perp = perpAxis(dir);
      const bend = boneBend.get(key)!;
      const len = Math.hypot(to.x - from.x, to.y - from.y, to.z - from.z);
      const bendAmt = len * bend.ampFrac * Math.sin(t * bend.freq + bend.phase);
      const ctrl: Vec3 = {
        x: (from.x + to.x) / 2 + perp.x * bendAmt,
        y: (from.y + to.y) / 2 + perp.y * bendAmt,
        z: (from.z + to.z) / 2 + perp.z * bendAmt,
      };

      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
      sampleQuadraticSegments(from, ctrl, to, EDGE_SEGMENTS, posAttr.array as Float32Array);
      posAttr.needsUpdate = true;

      const signal = signalRefs.get(key);
      if (signal) {
        const phaseOffset = (edge.from.length * 7 + edge.to.length * 3) % 10;
        const signalT = ((t * 0.4 + phaseOffset) % 10) / 10;
        const sp = quadraticPoint(from, ctrl, to, signalT);
        signal.position.set(sp.x, sp.y, sp.z);
      }
    });

    // Cross-link edges — bending "silver bars," each with a joint circle
    // riding the bend, exactly where the line actually curves.
    EXTRA_EDGES.forEach(edge => {
      const key = `${edge.from}|${edge.to}`;
      const geo = extraGeoRefs.get(key);
      const from = localPos.get(edge.from), to = localPos.get(edge.to);
      if (!geo || !from || !to) return;

      const dir = normalize({ x: to.x - from.x, y: to.y - from.y, z: to.z - from.z });
      const perp = perpAxis(dir);
      const bend = extraBend.get(key)!;
      const len = Math.hypot(to.x - from.x, to.y - from.y, to.z - from.z);
      const bendAmt = len * bend.ampFrac * Math.sin(t * bend.freq + bend.phase);
      const ctrl: Vec3 = {
        x: (from.x + to.x) / 2 + perp.x * bendAmt,
        y: (from.y + to.y) / 2 + perp.y * bendAmt,
        z: (from.z + to.z) / 2 + perp.z * bendAmt,
      };

      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
      sampleQuadraticSegments(from, ctrl, to, EDGE_SEGMENTS, posAttr.array as Float32Array);
      posAttr.needsUpdate = true;

      const joint = jointRefs.get(key);
      if (joint) joint.position.set(ctrl.x, ctrl.y, ctrl.z);
    });

    // Dense background net — one batched, straight-line geometry; this is
    // the fine mesh texture, not the structure, so it stays cheap and calm.
    const meshGeo = meshLineGeoRef.current;
    if (meshGeo) {
      const posAttr = meshGeo.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      MESH_EDGES.forEach((edge, i) => {
        const from = localPos.get(edge.from), to = localPos.get(edge.to);
        if (!from || !to) return;
        arr[i * 6] = from.x; arr[i * 6 + 1] = from.y; arr[i * 6 + 2] = from.z;
        arr[i * 6 + 3] = to.x; arr[i * 6 + 4] = to.y; arr[i * 6 + 5] = to.z;
      });
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <fog attach="fog" args={['#0a2a3a', 4, 15]} />
      <ambientLight intensity={0.6} color="#8ab4c7" />
      <pointLight position={[0, 0, 6]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-2.5, 1.8, 3]} intensity={0.9} color="#e6b800" />
      <directionalLight position={[2, -3, 2]} intensity={0.25} color="#6b9ab0" />

      {/* Invisible, generous click target so clicking anywhere on the mass
          enters — not only a precise hit on a sphere. */}
      {interactive && (
        <mesh onClick={handleEnter} frustumCulled={false}>
          <sphereGeometry args={[1.4, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      {/* Dense background mesh net — batched into one draw call. */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={meshLineGeoRef}>
          <bufferAttribute attach="attributes-position" count={MESH_EDGES.length * 2} array={meshEdgeArray} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#8ab4c7" transparent opacity={0.12} />
      </lineSegments>

      {/* Cross-link "silver bars" — bend with a joint circle riding each one. */}
      {EXTRA_EDGES.map(edge => {
        const key = `${edge.from}|${edge.to}`;
        return (
          <group key={key}>
            <lineSegments frustumCulled={false}>
              <bufferGeometry ref={geo => { if (geo) extraGeoRefs.set(key, geo); }}>
                <bufferAttribute attach="attributes-position" count={EDGE_SEGMENTS * 2} array={new Float32Array(EDGE_SEGMENTS * 2 * 3)} itemSize={3} />
              </bufferGeometry>
              <lineBasicMaterial color="#8ab4c7" transparent opacity={0.24} />
            </lineSegments>
            <mesh ref={m => { if (m) jointRefs.set(key, m); }} scale={0.032} frustumCulled={false}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial color="#b2c8d4" emissive="#b2c8d4" emissiveIntensity={0.35} />
            </mesh>
          </group>
        );
      })}

      {/* Tree bones — bending gold structure, a traveling signal on each. */}
      {TREE_EDGES.map(edge => {
        const key = `${edge.from}|${edge.to}`;
        const bold = BOLD_BONES.has(key);
        return (
          <group key={key}>
            <lineSegments frustumCulled={false}>
              <bufferGeometry ref={geo => { if (geo) boneGeoRefs.set(key, geo); }}>
                <bufferAttribute attach="attributes-position" count={EDGE_SEGMENTS * 2} array={new Float32Array(EDGE_SEGMENTS * 2 * 3)} itemSize={3} />
              </bufferGeometry>
              <lineBasicMaterial color="#e6b800" transparent opacity={bold ? 0.55 : 0.3} />
            </lineSegments>
            <mesh ref={m => { if (m) signalRefs.set(key, m); }} scale={0.042} frustumCulled={false}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#e6b800" transparent opacity={0.9} />
            </mesh>
          </group>
        );
      })}

      {/* Nodes — real lit 3D spheres, sized per role, with a soft glow halo. */}
      {NODES.map(node => {
        const cat = CATEGORIES.find(c => c.id === node.category);
        const showLabel = Boolean(node.label) && (revealedIds.includes(node.id) || hoveredId === node.id);
        const isHovered = hoveredId === node.id;
        return (
          <mesh
            key={node.id}
            ref={m => { if (m) nodeMeshRefs.set(node.id, m); }}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => { if (!interactive) return; e.stopPropagation(); setHoveredId(node.id); }}
            onPointerOut={(e: ThreeEvent<PointerEvent>) => { if (!interactive) return; e.stopPropagation(); setHoveredId(id => (id === node.id ? null : id)); }}
            onClick={handleEnter}
          >
            <sphereGeometry args={[1, 20, 20]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={isHovered ? 0.65 : 0.3}
              roughness={0.4}
              metalness={0.15}
            />
            <mesh scale={2.4} frustumCulled={false}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshBasicMaterial
                color={cat?.glow ?? node.color}
                transparent
                opacity={0.16}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            {showLabel && (
              <Html center style={{ pointerEvents: 'none' }}>
                <div style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: node.id === 'ad' ? 15 : 12,
                  fontWeight: isHovered ? 700 : 600,
                  color: isHovered ? '#e8f0f5' : (node.id === 'ad' ? '#e6b800' : LABEL_COLOR),
                  whiteSpace: 'nowrap',
                  transform: 'translateY(16px)',
                  textShadow: '0 1px 6px rgba(0,0,0,0.6)',
                }}>
                  {node.label}
                </div>
              </Html>
            )}
          </mesh>
        );
      })}
    </group>
  );
}

/* ============================================================================
   Public component
   ============================================================================ */

interface ConstellationProps {
  onEnter?: () => void;
  /** Where the hub sits, as a fraction of the canvas's own box. */
  originXFrac?: number;
  originYFrac?: number;
  /** Overall size of the sphere, as a fraction of the radius basis below. */
  radiusFrac?: number;
  radiusBasis?: 'min' | 'height';
  /** Non-uniform scale applied to the skeleton group's x/y, independent of
   *  its z depth — a tall thin box wants a small stretchX and large
   *  stretchY so the mass reaches its full height without spilling past a
   *  narrow width. */
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
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 9], fov: 50, near: 0.1, far: 50 }}
      style={{ width: '100%', height: '100%', display: 'block', cursor: interactive ? 'pointer' : 'default' }}
    >
      <Scene
        onEnter={onEnter}
        originXFrac={originXFrac}
        originYFrac={originYFrac}
        radiusFrac={radiusFrac}
        radiusBasis={radiusBasis}
        stretchX={stretchX}
        stretchY={stretchY}
        interactive={interactive}
      />
    </Canvas>
  );
}
