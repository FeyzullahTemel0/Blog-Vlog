import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import Link from "next/link";
import { CoverArt } from "@/components/ui/CoverArt";
import type { Category, Post } from "@/lib/types";
import { formatShortDate, readingMinutes } from "@/lib/utils";

export function PostCard({ post, category }: { post: Post; category?: Category }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-line hover-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <CoverArt
          src={post.cover || undefined}
          title={post.title}
          category={category}
          className="h-full w-full transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur">
          <span>{category?.emoji}</span>
          {category?.name}
        </span>
        <span className="absolute right-4 top-4 grid h-9 w-9 scale-75 place-items-center rounded-full bg-white text-ink opacity-0 shadow-lg transition duration-500 group-hover:scale-100 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-ink/50">
          <span>{formatShortDate(post.createdAt)}</span>
          <span className="flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" /> {readingMinutes(post.content)} dk
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {post.place.city}
          </span>
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight transition group-hover:text-teal">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/60">{post.excerpt}</p>
      </div>
    </Link>
  );
}
