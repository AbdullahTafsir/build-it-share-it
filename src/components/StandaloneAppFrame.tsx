import standaloneHtml from "../../index.html?raw";

export function StandaloneAppFrame() {
  return (
    <iframe
      title="Cutting Dept Gantt Planning System"
      srcDoc={standaloneHtml}
      className="block h-screen w-full border-0 bg-background"
    />
  );
}