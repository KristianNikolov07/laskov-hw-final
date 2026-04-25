const { useRef, useState, useSyncExternalStore } = React;
const createStore = zustandVanilla.createStore || zustandVanilla.default || zustandVanilla;

function create(createState) {
  const store = createStore(createState);

  function useBoundStore(selector = store.getState) {
    const lastSnapshot = useRef();
    const lastSelection = useRef();

    return useSyncExternalStore(store.subscribe, () => {
      const snapshot = store.getState();

      if (lastSnapshot.current === snapshot) {
        return lastSelection.current;
      }

      lastSnapshot.current = snapshot;
      lastSelection.current = selector(snapshot);
      return lastSelection.current;
    });
  }

  useBoundStore.getState = store.getState;
  useBoundStore.setState = store.setState;
  useBoundStore.subscribe = store.subscribe;

  return useBoundStore;
}

const useTodoStore = create((set, get) => ({
  todos: [
    { id: 1, text: "Научи useReducer", done: true },
    { id: 2, text: "Научи Context API", done: true },
    { id: 3, text: "Научи Zustand", done: false },
    { id: 4, text: "Направи проект", done: false },
  ],
  filter: "all",
  searchQuery: "",

  addTodo: (text) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now(), text, done: false }],
    })),

  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
    })),

  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),

  setFilter: (filter) => set({ filter }),
  setSearch: (searchQuery) => set({ searchQuery }),

  getFilteredTodos: () => {
    const { todos, filter, searchQuery } = get();
    const normalizedQuery = searchQuery.toLowerCase();

    return todos.filter((todo) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !todo.done) ||
        (filter === "completed" && todo.done);
      const matchesSearch = todo.text.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });
  },

  getStats: () => {
    const { todos } = get();
    const done = todos.filter((todo) => todo.done).length;

    return {
      total: todos.length,
      done,
      remaining: todos.length - done,
    };
  },
}));

function AddTodoForm() {
  const [text, setText] = useState("");
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedText = text.trim();

    if (trimmedText) {
      addTodo(trimmedText);
      setText("");
    }
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        placeholder="Нова задача"
        onChange={(event) => setText(event.target.value)}
      />
      <button type="submit">Добави</button>
    </form>
  );
}

function SearchInput() {
  const searchQuery = useTodoStore((state) => state.searchQuery);
  const setSearch = useTodoStore((state) => state.setSearch);

  return (
    <div className="search-row">
      <input
        type="search"
        value={searchQuery}
        placeholder="Търси задача"
        onChange={(event) => setSearch(event.target.value)}
      />
    </div>
  );
}

function FilterButtons() {
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);
  const filters = [
    { value: "all", label: "Всички" },
    { value: "active", label: "Активни" },
    { value: "completed", label: "Завършени" },
  ];

  return (
    <div className="filters">
      {filters.map((item) => (
        <button
          key={item.value}
          type="button"
          className={filter === item.value ? "active" : ""}
          onClick={() => setFilter(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function TodoItem({ todo }) {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  return (
    <li className="todo-item">
      <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
      <span className={`todo-text ${todo.done ? "done" : ""}`}>{todo.text}</span>
      <button type="button" className="delete-button" onClick={() => deleteTodo(todo.id)}>
        Изтрий
      </button>
    </li>
  );
}

function TodoList() {
  const todos = useTodoStore((state) => state.getFilteredTodos());

  if (todos.length === 0) {
    return <div className="empty-state">Няма намерени задачи.</div>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function Stats() {
  const stats = useTodoStore((state) => state.getStats());
  const percent = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);

  return (
    <section className="stats">
      <strong>
        {stats.done} от {stats.total} завършени ({percent}%)
      </strong>
      <span>Остават: {stats.remaining}</span>
      <div className="progress" aria-label="Progress">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </section>
  );
}

function TodoApp() {
  return (
    <section className="todo-app">
      <div className="card">
        <h1>Zustand Todo</h1>
        <AddTodoForm />
        <SearchInput />
        <FilterButtons />
        <TodoList />
        <Stats />
      </div>
    </section>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<TodoApp />);
