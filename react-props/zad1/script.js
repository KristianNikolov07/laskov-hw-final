function StudentCard({ name, grade, averageScore }) {
  const initials = name
    .split(" ")
    .map((namePart) => namePart[0])
    .join("");

  return (
    <div className="student-card">
      <div className="initials">{initials}</div>
      <div className="student-info">
        <h2 className="student-name">{name}</h2>
        <p className="student-details">
          Клас: {grade} | Успех: {averageScore}
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <main className="app">
      <StudentCard name="Иван Петров" grade="11Б" averageScore={5.67} />
      <StudentCard name="Мария Иванова" grade="11А" averageScore={5.92} />
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
