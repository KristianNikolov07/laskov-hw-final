const { useState } = React;

const students = [
  { id: 1, name: "Иван Петров", grade: "11А" },
  { id: 2, name: "Мария Иванова", grade: "11Б" },
  { id: 3, name: "Георги Стоянов", grade: "10А" },
  { id: 4, name: "Елена Димитрова", grade: "12В" },
  { id: 5, name: "Петър Николов", grade: "9Б" },
  { id: 6, name: "Анна Георгиева", grade: "10Б" },
];

function SearchInput({ value, onChange }) {
  return (
    <input
      className="search-input"
      type="text"
      value={value}
      placeholder="Търсене по име..."
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function StudentItem({ student }) {
  return (
    <div className="student-item">
      <p className="student-name">{student.name}</p>
      <span className="student-grade">Клас: {student.grade}</span>
    </div>
  );
}

function FilterableStudentList() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.toLowerCase();
  const filtered = students.filter((student) =>
    student.name.toLowerCase().includes(normalizedQuery)
  );

  return (
    <section className="student-panel">
      <h1 className="student-title">Списък с ученици</h1>
      <SearchInput value={query} onChange={setQuery} />

      <div className="student-list">
        {filtered.length === 0
          ? <p className="empty-message">Няма намерени ученици</p>
          : filtered.map((student) => (
              <StudentItem key={student.id} student={student} />
            ))
        }
      </div>
    </section>
  );
}

function App() {
  return (
    <main className="app">
      <FilterableStudentList />
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
