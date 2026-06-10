/**
 * THE OPERATOR — personal brand section data.
 *
 * The section on the landing page renders ONLY when `name` is filled in.
 * To activate it, provide REAL data (no placeholders ship to production):
 *   - name:  your name (or operator alias) — REQUIRED to render
 *   - role:  one line, e.g. "Design engineer · PTRK Systems"
 *   - bio:   2-4 short paragraphs (background, why the one-hand vertical
 *            model, what you do off-keyboard)
 *   - photo: path under /public, e.g. "/operator.jpg" — optional, the
 *            HUD frame renders a glyph placeholder without it
 *   - now:   current status line, e.g. "Most épül: …" — optional
 */
export const OPERATOR = {
  name: "",
  role: "",
  bio: [] as string[],
  photo: null as string | null,
  now: "",
};
