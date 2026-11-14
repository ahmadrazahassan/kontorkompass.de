// Official LinkedIn brand mark: white "in" on the LinkedIn blue (#0A66C2).
// Drawn as an SVG with its own corner radius, so it stays clear of scripts/lint-shapes.mjs.
export function LinkedInLogo({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label="LinkedIn"
      focusable="false"
    >
      <rect width="24" height="24" rx="4.5" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3.2 9.3h3.56V21H3.2V9.3zm5.78 0h3.41v1.6h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45V21h-3.56v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75V21H8.98V9.3z"
      />
    </svg>
  );
}
