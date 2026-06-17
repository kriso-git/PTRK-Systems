"use client";

import { useState } from "react";
import Link from "next/link";
import { GoliathOrnament } from "@/components/GoliathSymbols";
import { DecodeText } from "@/components/DecodeText";
import { PixelIcon } from "@/components/PixelIcon";
import { ENGAGEMENT } from "@/data/projects";

const SLA = [
  { code: "01", label: "Válaszidő", value: ENGAGEMENT.responseTime, color: "lime" as const, icon: "interface-essential-clock" },
  { code: "02", label: "Elérhető", value: ENGAGEMENT.nextSlotCompact, color: "cyan" as const, icon: "interface-essential-calendar-appointment" },
  { code: "03", label: "Sprint", value: ENGAGEMENT.sprintRange, color: "magenta" as const, icon: "interface-essential-cog-double" },
];

const CHANNELS = [
  {
    label: "Email",
    value: "hello@ptrksystems.com",
    href: "mailto:hello@ptrksystems.com",
    color: "lime" as const,
    icon: "email-envelope",
    sub: "Általában 24 órán belül érkezik válasz.",
  },
  {
    label: "Phone",
    value: "+36 70 000 0000",
    href: "tel:+36700000000",
    color: "cyan" as const,
    icon: "mobile-phone",
    sub: "Munkaidőben hívható, CET — vagy ütemezz callt mailben.",
  },
  {
    label: "Discord",
    value: "ptrksystems",
    href: "https://discord.gg/ptrksystems",
    color: "magenta" as const,
    icon: "logo-discord",
    sub: "Aszinkron beszélgetés, képek, gyors visszajelzés.",
  },
  {
    label: "Slack",
    value: "ptrksystems.slack.com",
    href: "https://ptrksystems.slack.com",
    color: "orange" as const,
    icon: "interface-essential-message",
    sub: "Ügyfél-csatorna közös munkához — meghívóra.",
  },
  {
    label: "Budapest",
    value: "Budapest, HU",
    href: undefined,
    color: "lime" as const,
    icon: "map-navigation-pin-location-1",
    sub: "CET (UTC+1) — távmunka világszerte.",
  },
];

const COLOR_TEXT = {
  lime: "text-lime",
  cyan: "text-cyan",
  magenta: "text-magenta",
  orange: "text-orange",
} as const;

