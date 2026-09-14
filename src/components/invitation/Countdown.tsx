"use client";

import { useEffect, useState } from "react";
import { weddingData } from "@/data/wedding";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getParts(now: number): CountdownParts {
  const diff = Math.max(0, new Date(weddingData.dateISO).getTime() - now);

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

const EMPTY_PARTS: CountdownParts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export function Countdown({ className = "" }: { className?: string }) {
  const [parts, setParts] = useState<CountdownParts>(EMPTY_PARTS);

  useEffect(() => {
    const tick = () => setParts(getParts(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: String(parts.days) },
    { label: "Hours", value: pad(parts.hours) },
    { label: "Min", value: pad(parts.minutes) },
    { label: "Sec", value: pad(parts.seconds) },
  ];

  return (
    <div className={`countdown ${className}`} aria-label="Countdown to the wedding">
      {units.map((unit) => (
        <div className="count-unit" key={unit.label}>
          <span className="count-value">{unit.value}</span>
          <small className="count-label">{unit.label}</small>
        </div>
      ))}
    </div>
  );
}
