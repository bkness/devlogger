import DashboardShell from "@/components/DashboardShell";
import { getLogs } from "@/lib/logs";

export default async function Home() {
  const logs = await getLogs();
  return (
  
    <main id="mainContent" className="max-w-10xl mx-auto p-8">  
      <DashboardShell logs={logs} />
    </main>
  )
}