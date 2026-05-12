"use client"
import { useRef, useCallback } from "react"
import gsap from "gsap"

interface Props {
  onStrike: (part: string) => void
  loading: boolean
  isTargetLocked: boolean
}

const PART_CONFIG: Record<string, {
  refKey: "headRef" | "mouthRef" | "armLeftRef" | "armRightRef" | "legsRef"
  transformOrigin: string
  animation: "rotate" | "scale" | "skew" | "shake"
}> = {
  head:     { refKey: "headRef",     transformOrigin: "50% 34%", animation: "rotate" },
  mouth:    { refKey: "mouthRef",    transformOrigin: "center",  animation: "scale" },
  "arm-left":  { refKey: "armLeftRef",  transformOrigin: "85% 42%", animation: "shake" },
  "arm-right": { refKey: "armRightRef", transformOrigin: "15% 42%", animation: "shake" },
  legs:     { refKey: "legsRef",     transformOrigin: "50% 0%",  animation: "skew" },
}

export default function Doll({ onStrike, loading, isTargetLocked }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const headRef = useRef<SVGGElement>(null)
  const mouthRef = useRef<SVGGElement>(null)
  const armLeftRef = useRef<SVGGElement>(null)
  const armRightRef = useRef<SVGGElement>(null)
  const legsRef = useRef<SVGGElement>(null)

  const refMap = {
    headRef, mouthRef, armLeftRef, armRightRef, legsRef,
  }

  const playStrikeAnimation = useCallback((partId: string) => {
    const config = PART_CONFIG[partId]
    if (!config) return

    const ref = refMap[config.refKey]
    if (!ref.current) return

    // 1. Global x-axis screen shake (gsap.fromTo as specified)
    if (svgRef.current) {
      gsap.fromTo(svgRef.current,
        { x: -6 },
        {
          x: 6, duration: 0.04, repeat: 7, yoyo: true, ease: "none",
          onComplete: () => gsap.set(svgRef.current, { x: 0 }),
        }
      )
    }

    // 2. Collect stroke elements, flash red
    const strokeEls = ref.current.querySelectorAll<SVGElement>("[stroke]")
    const originals = new Map<SVGElement, string | null>()
    strokeEls.forEach((el) => {
      const s = el.getAttribute("stroke")
      if (s && s !== "none" && s !== "transparent") {
        originals.set(el, s)
        el.setAttribute("stroke", "#ff0000")
      }
    })

    // Also flash fill elements (eyes)
    const fillEls = ref.current.querySelectorAll<SVGElement>("[fill]")
    const fillOriginals = new Map<SVGElement, string | null>()
    fillEls.forEach((el) => {
      const f = el.getAttribute("fill")
      if (f && f !== "none" && f !== "transparent") {
        fillOriginals.set(el, f)
        el.setAttribute("fill", "#ff0000")
      }
    })

    // 3. Scale up and recover with elastic.out
    gsap.fromTo(ref.current,
      { scale: 1 },
      {
        scale: 1.2,
        duration: 0.25,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(ref.current, {
            scale: 1,
            duration: 0.9,
            ease: "elastic.out(1, 0.4)",
            onComplete: () => {
              // Restore original colors
              originals.forEach((color, el) => el.setAttribute("stroke", color!))
              fillOriginals.forEach((color, el) => el.setAttribute("fill", color!))
            },
          })
        },
      }
    )
  }, [])

  function handleStrike(part: string) {
    if (loading || !isTargetLocked) return
    playStrikeAnimation(part)
    onStrike(part)
  }

  const glowIntensity = isTargetLocked ? 0.35 : 0.08
  const cursor = loading
    ? "cursor-wait"
    : isTargetLocked ? "cursor-crosshair" : "cursor-not-allowed"

  return (
    <div className="flex items-center justify-center h-[520px]">
      <svg
        ref={svgRef}
        viewBox="0 0 300 400"
        className="w-72 h-auto select-none transition-all duration-500"
        style={{
          filter: `drop-shadow(0 0 ${isTargetLocked ? 20 : 4}px rgba(0,255,136,${glowIntensity}))`,
        }}
      >
        {/* Head group */}
        <g ref={headRef} id="head" className={cursor}
          onClick={(e) => { e.stopPropagation(); handleStrike("head") }}>
          <circle cx="150" cy="80" r="45" fill="none" stroke="#00ff88" strokeWidth="2.5" />
          <circle className="doll-eye" cx="134" cy="75" r="4.5" fill="#00ff88" />
          <circle className="doll-eye" cx="166" cy="75" r="4.5" fill="#00ff88" />
          <path d="M 142 90 Q 150 94 158 90" fill="none" stroke="#00ff88" strokeWidth="1.2" opacity="0.6" />
        </g>

        {/* Mouth */}
        <g ref={mouthRef} id="mouth" className={cursor}
          onClick={(e) => { e.stopPropagation(); handleStrike("mouth") }}>
          <rect x="138" y="93" width="24" height="10" rx="3" fill="none" stroke="#ff4477" strokeWidth="2" />
          <line x1="144" y1="98" x2="156" y2="98" stroke="#ff4477" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Body */}
        <line x1="150" y1="125" x2="150" y2="230" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round" />

        {/* Left Arm */}
        <g ref={armLeftRef} id="arm-left" className={cursor}
          onClick={(e) => { e.stopPropagation(); handleStrike("arm-left") }}>
          <line x1="150" y1="155" x2="95" y2="120" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="93" cy="118" r="6" fill="none" stroke="#00ff88" strokeWidth="1.5" opacity="0.6" />
        </g>

        {/* Right Arm */}
        <g ref={armRightRef} id="arm-right" className={cursor}
          onClick={(e) => { e.stopPropagation(); handleStrike("arm-right") }}>
          <line x1="150" y1="155" x2="205" y2="120" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="207" cy="118" r="6" fill="none" stroke="#00ff88" strokeWidth="1.5" opacity="0.6" />
        </g>

        {/* Legs */}
        <g ref={legsRef} id="legs" className={cursor}
          onClick={(e) => { e.stopPropagation(); handleStrike("legs") }}>
          <line x1="150" y1="230" x2="115" y2="295" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="150" y1="230" x2="185" y2="295" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="110" y1="295" x2="120" y2="295" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <line x1="180" y1="295" x2="190" y2="295" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        </g>

        {/* Antenna */}
        <line x1="150" y1="35" x2="150" y2="15" stroke="#00ff88" strokeWidth="1.5" opacity="0.5" />
        <circle cx="150" cy="13" r="3" fill="none" stroke="#ff4477" strokeWidth="1" opacity="0.6" />
      </svg>

      {/* Locked indicator */}
      {!isTargetLocked && (
        <p className="absolute bottom-16 text-[#555] text-xs tracking-[0.3em] animate-pulse select-none">
          请先锁定罪证
        </p>
      )}
    </div>
  )
}
