/**
 * Gyro lens state – a module singleton read by MarathonBackground's two
 * coarse-pointer loops (glow vars + WarpMesh lens). When active, device
 * tilt replaces the Lissajous auto-pan. Values are normalized 0..1.
 */

export const gyroState = { active: false, x: 0.5, y: 0.5 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function onOrientation(e: DeviceOrientationEvent) {
  if (e.gamma === null || e.beta === null) return;
  // gamma: left/right tilt (-30°..30° mapped), beta: front/back (15°..75°)
  gyroState.x = clamp01((e.gamma + 30) / 60);
  gyroState.y = clamp01((e.beta - 15) / 60);
}

export function gyroSupported() {
  return typeof window !== "undefined" && "DeviceOrientationEvent" in window;
}

/** Must be called from a user gesture (iOS permission). */
export async function enableGyro(): Promise<boolean> {
  if (!gyroSupported()) return false;
  try {
    const D = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    if (typeof D.requestPermission === "function") {
      const res = await D.requestPermission();
      if (res !== "granted") return false;
    }
    window.addEventListener("deviceorientation", onOrientation, {
      passive: true,
    });
    gyroState.active = true;
    return true;
  } catch {
    return false;
  }
}

export function disableGyro() {
  window.removeEventListener("deviceorientation", onOrientation);
  gyroState.active = false;
}
