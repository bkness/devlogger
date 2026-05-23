import { ToastType, AppThemeType, ToastTheme } from "@/lib/types";

interface ToastProps {
    message: string;
    type: ToastType;
    title?: string;
    theme?: ToastTheme;
    appTheme?: AppThemeType;
    onDismiss?: () => void;
}

const titleByType: Record<ToastType, string> = {
    success: "Log saved",
    error:   "Failed to save",
    warn:    "Validation",
    info:    "Log updated",
};

const codeByType: Record<ToastType, string> = {
    success: "200",
    error:   "500",
    warn:    "400",
    info:    "200",
};

// [outerClass, typePrefix]
const classMap: Record<AppThemeType, Record<ToastTheme, [string, string]>> = {
    cyber:    { A: ["cyber-a",    "ca"],  B: ["cyber-b",    "cb"],  C: ["cyber-c",    "cc"]  },
    terminal: { A: ["terminal-a", "ta"],  B: ["terminal-b", "tb2"], C: ["terminal-c", "tc2"] },
    military: { A: ["military-a", "ma"],  B: ["military-b", "mb"],  C: ["military-c", "mc"]  },
};

export function Toast({ message, type, title, theme = "A", appTheme = "cyber", onDismiss }: ToastProps) {
    const displayTitle = title ?? titleByType[type];
    const [outerClass, p] = classMap[appTheme][theme];
    const modClass = `${p}-${type}`;

    // Theme A — Signal bar with left icon stripe + progress bar
    if (theme === "A") {
        return (
            <div className="toast" role="status" aria-live="polite">
                <div className={`${outerClass} ${modClass}`}>
                    <div className="t-title">{displayTitle}</div>
                    <div className="t-body">{message}</div>
                    <div className="t-bar" />
                </div>
            </div>
        );
    }

    // Theme B — HUD dot + code + corner brackets
    if (theme === "B") {
        const titleDisplay = appTheme === "military"
            ? displayTitle
            : displayTitle.toUpperCase();
        return (
            <div className="toast" role="status" aria-live="polite">
                <div className={`${outerClass} ${modClass}`}>
                    <div className={`${p}-dot`} />
                    <div className={`${p}-content`}>
                        <div className="t-title">{titleDisplay}</div>
                        <div className="t-body">{message}</div>
                    </div>
                    <div className={`${p}-code`}>{codeByType[type]}</div>
                    {appTheme === "military" && <div className={`${p}-bar`} />}
                </div>
            </div>
        );
    }

    // Theme C — Minimal inline with left bar + ESC dismiss
    return (
        <div className="toast" role="status" aria-live="polite">
            <div className={`${outerClass} ${modClass}`}>
                <div className={`${p}-bar`} />
                <div className={`${p}-text`}>
                    <div className="t-title">{displayTitle}</div>
                    <div className="t-body">{message}</div>
                </div>
                <button type="button" className={`${p}-esc`} aria-label="Dismiss" onClick={onDismiss}>ESC</button>
                {appTheme === "military" && <div className={`${p}-progress`} />}
            </div>
        </div>
    );
}
