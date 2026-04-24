const { useState } = React;

function getAverage(scores) {
  return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
}

function formatScore(score) {
  return score === 0 ? "-" : score.toFixed(2);
}

function AddStudentForm({ onAdd }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !grade.trim()) {
      return;
    }

    onAdd({
      name: name.trim(),
      grade: grade.trim(),
    });

    setName("");
    setGrade("");
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        className="field"
        type="text"
        value={name}
        placeholder="Име на ученик"
        onChange={(event) => setName(event.target.value)}
      />
      <input
        className="field"
        type="text"
        value={grade}
        placeholder="Клас"
        onChange={(event) => setGrade(event.target.value)}
      />
      <button className="primary-button" type="submit">
        Добави
      </button>
    </form>
  );
}

function StudentRow({ student, onGrade, onDelete }) {
  const average = getAverage(student.scores);
  const scores = student.scores.length ? student.scores.join(", ") : "няма";

  return (
    <tr>
      <td>
        <p className="student-name">{student.name}</p>
        <span className="scores">Оценки: {scores}</span>
      </td>
      <td>{student.grade}</td>
      <td>{formatScore(average)}</td>
      <td>
        <div className="actions">
          <button
            className="secondary-button"
            type="button"
            onClick={() => onGrade(student.id)}
          >
            Постави оценка
          </button>
          <button
            className="danger-button"
            type="button"
            onClick={() => onDelete(student.id)}
          >
            Изтрий
          </button>
        </div>
      </td>
    </tr>
  );
}

function GradeModal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="modal-title">{title}</h2>
        {children}
        <div className="modal-actions">
          <button className="secondary-button" type="button" onClick={onClose}>
            Затвори
          </button>
        </div>
      </div>
    </div>
  );
}

function GradeForm({ student, onSubmit }) {
  const [score, setScore] = useState("6");

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(student.id, Number(score));
  }

  return (
    <form onSubmit={handleSubmit}>
      <select
        className="field"
        value={score}
        onChange={(event) => setScore(event.target.value)}
      >
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </select>
      <div className="modal-actions">
        <button className="primary-button" type="submit">
          Запази оценка
        </button>
      </div>
    </form>
  );
}

function ClassStats({ students }) {
  const allScores = students.flatMap((student) => student.scores);
  const average = getAverage(allScores);
  const highest = allScores.length ? Math.max(...allScores) : 0;
  const lowest = allScores.length ? Math.min(...allScores) : 0;

  return (
    <section className="panel">
      <div className="stats-grid">
        <div className="stat">
          <p className="stat-label">Брой ученици</p>
          <p className="stat-value">{students.length}</p>
        </div>
        <div className="stat">
          <p className="stat-label">Среден успех</p>
          <p className="stat-value">{formatScore(average)}</p>
        </div>
        <div className="stat">
          <p className="stat-label">Най-висока оценка</p>
          <p className="stat-value">{formatScore(highest)}</p>
        </div>
        <div className="stat">
          <p className="stat-label">Най-ниска оценка</p>
          <p className="stat-value">{formatScore(lowest)}</p>
        </div>
      </div>
    </section>
  );
}

function Classroom() {
  const [students, setStudents] = useState([
    { id: 1, name: "Иван Петров", grade: "11Б", scores: [5, 6] },
    { id: 2, name: "Мария Иванова", grade: "11А", scores: [6, 6, 5] },
    { id: 3, name: "Георги Стоянов", grade: "10А", scores: [4, 5] },
  ]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [sortByAverage, setSortByAverage] = useState(false);

  const selectedStudent = students.find((student) => student.id === selectedStudentId);
  const visibleStudents = [...students].sort((first, second) => {
    if (!sortByAverage) {
      return first.id - second.id;
    }

    return getAverage(second.scores) - getAverage(first.scores);
  });

  function handleAddStudent(student) {
    setStudents((currentStudents) => [
      ...currentStudents,
      {
        id: Date.now(),
        name: student.name,
        grade: student.grade,
        scores: [],
      },
    ]);
  }

  function handleAddGrade(studentId, score) {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === studentId
          ? { ...student, scores: [...student.scores, score] }
          : student
      )
    );
    setSelectedStudentId(null);
  }

  function handleDeleteStudent(studentId) {
    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== studentId)
    );
  }

  return (
    <main className="app">
      <div className="classroom">
        <h1 className="page-title">Класна стая</h1>

        <section className="panel">
          <AddStudentForm onAdd={handleAddStudent} />
        </section>

        <section className="panel">
          <div className="toolbar">
            <h2 className="toolbar-title">Ученици</h2>
            <label className="sort-control">
              <input
                type="checkbox"
                checked={sortByAverage}
                onChange={(event) => setSortByAverage(event.target.checked)}
              />
              Сортирай по среден успех
            </label>
          </div>

          {visibleStudents.length === 0 ? (
            <p className="empty-message">Няма добавени ученици</p>
          ) : (
            <table className="student-table">
              <thead>
                <tr>
                  <th>Ученик</th>
                  <th>Клас</th>
                  <th>Среден успех</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibleStudents.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onGrade={setSelectedStudentId}
                    onDelete={handleDeleteStudent}
                  />
                ))}
              </tbody>
            </table>
          )}
        </section>

        <ClassStats students={students} />

        {selectedStudent && (
          <GradeModal
            title={`Оценка за ${selectedStudent.name}`}
            onClose={() => setSelectedStudentId(null)}
          >
            <GradeForm student={selectedStudent} onSubmit={handleAddGrade} />
          </GradeModal>
        )}
      </div>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Classroom />);
