import { NextResponse } from "next/server";
import { Resend } from "resend";

// Where the leads land + the verified sending identity. The from-domain
// (ptrksystems.hu) must be verified in Resend; Reply-To is set to the visitor
// so a reply goes straight back to them.
const TO = "petrikkristof89@gmail.com";
const FROM = "PTRK-Systems <hello@ptrksystems.hu>";

function clean(s: unknown, max = 5000) {
  return String(s ?? "").trim().slice(0, max);
}

/** HTML-escape user input before it goes into the email body. */
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Bulletproof lead-notification email: a LIGHT body (renders consistently in
 *  every client incl. mobile Gmail, which mangles dark emails) with a DARK brand
 *  header where the lime accent pops. Table layout + inline styles + bgcolor
 *  attributes + explicit color-scheme so clients don't auto-recolor it. */
function leadHtml(name: string, email: string, type: string, message: string) {
  const row = (label: string, valueHtml: string) => `
    <tr><td style="padding:12px 0;border-bottom:1px solid #ececf1;">
      <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.5px;color:#8a90a0;text-transform:uppercase;margin-bottom:4px;">${label}</div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#15171c;">${valueHtml}</div>
    </td></tr>`;
  return `<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background:#eceef2;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#eceef2" style="background:#eceef2;padding:30px 14px;"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e2e5ea;border-radius:12px;overflow:hidden;">
      <tr><td bgcolor="#0a0c12" style="background:#0a0c12;border-top:3px solid #c2fe0c;padding:24px 30px 22px;">
        <table role="presentation" width="100%"><tr>
          <td style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;color:#c2fe0c;text-transform:uppercase;">// Kapcsolati űrlap</td>
          <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;letter-spacing:.5px;"><span style="color:#c2fe0c;">PTRK</span>-SYSTEMS</td>
        </tr></table>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:25px;font-weight:bold;color:#ffffff;margin-top:14px;letter-spacing:-.3px;">Új megkeresés</div>
      </td></tr>
      <tr><td bgcolor="#ffffff" style="background:#ffffff;padding:20px 30px 6px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("Név", esc(name))}
          ${row("Email", `<a href="mailto:${esc(email)}" style="color:#0b7285;text-decoration:none;font-weight:bold;">${esc(email)}</a>`)}
          ${row("Projekt típus", esc(type) || "&ndash;")}
        </table>
      </td></tr>
      <tr><td bgcolor="#ffffff" style="background:#ffffff;padding:12px 30px 20px;">
        <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.5px;color:#8a90a0;text-transform:uppercase;margin-bottom:9px;">Üzenet</div>
        <div style="background:#f3f5f8;border-left:3px solid #0a0c12;border-radius:5px;padding:16px 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.62;color:#33363d;white-space:pre-wrap;">${esc(message)}</div>
      </td></tr>
      <tr><td bgcolor="#ffffff" style="background:#ffffff;padding:2px 30px 28px;">
        <a href="mailto:${esc(email)}" style="display:inline-block;background:#0a0c12;color:#c2fe0c;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:13px 26px;border-radius:6px;letter-spacing:.3px;">Válasz &rarr;</a>
      </td></tr>
      <tr><td bgcolor="#f7f8fa" style="background:#f7f8fa;padding:16px 30px;border-top:1px solid #e8eaef;font-family:'Courier New',monospace;font-size:11px;color:#9097a3;letter-spacing:.5px;">
        Beérkezett a <a href="https://ptrksystems.hu" style="color:#6b7280;text-decoration:none;">ptrksystems.hu</a> kapcsolati űrlapról
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "Az e-mail szolgáltatás épp nem elérhető." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const name = clean(body.name, 200);
    const email = clean(body.email, 200);
    const type = clean(body.type, 200);
    const message = clean(body.message, 8000);

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Hiányzó mező." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Érvénytelen e-mail cím." }, { status: 400 });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `PTRK · új megkeresés – ${type || "Új projekt"}`,
      html: leadHtml(name, email, type, message),
      text:
        `Új megkeresés a ptrksystems.hu kapcsolati űrlapról.\n\n` +
        `Név: ${name}\nEmail: ${email}\nProjekt típus: ${type || "-"}\n\n` +
        `Üzenet:\n${message}`,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json({ error: "A küldés nem sikerült." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contact route error:", e);
    return NextResponse.json({ error: "Szerverhiba." }, { status: 500 });
  }
}
