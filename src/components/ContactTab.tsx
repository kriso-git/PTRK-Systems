"use client";

import { useState } from "react";
import { Crosshair } from "./Crosshair";
import { DataStream } from "./DataStream";
import { Glyph } from "./Glyph";

const SLA = [
  { code: "01", label: "Válaszidő", value: "<24h", color: "lime" as const },
  { code: "02", label: "Elérhető", value: "Q3.26", color: "cyan" as const },
  { code: "03", label: "Sprint", value: "2–8w", color: "magenta" as const },
];

const CHANNELS = [
  {
    label: "EMAIL",
    value: "hello@ptrksystems.com",
    href: "mailto:hello@ptrksystems.com",
    color: "lime" as const,
    glyph: "lime-hex" as const,
    sub: "Általában 24 órán belül",
  },
  {
    label: "LINKEDIN",
    value: "/in/ptrksystems",
    href: "https://linkedin.com/in/ptrksystems",
    color: "cyan" as const,
    glyph: "hex-triangle" as const,
    sub: "Professzionális kontextusban",
  },
  {
    label: "BUDAPEST",
    value: "Budapest, HU",
    href: undefined,
    color: "magenta" as const,
    glyph: "diamond-arrow" as const,
    sub: "CET (UTC+1) · távmunka világszerte",
  },
];

const COLOR_CLASSES = {
  lime: { border: "border-lime/30", borderHover: "hover:border-lime", text: "text-lime", bg: "bg-lime", bgSoft: "bg-lime/10", shadow: "hover:shadow-lime/30" },
  cyan: { border: "border-cyan/30", borderHover: "hover:border-cyan", text: "text-cyan", bg: "bg-cyan", bgSoft: "bg-cyan/10", shadow: "hover:shadow-cyan/30" },
  magenta: { border: "border-magenta/30", borderHover: "hover:border-magenta", text: "text-magenta", bg: "bg-magenta", bgSoft: "bg-magenta/10", shadow: "hover:shadow-magenta/30" },
};

