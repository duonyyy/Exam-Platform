import * as React from "react";

/**
 * Editable SVG starter inspired by ThiSmart Pattern System poster.
 * Decorative SVGs intentionally do not reproduce the poster as an image.
 * For production, refine geometry against references/02-background-patterns.png.
 */
export type ThiSmartPatternVariant =
  | "dot-grid"
  | "answer-choice-grid"
  | "folded-ribbon-mesh"
  | "academic-network"
  | "rounded-arc"
  | "soft-wave";

export interface ThiSmartPatternProps extends React.SVGProps<SVGSVGElement> {
  variant: ThiSmartPatternVariant;
}

const nodePositions = [
  [55, 164, 7], [103, 48, 13], [216, 102, 11], [254, 215, 18],
  [104, 286, 21], [338, 330, 17], [420, 272, 8], [510, 101, 19],
  [590, 278, 16], [610, 47, 9], [510, 353, 12], [685, 164, 10],
  [198, 343, 5], [412, 65, 24],
] as const;

const edges: [number, number][] = [
  [0, 1], [0, 3], [0, 4], [1, 2], [1, 3], [2, 3], [2, 7],
  [3, 4], [3, 5], [3, 6], [4, 12], [5, 6], [5, 10], [6, 7],
  [6, 8], [7, 8], [7, 9], [8, 10], [8, 11], [9, 11], [10, 11],
];

