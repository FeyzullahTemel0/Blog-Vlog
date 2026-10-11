import type { Metadata } from "next";
import { HakkimdaView } from "@/components/site/HakkimdaView";

export const metadata: Metadata = {
  title: "Hakkımda",
  description: "Yolculuğun hikâyesi, ilgi alanları ve iletişim.",
};

export default function HakkimdaPage() {
  return <HakkimdaView />;
}