export function ConnectForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(
      `PTRK Systems — ${data.get("type") ?? "Új projekt"}`,
    );
    const body = encodeURIComponent(
      `Név: ${data.get("name")}\nEmail: ${data.get("email")}\nProjekt típus: ${data.get(
        "type",
      )}\n\n${data.get("message")}`,
    );
    window.location.href = `mailto:hello@ptrksystems.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <>
      {/* ─────────────────────────────  HERO  ───────────────────────────── */}
      <section className="relative z-10 px-6 md:px-10 pt-24 md:pt-40 pb-24 md:pb-32 overflow-hidden">
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-10 md:gap-x-10">
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 md:pt-4">
            <div className="font-monospec text-[10px] tracking-[0.4em] uppercase text-orange mb-6 flex items-center gap-3">
              <PixelIcon name="interface-essential-satellite" width={15} height={15} aria-hidden />
              <span>Connect</span>
            </div>
            <div className="font-monospec text-[10px] tracking-[0.3em] uppercase text-secondary leading-relaxed">
              Status
              <br />
              <span className="flex items-center gap-2 text-lime mt-1">
                <span className="w-1.5 h-1.5 bg-lime cursor-blink" />
                Available
              </span>
              <span className="block mt-3 text-cyan/70">— {ENGAGEMENT.nextSlot}</span>
            </div>
          </aside>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary mb-4">
              <span className="text-orange">Open dispatch</span> · talk before you brief
            </div>
            <h1 className="font-khinterference uppercase leading-[0.86] tracking-[-0.005em] text-primary text-[clamp(40px,11vw,184px)] relative">
              <GoliathOrnament
                seed="HELLO"
                count={5}
                size="clamp(72px, 13vw, 240px)"
                className="absolute -top-8 right-0 text-lime/[0.04] pointer-events-none"
              />
              <span className="relative">Beszéljünk a</span>
              <br />
              <span className="text-orange relative">
                <DecodeText text="projektedről." />
              </span>
            </h1>
            <p className="mt-10 font-shorai text-xl md:text-2xl text-secondary leading-[1.4] max-w-[58ch] tracking-[-0.005em]">
              Új ötlet vagy működő termék — egy 30 perces bemutatkozó beszélgetésben
              megnézzük, hogy <span className="text-primary">beleférünk-e</span> a
              víziódba és a határidődbe.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  SLA  ───────────────────────────── */}
      <section className="relative z-10 border-y border-white/10 bg-void/30">
        <div className="max-w-[1500px] px-6 md:px-10 py-8 md:py-10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {SLA.map((s) => (
            <div
              key={s.code}
              className="px-0 sm:px-3 md:px-8 py-5 sm:py-2 flex flex-col gap-2 sm:gap-3"
            >
              <span className="flex items-center gap-2 font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary/60">
                <PixelIcon name={s.icon} width={13} height={13} className={COLOR_TEXT[s.color]} aria-hidden />
                SLA · {s.code} · {s.label}
              </span>
              <span
                className={`font-sequel text-[clamp(40px,9vw,108px)] leading-[0.85] tracking-[-0.04em] ${COLOR_TEXT[s.color]}`}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────  CHANNELS + FORM  ───────────────────────────── */}
      <section className="relative z-10 px-6 md:px-10 py-32 md:py-48">
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-16 md:gap-x-12">
          <aside className="col-span-12 md:col-span-5">
            <div className="font-monospec text-[10px] uppercase tracking-[0.4em] text-cyan mb-6 flex items-center gap-3">
              <PixelIcon name="interface-essential-wifi-signal" width={15} height={15} aria-hidden />
              <span>Channels · live</span>
            </div>
            <h2 className="font-khinterference uppercase tracking-[0.005em] text-5xl md:text-6xl leading-[0.92] text-primary mb-12">
              Hol találsz
              <br />
              <span className="text-cyan">meg.</span>
            </h2>

            <ul>
              {CHANNELS.map((ch, i) => {
                const tx = COLOR_TEXT[ch.color];
                const isLast = i === CHANNELS.length - 1;
                const Inner = (
                  <div className="grid grid-cols-12 gap-4 py-7 md:py-9 items-baseline group">
                    <div className="col-span-12 md:col-span-3 font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary flex items-center gap-2.5">
                      <PixelIcon name={ch.icon} width={15} height={15} className={tx} aria-hidden />
                      {ch.label}
                    </div>
                    <div className="col-span-12 md:col-span-9 min-w-0">
                      <div
                        className={`font-sequel text-xl md:text-2xl ${tx} tracking-[-0.01em] leading-tight break-all flex items-baseline gap-3 flex-wrap ${
                          ch.href ? "group-hover:translate-x-1 transition-transform" : ""
                        }`}
                      >
                        <span className="break-all">{ch.value}</span>
                        {ch.href && <span className="opacity-60 shrink-0">→</span>}
                      </div>
                      <div className="mt-2 font-shorai text-sm text-secondary leading-relaxed">
                        {ch.sub}
                      </div>
                    </div>
                  </div>
                );

                return (
                  <li
                    key={ch.label}
                    className={`border-t border-white/15 ${isLast ? "border-b" : ""}`}
                  >
                    {ch.href ? (
                      <a
                        href={ch.href}
                        target={ch.href.startsWith("http") ? "_blank" : undefined}
                        rel={ch.href.startsWith("http") ? "noreferrer" : undefined}
                        className="block"
                      >
                        {Inner}
                      </a>
                    ) : (
                      Inner
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-12 border-l-4 border-lime pl-6 py-2">
              <div className="font-monospec text-[10px] uppercase tracking-[0.3em] text-cyan mb-3">
                Host · Protocol
              </div>
              <p className="font-shorai text-base md:text-lg text-primary leading-relaxed max-w-md">
                Nem ügynökség. Stúdió, közös kontextus, egy időterv.{" "}
                <span className="text-lime">Discovery → design → kód → deploy.</span>
              </p>
            </div>
          </aside>

          <div className="col-span-12 md:col-span-7">
            <div className="font-monospec text-[10px] uppercase tracking-[0.4em] text-magenta mb-6 flex items-center gap-3">
              <PixelIcon name="interface-essential-send-mail" width={15} height={15} aria-hidden />
              <span>TX · Quick message</span>
            </div>
            <h2 className="font-khinterference uppercase tracking-[0.005em] text-5xl md:text-6xl leading-[0.92] text-primary mb-4">
              <span className="text-magenta">Írj emailt.</span>
            </h2>
            <p className="font-shorai text-base md:text-lg text-secondary leading-relaxed max-w-[52ch] mb-12">
              Itt részletes briefet is írhatsz — projekt cél, határidő,
              költségvetés, eddigi munkák. Minden segít a gyors,{" "}
              <span className="text-primary">személyre szabott válaszadásban</span>.
            </p>

            {submitted ? (
              <div className="border-l-4 border-lime pl-6 py-6 font-shorai text-lg text-lime leading-relaxed max-w-2xl">
                Email kliens megnyitva. Küldd el a megjelenő ablakból — visszaigazolást
                küldünk 24 órán belül. Köszi!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                  <Field label="Név" name="name" type="text" placeholder="Kovács Anna" required />
                  <Field label="Email" name="email" type="email" placeholder="anna@ceg.hu" required />
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block font-monospec text-[10px] uppercase tracking-[0.4em] text-secondary mb-3"
                  >
                    Projekt típus
                  </label>
                  <select
                    id="type"
                    name="type"
                    defaultValue="Weboldal design + dev"
                    className="w-full bg-transparent border-b-2 border-white/20 focus:border-lime outline-none py-3 font-khinterference text-2xl md:text-3xl uppercase tracking-[0.01em] text-primary cursor-pointer transition-colors"
                  >
                    <option className="bg-void">Weboldal design + dev</option>
                    <option className="bg-void">Design rendszer</option>
                    <option className="bg-void">SaaS dashboard</option>
                    <option className="bg-void">Frontend audit / refactor</option>
                    <option className="bg-void">Konzultáció</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block font-monospec text-[10px] uppercase tracking-[0.4em] text-secondary mb-3"
                  >
                    Miről van szó?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    placeholder="Pár mondatos brief. Cél, határidő, költségvetés ha tudod — minden segít."
                    className="w-full bg-transparent border-b-2 border-white/20 focus:border-lime outline-none py-3 font-shorai text-lg md:text-xl text-primary placeholder:text-secondary/40 resize-none leading-relaxed transition-colors"
                  />
                </div>

                <div className="pt-6 flex flex-wrap items-center justify-between gap-6">
                  <button
                    type="submit"
                    className="group inline-flex items-baseline gap-4 font-khinterference uppercase tracking-[0.02em] text-3xl md:text-4xl text-primary border-b-2 border-lime pb-1 hover:text-lime transition-colors"
                  >
                    <span className="text-lime">→</span>
                    Küldés
                  </button>
                  <p className="font-shorai text-xs text-secondary max-w-xs">
                    Az adataidat csak a válaszadásra használjuk — semmilyen marketing,
                    semmi spam.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-[1500px] flex flex-wrap items-baseline justify-between gap-6 font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary">
          <Link href="/" className="hover:text-lime transition-colors">
            ← Index
          </Link>
          <span className="text-secondary/60">PTRK Systems · 2026 · Budapest</span>
          <Link href="/work" className="hover:text-lime transition-colors">
            Work →
          </Link>
        </div>
      </section>
    </>
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
        htmlFor={name}
        className="block font-monospec text-[10px] uppercase tracking-[0.4em] text-secondary mb-3"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border-b-2 border-white/20 focus:border-lime outline-none py-3 font-khinterference text-2xl md:text-3xl uppercase tracking-[0.01em] text-primary placeholder:text-secondary/30 transition-colors"
      />
    </div>
  );
}
