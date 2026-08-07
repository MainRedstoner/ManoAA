# 魔法少女的逆转裁判

此项目为《魔法少女的魔女审判》与《逆转裁判》的同人作品。鄙人技术有限，语文直到高一才上过 100 分，如有做得不好的地方请谅解。

## 项目结构

本项目分为两个部分：

### 1. 微信小程序 DEMO 版

目录：`wechat/`

详见：[微信小程序版介绍](wechat/README.md)

基于微信小程序的 DEMO 版本（含通用框架）。由于性能等问题，**已停止维护并弃用**。

> ⚠️ **强烈不建议**将此框架用于其他场景，其中可能存在大量未被发现的 bug。

### 2. Pygame 正式版 🔨

目录：`python/`

后续所有内容都将基于 Pygame 版本开发。**施工中。**

**运行**（Python 3.10 + pygame）：

```bash
cd python
python main.py          # 正常游玩（窗口 + 音频）
python api.py           # 无头 API 服务器（默认 http://127.0.0.1:8765）
python api.py --visible # 带窗口的 API 服务器
python verify.py        # 无头全剧情自动验证（43 项检查 + 截图）
```

#### 移植进度（微信小程序 → Pygame）

| 模块 | 状态 |
|------|------|
| Story 数据（348 节点，微信 story.js 100% 转换） | ✅ |
| 图鉴静态数据（34 条目，wechat/data/encyclopedia.js 转换） | ✅ |
| 动态图鉴条目（addEncyclopedia，id 35-38） | ✅ |
| 引擎：角色/背景/对话框/打字/选择按钮 | ✅ |
| 法庭模式（左/中/右 + 桌子遮罩） | ✅ |
| 追问（ask）/ 出示（present，含特殊证物链） | ✅ |
| 证言循环（3.28-3.35 / 4.25-4.27 / 4.36-4.41） | ✅ |
| conditionKeys + nextIfTrue/False + effectOnce | ✅ |
| 异议/证言动画（含 SE） | ✅ |
| 图鉴/历史/存档点/结局面板 | ✅ |
| BGM/BGS/SE/语音 | ✅ |
| 自动播放 / 跳过 | ✅ |
| 存档/读档 | ✅ |
| 结局判定（favorability ≥5→102, ≥3→101, else→100） | ✅ |

#### API（python/api.py）

零依赖 stdlib HTTP JSON API，所有坐标均为 1280x720 逻辑画布坐标。
所有输入通过真实 pygame 事件管线注入（点击 = 真鼠标点击）：

| 端点 | 说明 |
|------|------|
| `GET /api/state` | 完整状态快照：当前节点、打字进度、选项 rect、顶栏按钮 rect、角色 rect、图鉴/历史/存档点/结局面板所有可点击元素 rect、state 变量 |
| `POST /api/advance` | 点对话框（完成打字 / 下一节点） |
| `POST /api/click` | `{"x":..,"y":..}` 真实鼠标点击 |
| `POST /api/choose` | `{"index":0}` 点选项按钮 |
| `POST /api/button` | `{"action":"auto\|history\|savepoints\|encyclopedia\|present\|ask"}` |
| `POST /api/jump` | `{"node_id":"3.13"}` 跳转节点 |
| `POST /api/restart` / `load` / `save` / `quit` | 控制 |
| `GET /api/screenshot.png` | 当前帧 PNG |
| `GET /api/nodes` | 全部节点索引 |

#### 验证（python/verify.py）

无头（SDL dummy）驱动真实引擎走完 DEMO 全剧情，43 项断言：
- 静态完整性：所有 next/ask/condition 引用、全部图片/音频资源可解析
- 主线走查 1.1 → demo_end（278+ 节点），自动处理证人选择环（2.31）、
  证言循环逃逸（3.28-3.31 追问 / 4.39 出示照片）
- 结局面板：重新开始 / 读档回最后存档点
- UI：历史、存档点（3 个）、图鉴（34 静态 + 4 动态）、选项点击、自动播放
- 出示：错证物 → 默认目标（3.27.1）；照片 37 → 特殊目标（4.42）
- conditionKeys 链：追问全部 4 条证言 → 3.prechoice → 3.choice（两条分支都验证）

截图输出到 `python/verify_shots/`。

## 获取最新动态

- **Bilibili：** [没雷石东呢](https://space.bilibili.com/3546584031693479)
