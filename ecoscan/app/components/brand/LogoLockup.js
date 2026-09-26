import Image from "next/image"

/**
 * LogoLockup — the EcoScan brand mark.
 *
 * Responsibility
 *   Renders the official EcoScan symbol and wordmark.
 *
 * Props
 *   @param {"horizontal"|"symbol"|"footer"} [variant="horizontal"]
 *          Layout: full lockup, glyph only, or footer lockup.
 *   @param {"light"|"dark"} [theme="dark"]
 *          Controls the wordmark color for light or dark backgrounds.
 *   @param {string} [className] Extra classes for the root element.
 *
 * Behavior
 *   Purely presentational; the supplied brand image remains unchanged.
 *
 * Dependencies
 *   Next.js Image component.
 */

/**
 * Symbol — the standalone node/trajectory glyph.
 * @param {{ size: number, title?: string }} props
 */
function Symbol({ size, title }) {
  return (
    <span
      role="img"
      aria-label={title || "EcoScan"}
      style={{ display: "inline-flex", flex: "0 0 auto" }}
    >
      <Image
        src="/images/brand/ecoscan-mark.png"
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    </span>
  )
}

export default function LogoLockup({
  variant = "horizontal",
  theme = "dark",
  className = "",
}) {
  if (variant === "symbol") {
    return (
      <span className={className} style={{ display: "inline-flex" }}>
        <Symbol size={40} title="EcoScan" />
      </span>
    )
  }

  const isFooter = variant === "footer"

  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: isFooter ? 9 : 7 }}
    >
      <Symbol size={isFooter ? 29 : 23} title="EcoScan logo" />
      <Image
        src="/images/brand/ecoscan-wordmark.png"
        alt=""
        width={isFooter ? 108 : 84}
        height={isFooter ? 20 : 16}
        style={{
          width: isFooter ? 108 : 84,
          height: isFooter ? 20 : 16,
          objectFit: "contain",
          filter: theme === "light" ? "brightness(0) invert(1)" : "none",
        }}
      />
    </span>
  )
}
