"use client";

import { useState, useEffect } from "react";
import { Log, ToastTheme, AppThemeType, NavTheme } from "@/lib/types";
import { Navbar } from "./Navbar";
import LogDashboard from "./LogDashboard";

type DashboardShellProps = {
  logs: Log[];
};

export default function DashboardShell({ logs }: DashboardShellProps) {
  const [toastTheme, setToastTheme] = useState<ToastTheme>("A");
  const [appTheme, setAppTheme] = useState<AppThemeType>("cyber");
  const [navTheme, setNavTheme] = useState<NavTheme>("A");

  useEffect(() => {
    document.documentElement.classList.remove("cyber", "terminal", "military");
    document.documentElement.classList.add(appTheme);
    document.body.classList.remove("cyber", "terminal", "military");
    document.body.classList.add(appTheme);
  }, [appTheme]);

  return (
    <>
      <Navbar
        logs={logs}
        toastTheme={toastTheme}
        onToastThemeChange={setToastTheme}
        appTheme={appTheme}
        onAppThemeChange={setAppTheme}
        navTheme={navTheme}
        onNavThemeChange={setNavTheme}
      />
      <LogDashboard logs={logs} toastTheme={toastTheme} />
    </>
  );
}
