"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { addSubscriber } from "@/lib/store";
import { btnPrimary } from "@/lib/ui";
import { isValidEmail } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

export function SubscribeForm() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }
    setBusy(true);
    // Demo gecikmesi: gerçek bir API çağrısının hissettirdiği kısa bekleme.
    setTimeout(() => {
      const err = addSubscriber(email);
      setBusy(false);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      setDone(true);
      toast("Takip listesine eklendin. Yeni rotalar gelen kutuna düşecek.", "success");
    }, 700);
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 rounded-3xl bg-white/10 p-6 ring-1 ring-white/15"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400 text-night">
            <Check className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold">Teşekkürler, aramıza hoş geldin!</p>
            <p className="text-sm text-white/60">Yeni yazılar yayınlandığında haberin olacak.</p>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full"
        >
          <div className="flex flex-col gap-3 rounded-full bg-white p-2 pl-6 shadow-2xl shadow-ink/10 ring-1 ring-line sm:flex-row sm:items-center">
            <label htmlFor="subscribe-email" className="sr-only">
              E-posta adresi
            </label>
            <input
              id="subscribe-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e-posta adresiniz"
              autoComplete="email"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-ink/35"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "subscribe-error" : undefined}
            />
            <button type="submit" disabled={busy} className={`${btnPrimary} justify-center disabled:opacity-70`}>
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Takip Et <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                id="subscribe-error"
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 pl-6 text-sm text-amber-200"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
