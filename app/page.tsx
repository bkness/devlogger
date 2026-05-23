import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getLogs } from "@/lib/logs";
import DashboardShell from "@/components/DashboardShell";

export default async function Home() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const [logs, user] = await Promise.all([
        getLogs(session.user.id),
        prisma.user.findUnique({
            where: { id: session.user.id },
            select: { settings: true, name: true },
        }),
    ]);

    return (
        <main id="mainContent" className="max-w-10xl mx-auto p-8">
            <DashboardShell logs={logs} initialSettings={user?.settings ?? {}} userName={user?.name ?? ""} />
        </main>
    );
}
