import React, { useState } from 'react';

const coursesData = [
  { id: 1, title: "React Fundamentals", category: "Frontend", level: "Beginner", rating: 4.8, students: 1200 },
  { id: 2, title: "Node.js API Development", category: "Backend", level: "Intermediate", rating: 4.5, students: 800 },
  { id: 3, title: "Docker & K8s", category: "DevOps", level: "Advanced", rating: 4.9, students: 450 },
  { id: 4, title: "Vue.js Masterclass", category: "Frontend", level: "Intermediate", rating: 4.2, students: 950 },
  { id: 5, title: "Python for Beginners", category: "Backend", level: "Beginner", rating: 4.7, students: 3000 },
  { id: 6, title: "Terraform Infrastructure", category: "DevOps", level: "Advanced", rating: 4.6, students: 300 },
  { id: 7, title: "Next.js 14", category: "Frontend", level: "Advanced", rating: 5.0, students: 1500 },
  { id: 8, title: "Express.js Deep Dive", category: "Backend", level: "Intermediate", rating: 4.4, students: 700 },
];

function SearchBar({ value, onChange }) {
  return (
    <div style={styles.searchBox}>
      <input 
        style={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search course by title..." 
      />
    </div>
  );
}

function FilterPanel({ category, level, onCategoryChange, onLevelChange, onClear }) {
  return (
    <div style={styles.filterRow}>
      <select style={styles.select} value={category} onChange={e => onCategoryChange(e.target.value)}>
        <option value="all">All Categories</option>
        <option value="Frontend">Frontend</option>
        <option value="Backend">Backend</option>
        <option value="DevOps">DevOps</option>
      </select>

      <select style={styles.select} value={level} onChange={e => onLevelChange(e.target.value)}>
        <option value="all">All Levels</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <button style={styles.clearBtn} onClick={onClear}>Clear Filters</button>
    </div>
  );
}

function SortControls({ activeSort, onSortChange }) {
  const options = [
    { key: 'rating', label: 'Rating' },
    { key: 'students', label: 'Students' }
  ];

  return (
    <div style={styles.sortRow}>
      <span>Sort by: </span>
      {options.map(opt => (
        <button 
          key={opt.key}
          style={activeSort === opt.key ? styles.activeSort : styles.sortBtn}
          onClick={() => onSortChange(opt.key)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function CourseCard({ course }) {
  const levelColors = {
    "Beginner": "#28a745",
    "Intermediate": "#ffc107",
    "Advanced": "#dc3545",
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={{ ...styles.badge, backgroundColor: levelColors[course.level] }}>
          {course.level}
        </span>
        {course.rating >= 4.7 && <span style={styles.topRated}>⭐ Top Rated</span>}
      </div>
      <h3 style={styles.title}>{course.title}</h3>
      <p style={styles.category}>{course.category}</p>
      <div style={styles.stats}>
        <span>📊 {course.rating} Rating</span>
        <span>👥 {course.students} Students</span>
      </div>
    </div>
  );
}

function StatsBar({ children }) {
  return <div style={styles.statsBar}>{children}</div>;
}

export default function CourseCatalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const handleClear = () => {
    setSearch("");
    setCategory("all");
    setLevel("all");
  };

  const filtered = coursesData
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    .filter(c => category === "all" || c.category === category)
    .filter(c => level === "all" || c.level === level)
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const avgRating = filtered.length > 0
    ? (filtered.reduce((sum, c) => sum + c.rating, 0) / filtered.length).toFixed(1)
    : 0;

  const totalStudents = filtered.reduce((sum, c) => sum + c.students, 0);

  return (
    <div style={styles.container}>
      <h2>Course Catalog</h2>
      
      <SearchBar value={search} onChange={setSearch} />
      
      <FilterPanel 
        category={category} 
        level={level} 
        onCategoryChange={setCategory} 
        onLevelChange={setLevel} 
        onClear={handleClear} 
      />

      <SortControls activeSort={sortBy} onSortChange={setSortBy} />

      <StatsBar>
        <span>Courses: <strong>{filtered.length}</strong></span>
        <span>Avg Rating: <strong>{avgRating}</strong></span>
        <span>Total Students: <strong>{totalStudents.toLocaleString()}</strong></span>
      </StatsBar>

      <div style={styles.grid}>
        {filtered.length === 0 ? (
          <p style={styles.empty}>No courses found matching your criteria.</p>
        ) : (
          filtered.map(course => (
            <CourseCard key={course.id} course={course} />
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
  searchBox: { marginBottom: '15px' },
  input: { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  filterRow: { display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' },
  select: { padding: '8px', borderRadius: '5px' },
  clearBtn: { padding: '8px 12px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  sortRow: { marginBottom: '20px' },
  sortBtn: { padding: '5px 15px', marginRight: '10px', cursor: 'pointer', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '20px' },
  activeSort: { padding: '5px 15px', marginRight: '10px', cursor: 'pointer', background: '#007bff', color: '#fff', border: '1px solid #007bff', borderRadius: '20px' },
  statsBar: { display: 'flex', justifyContent: 'space-around', background: '#e9ecef', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: { border: '1px solid #eee', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', background: '#fff' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  badge: { padding: '3px 8px', borderRadius: '4px', color: '#fff', fontSize: '12px', fontWeight: 'bold' },
  topRated: { color: '#d97706', fontSize: '13px', fontWeight: 'bold' },
  title: { margin: '10px 0 5px 0', fontSize: '18px' },
  category: { color: '#666', fontSize: '14px', marginBottom: '15px' },
  stats: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#444', borderTop: '1px solid #f4f4f4', paddingTop: '10px' },
  empty: { gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888' }
};
