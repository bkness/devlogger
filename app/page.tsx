import LogDashboard from "../components/LogDashboard";
import { getLogs } from "@/lib/logs";

export default async function Home() {
  const logs = await getLogs();
  return (
    <main id="mainContent" className="max-w-10xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Dev Logger</h1>
      <LogDashboard logs={logs} />
    </main>
  )
}