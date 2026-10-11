import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogView } from "@/components/site/BlogView";
import { GlobeLoader } from "@/components/ui/GlobeLoader";

export const metadata: Metadata = {
  title: "Yazılar",
  description: "Şehirler, yemekler, doğa rotaları ve yolda kalan küçük anılar.",
};

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[60vh] place-items-center">
          <GlobeLoader />
        </div>
      }
    >
      <BlogView />
    </Suspense>
  );
}
