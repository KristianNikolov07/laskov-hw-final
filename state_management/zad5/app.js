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

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (name) => setUser({ name, role: "student" });
  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth трябва да е в AuthProvider!");
  }

  return ctx;
}

const translations = {
  bg: {
    dashboard: "Табло",
    quizzes: "Тестове",
    settings: "Настройки",
    welcome: "Добре дошли",
    login: "Вход",
    logout: "Изход",
    guest: "Гост",
    namePlaceholder: "Име",
  },
  en: {
    dashboard: "Dashboard",
    quizzes: "Quizzes",
    settings: "Settings",
    welcome: "Welcome",
    login: "Login",
    logout: "Logout",
    guest: "Guest",
    namePlaceholder: "Name",
  },
};

const LangContext = createContext();

function LangProvider({ children }) {
  const [lang, setLang] = useState("bg");
  const t = (key) => translations[lang][key] || key;
  const toggleLang = () => setLang((currentLang) => (currentLang === "bg" ? "en" : "bg"));

  return <LangContext.Provider value={{ lang, t, toggleLang }}>{children}</LangContext.Provider>;
}

function useLang() {
  const ctx = useContext(LangContext);

  if (!ctx) {
    throw new Error("useLang трябва да е в LangProvider!");
  }

  return ctx;
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();
  const { lang, t, toggleLang } = useLang();

  return (
    <header className={`header ${theme}`}>
      <h1 className="brand">{t("dashboard")}</h1>
      <div className="header-actions">
        <span className="user-info">{user ? `${user.name} (${user.role})` : t("guest")}</span>
        <button type="button" onClick={toggleTheme}>
          {theme === "light" ? "Dark" : "Light"}
        </button>
        <button type="button" className="secondary" onClick={toggleLang}>
          {lang === "bg" ? "EN" : "BG"}
        </button>
        {user ? (
          <button type="button" className="secondary" onClick={logout}>
            {t("logout")}
          </button>
        ) : (
          <button type="button" className="secondary" onClick={() => login("Alex")}>
            {t("login")}
          </button>
        )}
      </div>
    </header>
  );
}

function Sidebar() {
  const { t } = useLang();
  const { theme } = useTheme();

  return (
    <aside className={`sidebar ${theme}`}>
      <nav aria-label="Dashboard navigation">
        <a className="nav-item">{t("dashboard")}</a>
        <a className="nav-item">{t("quizzes")}</a>
        <a className="nav-item">{t("settings")}</a>
      </nav>
    </aside>
  );
}

function LoginForm() {
  const [name, setName] = useState("");
  const { login } = useAuth();
  const { t } = useLang();

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    login(trimmedName);
    setName("");
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        placeholder={t("namePlaceholder")}
        onChange={(event) => setName(event.target.value)}
      />
      <button type="submit">{t("login")}</button>
    </form>
  );
}

function MainContent() {
  const { user } = useAuth();
  const { t } = useLang();
  const { theme } = useTheme();

  return (
    <main className="main-content">
      <section className={`main-panel ${theme}`}>
        {!user ? (
          <>
            <h2>{t("login")}</h2>
            <LoginForm />
          </>
        ) : (
          <>
            <h2>
              {t("welcome")}, {user.name}
            </h2>
            <div className="dashboard-grid">
              <div className="stat-card">12 {t("quizzes")}</div>
              <div className="stat-card">87% Progress</div>
              <div className="stat-card">{t("settings")}</div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function DashboardShell() {
  const { theme } = useTheme();

  return (
    <div className={`dashboard ${theme}`}>
      <Header />
      <div className="content-layout">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LangProvider>
          <DashboardShell />
        </LangProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
