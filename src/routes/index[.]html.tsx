import { createFileRoute } from "@tanstack/react-router";

import { StandaloneAppFrame } from "../components/StandaloneAppFrame";

export const Route = createFileRoute("/index.html")({
  head: () => ({
    meta: [
      { title: "Cutting Dept — Gantt Planning System" },
      { name: "description", content: "Auto Spreader & Auto Cutter Scheduler with Supabase backend." },
    ],
  }),
  component: IndexHtml,
});

function IndexHtml() {
  return <StandaloneAppFrame />;
}