"use client";

import { Log } from "@/lib/types";
interface LogCardProps {
  log: Log;
  previewing: boolean;
  detailing: boolean;
  onPreview: (log: Log) => void;
  onDetail: (log: Log | null) => void;
  onTagClick?: (tag: string) => void;
}

export default function LogCard({ log, previewing, detailing, onPreview, onDetail, onTagClick }: LogCardProps) {
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
      <h2 className="font-bold log-card-title">{log.title}</h2>
      {(log.tags ?? []).length > 0 && (
        <div className="log-card-tags">
          {(log.tags ?? []).map(tag => (
            <button
            type="button"
              key={tag}
              className="tag-chip"
              onClick={(e) => { e.stopPropagation(); onTagClick?.(tag); }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
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
