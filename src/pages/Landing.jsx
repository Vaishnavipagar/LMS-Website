import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COURSES } from '../data/courses.js';
import { useAuth } from '../store/auth.jsx';

const targetIcon = (<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="9" stroke="#111" strokeWidth="1.6"/><circle cx="13" cy="13" r="5" stroke="#111" strokeWidth="1.6"/><circle cx="13" cy="13" r="1.6" fill="#111"/></svg>);
const astIcon = (<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 3v20M4 8.5l18 9M22 8.5l-18 9" stroke="#111" strokeWidth="2" strokeLinecap="round"/></svg>);
const gridIcon = (<svg width="26" height="26" viewBox="0 0 26 26"><g fill="#111">{[6, 11, 16].map((x) => [6, 11, 16].map((y) => <circle key={x + '-' + y} cx={x} cy={y} r="1.8" />))}</g></svg>);
const hourIcon = (<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M6 4h14M6 22h14M8 4c0 5 5 6 5 9s-5 4-5 9M18 4c0 5-5 6-5 9s5 4 5 9" stroke="#111" strokeWidth="1.7" strokeLinecap="round"/></svg>);

function Count({ to, suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1600;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 4);
        setV(to * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{v.toFixed(decimals)}{suffix}</span>;
}

const REVIEWS = [
  { q: 'The MERN track took me from tutorials to a paid internship in 14 weeks. Notes, projects and video quality are excellent.', n: 'Jane Rayne', r: 'SDE-II, Learner since 2024', course: 'Full-Stack Web Development with MERN', stars: 5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=70' },
  { q: 'Free React course alone was worth months of scattered YouTube. The curriculum order finally made hooks click for me.', n: 'Priya Nair', r: 'Frontend Developer, Kochi', course: 'React 18 Professional', stars: 5, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=70' },
  { q: 'Supabase RLS module is the clearest I have found anywhere. I shipped client projects with proper row isolation in a week.', n: 'Aman Gupta', r: 'Freelance Full-Stack Dev', course: 'Supabase & PostgreSQL', stars: 4, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=70' },
  { q: 'DSA bootcamp patterns got me through three interview rounds. The streak reminders kept me consistent every single day.', n: 'Sneha Iyer', r: 'Placed at Fintech, Bengaluru', course: 'DSA Bootcamp in JavaScript', stars: 5, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=70' },
];

const PATHS = [
  { name: 'Programming & Development', desc: 'Strengthen problem-solving with DSA patterns, JavaScript depth, and interview-ready practice sets.', courseId: 'dsa-bootcamp' },
  { name: 'Data Science & AI', desc: 'Learn data modelling, SQL, and database-driven backends that power intelligent applications.', courseId: 'supabase-postgres' },
  { name: 'Web Development', desc: 'Build modern websites and full-stack apps with React, MERN workflows, and deployment skills.', courseId: 'fullstack-mern' },
];

const WHY = [
  { t: 'Expert-Led Courses', d: 'Learn directly from working developers through structured lessons and real-world examples.', ic: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="#111" strokeWidth="1.7" /><path d="M5 20c1.2-3.4 3.8-5 7-5s5.8 1.6 7 5" stroke="#111" strokeWidth="1.7" strokeLinecap="round" /></svg>) },
  { t: 'Hands-On Projects', d: 'Apply every concept by building portfolio-ready projects, quizzes, and coding challenges.', ic: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="m8 6-5 6 5 6M16 6l5 6-5 6" stroke="#111" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>) },
  { t: 'Certificates & Progress Tracking', d: 'Earn certificates on completion and follow lessons, streaks, and finished courses.', ic: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="4.5" stroke="#111" strokeWidth="1.7" /><path d="m8.5 12.5-2 8 5.5-2.5L17.5 20.5l-2-8M10 9l1.2 2.4L13.8 12l-2.6.6L10 15l-1.2-2.4L6.2 12l2.6-.6z" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" /></svg>) },
];

export default function Landing() {
  const { user, enrollments, enroll } = useAuth();
  const nav = useNavigate();
  const [rev, setRev] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeAt = useRef(0);
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // hero is dark -> nav stays default; past hero, switch to light glass
      setLight(y > window.innerHeight * 0.85);
      if (heroRef.current) heroRef.current.style.transform = `translateY(${y * 0.18}px)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-rotate testimonials; pauses on hover/focus, shortly after manual
  // navigation, when the tab is hidden, or for reduced-motion users.
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => {
      if (paused || document.hidden || Date.now() < resumeAt.current) return;
      setRev((r) => (r + 1) % REVIEWS.length);
    }, 5000);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    const els = document.querySelectorAll('.rv');
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const [mopen, setMopen] = useState(false);
  const closeM = () => setMopen(false);
  useEffect(() => {
    if (!mopen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMopen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [mopen]);

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

  return (
    <div className="landing">
      <nav className={`pnav${scrolled ? ' scrolled' : ''}${light ? ' light' : ''}`}>
        <Link to="/" className="pbrand" onClick={closeM}><span className="mk">L</span> LearnLoop</Link>
        <div className="plinks"><a href="#courses">Products</a><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#resources">Resource</a><a href="#company">Company</a></div>
        <button className="phamb" aria-label="Open navigation menu" onClick={() => setMopen(true)}><span /><span /><span /></button>
        <div className="pcta">
          {user ? <Link to="/dashboard" className="btn btn-start">Dashboard</Link> : <Link to="/login" className="btn btn-start">Login</Link>}
        </div>
      </nav>
      <div className={'povl' + (mopen ? ' on' : '')} onClick={closeM} aria-hidden="true" />
      <aside className={'pdrawer' + (mopen ? ' open' : '')} aria-label="Mobile navigation">
        <Link to="/" className="pbrand" onClick={closeM}><span className="mk">L</span> LearnLoop</Link>
        <a href="#courses" onClick={closeM}>Products</a>
        <a href="#features" onClick={closeM}>Features</a>
        <a href="#pricing" onClick={closeM}>Pricing</a>
        <a href="#resources" onClick={closeM}>Resource</a>
        <a href="#company" onClick={closeM}>Company</a>
        {user ? <Link to="/dashboard" className="btn btn-start" onClick={closeM}>Dashboard</Link> : <Link to="/login" className="btn btn-start" onClick={closeM}>Login</Link>}
      </aside>

      {/* HERO — 100vh, edge to edge */}
      <header className="hero">
        <div className="hero-glow" />
        <div className="hero-in" ref={heroRef}>
          <div>
            <h1><span className="mask"><span>Learn</span></span><span className="mask"><span>Anything And</span></span><span className="mask"><span>Achieve</span></span><span className="mask"><span>Everything</span></span></h1>
            <p className="hero-sub">Turn your curiosity into real-world skills. Learn from expert-led courses, build practical knowledge, track your progress, and earn certificates—all in one place.</p>
            <a href="#courses" className="hero-cta">Browse Courses</a>
          </div>
        </div>
        <div className="scroll-hint"><i /></div>
      </header>

      {/* INTRO — one screen */}
      <section className="intro screen" id="features">
        <div className="wrap">
          <span className="tagpill rv"><i />ALL IN ONE PLATFORM</span>
          <h2 className="rv d1">The only source for SaaS<br />in its most powerful form.</h2>
          <div className="feat4">
            {[[targetIcon, 'SaaS', 'Solutions'], [astIcon, 'Smart', 'Automation'], [gridIcon, 'Data', 'Analytics'], [hourIcon, 'Cloud', 'Infrastructure']].map(([ic, a, b], i) => (
              <div key={i} className={`rv d${i + 1}`}><div className="fi">{ic}</div><b>{a}<br />{b}</b></div>
            ))}
          </div>
        </div>
      </section>

      {/* SPLITS — each one screen */}
      <section className="splits">
        <div className="split screen">
          <div className="shot rv rv-l">
            <div className="dash">
              <div className="dh"><span>● Monthly Recurring Revenue</span><span>◍ 60.9%</span></div>
              <div className="amt">$87,410 <small>↗ 12.5%</small></div>
              <div style={{ fontSize: 11, color: '#888' }}>Earnings are growing +42% over last month</div>
              <div className="barset">{[70, 45, 90, 60, 85, 55, 75].map((h, i) => <i key={i} className={i === 2 ? 'hot' : ''} style={{ height: `${20 + h / 2}px`, transitionDelay: `${i * 0.07}s` }} />)}</div>
              <div className="dbar"><i /></div>
              <div className="dgrid">
                <div className="cell">New Deals<b>$12,430</b></div>
                <div className="cell">Net Revenue<b>$6,210</b></div>
                <div className="cell">Churn<b>23%</b></div>
              </div>
            </div>
          </div>
          <div className="copy rv rv-r">
            <div className="k"><i />BUSINESS INSIGHTS</div>
            <h3>Monitor Every Metric That Matters Most.</h3>
            <p>Monitor revenue, subscriptions, and customer insights through a single dashboard built for modern SaaS teams.</p>
            <Link to="/courses" className="btn btn-wait">Join the waitlist</Link>
          </div>
        </div>

        <div className="split screen">
          <div className="copy rv rv-l">
            <div className="k"><i />GROWTH ANALYTICS</div>
            <h3>Track growth as your business scales.</h3>
            <p>Everything you need to manage business operations, customer engagement, and performance from one powerful platform.</p>
            <Link to="/courses" className="btn btn-wait">Join the waitlist</Link>
          </div>
          <div className="shot g2 rv rv-r">
            <div className="dash">
              <div className="dh"><span>Total Revenue This Month</span><span>✳ Aug 9th</span></div>
              <div className="amt">$3,150 <small>↗ 4.08%</small></div>
              <div style={{ fontSize: 11, color: '#888' }}>Total profit increased +42% over last month</div>
              <div className="linechart">
                <svg viewBox="0 0 300 120" preserveAspectRatio="none">
                  <path className="draw" d="M0,95 C40,90 60,70 90,72 C120,74 140,40 180,45 C220,50 250,25 300,20" fill="none" stroke="#5F730C" strokeWidth="2" />
                </svg>
                <div style={{ position: 'absolute', right: 40, top: 6, fontSize: 10, fontWeight: 700 }}>$123,590</div>
                <div style={{ position: 'absolute', right: 0, bottom: -18, fontSize: 10, color: '#999' }}>Aug 31</div>
                <div style={{ position: 'absolute', left: 0, bottom: -18, fontSize: 10, color: '#999' }}>Aug 1</div>
              </div>
              <div style={{ height: 26 }} />
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING PATHS */}
      <section className="paths">
        <div className="inner">
          <span className="tagpill rv"><i />LEARNING PATHS</span>
          <h2 className="rv d1">Explore Our Learning Paths</h2>
          <p className="rv d2 paths-sub">Structured tracks built from the course catalog — pick a path and start learning.</p>
          <div className="lcourse-grid">
            {PATHS.map((p, i) => {
              const c = COURSES.find((x) => x.id === p.courseId);
              if (!c) return null;
              return (
                <div key={p.name} className={`lcourse rv d${(i % 3) + 1}`}>
                  <div className="cov" style={{ background: c.color }}>
                    <span className="pchip">{p.name}</span>
                    <span>{c.thumb}</span>
                  </div>
                  <div className="cb">
                    <h4>{p.name}</h4>
                    <div className="cm">Featured: <b>{c.title}</b> · {c.lessons} lessons · {c.level}</div>
                    <p style={{ fontSize: 12.5, color: '#6E6E66', marginTop: 8 }}>{p.desc}</p>
                    <div className="pr">
                      <span style={{ fontSize: 12, color: '#6E6E66' }}>{c.free ? 'Starts free' : 'Guided track'}</span>
                      <Link className="btn btn-wait btn-sm" to="/courses">Explore Courses</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY LEARN WITH LEARNLOOP */}
      <section className="why-strip">
        <div className="inner">
          <span className="tagpill rv"><i />WHY LEARNLOOP</span>
          <h2 className="rv d1">Why Learn With LearnLoop?</h2>
          <div className="why-grid">
            {WHY.map((w, i) => (
              <div key={w.t} className={`why-card rv d${i + 1}`}>
                <div className="fi">{w.ic}</div>
                <b>{w.t}</b>
                <p>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES — browse + enroll right on the landing page */}
      <section className="courses-sec screen" id="courses">
        <div className="inner">
          <span className="tagpill rv"><i />COURSE CATALOG</span>
          <h2 className="rv d1" style={{ fontSize: 'clamp(26px,2.8vw,34px)', letterSpacing: '-.03em', marginTop: 16 }}>Pick a track. Enroll. Start watching.</h2>
          <p className="rv d2" style={{ fontSize: 13.5, color: '#6E6E66', marginTop: 10 }}>Free and paid courses — no separate course page. Enroll or buy inline.</p>
          <div className="lcourse-grid">
            {COURSES.map((c, i) => {
              const owned = enrollments.some((e) => e.courseId === c.id);
              return (
                <div key={c.id} className={`lcourse rv d${(i % 3) + 1}`}>
                  <div className="cov" style={{ background: c.color }}>
                    <span className="pchip">{c.category}</span>
                    <span>{c.thumb}</span>
                  </div>
                  <div className="cb">
                    <h4>{c.title}</h4>
                    <div className="cm">{c.instructor} · {c.duration} · ★ {c.rating}</div>
                    <div className="pr">
                      {c.free ? <span className="free">FREE</span> : <b>₹{c.price.toLocaleString('en-IN')}</b>}
                      <button className="btn btn-wait btn-sm" onClick={() => openCourse(c)}>{owned ? 'Continue →' : c.free ? 'Enroll Free' : 'Buy Now'}</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BLACK BAND — one screen */}
      <section className="band screen">
        <div className="inner">
          <span className="tagpill rv"><i />WHAT YOU GET FOR USING</span>
          <h2 className="rv d1">Everything you need to learn,<br />grow, and succeed.</h2>
          <div className="trio">
            <div className="tcard rv d1">
              <div className="thumb"><img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=700&q=70" alt="Student learning online" /><div className="ov"><span className="pchip">◍ LearnLoop</span><span style={{ opacity: .7 }}>Live Expert Sessions</span></div></div>
              <h4>Expert-Led Courses</h4>
              <p>Learn from industry professionals with structured lessons, real projects, and doubt support.</p>
            </div>
            <div className="tcard rv d2">
              <div className="thumb th2">
                <div className="mini-white">
                  <div className="r"><span>My Learning</span><span>● ● ●</span></div>
                  <div style={{ fontSize: 10, color: '#999', marginTop: 8 }}>Lessons, progress and certificates</div>
                  <div className="nums">
                    <div><span>◍ React 18</span><b>12 / 16</b><span>lessons completed</span></div>
                    <div><span>◍ Certificates</span><b>3 earned</b><span>ready to download</span></div>
                  </div>
                </div>
              </div>
              <h4>Track Your Progress</h4>
              <p>Follow lessons completed, daily streaks, and certificates from your learning dashboard.</p>
            </div>
            <div className="tcard rv d3">
              <div className="thumb"><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=70" alt="Students studying together" /><div className="ov"><span>LearnLoop Cohorts</span><span style={{ opacity: .7 }}>STUDY TOGETHER</span></div></div>
              <h4>Learn Anywhere</h4>
              <p>Watch on any device, download notes, and keep learning at your own pace, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO — one screen */}
      <section className="mani screen" id="pricing">
        <div className="mani-grid">
          <div className="mani-left rv rv-l">
            <div className="k"><i style={{ width: 7, height: 7, borderRadius: '50%', background: '#A8C90B', display: 'inline-block' }} />WHO WE ARE</div>
            <h5 style={{ fontSize: 11, marginTop: 14 }}>LEARNLOOP</h5>
            <p style={{ fontSize: 11, color: '#6E6E66' }}>ONLINE LEARNING PLATFORM</p>
            <div className="rev-card" key={rev} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
              <div className="rev-slide">
                <div style={{ color: '#E8A100', letterSpacing: 2, fontSize: 12 }} aria-label={REVIEWS[rev].stars + ' out of 5 stars'}>{'★'.repeat(REVIEWS[rev].stars)}{'☆'.repeat(5 - REVIEWS[rev].stars)}</div>
                <q>{REVIEWS[rev].q}</q>
                <div className="rev-who">
                  <img src={REVIEWS[rev].img} alt={REVIEWS[rev].n} />
                  <div><b>{REVIEWS[rev].n}</b><span>{REVIEWS[rev].r}</span><span className="rev-course">{REVIEWS[rev].course}</span></div>
                </div>
              </div>
            </div>
            <div className="rev-dots">{REVIEWS.map((_, i) => <button key={i} aria-label={'review ' + (i + 1)} className={i === rev ? 'on' : ''} onClick={() => { setRev(i); resumeAt.current = Date.now() + 12000; }} />)}</div>
            <div style={{ marginTop: 16, fontSize: 11 }}>Trusted by growing<br /><b>learners</b></div>
          </div>
          <div className="mani-right">
            <p className="lead rv">By combining <b>thoughtful design</b> with powerful technology, we build SaaS solutions that help businesses <b>simplify operation</b> &amp; achieve sustainable growth.</p>
            <div className="statgrid">
              <div className="stat rv d1"><div className="pct"><Count to={92} suffix="%" /> <span className="pilln">NEW</span></div><p>(92%) Customer retention by adopting our SaaS platform.</p></div>
              <div><div className="stat dark rv d2"><div className="pct">Certificates <span className="pilln g">EARNED</span></div><p>Awarded on every completed learning track.</p></div><div className="stat rv d3" style={{ marginTop: 16 }}><div className="pct"><Count to={64} suffix="%" /> <span className="pilln g">↗ 12%</span></div><p>Teams report improved productivity after implementation.</p></div></div>
              <div className="stat dark rv d4"><div className="pct"><Count to={0} suffix="%" /></div><p>(0%) Hidden fees across every subscription plan.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US — one screen split */}
      <section className="scale" id="resources">
        <div className="scale-l">
          <div className="rv" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', display: 'flex', gap: 7, alignItems: 'center' }}><i style={{ width: 7, height: 7, borderRadius: '50%', background: '#A8C90B', display: 'inline-block' }} />WHY CHOOSE US</div>
          <h3 className="rv d1">Everything you need to learn and grow with confidence.</h3>
          <div className="rv d2"><a href="#courses" className="btn btn-wait">Explore Courses</a></div>
          <div className="scale-feats">
            <div className="rv d1"><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em' }}>EXPERT-LED COURSES</div><div className="earn-black"><div className="big" style={{ fontSize: 19, fontWeight: 750 }}>Certificates<br />included</div><div style={{ fontSize: 11.5, opacity: .65, marginTop: 8 }}>Earn on course completion</div></div></div>
            <div className="rv d2"><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em' }}>LEARN AT YOUR PACE</div><p style={{ fontSize: 12.5, marginTop: 12, fontWeight: 600 }}>Watch lessons anytime and pick up right where you left off.</p></div>
            <div className="rv d3"><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em' }}>TRACK YOUR PROGRESS</div><p style={{ fontSize: 12.5, marginTop: 12, fontWeight: 600 }}>Follow lessons completed, streaks, and finished courses.</p></div>
          </div>
        </div>
        <div className="scale-r rv rv-r">
          <div className="avgcard">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#777' }}><span>◍ My learning</span><span>This week ▾</span></div>
            <div className="learn-top">
              <div className="ring" role="img" aria-label="Course completion 78 percent"><span>78%</span></div>
              <div><div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-.02em' }}>Course<br />completion</div><div style={{ fontSize: 11, color: '#777', marginTop: 4 }}>Across enrolled tracks</div></div>
            </div>
            <div className="lrow"><div className="lmeta"><span>React 18 Professional</span><span>12 / 16 lessons</span></div><div className="lbar"><i style={{ width: '75%' }} /></div></div>
            <div className="lrow"><div className="lmeta"><span>MERN Track</span><span>9 / 14 lessons</span></div><div className="lbar"><i style={{ width: '64%' }} /></div></div>
            <div className="cert-pill"><span>◍ Certificate earned — HTML &amp; CSS Basics</span></div>
            <div className="bars">{[40, 55, 35, 60, 45, 80, 65, 90, 70].map((h, i) => <i key={i} className={i < 3 ? 'dim' : ''} style={{ height: `${h}%`, transitionDelay: `${i * 0.06}s` }} />)}</div>
            <div style={{ fontSize: 10.5, color: '#999', marginTop: 8 }}>Lessons completed per day</div>
          </div>
          <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,.75)', maxWidth: 360, margin: '14px auto 0' }}>Follow your courses, lessons, and certificates from one learning dashboard.</p>
        </div>
      </section>

      {/* FOOTER — LearnLoop LMS */}
      <footer className="footer" id="company">
        <div className="ff-top">
          <div className="rv rv-l">
            <h3>Start building the future<br />of your learning today.</h3>
            <div className="ff-sub"><input placeholder="Enter your email address" /><button>Subscribe</button></div>
          </div>
          <div className="rv rv-r ff-links">
            <div><b>LearnLoop Product</b><div className="ff-col"><Link to="/courses">All Courses</Link><Link to="/login">Login</Link><span>Certificates</span><span>Company</span></div></div>
            <div><b>Support</b><div className="ff-col"><span>Contact Us</span><span>Help Center</span><span>Privacy</span><span>Terms</span></div></div>
          </div>
        </div>
        <div className="ff-giant rv">LearnLoop</div>
        <div className="ff-copy rv">
          <span>© 2026 — LearnLoop, All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}
