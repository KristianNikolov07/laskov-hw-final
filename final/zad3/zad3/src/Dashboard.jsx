import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = "https://jsonplaceholder.typicode.com";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [results, setResults] = useState({
    users: { data: [], status: 'idle', error: null },
    posts: { data: [], status: 'idle', error: null },
    comments: { data: [], status: 'idle', error: null }
  });

  const fetchData = async (endpoint) => {
    const response = await fetch(API_BASE + endpoint);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  const loadDashboard = useCallback(async () => {
    const startTime = Date.now();
    setLoading(true);
    
    const resetState = (status) => ({ data: [], status, error: null });
    setResults({ users: resetState('loading'), posts: resetState('loading'), comments: resetState('loading') });

    try {
      const [users, posts, comments] = await Promise.all([
        fetchData("/users"),
        fetchData("/posts?_limit=10"),
        fetchData("/comments?_limit=20"),
      ]);

      setResults({
        users: { data: users, status: 'success', error: null },
        posts: { data: posts, status: 'success', error: null },
        comments: { data: comments, status: 'success', error: null }
      });
    } catch (error) {
      console.warn("Promise.all failed, falling back to allSettled");
      
      const outcomes = await Promise.allSettled([
        fetchData("/users"),
        fetchData("/posts?_limit=10"),
        fetchData("/comments?_limit=20"),
      ]);

      const keys = ['users', 'posts', 'comments'];
      const newResults = {};

      outcomes.forEach((outcome, index) => {
        const key = keys[index];
        if (outcome.status === 'fulfilled') {
          newResults[key] = { data: outcome.value, status: 'success', error: null };
        } else {
          newResults[key] = { data: [], status: 'error', error: outcome.reason.message };
        }
      });

      setResults(newResults);
    } finally {
      setTime(Date.now() - startTime);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const avgComments = results.posts.data.length > 0 
    ? (results.comments.data.reduce((acc) => acc + 1, 0) / results.posts.data.length).toFixed(2)
    : 0;

  return (
    <div style={styles.container}>
      <h1>React API Dashboard</h1>

      <div style={styles.statsBar}>
        <StatItem label="Потребители" value={results.users.data.length} />
        <StatItem label="Ср. коментари / пост" value={avgComments} />
        <StatItem label="Време (ms)" value={time} />
        <button style={styles.button} onClick={loadDashboard} disabled={loading}>
          {loading ? "Зареждане..." : "Презареди"}
        </button>
      </div>

      <div style={styles.grid}>
        <ApiCard title="Потребители" state={results.users} />
        <ApiCard title="Постове" state={results.posts} />
        <ApiCard title="Коментари" state={results.comments} />
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
  <div style={styles.statItem}>
    <span style={styles.statValue}>{value}</span>
    <small>{label}</small>
  </div>
);

const ApiCard = ({ title, state }) => (
  <div style={styles.card}>
    <h3>{title}</h3>
    <span style={{ ...styles.status, ...styles[state.status] }}>
      {state.status === 'loading' && "Зарежда се..."}
      {state.status === 'success' && "Заредено"}
      {state.status === 'error' && `Грешка: ${state.error}`}
    </span>
    <div style={styles.content}>
      {state.data.length > 0 ? (
        <pre style={styles.pre}>{JSON.stringify(state.data, null, 2)}</pre>
      ) : (
        <p>Няма налични данни.</p>
      )}
    </div>
  </div>
);

const styles = {
  container: { padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' },
  statsBar: { display: 'flex', alignItems: 'center', gap: '20px', background: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  statItem: { textAlign: 'center', flex: 1 },
  statValue: { display: 'block', fontSize: '1.4rem', fontWeight: 'bold' },
  button: { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: { background: '#fff', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  status: { padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' },
  loading: { backgroundColor: '#fff3cd', color: '#856404' },
  success: { backgroundColor: '#d4edda', color: '#155724' },
  error: { backgroundColor: '#f8d7da', color: '#721c24' },
  content: { marginTop: '10px', height: '200px', overflowY: 'auto' },
  pre: { fontSize: '0.75rem', background: '#f8f9fa', padding: '10px' }
};

export default Dashboard;
