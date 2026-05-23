'use client';
import { useEffect } from "react";
import { ToastTheme, AppThemeType, NavTheme } from "@/lib/types";

type SettingsPanelProps = {
    isOpen: boolean;
    onClose: () => void;
    toastTheme: ToastTheme;
    onToastThemeChange: (theme: ToastTheme) => void;
    appTheme: AppThemeType;
    onAppThemeChange: (theme: AppThemeType) => void;
    navTheme: NavTheme;
    onNavThemeChange: (theme: NavTheme) => void;
};


export function SettingsPanel({ isOpen, onClose, toastTheme, onToastThemeChange, appTheme, onAppThemeChange, navTheme, onNavThemeChange }: SettingsPanelProps) {

    useEffect(() => {
        if (!isOpen) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const toastThemes: { key: ToastTheme; label: string }[] = [
        { key: "A", label: "Terminal Signal" },
        { key: "B", label: "HUD Panel" },
        { key: "C", label: "Minimal Inline" },
    ];

    const appThemes: { key: AppThemeType; label: string }[] = [
        { key: "cyber", label: "Cyber" },
        { key: "terminal", label: "Terminal" },
        { key: "military", label: "Military" },
    ];

    const navThemes: { key: NavTheme; label: string }[] = [
        { key: "A", label: "Command Bar" },
        { key: "B", label: "Slim Signal" },
        { key: "C", label: "Terminal Path" },
    ];

    return (
        <>
            <div className="settings-backdrop" onClick={onClose} />
            <div id="settingsPanel" className="settings-panel">
                <div className="settings-header">
                    <p className="panel-label">{"// SETTINGS"}</p>
                    <button type="button" className="settings-close" onClick={onClose}>✕</button>
                </div>

                <div className="settings-section">
                    <p className="settings-section-label">TOAST THEME</p>
                    <div className="settings-options">
                        {toastThemes.map(({ key, label }) => (
                            <button
                                key={key}
                                type="button"
                                className={`settings-option${toastTheme === key ? " active" : ""}`}
                                onClick={() => onToastThemeChange(key)}
                            >
                                <span className="settings-option-key">{key}</span>
                                <span className="settings-option-label">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="settings-section">
                    <p className="settings-section-label">APP THEME</p>
                    <div className="settings-options">
                        {appThemes.map(({ key, label }) => (
                            <button
                                key={key}
                                type="button"
                                className={`settings-option${appTheme === key ? " active" : ""}`}
                                onClick={() => onAppThemeChange(key)}
                            >
                                <span className="settings-option-key">{key[0].toUpperCase()}</span>
                                <span className="settings-option-label">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="settings-section">
                    <p className="settings-section-label">NAVBAR THEME</p>
                    <div className="settings-options">
                        {navThemes.map(({ key, label }) => (
                            <button
                                key={key}
                                type="button"
                                className={`settings-option${navTheme === key ? " active" : ""}`}
                                onClick={() => onNavThemeChange(key)}
                            >
                                <span className="settings-option-key">{key}</span>
                                <span className="settings-option-label">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}