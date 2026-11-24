"use client";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

export type TreeNode = { name: string; children?: TreeNode[] };
export type Step = { k: string; t: string; l: string[] };

/** Radial tree: studio at the centre, services on the first ring, tools or deliverables on the outer ring. */
export function Radial({ data, label }: { data: TreeNode; label: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = d3.select(ref.current!);
    svg.selectAll("*").remove();
    const root = d3.hierarchy(data);
    d3.cluster<TreeNode>().size([2 * Math.PI, 1])(root);
    root.each((d) => { (d as any).r = d.depth === 0 ? 0 : d.depth === 1 ? 125 : 262; });
    const g = svg.append("g").attr("transform", "translate(390,390)");
    g.selectAll("path").data(root.links()).join("path").attr("class", "lk")
      .attr("d", d3.linkRadial<any, any>().angle((d) => d.x).radius((d) => d.r));
    const n = g.selectAll("g").data(root.descendants().filter((d) => d.depth > 0)).join("g")
      .attr("transform", (d: any) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.r},0)`);
    n.append("circle").attr("r", (d) => (d.depth === 1 ? 5 : 3.5)).attr("class", (d) => `dot d${d.depth}`);
    n.append("text").attr("class", (d) => `tx t${d.depth}`).attr("dy", "0.32em")
      .attr("x", (d: any) => (d.x < Math.PI ? 9 : -9)).attr("text-anchor", (d: any) => (d.x < Math.PI ? "start" : "end"))
      .attr("transform", (d: any) => (d.x >= Math.PI ? "rotate(180)" : null)).text((d) => d.data.name);
    g.append("circle").attr("r", 40).attr("class", "dot d0");
    g.append("text").attr("class", "tx core").attr("text-anchor", "middle").attr("dy", "-0.1em").text("Dhidroid");
    g.append("text").attr("class", "tx core").attr("text-anchor", "middle").attr("dy", "1.1em").text("Labs");
  }, [data]);
  return <svg ref={ref} viewBox="0 0 780 780" role="img" aria-label={label} />;
}

/** Horizontal track: ordered steps (or options), each with a marker, a title and short lines of detail. */
export function Track({ items, label }: { items: Step[]; label: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = d3.select(ref.current!);
    svg.selectAll("*").remove();
    const x = d3.scalePoint<string>().domain(items.map((i) => i.t)).range([110, 890]).padding(0);
    svg.append("line").attr("class", "lk").attr("x1", x(items[0].t)!).attr("x2", x(items[items.length - 1].t)!).attr("y1", 34).attr("y2", 34);
    const g = svg.selectAll("g").data(items).join("g").attr("transform", (d) => `translate(${x(d.t)},34)`);
    g.append("circle").attr("r", 17).attr("class", "dot d1");
    g.append("text").attr("class", "tx mk").attr("text-anchor", "middle").attr("dy", "0.35em").text((d) => d.k);
    g.append("text").attr("class", "tx t1").attr("text-anchor", "middle").attr("y", 62).text((d) => d.t);
    g.selectAll("text.ln").data((d) => d.l).join("text").attr("class", "tx ln").attr("text-anchor", "middle")
      .attr("y", (_, i) => 86 + i * 17).text((d) => d);
  }, [items]);
  return <svg ref={ref} viewBox="0 0 1000 170" role="img" aria-label={label} />;
}

/** Layered testing pyramid: narrow top = slow and rare, wide base = fast and frequent. */
export function Pyramid({ items, label }: { items: [string, string][]; label: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = d3.select(ref.current!);
    svg.selectAll("*").remove();
    const n = items.length, cx = 270, rh = 58, hw = (i: number) => 60 + i * 36, col = d3.interpolateRgb("#2f8fe8", "#262323");
    items.forEach(([t, d], i) => {
      const y = 10 + i * rh, b = y + rh - 4, m = y + rh / 2 - 2;
      svg.append("polygon").attr("points", `${cx - hw(i)},${y} ${cx + hw(i)},${y} ${cx + hw(i + 1)},${b} ${cx - hw(i + 1)},${b}`).attr("fill", col(i / (n - 1)));
      svg.append("text").attr("class", "tx mk").attr("x", cx).attr("y", m).attr("dy", "0.35em").attr("text-anchor", "middle").text(t);
      svg.append("line").attr("class", "lk").attr("x1", cx + hw(i + 0.5) + 6).attr("x2", 560).attr("y1", m).attr("y2", m);
      svg.append("text").attr("class", "tx ln").attr("x", 572).attr("y", m).attr("dy", "0.35em").text(d);
    });
  }, [items]);
  return <svg ref={ref} viewBox="0 0 1000 310" role="img" aria-label={label} />;
}

/** V-model: design decisions on the left are each checked by a test level on the right. */
export function VModel({ label }: { label: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = d3.select(ref.current!);
    svg.selectAll("*").remove();
    const L = [["Requirements", "IEEE/ISO/IEC 29148"], ["System design", ""], ["Architecture", "ISO/IEC/IEEE 42010"], ["Module design", ""]];
    const R = [["Acceptance tests", ""], ["System tests", "ISO/IEC 25010"], ["Integration tests", ""], ["Unit tests", ""]];
    const lx = (i: number) => 230 + i * 70, rx = (i: number) => 790 - i * 70, ly = (i: number) => 40 + i * 62;
    const pts: [number, number][] = [...[0, 1, 2, 3].map((i): [number, number] => [lx(i), ly(i)]), [510, 300], ...[3, 2, 1, 0].map((i): [number, number] => [rx(i), ly(i)])];
    [0, 1, 2, 3].forEach((i) => svg.append("line").attr("class", "lk").attr("stroke-dasharray", "4 5").attr("x1", lx(i) + 10).attr("x2", rx(i) - 10).attr("y1", ly(i)).attr("y2", ly(i)));
    svg.append("path").attr("class", "lk").attr("stroke", "rgba(38,35,35,.55)").attr("stroke-width", 1.5).attr("d", d3.line()(pts));
    svg.selectAll("circle").data(pts).join("circle").attr("class", "dot d1").attr("r", 6).attr("cx", (d) => d[0]).attr("cy", (d) => d[1]);
    const lab = (t: string, s: string, x: number, y: number, a: string) => {
      svg.append("text").attr("class", "tx t1").attr("x", x).attr("y", y).attr("dy", "0.32em").attr("text-anchor", a).text(t);
      if (s) svg.append("text").attr("class", "tx ln").attr("x", x).attr("y", y + 17).attr("text-anchor", a).text(s);
    };
    L.forEach(([t, s], i) => lab(t, s, lx(i) - 14, ly(i), "end"));
    R.forEach(([t, s], i) => lab(t, s, rx(i) + 14, ly(i), "start"));
    lab("Implementation", "ISO/IEC/IEEE 12207", 510, 326, "middle");
  }, []);
  return <svg ref={ref} viewBox="0 0 1000 370" role="img" aria-label={label} />;
}

export type FNode = { name: string; note?: string; children?: FNode[] };

/** Repository tree drawn from a hierarchy: folders, files and a short note for each. */
export function FolderTree({ data, label }: { data: FNode; label: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = d3.select(ref.current!);
    svg.selectAll("*").remove();
    const rows = d3.hierarchy(data).descendants(), rh = 28;
    rows.forEach((d, i) => ((d as any).row = i));
    svg.attr("viewBox", `0 0 760 ${rows.length * rh + 16}`);
    const X = (d: any) => 14 + d.depth * 24, Y = (d: any) => 18 + d.row * rh;
    svg.selectAll("path.lk").data(rows.slice(1)).join("path").attr("class", "lk").attr("d", (d: any) => `M${X(d.parent) + 7},${Y(d.parent) + 8}V${Y(d)}H${X(d) - 4}`);
    const g = svg.selectAll("g").data(rows).join("g").attr("transform", (d: any) => `translate(${X(d)},${Y(d)})`);
    g.append("path").attr("d", (d) => (d.children ? "M0,-6h6l2,2h8v10h-16z" : "M2,-7h8l4,4v11h-12z")).attr("class", (d) => (d.children ? "fold" : "file"));
    g.append("text").attr("class", "tx t1").attr("x", 24).attr("dy", "0.32em").text((d) => d.data.name);
    g.filter((d) => !!d.data.note).append("text").attr("class", "tx ln").attr("x", (d: any) => 330 - X(d)).attr("dy", "0.32em").text((d) => d.data.note!);
  }, [data]);
  return <svg ref={ref} viewBox="0 0 760 600" role="img" aria-label={label} />;
}