export function ContactTab() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`PTRK Systems — ${data.get("type") ?? "Új projekt"}`);
    const body = encodeURIComponent(
      `Név: ${data.get("name")}\nEmail: ${data.get("email")}\nProjekt típus: ${data.get("type")}\n\n${data.get("message")}`
    );
    window.location.href = `mailto:hello@ptrksystems.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <section className="min-h-screen px-6 md:px-10 py-24 md:py-32 bg-void relative overflow-hidden tab-enter">
      <DataStream />

      {/* Decorative corner markers */}
      <div className="absolute top-0 left-0 w-40 h-40 border-t-4 border-l-4 border-lime/15 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-40 h-40 border-b-4 border-r-4 border-magenta/15 pointer-events-none" />

      <div className="max-w-[1500px] mx-auto relative z-10">
        {/* Header */}
        <header className="mb-14 md:mb-20 relative max-w-4xl">
          <div className="absolute -left-2 md:-left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-lime via-cyan to-magenta" />
          <div className="pl-6 md:pl-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="font-monospec text-[11px] text-lime bg-lime/10 border border-lime/30 px-3 py-1.5 tracking-[0.25em]">
                ◢ LET&apos;S BUILD ◣
              </span>
              <span className="font-monospec text-[10px] text-cyan/60 tracking-[0.3em]">
                04 → CONNECT
              </span>
              <span className="ml-auto flex items-center gap-2 font-monospec text-[10px] text-secondary tracking-[0.3em]">
                <span className="w-2 h-2 bg-lime cursor-blink rounded-none" />
                ELÉRHETŐ
              </span>
            </div>
            <h2 className="font-khinterference text-[clamp(36px,6vw,84px)] leading-[1.05] mb-6 tracking-[0.02em] uppercase break-words">
              <span className="block text-primary">Beszéljünk a</span>
              <span className="block text-lime">Projektedről.</span>
            </h2>
            <p className="font-shorai text-lg md:text-2xl text-secondary leading-[1.45] max-w-2xl">
              Új ötlet vagy működő termék — bemutatkozó beszélgetésben megnézzük, hogy
              {" "}<span className="text-primary">beleférünk-e</span> a víziódba és a határidődbe.
            </p>
          </div>
        </header>

        {/* SLA strip */}
        <div className="grid grid-cols-3 gap-3 md:gap-5 mb-14">
          {SLA.map((s) => {
            const c = COLOR_CLASSES[s.color];
            return (
              <div
                key={s.code}
                className={`relative bg-surface border ${c.border} ${c.borderHover} ${c.shadow} p-5 md:p-7 hover:shadow-2xl transition-all`}
              >
                <Crosshair position="tl" color={s.color} />
                <div className="font-monospec text-[10px] text-secondary tracking-[0.3em] mb-3">
                  SLA.{s.code} · {s.label.toUpperCase()}
                </div>
                <div className={`font-sequel text-3xl md:text-5xl ${c.text} tracking-[-0.04em] leading-none`}>
                  {s.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main grid: channels left, form right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Channels */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="font-monospec text-[11px] text-secondary tracking-[0.3em] mb-1">
              ▓ COMMS.CHANNELS · LIVE
            </div>

            {CHANNELS.map((ch) => {
              const c = COLOR_CLASSES[ch.color];
              const inner = (
                <>
                  <Crosshair position="tr" color={ch.color} />
                  <div className="flex items-start gap-5">
                    <div
                      className={`shrink-0 w-14 h-14 flex items-center justify-center ${c.bgSoft} border ${c.border} ${c.text}`}
                    >
                      <Glyph name={ch.glyph} size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-monospec text-[10px] text-secondary tracking-[0.3em] mb-2">
                        {ch.label}
                      </div>
                      <div className={`font-sequel text-xl md:text-2xl ${c.text} tracking-tight truncate group-hover:text-primary transition-colors`}>
                        {ch.value}
                      </div>
                      <div className="font-shorai text-sm text-secondary mt-1.5 leading-snug">
                        {ch.sub}
                      </div>
                    </div>
                    {ch.href && (
                      <span className={`shrink-0 ${c.text} text-2xl font-monospec opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all`}>
                        →
                      </span>
                    )}
                  </div>
                </>
              );

              return ch.href ? (
                <a
                  key={ch.label}
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`group relative bg-surface border ${c.border} ${c.borderHover} ${c.shadow} p-6 md:p-7 hover:shadow-2xl transition-all`}
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={ch.label}
                  className={`group relative bg-surface border ${c.border} p-6 md:p-7`}
                >
                  {inner}
                </div>
              );
            })}

            {/* Quote / personality block */}
            <div className="mt-2 bg-gradient-to-br from-lime/10 via-cyan/5 to-magenta/10 border border-lime/20 p-6 md:p-7 relative">
              <Crosshair position="tl" color="lime" />
              <Crosshair position="br" color="magenta" />
              <div className="font-monospec text-[10px] text-cyan tracking-[0.3em] mb-3">
                ▓▓ HOST.PROTOCOL
              </div>
              <p className="font-shorai text-base md:text-lg text-primary leading-relaxed">
                Nem ügynökség vagyunk. Csapatként dolgozunk,{" "}
                <span className="text-lime">discovery → design → kód → deploy</span>{" "}
                — egy felelőssel, egy időtervvel.
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-surface border-t-4 border-lime p-7 md:p-10 relative"
          >
            <Crosshair position="tl" color="lime" />
            <Crosshair position="br" color="cyan" />

            <div className="flex items-baseline justify-between mb-7">
              <div className="font-monospec text-[11px] text-secondary uppercase tracking-[0.3em]">
                ▶ TX.PROTOCOL · QUICK MESSAGE
              </div>
              <div className="font-monospec text-[10px] text-cyan/50 tracking-widest">
                FRM.04
              </div>
            </div>

            {submitted ? (
              <div className="font-shorai text-lg text-lime border border-lime/30 bg-lime/5 p-7 leading-relaxed">
                ▓█ Email klienst nyitottunk. Küldd el a megnyíló ablakból — visszaigazolást
                küldünk 24 órán belül. Köszi!
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="NÉV" name="name" type="text" placeholder="Kovács Anna" required />
                  <Field label="EMAIL" name="email" type="email" placeholder="anna@cég.hu" required />
                </div>

                <div>
                  <label
                    className="block font-monospec text-[10px] md:text-xs text-secondary mb-2 tracking-[0.3em]"
                    htmlFor="type"
                  >
                    PROJEKT TÍPUS
                  </label>
                  <select
                    id="type"
                    name="type"
                    defaultValue="Weboldal design + dev"
                    className="w-full px-5 py-3.5 bg-black/40 border border-lime/20 text-primary font-shorai text-sm md:text-base focus:border-lime focus:outline-none transition-all"
                  >
                    <option>Weboldal design + dev</option>
                    <option>Design rendszer</option>
                    <option>SaaS dashboard</option>
                    <option>Frontend audit / refactor</option>
                    <option>Konzultáció</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block font-monospec text-[10px] md:text-xs text-secondary mb-2 tracking-[0.3em]"
                    htmlFor="message"
                  >
                    MIRŐL VAN SZÓ?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    placeholder="Pár mondatos brief. Cél, határidő, költségvetés ha tudod — minden segít."
                    className="w-full px-5 py-3.5 bg-black/40 border border-lime/20 text-primary font-shorai text-sm md:text-base focus:border-lime focus:outline-none transition-all resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full px-8 py-4 md:py-5 bg-lime text-black font-monospec font-bold text-xs md:text-sm tracking-[0.4em] hover:shadow-2xl hover:shadow-lime/50 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-surface relative overflow-hidden"
                >
                  <span className="relative z-10 inline-flex items-center gap-3">
                    KÜLDÉS <span className="opacity-70">→</span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>

                <p className="font-shorai text-xs text-secondary text-center pt-2">
                  Az adataidat csak a válaszadásra használjuk — semmilyen marketing lista, semmi spam.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        className="block font-monospec text-[10px] md:text-xs text-secondary mb-2 tracking-[0.3em]"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-5 py-3.5 bg-black/40 border border-lime/20 text-primary font-shorai text-sm md:text-base focus:border-lime focus:outline-none transition-all placeholder:text-secondary/50"
      />
    </div>
  );
}
