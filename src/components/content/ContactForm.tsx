"use client";

import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";

const ERROR = "Das hat nicht geklappt. Bitte versuchen Sie es später erneut.";
const FIELD =
  "mt-1.5 block w-full border border-ink-950/20 bg-white px-3.5 text-[16px] text-ink-950 outline-none transition-colors placeholder:text-ink-500/60 focus:border-brand-500";
const LABEL = "block text-[14.5px] font-medium text-ink-950";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setState("loading");
    try {
      const res = await fetch("/api/kontakt", { method: "POST", body: new FormData(form) });
      const json = await res.json();
      if (res.ok) {
        setState("ok");
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
      <p role="status" className="border-l-2 border-brand-500 bg-ink-950/[0.03] px-5 py-4 text-ink-950" style={{ borderRadius: 6 }}>
        Vielen Dank, Ihre Nachricht ist angekommen. Wir antworten in der Regel innerhalb weniger Werktage.
      </p>
    );

  return (
    <form onSubmit={onSubmit} className="not-prose grid max-w-xl grid-cols-1 gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="k-name" className={LABEL}>
            Name <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <input id="k-name" name="name" type="text" autoComplete="name" maxLength={120} className={`${FIELD} h-12`} style={{ borderRadius: 6 }} />
        </div>
        <div>
          <label htmlFor="k-email" className={LABEL}>
            E-Mail-Adresse
          </label>
          <input id="k-email" name="email" type="email" required autoComplete="email" maxLength={200} className={`${FIELD} h-12`} style={{ borderRadius: 6 }} />
        </div>
      </div>
      <div>
        <label htmlFor="k-subject" className={LABEL}>
          Betreff <span className="font-normal text-ink-500">(optional)</span>
        </label>
        <input
          id="k-subject"
          name="subject"
          type="text"
          maxLength={150}
          placeholder="z. B. Korrekturhinweis zu einem Ratgeber"
          className={`${FIELD} h-12`}
          style={{ borderRadius: 6 }}
        />
      </div>
      <div>
        <label htmlFor="k-message" className={LABEL}>
          Ihre Nachricht
        </label>
        <textarea id="k-message" name="message" required minLength={10} maxLength={5000} rows={7} className={`${FIELD} py-3 leading-relaxed`} style={{ borderRadius: 6 }} />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex items-start gap-3 text-[14.5px] text-ink-700">
        <input type="checkbox" name="privacy" required className="mt-1 h-4 w-4 shrink-0 accent-[#006BFF]" />
        <span>
          Ich habe die <a href="/datenschutz">Datenschutzerklärung</a> gelesen. Meine Angaben werden nur verwendet, um meine Anfrage zu beantworten.
        </span>
      </label>
      {state === "error" && (
        <p role="alert" className="text-[14.5px] text-danger">
          {msg}
        </p>
      )}
      <div>
        <button type="submit" disabled={state === "loading"} className="btn btn-primary btn-md disabled:cursor-not-allowed disabled:opacity-60">
          <span className="btn-label" data-text={state === "loading" ? "Wird gesendet …" : "Nachricht senden"}>
            <span>{state === "loading" ? "Wird gesendet …" : "Nachricht senden"}</span>
          </span>
          <ArrowRight aria-hidden className="btn-arrow" weight="regular" />
        </button>
      </div>
    </form>
  );
}
