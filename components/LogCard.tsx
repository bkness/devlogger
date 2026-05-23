"use client";

import { Log } from "@/lib/types";

interface LogCardProps {
  log: Log;
  previewing: boolean;
  detailing: boolean;
  onPreview: (log: Log) => void;
  onDetail: (log: Log | null) => void;
}

export default function LogCard({ log, previewing, detailing, onPreview, onDetail }: LogCardProps) {
  const activeStyle = detailing
    ? { borderColor: "var(--primary)", boxShadow: "0 0 20px var(--glow)" }
    : previewing
      ? { borderColor: "var(--border2)" }
      : {};

  return (
    <li
      className="log-card border p-4 rounded flex flex-col gap-3"
      style={{ cursor: "pointer", ...activeStyle }}
      onClick={() => onPreview(log)}
    >
      <h2 className="font-bold">{log.title}</h2>
      <div className="mt-auto flex justify-between items-end">
        <button
          type="button"
          className={detailing ? "see-less" : "see-more"}
          onClick={(e) => { e.stopPropagation(); if (detailing) { onDetail(null); } else { onDetail(log); } }}
        >
          {detailing ? "see less" : "...see more"}
        </button>
        <p className="log-card-date">{new Date(log.createdAt).toLocaleDateString()}</p>
      </div>
    </li>
  );
}
