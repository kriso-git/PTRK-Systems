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
