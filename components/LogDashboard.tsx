"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Log, AppThemeType } from "@/lib/types";
import LogForm from "./LogForm";
import LogCard from "./LogCard";
import { ToastType } from "@/lib/types";
import { ToastTheme } from "@/lib/types";
import { Toast } from "./Toast";

type LogDashboardProps = {
  logs: Log[];
  query: string;
  setQuery: (q: string) => void;
  toastTheme: ToastTheme;
  appTheme: AppThemeType;
  onTagClick?: (tag: string) => void;
};

export default function LogDashboard({ logs, query, setQuery, toastTheme, appTheme, onTagClick }: LogDashboardProps) {
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [detailLog, setDetailLog] = useState<Log | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [toastKey, setToastKey] = useState(0);
  const [toastType, setToastType] = useState<ToastType | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dismissToast = useCallback(() => setMessage(null), []);

  useEffect(() => {
    if (!message || toastTheme !== "C") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismissToast();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [message, toastTheme, dismissToast]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const [toastTitle, setToastTitle] = useState<string | undefined>(undefined);

  function handleToast(msg: string, type: ToastType, title?: string) {
    setMessage(msg);
    setToastType(type);
    setToastTitle(title);
    setToastKey((k) => k + 1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMessage(null), 3000);
  }

  function handleDetail(log: Log | null) {
    setDetailLog(log);
    if (log) setSelectedLog(log);
  }

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search logs..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="search-input"
          aria-label="Search logs"
        />
        {query && (
          <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="Clear
  search">
            ×
          </button>
        )}
      </div>
      <LogForm
        selectedLog={selectedLog}
        onClear={() => setSelectedLog(null)}
        detailLog={detailLog}
        onDetailClear={() => setDetailLog(null)}
        handleToast={handleToast}
      />
      {message && toastType && (
        <Toast key={toastKey} message={message} type={toastType} title={toastTitle} theme={toastTheme} appTheme={appTheme} onDismiss={dismissToast} />
      )}
      {logs.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 py-20">
          <p className="panel-label" style={{ fontSize: "1rem" }}>
            {query.trim() ? `// no logs match "${query}"` : "// no logs found"}
          </p>
          <p className="preview-empty" style={{ fontSize: "0.9rem" }}>
            {query.trim() ? "try a different keyword" : "start typing above to create your first entry"}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-8 items-start">
          {logs.map((log) => (
            <LogCard
              key={log.id}
              log={log}
              previewing={selectedLog?.id === log.id}
              detailing={detailLog?.id === log.id}
              onPreview={setSelectedLog}
              onDetail={handleDetail}
              onTagClick={onTagClick}
            />
          ))}
        </ul>
      )}
    </>
  );
}