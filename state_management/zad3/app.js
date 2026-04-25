const { createContext, useContext, useReducer } = React;

function notificationReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        { id: action.id, type: action.notifType, message: action.message },
      ];
    case "REMOVE":
      return state.filter((notification) => notification.id !== action.id);
    case "CLEAR_ALL":
      return [];
    default:
      return state;
  }
}

const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  const removeNotification = (id) => dispatch({ type: "REMOVE", id });

  const addNotification = (type, message) => {
    const id = Date.now() + Math.random();

    dispatch({ type: "ADD", id, notifType: type, message });
    setTimeout(() => removeNotification(id), 5000);
  };

  const clearAll = () => dispatch({ type: "CLEAR_ALL" });

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

function useNotifications() {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error("Трябва NotificationProvider!");
  }

  return ctx;
}

function NotificationCount() {
  const { notifications } = useNotifications();

  return <span className="badge">{notifications.length}</span>;
}

function AddNotificationPanel() {
  const { addNotification } = useNotifications();

  return (
    <section className="panel" aria-label="Добавяне на известия">
      <button
        type="button"
        className="success-button"
        onClick={() => addNotification("success", "Операцията е успешна!")}
      >
        Успех
      </button>
      <button
        type="button"
        className="error-button"
        onClick={() => addNotification("error", "Нещо се обърка!")}
      >
        Грешка
      </button>
      <button
        type="button"
        className="warning-button"
        onClick={() => addNotification("warning", "Внимавайте!")}
      >
        Внимание
      </button>
    </section>
  );
}

function NotificationList() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return <div className="empty-state">Няма известия.</div>;
  }

  return (
    <ul className="notification-list">
      {notifications.map((notification) => (
        <li key={notification.id} className={`notification ${notification.type}`}>
          <div>
            <span className="notification-type">{notification.type}</span>
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            className="remove-button"
            aria-label="Премахни известие"
            onClick={() => removeNotification(notification.id)}
          >
            X
          </button>
        </li>
      ))}
    </ul>
  );
}

function ClearAllButton() {
  const { notifications, clearAll } = useNotifications();
  const isDisabled = notifications.length === 0;

  return (
    <button type="button" className="clear-button" onClick={clearAll} disabled={isDisabled}>
      Изчисти всички
    </button>
  );
}

function NotificationsApp() {
  return (
    <NotificationProvider>
      <section className="app-card">
        <div className="top-row">
          <h1>Известия</h1>
          <NotificationCount />
        </div>
        <AddNotificationPanel />
        <NotificationList />
        <ClearAllButton />
      </section>
    </NotificationProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<NotificationsApp />);
