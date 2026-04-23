// ── Persistence ──────────────────────────────────────────────────────────────

function loadTodos() {
  const saved = localStorage.getItem("todos");
  return saved ? JSON.parse(saved) : [];
}

function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ── State ─────────────────────────────────────────────────────────────────────

let todos = loadTodos();
let filter = "all"; // "all" | "active" | "completed"

// ── Render ────────────────────────────────────────────────────────────────────

function renderTodos() {
  const list = document.querySelector("#todo-list");
  list.innerHTML = "";

  const filtered = todos.filter((todo) => {
    if (filter === "active")    return !todo.completed;
    if (filter === "completed") return  todo.completed;
    return true;
  });

  filtered.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " completed" : "");
    li.dataset.id = todo.id;

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", "Отбележи като завършена");

    // Text
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("aria-label", "Изтрий задача");

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  // Counter — always counts over the full todos array, not the filtered view
  const done = todos.filter((t) => t.completed).length;
  document.querySelector("#counter").textContent =
    done + " от " + todos.length + " задачи завършени";
}

// ── Event Delegation — ONE listener on #todo-list ─────────────────────────────
//
// Event bubbling: click на checkbox/button "се качва" нагоре до #todo-list.
// e.target.closest(".todo-item") връща родителския <li>, дори ако кликът е
// върху span вътре в него.

document.querySelector("#todo-list").addEventListener("click", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li) return;

  const id = Number(li.dataset.id);

  if (e.target.type === "checkbox") {
    todos = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTodos(todos);
    renderTodos();
    return;
  }

  if (e.target.classList.contains("delete-btn")) {
    todos = todos.filter((t) => t.id !== id);
    saveTodos(todos);
    renderTodos();
  }
});

// ── Add todo ──────────────────────────────────────────────────────────────────

function addTodo() {
  const input = document.querySelector("#todo-input");
  const errorEl = document.querySelector("#error");
  const text = input.value.trim();

  if (!text) {
    errorEl.textContent = "Въведете задача!";
    input.focus();
    return;
  }

  errorEl.textContent = "";
  todos.push({ id: Date.now(), text, completed: false });
  saveTodos(todos);
  input.value = "";
  renderTodos();
}

document.querySelector("#add-btn").addEventListener("click", addTodo);

// Enter за изпращане
document.querySelector("#todo-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

// ── Filter buttons ────────────────────────────────────────────────────────────

document.querySelector(".filter-row").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  filter = btn.dataset.filter;

  document.querySelectorAll(".filter-btn").forEach((b) =>
    b.classList.toggle("active", b === btn)
  );

  renderTodos();
});

// ── Init ──────────────────────────────────────────────────────────────────────

renderTodos();
