"use client";

import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";

const ERROR = "Das hat nicht geklappt. Bitte prüfen Sie die E-Mail-Adresse und versuchen Sie es erneut.";

export function NewsletterForm({ id = "nl", tone = "light" }: { id?: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok) {
        setState("ok");
        setMsg("Fast geschafft: Bitte bestätigen Sie Ihre Anmeldung über den Link in der E-Mail, die wir Ihnen gerade gesendet haben.");
      } else {
        setState("error");
        setMsg(json.message ?? ERROR);
      }
    } catch {
      setState("error");
      setMsg(ERROR);
    }
  }

  if (state === "ok")
    return (
      <p role="status" className={`max-w-md ${dark ? "text-white/80" : "text-ink-700"}`}>
        {msg}
      </p>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-md">
      <label htmlFor={`${id}-email`} className="sr-only">
        E-Mail-Adresse
      </label>
      <div className={`flex items-center border-b ${dark ? "border-white/30 focus-within:border-accent" : "border-ink-950/30 focus-within:border-brand-500"}`}>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="E-Mail-Adresse"
          className={`h-12 w-full bg-transparent text-[18px] outline-none ${dark ? "text-white placeholder:text-white/45" : "placeholder:text-ink-500/60"}`}
          aria-describedby={`${id}-note`}
        />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <button
          type="submit"
          aria-label="Newsletter abonnieren"
          disabled={state === "loading"}
          className={`inline-flex h-12 w-12 items-center justify-center bg-transparent ${dark ? "text-white hover:text-accent" : "text-ink-950 hover:text-brand-500"}`}
        >
          <ArrowRight size={20} aria-hidden />
        </button>
      </div>
      <p id={`${id}-note`} className={`mt-3 text-[13px] ${dark ? "text-white/55 [&_a]:text-white/80" : "text-ink-500"}`}>
        Kostenlos und jederzeit abbestellbar. Hinweise finden Sie in der <a href="/datenschutz">Datenschutzerklärung</a>.
      </p>
      {state === "error" && (
        <p role="alert" className="mt-2 text-[14px] text-danger">
          {msg}
        </p>
      )}
    </form>
  );
}
