'use client';
import { SettingsPanel } from "./SettingsPanel";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Log, ToastTheme, AppThemeType, NavTheme } from "@/lib/types";

type NavbarProps = {
    logs: Log[];
    userName: string;
    toastTheme: ToastTheme;
    onToastThemeChange: (theme: ToastTheme) => void;
    appTheme: AppThemeType;
    onAppThemeChange: (theme: AppThemeType) => void;
    navTheme: NavTheme;
    onNavThemeChange: (theme: NavTheme) => void;
    currentView: View;
    onViewChange: (view: View) => void;
};

type View = "logs" | "stats" | "tags";

export function Navbar({ logs, userName, toastTheme, onToastThemeChange, appTheme, onAppThemeChange, navTheme, onNavThemeChange, currentView, onViewChange }: NavbarProps) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [time, setTime] = useState("--:--:--");

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const thisWeek = logs.filter(log => new Date(log.createdAt) >= startOfWeek).length;
    const totalLogs = logs.length;

    function handleNewLog() {
        onViewChange("logs");
        setTimeout(() => document.getElementById("mainTitle")?.focus(), 0);
    }

    function handleExport() {
        const json = JSON.stringify(logs, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `devlogger-logs-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        function tick() {
            setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
        }
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const openSettings = () => setSettingsOpen(true);

    const settingsPanel = (
        <SettingsPanel
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            toastTheme={toastTheme}
            onToastThemeChange={onToastThemeChange}
            appTheme={appTheme}
            onAppThemeChange={onAppThemeChange}
            navTheme={navTheme}
            onNavThemeChange={onNavThemeChange}
        />
    );

    /* ── NAV B — Slim Signal ── */
    if (navTheme === "B") {
        return (
            <>
                <nav className="nav-b">
                    <div className="nb-brand">
                        <div className="nb-logo-mark">DL</div>
                        <span className="nb-name">DEVLOGGER</span>
                    </div>
                    <div className="nb-sep" />
                    <div className="nb-links">
                        <button className={`nb-link ${currentView === "logs" ? "active" : ""}`} onClick={() =>
                            onViewChange("logs")}>
                            <span className="nav-dot"></span>Logs
                        </button>
                        <button className={`nb-link ${currentView === "stats" ? "active" : ""}`} onClick={() =>
                            onViewChange("stats")}>Stats</button>
                        <button className={`nb-link ${currentView === "tags" ? "active" : ""}`} onClick={() =>
                            onViewChange("tags")}>Tags</button>
                        <button type="button" className="nb-link" onClick={openSettings}>Settings</button>
                    </div>
                    <div className="nb-right">
                        {userName && <span className="nb-user">{"// "}{userName}</span>}
                        <span className="nb-count"><span className="nb-count-val">{totalLogs}</span> logs</span>
                        <button type="button" className="nb-new" onClick={handleNewLog}>+ New</button>
                        <button type="button" className="nav-signout" onClick={() => signOut({ callbackUrl: "/login" })}>↪</button>
                    </div>
                </nav>
                {settingsPanel}
            </>
        );
    }

    /* ── NAV C — Terminal Path ── */
    if (navTheme === "C") {
        return (
            <>
                <nav className="nav-c">
                    <div className="nc-brand-block">
                        <svg className="nc-hex" viewBox="0 0 22 22" fill="none">
                            <polygon points="11,1.5 20,6.5 20,15.5 11,20.5 2,15.5 2,6.5" stroke="#00e5ff" strokeWidth="1.5" fill="rgba(0,229,255,0.05)" />
                            <text x="11" y="14" textAnchor="middle" fill="#00ff88" fontSize="6" fontWeight="700" fontFamily="monospace">DL</text>
                        </svg>
                        <span className="nc-brand-text">DL</span>
                    </div>
                    <div className="nc-path">
                        <button className={`nc-crumb ${currentView === "logs" ? "active" : ""}`} onClick={() =>
                            onViewChange("logs")}>
                            <span className="logs"></span>Logs
                        </button>
                        <button className={`nc-crumb ${currentView === "stats" ? "active" : ""}`} onClick={() =>
                            onViewChange("stats")}>
                            <span className="stats"></span>Stats
                        </button>
                        <button className={`nc-crumb ${currentView === "tags" ? "active" : ""}`} onClick={() =>
                            onViewChange("tags")}>
                            <span className="tags"></span>Tags
                        </button>
                        <button type="button" className="nc-crumb" onClick={openSettings}>~/settings</button>
                    </div>
                    <div className="nc-right">
                        {userName && <span className="nc-user">{"// "}{userName}</span>}
                        <button type="button" className="nc-action primary" onClick={handleNewLog}>
                            <div className="nc-pulse" />
                            New Log
                        </button>
                        <button type="button" className="nc-action" onClick={handleExport}>Export</button>
                        <button type="button" className="nc-action nav-signout" onClick={() => signOut({ callbackUrl: "/login" })}>↪</button>
                    </div>
                </nav>
                {settingsPanel}
            </>
        );
    }

    /* ── NAV A — Command Bar (default) ── */
    return (
        <>
            <nav className="nav">
                <div className="nav-brand">
                    <div className="nav-hex">
                        <svg viewBox="0 0 26 26" fill="none">
                            <polygon points="13,2 23,7.5 23,18.5 13,24 3,18.5 3,7.5" stroke="#00e5ff" strokeWidth="1.5" fill="rgba(0,229,255,0.05)" />
                            <polygon points="13,6 19,9.5 19,16.5 13,20 7,16.5 7,9.5" stroke="rgba(0,229,255,0.25)" strokeWidth="1" fill="none" />
                            <text x="13" y="16" textAnchor="middle" fill="#00ff88" fontSize="7" fontWeight="700" fontFamily="monospace">DL</text>
                        </svg>
                    </div>
                    <div>
                        <div className="nav-title">DEVLOGGER</div>
                        <div className="nav-sub">devforge · {userName}</div>
                    </div>
                </div>

                <div className="nav-nav">
                    <button className={`nav-link ${currentView === "logs" ? "active" : ""}`} onClick={() =>
                        onViewChange("logs")}>
                        <span className="nav-dot"></span>Logs
                    </button>
                    <button className={`nav-link ${currentView === "stats" ? "active" : ""}`} onClick={() =>
                        onViewChange("stats")}>Stats</button>
                    <button className={`nav-link ${currentView === "tags" ? "active" : ""}`} onClick={() =>
                        onViewChange("tags")}>Tags</button>
                    <button className="nav-link"
                        id="settingsBtn"
                        type="button"
                        aria-expanded={settingsOpen}
                        aria-controls="settingsPanel"
                        onClick={openSettings}
                    >
                        Settings
                    </button>
                </div>
                <div className="nav-right">
                    {userName && (
                        <>
                            <div className="nav-user">{"// "}{userName}</div>
                            <div className="nav-divider"></div>
                        </>
                    )}
                    <div className="nav-stat">
                        <div className="nav-stat-val">{totalLogs}</div>
                        <div className="nav-stat-label">Total logs</div>
                    </div>
                    <div className="nav-divider"></div>
                    <div className="nav-stat">
                        <div className="nav-stat-val">{thisWeek}</div>
                        <div className="nav-stat-label">This week</div>
                    </div>
                    <div className="nav-divider"></div>
                    <button className="nav-btn" onClick={handleNewLog}>+ New Log</button>
                    <div className="nav-time">{time}</div>
                    <button type="button" className="nav-signout" onClick={() => signOut({ callbackUrl: "/login" })}>↪</button>
                </div>
            </nav>
            {settingsPanel}
        </>
    );
}
