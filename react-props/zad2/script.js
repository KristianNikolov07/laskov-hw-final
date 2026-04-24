const statusLabels = {
  online: "На линия",
  away: "Отсъства",
  offline: "Офлайн",
};

function StatusBadge({ status, label }) {
  const statusText = statusLabels[status] || statusLabels.offline;
  const labelText = label ? `${label} - ${statusText}` : statusText;

  return (
    <div className="status-badge">
      <span className={`status-dot ${status}`}></span>
      <span className="status-text">{labelText}</span>
    </div>
  );
}

function App() {
  return (
    <main className="app">
      <StatusBadge status="online" />
      <StatusBadge status="away" />
      <StatusBadge status="offline" />
      <StatusBadge status="online" label="Иван" />
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
