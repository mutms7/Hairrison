interface Props {
  size?: number;
  className?: string;
}

/**
 * The Hairrison mark: a red question-mark face under a curly blue
 * afro, with a white nose-dot (the question mark's floating dot) and
 * a smile. Transparent background so it sits on any surface; the
 * favicon variant in /public/favicon.svg adds the dark tile.
 */
export function Logo({ size = 48, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Hairrison"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#1f4fd6">
        <circle cx="16" cy="14" r="8" />
        <circle cx="25" cy="10" r="8" />
        <circle cx="34" cy="10" r="8" />
        <circle cx="43" cy="13" r="8" />
        <circle cx="49" cy="19" r="7" />
        <circle cx="50" cy="27" r="6" />
        <circle cx="15" cy="19" r="7" />
        <circle cx="14" cy="27" r="6" />
        <circle cx="24" cy="16" r="7" />
        <circle cx="40" cy="16" r="7" />
        <circle cx="32" cy="13" r="7" />
        <circle cx="21" cy="22" r="5.5" />
        <circle cx="43" cy="22" r="5.5" />
      </g>
      <g fill="#4f78ff">
        <circle cx="22" cy="11" r="2.4" />
        <circle cx="31" cy="7" r="2.4" />
        <circle cx="41" cy="11" r="2.4" />
        <circle cx="47" cy="18" r="2.2" />
        <circle cx="17" cy="21" r="2.2" />
      </g>
      <path
        d="M26 30 C26 24 38 24 38 30 C38 33 32 33 32 36"
        fill="none"
        stroke="#cc2230"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="46" r="4.2" fill="#f6f7fb" />
      <path
        d="M25 52 Q32 59 39 52"
        fill="none"
        stroke="#cc2230"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
