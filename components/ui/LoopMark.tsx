interface LoopMarkProps {
  className?: string;
  /** Unique suffix for gradient/path ids when more than one emblem is on a page. */
  idSuffix?: string;
}

// A small gold lozenge (rotated square) used to cap the text band and mark the foot.
function Diamond({ cx, cy, r = 1.8, fill = "var(--accent)" }: { cx: number; cy: number; r?: number; fill?: string }) {
  return <path d={`M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z`} fill={fill} />;
}

/**
 * The brand emblem: a premium engraved seal. A dark disc under a double gold edge,
 * with "LOOP ENGINEERING" set in the serif brand face curving along the top of the
 * ring; gold lozenges cap the text band at the sides and mark the foot. At the
 * centre sits the refined loop glyph — a clean geometric ring carrying an
 * olive → brass → sand gradient arc up to a lit "heartbeat" node. Everything is
 * drawn from the brand tokens, so it re-tints per theme. The <svg> carries the
 * accessible name; decorative sub-parts are hidden from assistive tech.
 */
export function LoopMark({ className = "", idSuffix = "" }: LoopMarkProps) {
  const live = `lm-live${idSuffix}`;
  const ring = `lm-ring${idSuffix}`;
  const sheen = `lm-sheen${idSuffix}`;
  const arc = `lm-arc${idSuffix}`;
  const arcFoot = `lm-arcfoot${idSuffix}`;

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      role="img"
      aria-label="Loop Engineering"
    >
      <defs>
        {/* centre glyph: bottom (olive) → mid (brass) → top node (sand) */}
        <linearGradient id={live} x1="42" y1="82" x2="66" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--olive)" />
          <stop offset="52%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--text)" />
        </linearGradient>
        {/* gold edge, lit from upper-left for subtle depth */}
        <linearGradient id={ring} x1="16" y1="16" x2="104" y2="104" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--accent-2)" />
          <stop offset="55%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--olive)" />
        </linearGradient>
        {/* faint top sheen across the disc — the "subtle depth" */}
        <radialGradient id={sheen} cx="50%" cy="26%" r="62%">
          <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.12" />
          <stop offset="70%" stopColor="var(--accent-2)" stopOpacity="0" />
        </radialGradient>
        {/* baselines for the curved type: wordmark over the top, tagline under the foot */}
        <path id={arc} d="M 17 60 A 43 43 0 0 1 103 60" />
        <path id={arcFoot} d="M 21 60 A 39 39 0 0 0 99 60" />
      </defs>

      {/* round base + sheen */}
      <circle cx="60" cy="60" r="57" fill="var(--surface)" />
      <circle cx="60" cy="60" r="57" fill={`url(#${sheen})`} />

      {/* double gold seal edge */}
      <circle cx="60" cy="60" r="57" stroke={`url(#${ring})`} strokeWidth="1.6" />
      <circle cx="60" cy="60" r="51.5" stroke="var(--accent)" strokeWidth="0.7" opacity="0.5" />

      {/* curved wordmark along the top of the ring — bold */}
      <text
        className="font-brand"
        fill="var(--accent-2)"
        fontSize="8"
        fontWeight="700"
        letterSpacing="2.6"
        aria-hidden="true"
      >
        <textPath href={`#${arc}`} startOffset="50%" textAnchor="middle" dominantBaseline="central">
          LOOP ENGINEERING
        </textPath>
      </text>

      {/* curved tagline along the foot */}
      <text
        className="font-brand"
        fill="var(--accent)"
        fontSize="5.4"
        fontWeight="600"
        letterSpacing="2.4"
        aria-hidden="true"
      >
        <textPath href={`#${arcFoot}`} startOffset="50%" textAnchor="middle" dominantBaseline="central">
          CRASH COURSE
        </textPath>
      </text>

      {/* lozenges cap the text band at the sides */}
      <g aria-hidden="true">
        <Diamond cx={17} cy={60} />
        <Diamond cx={103} cy={60} />
      </g>

      {/* inner frame */}
      <circle cx="60" cy="60" r="37" stroke="var(--accent)" strokeWidth="0.7" opacity="0.35" />

      {/* centre loop glyph — clean geometry, consistent stroke */}
      <g aria-hidden="true">
        <circle cx="60" cy="60" r="20" stroke="var(--olive)" strokeWidth="1.5" opacity="0.55" />
        <path
          d="M 48.53 76.38 A 20 20 0 0 1 60 40"
          stroke={`url(#${live})`}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* heartbeat node with soft glow + sand highlight */}
        <circle cx="60" cy="40" r="7" fill="var(--accent)" opacity="0.10" />
        <circle cx="60" cy="40" r="4.4" fill="var(--accent)" opacity="0.18" />
        <circle cx="60" cy="40" r="2.7" fill="var(--accent)" />
        <circle cx="58.9" cy="38.9" r="1" fill="var(--text)" />
      </g>
    </svg>
  );
}
