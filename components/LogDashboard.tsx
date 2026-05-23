"use client";

import { useState, useEffect, useCallback } from "react";
import { Log, AppThemeType } from "@/lib/types";
import LogForm from "./LogForm";
import LogCard from "./LogCard";
import { ToastType } from "@/lib/types";
import { ToastTheme } from "@/lib/types";
import { Toast } from "./Toast";

type LogDashboardProps = {
  logs: Log[];
  toastTheme: ToastTheme;
  appTheme: AppThemeType;
};

export default function LogDashboard({ logs, toastTheme, appTheme }: LogDashboardProps) {
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [detailLog, setDetailLog] = useState<Log | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [toastKey, setToastKey] = useState(0);
  const [toastType, setToastType] = useState<ToastType | null>(null);

  const dismissToast = useCallback(() => setMessage(null), []);

  useEffect(() => {
    if (!message || toastTheme !== "C") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismissToast();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [message, toastTheme, dismissToast]);

  function handleToast(msg: string, type: ToastType) {
    setMessage(msg);
    setToastType(type);
    setToastKey((k) => k + 1);
    setTimeout(() => setMessage(null), 3000);
  }

  function handleDetail(log: Log | null) {
    setDetailLog(log);
    if (log) setSelectedLog(log);
  }

  return (
    <>
      <LogForm
        selectedLog={selectedLog}
        onClear={() => setSelectedLog(null)}
        detailLog={detailLog}
        onDetailClear={() => setDetailLog(null)}
        handleToast={handleToast}
      />
      {message && toastType && (
        <Toast key={toastKey} message={message} type={toastType} theme={toastTheme} appTheme={appTheme} onDismiss={dismissToast} />
      )}
      {logs.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 py-20">
          <p className="panel-label" style={{ fontSize: "1rem" }}>{"// no logs found"}</p>
          <p className="preview-empty" style={{ fontSize: "0.9rem" }}>start typing above to create your first entry</p>
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
            />
          ))}
        </ul>
      )}
    </>
  );
}