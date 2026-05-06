import { useState, useEffect } from 'react';

export default function CountdownTimer({ endTime, startTime }) {
  const calculateTime = () => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (now < start) return { label: 'Starts in:', diff: start - now, active: false };
    if (now > end) return { label: 'Ended', diff: 0, active: false };
    return { label: 'Ends in:', diff: end - now, active: true };
  };

  const [status, setStatus] = useState(calculateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(calculateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime, startTime]);

  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms / (1000 * 60)) % 60);
    const s = Math.floor((ms / 1000) % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase text-[#7CA8DC] font-bold">{status.label}</span>
      <span className={`text-xl font-mono font-bold ${status.active ? 'text-[#FFD372]' : 'text-gray-400'}`}>
        {formatTime(status.diff)}
      </span>
    </div>
  );
}