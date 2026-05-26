"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth-actions";

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode]       = useState<"login" | "register">("login");
    const [error, setError]     = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const fd              = new FormData(e.currentTarget);
        const email           = fd.get("email")           as string;
        const password        = fd.get("password")        as string;
        const name            = fd.get("name")            as string;
        const confirmPassword = fd.get("confirmPassword") as string;

        if (mode === "register") {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                setLoading(false);
                return;
            }
            const result = await register(email, name, password);
            if (result.error) { setError(result.error); setLoading(false); return; }
            // auto-login after register
        }

        const result = await signIn("credentials", {
            email, password, redirect: false,
        });

        if (result?.error) {
            setError("Invalid email or password");
            setLoading(false);
            return;
        }

        router.push("/");
        router.refresh();
    }

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-brand">
                    <svg className="login-hex" viewBox="0 0 26 26" fill="none">
                        <polygon points="13,2 23,7.5 23,18.5 13,24 3,18.5 3,7.5"
                            stroke="#00e5ff" strokeWidth="1.5" fill="rgba(0,229,255,0.05)" />
                        <polygon points="13,6 19,9.5 19,16.5 13,20 7,16.5 7,9.5"
                            stroke="rgba(0,229,255,0.25)" strokeWidth="1" fill="none" />
                        <text x="13" y="16" textAnchor="middle" fill="#00ff88"
                            fontSize="7" fontWeight="700" fontFamily="monospace">DL</text>
                    </svg>
                    <div>
                        <div className="login-title">DEVLOGGER</div>
                        <div className="login-sub">devforge · bkness</div>
                    </div>
                </div>

                <div className="login-tabs">
                    <button
                        type="button"
                        className={`login-tab${mode === "login" ? " active" : ""}`}
                        onClick={() => { setMode("login"); setError(null); }}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={`login-tab${mode === "register" ? " active" : ""}`}
                        onClick={() => { setMode("register"); setError(null); }}
                    >
                        Register
                    </button>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field-group">
                        <label className="login-label">EMAIL</label>
                        <input
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            className="panel-field login-input"
                            placeholder="you@example.com"
                        />
                    </div>

                    {mode === "register" && (
                        <div className="login-field-group">
                            <label className="login-label">USERNAME</label>
                            <input
                                name="name"
                                type="text"
                                required
                                autoComplete="off"
                                className="panel-field login-input"
                                placeholder="handle"
                            />
                        </div>
                    )}

                    <div className="login-field-group">
                        <label className="login-label">PASSWORD</label>
                        <input
                            name="password"
                            type="password"
                            required
                            autoComplete={mode === "register" ? "new-password" : "current-password"}
                            className="panel-field login-input"
                            placeholder="••••••••"
                        />
                    </div>

                    {mode === "register" && (
                        <div className="login-field-group">
                            <label className="login-label">CONFIRM PASSWORD</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                autoComplete="new-password"
                                className="panel-field login-input"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    {error && <p className="login-error">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="login-submit"
                    >
                        {loading ? "..." : mode === "login" ? "// login" : "// create account"}
                    </button>
                </form>

            </div>
        </div>
    );
}
