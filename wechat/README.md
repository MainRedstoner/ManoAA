# `魔法少女的逆转裁判` 相关介绍

> **《魔法少女的逆转裁判》**（ManosabaAA）是一款逆转裁判风格的视觉小说推理游戏。玩家扮演粉色小狗**樱羽艾玛**，在完全封闭的魔女岛上解决院审难题，通过讯问证人、出示证物、找出矛盾来揭开案件真相，~~追到希罗~~。
该小程序几乎完全使用 DeepSeek V4 开发，资源托管使用 腾讯 CNB 平台。

完整版新闻请关注 B 站：***`没雷石东呢`***

此游戏模板可应用到其他剧情，有需求者请自行阅读学习以下方法。


# `data/story.js` — 剧情脚本使用方法
---

剧情脚本由剧情节点对象数组构成，每个节点是一个对象，通过 `next` 字段串联成流程。

---

## 基本节点

```js
{
  id: '1.1',         // 节点唯一 ID（字符串或数字）
  speaker: '角色名',  // 发言者名字
  text: '对话内容',   // 对话文本
  next: '1.2'         // 跳转到下一节点 ID，最后一个节点不填
}
```

---

## 全部字段参考

### 基础 ⭐
| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string / number | 节点唯一标识，如 `'1.1'` |
| `next` | string | 跳转到下一个节点的 ID |
| `speaker` | string | 发言者名字，显示在对话框上方 |
| `text` | string | 对话文本，支持 `\\n` 换行 |
| `skip` | number / `'click'` | 自动跳过秒数（如 `1` = 1秒）；`'click'` = 必须点击 |

> 当节点不设置 `text`（或 `text: ""`）时，对话框区域隐藏，点击全屏透明层推进到下一节点。

### 选项分支
| 字段 | 类型 | 说明 |
|------|------|------|
| `choices` | object[] | 选项列表，每个选项包含 `text`（显示文字）、`next`（跳转 ID）和可选的 `effect`（状态变化） |

```js
choices: [
  { text: "夏目安安", next: "2.31.1" },
  { text: "泽渡可可", next: "2.32", effect: { favorability: -1 } },
  { text: "矢张政治", next: "2.31.9" }
]
```

> 选项节点不设置 `text`（或设置 `text: ""`），否则会在选项上方显示对话文本。
>
> 每个选项可附带 `effect` 对象，选中时立即生效（如增减 favorability），与节点级 `effect` 独立。

### 背景 🖼️
| 字段 | 类型 | 说明 |
|------|------|------|
| `bg` | string | 背景图片 URL |
| `bgMode` | `'aspectFit'` | 背景缩放模式，不填默认 `aspectFill`（裁切填满）；`aspectFit` = 完整显示不裁切 |
| `bgVideo` | string | 背景视频 URL（有视频时代替 `bg`） |
| `bgPoster` | string | 视频封面图 URL（加载前显示） |
| `bgVideoLoop` | boolean | 视频是否循环，默认 `true` |
| `bgVideoMode` | string | 视频 object-fit 模式，默认 `'cover'` |
| `dark` | `'01'` / `'10'` | 暗场过渡：`'01'` = 淡入（黑→亮），`'10'` = 淡出（亮→黑） |
| `darkDuration` | number | 暗场过渡时长（毫秒），不填默认 `1000` |

```js
// 示例：500ms 快速暗场
{ id: "2.1", dark: "01", darkDuration: 500, next: "2.2" }
```

#### 视频行为
- 视频加载失败时自动回退：若有后续文本则继续剧情，否则将 `bgVideo` 置空改用静态 `bg`
- 非循环视频（`bgVideoLoop: false`）播完后自动推进到下一节点
- 点击视频区域等同于点击对话框（推进文本或跳转）

### 角色立绘 👤
| 字段 | 类型 | 说明 |
|------|------|------|
| `character` | string[] | 立绘图片 URL 数组 |
| `characterEnterAnim` | number[] | 入场动画：`0` = 无、`1` = 旋转入场、`2` = 淡入 |
| `characterExitAnim` | number[] | 退场动画：`0` = 无、`3` = 旋转退场、`4` = 淡出 |

多角色示例：
```js
character: ["url_a", "url_b", "url_c"],
characterEnterAnim: [2, 1, 0],   // 依次：淡入、旋转、无
characterExitAnim: [4, 3, 0],    // 依次：淡出、旋转、无
```

