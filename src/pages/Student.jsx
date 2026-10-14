import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.jsx';
import { COURSES, TESTS } from '../data/courses.js';
import '../dash.css';

const isImg = (a) => typeof a === 'string' && a.startsWith('data:');
const Av = ({ user, size = 40 }) => (
  <span className="av" style={{ width: size, height: size, fontSize: size / 2.2, borderRadius: '50%', display: 'grid', placeItems: 'center', overflow: 'hidden', flexShrink: 0, background: '#0C0E07', color: '#fff' }}>
    {isImg(user?.avatar) ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user?.avatar || user?.name?.charAt(0) || 'S')}
  </span>
);

const getScores = () => { try { return JSON.parse(localStorage.getItem('papersky_test_scores') || '{}'); } catch { return {}; } };
const getAttempts = () => { try { return JSON.parse(localStorage.getItem('papersky_test_attempts') || '[]'); } catch { return []; } };

export function Layout({ title, sub, active, children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('papersky_dash_theme') || 'light');
  const [q, setQ] = useState('');
  const flip = () => { const t = theme === 'light' ? 'dark' : 'light'; setTheme(t); localStorage.setItem('papersky_dash_theme', t); };
  const items = [
    ['/dashboard', 'Dashboard', '◍'], ['/courses', 'Browse Courses', '▦'],
    ['/tests', 'Tests & Quizzes', '✎'], ['/notes', 'My Notes', '✉'], ['/profile', 'Profile', '◉'],
  ];
  return (
    <div className={`dshell ${theme}`}>
      <aside className="dside">
        <div className="dlogo"><span className="mk">L</span> LearnLoop</div>
        <div className="dsec">LEARN</div>
        {items.map(([h, l, ic]) => (
          <button key={h} className={'dlink' + (active === h ? ' on' : '')} onClick={() => nav(h)}><span className="ic">{ic}</span>{l}</button>
        ))}
        <div className="duser">
          <Av user={user} />
          <div style={{ minWidth: 0 }}><b style={{ fontSize: 13, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</b><span style={{ fontSize: 11, color: 'var(--dmut)' }}>{user?.subtitle || 'Student'}</span></div>
        </div>
        <button className="dlink" style={{ marginTop: 8 }} onClick={() => { logout(); nav('/'); }}><span className="ic">→</span>Logout</button>
      </aside>
      <div className="dmain">
        <div className="dtop">
          <div><h1>{title}</h1><p>{sub}</p></div>
          <input className="dsearch" placeholder="Search lessons, tests, notes..." value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="diconbtn" title="Toggle light / dark" onClick={flip}>{theme === 'light' ? '◑' : '☀'}</button>
          <span className="dav">{isImg(user?.avatar) ? <img src={user.avatar} alt="" /> : (user?.avatar || 'S')}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function TestModal({ test, onClose }) {
  const [i, setI] = useState(0);
  const [ans, setAns] = useState({});
  const [done, setDone] = useState(null);
  const totalSecs = useMemo(() => {
    const m = parseInt(test.duration, 10);
    return Number.isFinite(m) && m > 0 ? m * 60 : 0;
  }, [test]);
  const [left, setLeft] = useState(totalSecs);
  const submitRef = useRef(null);
  const submit = () => {
    let c = 0;
    test.questions.forEach((qq, qi) => { if (ans[qi] === qq.ans) c++; });
    const pct = Math.round((c / test.questions.length) * 100);
    const s = getScores();
    s[test.id] = Math.max(s[test.id] || 0, pct);
    localStorage.setItem('papersky_test_scores', JSON.stringify(s));
    try {
      const h = getAttempts();
      h.unshift({ id: test.id, at: new Date().toISOString(), pct, correct: c, total: test.questions.length });
      localStorage.setItem('papersky_test_attempts', JSON.stringify(h.slice(0, 50)));
    } catch {}
    setDone({ c, pct });
  };
  submitRef.current = submit;
  useEffect(() => {
    if (done || !totalSecs) return;
    setLeft(totalSecs);
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) { clearInterval(t); submitRef.current(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [test.id, done, totalSecs]);
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const cur = test.questions[i];
  return (
    <div className="dmodal" onClick={onClose}>
      <div className="box" onClick={(e) => e.stopPropagation()}>
        {!done ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <b>{test.title}</b>
              <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {totalSecs > 0 && !done && <span className={'tchip' + (left < 60 ? ' low' : '')}>⏱ {mm}:{ss}</span>}
                <span style={{ fontSize: 12, color: '#777' }}>Q{i + 1} / {test.questions.length}</span>
              </span>
            </div>
            <div className="pbar" style={{ background: '#EDEDE3' }}><i style={{ width: `${((i + 1) / test.questions.length) * 100}%` }} /></div>
            <h3 style={{ fontSize: 18, marginTop: 16 }}>{cur.q}</h3>
            {cur.opts.map((o, oi) => <button key={oi} className={'opt' + (ans[i] === oi ? ' sel' : '')} onClick={() => setAns({ ...ans, [i]: oi })}>{String.fromCharCode(65 + oi)}. {o}</button>)}
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button className="dbtn line" disabled={i === 0} onClick={() => setI(i - 1)}>← Back</button>
              {i < test.questions.length - 1
                ? <button className="dbtn dark" style={{ flex: 1 }} onClick={() => setI(i + 1)}>Next →</button>
                : <button className="dbtn dark" style={{ flex: 1 }} onClick={submit}>Submit test</button>}
            </div>
            <button className="dbtn line" style={{ width: '100%', marginTop: 10 }} onClick={onClose}>Exit</button>
          </>
        ) : (
          <>
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: 52, fontWeight: 800 }}>{done.pct}%</div>
            <b>{done.pct >= 80 ? 'Excellent work.' : done.pct >= 60 ? 'Good — keep revising.' : 'Needs revision — retake soon.'}</b>
            <p style={{ color: '#777', fontSize: 13, marginTop: 6 }}>You answered {done.c} of {test.questions.length} correctly. Best score saved.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}><button className="dbtn line" style={{ flex: 1 }} onClick={onClose}>Close</button><button className="dbtn dark" style={{ flex: 1 }} onClick={() => { setDone(null); setAns({}); setI(0); }}>Retake</button></div>
          </div>
          <div className="revlist">
            {test.questions.map((qq, qi) => (
              <div key={qi} className="revq">
                <b>Q{qi + 1}. {qq.q}</b>
                {qq.opts.map((o, oi) => (
                  <div key={oi} className={'ropt' + (oi === qq.ans ? ' right' : oi === ans[qi] ? ' wrong' : '')}>
                    {String.fromCharCode(65 + oi)}. {o} {oi === qq.ans ? '✓' : oi === ans[qi] ? '✗' : ''}
                  </div>
                ))}
                {ans[qi] == null && <span className="unans">Not answered</span>}
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
}

export function Dashboard() {
  const { user, enrollments, progress, enroll } = useAuth();
  const nav = useNavigate();
  const [activeTest, setActiveTest] = useState(null);
  const scores = getScores();
  const attempts = getAttempts();
  const mine = enrollments.map((e) => ({ ...e, c: COURSES.find((c) => c.id === e.courseId) })).filter((x) => x.c);
  const totalLessons = (c) => c.curriculum.reduce((a, m) => a + m.items.length, 0);
  const doneCount = (c) => progress[c.id]?.length || 0;
  const pct = (c) => Math.round((doneCount(c) / totalLessons(c)) * 100);
  const hours = (mine.reduce((a, x) => a + doneCount(x.c), 0) * 0.45).toFixed(1);
  const certs = mine.filter((x) => pct(x.c) === 100).length;
  const avgProg = mine.length ? Math.round(mine.reduce((a, x) => a + pct(x.c), 0) / mine.length) : 0;
  const testAvg = Object.keys(scores).length ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length) : 0;
  const week = useMemo(() => ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => ({ d, h: 25 + ((doneCount(mine[0]?.c || { id: '' }) * 13 + i * 29) % 75) })), [progress]);
  const myTests = TESTS.filter((t) => mine.some((m) => m.courseId === t.courseId));
  const upcoming = (myTests.length ? myTests : TESTS.slice(0, 2)).slice(0, 4);
  const notes = useMemo(() => {
    const out = [];
    try {
      for (let k = 0; k < localStorage.length; k++) {
        const key = localStorage.key(k);
        if (key?.startsWith('papersky_lesson_notes_')) {
          const cid = key.replace('papersky_lesson_notes_', '');
          const obj = JSON.parse(localStorage.getItem(key));
          Object.entries(obj).forEach(([lk, v]) => v && out.push({ course: COURSES.find((c) => c.id === cid)?.title || cid, text: v }));
        }
      }
    } catch {}
    return out.slice(-3).reverse();
  }, [progress]);
  const resume = mine.slice().sort((a, b) => pct(b.c) - pct(a.c))[0];
  const badges = [
    { e: '✦', t: 'Enrolled', got: mine.length > 0 }, { e: '▲', t: 'Streak 7 days', got: true },
    { e: '★', t: 'Test 80%+', got: Object.values(scores).some((s) => s >= 80) },
    { e: '✓', t: 'Finisher', got: certs > 0 }, { e: '✎', t: 'Note taker', got: notes.length > 0 }, { e: '◍', t: '3 courses', got: mine.length >= 3 },
  ];

  return (
    <Layout title={`Hello, ${user?.name?.split(' ')[0] || 'Learner'}`} sub={user?.subtitle || 'Here is your learning command center.'} active="/dashboard">
      <div className="dbanner dbanner-center">
        <div className="dlead" style={{ flex: 1, minWidth: 240 }}>
          <h2>{mine.length ? `Keep going — ${avgProg}% average progress` : 'Start your first track today'}</h2>
          <p>{resume ? `Resume "${resume.c.title}" — ${doneCount(resume.c)} of ${totalLessons(resume.c)} lessons done.` : 'Pick a free course or a paid career track. Certificates on completion.'}</p>
          <span className="streak">▲ 12-day streak · best at 8 PM</span>
          {resume ? <button className="dbtn" style={{ background: '#fff', color: '#111' }} onClick={() => nav('/learn/' + resume.c.id)}>Resume learning →</button> : <button className="dbtn" style={{ background: '#fff', color: '#111' }} onClick={() => nav('/courses')}>Browse courses</button>}
        </div>
      </div>

      <div className="dkpis">
        <div className="dkpi"><div className="t">▦ Enrolled</div><div className="v">{mine.length}</div><div className="s">active tracks</div></div>
        <div className="dkpi"><div className="t">◍ Avg. progress</div><div className="v">{avgProg}%</div><div className="s">{hours}h learned</div></div>
        <div className="dkpi"><div className="t">★ Test average</div><div className="v">{testAvg}%</div><div className="s">{Object.keys(scores).length} tests taken</div></div>
        <div className="dkpi"><div className="t">✓ Certificates</div><div className="v">{certs}</div><div className="s">earned on 100%</div></div>
        <div className="dkpi"><div className="t">▲ Day streak</div><div className="v">12</div><div className="s">personal best 21</div></div>
      </div>

      <div className="dbody">
        <div>
          <div className="dcard">
            <h3>Continue learning <Link to="/courses">View all</Link></h3>
            {mine.length === 0 && <p style={{ fontSize: 13, color: 'var(--dmut)', marginTop: 10 }}>No enrollments yet — start with a free course below.</p>}
            {mine.map(({ c }) => (
              <div className="crow" key={c.id}>
                <div className="th" style={{ background: c.color }}>{c.thumb.slice(0, 3)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4>{c.title}</h4>
                  <div className="m">{doneCount(c)} / {totalLessons(c)} lessons · {pct(c)}% · {c.instructor}</div>
                  <div className="pbar"><i style={{ width: pct(c) + '%' }} /></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button className="dbtn dark" onClick={() => nav('/learn/' + c.id)}>Resume</button>
                  {TESTS.filter((t) => t.courseId === c.id).map((t) => <button key={t.id} className="dbtn line" onClick={() => setActiveTest(t)}>Test</button>)}
                </div>
              </div>
            ))}
          </div>

          <div className="dcard">
            <h3>Weekly activity <span style={{ fontSize: 12, color: 'var(--dmut)' }}>{hours}h total</span></h3>
            <div className="abars">{week.map((w, i) => <div className="col" key={i}><div className="b" style={{ height: w.h + '%' }} /><span>{w.d}</span></div>)}</div>
          </div>

          <div className="dcard" id="tests">
            <h3>Tests & quizzes <span style={{ fontSize: 12, color: 'var(--dmut)' }}>avg {testAvg}%</span></h3>
            {upcoming.map((t) => (
              <div className="trow" key={t.id}>
                <div><b>{t.title}</b><div style={{ fontSize: 12, color: 'var(--dmut)' }}>{COURSES.find((c) => c.id === t.courseId)?.title} · {t.duration} · {t.questions.length} questions</div></div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {scores[t.id] != null && <span className="score">Best {scores[t.id]}% · {attempts.filter((a) => a.id === t.id).length} attempt{attempts.filter((a) => a.id === t.id).length === 1 ? '' : 's'}</span>}
                  <button className="dbtn dark" onClick={() => setActiveTest(t)}>{scores[t.id] != null ? 'Retake' : 'Start'}</button>
                </div>
              </div>
            ))}
          </div>

          <div className="dcard">
            <h3>My notes <Link to="/notes">Open all</Link></h3>
            {notes.length === 0 && <p style={{ fontSize: 13, color: 'var(--dmut)', marginTop: 10 }}>No lesson notes yet — open any lesson in the player and use the Notes tab.</p>}
            {notes.map((n, i) => <div className="nrow" key={i}><b>{n.course}</b><span>{n.text.slice(0, 120)}</span></div>)}
          </div>
        </div>

        <div>
          <div className="dcard">
            <h3>Achievements</h3>
            <div className="badge-grid">{badges.map((b, i) => <div key={i} className={'bdg' + (b.got ? '' : ' lock')}><span className="e">{b.e}</span>{b.t}</div>)}</div>
          </div>
          <div className="dcard">
            <h3>This week</h3>
            <div className="nrow"><b>Mock interview — MERN</b><span>Saturday · 11:00 AM · 60 min</span></div>
            <div className="nrow"><b>Assignment 4 due</b><span>Sunday · Supabase RLS policies</span></div>
            <div className="nrow"><b>Live doubt room</b><span>Friday · 7:00 PM with mentor</span></div>
          </div>
          <div className="dcard">
            <h3>Recommended</h3>
            {COURSES.filter((c) => !mine.find((m) => m.courseId === c.id)).slice(0, 3).map((c) => (
              <div className="crow" key={c.id}>
                <div className="th" style={{ background: c.color }}>{c.thumb.slice(0, 3)}</div>
                <div style={{ flex: 1 }}><h4 style={{ fontSize: 13 }}>{c.title}</h4><div className="m">{c.free ? 'Free' : '₹' + c.price.toLocaleString('en-IN')} · ★ {c.rating}</div></div>
                <button className="dbtn line" onClick={() => { if (c.free) { enroll(c.id, { mode: 'free', amount: 0 }); nav('/learn/' + c.id); } else nav('/checkout/' + c.id); }}>{c.free ? 'Enroll' : 'Buy'}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {activeTest && <TestModal test={activeTest} onClose={() => setActiveTest(null)} />}
    </Layout>
  );
}

export function TestsPage() {
  const [activeTest, setActiveTest] = useState(null);
  const scores = getScores();
  const attempts = getAttempts();
  const taken = Object.keys(scores).length;
  const avg = taken ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / taken) : 0;
  return (
    <Layout title="Tests & Quizzes" sub="Attempt course tests, beat your best score, and track every try." active="/tests">
      <div className="dcard">
        <h3>Available tests <span style={{ fontSize: 12, color: 'var(--dmut)' }}>{TESTS.length} tests · avg {avg}%</span></h3>
        {TESTS.map((t) => {
          const n = attempts.filter((a) => a.id === t.id).length;
          return (
            <div className="trow" key={t.id}>
              <div><b>{t.title}</b><div style={{ fontSize: 12, color: 'var(--dmut)' }}>{COURSES.find((c) => c.id === t.courseId)?.title} · {t.duration} · {t.questions.length} questions</div></div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {scores[t.id] != null && <span className="score">Best {scores[t.id]}% · {n} attempt{n === 1 ? '' : 's'}</span>}
                <button className="dbtn dark" onClick={() => setActiveTest(t)}>{scores[t.id] != null ? 'Retake' : 'Start Test'}</button>
              </div>
            </div>
          );
        })}
      </div>
      {activeTest && <TestModal test={activeTest} onClose={() => setActiveTest(null)} />}
    </Layout>
  );
}

export function Profile() {
  const { user, enrollments, updateProfile } = useAuth();
  const [f, setF] = useState({ name: user?.name || '', mobile: user?.mobile || '', gender: user?.gender || 'Male', subtitle: user?.subtitle || '' });
  const [saved, setSaved] = useState(false);
  const orders = enrollments.map((e) => ({ ...e, c: COURSES.find((c) => c.id === e.courseId) }));
  const spent = orders.reduce((a, o) => a + (o.payment?.amount || 0), 0);
  const save = () => { updateProfile(f); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const onPic = (file) => {
    if (!file || file.size > 600 * 1024) return;
    const r = new FileReader();
    r.onload = () => updateProfile({ avatar: r.result });
    r.readAsDataURL(file);
  };
  return (
    <Layout title="Profile" sub="Manage your identity, billing history and learning preferences." active="/profile">
      <div className="dgrid pf-grid">
        <div className="dcard dform pf-card">
          <div className="pf-cover" aria-hidden="true" />
          <div className="pf-head">
            <span className="pf-av"><Av user={user} size={84} /></span>
            <div className="pf-id">
              <b>{user?.name}</b>
              <span>{user?.subtitle || 'Student'}</span>
              <span className="pf-mail">{user?.email}</span>
            </div>
            <label className="dbtn line pf-photo">Change photo<input type="file" accept="image/*" hidden onChange={(e) => onPic(e.target.files[0])} /></label>
          </div>
          <div className="pf-body">
            <label>Full name</label><input className="inp" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Your full name" />
            <label>Email (cannot be changed)</label><input className="inp" value={user?.email} disabled />
            <div className="pf-row">
              <div><label>Mobile</label><input className="inp" inputMode="numeric" value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit mobile number" /></div>
              <div><label>Gender</label><select className="inp" value={f.gender} onChange={(e) => setF({ ...f, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select></div>
            </div>
            <label>Professional subtitle</label><input className="inp" value={f.subtitle} onChange={(e) => setF({ ...f, subtitle: e.target.value })} placeholder="Aspiring MERN Developer" />
            <button className="dbtn dark pf-save" onClick={save}>{saved ? 'Saved ✓' : 'Save changes'}</button>
          </div>
        </div>
        <div>
          <div className="pf-kpis">
            <div className="dkpi pf-kpi"><span className="pf-ic">▦</span><div><div className="t">Owned Courses</div><div className="v">{orders.length}</div></div></div>
            <div className="dkpi pf-kpi"><span className="pf-ic">₹</span><div><div className="t">Total Spent</div><div className="v">₹{spent.toLocaleString('en-IN')}</div></div></div>
          </div>
          <div className="dcard">
            <h3>Payment history</h3>
            <table className="dtable"><thead><tr><th>Course</th><th>Amount</th><th>Date</th></tr></thead><tbody>
              {orders.map((o, i) => <tr key={i}><td>{o.c?.title || o.courseId}</td><td>{o.payment?.amount ? '₹' + o.payment.amount.toLocaleString('en-IN') : 'Free'}</td><td>{new Date(o.at).toLocaleDateString()}</td></tr>)}
              {orders.length === 0 && <tr><td colSpan={3}>No purchases yet.</td></tr>}
            </tbody></table>
          </div>
          <div className="dcard">
            <h3>Preferences</h3>
            <div className="nrow pf-check"><label className="pf-cb"><input type="checkbox" defaultChecked /><span className="pf-box">✓</span><span className="pf-n">◍</span> Email course reminders</label></div>
            <div className="nrow pf-check"><label className="pf-cb"><input type="checkbox" defaultChecked /><span className="pf-box">✓</span><span className="pf-n">✎</span> Revision nudges</label></div>
            <div className="nrow pf-check"><label className="pf-cb"><input type="checkbox" /><span className="pf-box">✓</span><span className="pf-n">◎</span> Public hiring profile</label></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export function NotesPage() {
  const notes = (() => { try { return JSON.parse(localStorage.getItem('papersky_admin_notes') || 'null'); } catch { return null; } })() || [
    { id: 'a1', title: 'MERN Roadmap PDF', course: 'Full-Stack Web Development with MERN', size: '2.4 MB' },
    { id: 'a2', title: 'RLS Policies Handbook', course: 'Supabase & PostgreSQL', size: '3.2 MB' },
  ];
  const flatFor = (cid) => {
    const c = COURSES.find((x) => x.id === cid);
    return c ? c.curriculum.flatMap((m, mi) => m.items.map((t, li) => ({ key: `${mi}-${li}`, module: m.title, title: t }))) : [];
  };
  const courseTitle = (cid) => COURSES.find((x) => x.id === cid)?.title || cid;
  const fileTag = (t) => (String(t).split('.').pop() || '').toUpperCase().slice(0, 4) || 'FILE';
  const mine = [];
  try {
    for (let k = 0; k < localStorage.length; k++) {
      const key = localStorage.key(k);
      if (key?.startsWith('papersky_lesson_notes_')) {
        const cid = key.replace('papersky_lesson_notes_', '');
        const flat = flatFor(cid);
        Object.entries(JSON.parse(localStorage.getItem(key))).forEach(([lk, v]) => {
          if (!v) return;
          const l = flat.find((x) => x.key === lk);
          mine.push({ course: courseTitle(cid), lesson: l ? `${l.module} · ${l.title}` : `Lesson ${lk}`, text: v, cid });
        });
      }
    }
  } catch {}
  return (
    <Layout title="My Notes" sub="Access your course resources, saved lesson notes, and study materials in one place." active="/notes">
      <div className="dcard nt-card">
        <div className="nt-head"><span className="pf-n nt-ic">▦</span><div><h3>Course material</h3><p>{notes.length} resources from your learning tracks</p></div></div>
        <table className="dtable nt-table"><thead><tr><th>Title</th><th>Course</th><th>Size</th><th></th></tr></thead><tbody>
          {notes.map((n) => <tr key={n.id}><td><span className="nt-file">{fileTag(n.title)}</span><b>{n.title}</b></td><td>{n.course}</td><td>{n.size}</td><td><button className="dbtn line">Download</button></td></tr>)}
        </tbody></table>
      </div>
      <div className="dcard nt-card">
        <div className="nt-head"><span className="pf-n nt-ic">✎</span><div><h3>Lesson notes ({mine.length})</h3><p>Saved while watching lessons</p></div></div>
        {mine.length === 0 && (
          <div className="nt-empty">
            <span className="nt-empty-ic">✎</span>
            <b>No lesson notes yet</b>
            <p>Open any lesson player and use the Notes tab to save key takeaways — they will collect here for quick revision.</p>
            <Link className="dbtn dark" to="/courses">Browse courses</Link>
          </div>
        )}
        {mine.map((n, i) => (
          <div className="nrow nt-note" key={i}>
            <span className="pf-n">✎</span>
            <div><b>{n.lesson}</b><span>{n.course}</span><p>{n.text}</p></div>
            <Link className="nt-open" to={'/learn/' + n.cid}>Open lesson →</Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}
