"use client";

import { useMemo, useState } from "react";

interface ContactLabels {
  title: string;
  subtitle: string;
  name: string;
  email: string;
  message: string;
  send: string;
  whatsapp: string;
  or: string;
}

interface ContactFormProps {
  lang: "ar" | "en";
  labels: ContactLabels;
}

export function ContactForm({ lang, labels }: ContactFormProps) {
  const isAr = lang === "ar";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const [a, b] = useMemo(() => {
    const a = Math.floor(Math.random() * 5) + 3; // 3–7
    const b = Math.floor(Math.random() * 5) + 2; // 2–6
    return [a, b];
  }, []);
  const expected = a + b;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !message) {
      setError(
        isAr ? "يرجى ملء جميع الحقول." : "Please fill in all the fields."
      );
      return;
    }

    const human = parseInt(answer, 10);
    if (Number.isNaN(human)) {
      setError(
        isAr
          ? "يرجى حل مسألة التحقق البسيطة."
          : "Please solve the simple verification question."
      );
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, human, expected }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Request failed");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setAnswer("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError(
        isAr
          ? "حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى."
          : "Something went wrong while sending your message. Please try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-3xl border border-kahra_gold/40 bg-[#0b332f] p-5 shadow-soft-xl space-y-4"
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-kahra_cream/80">
            {labels.name}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-kahra_gold/40 bg-[#062421] px-3 py-2 text-sm text-kahra_cream outline-none focus:border-kahra_gold"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-kahra_cream/80">
            {labels.email}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-kahra_gold/40 bg-[#062421] px-3 py-2 text-sm text-kahra_cream outline-none focus:border-kahra_gold"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-kahra_cream/80">
          {labels.message}
        </label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-kahra_gold/40 bg-[#062421] px-3 py-2 text-sm text-kahra_cream outline-none focus:border-kahra_gold"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr] md:items-center">
        <div>
          <p className="text-[0.75rem] font-semibold text-kahra_cream/80">
            {isAr ? "للتحقق من أنك إنسان:" : "To verify you are human:"}
          </p>
          <p className="mt-1 text-[0.8rem] text-kahra_cream/70">
            {isAr
              ? `ما حاصل ${a} + ${b} ؟`
              : `What is ${a} + ${b}?`}
          </p>
        </div>
        <div>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full rounded-xl border border-kahra_gold/40 bg-[#062421] px-3 py-2 text-sm text-kahra_cream outline-none focus:border-kahra_gold"
          />
        </div>
      </div>

      {error && (
        <p className="text-[0.75rem] text-red-400">
          {error}
        </p>
      )}

      {status === "success" && (
        <p className="text-[0.75rem] text-emerald-300">
          {isAr
            ? "تم استلام رسالتك بنجاح. سنقوم بالرد عليك قريباً."
            : "Your message has been sent successfully. We will get back to you soon."}
        </p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-kahra_gold px-6 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-[#0d3b36] shadow-md shadow-kahra_gold/40 hover:bg-[#9c6223] disabled:opacity-70"
        >
          {status === "loading"
            ? isAr
              ? "جارٍ الإرسال..."
              : "Sending..."
            : labels.send}
        </button>

        <span className="text-[0.75rem] text-kahra_cream/70">
          {labels.or}
        </span>

        <a
          href="https://wa.me/96800000000"
          target="_blank"
          rel="noreferrer"
          className="text-[0.8rem] font-semibold text-kahra_gold hover:underline"
        >
          {labels.whatsapp}
        </a>
      </div>
    </form>
  );
}
