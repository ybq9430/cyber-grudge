"use client"
import { useEffect, useRef } from "react"
import gsap from "gsap"

interface Props {
  curse: string
  visible: boolean
}

export default function CurseBubble({ curse, visible }: Props) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const prevCurseRef = useRef("")

  useEffect(() => {
    if (visible && bubbleRef.current) {
      if (curse !== prevCurseRef.current) {
        prevCurseRef.current = curse
        gsap.fromTo(
          bubbleRef.current,
          { opacity: 0, scale: 0.3, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
        )
      } else {
        gsap.fromTo(
          bubbleRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
        )
      }
    }
  }, [visible, curse])

  if (!visible) return null

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      style={{ marginTop: "-10px" }}>
      <div
        ref={bubbleRef}
        className="bg-[#1a1a2e] border border-[#ff4477] rounded-xl px-5 py-3.5 max-w-xs"
        style={{ boxShadow: "0 0 25px rgba(255,68,119,0.35)" }}
      >
        <p className="text-[#ff4477] text-sm text-center leading-relaxed whitespace-pre-wrap">
          {curse}
        </p>
      </div>
      <div className="mx-auto w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px]
        border-l-transparent border-r-transparent border-t-[#ff4477]" />
    </div>
  )
}
