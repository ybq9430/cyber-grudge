"use client"
import { useRef, useEffect } from "react"
import gsap from "gsap"

interface Props {
  event: string
  setEvent: (v: string) => void
  isTargetLocked: boolean
  setTargetLocked: (v: boolean) => void
  deepMode: boolean
  setDeepMode: (v: boolean) => void
  apiKey: string
  setApiKey: (v: string) => void
  loading: boolean
}

export default function InputArea({
  event, setEvent, isTargetLocked, setTargetLocked,
  deepMode, setDeepMode, apiKey, setApiKey, loading,
}: Props) {
  const apiKeyContainerRef = useRef<HTMLDivElement>(null)
  const lockBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!apiKeyContainerRef.current) return
    if (deepMode) {
      gsap.to(apiKeyContainerRef.current, {
        height: "auto", opacity: 1, duration: 0.35, ease: "power3.out",
      })
    } else {
      gsap.to(apiKeyContainerRef.current, {
        height: 0, opacity: 0, duration: 0.25, ease: "power2.in",
      })
    }
  }, [deepMode])

  function handleLock() {
    if (!event.trim()) return
    setTargetLocked(true)
    if (lockBtnRef.current) {
      gsap.fromTo(lockBtnRef.current,
        { scale: 1 },
        { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }
      )
    }
  }

  return (
    <div className="lg:w-80 flex-shrink-0 bg-[#14141f] border border-[#2a2a3a] rounded-xl p-5 flex flex-col">
      <h2 className="text-lg text-[#00ff88] mb-4 tracking-widest select-none">
        &#x25A0; 告密案卷区
      </h2>

      {/* Textarea */}
      <textarea
        className={`w-full flex-1 min-h-[130px] bg-[#0a0a0f] rounded-lg p-3.5 text-[#e0e0e0]
          placeholder-[#444] resize-none focus:outline-none text-sm leading-relaxed
          transition-all duration-500
          ${isTargetLocked
            ? "border border-[#ff4477]/60 cursor-not-allowed shadow-[0_0_12px_rgba(255,68,119,0.15)]"
            : "border border-[#2a2a3a] focus:border-[#00ff88]"
          }`}
        placeholder="他今天又打你什么小报告了？&#10;(100字以内)"
        maxLength={100}
        value={event}
        onChange={(e) => {
          if (!isTargetLocked) setEvent(e.target.value)
        }}
        readOnly={isTargetLocked}
        disabled={loading}
      />

      {/* Lock button */}
      {!isTargetLocked ? (
        <button
          ref={lockBtnRef}
          type="button"
          className={`mt-4 w-full py-2.5 rounded-lg font-bold tracking-[0.2em] text-sm
            transition-all duration-300 select-none
            ${event.trim()
              ? "bg-[#ff4477]/10 border border-[#ff4477] text-[#ff4477] hover:bg-[#ff4477]/20 hover:shadow-[0_0_20px_rgba(255,68,119,0.25)]"
              : "bg-[#1a1a2e] border border-[#2a2a3a] text-[#555] cursor-not-allowed"
            }`}
          onClick={handleLock}
          disabled={!event.trim() || loading}
        >
          &#x1F512; 锁定罪证
        </button>
      ) : (
        <div className="mt-4 w-full py-2.5 rounded-lg border border-[#ff4477]/40
          bg-[#ff4477]/5 text-[#ff4477]/80 text-center text-sm tracking-[0.2em] select-none">
          &#x1F512; 罪证已锁定
        </div>
      )}

      {!event.trim() && !isTargetLocked && (
        <p className="text-[#ff4477] text-xs mt-2 animate-pulse select-none">
          ※ 请输入黑状内容后锁定罪证再扎针
        </p>
      )}

      {/* Deep mode toggle */}
      <div className="flex items-center gap-3 mt-4 select-none">
        <button
          type="button"
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
            deepMode ? "bg-[#00ff88]" : "bg-[#2a2a3a]"
          } ${loading || isTargetLocked ? "" : ""}`}
          onClick={() => setDeepMode(!deepMode)}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md ${
              deepMode ? "translate-x-[26px]" : "translate-x-[2px]"
            }`}
          />
        </button>
        <span className="text-sm text-[#888] tracking-wide">
          ✨ 深度除怨 (接入大模型)
        </span>
      </div>

      {/* API Key slide-down */}
      <div ref={apiKeyContainerRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="pt-4 space-y-2">
          <input
            type="password"
            className="w-full bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg px-3.5 py-2.5
              text-[#e0e0e0] placeholder-[#444] text-sm focus:outline-none
              focus:border-[#00ff88] transition-colors"
            placeholder="输入 DeepSeek API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={loading}
          />
          <p className="text-[10px] text-[#00ff88]/60 tracking-wide select-none">
            * Key 仅保存在浏览器本地，绝不上传
          </p>
        </div>
      </div>
    </div>
  )
}
