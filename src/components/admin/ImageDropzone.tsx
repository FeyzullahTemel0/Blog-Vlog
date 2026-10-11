"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { Img } from "@/components/ui/Img";
import { useToast } from "@/components/ui/Toast";
import { fileToDataUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

export function ImageDropzone({
  label,
  images,
  onChange,
  multiple = false,
  hint,
}: {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  hint?: string;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const files = multiple ? Array.from(list) : [list[0]];
    setLoading(true);
    try {
      const converted: string[] = [];
      for (const file of files) {
        converted.push(await fileToDataUrl(file));
      }
      onChange(multiple ? [...images, ...converted] : converted.slice(0, 1));
      toast(`${converted.length} görsel eklendi.`, "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Görsel eklenemedi.", "error");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  const empty = images.length === 0;

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 border-dashed transition duration-300",
          dragging ? "border-teal-400 bg-teal-400/10 scale-[1.01]" : "border-white/10 bg-white/[0.02]",
        )}
      >
        {empty ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center"
          >
            <span
              className={cn(
                "grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-400/20 to-amber-400/10 text-teal-300 ring-1 ring-white/10 transition",
                dragging && "scale-110",
              )}
            >
              <UploadCloud className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium text-slate-200">
              Görseli sürükleyip bırakın veya <span className="text-teal-300 underline underline-offset-4">seçin</span>
            </span>
            <span className="text-xs text-slate-500">{hint ?? "JPG, PNG veya WEBP"}</span>
          </button>
        ) : (
          <div className={cn("grid gap-3 p-3", multiple ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1")}>
            <AnimatePresence initial={false}>
              {images.map((src, index) => (
                <motion.div
                  key={`${index}-${src.length}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.3 }}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/10"
                >
                  <Img src={src} alt={`${label} ${index + 1}`} className="transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-slate-950/70 text-rose-300 opacity-0 backdrop-blur transition hover:bg-rose-500/20 group-hover:opacity-100"
                    aria-label="Görseli kaldır"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {(multiple || empty) && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 text-slate-400 transition hover:border-teal-400/50 hover:text-teal-300"
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs">Ekle</span>
              </button>
            )}
          </div>
        )}

        {!empty && !multiple && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full border-t border-white/10 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Görseli değiştir
          </button>
        )}

        {loading && (
          <div className="absolute inset-0 grid place-items-center bg-slate-950/60 backdrop-blur-sm">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-teal-300/30 border-t-teal-300" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
    </div>
  );
}
