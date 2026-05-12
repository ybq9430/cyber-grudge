"use client"
import { useEffect, useState, useRef } from "react"

export default function StatsHeader({ totalHits }: { totalHits: number }) {
  const [display, setDisplay] = useState(0)
  const prevRef = useRef(0)

  useEffect(() => {
    const from = prevRef.current
    prevRef.current = totalHits
    const diff = totalHits - from
    if (diff <= 0) return

    const duration = 600
    let frame: number
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + diff * eased))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [totalHits])

  return (
    <header className="text-center py-7 border-b border-[#2a2a3a] relative">
      <h1
        className="text-5xl font-bold tracking-[0.3em] text-[#00ff88] mb-2 select-none"
        style={{ textShadow: "0 0 30px rgba(0,255,136,0.5)" }}
      >
        赛博除怨局
      </h1>
      <p
        className="text-base text-[#ff4477] tracking-[0.4em] select-none"
        style={{ textShadow: "0 0 15px rgba(255,68,119,0.4)" }}
      >
        CYBER GRUDGE · 有怨报怨 · 赛博扎针
      </p>
      <div className="mt-5 text-lg">
        <span className="text-[#666]">今日灵山超度总数：</span>
        <span
          className="text-[#00ff88] font-bold text-3xl ml-1 tabular-nums"
          style={{ textShadow: "0 0 25px rgba(0,255,136,0.6)" }}
        >
          {display.toLocaleString()}
        </span>
      </div>
    </header>
  )
}
