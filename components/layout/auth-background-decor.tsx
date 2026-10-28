/**
 * Decorative ellipse rings from Figma auth background (Signup / 1440×900).
 *
 * Arcs are shifted so the visible curves pass behind the cream form frame
 * (not through the center gap between logo and form). Scaled down on
 * mobile/tablet so the rings don’t dominate the stacked layout.
 */
export function AuthBackgroundDecor() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Scale wrapper — keeps Figma matrix transform intact on the inner node */}
      <div className="absolute left-[-420px] top-[-418px] origin-top-left scale-[0.45] opacity-20 sm:scale-[0.65] sm:opacity-25 lg:scale-100 lg:opacity-30">
        <div
          className="relative"
          style={{
            width: "1613px",
            height: "1837px",
            transform: "matrix(-0.97, 0.26, 0.26, 0.97, 0, 0)",
          }}
        >
          <div
            className="absolute rounded-full border border-white opacity-80"
            style={{
              width: "1585px",
              height: "1585px",
              left: "92px",
              top: "244px",
            }}
          />
          <div
            className="absolute rounded-full border border-white opacity-80"
            style={{
              width: "1585px",
              height: "1585px",
              left: "0",
              top: "7px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
