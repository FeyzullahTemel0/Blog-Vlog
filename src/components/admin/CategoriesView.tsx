"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus, Save, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { GlobeLoader } from "@/components/ui/GlobeLoader";
import { useToast } from "@/components/ui/Toast";
import { deleteCategory, saveCategory, useSite } from "@/lib/store";
import type { Category } from "@/lib/types";
import { adminBtnDanger, adminBtnPrimary, adminCard, adminInput, adminLabel } from "@/lib/ui";
import { cn, slugify } from "@/lib/utils";

const EMOJI_CHOICES = [
  "🏙️", "🏔️", "🏖️", "🍜", "🍷", "☕", "🎭", "🎨", "📸", "🌿",
  "🌊", "🌲", "🏜️", "🏛️", "🚆", "⛵", "🚐", "🎒", "💸", "🌅", "🦩", "🌸",
];

const MAX_NAME = 24;

export function CategoriesView() {
  const { ready, categories, posts } = useSite();
  if (!ready) return <GlobeLoader label="Kategoriler yükleniyor" />;

  const countFor = (id: string) => posts.filter((p) => p.categoryId === id).length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Sınıflandırma</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">Kategoriler</h1>
          <p className="mt-2 text-sm text-slate-400">
            {categories.length} kategori · Yazılar bu başlıklara göre gruplanır.
          </p>
        </div>
      </header>

      <div className="grid gap-4">
        <AnimatePresence initial={false}>
          {categories.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35 }}
            >
              <CategoryRow category={category} count={countFor(category.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
        {categories.length === 0 && (
          <div className={cn(adminCard, "p-10 text-center text-sm text-slate-400")}>
            Henüz kategori yok. Aşağıdan ilk kategorini ekle.
          </div>
        )}
      </div>

      <NewCategoryForm existingIds={categories.map((c) => c.id)} />
    </div>
  );
}

function EmojiPicker({ value, onPick }: { value: string; onPick: (emoji: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-1 rounded-2xl bg-slate-900 p-2 shadow-2xl ring-1 ring-white/10">
      {EMOJI_CHOICES.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onPick(emoji)}
          className={cn(
            "grid h-9 w-9 place-items-center rounded-xl text-lg transition hover:scale-110 hover:bg-white/10",
            emoji === value && "bg-teal-400/20 ring-1 ring-teal-400/50"
          )}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

function EmojiButton({ emoji, color, onPick }: { emoji: string; color: string; onPick: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Emoji seç"
        aria-expanded={open}
        className="grid h-14 w-14 place-items-center rounded-2xl text-2xl transition hover:scale-105"
        style={{ backgroundColor: `${color}26`, boxShadow: `inset 0 0 0 1px ${color}66` }}
      >
        {emoji}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-20 mt-2"
          >
            <EmojiPicker
              value={emoji}
              onPick={(picked) => {
                onPick(picked);
                setOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryRow({ category, count }: { category: Category; count: number }) {
  const toast = useToast();
  const [name, setName] = useState(category.name);
  const [emoji, setEmoji] = useState(category.emoji);
  const [color, setColor] = useState(category.color);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const dirty = name !== category.name || emoji !== category.emoji || color !== category.color;

  function save() {
    const trimmed = name.trim();
    if (!trimmed) {
      toast("Kategori adı boş olamaz.", "error");
      return;
    }
    const error = saveCategory({ ...category, name: trimmed, emoji, color });
    if (error) {
      toast(error, "error");
      return;
    }
    setName(trimmed);
    toast(`${trimmed} kategorisi güncellendi.`, "success");
  }

  function requestDelete() {
    if (count > 0) {
      toast(`Bu kategoriye bağlı ${count} yazı var. Önce yazıların kategorisini değiştirin.`, "error");
      return;
    }
    setConfirmOpen(true);
  }

  function confirmDelete() {
    setConfirmOpen(false);
    const error = deleteCategory(category.id);
    toast(error ?? `${category.name} silindi.`, error ? "error" : "info");
  }

  return (
    <>
      <div className={cn(adminCard, "flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap")}>
        <EmojiButton emoji={emoji} color={color} onPick={setEmoji} />

        <div className="min-w-[180px] flex-1">
          <input
            value={name}
            maxLength={MAX_NAME}
            onChange={(e) => setName(e.target.value)}
            aria-label="Kategori adı"
            className={cn(adminInput, "font-semibold")}
          />
          <p className="mt-1.5 px-1 text-xs text-slate-500">
            <span className="font-mono">/{category.id}</span> · {count} yazı
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs text-slate-400">
          <span className="sr-only">Renk</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value.toUpperCase())}
            className="h-7 w-9 cursor-pointer rounded-lg border-0 bg-transparent p-0"
          />
          <span className="font-mono text-slate-300">{color}</span>
        </label>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {dirty && (
              <motion.button
                key="save"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="button"
                onClick={save}
                className={adminBtnPrimary}
              >
                <Save className="h-4 w-4" />
                Kaydet
              </motion.button>
            )}
          </AnimatePresence>
          <button type="button" onClick={requestDelete} aria-label="Kategoriyi sil" className={adminBtnDanger}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Kategori silinsin mi?"
        description={`${category.name} kategorisi kalıcı olarak silinecek.`}
        confirmLabel="Evet, sil"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

function NewCategoryForm({ existingIds }: { existingIds: string[] }) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🌍");
  const [color, setColor] = useState("#0F766E");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast("Kategori adı girin.", "error");
      return;
    }
    const id = slugify(trimmed);
    if (!id) {
      toast("Bu ad geçerli bir kategori kimliğine dönüşemedi.", "error");
      return;
    }
    if (existingIds.includes(id)) {
      toast("Bu isimde bir kategori zaten var.", "error");
      return;
    }
    const error = saveCategory({ id, name: trimmed, emoji, color });
    if (error) {
      toast(error, "error");
      return;
    }
    setName("");
    toast(`${trimmed} kategorisi eklendi.`, "success");
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={cn(adminCard, "space-y-5 p-6")}
    >
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Yeni kategori</h2>
        <p className="mt-1 text-xs text-slate-400">Adından otomatik bir bağlantı kimliği oluşturulur.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-[auto_1fr_auto_auto] md:items-end">
        <div>
          <span className={adminLabel}>Emoji</span>
          <EmojiButton emoji={emoji} color={color} onPick={setEmoji} />
        </div>
        <div>
          <label htmlFor="cat-name" className={adminLabel}>
            Kategori adı
          </label>
          <input
            id="cat-name"
            value={name}
            maxLength={MAX_NAME}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn. Sahil Kaçamakları"
            className={adminInput}
          />
        </div>
        <div>
          <label htmlFor="cat-color" className={adminLabel}>
            Renk
          </label>
          <input
            id="cat-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value.toUpperCase())}
            className="h-[46px] w-16 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-1"
          />
        </div>
        <button type="submit" className={adminBtnPrimary}>
          <Plus className="h-4 w-4" />
          Ekle
        </button>
      </div>
    </motion.form>
  );
}
