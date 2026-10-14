import { createContext, useContext, useEffect, useState } from 'react';

const KEY = 'papersky_lms_auth_v1';
const ENROLL_KEY = 'papersky_lms_enroll_v1';
const PROG_KEY = 'papersky_lms_progress_v1';
const VISIT_KEY = 'papersky_lms_visits_v1';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

// Shared visit logger so admin panel can read website activity (same-origin demo; isolated keys in prod via Supabase)
export function logVisit(type, detail) {
  try {
    const arr = JSON.parse(localStorage.getItem(VISIT_KEY) || '[]');
    arr.unshift({ id: Date.now() + Math.random().toString(16).slice(2), type, detail: detail || '', at: new Date().toISOString() });
    localStorage.setItem(VISIT_KEY, JSON.stringify(arr.slice(0, 300)));
    // mirror keys for admin app to read
    localStorage.setItem('papersky_admin_visits_mirror', JSON.stringify(arr.slice(0, 300)));
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem(KEY) || 'null'));
      setEnrollments(JSON.parse(localStorage.getItem(ENROLL_KEY) || '[]'));
      setProgress(JSON.parse(localStorage.getItem(PROG_KEY) || '{}'));
    } catch {}
    logVisit('visit', window.location.pathname);
  }, []);

  const persistEnroll = (e) => { setEnrollments(e); localStorage.setItem(ENROLL_KEY, JSON.stringify(e)); };
  const persistProg = (p) => { setProgress(p); localStorage.setItem(PROG_KEY, JSON.stringify(p)); };

  const toSession = (u) => ({ id: u.id, name: u.name, email: u.email, avatar: u.avatar || u.name.charAt(0).toUpperCase(), mobile: u.mobile || '', gender: u.gender || '', subtitle: u.subtitle || '' });

  const signup = (nameOrProfile, email, password) => {
    const users = JSON.parse(localStorage.getItem('papersky_lms_users') || '[]');
    const p = typeof nameOrProfile === 'object' ? nameOrProfile : { name: nameOrProfile, email, password };
    if (!p.name || !p.email || !p.password) throw new Error('Please fill name, email and password.');
    if (users.find((u) => u.email === p.email)) throw new Error('An account with this email already exists.');
    const u = { id: 'u_' + Date.now(), name: p.name, email: p.email, mobile: p.mobile || '', gender: p.gender || '', subtitle: p.subtitle || '', avatar: p.avatar || p.name.charAt(0).toUpperCase(), password: p.password, createdAt: new Date().toISOString() };
    users.push(u); localStorage.setItem('papersky_lms_users', JSON.stringify(users));
    const session = toSession(u);
    setUser(session); localStorage.setItem(KEY, JSON.stringify(session));
    logVisit('signup', p.email); logVisit('login', p.email);
    return session;
  };
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('papersky_lms_users') || '[]');
    const u = users.find((x) => x.email === email && x.password === password);
    if (!u) throw new Error('Invalid email or password. Try demo: student@learnloop.io / learn123');
    const session = toSession(u);
    setUser(session); localStorage.setItem(KEY, JSON.stringify(session));
    logVisit('login', email);
    return session;
  };
  const updateProfile = (patch) => {
    const users = JSON.parse(localStorage.getItem('papersky_lms_users') || '[]');
    const i = users.findIndex((x) => x.id === user?.id);
    if (i >= 0) { users[i] = { ...users[i], ...patch }; localStorage.setItem('papersky_lms_users', JSON.stringify(users)); }
    const s = { ...user, ...patch };
    setUser(s); localStorage.setItem(KEY, JSON.stringify(s));
    return s;
  };
  const logout = () => { setUser(null); localStorage.removeItem(KEY); };
  const enroll = (courseId, payment) => {
    if (enrollments.find((e) => e.courseId === courseId)) return;
    const e = { courseId, at: new Date().toISOString(), payment: payment || { mode: 'free', amount: 0 } };
    const next = [...enrollments, e]; persistEnroll(next);
    logVisit('purchase', courseId + ' | ' + (payment?.amount || 0));
  };
  const markLesson = (courseId, lessonKey) => {
    const cur = progress[courseId] || [];
    const next = cur.includes(lessonKey) ? cur : [...cur, lessonKey];
    persistProg({ ...progress, [courseId]: next });
  };

  return <AuthCtx.Provider value={{ user, enrollments, progress, signup, login, logout, enroll, markLesson, updateProfile }}>{children}</AuthCtx.Provider>;
}
