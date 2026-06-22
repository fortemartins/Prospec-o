interface GfmLogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { width: 100, height: 32 },
  md: { width: 140, height: 44 },
  lg: { width: 200, height: 64 },
};

export function GfmLogo({ variant = 'light', className, size = 'md' }: GfmLogoProps) {
  const { width, height } = sizes[size];
  const gfmColor = variant === 'light' ? '#ffffff' : '#102a43';
  const yellowColor = '#f0a500';

  return (
    <svg
      viewBox="0 0 200 64"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="GFM eventos"
    >
      {/* Diagonal stripes */}
      <rect x="8" y="6" width="10" height="40" rx="2" transform="rotate(-15 8 6)" fill={yellowColor} />
      <rect x="24" y="6" width="10" height="40" rx="2" transform="rotate(-15 24 6)" fill={yellowColor} />
      <rect x="40" y="6" width="10" height="40" rx="2" transform="rotate(-15 40 6)" fill={yellowColor} />

      {/* GFM text */}
      <text
        x="68"
        y="40"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="42"
        fontWeight="900"
        fontStyle="italic"
        fill={gfmColor}
        letterSpacing="-1"
      >
        GFM
      </text>

      {/* eventos text */}
      <text
        x="120"
        y="58"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="16"
        fontWeight="500"
        fill={yellowColor}
      >
        eventos
      </text>
    </svg>
  );
}
