const StudentCard = ({ name, grade, averageScore }) => {
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();

    return (
        <div className="student-card">
            <div className="initials-circle">{initials}</div>
            <div className="student-info">
                <h3>{name}</h3>
                <div className="student-details">
                    Клас: <strong>{grade}</strong> | Успех: <strong>{averageScore}</strong>
                </div>
            </div>
        </div>
    );
};

const App = () => (
    <div style={{ padding: '20px' }}>
        <StudentCard name="Иван Петров" grade="11Б" averageScore={5.67} />
        <StudentCard name="Мария Иванова" grade="11А" averageScore={5.92} />
    </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
