"use client";

import { useState, useEffect, useRef } from "react";
import { Log, ToastTheme, AppThemeType, NavTheme } from "@/lib/types";
import { Navbar } from "./Navbar";
import LogDashboard from "./LogDashboard";
import { saveSettings } from "@/app/actions";
import StatsView from "./StatsView";
import TagsView from "./TagsView";

type Settings = {
    appTheme:   AppThemeType;
    navTheme:   NavTheme;
    toastTheme: ToastTheme;
};

type DashboardShellProps = {
    logs:            Log[];
    initialSettings: unknown;
    userName:        string;
};

type View = "logs" | "stats" | "tags";

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


export default function DashboardShell({ logs, initialSettings, userName }: DashboardShellProps) {
    const [{ appTheme, navTheme, toastTheme }, setSettings] = useState<Settings>(
        () => parseSettings(initialSettings),
    );

    const setAppTheme   = (appTheme: AppThemeType) => setSettings(s => ({ ...s, appTheme }));
    const setNavTheme   = (navTheme: NavTheme)      => setSettings(s => ({ ...s, navTheme }));
    const setToastTheme = (toastTheme: ToastTheme)  => setSettings(s => ({ ...s, toastTheme }));
    const [view, setView] = useState<View>("logs");
    const [activeTag, setActiveTag] = useState<string | null>(null);

    function handleTagClick(tag: string) {
        setView("tags");
        setActiveTag(tag);
    }

    // Persist to DB on any theme change (skip initial mount)
    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) { mounted.current = true; return; }
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
                userName={userName}
                toastTheme={toastTheme}
                onToastThemeChange={setToastTheme}
                appTheme={appTheme}
                onAppThemeChange={setAppTheme}
                navTheme={navTheme}
                onNavThemeChange={setNavTheme}
                currentView={view}
                onViewChange={setView}
            />
            {view === "logs" && <LogDashboard logs={logs} toastTheme={toastTheme} appTheme={appTheme} onTagClick={handleTagClick} />}
            {view === "stats" && <StatsView logs={logs} />}
            {view === "tags" && <TagsView logs={logs} activeTag={activeTag} setActiveTag={setActiveTag} />}
        </>
    );
}
