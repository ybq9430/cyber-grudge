"use client"
import { useState, useCallback, useEffect } from "react"
import StatsHeader from "@/components/StatsHeader"
import Marquee from "@/components/Marquee"
import InputArea from "@/components/InputArea"
import CurseBubble from "@/components/CurseBubble"
import Doll from "@/components/Doll"

function loadApiKey(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("cyber_grudge_api_key") || ""
}

function saveApiKey(key: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("cyber_grudge_api_key", key)
}

export default function Home() {
  const [totalHits, setTotalHits] = useState(0)
  const [event, setEvent] = useState("")
  const [isTargetLocked, setTargetLocked] = useState(false)
  const [deepMode, setDeepMode] = useState(false)
  const [apiKey, setApiKeyState] = useState("")
  const [curse, setCurse] = useState("")
  const [showBubble, setShowBubble] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setApiKeyState(loadApiKey())
  }, [])

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key)
    saveApiKey(key)
  }, [])

  const handleStrike = useCallback(
    async (part: string) => {
      if (loading || !isTargetLocked) return
      if (deepMode && !apiKey.trim()) return

      setLoading(true)
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        if (deepMode && apiKey.trim()) {
          headers["x-api-key"] = apiKey.trim()
        }

        const res = await fetch("/api/curse", {
          method: "POST",
          headers,
          body: JSON.stringify({ event: event.trim(), part, deepMode }),
        })
        const data = await res.json()
        if (data.success) {
          setCurse(data.curse)
          setShowBubble(true)
          setTotalHits(data.newTotalHits)
          setTimeout(() => setShowBubble(false), 5000)
        }
      } catch {
        // silent — catharsis delivered
      } finally {
        setLoading(false)
      }
    },
    [event, deepMode, loading, isTargetLocked, apiKey]
  )

  return (
    <main className={`min-h-screen bg-[#0a0a0f] text-[#e0e0e0] relative overflow-hidden ${loading ? "cursor-wait" : ""}`}>
      <StatsHeader totalHits={totalHits} />
      <Marquee />

      <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto mt-6">
        <InputArea
          event={event}
          setEvent={setEvent}
          isTargetLocked={isTargetLocked}
          setTargetLocked={setTargetLocked}
          deepMode={deepMode}
          setDeepMode={setDeepMode}
          apiKey={apiKey}
          setApiKey={setApiKey}
          loading={loading}
        />

        <div className="flex-1 relative flex items-center justify-center">
          <CurseBubble curse={curse} visible={showBubble} />
          <Doll onStrike={handleStrike} loading={loading} isTargetLocked={isTargetLocked} />
        </div>
      </div>
    </main>
  )
}
