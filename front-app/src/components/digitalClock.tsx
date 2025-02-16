"use client";

import { useEffect, useState } from "react";

export function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-3xl font-bold flex">
      <p>現在時刻</p>
      <p>{time.toLocaleTimeString("ja-JP")}</p>
    </div>
  );
}
