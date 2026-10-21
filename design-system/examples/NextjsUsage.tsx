/**
 * Example for a React/Next.js project.
 * Copy component into the actual project src/ directory; adjust import path.
 * Import `design-system/styles/tokens.css` and `styles/motion.css` once from app/layout.tsx
 * or from your global stylesheet. This example has no external dependencies.
 */
import { ThiSmartPattern, type ThiSmartPatternVariant } from "../components/ThiSmartPatterns";

const variants: { id: ThiSmartPatternVariant; name: string }[] = [
  { id: "dot-grid", name: "Dot Grid" },
  { id: "answer-choice-grid", name: "Answer Choice Grid" },
  { id: "folded-ribbon-mesh", name: "Folded Ribbon Mesh" },
  { id: "academic-network", name: "Academic Network" },
  { id: "rounded-arc", name: "Rounded Arc Pattern" },
  { id: "soft-wave", name: "Soft Wave Divider" },
];

export default function ThiSmartDesignSystemPreview() {
  return (
    <main style={{ padding: "clamp(16px, 4vw, 48px)", background: "var(--ts-light)", color: "var(--ts-dark)", fontFamily: "var(--ts-font)", minHeight: "100vh" }}>
      <header style={{ marginBottom: 32 }}>
        <p style={{ color: "var(--ts-primary)", fontWeight: 700, letterSpacing: ".2em" }}>THISMART</p>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 58px)", letterSpacing: "-.035em", margin: 0 }}>Design System Preview</h1>
        <p>6 vector background patterns + CTA hover/press + feature card hover.</p>
        {/* Replace textual name with official logo SVG once available. */}
        <button type="button" className="ts-cta">Bắt đầu ngay <span aria-hidden="true">→</span></button>
      </header>
      <section aria-label="Background patterns" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 20 }}>
        {variants.map(({ id, name }) => (
          <article key={id} className="ts-feature-card" style={{ overflow: "hidden" }}>
            <ThiSmartPattern variant={id} />
            <div style={{ padding: "14px 18px" }}><strong>{name}</strong><p style={{ margin: "6px 0 0", color: "var(--ts-muted)" }}>{id}</p></div>
          </article>
        ))}
      </section>
    </main>
  );
}
