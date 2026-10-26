"use client";

import { NotaApp } from "@/components/NotaApp";
import { useParams } from "next/navigation";

export default function NotePage() {
  const params = useParams<{ id: string }>();
  return <NotaApp start={{ name: "editor", id: String(params.id ?? "") }} />;
}
