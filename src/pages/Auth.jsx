import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth.jsx';
import '../auth.css';

function Left({ titleA, titleB, sub }) {
  return (
    <div className="auth2-left">
      <div className="auth2-brand"><span className="mk">L</span> LearnLoop</div>
      <div className="aimg">
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=70" alt="Learners" />
        <div className="cap">Live cohort · Learn together</div>
      </div>
      <div className="in">
        <div className="auth2-kick">[ LEARNLOOP LMS ]</div>
        <h1><span className="mask"><span>{titleA}</span></span><span className="mask"><span>{titleB}</span></span></h1>
        <p className="sub">{sub}</p>
        <div className="auth2-float">
          <div className="aearn"><small>YOUR</small><div className="big">My learning</div><div style={{ fontSize: 11, color: '#777' }}>Courses and certificates in one place</div></div>
          <div className="aglass"><div style={{ fontWeight: 800 }}>Track progress</div><div style={{ fontSize: 12, opacity: .8 }}>Courses · tests · certificates</div></div>
        </div>
      </div>
    </div>
  );
}

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [eErr, setEErr] = useState('');

  const go = (e) => {
    e.preventDefault(); setErr('');
    if (!emailOk(email)) { setEErr('Enter a valid email address.'); return; }
    setEErr(''); setBusy(true);
    setTimeout(() => {
      try { login(email, pw); nav(loc.state?.from || '/dashboard'); }
      catch (ex) { setErr(ex.message); setBusy(false); }
    }, 500);
  };
  const seedDemo = () => {
    const users = JSON.parse(localStorage.getItem('papersky_lms_users') || '[]');
    if (!users.find((u) => u.email === 'student@learnloop.io')) {
      users.push({ id: 'u_demo', name: 'Demo Student', email: 'student@learnloop.io', mobile: '9876543210', gender: 'Male', subtitle: 'Aspiring MERN Developer', password: 'learn123', createdAt: new Date().toISOString(), avatar: 'D' });
      localStorage.setItem('papersky_lms_users', JSON.stringify(users));
    }
    try { login('student@learnloop.io', 'learn123'); nav('/dashboard'); } catch (ex) { setErr(ex.message); }
  };

  return (
    <div className="auth2">
      <Left titleA="Learn Anything." titleB="Achieve Everything." sub="Master new skills with expert-led courses designed for real-world success. Start learning today at your own pace." />
      <div className="auth2-right">
        <div className="acard">
          <Link to="/" className="back">← Back to home</Link>
          <h2>Welcome back.</h2>
          <p className="sub">Sign in to your student account. Admin sign-in lives separately on the admin portal.</p>
          {err && <div className="aerr" key={err}>{err}</div>}
          <form onSubmit={go} noValidate>
            <div className="fld">
              <label>Email address</label>
              <input className={'inp' + (eErr ? ' err-b' : '')} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              {eErr && <span className="ferr">{eErr}</span>}
            </div>
            <div className="fld">
              <label>Password</label>
              <div className="pw-wrap">
                <input className="inp" style={{ paddingRight: 60 }} type={show ? 'text' : 'password'} placeholder="Enter your password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
                <button type="button" className="pw-eye" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 13 }}>
              <label style={{ display: 'flex', gap: 7, alignItems: 'center', cursor: 'pointer' }}><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label>
              <span style={{ color: '#5F730C', fontWeight: 700, cursor: 'pointer' }}>Forgot password?</span>
            </div>
            <button className="abtn" disabled={busy}>{busy ? 'Signing you in…' : 'Sign in securely'}</button>
          </form>
          <div className="adiv">or continue with demo</div>
          <button className="abtn light" onClick={seedDemo}>Use demo student account</button>
          <p className="afoot">New to LearnLoop? <Link to="/signup">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}

