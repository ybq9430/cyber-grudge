"use client"
import { useEffect, useState } from "react"

const templates = [
  { region: "广东", part: "嘴巴", curse: "让你多嘴！" },
  { region: "北京", part: "左手", curse: "叫你乱发邮件！" },
  { region: "上海", part: "脑袋", curse: "脑子进水了吧！" },
  { region: "深圳", part: "右手", curse: "手贱是吧！" },
  { region: "杭州", part: "腿", curse: "跑那么快干嘛！" },
  { region: "四川", part: "嘴巴", curse: "嚼舌根遭雷劈！" },
  { region: "江苏", part: "脑袋", curse: "清醒一点！" },
  { region: "福建", part: "腿", curse: "别跑！" },
  { region: "东北", part: "右手", curse: "让你瞎指划！" },
  { region: "湖南", part: "嘴巴", curse: "让你阴阳怪气！" },
  { region: "重庆", part: "左手", curse: "让你偷偷摸摸！" },
  { region: "湖北", part: "脑袋", curse: "满脑子骚操作！" },
]

function shuffleAndPick(): string[] {
  return [...templates]
    .sort(() => Math.random() - 0.5)
    .map((t) => `[ 战报 ] ${t.region}网友刚刚重击了小人的${t.part}：${t.curse}`)
}

export default function Marquee() {
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    setMessages(shuffleAndPick())
    const interval = setInterval(() => {
      setMessages(shuffleAndPick())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (messages.length === 0) return null

  return (
    <div className="bg-[#14141f] border-y border-[#2a2a3a] py-2.5 overflow-hidden select-none">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {messages.concat(messages).map((msg, i) => (
          <span key={i} className="text-[#777] text-sm tracking-wider mx-8">
            {msg}
          </span>
        ))}
      </div>
    </div>
  )
}
