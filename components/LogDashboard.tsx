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
    </>
  );
}
