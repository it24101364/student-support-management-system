export default function Breakdown({ title, values }) {
  const entries = Object.entries(values);
  const maximum = Math.max(...entries.map(([, value]) => value), 1);
  return <section className="breakdown"><h3>{title}</h3>{entries.map(([label, value]) => <div className="bar-row" key={label}><div className="bar-label"><span>{label.replaceAll('_', ' ')}</span><strong>{value}</strong></div><div className="bar-track"><span style={{ width: `${(value / maximum) * 100}%` }} /></div></div>)}</section>;
}
