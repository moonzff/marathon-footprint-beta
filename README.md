# 跑马纪念册 Beta

一个面向跑友的马拉松完赛纪念册内测版。它把完赛成绩、城市足迹、赛事档案、同场跑友和完赛海报放在一个移动端优先的 Web 应用里。

线上演示：

- Beta 页面：https://jazzy-druid-e55701.netlify.app/beta
- 邀请码：`RUN2026`

## 功能

- 移动端优先的跑马护照、城市足迹地图、完赛档案和个人主页。
- 成绩单截图 OCR，支持读取赛事、项目、净计时成绩、总排名、性别排名和年龄组排名。
- 赛事样本覆盖多个国内马拉松/半马，并支持 2026 咸宁马拉松、2026 湘江半程马拉松等别名匹配。
- 大众等级根据项目、性别、出生日期、比赛日期和成绩自动计算。
- 完赛档案支持新增、编辑、删除。
- 可选上传赛事路线图、参赛服、奖牌和号码布素材。
- 完赛海报支持不同展示重点和跑者风格，例如佛系跑者、严肃竞速、赛道香风、视频出片。
- Netlify Functions + Netlify Blobs 用于内测共享数据；本地预览时可自动回退到浏览器本地存储。

## 技术栈

- 原生 HTML/CSS/JavaScript
- Leaflet 地图
- Tesseract.js 浏览器端 OCR
- Netlify Functions
- Netlify Blobs

## 本地运行

安装依赖：

```bash
npm install
```

运行一个静态本地服务：

```bash
python3 -m http.server 8765
```

打开：

```text
http://localhost:8765/beta.html
```

说明：本地 `python3 -m http.server` 不会提供 Netlify Functions，所以页面会自动使用浏览器本地存储。要完整模拟线上共享数据，需要使用 Netlify CLI。

## Netlify 部署

项目包含 `netlify.toml` 和 `netlify/functions/api.mjs`。在已登录 Netlify CLI 的环境中，可以部署：

```bash
npx --yes netlify-cli deploy --prod --dir . --functions netlify/functions --skip-functions-cache
```

如果部署到已有站点，需要追加 `--site <site-id>`。

## 测试

运行 OCR 和关键交互回归测试：

```bash
npm test
```

测试覆盖：

- 禁止假 OCR 和随机生成成绩。
- 成绩单上传入口必须在手动字段之前。
- 2026 咸宁马拉松和 2026 湘江半程马拉松识别。
- 净计时成绩优先于枪声成绩。
- 性别排名和总排名优先取净计时排名。
- 档案删除不会被远端合并复活。
- 移动端滚动、档案编辑/删除、跑者风格、地图点位等关键 UI 回归。

## 项目结构

```text
.
├── assets/                  # 页面视觉素材
├── beta.html                # 内测主应用
├── index.html               # Demo/介绍页
├── netlify.toml             # Netlify 配置和路由
├── netlify/functions/api.mjs# Netlify Blobs 数据接口
├── package.json
├── package-lock.json
└── test-ocr-logic.mjs       # 回归测试
```

## 注意事项

- OCR 依赖图片清晰度、字体和截图裁剪质量；识别失败时页面会要求手动确认，不会自动写入默认赛事。
- 内测共享数据适合小规模跑友测试，不适合作为生产级多用户权限系统。
- 当前应用是前端原型 + 轻量服务端数据层，后续生产化需要补登录、权限、数据模型和持久化策略。
