"use client";

import { useState } from "react";
import { Log, ToastTheme } from "@/lib/types";
import { Navbar } from "./Navbar";
import LogDashboard from "./LogDashboard";

type DashboardShellProps = {
  logs: Log[];
};

export default function DashboardShell({ logs }: DashboardShellProps) {
  const [toastTheme, setToastTheme] = useState<ToastTheme>("A");

  return (
    <>
      <Navbar logs={logs} toastTheme={toastTheme} onToastThemeChange={setToastTheme} />
      <LogDashboard logs={logs} toastTheme={toastTheme} />
    </>
  );
}
