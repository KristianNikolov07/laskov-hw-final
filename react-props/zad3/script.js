const { useState } = React;

function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="accordion">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isOpen: openIndex === index,
          onToggle: () => setOpenIndex(openIndex === index ? null : index),
        })
      )}
    </div>
  );
}

function AccordionItem({ title, isOpen, onToggle, children }) {
  return (
    <div className="accordion-item">
      <button className="accordion-title" onClick={onToggle}>
        <span>{title}</span>
        <span className="accordion-arrow">{isOpen ? "-" : "+"}</span>
      </button>

      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
}

function App() {
  return (
    <main className="app">
      <Accordion>
        <AccordionItem title="Какво е React?">
          <p>React е JavaScript библиотека за изграждане на потребителски интерфейси.</p>
        </AccordionItem>

        <AccordionItem title="Какво е компонент?">
          <p>Компонентът е преизползваем блок, който може да получава props и да връща JSX.</p>
        </AccordionItem>

        <AccordionItem title="Какво е JSX?">
          <p>JSX е синтактично разширение, което позволява да пишем HTML-подобен код в JavaScript.</p>
        </AccordionItem>
      </Accordion>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
