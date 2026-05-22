import "../styles/cards.css";

interface Props {
  title: string;
  value: string;
}

function StatCard({ title, value }: Props) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

export default StatCard;