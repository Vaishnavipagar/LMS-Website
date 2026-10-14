import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COURSES, fmt } from '../data/courses.js';
import { useAuth } from '../store/auth.jsx';

export default function Checkout() {
  const { id } = useParams();
  const nav = useNavigate();
  const { enroll } = useAuth();
  const c = COURSES.find((x) => x.id === id);
  const [mode, setMode] = useState('UPI');
  const [code, setCode] = useState('LEARN20');
  const [paying, setPaying] = useState(false);
  if (!c) return <div className="container" style={{padding:100}}>Not found</div>;
  const discount = code.trim().toUpperCase() === 'LEARN20' ? Math.round(c.price * 0.2) : 0;
  const total = c.price - discount;
  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      enroll(c.id, { mode, amount: total, at: new Date().toISOString(), txn: 'TXN' + Date.now() });
      nav('/learn/' + c.id);
    }, 1200);
  };
  return (
    <div className="container" style={{padding:'40px 28px',maxWidth:980}}>
      <h1 style={{fontSize:34,letterSpacing:'-.03em'}}>Secure Checkout</h1>
      <p style={{color:'#6C7261'}}>Production integrates Razorpay / Stripe + Supabase orders table. This is a functional frontend mock.</p>
      <div className="co-grid" style={{marginTop:20}}>
        <div className="form">
          <div className="tabs">{['UPI','Card','NetBanking'].map((m)=><button key={m} className={mode===m?'on':''} onClick={()=>setMode(m)}>{m}</button>)}</div>
          {mode==='UPI' && <><label className="lbl">UPI ID</label><input className="input" placeholder="name@upi" /></>}
          {mode==='Card' && <><div className="two"><div><label className="lbl">Card number</label><input className="input" placeholder="4111 2222 3333 4444" /></div><div><label className="lbl">Expiry</label><input className="input" placeholder="12/28" /></div></div><label className="lbl">Name on card</label><input className="input" placeholder="Full name" /></>}
          {mode==='NetBanking' && <><label className="lbl">Bank</label><select className="input"><option>HDFC Bank</option><option>SBI</option><option>ICICI</option></select></>}
          <label className="lbl">Promo code</label>
          <div style={{display:'flex',gap:8}}><input className="input" value={code} onChange={(e)=>setCode(e.target.value)} /><button className="btn btn-light btn-sm">Apply</button></div>
          <button className="btn btn-dark" style={{width:'100%',marginTop:18}} disabled={paying} onClick={pay}>{paying ? 'Processing payment...' : `Pay ${fmt(total)}`}</button>
          <p style={{fontSize:12,color:'#6C7261',marginTop:10}}>Isolated checkout: student token only, never admin token. 7-day refund policy.</p>
        </div>
        <div className="form">
          <b>Order summary</b>
          <div style={{display:'flex',gap:12,marginTop:12}}><div style={{width:64,height:64,borderRadius:12,background:c.color,display:'grid',placeItems:'center',color:'#fff',fontWeight:800}}>{c.thumb.slice(0,2)}</div><div><b style={{fontSize:14}}>{c.title}</b><div style={{fontSize:12,color:'#6C7261'}}>{c.instructor} · Lifetime</div></div></div>
          <div style={{fontSize:14,marginTop:14,display:'grid',gap:6}}><div style={{display:'flex',justifyContent:'space-between'}}><span>Price</span><span>{fmt(c.price)}</span></div><div style={{display:'flex',justifyContent:'space-between'}}><span>Discount</span><span>− {fmt(discount)}</span></div><div style={{display:'flex',justifyContent:'space-between',fontWeight:800,borderTop:'1px solid #E3E3D6',paddingTop:8}}><span>Total</span><span>{fmt(total)}</span></div></div>
        </div>
      </div>
    </div>
  );
}
