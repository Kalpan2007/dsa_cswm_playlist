"use client";

import { useRef, useState } from "react";
import { exportProgress, importProgress, resetEverything } from "@/lib/progress";
import { Download, Upload, Trash2, ShieldCheck } from "lucide-react";

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
    setMsg("Backup downloaded successfully.");
  };

  const upload = async (file: File) => {
    try {
      importProgress(await file.text());
      setMsg("Progress restored from backup file.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "That file could not be read.");
    }
  };

  return (
    <div className="backup-card">
      <div className="backup-header">
        <ShieldCheck size={20} className="backup-icon" />
        <div>
          <h3 className="backup-title">Data Storage &amp; Portability</h3>
          <p className="backup-desc">
            Your ticks and personal notes are saved locally in your browser storage. Export a JSON backup to sync between your laptop, work computer, or another browser.
          </p>
        </div>
      </div>

      <div className="backup-actions">
        <button type="button" className="btn backup-btn" onClick={download}>
          <Download size={15} />
          <span>Export Backup</span>
        </button>

        <button
          type="button"
          className="btn backup-btn"
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={15} />
          <span>Import Backup</span>
        </button>

        <button
          type="button"
          className="btn backup-btn btn-danger"
          onClick={() => {
            if (confirm("Clear every tick on every playlist? This action cannot be undone.")) {
              resetEverything();
              setMsg("All ticks cleared.");
            }
          }}
        >
          <Trash2 size={15} />
          <span>Clear Progress</span>
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

      {msg && <p className="backup-msg">{msg}</p>}
    </div>
  );
}
