"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

type NodeItem = { id: string; label: string; group: string; val: number };
type LinkItem = { source: string; target: string; weight: number };
type GraphPayload = { nodes: NodeItem[]; links: LinkItem[] };

export default function GraphClient({ initial }: { initial: GraphPayload }) {
  const [graph, setGraph] = useState<GraphPayload>(initial);
  const [focus, setFocus] = useState("");

  useEffect(() => {
    fetch("/api/graph")
      .then((res) => res.json())
      .then((data) => setGraph(data))
      .catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    if (!focus.trim()) return graph;
    const q = focus.trim().toLowerCase();
    const matchedNodeIds = new Set(
      graph.nodes.filter((n) => `${n.label} ${n.group}`.toLowerCase().includes(q)).map((n) => n.id)
    );

    const links = graph.links.filter((l) => matchedNodeIds.has(String(l.source)) || matchedNodeIds.has(String(l.target)));
    const linkedIds = new Set<string>();
    links.forEach((l) => {
      linkedIds.add(String(l.source));
      linkedIds.add(String(l.target));
    });

    return {
      nodes: graph.nodes.filter((n) => linkedIds.has(n.id)),
      links
    };
  }, [graph, focus]);

  return (
    <section className="panel">
      <div className="badge">Graph explorer</div>
      <h2>Provider ↔ region relationship map</h2>
      <p className="muted">
        This view compresses the dataset into a weighted network of index providers and regions so you can inspect structural concentration quickly.
      </p>
      <div className="controls" style={{ gridTemplateColumns: "1fr auto" }}>
        <input value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="Filter graph by provider or region..." />
        <button onClick={() => setFocus("")}>Reset graph filter</button>
      </div>

      <div style={{ height: 720, border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", marginTop: 12 }}>
        <ForceGraph2D
          graphData={filtered}
          nodeRelSize={6}
          linkWidth={(link: object) => Math.max(1, Math.log2(((link as LinkItem).weight || 1) + 1))}
          linkDirectionalParticles={0}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const n = node as NodeItem;
            const label = n.label;
            const fontSize = 14 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = n.group === "provider" ? "#5eead4" : "#93c5fd";
            ctx.beginPath();
            ctx.arc((n as unknown as { x?: number }).x || 0, (n as unknown as { y?: number }).y || 0, Math.max(3, n.val || 4), 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.fillStyle = "#e7ecf7";
            ctx.fillText(label, ((n as unknown as { x?: number }).x || 0) + 8, ((n as unknown as { y?: number }).y || 0) + 4);
          }}
          onNodeClick={(node) => setFocus((node as NodeItem).label)}
        />
      </div>

      <div className="muted" style={{ marginTop: 12 }}>
        Showing {filtered.nodes.length.toLocaleString()} nodes and {filtered.links.length.toLocaleString()} links.
      </div>
    </section>
  );
}
