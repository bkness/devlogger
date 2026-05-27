"use client";

import { useState } from "react";
import { Log } from "@/lib/types";

type Props = { logs: Log[] };

function getAllTags(logs: Log[]): { tag: string; count: number }[] {
    const freq: Record<string, number> = {};
    logs.forEach(l => (l.tags ?? []).forEach(t => { freq[t] = (freq[t] ?? 0) + 1; }));
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .map(([tag, count]) => ({ tag, count }));
}

export default function TagsView({ logs }: Props) {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const allTags = getAllTags(logs);
    const maxCount = allTags[0]?.count ?? 1;

    const filtered = activeTag
        ? logs.filter(l => (l.tags ?? []).includes(activeTag))
        : [];

    return (
        <div className="tags-view">

            {/* Tag cloud */}
            <div className="tags-panel">
                <div className="panel-header">{"// Tags"}</div>
                {allTags.length === 0 ? (
                    <p className="tags-empty">No tags available - add some when creating a log entry.</p>
                ) : (
                    <div className="tag-cloud">
                        {allTags.map(({ tag, count }) => {
                            const scale = 0.75 + (count / maxCount) * 0.75;
                            return (
                                <button
                                    key={tag}
                                    className={`tag-cloud-btn ${activeTag === tag ? "active" : ""}`}
                                    style={{ fontSize: `${scale}rem` }}
                                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                >
                                    {tag}
                                    <span className="tag-cloud-count">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Filtered logs */}
            {activeTag && (
                <div className="tags-panel">
                    <div className="panel-header">
                        {"// Logs tagged: "}
                        <span style={{ color: "var(--primary)" }}>{activeTag}</span>
                        <span className="tags-result-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
                    </div>
                    {filtered.length === 0 ? (
                        <p className="tags-empty">No logs found.</p>
                    ) : (
                        <ul className="tags-log-list">
                            {filtered.map(log => (
                                <li key={log.id} className="tags-log-item">
                                    <div className="tags-log-title">{log.title}</div>
                                    <div className="tags-log-body">{log.content}</div>
                                    <div className="tags-log-meta">
                                        <div className="tags-log-chips">
                                            {(log.tags ?? []).map(t => (
                                                <span key={t} className={`tag-chip ${t === activeTag ? "active" : ""}`}>{t}</span>
                                            ))}

                                        </div>
                                        <span className="tags-logdate">{new Date(log.createdAt).toLocaleString()}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}