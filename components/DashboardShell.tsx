"use client";

import { useState, useEffect } from "react";
import { Log, ToastTheme, AppThemeType, NavTheme } from "@/lib/types";
import { Navbar } from "./Navbar";
import LogDashboard from "./LogDashboard";
import { saveSettings } from "@/app/actions";

type Settings = {
    appTheme:   AppThemeType;
    navTheme:   NavTheme;
    toastTheme: ToastTheme;
};

const DEFAULTS: Settings = { appTheme: "cyber", navTheme: "A", toastTheme: "A" };

const validAppThemes  = ["cyber", "terminal", "military"];
const validNavThemes  = ["A", "B", "C"];
const validToastThemes = ["A", "B", "C"];

function parseSettings(raw: unknown): Settings {
    if (!raw || typeof raw !== "object") return DEFAULTS;
    const s = raw as Record<string, unknown>;
    return {
        appTheme:   validAppThemes.includes(s.appTheme as string)   ? s.appTheme  as AppThemeType : DEFAULTS.appTheme,
        navTheme:   validNavThemes.includes(s.navTheme as string)    ? s.navTheme  as NavTheme     : DEFAULTS.navTheme,
        toastTheme: validToastThemes.includes(s.toastTheme as string) ? s.toastTheme as ToastTheme  : DEFAULTS.toastTheme,
    };
}

type DashboardShellProps = {
    logs:            Log[];
    initialSettings: unknown;
};

export default function DashboardShell({ logs, initialSettings }: DashboardShellProps) {
    const [{ appTheme, navTheme, toastTheme }, setSettings] = useState<Settings>(
        () => parseSettings(initialSettings),
    );

    const setAppTheme   = (appTheme: AppThemeType) => setSettings(s => ({ ...s, appTheme }));
    const setNavTheme   = (navTheme: NavTheme)      => setSettings(s => ({ ...s, navTheme }));
    const setToastTheme = (toastTheme: ToastTheme)  => setSettings(s => ({ ...s, toastTheme }));

    // Persist to DB on any theme change
    useEffect(() => {
        saveSettings({ appTheme, navTheme, toastTheme });
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
