"use client";

import { Log } from "@/lib/types";
import { getStartOfWeek, getStartOfMonth } from "@/lib/stats";

type Props = { logs: Log[] };

function getStreak(logs: Log[]): number {
    if (logs.length === 0) return 0;
    const days = new Set(logs.map(l => new Date(l.createdAt).toDateString()));
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    while (days.has(cursor.toDateString())) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

function getMostActiveDay(logs: Log[]): string {
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const counts = Array(7).fill(0);
    logs.forEach(l => counts[new Date(l.createdAt).getDay()]++);
    const max = Math.max(...counts);
    if (max === 0) return "—";
    return names[counts.indexOf(max)];
}

function getLast14Days(logs: Log[]): { label: string; count: number }[] {
    const days: { label: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        const label = d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
        const count = logs.filter(l => new Date(l.createdAt).toDateString() === d.toDateString()).length;
        days.push({ label, count });
    }
    return days;
}

function getTopTags(logs: Log[]): { tag: string; count: number }[] {
    const freq: Record<string, number> = {};
    logs.forEach(l => (l.tags ?? []).forEach(t => { freq[t] = (freq[t] ?? 0) + 1; }));
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([tag, count]) => ({ tag, count }));
}

export default function StatsView({ logs }: Props) {
    if (logs.length === 0) {
        return (
            <div className="mt-8 flex flex-col items-center justify-center gap-2 py-20">
                <p className="panel-label" style={{ fontSize: "1rem" }}>
                    {"// no data yet"}
                </p>
                <p className="preview-empty" style={{ fontSize: "0.9rem" }}>
                    Create your first log to see stats
                </p>
            </div>
        );
    }
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    const startOfMonth = getStartOfMonth(now);

    const thisWeek = logs.filter(l => new Date(l.createdAt) >= startOfWeek).length;
    const thisMonth = logs.filter(l => new Date(l.createdAt) >= startOfMonth).length;
    const streak = getStreak(logs);
    const bestDay = getMostActiveDay(logs);
    const chart = getLast14Days(logs);
    const topTags = getTopTags(logs);
    const maxBar = Math.max(...chart.map(d => d.count), 1);

    return (
        <div className="stats-view">

            {/* Stat cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-val">{logs.length}</div>
                    <div className="stat-card-label">Total Logs</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-val">{thisWeek}</div>
                    <div className="stat-card-label">This Week</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-val">{thisMonth}</div>
                    <div className="stat-card-label">This Month</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-val">{streak}</div>
                    <div className="stat-card-label">Day Streak</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-val" style={{ fontSize: "1rem" }}>{bestDay}</div>
                    <div className="stat-card-label">Most Active Day</div>
                </div>
            </div>

            {/* Chart */}
            <div className="stats-panel">
                <div className="panel-header">{"// Activity - last 14 days"}</div>
                <div className="stats-chart">
                    {chart.map(d => (
                        <div key={d.label} className="chart-col">
                            <div className="chart-bar-wrap">
                                <div
                                    className="chart-bar"
                                    style={{ height: `${(d.count / maxBar) * 100}%` }}
                                />
                            </div>
                            <div className="chart-label">{d.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top tags */}
            {topTags.length > 0 && (
                <div className="stats-panel">
                    <div className="panel-header">{"// Top Tags"}</div>
                    <div className="stats-tags">
                        {topTags.map(({ tag, count }) => (
                            <div key={tag} className="stats-tag-row">
                                <span className="stats-tag-name">{tag}</span>
                                <div className="stats-tag-bar-wrap">
                                    <div
                                        className="stats-tag-bar"
                                        style={{ width: `${(count / topTags[0].count) * 100}%` }}
                                    />
                                </div>
                                <span className="stats-tag-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}