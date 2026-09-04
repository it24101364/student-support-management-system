import { Link, Outlet } from 'react-router-dom';

export default function PublicShell() {
  return <div className="public-frame"><div className="public-visual"><div className="visual-top"><span className="brand-mark">S</span><span>StudentSupport</span></div><div className="visual-copy"><p className="eyebrow light">Your campus, supported.</p><h1>Make progress<br />on what matters.</h1><p>One calm place to raise concerns, request support, and stay informed.</p></div><div className="visual-footer"><span>●</span> Built for better student experiences</div></div><div className="public-content"><Link className="public-back" to="/"><span>←</span> StudentSupport</Link><Outlet /></div></div>;
}
