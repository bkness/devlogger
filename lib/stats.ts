import { Log } from "@/lib/types";

export function getStartOfWeek(d: Date = new Date()): Date {
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
}

export function getStartOfMonth(d: Date = new Date()): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function countThisWeek(logs: Log[]): number {
    const start = getStartOfWeek();
    return logs.filter(l => new Date(l.createdAt) >= start).length;
}