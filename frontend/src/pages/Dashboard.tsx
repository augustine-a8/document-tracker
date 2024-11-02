import DashboardCard from "../components/DashboardCard";

export default function Dashboard() {
  return (
    <main>
      <div className="dashboard-head">
        <DashboardCard title="All Documents" count={100} />
        <DashboardCard title="Available" count={100} />
        <DashboardCard title="Assigned" count={100} />
      </div>
    </main>
  );
}
