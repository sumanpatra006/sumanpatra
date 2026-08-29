"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { skills, SKILL_CATEGORIES, type Skill, type SkillCategory } from "@/data/skills";
import { projects } from "@/data/projects";
import { SkillInfoPanel } from "./SkillInfoPanel";
import { ZoomIn, ZoomOut, RotateCcw, Activity } from "lucide-react";

interface GraphNodeItem extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: "root" | "category" | "skill";
  category?: SkillCategory;
  projectIds?: string[];
  radius: number;
}

interface GraphLinkItem extends d3.SimulationLinkDatum<GraphNodeItem> {
  id: string;
  source: string | GraphNodeItem;
  target: string | GraphNodeItem;
}

export function ForceGraphEngine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);

  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  // Prepare graph data
  const graphData = useMemo(() => {
    const nodes: GraphNodeItem[] = [
      { id: "root-you", label: "HUMAN.EXE (CORE)", type: "root", radius: 34 },
    ];

    const links: GraphLinkItem[] = [];

    // Category nodes
    (Object.entries(SKILL_CATEGORIES) as [SkillCategory, { label: string }][]).forEach(
      ([catKey, catVal]) => {
        nodes.push({
          id: `cat-${catKey}`,
          label: catVal.label,
          type: "category",
          category: catKey,
          radius: 24,
        });

        links.push({
          id: `link-root-cat-${catKey}`,
          source: "root-you",
          target: `cat-${catKey}`,
        });
      }
    );

    // Skill nodes
    skills.forEach((skill) => {
      nodes.push({
        id: skill.id,
        label: skill.label,
        type: "skill",
        category: skill.category,
        projectIds: skill.projectIds,
        radius: 18,
      });

      links.push({
        id: `link-cat-${skill.category}-${skill.id}`,
        source: `cat-${skill.category}`,
        target: skill.id,
      });
    });

    return { nodes, links };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 960;
    const height = 640;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    const g = svg.append("g");
    gRef.current = g;

    // D3 Zoom: Filter out wheel events so page scrolling is never trapped
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.5])
      .filter((event) => {
        return event.type !== "wheel";
      })
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Clone data for simulation
    const nodes: GraphNodeItem[] = graphData.nodes.map((d) => ({ ...d }));
    const links: GraphLinkItem[] = graphData.links.map((d) => ({ ...d }));

    // Force Simulation tuned for full-screen visibility without edge clipping
    const simulation = d3.forceSimulation<GraphNodeItem>(nodes)
      .force(
        "link",
        d3.forceLink<GraphNodeItem, GraphLinkItem>(links)
          .id((d) => d.id)
          .distance((d) => {
            const target = d.target as GraphNodeItem;
            if (target.type === "category") return 110;
            return 80;
          })
          .strength(0.9)
      )
      .force("charge", d3.forceManyBody().strength(-360))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide<GraphNodeItem>().radius((d) => {
          const textWidthEstimate = d.label.length * 4.2;
          return Math.max(d.radius, textWidthEstimate) + 16;
        }).iterations(3)
      );

    // Links Layer
    const linkGroup = g.append("g").attr("class", "links-layer");

    const link = linkGroup
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "var(--border-subtle)")
      .attr("stroke-width", (d) => {
        const target = d.target as GraphNodeItem;
        return target.type === "category" ? 2 : 1.2;
      })
      .attr("stroke-dasharray", (d) => {
        const target = d.target as GraphNodeItem;
        return target.type === "category" ? "none" : "4,4";
      });

    // ── DATA PACKET PARTICLES LAYER ──
    const packetGroup = g.append("g").attr("class", "packets-layer");

    const packets = packetGroup
      .selectAll("circle")
      .data(links)
      .enter()
      .append("circle")
      .attr("r", 2.5)
      .attr("fill", "var(--accent-primary)")
      .style("filter", "drop-shadow(0 0 6px var(--accent-primary))")
      .attr("opacity", 0.85);

    const packetProgress = links.map(() => Math.random());

    // Nodes Layer
    const nodeGroup = g.append("g").attr("class", "nodes-layer");

    const node = nodeGroup
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "cursor-grab active:cursor-grabbing")
      .call(
        d3.drag<SVGGElement, GraphNodeItem>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Render Circular & Rounded-Pill Nodes
    node.each(function (d) {
      const el = d3.select(this);

      if (d.type === "root") {
        // Central Root Circle
        el.append("circle")
          .attr("r", d.radius)
          .attr("fill", "var(--bg-elevated)")
          .attr("stroke", "var(--accent-primary)")
          .attr("stroke-width", 2.5)
          .style("filter", "drop-shadow(0 0 14px var(--accent-primary-dim))");

        el.append("circle")
          .attr("r", d.radius - 6)
          .attr("fill", "none")
          .attr("stroke", "var(--border-subtle)")
          .attr("stroke-dasharray", "3,3");

        el.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", ".35em")
          .attr("fill", "var(--accent-primary)")
          .attr("font-size", "10px")
          .attr("font-family", "var(--font-mono)")
          .attr("font-weight", "bold")
          .text("HUMAN.EXE");
      } else if (d.type === "category") {
        // Category Pill Badge
        const textLen = d.label.length * 7 + 24;
        el.append("rect")
          .attr("x", -textLen / 2)
          .attr("y", -14)
          .attr("width", textLen)
          .attr("height", 28)
          .attr("rx", 14)
          .attr("ry", 14)
          .attr("fill", "var(--bg-surface)")
          .attr("stroke", "var(--accent-secondary)")
          .attr("stroke-width", 1.8)
          .style("filter", "drop-shadow(0 0 8px var(--accent-secondary-dim))");

        el.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", ".35em")
          .attr("fill", "var(--text-primary)")
          .attr("font-size", "11px")
          .attr("font-family", "var(--font-mono)")
          .attr("font-weight", "bold")
          .text(`● ${d.label}`);
      } else {
        // Individual Skill Circular Badge
        const textLen = d.label.length * 6.8 + 18;
        el.append("rect")
          .attr("class", "skill-badge")
          .attr("x", -textLen / 2)
          .attr("y", -11)
          .attr("width", textLen)
          .attr("height", 22)
          .attr("rx", 11)
          .attr("ry", 11)
          .attr("fill", "var(--bg-surface)")
          .attr("stroke", "var(--border-subtle)")
          .attr("stroke-width", 1.2)
          .style("transition", "all 0.2s ease");

        el.append("text")
          .attr("class", "skill-text")
          .attr("text-anchor", "middle")
          .attr("dy", ".35em")
          .attr("fill", "var(--text-secondary)")
          .attr("font-size", "10px")
          .attr("font-family", "var(--font-mono)")
          .text(d.label);
      }
    });

    // Hover Interactions
    node
      .on("mouseenter", function (event, d) {
        if (d.type === "skill") {
          const matchedSkill = skills.find((s) => s.id === d.id);
          if (matchedSkill) setHoveredSkill(matchedSkill);

          link
            .attr("stroke", (l) => {
              const src = l.source as GraphNodeItem;
              const tgt = l.target as GraphNodeItem;
              return src.id === d.id || tgt.id === d.id
                ? "var(--accent-primary)"
                : "var(--border-subtle)";
            })
            .attr("stroke-width", (l) => {
              const src = l.source as GraphNodeItem;
              const tgt = l.target as GraphNodeItem;
              return src.id === d.id || tgt.id === d.id ? 2.5 : 1.2;
            });

          d3.select(this)
            .select("rect")
            .attr("stroke", "var(--accent-primary)")
            .attr("fill", "var(--bg-elevated)")
            .style("filter", "drop-shadow(0 0 10px var(--accent-primary-dim))");

          d3.select(this)
            .select("text")
            .attr("fill", "var(--accent-primary)")
            .attr("font-weight", "bold");
        }
      })
      .on("mouseleave", function () {
        setHoveredSkill(null);

        link
          .attr("stroke", "var(--border-subtle)")
          .attr("stroke-width", (l) => {
            const tgt = l.target as GraphNodeItem;
            return tgt.type === "category" ? 2 : 1.2;
          });

        node.selectAll(".skill-badge")
          .attr("stroke", "var(--border-subtle)")
          .attr("fill", "var(--bg-surface)")
          .style("filter", "none");

        node.selectAll(".skill-text")
          .attr("fill", "var(--text-secondary)")
          .attr("font-weight", "normal");
      });

    // Simulation & Packet Loop
    let packetTimer: d3.Timer;

    simulation.on("tick", () => {
      // Auto-constrain within bounds
      nodes.forEach((d) => {
        d.x = Math.max(d.radius + 10, Math.min(width - d.radius - 10, d.x || 0));
        d.y = Math.max(d.radius + 10, Math.min(height - d.radius - 10, d.y || 0));
      });

      link
        .attr("x1", (d) => (d.source as GraphNodeItem).x || 0)
        .attr("y1", (d) => (d.source as GraphNodeItem).y || 0)
        .attr("x2", (d) => (d.target as GraphNodeItem).x || 0)
        .attr("y2", (d) => (d.target as GraphNodeItem).y || 0);

      node.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    packetTimer = d3.timer(() => {
      packets.each(function (d, i) {
        const src = d.source as GraphNodeItem;
        const tgt = d.target as GraphNodeItem;
        if (!src.x || !src.y || !tgt.x || !tgt.y) return;

        const speed = tgt.type === "category" ? 0.008 : 0.005;
        packetProgress[i] = (packetProgress[i] + speed) % 1.0;

        const currentX = src.x + (tgt.x - src.x) * packetProgress[i];
        const currentY = src.y + (tgt.y - src.y) * packetProgress[i];

        d3.select(this).attr("cx", currentX).attr("cy", currentY);
      });
    });

    return () => {
      simulation.stop();
      packetTimer.stop();
    };
  }, [graphData]);

  // Explicit Zoom Button Handlers
  const handleZoomIn = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(400).call(zoomRef.current.transform, d3.zoomIdentity);
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden select-none">
      {/* Top Status & Dedicated Zoom Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-mono text-[11px] text-text-secondary bg-bg-surface/80 px-3 py-1.5 rounded-full border border-border-subtle shadow-md backdrop-blur-sm">
          <Activity className="w-3.5 h-3.5 text-accent-primary animate-pulse" />
          <span>Full-Bleed Physics Network • Circular Badges &amp; Data Packets</span>
        </div>

        {/* Dedicated Zoom Control Buttons */}
        <div className="flex items-center gap-1 bg-bg-surface/85 p-1 rounded-full border border-border-accent shadow-md backdrop-blur-sm">
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-bg-elevated text-text-secondary hover:text-accent-primary rounded-full transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-bg-elevated text-text-secondary hover:text-accent-primary rounded-full transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 hover:bg-bg-elevated text-text-secondary hover:text-accent-primary rounded-full transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas (Full-bleed, seamless against page background) */}
      <svg
        ref={svgRef}
        className="w-full h-[560px] md:h-[640px] block cursor-default"
      />

      {/* Floating Info Panel on hover */}
      {hoveredSkill && (
        <SkillInfoPanel
          skill={hoveredSkill}
          projects={projects.filter((p) => hoveredSkill.projectIds.includes(p.id))}
          x={0}
          y={0}
        />
      )}
    </div>
  );
}
