import DashboardClient from "@/components/DashboardClient";
import stats from "@/public/stats.json";

export default function HomePage() {
  return <DashboardClient stats={stats} />;
}