> 只有同时设置了 `speaker` 和 `character` 的节点才会显示角色立绘。
>
> 立绘高度在普通模式下为 `窗口高度 × 1.2`，法庭 `court='left'/'right'` 模式下为 `窗口高度 × 1.0`（撑满），宽度按图片原始宽高比自动计算。

### 法庭模式 ⚖️
| 字段 | 类型 | 说明 |
|------|------|------|
| `court` | `'left'` / `'right'` / `'mid'` | 法庭镜头位置 |
| `table` | string | 桌子图片 URL（court 模式下叠加显示） |
| `judge` | boolean | `true` 时顶部栏显示「追问」「出示」按钮 |

> `court = 'left'` / `'right'` 时：竖屏高度 100% 紧贴侧边；宽屏放大裁切，角部紧贴屏幕边缘。
>
> 屏幕宽高比 > 16:9（超宽屏）时，背景垂直对齐自动切换为 `bottom`，避免底部黑边。

### 音乐 / 音效 🎵
| 字段 | 类型 | 说明 |
|------|------|------|
| `bgm` | string / `'!stop'` / `'/stop'` | BGM 循环段 URL；`'!stop'` = 立即停止；`'/stop'` = 淡出（默认 2 秒） |
| `bgmIntro` | string | BGM 片头（播完自动接 `bgm` 循环） |
| `bgmVolume` | number (0~1) | BGM 音量，默认 1 |
| `bgs` | string / `'!stop'` / `'/stop'` | 背景音效（循环播放） |
| `bgsVolume` | number (0~1) | BGS 音量，默认 1 |
| `se` | string | 音效（一次性播放） |
| `voice` | string | 语音 URL |

> **独立音量控制**：设置 `bgmVolume` 或 `bgsVolume` 但不设置对应的 `bgm`/`bgs` 时，只改变当前正在播放的音频音量，不切换曲目。
>
> **淡出自定义**：`'/stop'` 触发默认 2 秒淡出。代码层支持 `fadeOutBgm(durationMs)` 和 `fadeOutBgs(durationMs)` 自定义时长。
>
> **暂停 / 恢复**：`pauseBgm()` 可暂停 BGM（不销毁实例），再次 `playBgm()` 同一曲目时恢复播放。

### 出示系统 🎯
| 字段 | 类型 | 说明 |
|------|------|------|
| `judge` | boolean | `true` 时启用「追问」「出示」按钮 |
| `ask` | string | 追问按钮跳转的剧情 ID |
| `presentDefaultIndex` | string | 普通出示的默认跳转 ID |
| `presentSpecialIndexList` | string[] | 特殊出示跳转 ID 列表 |
| `presentSpecialIDList` | number[][] | 与上面对应的证物 ID 二维数组 |
| `presentForced` | boolean | `true` = 强制出示模式（不可关闭） |
| `presentForcedItemId` | number | 强制证物 ID（对应 `encyclopedia.js` 的 id） |
| `presentRect` | object | 强制出示点击区域 `{ x, y, w, h }`（相对坐标 0~1） |
| `presentSuccessId` | string | 点中正确区域后的跳转 ID |
| `presentFailId` | string | 点错区域后的跳转 ID |

#### 强制出示交互模式（`presentForcedItemId` 模式）

当设置了 `presentForcedItemId` + `presentRect` + `presentSuccessId` + `presentFailId` 时，进入 **图片交互出示模式**：

1. 自动打开对应证物的详情图片（优先 `details`，其次 `profile`）
2. 图片按宽高比自适应：宽图用 `widthFix`（撑满宽度），高图用 `heightFix`（撑满高度）
3. 显示目标矩形边框 overlay（由 `presentRect` 定义）
4. 用户 **点击或拖拽** 放置标记点，松开后标记停留在点击位置
5. 点击 "出示" 按钮判定：标记点在矩形内 → `presentSuccessId`，矩形外 → `presentFailId`
6. 屏幕旋转时自动重新计算图片和标记位置

```js
// 强制图片出示示例
{
  id: "3.5",
  judge: true,
  presentForced: true,
  presentForcedItemId: 35,           // 证物 ID
  presentRect: { x: 0.3, y: 0.2, w: 0.4, h: 0.3 },  // 关键区域（相对坐标）
  presentSuccessId: "3.6",           // 点中 → 成功分支
  presentFailId: "3.7",              // 点错 → 失败分支
  next: "3.5"
}
```

