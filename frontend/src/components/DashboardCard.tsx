type DashboardCardProps = {
  title: string;
  count: number;
  iconPath?: string;
};

export default function DashboardCard({
  title,
  count,
  iconPath,
}: DashboardCardProps) {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <div>
        <h2>{count}</h2>
        <div>{iconPath}</div>
      </div>
    </div>
  );
}
