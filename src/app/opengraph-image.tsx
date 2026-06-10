import { ImageResponse } from "next/og";

export const alt = "PTRK Systems — Design Engineering Unit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadChakraPetch(): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(
        "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600",
      )
    ).text();
    const url = css.match(
      /src: url\((.+?)\) format\('(?:truetype|opentype)'\)/,
    )?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

function Corner({
  pos,
  color,
}: {
  pos: Record<string, number>;
  color: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: 56,
        height: 56,
        borderColor: color,
        borderStyle: "solid",
        borderWidth: 0,
        ...pos,
      }}
    />
  );
}

export default async function OgImage() {
  const chakra = await loadChakraPetch();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          backgroundColor: "#050508",
          fontFamily: chakra ? "Chakra Petch" : "sans-serif",
          position: "relative",
        }}
      >
        <Corner
          pos={{ top: 32, left: 32, borderTopWidth: 4, borderLeftWidth: 4 }}
          color="#c2fe0c"
        />
        <Corner
          pos={{ top: 32, right: 32, borderTopWidth: 4, borderRightWidth: 4 }}
          color="#01ffff"
        />
        <Corner
          pos={{
            bottom: 32,
            left: 32,
            borderBottomWidth: 4,
            borderLeftWidth: 4,
          }}
          color="#ea027e"
        />
        <Corner
          pos={{
            bottom: 32,
            right: 32,
            borderBottomWidth: 4,
            borderRightWidth: 4,
          }}
          color="#ff8c42"
        />
        <div
          style={{
            fontSize: 28,
            letterSpacing: 12,
            color: "#01ffff",
            marginBottom: 24,
          }}
        >
          ◢ DESIGN.ENGINEERING.UNIT ◣
        </div>
        <div style={{ display: "flex", fontSize: 160, lineHeight: 1 }}>
          <span style={{ color: "#f8fafc" }}>PTRK</span>
          <span style={{ color: "#c2fe0c" }}>.</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            color: "#c2fe0c",
            letterSpacing: 8,
          }}
        >
          SYSTEMS
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 80,
            fontSize: 22,
            letterSpacing: 6,
            color: "#94a3b8",
          }}
        >
          BUDAPEST · CET · 47.4979°N 19.0402°E
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 56,
            right: 80,
            fontSize: 22,
            letterSpacing: 6,
            color: "#c2fe0c",
          }}
        >
          SYS_ONLINE ■
        </div>
      </div>
    ),
    {
      ...size,
      fonts: chakra
        ? [{ name: "Chakra Petch", data: chakra, weight: 600 }]
        : undefined,
    },
  );
}
