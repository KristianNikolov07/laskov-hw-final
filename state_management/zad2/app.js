const { createContext, useContext, useState } = React;

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme трябва да е в ThemeProvider!");
  }

  return ctx;
}

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`site-header ${theme}`}>
      <h1 className="site-title">Quiz система</h1>
      <button type="button" className="theme-button" onClick={toggleTheme}>
        {theme === "light" ? "Тъмна тема" : "Светла тема"}
      </button>
    </header>
  );
}

function QuizCard({ title, questions }) {
  const { theme } = useTheme();

  return (
    <article className={`quiz-card ${theme}`}>
      <h2>{title}</h2>
      <p>
        <span className="question-count">{questions}</span>
        въпроса
      </p>
    </article>
  );
}

function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={`site-footer ${theme}`}>
      Текуща тема: {theme === "light" ? "светла" : "тъмна"}
    </footer>
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className={`app-shell ${theme}`}>
      <Header />
      <section className="quiz-grid" aria-label="Списък с quiz карти">
        <QuizCard title="HTML" questions={32} />
        <QuizCard title="CSS" questions={32} />
        <QuizCard title="JavaScript" questions={40} />
      </section>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
