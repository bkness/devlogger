"use client";

import { useState } from "react";
import { Log } from "@/lib/types";
import LogForm from "./LogForm";
import LogCard from "./LogCard";

export default function LogDashboard({ logs }: { logs: Log[] }) {
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [detailLog, setDetailLog] = useState<Log | null>(null);

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
      />
      {logs.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 py-20">
          <p className="panel-label" style={{ fontSize: "1rem" }}>// no logs found</p>
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
