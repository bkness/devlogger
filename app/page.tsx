import LogDashboard from "@/components/LogDashboard";
import { Navbar } from "@/components/Navbar";
import { getLogs } from "@/lib/logs";

export default async function Home() {
  const logs = await getLogs();
  return (
  
    <main id="mainContent" className="max-w-10xl mx-auto p-8">  
     <Navbar /> 
  { /* <SettingsPanel /> */}
      <LogDashboard logs={logs} />
    </main>
  )
}