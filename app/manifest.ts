import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "نوتة",
    short_name: "نوتة",
    description: "ملاحظات صفراء ومصاريف وأزرار سريعة",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF4C8",
    theme_color: "#FFD54F",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