### 异议特效 💥
| 字段 | 类型 | 说明 |
|------|------|------|
| `objectionImg` | string | 异议/效果图片 URL，进入节点时全屏显示（带抖动入场 + 淡出动画），结束后显示文本 |

```js
{
  id: "3.8",
  text: "~案件的调查结果~",
  objectionImg: BASE + "/images/effect/testimony_start.webp",
  next: "3.9"
}
```

> 图片会显示约 1 秒（900ms 展示 + 150ms 淡出），使用 `aspectFit` 模式居中显示，支持任意尺寸的图片。

### 自动播放 ⏯️
顶部栏 "自动播放" 按钮，开启后每次对话结束等待 **1.8 秒** 自动推进到下一节点。再次点击关闭。开启状态下视频也会自动播放。

> 选项分支、结局面板、强制出示模式下自动播放暂停。

### 对话历史 📜
顶部栏 "历史" 按钮，打开浮层面板显示所有已发生的对话记录（发言者 + 内容）。选项选择也会记录（发言者为 "选项"）。自动滚动到最新条目。

> 强制出示模式下禁止打开历史面板。

### 存档系统 💾
| 字段 | 类型 | 说明 |
|------|------|------|
| `save` | boolean | `true` = 自动存档（保存 state、BGM/BGS、历史） |
| `load` | boolean | `true` = 自动读档（恢复到上次存档状态） |
| `saveTitle` | string | 存档点标题 |
| `saveDesc` | string | 存档点描述 |

存档示例：
```js
{
  id: '1.5',
  save: true,
  saveTitle: '第一章',
  saveDesc: '初次开庭',
  next: '1.6'
}
```

> 顶部栏「存档点」会列出所有 `save: true` 的节点，点击可快速跳转并恢复状态。

#### 存档保存内容
每次 `save: true` 时保存以下数据到本地存储：
- `currentId` — 当前剧情节点 ID
- `state` — 完整游戏状态（favorability 等）
- `historyList` — 对话历史记录
- `savedBgm` / `savedBgmIntro` / `savedBgmVolume` — 当前 BGM 状态
- `savedBgs` / `savedBgsVolume` — 当前 BGS 状态

#### 读档 / 存档点跳转的 BGM 恢复
读取存档或从存档点跳转时，系统会 **从目标节点向前扫描剧情**，找到最近的 BGM 设置节点并恢复播放。遇到 `!stop` 或 `/stop` 指令则停止扫描（该节点之前无 BGM）。这确保读档后音乐与剧情进度一致，而非简单沿用存档时刻的 BGM。

### 效果 / 结局 🏁
| 字段 | 类型 | 说明 |
|------|------|------|
| `effect` | object | 状态变化（可累加），如 `{ favorability: 1 }` |
| `effectOnce` | object | 一次性状态变化，仅在对应 key 未被设置过时生效（防重复），如 `{ q28: 1 }` |
| `endingCheck` | boolean | `true` = 根据 favorability 自动跳结局 |
| `isEnding` | boolean | `true` = 标记为结局节点，显示结局面板 |
| `endingTitle` | string | 结局面板大标题 |
| `endingText` | string | 结局面板描述文字，支持 `\\n` 换行 |

#### 结局面板 UI
结局节点显示包含以下交互的面板：
- **大标题**（`endingTitle`）和 **描述文字**（`endingText`）
- **读档按钮** — 恢复到最近存档点（含 BGM 向前扫描恢复）
- **重新开始按钮** — 重置所有状态，回到 `'1.1'`

### 条件分支 🔀
| 字段 | 类型 | 说明 |
|------|------|------|
| `conditionKeys` | string[] | 需检查的 state key 列表，全部 `>= 1` 时视为条件满足 |
| `nextIfTrue` | string | 条件满足时跳转的目标 ID |
| `nextIfFalse` | string | 条件不满足时跳转的目标 ID |

通过 `conditionKeys` + `nextIfTrue` / `nextIfFalse` 可在剧情中实现基于游戏状态的条件分支。节点本身不显示任何内容，进入后立即检查条件并跳转。

