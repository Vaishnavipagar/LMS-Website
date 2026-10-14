import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.jsx';

export function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand"><span className="brand-mark">L</span> LearnLoop</Link>
        <nav className="nav-links">
          <Link to="/courses">Courses</Link><a href="/#features">Features</a><a href="/#pricing">Pricing</a><a href="/#resources">Resources</a><a href="/#company">Company</a>
        </nav>
        <div className="nav-cta">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-lime btn-sm">Dashboard</Link>
              <button className="btn btn-ghost btn-sm" onClick={() => { logout(); nav('/'); }}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-dark btn-sm" style={{background:'#fff',color:'#10130A'}}>Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer" id="company">
      <div className="container">
        <div className="foot-grid">
          <div>
            <h3 className="h2" style={{fontSize:30}}>Start building the future<br/>of your career today.</h3>
            <div className="news"><input placeholder="Enter your email address" /><button className="btn btn-light btn-sm">Subscribe</button></div>
          </div>
          <div style={{display:'flex',gap:40,fontSize:13}}>
            <div><b>Learn</b><br/><br/><Link to="/courses">All Courses</Link><br/><Link to="/courses">Free Courses</Link><br/><Link to="/courses">Certificates</Link></div>
            <div><b>Company</b><br/><br/>About<br/>Careers<br/>Contact</div>
            <div><b>Legal</b><br/><br/>Privacy<br/>Terms<br/>Refunds</div>
          </div>
        </div>
        <div className="wordmark"><span>LearnLoop</span></div>
        <div className="foot-bottom"><span>LearnLoop — Made for learners</span><span>Student Portal :5173 · Admin Portal :5174 (isolated)</span></div>
      </div>
    </footer>
  );
}

export function CourseCard({ c, progressPct, onOpen }) {
  return (
    <div className="course">
      <div className="cover" style={{background:c.color}}>
        <span className="tag">{c.category}</span>
        <span style={{marginLeft:'auto',fontSize:26,letterSpacing:'-.04em'}}>{c.thumb}</span>
      </div>
      <div className="cbody">
        <h4>{c.title}</h4>
        <div className="meta"><span>{c.instructor}</span><span>·</span><span>{c.duration}</span><span>·</span><span>★ {c.rating} ({c.reviews})</span></div>
        {progressPct != null && <div className="progress"><i style={{width:progressPct+'%'}} /></div>}
        <div className="price-row">
          <span className="price">{c.free ? <span className="free-badge">FREE</span> : '₹'+c.price.toLocaleString('en-IN')}</span>
          <button className="btn btn-dark btn-sm" onClick={onOpen}>Open Course</button>
        </div>
      </div>
    </div>
  );
}
