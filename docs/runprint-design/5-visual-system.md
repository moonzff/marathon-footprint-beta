# Runprint 跑印 · 视觉系统规范 (P3 视觉下半 · 落地)

> 阶段 3 视觉收口 —— 承接 `3-visual-strategy.md`(疆域=显影 Develop)与 `4-logo-develop.md`(主标方向)。
> 本文是**开发可直接消费的视觉规范**:标志、色彩、字体、组件、两态。配套 `tokens.css` / `tokens.json` / `assets/`。
> 状态:视觉效果样例已确认(2026-06-20)。**开发据此搭产品框架;具体 UI 屏回到设计侧产出。**

---

## 0. 一句话定调
出版社 / 暗房 / 签发机构的气质——**显影、签发、归档、见证**,而不喊、不烧、不炫。
核心定律:**由暗到亮,从散落显影成形。**

## 1. 标志系统(各司一职)
| 用途 | 资源 | 说明 |
|---|---|---|
| **主标** 图腾·指纹奔跑者 | `assets/logo-totem.png` | 隐喻最足:**指纹=唯一身份,奔跑者=跑者本人**。工作主力 · App 图标 / favicon · 海报与页面主视觉 · 段位大章 · 低透明水印(opacity 0.08–0.16) |
| 辅标 R+足印 | `assets/logo-primary.png` | R=Run、足趾=印/足迹。字标锁定、横向署名、**极小尺寸(≤20px 比图腾更清晰)备用** |
| **认证戳** 邮戳 | `assets/logo-seal.png` / `-light.png` | 完赛认证、验真、海报右下钤印 |
| 变体规格 | `assets/logo-variants.png` | 仅符号 / 单色 / 反白 / 小尺寸(48·32·20·16px) |

> **主标归属(创始人 2026-06-20 决策):图腾(指纹奔跑者)定为主 logo**,取代初版"R+足印"主标方案;R+足印降为辅标 / 极小尺寸备用。favicon 与 App 图标已切到图腾。

规则:PNG 透明底,可置于任意背景;**不得在调色板外重新着色**;留白≥标志高度的 25%。极小尺寸(≤20px)图腾指纹细节易糊,可回退辅标 R+足印或图腾的"仅符号"裁切。

## 2. 色彩(见 tokens)
- **暗房黑** `#0E0F0D` 主底(暖向带褐,非纯黑) · 卡片 `#15140F` · 底片棕黑 `#1C1810` · 描边 `#23211A`
- **显影金** `#C99A55`(主色,哑光旧金) · 高亮 `#E8C07A` · **暖象牙** `#E8D6A8`(数据/定影高光)
- **安全灯红** `#8C2D1E` —— 仅 CTA / 验证语境,**全屏占比 < 3%**
- **纸白** `#F4ECDA` —— 亮态(工具页/正文/打印)
- 红线:金必哑光旧金(非奖牌亮金、非冷银);黑必暖向带褐(冷向即滑科技/电竞)。
- **显影曲线**(`--rp-grad-develop`):进度条/加载/“被看见”叙事都走由暗到亮。

## 3. 字体
| 角色 | 字族 | 用法 |
|---|---|---|
| 标题/称号/段位 | **现代宋** `Noto Serif SC` (+ `Playfair Display` 英文) | 碑刻/证书的分量 |
| 正文/界面 | `Inter` + `Noto Sans SC` | 中立、克制、可读 |
| **数据** | **`IBM Plex Mono`** + `tabular-nums` | 成绩/配速/等级/百分位/日期 **永远等宽对齐**(命门) |

移动端字阶:display 56(成绩 mono)· h1 34 · h2 23 · title 16 · body 14 · caption 11(mono eyebrow)。

## 4. 组件配方(CSS 用 tokens)
```css
/* 卡片 */ .rp-card{background:var(--rp-card);border:1px solid var(--rp-border);border-radius:var(--rp-r-md);padding:var(--rp-s-5);}
/* 数据块 */ .rp-stat .v{font-family:var(--rp-font-mono);font-variant-numeric:tabular-nums;color:var(--rp-ivory);}
            .rp-stat .k{font-size:var(--rp-fz-micro);color:var(--rp-text-muted);}
/* 等级章 chip */ .rp-grade{display:inline-flex;align-items:center;gap:7px;white-space:nowrap;
  background:rgba(201,154,85,.12);border:1px solid rgba(201,154,85,.32);border-radius:20px;padding:5px 12px;color:var(--rp-ivory);}
/* 主按钮(CTA) */ .rp-btn{border:none;border-radius:var(--rp-r-sm);padding:15px;background:var(--rp-grad-gold);
  color:#2A2008;font-weight:600;}
/* 进度条 */ .rp-bar{height:5px;background:var(--rp-border);border-radius:3px;overflow:hidden;}
            .rp-bar>i{display:block;height:100%;background:var(--rp-grad-develop);}
```
模式:卡片留白为主、分隔靠间距与 1px 描边;数据右对齐成列;图腾做低透明水印;认证戳钤右下。

## 5. 两态(一套色)
- **暗房黑(默认)**:身份页、完赛峰值、海报、分享。
- **纸白亮态**:工具页(导入/OCR/设置)、长正文、打印导出——“走出暗房看成品”。两态共用同一调色板两端。

## 6. 动效签名
**显影成像**:出现=由暗到亮、由糊到清、对焦定影。加载不是 spinner,是“正在冲洗的照片”。慢、稳、无弹跳/闪光;唯一的“快”是定影锁定那一下。

## 7. 设计原则(裁判,沿用 3-visual-strategy)
① 凭证感不是仪表盘 · ② 克制即权威 · ③ 显影而非点燃 · ④ 你的印不是我们的奖 · ⑤ 精确到可被核验。

## 8. 已产出参考(设计侧 .dc.html)
- 品牌视觉系统总览 · 关键界面样例(生涯主页/完赛详情/段位页)。UI 屏由设计侧继续产出,开发对接 tokens 与本规范即可。

---
配套文件:`tokens.css` · `tokens.json` · `assets/`(logo 全套)。