```js
// 检查 q28~q31 是否全部追问过
{
  id: "3.check28",
  conditionKeys: ["q28", "q29", "q30", "q31"],
  nextIfTrue: "3.prechoice",   // 全部追问过 → 独白后弹出选项
  nextIfFalse: "3.29"          // 还没追问完 → 继续下一条证言
}
```

> **典型用法**：讯问循环中追踪每条证言是否被追问过。在追问链入口节点设 `effectOnce: { q28: 1 }`，追问链末尾接入条件检查节点。所有证言都追问过后才弹出"是否继续讯问"选项。
>
> 节点进入时仅执行条件判断，不处理 BGM、立绘、文本等。适合作为流程中的"隐形岔路"。

### 动态图鉴 📖
| 字段 | 类型 | 说明 |
|------|------|------|
| `addEncyclopedia` | object / object[] | 动态添加图鉴条目 |

```js
addEncyclopedia: {
  type: 'evidence',    // evidence | witness | map | rule | record
  id: 35,
  name: '证物名称',
  desc: '描述文字',
  profile: 'https://...'
}
```

> 详见下方图鉴章节。

---

## iOS 平台音频适配 🍎

游戏在 iOS / iPadOS 上自动进行以下音频处理：

| 机制 | 说明 |
|------|------|
| **OGG → M4A 转换** | iOS 不支持 OGG，自动将 URL 中的 `/ogg/` 替换为 `/m4a/`，`.ogg` 后缀改为 `.m4a` |
| **静音开关覆盖** | 全局设置 `obeyMuteSwitch: false`，iPad / iPhone 物理静音键 **不影响游戏音频** |
| **WebAudio 强制** | 所有音频实例强制使用 `useWebAudioImplement: true`，避免预加载导致的 iOS 自动播放拦截 |

> 音频格式适配在 `utils/platform.js` 中实现，Android / 开发者工具保持原始 URL 不变。

---

## 资源下载机制 ⬇️

### 分章预下载
启动时下载 **图鉴 + 第 1 章** 所有资源（图片/音频/视频），完成后进入游戏。之后后台静默下载第 2 章。

### 后台预加载
每次跳转剧情时，自动在后台触发 **下一章节** 的资源预下载（如当前第 1 章 → 后台下载第 2 章）。已缓存的章节自动跳过。

### 缓存加固（后台补缺）
`_backfillMissingCache()` — 每次剧情跳转时，**后台异步检查**以下资源的缓存完整性，缺失则自动补下载：
1. **图鉴资源** — 所有 `encyclopedia.js` 中引用的图片
2. **当前章节资源** — 当前所在章的所有图片/音频/视频
3. **下一章节资源** — 复用预加载逻辑

> 该机制确保即使之前下载被中断、缓存被清理，也能在游戏过程中自动补全，无需用户手动重试。

### 下载容错
| 机制 | 说明 |
|------|------|
| **重试** | 每个文件最多重试 **5 次** |
| **429 处理** | HTTP 429 (Too Many Requests) 时无限重试，0ms 延迟轮询 |
| **并发** | 最高 10000 并发下载，实际受微信 API 限制 |
| **错误隔离** | 单个文件失败不影响其他文件下载，失败文件静默跳过 |

### 加载界面
预加载期间显示进度条和百分比，失败时显示 "重新加载" 按钮供用户手动重试。

---

## 图鉴界面 — `data/encyclopedia.js`

图鉴数据在 `data/encyclopedia.js` 中定义，导出为一个对象，包含 **5 个分类**：

| 分类 key | 显示名称 | 底部滚动栏样式 |
|----------|----------|--------------|
| `evidence` | 证物 | 方形图标（头像图片） |
| `witness` | 证人 | 方形图标（头像图片） |
| `map` | 地图 | 文字按钮（自动换行） |
| `rule` | 规定 | 文字按钮（自动换行） |
| `record` | 记录 | 文字按钮（自动换行） |

### 数据结构

