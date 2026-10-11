"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, KeyRound, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { DEMO_EMAIL, DEMO_PASSWORD, signIn, useAuth } from "@/lib/auth";
import { ease } from "@/lib/motion";
import { adminInput, adminLabel } from "@/lib/ui";
import { GlobeLoader } from "@/components/ui/GlobeLoader";

export function LoginView() {
  const router = useRouter();
  const auth = useAuth();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);

  useEffect(() => {
    if (auth === "in") router.replace("/admin");
  }, [auth, router]);

  if (auth !== "out") return <GlobeLoader fullscreen />;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    window.setTimeout(() => {
      if (signIn(password)) {
        router.replace("/admin");
      } else {
        setBusy(false);
        setError("Şifre hatalı. Demo şifresini kullanmayı deneyin.");
        setShake((n) => n + 1);
      }
    }, 700);
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-5 py-12 text-slate-100">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute -left-32 top-10 h-[30rem] w-[30rem] rounded-full bg-teal-500/20 blur-3xl animate-blob" />
        <span className="absolute -right-24 bottom-0 h-[26rem] w-[26rem] rounded-full bg-amber-500/15 blur-3xl animate-blob [animation-delay:-7s]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo light />
          <h1 className="mt-6 font-display text-3xl font-semibold text-white">Hoş geldin, gezgin</h1>
          <p className="mt-2 text-sm text-slate-400">Yönetim paneline giriş yap ve yeni rotalarını paylaş.</p>
        </div>

        <motion.form
          key={shake}
          onSubmit={submit}
          animate={shake ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[2rem] bg-white/[0.05] p-8 ring-1 ring-white/10 shadow-2xl shadow-black/40 backdrop-blur-2xl"
        >
          <div className="mb-5">
            <label htmlFor="email" className={adminLabel}>E-posta</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                value={DEMO_EMAIL}
                disabled
                className={`${adminInput} pl-11 opacity-70`}
              />
            </div>
          </div>

          <div className="mb-2">
            <label htmlFor="password" className={adminLabel}>Şifre</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="password"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                autoFocus
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={!!error}
                className={`${adminInput} pl-11 pr-12 ${error ? "ring-rose-400/60 focus:ring-rose-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
                aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 overflow-hidden text-sm text-rose-300"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={busy || !password}
            className="group relative mt-7 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 px-6 py-3.5 font-semibold text-slate-950 shadow-lg shadow-teal-500/25 transition hover:shadow-teal-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Giriş yapılıyor
              </>
            ) : (
              <>
                Giriş yap <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </>
            )}
          </button>
        </motion.form>

        <button
          type="button"
          onClick={() => {
            setPassword(DEMO_PASSWORD);
            setError("");
          }}
          className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          Demo şifresini doldur
          <KeyRound className="h-3.5 w-3.5 text-slate-500" />
        </button>
      </motion.div>
    </div>
  );
}
