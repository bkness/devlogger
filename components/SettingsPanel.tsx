'use client';
import { useEffect } from "react";

type SettingsPanelProps = {
    isOpen: boolean;
    onClose: () => void;
};


export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {

    useEffect(() => {
        if (!isOpen) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className="settings-backdrop" onClick={onClose} />
            <div id="settingsPanel" className="settings-panel">
                <button className="btn">Toast Designs</button>
                <button className="btn">Option Design B</button>
                <button className="btn">Option Design C</button>
                <button className="btn" onClick={onClose}>Close</button>
            </div>
        </>
    );
}