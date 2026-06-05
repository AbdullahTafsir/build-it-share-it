import standaloneHtml from "../../index.html?raw";
import { useEffect, useState } from "react";

export function StandaloneAppFrame() {
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    setSrcDoc(standaloneHtml);
  }, []);

  return (
    <iframe
      title="Cutting Dept Gantt Planning System"
      srcDoc={srcDoc}
      className="block h-screen w-full border-0 bg-background"
    />
  );
}