"use client";

import { Icon, addCollection } from "@iconify/react";
import pixelIcons from "@iconify-json/streamline-pixel/icons.json";

// Register the whole Streamline "Pixel free" set (662 icons, CC BY 4.0) ONCE,
// offline (no runtime API dependency). The icons use currentColor, so they tint
// to any brand colour via CSS `color`. Attribution lives in the footer.
addCollection(pixelIcons as unknown as Parameters<typeof addCollection>[0]);

type Props = {
  /** streamline-pixel icon name WITHOUT the prefix, e.g. "computers-devices-electronics-chipset" */
  name: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean;
};

export function PixelIcon({ name, ...rest }: Props) {
  return <Icon icon={`streamline-pixel:${name}`} {...rest} />;
}
