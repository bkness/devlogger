'use client';
import { useEffect } from "react";
import { ToastTheme } from "@/lib/types";

type SettingsPanelProps = {
    isOpen: boolean;
    onClose: () => void;
    toastTheme: ToastTheme;
    onToastThemeChange: (theme: ToastTheme) => void;
};


export function SettingsPanel({ isOpen, onClose, toastTheme, onToastThemeChange }: SettingsPanelProps) {

    useEffect(() => {
        if (!isOpen) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const themes: { key: ToastTheme; label: string }[] = [
        { key: "A", label: "Terminal Signal" },
        { key: "B", label: "HUD Panel" },
        { key: "C", label: "Minimal Inline" },
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
                        {themes.map(({ key, label }) => (
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
            </div>
        </>
    );
}