import { ToastType } from "@/lib/types";

interface ToastProps {
    message: string;
    type: ToastType;
    theme?: "A" | "B" | "C";
}

export function Toast({ message, type, theme }: ToastProps) {
    const activeTheme = theme ?? "A";

    const titleByType: Record<ToastType, string> = {
        success: "Log saved",
        error: "Failed to save",
        warn: "Validation",
        info: "Log updated",
    };

    const codeByType: Record<ToastType, string> = {
        success: "200",
        error: "500",
        warn: "400",
        info: "200",
    };

    if (activeTheme === "A") {
        return (
            <div className="toast" data-theme="A" role="status" aria-live="polite">
                <div className={`ta ta-${type}`}>
                    <div className="ta-title">{titleByType[type]}</div>
                    <div className="ta-body">{message}</div>
                    <div className="ta-progress" />
                </div>
            </div>
        );
    }

    if (activeTheme === "B") {
        return (
            <div className="toast" data-theme="B" role="status" aria-live="polite">
                <div className={`tb tb-${type}`}>
                    <div className="tb-dot" />
                    <div className="tb-content">
                        <div className="tb-title">{titleByType[type].toUpperCase()}</div>
                        <div className="tb-body">{message}</div>
                    </div>
                    <div className="tb-code">{codeByType[type]}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="toast" data-theme="C" role="status" aria-live="polite">
            <div className={`tc tc-${type}`}>
                <div className="tc-bar" />
                <div className="tc-text">
                    <div className="tc-title">{titleByType[type]}</div>
                    <div className="tc-body">{message}</div>
                </div>
                <button type="button" className="tc-dismiss" aria-label="Dismiss notification">
                    ESC
                </button>
            </div>
        </div>
    );
}