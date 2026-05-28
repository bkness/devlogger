"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

type View = "logs" | "stats" | "tags";

type Props = {
    userName: string;
    totalLogs: number;
    thisWeek: number;
    currentView: View;
    onViewChange: (view: View) => void;
    onOpenSettings: () => void;
    onNewLog: () => void;
    onExport: () => void;
}

export function MobileNav({ userName, totalLogs, thisWeek, currentView, onViewChange, onOpenSettings, onNewLog, onExport }: Props) {
    const [open, setOpen] = useState(false);

    function pick(view: View) {
        onViewChange(view);
        setOpen(false);
    }

    return (
        <>
            <nav className="mobile-nav">
                <span className="mobile-nav-brand">DEVLOGGER</span>
                <button type="button" className="mobile-nav-toggle" onClick={() => setOpen(!open)}
                    aria-expanded={open} aria-label="Menu">
                    {open ? "✕" : "☰"}
                </button>
            </nav>

            {open && (
                <>
                    <div className="mobile-nav-backdrop" onClick={() => setOpen(false)} />
                    <div className="mobile-nav-menu">
                        <div className="mobile-nav-header">
                            <p className="panel-label">{"// MENU"}</p>
                            <button type="button" className="mobile-nav-close" onClick={() => setOpen(false)}>✕</button>
                        </div>

                        {/* user + stats */}
                        <div className="mobile-nav-section">
                            <p className="mobile-nav-section-label">USER</p>
                            <div className="mobile-nav-user">
                                <p className="mobile-nav-user-name">{"// "}{userName}</p>
                                <div className="mobile-nav-stats">
                                    <div className="mobile-nav-stat">
                                        <div className="mobile-nav-stat-val">{totalLogs}</div>
                                        <div className="mobile-nav-stat-label">Total</div>
                                    </div>
                                    <div className="mobile-nav-stat">
                                        <div className="mobile-nav-stat-val">{thisWeek}</div>
                                        <div className="mobile-nav-stat-label">This week</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* views */}
                        <div className="mobile-nav-section">
                            <p className="mobile-nav-section-label">VIEWS</p>
                            <button className={`mobile-nav-link ${currentView === "logs" ? "active" : ""}`} onClick={() =>
                                pick("logs")}>Logs</button>
                            <button className={`mobile-nav-link ${currentView === "stats" ? "active" : ""}`} onClick={() =>
                                pick("stats")}>Stats</button>
                            <button className={`mobile-nav-link ${currentView === "tags" ? "active" : ""}`} onClick={() =>
                                pick("tags")}>Tags</button>
                        </div>

                        {/* actions */}
                        <div className="mobile-nav-section">
                            <p className="mobile-nav-section-label">ACTIONS</p>
                            <button className="mobile-nav-link" onClick={() => { onNewLog(); setOpen(false); }}>+ New
                                Log</button>
                            <button className="mobile-nav-link" onClick={() => {
                                onExport(); setOpen(false);
                            }}>Export</button>
                            <button className="mobile-nav-link" onClick={() => {
                                onOpenSettings(); setOpen(false);
                            }}>Settings</button>
                            <button className="mobile-nav-link" onClick={() => signOut({ callbackUrl: "/login" })}>Sign
                                Out ↪</button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}