# PTRK Systems — Sprint 4: Signature-réteg (Design Spec)

**Dátum:** 2026-06-11 · **Branch:** `feat/sprint4-signature` · **Jóváhagyva:** user ("mindegyik mehet kivéve a hetes")

## Scope — 6 signature feature (a #7 élő GitHub-feed KIMARAD, user-döntés)

| # | Feature | Lényeg |
|---|---|---|
| 1 | **BLUEPRINT MODE** (`B` / tray-chip, desktop) | Design-rendszer röntgen: `html[data-blueprint]` alatt CSS-vezérelt — section-outline + `attr(data-section/label)` címkék, 12-oszlopos grid-overlay, token-legend panel (színek/fontok/radius), canvas-rétegek 15%-ra tompítva. A "rendszer a felület mögött" demonstráció. |
| 2 | **OPERÁTOR TERMINÁL** (`~` / tray-chip) | Működő scripted terminál bottom-sheetben: `help, projects, open <id>, work/method/lab/connect/home, stack, status, whoami, sudo hire --budget <x>, boot, nodes, clear, escape`. Esc zár; input-mezőben gépeléskor a `~` nem nyit. Router-navigáció a parancsokból. |
| 3 | **ASCII-FIELD** (hero háttér) | Kurzor-reaktív ASCII-karaktermező canvas 2D-n a landing hero mögött (`-z-10`, a paint-order leckével). Ritkított rács, 24fps cap, DPR=1, visibility+IO pause, reduced-motion = 1 statikus frame, coarse-pointer = lassú hullám. |
| 4 | **NODES** (lore-vadászat) | 7 rejtett node: `nod-code` (ManifestoBand NOD·0A20070A katt), `konami`, `whoami` (terminál), `font-preview` (oldal felfedezése), `signal-lost` (404), `blueprint` (első bekapcsolás), `decode-replay` (/lab). localStorage `ptrk-nodes`; magenta "▓ NODE ACQUIRED · n/7" toast; Footer `NODES n/7` számláló (mount után renderel — hydration-safe). |
| 5 | **GYRO-LENCSE + MOBIL DOCK** | `src/lib/gyro.ts` singleton (active/x/y); MarathonBackground MINDKÉT Lissajous-ága gyroState-et preferál ha aktív; GYRO·chip coarse-pointeren (iOS requestPermission tap-ből, fallback Lissajous marad). + `MobileTerminalDock` (md:hidden): alsó TX·LIVE sáv gépelődő sorral a `terminal-pool` COMMAND_POOL-ból, tap → bottom-sheet log; safe-area padding; layout mobil `pb` kompenzáció. |
| 6 | **SND·ON** (hangréteg) | `src/lib/sfx.ts` — WebAudio oscillator, ZERO hangfájl: `tick()` (hover, ~6ms square), `blip()` (route-váltás sweep). AudioContext csak az első user-gesture-re. Tray-chip SND·OFF/ON, localStorage `ptrk-snd`, default OFF, reduced-motion esetén a chip sem jelenik meg. Hover-delegáció: `pointerover` + `closest('a,button')`, throttle. |

## Közös vázak

- **SystemTray** (desktop, fixed bottom-left, z-40): `TRM [~]` · `BLU [B]` · `SND OFF/ON` chipek — egy `HudSystem.tsx` client-parent kezeli a terminált, blueprintet, hangot és a billentyűket (kivéve ha input/textarea a target).
- Minden overlay/effekt: SSR null (mounted-gate), reduced-motion tisztelet, 0 új runtime dependency.
- Node-acquire integrációk szerver-komponensekben: pici client trigger-komponensek (`NodeTrigger`, `AcquireOnMount`).

## Utólagos user-döntések (2026-06-11)

- **SND hangréteg TELJESEN ELTÁVOLÍTVA** user-kérésre (sfx.ts törölve, SND chip ki) — ne kerüljön vissza.
- **Motion-policy megfordítva:** minden effekt alapból BE mindenkinek (OS reduced-motion jelzés NEM kapcsolja ki); a MOT tray-chip az explicit opt-out (`localStorage ptrk-motion="off"` → `html[data-motion-reduce]`).
- ASCII-mező desktopon nyugalomban láthatatlan (csak kurzor-proximitás), mobilon halvány hullám.
- Tartalom-konténerek BAL-igazítottak (`mx-auto` ki) — a user a bal-anchorolt layoutot kéri.

## Tudatos korlátok (review-ben megerősítve)

- **Mobil node-plafon:** a terminál desktop-eszköz (tray + billentyű), így mobilon max 5/7 node szerezhető (`whoami`, `konami` nem) — elfogadva; ha később 7/7 kell mobilon, a dock kaphat terminál-megnyitó gombot.
- **Konami ↔ B ütközés:** a Konami-szekvencia `b` betűje a blueprintet is kapcsolja — lore-szinten elfogadva ("a legacy protokoll mellékhatása").
- **Visszatérő SND·ON user:** az első kattintásig nem szól hang (autoplay-policy) — elfogadott degradáció.

## Verifikáció

`npm run build` + `npm run smoke` (8 route) + headless funkcionális próbák (terminál-parancs futtatás, blueprint-attr flip, node-acquire → localStorage, dock jelenlét mobil-viewporton) + vizuális screenshotok + code-review agent.
