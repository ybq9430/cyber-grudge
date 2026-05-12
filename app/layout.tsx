import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "赛博除怨局 | Cyber Grudge",
  description: "输入你的黑状，扎针除怨！赛博朋克在线解压。",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-grid">{children}</body>
    </html>
  )
}
