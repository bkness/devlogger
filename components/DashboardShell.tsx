"use client";

import { useState, useEffect } from "react";
import { Log, ToastTheme, AppThemeType, NavTheme } from "@/lib/types";
import { Navbar } from "./Navbar";
import LogDashboard from "./LogDashboard";

type DashboardShellProps = {
  logs: Log[];
};

const SETTINGS_KEY = "devlogger-settings";

type Settings = {
  appTheme: AppThemeType;
  navTheme: NavTheme;
  toastTheme: ToastTheme;
};

const DEFAULTS: Settings = { appTheme: "cyber", navTheme: "A", toastTheme: "A" };

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export default function DashboardShell({ logs }: DashboardShellProps) {
  const [{ appTheme, navTheme, toastTheme }, setSettings] = useState<Settings>(loadSettings);

  const setAppTheme = (appTheme: AppThemeType) => setSettings(s => ({ ...s, appTheme }));
  const setNavTheme = (navTheme: NavTheme) => setSettings(s => ({ ...s, navTheme }));
  const setToastTheme = (toastTheme: ToastTheme) => setSettings(s => ({ ...s, toastTheme }));

  // Persist whenever any theme changes
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ appTheme, navTheme, toastTheme }));
  }, [appTheme, navTheme, toastTheme]);

  // Apply appTheme class to <html> and <body>
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
      <LogDashboard logs={logs} toastTheme={toastTheme} appTheme={appTheme} />
    </>
  );
}
