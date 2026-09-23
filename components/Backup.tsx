"use client";

import { useRef, useState } from "react";
import { exportProgress, importProgress, resetEverything } from "@/lib/progress";

export default function Backup() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  const download = () => {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dsa-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg("Backup downloaded.");
  };

  const upload = async (file: File) => {
    try {
      importProgress(await file.text());
      setMsg("Progress restored from backup.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "That file could not be read.");
    }
  };

  return (
    <footer className="backup">
      <h2>Your progress</h2>
      <p>
        Ticks are saved in this browser only. Download a backup to move them to another device or
        browser.
      </p>
      <div className="actions">
        <button className="btn" onClick={download}>Download backup</button>
        <button className="btn" onClick={() => fileRef.current?.click()}>Restore from backup</button>
        <button
          className="btn btn-quiet"
          onClick={() => {
            if (confirm("Clear every tick on every playlist? This can't be undone.")) {
              resetEverything();
              setMsg("All ticks cleared.");
            }
          }}
        >
          Clear everything
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </div>
      {msg && <p className="note" role="status">{msg}</p>}
    </footer>
  );
}
