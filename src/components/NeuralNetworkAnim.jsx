"use client";

import { motion } from "framer-motion";

const W = 520;
const H = 300;
const PAD = 28;

const LAYER_CFG = [
  { x: 60,  n: 4, color: "#c4b5fd" },
  { x: 190, n: 6, color: "#a5b4fc" },
  { x: 330, n: 6, color: "#67e8f9" },
  { x: 460, n: 3, color: "#6ee7b7" },
];

function buildNodes() {
  return LAYER_CFG.flatMap((cfg, li) => {
    const step = cfg.n > 1 ? (H - PAD * 2) / (cfg.n - 1) : 0;
    return Array.from({ length: cfg.n }, (_, ni) => ({
      id: `${li}-${ni}`, x: cfg.x,
      y: cfg.n > 1 ? PAD + ni * step : H / 2,
      color: cfg.color, li, ni,
    }));
  });
}

const NODES = buildNodes();

const EDGES = [];
for (let l = 0; l < LAYER_CFG.length - 1; l++) {
  const from = NODES.filter(n => n.li === l);
  const to   = NODES.filter(n => n.li === l + 1);
  from.forEach(f => to.forEach(t => EDGES.push({ f, t, id: `${f.id}>${t.id}` })));
}

// 3 signal paths through the network
const SIG_KEYS = [
  ["0-1","1-2","2-3","3-1"],
  ["0-3","1-4","2-2","3-2"],
  ["0-0","1-1","2-4","3-0"],
];
const SIGNALS = SIG_KEYS.map(keys =>
  keys.map(k => NODES.find(n => n.id === k)).filter(Boolean)
).filter(p => p.length === 4);

export function NeuralNetworkAnim({ className = "" }) {
  return (
    <motion.svg
      viewBox={`0 0 ${W} ${H}`}
      className={`overflow-visible ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <defs>
        <filter id="nn-node-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nn-sig-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background edges */}
      {EDGES.map(({ f, t, id }) => (
        <line key={id} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
          stroke="rgba(139,92,246,0.1)" strokeWidth="0.8" />
      ))}

      {/* Highlighted signal edges */}
      {SIGNALS.flatMap((path, pi) =>
        path.slice(0, -1).map((nd, ni) => {
          const next = path[ni + 1];
          return (
            <line key={`hl-${pi}-${ni}`}
              x1={nd.x} y1={nd.y} x2={next.x} y2={next.y}
              stroke={nd.color} strokeWidth="1.5" opacity="0.35" />
          );
        })
      )}

      {/* Signal particles */}
      {SIGNALS.map((path, pi) => {
        const d = path.map((n, i) => `${i === 0 ? "M" : "L"} ${n.x} ${n.y}`).join(" ");
        return (
          <circle key={`sig-${pi}`} r="4" fill={path[0].color} filter="url(#nn-sig-glow)">
            <animateMotion dur={`${1.8 + pi * 0.65}s`} repeatCount="indefinite" begin={`${pi * 0.55}s`} path={d} />
          </circle>
        );
      })}

      {/* Nodes */}
      {NODES.map((nd, i) => (
        <g key={nd.id}>
          {/* Pulse ring */}
          <circle cx={nd.x} cy={nd.y} r="9" fill={nd.color} opacity="0.1">
            <animate attributeName="r" values="7;13;7" dur={`${2 + (i % 3) * 0.6}s`}
              repeatCount="indefinite" begin={`${i * 0.07}s`} />
            <animate attributeName="opacity" values="0.1;0.22;0.1" dur={`${2 + (i % 3) * 0.6}s`}
              repeatCount="indefinite" begin={`${i * 0.07}s`} />
          </circle>
          {/* Core */}
          <circle cx={nd.x} cy={nd.y} r="5" fill={nd.color} filter="url(#nn-node-glow)" opacity="0.9">
            <animate attributeName="opacity" values="0.7;1;0.7" dur={`${1.5 + (i % 4) * 0.4}s`}
              repeatCount="indefinite" begin={`${i * 0.05}s`} />
          </circle>
        </g>
      ))}
    </motion.svg>
  );
}
