import { NextRequest, NextResponse } from "next/server"

let totalHits = 0

const cursePool: Record<string, string[]> = {
  mouth: [
    "舌如长钉乱嚼舌，愿你顿顿吃泡面没有调料包！",
    "嘴比脑子快三倍，祝你每次语音输入都识别成乱码！",
    "嘴巴开过光是吧？愿你从此吃啥都塞牙！",
    "口若悬河滔滔不绝，祝你视频会议永远卡顿在关键帧！",
  ],
  head: [
    "满脑子坏水晃荡响，祝你脑回路永久性短路！",
    "脑袋里装的是浆糊吗？愿你从此WiFi永远只有一格信号！",
    "头顶三尺有神明，你这脑袋里全是小算盘！",
    "脑洞开太大容易进风，祝你灵感永远在截稿前5分钟枯竭！",
  ],
  "arm-left": [
    "左手暗箭伤人忙，愿你手机屏幕永远有划痕！",
    "左手打字比脑子快，祝你每次抢红包都手慢一步！",
    "暗箭伤人指尖狂，祝你逢抢红包必断网！",
    "左手伸那么长，愿你的键盘每隔三秒断连一次！",
  ],
  "arm-right": [
    "右手举报一时爽，愿你充电线永远接触不良！",
    "右手伸得太长了吧？祝你点外卖永远送错餐！",
    "指点江山右手忙，愿你导航永远偏航三百米！",
    "右手打字带节奏，祝你每次复制粘贴都格式错乱！",
  ],
  legs: [
    "跑得了和尚跑不了庙，愿你出门永远踩水坑！",
    "腿脚倒是挺快，祝你赶地铁永远刚好错过！",
    "脚底抹油溜得快，愿你鞋带永远自动松开！",
    "腿长不是为了跑路，愿你共享单车永远扫码失败！",
  ],
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getMockCurse(part: string): string {
  const curses = cursePool[part] || cursePool.mouth
  return pick(curses)
}

export async function POST(req: NextRequest) {
  let body: { event?: string; part?: string; deepMode?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: "请求格式错误" }, { status: 400 })
  }

  const { event, part = "mouth", deepMode = false } = body
  const apiKey = req.headers.get("x-api-key")

  // Deep mode requires API key
  if (deepMode && !apiKey) {
    return NextResponse.json(
      { success: false, error: "缺少 API Key —— 请在左侧输入 DeepSeek API Key" },
      { status: 401 }
    )
  }

  // If deep mode with valid key → call DeepSeek
  if (deepMode && apiKey) {
    try {
      const systemPrompt = [
        "你现在是赛博除怨局的判官。",
        "用户被暗算，请根据【事件：" + event + "】及被扎【部位：" + part + "】，",
        "生成一句恶毒、讽刺且幽默的赛博咒语。",
        "惩罚必须和被扎部位相关。纯文本，限30字内。",
      ].join("")

      const deepseekRes = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "请生成赛博咒语" },
          ],
          max_tokens: 100,
          temperature: 0.9,
        }),
      })

      if (deepseekRes.ok) {
        const json = await deepseekRes.json()
        const curse = json.choices?.[0]?.message?.content?.trim()
        if (curse) {
          totalHits++
          return NextResponse.json({
            success: true,
            curse: "【深度除怨·AI判官】" + curse,
            newTotalHits: totalHits,
          })
        }
      }
    } catch {
      // Fall through to mock
    }
  }

  // Mock fallback (no key, deep mode off, or DeepSeek error)
  {
    const delay = 600 + Math.random() * 500
    await new Promise((r) => setTimeout(r, delay))

    const curse = "【赛博判官】" + getMockCurse(part)
    totalHits++

    return NextResponse.json({
      success: true,
      curse,
      newTotalHits: totalHits,
    })
  }
}
