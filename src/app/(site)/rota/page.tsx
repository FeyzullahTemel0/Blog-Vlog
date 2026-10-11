import type { Metadata } from "next";
import { RotaView } from "@/components/site/RotaView";

export const metadata: Metadata = {
  title: "Rota",
  description: "Gezilen ülkeler, şehirler ve haritadaki duraklar.",
};

export default function RotaPage() {
  return <RotaView />;
}
