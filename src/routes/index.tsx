import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cutting Dept — Gantt Planning System" },
      { name: "description", content: "Auto Spreader & Auto Cutter Scheduler with Supabase backend." },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => { window.location.replace("/index.html"); }, []);
  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
      <p>Loading Cutting Dept app… <a href="/index.html">open directly</a></p>
    </div>
  );
}