export function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', mobile: '', gender: 'Male', subtitle: '', pw: '', pw2: '', avatar: '' });
  const [errs, setErrs] = useState({});
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF({ ...f, [k]: v });

  const onFile = (file) => {
    if (!file) return;
    if (file.size > 600 * 1024) { setErrs({ ...errs, avatar: 'Image must be under 600 KB.' }); return; }
    const r = new FileReader();
    r.onload = () => set('avatar', r.result);
    r.readAsDataURL(file);
  };

  const go = (e) => {
    e.preventDefault(); setErr('');
    const v = {};
    if (f.name.trim().length < 2) v.name = 'Enter your full name.';
    if (!emailOk(f.email)) v.email = 'Enter a valid email address.';
    if (!/^[6-9]\d{9}$/.test(f.mobile.trim())) v.mobile = 'Enter a valid 10-digit mobile number.';
    if (f.subtitle.trim().length < 3) v.subtitle = 'Add a short professional headline.';
    if (f.pw.length < 6) v.pw = 'Minimum 6 characters.';
    if (f.pw2 !== f.pw) v.pw2 = 'Passwords do not match.';
    setErrs(v);
    if (Object.keys(v).length) return;
    setBusy(true);
    setTimeout(() => {
      try { signup({ name: f.name.trim(), email: f.email.trim(), mobile: f.mobile.trim(), gender: f.gender, subtitle: f.subtitle.trim(), avatar: f.avatar || f.name.trim().charAt(0).toUpperCase(), password: f.pw }); nav('/dashboard'); }
      catch (ex) { setErr(ex.message); setBusy(false); }
    }, 500);
  };

  return (
    <div className="auth2">
      <Left titleA="Start your" titleB="Journey" sub="Create a student profile with your goals and photo. Enroll free or paid, take tests, earn certificates." />
      <div className="auth2-right">
        <div className="acard">
          <Link to="/" className="back">← Back to home</Link>
          <h2>Create account.</h2>
          <p className="sub">Free forever plan. Upgrade to paid tracks anytime.</p>
          {err && <div className="aerr" key={err}>{err}</div>}
          <form onSubmit={go} noValidate>
            <label className="upl">
              <span className="pv">{f.avatar ? <img src={f.avatar} alt="Profile" /> : (f.name.charAt(0).toUpperCase() || '+')}</span>
              <span><b style={{ fontSize: 14 }}>Profile picture</b><div style={{ fontSize: 12, color: '#777' }}>JPG / PNG under 600 KB — click to upload</div>{errs.avatar && <span className="ferr">{errs.avatar}</span>}</span>
              <input type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files[0])} />
            </label>
            <div className="fld"><label>Full name</label><input className={'inp' + (errs.name ? ' err-b' : '')} placeholder="Aarav Sharma" value={f.name} onChange={(e) => set('name', e.target.value)} />{errs.name && <span className="ferr">{errs.name}</span>}</div>
            <div className="fgrid">
              <div className="fld"><label>Email address</label><input className={'inp' + (errs.email ? ' err-b' : '')} placeholder="you@example.com" value={f.email} onChange={(e) => set('email', e.target.value)} />{errs.email && <span className="ferr">{errs.email}</span>}</div>
              <div className="fld"><label>Mobile number</label><input className={'inp' + (errs.mobile ? ' err-b' : '')} placeholder="9876543210" inputMode="numeric" value={f.mobile} onChange={(e) => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} />{errs.mobile && <span className="ferr">{errs.mobile}</span>}</div>
            </div>
            <div className="fld"><label>Professional subtitle</label><input className={'inp' + (errs.subtitle ? ' err-b' : '')} placeholder="Aspiring MERN Developer" value={f.subtitle} onChange={(e) => set('subtitle', e.target.value)} />{errs.subtitle && <span className="ferr">{errs.subtitle}</span>}</div>
            <div className="fld"><label>Gender</label>
              <div className="seg">{['Male', 'Female', 'Other'].map((g) => <button type="button" key={g} className={f.gender === g ? 'on' : ''} onClick={() => set('gender', g)}>{g}</button>)}</div>
            </div>
            <div className="fgrid">
              <div className="fld"><label>Password</label><input className={'inp' + (errs.pw ? ' err-b' : '')} type="password" placeholder="Min 6 characters" value={f.pw} onChange={(e) => set('pw', e.target.value)} />{errs.pw && <span className="ferr">{errs.pw}</span>}</div>
              <div className="fld"><label>Confirm password</label><input className={'inp' + (errs.pw2 ? ' err-b' : '')} type="password" placeholder="Repeat password" value={f.pw2} onChange={(e) => set('pw2', e.target.value)} />{errs.pw2 && <span className="ferr">{errs.pw2}</span>}</div>
            </div>
            <button className="abtn" disabled={busy}>{busy ? 'Creating your account…' : 'Create account'}</button>
          </form>
          <p className="afoot">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
