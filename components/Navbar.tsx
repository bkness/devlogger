'use client';
import { SettingsPanel } from "./SettingsPanel";
import { useState, useEffect } from "react";
import { ToastTheme } from "@/lib/types";

type NavbarProps = {
    toastTheme: ToastTheme;
    onToastThemeChange: (theme: ToastTheme) => void;
};

export function Navbar({ toastTheme, onToastThemeChange }: NavbarProps) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [time, setTime] = useState("--:--:--");

    useEffect(() => {
        function tick() {
            setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
        }
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
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
                    <div className="nav-sub">devforge · bkness</div>
                </div>
            </div>

            <div className="nav-nav">
                <button className="nav-link active">
                    <span className="nav-dot"></span>
                    Logs
                </button>
                <button className="nav-link">Stats</button>
                <button className="nav-link">Tags</button>
                <button className="nav-link"
                    id="settingsBtn"
                    type="button"
                    aria-expanded={settingsOpen}
                    aria-controls="settingsPanel"
                    onClick={() => setSettingsOpen(true)}
                >
                    Settings
                </button>
            </div>
            <div className="nav-right">
                <div className="nav-stat">
                    <div className="nav-stat-val">14</div>
                    <div className="nav-stat-label">Total logs</div>
                </div>
                <div className="nav-divider"></div>
                <div className="nav-stat">
                    <div className="nav-stat-val">5</div>
                    <div className="nav-stat-label">This week</div>
                </div>
                <div className="nav-divider"></div>
                <button className="nav-btn">+ New Log</button>
                <div className="nav-time">{time}</div>

            </div>
            <SettingsPanel
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                toastTheme={toastTheme}
                onToastThemeChange={onToastThemeChange}
            />
        </nav>
    )
}