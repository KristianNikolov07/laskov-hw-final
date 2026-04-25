const { useReducer } = React;

const initialState = {
  count: 0,
  history: [],
};

const actionLabels = {
  INCREMENT: "+1",
  DECREMENT: "-1",
  RESET: "Reset",
};

function getActionLabel(action) {
  return action.type === "INCREMENT_BY" ? `+${action.payload}` : actionLabels[action.type] || action.type;
}

function updateCount(state, action, count) {
  return {
    count,
    history: [...state.history, { action: getActionLabel(action), result: count }],
  };
}

function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return updateCount(state, action, state.count + 1);
    case "DECREMENT":
      return updateCount(state, action, state.count - 1);
    case "RESET":
      return updateCount(state, action, 0);
    case "INCREMENT_BY":
      return updateCount(state, action, state.count + action.payload);
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <section className="counter-card" aria-labelledby="counter-title">
      <h1 id="counter-title" className="counter-title">
        useReducer брояч
      </h1>

      <div className="counter-value">
        <span className="counter-label">Текуща стойност</span>
        <span className="counter-number">{state.count}</span>
      </div>

      <div className="button-row">
        <button type="button" onClick={() => dispatch({ type: "INCREMENT" })}>
          +1
        </button>
        <button type="button" onClick={() => dispatch({ type: "DECREMENT" })}>
          -1
        </button>
        <button type="button" onClick={() => dispatch({ type: "INCREMENT_BY", payload: 10 })}>
          +10
        </button>
        <button type="button" className="reset-button" onClick={() => dispatch({ type: "RESET" })}>
          Reset
        </button>
      </div>

      <div className="history-header">
        <h2>История на действията</h2>
        <span className="history-count">{state.history.length} действия</span>
      </div>

      {state.history.length === 0 ? (
        <div className="history-empty">Все още няма действия.</div>
      ) : (
        <ul className="history-list">
          {state.history.map((entry, index) => (
            <li key={`${entry.action}-${index}`}>
              <span className="history-action">
                {index + 1}. {entry.action}
              </span>
              <span className="history-result">Резултат: {entry.result}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Counter />);
