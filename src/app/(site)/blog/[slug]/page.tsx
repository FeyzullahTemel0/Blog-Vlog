import type { Metadata } from "next";
import { PostView } from "@/components/site/PostView";
import { SEED } from "@/data/seed";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return SEED.posts.filter((p) => p.status === "published").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = SEED.posts.find((p) => p.slug === slug);
  if (!post) return { title: "Yazı bulunamadı" };
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  return <PostView slug={slug} />;
}
