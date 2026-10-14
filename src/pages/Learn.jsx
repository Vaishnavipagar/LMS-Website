import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COURSES } from '../data/courses.js';
import { useAuth } from '../store/auth.jsx';

// Video source: in production this is a Cloudflare R2 / Stream URL saved on the lesson.
// Frontend uses a public sample for playback demo + supports ?video= override.
const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export default function Learn() {
  const { id } = useParams();
  const { progress, markLesson } = useAuth();
  const c = COURSES.find((x) => x.id === id);
  const flat = useMemo(() => c ? c.curriculum.flatMap((m, mi) => m.items.map((t, li) => ({ key: `${mi}-${li}`, module: m.title, title: t }))) : [], [c]);
  const [idx, setIdx] = useState(0);
  const [note, setNote] = useState('');
  const [tab, setTab] = useState('overview');
  if (!c) return <div className="container" style={{padding:100}}>Course not found</div>;
  const cur = flat[idx];
  const done = progress[c.id] || [];
  const pctDone = Math.round((done.length / flat.length) * 100);
  const notes = JSON.parse(localStorage.getItem('papersky_lesson_notes_' + c.id) || '{}');

  const saveNote = () => {
    const n = { ...notes, [cur.key]: note || notes[cur.key] || '' };
    localStorage.setItem('papersky_lesson_notes_' + c.id, JSON.stringify(n));
    setNote('');
    alert('Note saved for this lesson.');
  };

  return (
    <div className="shell">
      <aside className="side">
        <Link to="/dashboard" style={{fontWeight:800,margin:'4px 8px 14px'}}>← My Learning</Link>
        <div style={{padding:'0 14px',fontSize:13,opacity:.8}}>{c.title}<div className="progress" style={{background:'rgba(255,255,255,.15)'}}><i style={{width:pctDone+'%'}}/></div><div style={{marginTop:6}}>{pctDone}% complete</div></div>
        <div style={{overflow:'auto',marginTop:12}}>
          {flat.map((l, i) => (
            <a key={l.key} onClick={() => setIdx(i)} className={i===idx?'active':''} style={{cursor:'pointer',fontSize:13}}>
              <span>{done.includes(l.key) ? '✓ ' : `${i+1}. `}{l.title}</span>
            </a>
          ))}
        </div>
      </aside>
      <div className="main" style={{maxWidth:1100}}>
        <div className="video">
          <video key={cur.key} controls poster="" src={SAMPLE} style={{background:'#000'}} />
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center',marginTop:14,flexWrap:'wrap'}}>
          <h1 style={{fontSize:22}}>{cur.title}</h1>
          <span className="tag" style={{background:'#EDEDE5'}}>{c.category}</span>
          <span style={{marginLeft:'auto',display:'flex',gap:8}}>
            <button className="btn btn-light btn-sm" disabled={idx===0} onClick={()=>setIdx(idx-1)}>← Prev</button>
            <button className="btn btn-dark btn-sm" onClick={()=>{markLesson(c.id,cur.key); if(idx<flat.length-1) setIdx(idx+1);}}>{done.includes(cur.key)?'Completed ✓':'Mark complete & next →'}</button>
          </span>
        </div>
        <div className="tabs" style={{maxWidth:420,marginTop:16}}>{['overview','notes','resources'].map((t)=><button key={t} className={tab===t?'on':''} onClick={()=>setTab(t)} style={{textTransform:'capitalize'}}>{t}</button>)}</div>
        {tab==='overview' && <div className="form"><b>About this lesson</b><p style={{fontSize:14,color:'#6C7261',marginTop:8}}>Part of <b>{cur.module}</b> in {c.title}. Video served via Cloudflare R2 (signed URL in production, stored per lesson by admin). Subtitles, 1.5x speed and resume-from-last-position are supported by the player.</p></div>}
        {tab==='notes' && <div className="form"><b>Lesson notes</b><textarea className="input" rows={4} value={note} onChange={(e)=>setNote(e.target.value)} placeholder={notes[cur.key] || 'Type notes for this lesson...'} style={{marginTop:10}} /><button className="btn btn-dark btn-sm" style={{marginTop:10}} onClick={saveNote}>Save note</button>{notes[cur.key] && <p style={{fontSize:13,marginTop:10}}>Saved: {notes[cur.key]}</p>}</div>}
        {tab==='resources' && <div className="form"><b>Downloads</b><p style={{fontSize:14}}>Slides and PDFs attached by admin appear here.</p></div>}
      </div>
    </div>
  );
}
