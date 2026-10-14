import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseCard } from '../components/ui.jsx';
import { COURSES } from '../data/courses.js';
import { useAuth } from '../store/auth.jsx';
import { Layout } from './Student.jsx';

export default function Catalog() {
  const nav = useNavigate();
  const { user, enrollments, enroll } = useAuth();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [mode, setMode] = useState('All');
  const cats = ['All', ...new Set(COURSES.map((c) => c.category))];
  const openCourse = (c) => {
    const owned = enrollments.some((e) => e.courseId === c.id);
    if (owned) return nav('/learn/' + c.id);
    if (c.free) {
      if (!user) return nav('/signup');
      enroll(c.id, { mode: 'free', amount: 0 });
      return nav('/learn/' + c.id);
    }
    if (!user) return nav('/login');
    nav('/checkout/' + c.id);
  };
  const list = useMemo(() => COURSES.filter((c) =>
    (cat === 'All' || c.category === cat) &&
    (mode === 'All' || (mode === 'Free' ? c.free : !c.free)) &&
    (c.title + c.instructor).toLowerCase().includes(q.toLowerCase())
  ), [q, cat, mode]);
  return (
    <Layout title="Browse Courses" sub="Free and paid tracks. Enroll, watch lessons, earn certificates." active="/courses">
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
        <input className="dsearch" style={{ marginLeft: 0 }} placeholder="Search courses, mentors..." value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="tabs" style={{ margin: 0 }}>{['All', 'Free', 'Paid'].map((m) => <button key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>{m}</button>)}</div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {cats.map((c) => <button key={c} onClick={() => setCat(c)} className="btn btn-sm" style={{ background: cat === c ? '#10130A' : '#fff', color: cat === c ? '#fff' : '#10130A', border: '1px solid #E3E3D6' }}>{c}</button>)}
      </div>
      <div className="grid-cards">{list.map((c) => <CourseCard key={c.id} c={c} onOpen={() => openCourse(c)} />)}</div>
      {list.length === 0 && <p style={{ marginTop: 20 }}>No courses match your filters.</p>}
    </Layout>
  );
}