export function ThiSmartPattern({ variant, style, ...rest }: ThiSmartPatternProps) {
  const uid = React.useId().replace(/:/g, "");
  const gradient = `${uid}-gradient`;
  const fade = `${uid}-fade`;
  const blue = `${uid}-blue`;
  const clip = `${uid}-clip`;
  const palette = ["#B9D6FF", "#DAE9FF", "#8CC6FA", "#2563EB", "#06B6D4"];

  let drawing: React.ReactNode;
  switch (variant) {
    case "dot-grid": {
      drawing = (
        <>
          {Array.from({ length: 8 }, (_, r) =>
            Array.from({ length: 12 }, (_, c) => {
              const accent = (r * 13 + c * 7) % 19 === 3;
              const cyan = (r * 5 + c * 11) % 23 === 9;
              const color = accent ? "#2563EB" : cyan ? "#06B6D4" : palette[(r + c * 2) % 3];
              return <circle key={`${r}-${c}`} cx={48 + c * 56} cy={48 + r * 47} r={accent ? 7 : cyan ? 6 : 4.8} fill={color} opacity={accent || cyan ? 1 : 0.75} />;
            })
          )}
        </>
      );
      break;
    }
    case "answer-choice-grid": {
      drawing = (
        <>
          {Array.from({ length: 4 }, (_, r) =>
            Array.from({ length: 3 }, (_, c) => {
              const selected = (r + c * 3) % 4 === 1;
              const soft = (r * 3 + c) % 4 === 2;
              return (
                <g key={`${r}-${c}`} transform={`translate(${34 + c * 233} ${44 + r * 88})`}>
                  <rect width="195" height="61" rx="31" fill={soft ? "#E5F1FF" : "#FFFFFF"} fillOpacity=".82" stroke="#BFD9FF" strokeWidth="1.5" />
                  <circle cx="35" cy="30.5" r="14" fill={selected ? `url(#${gradient})` : soft ? "#C7E6FF" : "#FFFFFF"} stroke={selected ? "none" : "#80B3FF"} strokeWidth="2.5" />
                </g>
              );
            })
          )}
        </>
      );
      break;
    }
    case "folded-ribbon-mesh": {
      drawing = (
        <>
          <path d="M-80 43 L174 191 L455 -24 L760 -24 L290 281 Z" fill={`url(#${fade})`} opacity=".9" />
          <path d="M-140 86 L352 362 L352 485 L-140 212 Z" fill={`url(#${blue})`} opacity=".9" />
          <path d="M115 478 L115 231 Q115 179 165 193 L390 324 Q445 357 445 399 L445 476" fill={`url(#${gradient})`} opacity=".88" />
          <path d="M440 0 L720 0 L432 179 L194 319 L80 256 Z" fill="#DBEAFF" opacity=".76" />
          <path d="M555 -55 L555 202 Q555 239 598 268 L760 351 L760 168 L687 129 L760 86 L760 -55 Z" fill={`url(#${fade})`} opacity=".84" />
          <path d="M565 281 L740 373 L740 435 L526 312 Z" fill={`url(#${blue})`} opacity=".85" />
        </>
      );
      break;
    }
    case "academic-network": {
      drawing = (
        <>
          {edges.map(([a, b], i) => <line key={i} x1={nodePositions[a][0]} y1={nodePositions[a][1]} x2={nodePositions[b][0]} y2={nodePositions[b][1]} stroke={i % 5 === 0 ? "#86C9FF" : "#B7D6FC"} strokeWidth={i % 5 === 0 ? 1.7 : 1.25} />)}
          {nodePositions.map(([x, y, radius], i) => (
            <circle key={i} cx={x} cy={y} r={radius} fill={i === 3 ? "#FFFFFF" : i % 4 === 2 ? "#06B6D4" : i % 4 === 3 ? "#2563EB" : "#A7D4FE"} stroke={i === 3 ? "#2563EB" : "#FFFFFF"} strokeWidth={i === 3 ? 4 : 2} />
          ))}
          <circle cx="511" cy="102" r="28" fill="#2563EB" opacity=".10" />
        </>
      );
      break;
    }
    case "rounded-arc": {
      drawing = (
        <>
          <path d="M-160 50 Q220 -10 237 341 L237 510" fill="none" stroke="#CFE4FF" strokeWidth="170" opacity=".85" />
          <path d="M-160 80 Q170 30 183 310 L183 510" fill="none" stroke={`url(#${gradient})`} strokeWidth="92" opacity=".68" />
          <path d="M-190 65 Q185 10 214 360 L214 510" fill="none" stroke="#3F7EFA" strokeWidth="1.5" />
          <path d="M448 -170 L448 45 Q448 225 640 225 L822 225" fill="none" stroke="#E3F1FF" strokeWidth="160" opacity=".9" />
          <path d="M450 -170 L450 47 Q450 234 648 235 L822 235" fill="none" stroke="#5192FF" strokeWidth="1.7" />
          <path d="M720 310 Q560 270 554 445 L554 535" fill="none" stroke={`url(#${fade})`} strokeWidth="170" opacity=".7" />
          <path d="M720 311 Q559 271 554 446 L554 535" fill="none" stroke="#63BEFB" strokeWidth="1.2" />
        </>
      );
      break;
    }
    case "soft-wave": {
      drawing = (
        <>
          <path d="M0 137 Q188 -19 385 121 T720 86 L720 420 L0 420 Z" fill="#DCEEFF" opacity=".93" />
          <path d="M0 218 C135 118 229 158 371 253 S603 313 720 185 L720 420 L0 420 Z" fill={`url(#${fade})`} opacity=".8" />
          <path d="M0 267 C169 307 258 131 422 188 S610 284 720 246 L720 420 L0 420 Z" fill={`url(#${blue})`} opacity=".78" />
          <path d="M0 351 C134 314 217 215 343 230 S555 392 720 324 L720 420 L0 420 Z" fill="#CFEAFF" opacity=".93" />
          <path d="M0 256 C141 321 273 172 427 186 S630 285 720 234" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity=".92" />
        </>
      );
      break;
    }
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 720 420"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      {...rest}
      style={{ display: "block", width: "100%", height: "auto", pointerEvents: "none", ...style }}
    >
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#2563EB" />
          <stop offset=".55" stopColor="#388CFA" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id={fade} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#9FCAFF" />
          <stop offset="1" stopColor="#86E5FA" />
        </linearGradient>
        <linearGradient id={blue} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#50CFF1" />
        </linearGradient>
        <clipPath id={clip}><rect width="720" height="420" /></clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="720" height="420" fill="#F8FAFC" />
        {drawing}
      </g>
    </svg>
  );
}
