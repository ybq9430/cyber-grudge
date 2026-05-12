# 赛博除怨局 (Cyber Grudge)

> 有怨报怨 · 赛博扎针 · AI 判官在线超度

赛博朋克风格的在线解压互动应用。输入你被暗算的"黑状"，锁定罪证，点击 SVG 小人扎针，获得 AI 生成（或本地）的讽刺诅咒作为精神补偿。

<img width="1471" height="926" alt="a5dfb5c699d7860488891866168726b2" src="https://github.com/user-attachments/assets/d6589b4e-deb7-45f7-a941-1199ec7bfeeb" />

## 在线体验

```bash
npm install
npm run dev
# 浏览器打开 http://localhost:3000
```

## 怎么玩

1. **输入黑状** — 左侧文本区写下你被暗算的事件（限 100 字）
2. **锁定罪证** — 点击 🔒 按钮，textarea 变红锁定，小人发光就绪
3. **扎针** — 点击小人身体任意部位：
   - 🧠 **头** — 360° 旋转 + 蚊香眼
   - 👄 **嘴** — 弹性放大扭曲
   - 💪 **左右手** — 关节抽搐
   - 🦵 **腿** — 扭曲变形
4. **看诅咒** — 气泡弹出 AI/本地诅咒，5 秒后消失

## 深度除怨（接入大模型）

打开左侧"✨ 深度除怨"开关，填入你的 [DeepSeek API Key](https://platform.deepseek.com/api_keys)。Key 仅保存在浏览器本地（localStorage），绝不上传。

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 3 |
| 动画 | GSAP 3 |
| AI | DeepSeek Chat API（可选，有 Mock 兜底） |

## 项目结构

```
├── app/
│   ├── page.tsx              # 主页面 — 状态管理中心
│   ├── layout.tsx            # 根布局
│   ├── globals.css           # 全局样式 + 关键帧
│   └── api/curse/route.ts    # POST 端点（DeepSeek 调用 + Mock 降级）
└── components/
    ├── Doll.tsx              # SVG 小人 + GSAP 动画引擎
    ├── InputArea.tsx         # 输入面板（锁定 + 开关 + Key）
    ├── CurseBubble.tsx       # 诅咒气泡
    ├── Marquee.tsx           # 滚动弹幕
    └── StatsHeader.tsx       # 计数器
```

## API

`POST /api/curse`

```json
// 请求
{ "event": "小明打小报告", "part": "mouth", "deepMode": false }

// 响应
{ "success": true, "curse": "【赛博判官】舌如长钉...", "newTotalHits": 12346 }
```

深度除怨模式下需带 `x-api-key` Header，服务端转发至 DeepSeek API，失败时自动降级为本地 Mock。
