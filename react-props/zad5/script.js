const { useState } = React;

function Tabs({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = React.Children.toArray(children);

  return (
    <div className="tabs">
      <div className="tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={tab.props.label}
            className={`tab-button ${activeIndex === index ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>

      <div className="tab-content">{tabs[activeIndex].props.children}</div>
    </div>
  );
}

function Tab({ children }) {
  return children;
}

function App() {
  return (
    <main className="app">
      <Tabs>
        <Tab label="Профил">
          <p>Име: Иван Петров</p>
          <p>Клас: 11Б</p>
        </Tab>

        <Tab label="Оценки">
          <ul>
            <li>Математика: 5.50</li>
            <li>Физика: 6.00</li>
          </ul>
        </Tab>

        <Tab label="Настройки">
          <button className="change-password">Промени парола</button>
        </Tab>
      </Tabs>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
