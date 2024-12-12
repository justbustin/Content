import { useState } from 'react';

export default function Metric({ text, color, expandedText }) {
  const [expanded, setExpanded] = useState(false);

  const style = {
    backgroundColor: color,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    borderRadius: '10px',
    padding: '20px',
    width: '100%',
    gap: '20px',
    height: expanded ? 'auto' : 'auto',
  };

  return (
    <div style={style} onClick={() => setExpanded(!expanded)}>
      <p style={{ fontSize: '1rem' }}>{text}</p>
      {expanded && (
        <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>{expandedText}</p>
      )}
    </div>
  );
}