```js
{
  evidence: [  // 证物
    {
      id: 35,                  // 唯一 ID（与 story.js 出示系统的 presentSpecialIDList 对应）
      name: '证物名称',
      desc: '描述文字',         // 支持 \\n 换行
      profile: 'https://...',  // 头像图片 URL（证物/证人必填）
      details: 'https://...'   // 详情大图 URL 或 URL 数组（地图/证物详情选填）
    }
  ],
  witness: [ /* … */ ],  // 证人（与 evidence 结构相同）
  map: [ /* … */ ],      // 地图（需要 details 存放地图大图）
  rule: [ /* … */ ],     // 规定（仅 name + desc）
  record: [ /* … */ ]    // 记录（仅 name + desc）
}
```

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | number | ✅ | 条目唯一 ID |
| `name` | string | ✅ | 条目名称 |
| `desc` | string | | 描述文字，支持 `\\n` 换行；包含 `点击图标查看详情` 时会触发详情弹窗（见下方） |
| `profile` | string | | 头像图片 URL（`evidence`/`witness` 必填，显示为方形缩略图） |
| `details` | string / string[] | | 详情大图 URL 或 URL 数组（点击后放大显示；`map` 分类的必填字段） |

#### 详情弹窗（多页文本）

当图鉴条目的 `desc` 包含 `"点击图标查看详情"` 且设置了 `details` 字段时，点击头像会打开全屏详情弹窗，显示 `details` 中的内容（支持多页，有翻页按钮）。

```js
{
  id: 33,
  name: "名单",
  desc: "与本案有关系的人员名单\\n\\n[点击图标查看详情]",
  profile: BASE + "/images/WitchBook/Clues/Clue_005_007.webp",
  details: [
    "涉案人员：\\n    被告：城崎 诺亚\\n    被害：泽渡 可可",
    "负责人员：\\n    检察官：二阶堂 希罗\\n    搜查官：莲见 蕾雅\\n    辩护律师：樱羽 艾玛",
    "证人（若无意外则按顺序出场）：\\n    莲见 蕾雅\\n    黑部 奈叶香\\n    夏目 安安"
  ]
}
```

> `details` 为字符串数组时，每项作为一页显示；为单个 URL 时作为全屏大图显示。

> `map`（地图）、`rule`（规定）、`record`（记录）这三个分类的 `name` 会自动换行处理：长度 4 的字每 2 字换一行，更长的每 3 字换一行。`evidence`（证物）和 `witness`（证人）用图标展示，不换行。

### 在剧情中动态添加图鉴

在 `story.js` 的剧情节点中使用 `addEncyclopedia` 字段，可在游戏过程中动态新增图鉴条目。支持单条或批量：

```js
// 单条
{
  id: '2.10',
  text: '发现了重要证物',
  addEncyclopedia: {
    type: 'evidence',      // evidence | witness | map | rule | record
    id: 35,
    name: '神秘钥匙',
    desc: '在图书馆角落发现的钥匙。',
    profile: 'https://...'
  },
  next: '2.11'
}

// 批量添加
{
  id: '2.15',
  text: '获得了新情报',
  addEncyclopedia: [
    {
      type: 'record',
      id: 31,
      name: '笔记',
      desc: '重要的线索记录。'
    },
    {
      type: 'evidence',
      id: 36,
      name: '信件',
      desc: '一封匿名信。',
      profile: 'https://...'
    }
  ],
  next: '2.16'
}
```

> 动态添加的字段格式与 `encyclopedia.js` 中的条目一致，必须包含 `type` 指定分类。ID 重复时会自动跳过（已有条目不会重复添加）。

### 预加载行为

启动时，图鉴中所有条目的 `profile` 和 `details` 图片会随第 1 章资源一并预下载。之后在剧情中通过 `addEncyclopedia` 动态添加的条目也会在添加时自动下载其图片。

### 界面入口

游戏界面顶部栏的 **「图鉴」** 按钮打开图鉴面板，底部有 5 个分类标签（证物 / 证人 / 地图 / 规定 / 记录），左侧显示条目头像和名称，右侧滚动显示描述文本。地图分类的条目点击后显示详情大图（`details`）。

在出示模式中打开图鉴，选择对应证物/地图后底部会出现 **「出示」** 按钮，点击触发出示逻辑。

---

## 屏幕适配 📱

游戏页面配置为横屏（`pageOrientation: landscape`），同时支持运行时屏幕旋转：

- **窗口 resize**：`onResize()` 自动重算立绘高度、法庭模式背景对齐、强制出示图片位置
- **法庭模式**：超宽屏（宽高比 > 16:9）时背景垂直对齐切换为 `bottom`，避免底部黑边
- **强制出示模式**：屏幕旋转后自动重新获取图片实际位置并更新标记点和矩形框
