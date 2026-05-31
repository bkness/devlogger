"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Log, ToastTheme, AppThemeType, NavTheme } from "@/lib/types";
import { Navbar } from "./Navbar";
import LogDashboard from "./LogDashboard";
import { saveSettings } from "@/app/actions";
import StatsView from "./StatsView";
import TagsView from "./TagsView";

type Settings = {
    appTheme: AppThemeType;
    navTheme: NavTheme;
    toastTheme: ToastTheme;
};

type DashboardShellProps = {
    logs: Log[];
    initialSettings: unknown;
    userName: string;
};

type View = "logs" | "stats" | "tags";

type SortBy = "newest" | "oldest" | "alpha";

const DEFAULTS: Settings = { appTheme: "cyber", navTheme: "A", toastTheme: "A" };

const validAppThemes = ["cyber", "terminal", "military"];
const validNavThemes = ["A", "B", "C"];
const validToastThemes = ["A", "B", "C"];

function parseSettings(raw: unknown): Settings {
    if (!raw || typeof raw !== "object") return DEFAULTS;
    const s = raw as Record<string, unknown>;
    return {
        appTheme: validAppThemes.includes(s.appTheme as string) ? s.appTheme as AppThemeType : DEFAULTS.appTheme,
        navTheme: validNavThemes.includes(s.navTheme as string) ? s.navTheme as NavTheme : DEFAULTS.navTheme,
        toastTheme: validToastThemes.includes(s.toastTheme as string) ? s.toastTheme as ToastTheme : DEFAULTS.toastTheme,
    };
}


export default function DashboardShell({ logs, initialSettings, userName }: DashboardShellProps) {
    const [{ appTheme, navTheme, toastTheme }, setSettings] = useState<Settings>(
        () => parseSettings(initialSettings),
    );

    const setAppTheme = (appTheme: AppThemeType) => setSettings(s => ({ ...s, appTheme }));
    const setNavTheme = (navTheme: NavTheme) => setSettings(s => ({ ...s, navTheme }));
    const setToastTheme = (toastTheme: ToastTheme) => setSettings(s => ({ ...s, toastTheme }));
    const [view, setView] = useState<View>("logs");
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortBy>("newest");

    const filteredLogs = useMemo(() => {
        const q = query.trim().toLowerCase();
        const matched = q
            ? logs.filter(log =>
                log.title.toLowerCase().includes(q) ||
                log.content.toLowerCase().includes(q))
            : logs;

        const sorted = [...matched];
        if (sortBy === "newest") {
            sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortBy === "oldest") {
            sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        } else {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        }
        return sorted;
    }, [logs, query, sortBy]);

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
            {view === "logs" && (
                <LogDashboard
                    logs={filteredLogs}
                    query={query}
                    setQuery={setQuery}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    toastTheme={toastTheme}
                    appTheme={appTheme}
                    onTagClick={handleTagClick} />)}
            {view === "stats" && <StatsView logs={logs} />}
            {view === "tags" && <TagsView logs={logs} activeTag={activeTag} setActiveTag={setActiveTag} />}
        </>
    );
}
