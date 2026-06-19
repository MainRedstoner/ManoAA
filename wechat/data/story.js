const BASE = "https://cnb.cool/MainR256/Gresource/-/git/raw/master";

module.exports = [
  // ===== 第一章 =====
  {
    id: "1.1",
    speaker: "温馨提醒",
    text: "本作可能会剧透内容。建议游玩过《魔法少女的魔女审判》与《逆转裁判 1 & 2》后再游玩。",
    next: "1.2"
  },
  {
    id: "1.2",
    speaker: "温馨提醒",
    text: "若没有有玩过上述两部作品也不要害怕。我会尽可能在少量剧透的情况下充分说明必要的信息。",
    next: "1.3"
  },
  {
    id: "1.3",
    bg: BASE + "/images/logo/logo.webp",
    bgMode: "aspectFit",
    skip: 1.5,
    next: "1.4"
  },
  {
    id: "1.4",
    bg: BASE + "/images/logo/logo.webp",
    bgMode: "aspectFit",
    dark: "10",
    skip: 1,
    next: "1.5"
  },
  {
    id: "1.5",
    bgm: BASE + "/audio/bgm/ogg/Bgm_024_001_Loop.ogg",
    text: "两个半月之前，正是我准备重新开始的时候。",
    save: true,
    saveTitle: "第一章",
    saveDesc: "初次开庭",
    next: "1.6"
  },
  {
    id: "1.6",
    text: "我准备忘掉过去的一切——那些不愉快的回忆。",
    next: "1.7"
  },
  {
    id: "1.7",
    text: "开始一段全新的高中生活。",
    next: "1.8"
  },
  {
    id: "1.8",
    text: "但是，我却没有如愿。",
    next: "1.9"
  },
  {
    id: "1.9",
    text: "我来到了这里。",
    bg: BASE + "/images/bg/Background_001_001.webp",
    dark: "01",
    next: "1.10"
  },
  {
    id: "1.10",
    bg: BASE + "/images/bg/Background_001_001.webp",
    text: "完全封闭的监狱。",
    next: "1.11"
  },
  {
    id: "1.11",
    bg: BASE + "/images/bg/Background_001_001.webp",
    text: "完全没有希望可言的。",
    next: "1.12"
  },
  {
    id: "1.12",
    bg: BASE + "/images/bg/Background_001_001.webp",
    text: "监狱。",
    next: "1.13"
  },
  {
    id: "1.13",
    bg: BASE + "/images/bg/Background_001_001.webp",
    text: "“来到这里的人都有可能成为魔女。”",
    next: "1.14"
  },
  {
    id: "1.14",
    bg: BASE + "/images/bg/Background_001_001.webp",
    text: "“魔女，是充满杀意的怪物。”",
    next: "1.15"
  },
  {
    id: "1.15",
    bg: BASE + "/images/bg/Background_001_001.webp",
    text: "“魔女会把大家都杀光。”",
    next: "1.16"
  },
  {
    id: "1.16",
    bg: BASE + "/images/bg/Background_001_001.webp",
    text: "在这样的传言中，一对苦命鸳鸯的生命迎来了结局。",
    next: "1.17"
  },
  {
    id: "1.17",
    bg: BASE + "/images/bg/Background_001_001.webp",
    dark: "10",
    skip: 1,
    next: "1.18"
  },
  {
    id: "1.18",
    bg: BASE + "/images/bg/Background_009_001.webp",
    dark: "01",
    skip: 1,
    next: "1.19"
  },
  {
    id: "1.19",
    bg: BASE + "/images/bg/Background_009_001.webp",
    text: "“大家应该团结起来找到出路，不要再自相残杀了！”",
    next: "1.20"
  },
  {
    id: "1.20",
    bg: BASE + "/images/bg/Background_009_001.webp",
    text: "可是，这就是现在所发生的——",
    next: "1.21"
  },
  {
    id: "1.21",
    se: BASE + "/audio/se/ogg/Sfx_Scenario_033 Bell sound.ogg",
    bg: BASE + "/images/bg/Background_009_001.webp",
    bgm: "/stop",
    skip: 3,
    next: "1.22"
  },
  {
    id: "1.22",
    bg: BASE + "/images/bg/Background_009_001.webp",
    text: "神圣的钟声再次敲响，魔女岛迎来了第二次魔女审判。",
    bgm: BASE + "/audio/bgm/ogg/AA_01_loop.ogg",
    bgmIntro: BASE + "/audio/bgm/ogg/AA_01_intro.ogg",
    bgmVolume: 0.6,
    next: "1.23"
  },
  {
    id: "1.23",
    bg: BASE + "/images/bg/Background_009_001.webp",
    character: [BASE + "/images/character/" + "ema/" + "Ema_ArmR1_ArmL1_Surprised.webp"],
    speaker: "樱羽艾玛",
    text: "这、这么快就开庭了吗？",
    next: "1.24"
  },
  {
    id: "1.24",
    bg: BASE + "/images/bg/Background_009_001.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Smile.webp"],
    speaker: "佐伯米莉亚",
    text: "当然啊，都已经过了两个半小时了。",
    next: "1.25"
  },
  {
    id: "1.25",
    bg: BASE + "/images/bg/Background_009_001.webp",
    character: [BASE + "/images/character/" + "ema/" + "Ema_ArmR1_ArmL1_Cry.webp"],
    speaker: "樱羽艾玛",
    text: "怎么办，我还没准备好……",
    next: "1.26"
  },
  {
    id: "1.26",
    bg: BASE + "/images/bg/Background_009_001.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Smile.webp"],
    speaker: "佐伯米莉亚",
    text: "也别太担心啦，我的老师经常这样，毫无准备地上法庭。",
    next: "1.27"
  },
  {
    id: "1.27",
    bg: BASE + "/images/bg/Background_009_001.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Smile.webp"],
    speaker: "佐伯米莉亚",
    text: "但是我从来没见过他会败下阵来。",
    next: "1.28"
  },
  {
    id: "1.28",
    bg: BASE + "/images/bg/Background_009_001.webp",
    character: [BASE + "/images/character/" + "ema/" + "Ema_ArmR1_ArmL1_Determined2.webp"],
    speaker: "樱羽艾玛",
    text: "好吧……哪怕有一点点赢的可能性…………",
    next: "1.29"
  },
  {
    id: "1.29",
    bg: BASE + "/images/bg/Background_009_001.webp",
    dark: "10",
    bgm: "/stop",
    skip: 1,
    next: "1.30"
  },
  {
    id: "1.30",
    bg: BASE + "/images/bg/court00.webp",
    dark: "01",
    skip: 1,
    next: "2.1"
  },

  // ===== 第二章 =====
  {
    id: "2.1",
    bg: BASE + "/images/bg/court00.webp",
    character: [BASE + "/images/character/" + "ema/" + "Ema_ArmR1_ArmL1_Pensive.webp"],
    speaker: "樱羽艾玛",
    text: "这是……审判庭吗？",
    bgm: BASE + "/audio/bgm/ogg/AA_02_loop.ogg",
    bgmIntro: BASE + "/audio/bgm/ogg/AA_02_intro.ogg",
    bgmVolume: 0.6,
    next: "2.2"
  },
  {
    id: "2.2",
    bg: BASE + "/images/bg/court00.webp",
    character: [BASE + "/images/character/" + "ema/" + "Ema_ArmR1_ArmL1_Pensive.webp"],
    speaker: "樱羽艾玛",
    text: "怎么感觉跟之前有点不太一样……",
    next: "2.3"
  },
  {
    id: "2.3",
    bg: BASE + "/images/bg/court00.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Smile.webp"],
    speaker: "佐伯米莉亚",
    text: "这应该不只是有点不太一样吧？",
    next: "2.4"
  },
  {
    id: "2.4",
    bg: BASE + "/images/bg/court00.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Smile.webp"],
    speaker: "佐伯米莉亚",
    text: "我跟诺亚酱稍微装修了一下下。",
    next: "2.5"
  },
  {
    id: "2.5",
    bg: BASE + "/images/bg/court00.webp",
    character: [BASE + "/images/character/" + "ema/" + "Ema_ArmR1_ArmL1_Pensive.webp"],
    speaker: "樱羽艾玛",
    text: "所以我们今天就是在这里审判吗？",
    next: "2.6"
  },
  {
    id: "2.6",
    bg: BASE + "/images/bg/court00.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Smile.webp"],
    speaker: "佐伯米莉亚",
    text: "对的哦。",
    next: "2.7"
  },
  {
    id: "2.7",
    bg: BASE + "/images/bg/court00.webp",
    dark: "10",
    skip: 1,
    next: "2.8"
  },
  {
    id: "2.8",
    bg: BASE + "/images/bg/court01.webp",
    dark: "01",
    skip: 1,
    next: "2.9"
  },
  {
    id: "2.9",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/10.webp"],
    text: "才两个月没见，都被你们搞成啥样了……",
    next: "2.10"
  },
  {
    id: "2.10",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/8.webp"],
    text: "算了，还是不要在意这么多了好。",
    next: "2.11"
  },
  {
    id: "2.11",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/1.webp"],
    text: "今日审理城崎诺亚一案。",
    next: "2.12"
  },
  {
    id: "2.12",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/9.webp"],
    text: "辩方和检方是否都准备就绪？",
    next: "2.13"
  },
  {
    id: "2.13",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO3.webp"],
    speaker: "二阶堂希罗",
    text: "是的，检方已经准备完毕。",
    next: "2.14"
  },
  {
    id: "2.14",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA1.webp"],
    speaker: "樱羽艾玛",
    text: "辩、辩方也准备完毕。",
    next: "2.15"
  },
  {
    id: "2.15",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA1.webp"],
    speaker: "樱羽艾玛",
    text: "（其实并没有……）",
    next: "2.16"
  },
  {
    id: "2.16",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/2.webp"],
    text: "樱羽艾玛律师，你是第一次上法庭辩护吧？",
    next: "2.17"
  },
  {
    id: "2.17",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA1.webp"],
    speaker: "樱羽艾玛",
    text: "是的，我非常紧张。",
    next: "2.18"
  },
  {
    id: "2.18",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/6.webp"],
    text: "那不如让我出几个问题考考你对案件的了解情况吧。",
    next: "2.19"
  },
  {
    id: "2.19",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/6.webp"],
    text: "这次案件的被告人是？",
    next: "2.20"
  },
  {
    id: "2.20",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA1.webp"],
    speaker: "樱羽艾玛",
    text: "被告的姓名是——城崎诺亚。",
    next: "2.21"
  },
  {
    id: "2.21",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/13.webp"],
    text: "很好。那么，这次的被害者是？",
    next: "2.22"
  },
  {
    id: "2.22",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "被害者是——……是谁来着？",
    next: "2.23"
  },
  {
    id: "2.23",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "完了，想不起来了！",
    next: "2.24"
  },
  {
    id: "2.24",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Default.webp"],
    speaker: "佐伯米莉亚",
    text: "艾玛酱！如果有不确定的事情，就看看记录吧！",
    next: "2.25"
  },
  {
    id: "2.25",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Smile.webp"],
    speaker: "樱羽艾玛",
    text: "记、记录？",
    next: "2.26"
  },
  {
    id: "2.26",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Pensive.webp"],
    speaker: "佐伯米莉亚",
    text: "嗯嗯，就在左上角的“图鉴”里。",
    next: "2.27"
  },
  {
    id: "2.27",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Smile.webp"],
    speaker: "樱羽艾玛",
    text: "左上角的图鉴是吧……",
    next: "2.28"
  },
  {
    id: "2.28",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（总之经常打开图鉴看看记录吧……）",
    next: "2.29"
  },
  {
    id: "2.29",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/10.webp"],
    text: "艾玛小姐，现在能回答问题了吗？",
    next: "2.30"
  },
  {
    id: "2.30",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/9.webp"],
    text: "这次案件的被害者是？",
    next: "2.31"
  },
  {
    id: "2.31",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    choices: [
      { text: "夏目安安", next: "2.31.1" },
      { text: "泽渡可可", next: "2.32" },
      { text: "矢张政治", next: "2.31.9" }
    ]
  },
  {
    id: "2.31.1",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA1.webp"],
    speaker: "樱羽艾玛",
    text: "被害者的姓名，应该是……夏目安安。",
    next: "2.31.2"
  },
  {
    id: "2.31.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA1.webp"],
    speaker: "樱羽艾玛",
    text: "……………………………………",
    next: "2.31.3"
  },
  {
    id: "2.31.3",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "（完了，我是不是说错什么话了！）",
    next: "2.31.4"
  },
  {
    id: "2.31.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    objectionImg: BASE + "/images/effect/yiyi_upscayl_4x_realesrgan-x4plus.webp",
    voice: BASE + "/audio/voice/hiro/ogg/CommonTrial_Hiro06084.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    skip: 0.01,
    next: "2.31.5"
  },
  {
    id: "2.31.5",
    bg: BASE + "/images/bg/court05.webp",
    se: BASE + "/audio/se/ogg/hit.ogg",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/hiro/HIRO7.webp"],
    skip: 1,
    next: "2.31.6"
  },
  {
    id: "2.31.6",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO7.webp"],
    speaker: "二阶堂希罗",
    text: "夏目安安现在就在旁边，你想说她已经死了吗？",
    next: "2.31.7"
  },
  {
    id: "2.31.7",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "对、对不起…………",
    next: "2.31.8"
  },
  {
    id: "2.31.8",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA1.webp"],
    speaker: "樱羽艾玛",
    text: "（我应该仔细看看记录再回答的……）",
    next: "2.29"
  },
  {
    id: "2.31.9",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA3.webp"],
    speaker: "樱羽艾玛",
    text: "被害的姓名，当然就是矢张政治了。",
    next: "2.31.10"
  },
  {
    id: "2.31.10",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA3.webp"],
    objectionImg: BASE + "/images/effect/yiyi_upscayl_4x_realesrgan-x4plus.webp",
    voice: BASE + "/audio/voice/hiro/ogg/CommonTrial_Hiro06084.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    skip: 0.01,
    next: "2.31.11"
  },
  {
    id: "2.31.11",
    bg: BASE + "/images/bg/court05.webp",
    se: BASE + "/audio/se/ogg/hit.ogg",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/hiro/HIRO7.webp"],
    skip: 1,
    next: "2.31.12"
  },
  {
    id: "2.31.12",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO7.webp"],
    speaker: "二阶堂希罗",
    text: "你在说什么，有人认识这个人吗？",
    next: "2.31.13"
  },
  {
    id: "2.31.13",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "呃……不是都说，事件的背后，矢张始终在吗？",
    next: "2.31.14"
  },
  {
    id: "2.31.14",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "好吧好吧对不起，我重新回答！",
    next: "2.29"
  },
  {
    id: "2.32",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA1.webp"],
    speaker: "樱羽艾玛",
    text: "被害者的姓名是，泽渡可可。",
    next: "2.33"
  },
  {
    id: "2.33",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/12.webp"],
    text: "看来辩方确实准备就绪了。",
    next: "2.34"
  },
  {
    id: "2.34",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/8.webp"],
    text: "那么现在开始审理。",
    next: "2.35"
  },
  {
    id: "2.35",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/8.webp"],
    text: "请检方先进行开场陈述。",
    next: "2.36"
  },
  {
    id: "2.36",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO8.webp"],
    speaker: "二阶堂希罗",
    text: "今天早晨，泽渡可可被杀。",
    next: "2.37"
  },
  {
    id: "2.37",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO8.webp"],
    speaker: "二阶堂希罗",
    text: "关于详情，一会在证言的时候会描述。",
    next: "2.38"
  },
  {
    id: "2.38",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO3.webp"],
    speaker: "二阶堂希罗",
    text: "现在传唤第一位证人。",
    next: "2.39"
  },
  {
    id: "2.39",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "（她今天怎么这么低调……我有点不好的预感……）",
    next: "3.1"
  },

  // ===== 第三章 =====
  {
    id: "3.1",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO3.webp"],
    speaker: "二阶堂希罗",
    text: "证人，请报上你的姓名和职业。",
    save: true,
    saveTitle: "第一章",
    saveDesc: "讯问~案件的调查结果？",
    next: "3.2"
  },
  {
    id: "3.2",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Smile.webp"],
    speaker: "莲见蕾雅",
    text: "好的！",
    next: "3.3"
  },
  {
    id: "3.3",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Smile.webp"],
    speaker: "莲见蕾雅",
    text: "我是莲见蕾雅，负责本案的搜查工作。",
    next: "3.4"
  },
  {
    id: "3.4",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO6.webp"],
    speaker: "二阶堂希罗",
    text: "搜查工作做得怎么样了？",
    next: "3.5"
  },
  {
    id: "3.5",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Pensive.webp"],
    speaker: "莲见蕾雅",
    text: "虽然证据都找得差不多了，不过感觉还有一些奇怪的地方……",
    next: "3.6"
  },
  {
    id: "3.6",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO6.webp"],
    speaker: "二阶堂希罗",
    text: "请你对这次案件的调查结果进行证言。",
    next: "3.7"
  },
  {
    id: "3.7",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Smile.webp"],
    speaker: "莲见蕾雅",
    text: "好的。",
    bgm: "/stop",
    next: "3.8"
  },
  {
    id: "3.8",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Smile.webp"],
    text: "~案件的调查结果~",
    bgm: BASE + "/audio/bgm/ogg/AA_05_loop.ogg",
    bgmIntro: BASE + "/audio/bgm/ogg/AA_05_intro.ogg",
    bgmVolume: 0.6,
    objectionImg: BASE + "/images/effect/testimony_start.webp",
    se: BASE + "/audio/se/ogg/Sfx_Common_003 Decision.ogg",
    next: "3.9"
  },
  {
    id: "3.9",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Smile.webp"],
    speaker: "莲见蕾雅",
    text: "根据尸检的结果，被害的死亡时间在早上七点半前后十分钟内。",
    next: "3.10"
  },
  {
    id: "3.10",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Default.webp"],
    speaker: "莲见蕾雅",
    text: "死亡的原因推测是失血过多，因为我们在现场发现了大量的血迹。",
    next: "3.11"
  },
  {
    id: "3.11",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Default.webp"],
    speaker: "莲见蕾雅",
    text: "本案的凶器是一支钢笔。发现尸体时，这支钢笔正插在被害的胸部。",
    next: "3.12"
  },
  {
    id: "3.12",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Smile.webp"],
    speaker: "莲见蕾雅",
    text: "另外，我们在发现尸体的时候拍摄了一张照片。",
    next: "3.13"
  },
  {
    id: "3.13",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Smile.webp"],
    text: "*图鉴已更新。",
    bgm: "/stop",
    objectionImg: BASE + "/images/effect/testimony_end.webp",
    se: BASE + "/audio/se/ogg/Sfx_Common_003 Decision.ogg",
    skip: 2,
    addEncyclopedia: [
      {
        type: "evidence",
        id: 35,
        name: "泽渡可可的尸检报告",
        profile: BASE + "/images/WitchBook/Clues/Clue_010_005.webp",
        desc: "死亡时间：7:30前后十分钟内\n死因：失血过多（推测）\n\n在被害者身上发现一处伤口，没有命中要害。"
      },
      {
        type: "evidence",
        id: 36,
        name: "钢笔",
        profile: BASE + "/images/WitchBook/Clues/Clue_010_001.webp",
        desc: "本案的凶器。"
      },
      {
        type: "evidence",
        id: 37,
        name: "案发现场的照片",
        profile: BASE + "/images/WitchBook/Clues/Clue_007_005.webp",
        desc: "在案发现场拍摄的死者的照片。\n\n[点击图标查看详情]",
        details: BASE + "/images/bg/C001.webp"
      }
    ],
    next: "3.14"
  },
  {
    id: "3.14",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "我有个疑问。",
    next: "3.15"
  },
  {
    id: "3.15",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA1.webp"],
    speaker: "樱羽艾玛",
    text: "仅凭这些应该还不能定罪吧？",
    next: "3.16"
  },
  {
    id: "3.16",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO5.webp"],
    speaker: "二阶堂希罗",
    text: "确实不可以。",
    next: "3.17"
  },
  {
    id: "3.17",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO6.webp"],
    speaker: "二阶堂希罗",
    text: "这只是其中一位证人，我还有其他证人。",
    next: "3.18"
  },
  {
    id: "3.18",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/2.webp"],
    text: "怎么样，辩方是否要对这位证人进行讯问？",
    next: "3.19"
  },
  {
    id: "3.19",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "讯问？",
    next: "3.20"
  },
  {
    id: "3.20",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Pensive.webp"],
    speaker: "佐伯米莉亚",
    text: "是这样的，艾玛酱。",
    next: "3.21"
  },
  {
    id: "3.21",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Smile.webp"],
    speaker: "佐伯米莉亚",
    text: "如果对证言有疑惑的话，就点击左上角的「追问」了解详情。",
    next: "3.22"
  },
  {
    id: "3.22",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Angry.webp"],
    speaker: "佐伯米莉亚",
    text: "要是证言里有矛盾的话，就「出示」你手里的证据吧。",
    next: "3.23"
  },
  {
    id: "3.23",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Angry.webp"],
    speaker: "樱羽艾玛",
    text: "好……我明白了。",
    next: "3.24"
  },
  {
    id: "3.24",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA1.webp"],
    speaker: "樱羽艾玛",
    text: "审判长，我要对证人进行讯问！",
    next: "3.25"
  },
  {
    id: "3.25",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（刚才确实有些地方很令人在意。）",
    next: "3.26"
  },
  {
    id: "3.26",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（一会试着「追问」一下吧。）",
    next: "3.27"
  },
  {
    id: "3.27",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Default.webp"],
    text: "~案件的调查结果~",
    bgm: BASE + "/audio/bgm/ogg/AA_05_loop.ogg",
    bgmIntro: BASE + "/audio/bgm/ogg/AA_05_intro.ogg",
    bgmVolume: 0.6,
    objectionImg: BASE + "/images/effect/cross_examination_start.webp",
    se: BASE + "/audio/se/ogg/Sfx_Common_003 Decision.ogg",
    next: "3.28"
  },
  {
    id: "3.27.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Default.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05117.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/yiyi_upscayl_4x_realesrgan-x4plus.webp",
    skip: 0.01,
    next: "3.27.2"
  },
  {
    id: "3.27.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    se: BASE + "/audio/se/ogg/hit.ogg",
    skip: 1,
    next: "3.27.3"
  },
  {
    id: "3.27.3",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "证人的证言有矛盾！",
    next: "3.27.4"
  },
  {
    id: "3.27.4",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "典狱长",
    character: [BASE + "/images/character/warden/10.webp"],
    text: "矛盾在哪？",
    next: "3.27.5"
  },
  {
    id: "3.27.5",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "看不出来吗？",
    next: "3.27.6"
  },
  {
    id: "3.27.6",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO5.webp"],
    speaker: "二阶堂希罗",
    text: "看不出来。",
    next: "3.27.7"
  },
  {
    id: "3.27.7",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "呃………………",
    next: "3.27.8"
  },
  {
    id: "3.27.8",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（看来发言之前要先思考一下啊……）",
    next: "3.28"
  },
  {
    id: "3.28",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Default.webp"],
    speaker: "莲见蕾雅",
    text: "根据尸检的结果，被害的死亡时间在早上七点半前后十分钟内。",
    judge: true,
    ask: "3.28.1",
    presentDefaultIndex: "3.27.1",
    presentSpecialIndexList: [],
    presentSpecialIDList: [],
    next: "3.29"
  },
  {
    id: "3.28.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Default.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05118.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/dengdeng_upscayl_4x_realesrgan-x4plus.webp",
    effectOnce: { q28: 1 },
    skip: 0.01,
    next: "3.28.2"
  },
  {
    id: "3.28.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "「早上七点半前后十分钟内」是什么意思？",
    next: "3.28.3"
  },
  {
    id: "3.28.3",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Default.webp"],
    speaker: "莲见蕾雅",
    text: "就是早上 7:20 到 7:40 之间。",
    next: "3.28.4"
  },
  {
    id: "3.28.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "哦，这样啊。我明白了。",
    next: "3.check28"
  },
  {
    id: "3.29",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Pensive.webp"],
    speaker: "莲见蕾雅",
    text: "死亡的原因推测是失血过多，因为我们在现场发现了大量的血迹。",
    judge: true,
    ask: "3.29.1",
    presentDefaultIndex: "3.27.1",
    presentSpecialIndexList: [],
    presentSpecialIDList: [],
    next: "3.30"
  },
  {
    id: "3.29.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Pensive.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05118.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/dengdeng_upscayl_4x_realesrgan-x4plus.webp",
    effectOnce: { q29: 1 },
    skip: 0.01,
    next: "3.29.2"
  },
  {
    id: "3.29.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "为什么说是「推测」？",
    next: "3.29.3"
  },
  {
    id: "3.29.3",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Pensive.webp"],
    speaker: "莲见蕾雅",
    text: "关于这点，我们也有疑惑的地方……",
    next: "3.29.4"
  },
  {
    id: "3.29.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "有什么奇怪的吗？",
    next: "3.29.5"
  },
  {
    id: "3.29.5",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Pensive.webp"],
    speaker: "莲见蕾雅",
    text: "我们没有检测到失血过多的症状。",
    next: "3.29.6"
  },
  {
    id: "3.29.6",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "欸？那为什么会这样推测呢？",
    next: "3.29.7"
  },
  {
    id: "3.29.7",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Pensive.webp"],
    speaker: "莲见蕾雅",
    text: "因为我们找不出别的可能性了。",
    next: "3.29.8"
  },
  {
    id: "3.29.8",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Pensive.webp"],
    speaker: "莲见蕾雅",
    text: "而且现场的血迹确实非常多。",
    next: "3.29.9"
  },
  {
    id: "3.29.9",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Smile.webp"],
    speaker: "莲见蕾雅",
    text: "你要是觉得不可信的话，就无视掉它好了。",
    next: "3.check29"
  },
  {
    id: "3.30",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Default.webp"],
    speaker: "莲见蕾雅",
    text: "本案的凶器是一支钢笔。发现尸体时，这支钢笔正插在被害的胸部。",
    judge: true,
    ask: "3.30.1",
    presentDefaultIndex: "3.27.1",
    presentSpecialIndexList: [],
    presentSpecialIDList: [],
    next: "3.31"
  },
  {
    id: "3.30.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Default.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05118.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/dengdeng_upscayl_4x_realesrgan-x4plus.webp",
    effectOnce: { q30: 1 },
    skip: 0.01,
    next: "3.30.2"
  },
  {
    id: "3.30.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "这支钢笔我怎么这么眼熟？",
    next: "3.30.3"
  },
  {
    id: "3.30.3",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO5.webp"],
    speaker: "二阶堂希罗",
    text: "是我的。",
    next: "3.30.4"
  },
  {
    id: "3.30.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "欸？希罗酱的钢笔为什么会在那里？",
    next: "3.30.5"
  },
  {
    id: "3.30.5",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO5.webp"],
    speaker: "二阶堂希罗",
    text: "我借给安安的，你得问她。",
    next: "3.30.6"
  },
  {
    id: "3.30.6",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA1.webp"],
    speaker: "樱羽艾玛",
    text: "好、好的……",
    next: "3.30.7"
  },
  {
    id: "3.30.7",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "（总不会是希罗酱她……）",
    next: "3.30.8"
  },
  {
    id: "3.30.8",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "（不行，不能这么想！）",
    next: "3.check30"
  },
  {
    id: "3.31",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Smile.webp"],
    speaker: "莲见蕾雅",
    text: "另外，我们在发现尸体的时候拍摄了一张照片。",
    judge: true,
    ask: "3.31.1",
    presentDefaultIndex: "3.27.1",
    presentSpecialIndexList: [],
    presentSpecialIDList: [],
    next: "3.32"
  },
  {
    id: "3.31.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Smile.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05118.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/dengdeng_upscayl_4x_realesrgan-x4plus.webp",
    effectOnce: { q31: 1 },
    skip: 0.01,
    next: "3.31.2"
  },
  {
    id: "3.31.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "这张照片很奇怪。",
    next: "3.31.3"
  },
  {
    id: "3.31.3",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Smile.webp"],
    speaker: "莲见蕾雅",
    text: "是的。这支钢笔是倒着插的。",
    next: "3.31.4"
  },
  {
    id: "3.31.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "可是，倒着是怎么刺进去的啊？",
    next: "3.31.5"
  },
  {
    id: "3.31.5",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "leia/" + "Leia_ArmL1_ArmR1_Default.webp"],
    speaker: "莲见蕾雅",
    text: "有没有可能是第二次插进去的呢？",
    next: "3.31.6"
  },
  {
    id: "3.31.6",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "说得也是……",
    next: "3.check31"
  },
  {
    id: "3.check28",
    conditionKeys: ["q28", "q29", "q30", "q31"],
    nextIfTrue: "3.prechoice",
    nextIfFalse: "3.29"
  },
  {
    id: "3.check29",
    conditionKeys: ["q28", "q29", "q30", "q31"],
    nextIfTrue: "3.prechoice",
    nextIfFalse: "3.30"
  },
  {
    id: "3.check30",
    conditionKeys: ["q28", "q29", "q30", "q31"],
    nextIfTrue: "3.prechoice",
    nextIfFalse: "3.31"
  },
  {
    id: "3.check31",
    conditionKeys: ["q28", "q29", "q30", "q31"],
    nextIfTrue: "3.prechoice",
    nextIfFalse: "3.32"
  },
  {
    id: "3.prechoice",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（感觉已经追问得差不多了，还有必要接着问吗？）",
    next: "3.choice"
  },
  {
    id: "3.choice",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    choices: [
      { text: "讯问下一位证人。", next: "3.36" },
      { text: "再问几句。", next: "3.35" }
    ]
  },
  {
    id: "3.32",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Angry.webp"],
    speaker: "樱羽艾玛",
    text: "感觉证言好多问题啊，但是我没有证据……",
    next: "3.33"
  },
  {
    id: "3.33",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Angry.webp"],
    speaker: "佐伯米莉亚",
    text: "如果没有进展的话就只能先问下一位证人了。",
    next: "3.34"
  },
  {
    id: "3.34",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（可是我还有一些没有了解的信息……）",
    next: "3.35"
  },
  {
    id: "3.35",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（还是再追问一下，了解更多细节吧。）",
    next: "3.28"
  },
  {
    id: "3.36",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "（再问下去也问不出什么。）",
    bgm: "/stop",
    next: "3.37"
  },
  {
    id: "3.37",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA1.webp"],
    speaker: "樱羽艾玛",
    text: "呃，审判长，我感觉可以结束讯问了。",
    next: "3.38"
  },
  // ===== 传唤第二位证人 =====
  {
    id: "3.38",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/12.webp"],
    speaker: "典狱长",
    text: "好的，现在传唤检方的第二位证人。",
    next: "3.39"
  },
  {
    id: "3.39",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO4.webp"],
    speaker: "二阶堂希罗",
    text: "呵呵。。。你确定不要再讯问了吗？再不讯问可就没有机会了哦。",
    next: "3.40"
  },
  {
    id: "3.40",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "我突然又想接着讯问了…………",
    next: "4.1"
  },
  {
    id: "4.1",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO6.webp"],
    speaker: "二阶堂希罗",
    text: "那你还有什么异议不成？",
    next: "4.2"
  },
  {
    id: "4.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "呃……没有…………",
    next: "4.3"
  },
  {
    id: "4.3",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/13.webp"],
    speaker: "典狱长",
    text: "现在可以传唤第二位证人了吧？",
    next: "4.4"
  },
  {
    id: "4.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "可以了………………",
    next: "4.5"
  },
  {
    id: "4.5",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（希望在第二位证人身上能找到什么矛盾吧……）",
    next: "4.6"
  },
  {
    id: "4.6",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO3.webp"],
    speaker: "二阶堂希罗",
    text: "证人，请报上姓名和职业。",
    save: true,
    saveTitle: "第一章",
    saveDesc: "讯问~目击到的景象？",
    next: "4.7"
  },
  {
    id: "4.7",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    speaker: "黑部奈叶香",
    text: "我是黑部奈叶香，正在研究驯服残骸的方法。",
    next: "4.8"
  },
  {
    id: "4.8",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/10.webp"],
    speaker: "典狱长",
    text: "什么？你刚刚说在研究什么？",
    next: "4.9"
  },
  {
    id: "4.9",
    bg: BASE + "/images/bg/court01.webp",
    speaker: "二阶堂希罗",
    voice: BASE + "/audio/voice/hiro/ogg/CommonTrial_Hiro06084.ogg",
    character:BASE+"/images/character/warden/10.webp",
    objectionImg: BASE + "/images/effect/yiyi_upscayl_4x_realesrgan-x4plus.webp",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    skip: 0.01,
    next: "4.10"
  },
  {
    id: "4.10",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/hiro/HIRO7.webp"],
    se: BASE + "/audio/se/ogg/hit.ogg",
    skip: 1,
    next: "4.11"
  },
  {
    id: "4.11",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO7.webp"],
    speaker: "二阶堂希罗",
    text: "这不重要！",
    next: "4.12"
  },
  {
    id: "4.12",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO4.webp"],
    speaker: "二阶堂希罗",
    text: "艾玛，你知道我刚刚为什么问你要不要接着讯问吗？",
    next: "4.13"
  },
  {
    id: "4.13",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO4.webp"],
    speaker: "二阶堂希罗",
    text: "因为这位证人是目击者啊。",
    next: "4.14"
  },
  {
    id: "4.14",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "（虽然这么说，不过既然是目击者，应该会提供更加详细的情报！）",
    next: "4.15"
  },
  {
    id: "4.15",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/11.webp"],
    speaker: "典狱长",
    text: "话不多说，开始证言吧。",
    next: "4.16"
  },
  {
    id: "4.16",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "（这次我一定要找到矛盾！）",
    next: "4.17"
  },
  // ===== 证言：目击到的景象 =====
  {
    id: "4.17",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    text: "~目击到的景象~",
    bgm: BASE + "/audio/bgm/ogg/AA_05_loop.ogg",
    bgmIntro: BASE + "/audio/bgm/ogg/AA_05_intro.ogg",
    bgmVolume: 0.6,
    objectionImg: BASE + "/images/effect/testimony_start.webp",
    se: BASE + "/audio/se/ogg/Sfx_Common_003 Decision.ogg",
    next: "4.18"
  },
  {
    id: "4.18",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "黑部奈叶香",
    text: "当时是 7:32，我正好经过焚烧炉。",
    next: "4.19"
  },
  {
    id: "4.19",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    speaker: "黑部奈叶香",
    text: "然后我看见诺亚把可可从焚烧炉里拖了出来。",
    next: "4.20"
  },
  {
    id: "4.20",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    speaker: "黑部奈叶香",
    text: "接着，诺亚捡起一支钢笔，往可可身上捅了过去。",
    next: "4.21"
  },
  {
    id: "4.21",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    bgm: "/stop",
    objectionImg: BASE + "/images/effect/testimony_end.webp",
    se: BASE + "/audio/se/ogg/Sfx_Common_003 Decision.ogg",
    skip: 2,
    next: "4.22"
  },
  {
    id: "4.22",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/3.webp"],
    speaker: "典狱长",
    text: "如果证人没有说谎的话，这应该就是真相了。",
    next: "4.23"
  },
  {
    id: "4.23",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/12.webp"],
    speaker: "典狱长",
    text: "现在请辩方进行讯问。",
    next: "4.24"
  },
  // ===== 第一回讯问：目击到的景象 =====
  {
    id: "4.24",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    text: "~目击到的景象~",
    bgm: BASE + "/audio/bgm/ogg/AA_05_loop.ogg",
    bgmIntro: BASE + "/audio/bgm/ogg/AA_05_intro.ogg",
    bgmVolume: 0.6,
    objectionImg: BASE + "/images/effect/cross_examination_start.webp",
    se: BASE + "/audio/se/ogg/Sfx_Common_003 Decision.ogg",
    next: "4.25"
  },
  // 空白异议序列
  {
    id: "4.24.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05117.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/yiyi_upscayl_4x_realesrgan-x4plus.webp",
    skip: 0.01,
    next: "4.24.2"
  },
  {
    id: "4.24.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    table: BASE + "/images/effect/courtTable0.webp",
    se: BASE + "/audio/se/ogg/hit.ogg",
    skip: 1,
    next: "4.24.3"
  },
  {
    id: "4.24.3",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "证人的证言有矛盾！",
    next: "4.24.4"
  },
  {
    id: "4.24.4",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/10.webp"],
    speaker: "典狱长",
    text: "矛盾在哪？",
    next: "4.24.5"
  },
  {
    id: "4.24.5",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "看不出来吗？",
    next: "4.24.6"
  },
  {
    id: "4.24.6",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO5.webp"],
    speaker: "二阶堂希罗",
    text: "看不出来。",
    next: "4.24.7"
  },
  {
    id: "4.24.7",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "呃………………",
    next: "4.24.8"
  },
  {
    id: "4.24.8",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "（看来发言之前要先思考一下啊……）",
    next: "4.25"
  },
  // 证言1：7:32经过焚烧炉
  {
    id: "4.25",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "黑部奈叶香",
    text: "当时是 7:32，我正好经过焚烧炉。",
    judge: true,
    ask: "4.25.1",
    presentDefaultIndex: "4.24.1",
    presentSpecialIndexList: [],
    presentSpecialIDList: [],
    next: "4.26"
  },
  {
    id: "4.25.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05118.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/dengdeng_upscayl_4x_realesrgan-x4plus.webp",
    skip: 0.01,
    next: "4.25.2"
  },
  {
    id: "4.25.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "你确定时间是 7:32 吗？",
    next: "4.25.3"
  },
  {
    id: "4.25.3",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "黑部奈叶香",
    text: "没错，我看手机了。",
    next: "4.25.4"
  },
  {
    id: "4.25.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "那……你去焚烧炉干什么？",
    next: "4.25.5"
  },
  {
    id: "4.25.5",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "黑部奈叶香",
    text: "我回监牢拿东西，正好路过而已。",
    next: "4.25.6"
  },
  {
    id: "4.25.6",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "哦哦。",
    next: "4.25.7"
  },
  {
    id: "4.25.7",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（时间对得上，看来这里应该没什么问题。）",
    next: "4.26"
  },
  // 证言2：看见诺亚把可可从焚烧炉拖出来
  {
    id: "4.26",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    speaker: "黑部奈叶香",
    text: "然后我看见诺亚把可可从焚烧炉里拖了出来。",
    judge: true,
    ask: "4.26.1",
    presentDefaultIndex: "4.24.1",
    presentSpecialIndexList: [],
    presentSpecialIDList: [],
    next: "4.27"
  },
  {
    id: "4.26.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05118.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/dengdeng_upscayl_4x_realesrgan-x4plus.webp",
    skip: 0.01,
    next: "4.26.2"
  },
  {
    id: "4.26.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "从炉子里拖出来？",
    next: "4.26.3"
  },
  {
    id: "4.26.3",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    speaker: "黑部奈叶香",
    text: "对。",
    next: "4.26.4"
  },
  {
    id: "4.26.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "为什么是从炉子里拖出来的？",
    next: "4.26.5"
  },
  {
    id: "4.26.5",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO6.webp"],
    speaker: "二阶堂希罗",
    text: "这个你直接问被告更好。",
    next: "4.26.6"
  },
  {
    id: "4.26.6",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（我之前问诺亚酱的时候也是这么说的。）",
    next: "4.26.7"
  },
  {
    id: "4.26.7",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（不过我现在可能还不能说明什么问题……）",
    next: "4.26.8"
  },
  {
    id: "4.26.8",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（还是从别的角度找出矛盾吧。）",
    next: "4.27"
  },
  // 证言3：诺亚捡起钢笔捅向可可
  {
    id: "4.27",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    speaker: "黑部奈叶香",
    text: "接着，诺亚捡起一支钢笔，往可可身上捅了过去。",
    judge: true,
    ask: "4.27.1",
    presentDefaultIndex: "4.24.1",
    presentSpecialIndexList: [],
    presentSpecialIDList: [],
    next: "4.28"
  },
  {
    id: "4.27.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05118.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/dengdeng_upscayl_4x_realesrgan-x4plus.webp",
    skip: 0.01,
    next: "4.27.2"
  },
  {
    id: "4.27.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "你确定吗？",
    next: "4.27.3"
  },
  {
    id: "4.27.3",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    speaker: "黑部奈叶香",
    text: "对。",
    next: "4.27.4"
  },
  {
    id: "4.27.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（我记得我好像有一件很奇怪的证物……）",
    next: "4.27.5"
  },
  {
    id: "4.27.5",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    speaker: "樱羽艾玛",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    choices: [
      { text: "继续追问", next: "4.27.6" },
      { text: "算了", next: "4.27.13" }
    ]
  },
  {
    id: "4.27.6",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    se: BASE + "/audio/se/ogg/hit.ogg",
    skip: 1,
    next: "4.27.7"
  },
  {
    id: "4.27.7",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "你刚刚说诺亚酱往可可酱身上捅了过去。",
    next: "4.27.8"
  },
  {
    id: "4.27.8",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA2.webp"],
    speaker: "樱羽艾玛",
    text: "请问，具体捅了几次，你有看到吗？",
    next: "4.27.9"
  },
  {
    id: "4.27.9",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    speaker: "黑部奈叶香",
    text: "只捅了一次。",
    next: "4.27.10"
  },
  {
    id: "4.27.10",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA2.webp"],
    speaker: "樱羽艾玛",
    text: "你确定？",
    next: "4.27.11"
  },
  {
    id: "4.27.11",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "黑部奈叶香",
    text: "我看到的就是这样。",
    next: "4.27.12"
  },
  {
    id: "4.27.12",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA2.webp"],
    speaker: "樱羽艾玛",
    text: "请把这句话添加到证言中。",
    next: "4.39"
  },
  {
    id: "4.27.13",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（算了，问题应该不在这里。）",
    next: "4.28"
  },
  // 讨论
  {
    id: "4.28",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Default.webp"],
    speaker: "樱羽艾玛",
    text: "你有发现什么不对的吗？",
    next: "4.29"
  },
  {
    id: "4.29",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Default.webp"],
    speaker: "佐伯米莉亚",
    text: "我觉得试着追问一些细节可能会很有用。",
    next: "4.30"
  },
  {
    id: "4.30",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Default.webp"],
    speaker: "樱羽艾玛",
    text: "（确实。试着追问一下吧，没准可以问出什么矛盾来。）",
    next: "4.25"
  },
  // 空白异议序列（第二回讯问）
  {
    id: "4.35.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05117.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/yiyi_upscayl_4x_realesrgan-x4plus.webp",
    skip: 0.01,
    next: "4.35.2"
  },
  {
    id: "4.35.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    table: BASE + "/images/effect/courtTable0.webp",
    se: BASE + "/audio/se/ogg/hit.ogg",
    skip: 1,
    next: "4.35.3"
  },
  {
    id: "4.35.3",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "证人的证言有矛盾！",
    next: "4.35.4"
  },
  {
    id: "4.35.4",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/10.webp"],
    speaker: "典狱长",
    text: "矛盾在哪？",
    next: "4.35.5"
  },
  {
    id: "4.35.5",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "看不出来吗？",
    next: "4.35.6"
  },
  {
    id: "4.35.6",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO5.webp"],
    speaker: "二阶堂希罗",
    text: "看不出来。",
    next: "4.35.7"
  },
  {
    id: "4.35.7",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "呃………………",
    next: "4.35.8"
  },
  {
    id: "4.35.8",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "（看来发言之前要先思考一下啊……）",
    next: "4.36"
  },
  // 第二回讯问·证言1追问链（独立于循环一，末尾next指向4.37）
  {
    id: "4.36.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05118.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/dengdeng_upscayl_4x_realesrgan-x4plus.webp",
    skip: 0.01,
    next: "4.36.2"
  },
  {
    id: "4.36.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "你确定时间是 7:32 吗？",
    next: "4.36.3"
  },
  {
    id: "4.36.3",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "黑部奈叶香",
    text: "没错，我看手机了。",
    next: "4.36.4"
  },
  {
    id: "4.36.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "那……你去焚烧炉干什么？",
    next: "4.36.5"
  },
  {
    id: "4.36.5",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "黑部奈叶香",
    text: "我回监牢拿东西，正好路过而已。",
    next: "4.36.6"
  },
  {
    id: "4.36.6",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "哦哦。",
    next: "4.36.7"
  },
  {
    id: "4.36.7",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（时间对得上，看来这里应该没什么问题。）",
    next: "4.37"
  },
  // 第二回讯问·证言2追问链（独立于循环一，末尾next指向4.38）
  {
    id: "4.37.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05118.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/dengdeng_upscayl_4x_realesrgan-x4plus.webp",
    skip: 0.01,
    next: "4.37.2"
  },
  {
    id: "4.37.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "从炉子里拖出来？",
    next: "4.37.3"
  },
  {
    id: "4.37.3",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    speaker: "黑部奈叶香",
    text: "对。",
    next: "4.37.4"
  },
  {
    id: "4.37.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "为什么是从炉子里拖出来的？",
    next: "4.37.5"
  },
  {
    id: "4.37.5",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO6.webp"],
    speaker: "二阶堂希罗",
    text: "这个你直接问被告更好。",
    next: "4.37.6"
  },
  {
    id: "4.37.6",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（我之前问诺亚酱的时候也是这么说的。）",
    next: "4.37.7"
  },
  {
    id: "4.37.7",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（不过我现在可能还不能说明什么问题……）",
    next: "4.37.8"
  },
  {
    id: "4.37.8",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（还是从别的角度找出矛盾吧。）",
    next: "4.38"
  },
  // 证言1（第二回）
  {
    id: "4.36",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "黑部奈叶香",
    text: "当时是 7:32，我正好经过焚烧炉。",
    judge: true,
    ask: "4.36.1",
    presentDefaultIndex: "4.35.1",
    presentSpecialIndexList: [],
    presentSpecialIDList: [],
    next: "4.37"
  },
  // 证言2（第二回）
  {
    id: "4.37",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    speaker: "黑部奈叶香",
    text: "然后我看见诺亚把可可从焚烧炉里拖了出来。",
    judge: true,
    ask: "4.37.1",
    presentDefaultIndex: "4.35.1",
    presentSpecialIndexList: [],
    presentSpecialIDList: [],
    next: "4.38"
  },
  // 证言3（第二回）
  {
    id: "4.38",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    speaker: "黑部奈叶香",
    text: "接着，诺亚捡起一支钢笔，往可可身上捅了过去。",
    judge: true,
    ask: "4.38.1",
    presentDefaultIndex: "4.35.1",
    presentSpecialIndexList: [],
    presentSpecialIDList: [],
    next: "4.39"
  },
  // 讯问二·证言3追问
  {
    id: "4.38.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05118.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/dengdeng_upscayl_4x_realesrgan-x4plus.webp",
    skip: 0.01,
    next: "4.38.2"
  },
  {
    id: "4.38.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA2.webp"],
    speaker: "樱羽艾玛",
    text: "你确定吗？",
    next: "4.38.3"
  },
  {
    id: "4.38.3",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    speaker: "黑部奈叶香",
    text: "对。",
    next: "4.38.4"
  },
  {
    id: "4.38.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（我记得我好像有一件很奇怪的证物……）",
    next: "4.38.5"
  },
  {
    id: "4.38.5",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    choices: [
      { text: "继续追问", next: "4.38.6" },
      { text: "算了", next: "4.38.13" }
    ]
  },
  {
    id: "4.38.6",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    se: BASE + "/audio/se/ogg/hit.ogg",
    skip: 1,
    next: "4.38.7"
  },
  {
    id: "4.38.7",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "你刚刚说诺亚酱往可可酱身上捅了过去。",
    next: "4.38.8"
  },
  {
    id: "4.38.8",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA2.webp"],
    speaker: "樱羽艾玛",
    text: "请问，具体捅了几次，你有看到吗？",
    next: "4.38.9"
  },
  {
    id: "4.38.9",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    speaker: "黑部奈叶香",
    text: "只捅了一次。",
    next: "4.38.10"
  },
  {
    id: "4.38.10",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA2.webp"],
    speaker: "樱羽艾玛",
    text: "你确定？",
    next: "4.38.11"
  },
  {
    id: "4.38.11",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "黑部奈叶香",
    text: "我看到的就是这样。",
    next: "4.38.12"
  },
  {
    id: "4.38.12",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA2.webp"],
    speaker: "樱羽艾玛",
    text: "请把这句话添加到证言中。",
    next: "4.39"
  },
  {
    id: "4.38.13",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "（算了，问题应该不在这里。）",
    next: "4.39"
  },
  // 证言4（新）：只捅了一次
  {
    id: "4.39",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "黑部奈叶香",
    text: "诺亚只捅了可可一次。",
    judge: true,
    ask: "4.39.1",
    presentDefaultIndex: "4.35.1",
    presentSpecialIndexList: ["4.42"],
    presentSpecialIDList: [[37]],
    next: "4.40"
  },
  {
    id: "4.39.1",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Default.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05118.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/dengdeng_upscayl_4x_realesrgan-x4plus.webp",
    skip: 0.01,
    next: "4.39.2"
  },
  {
    id: "4.39.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "只捅了一次？",
    next: "4.39.3"
  },
  {
    id: "4.39.3",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "黑部奈叶香",
    text: "至少我只看到她捅了一次。",
    next: "4.39.4"
  },
  {
    id: "4.39.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "（这句证言有矛盾吗？）",
    next: "4.40"
  },
  // 第二轮讨论
  {
    id: "4.40",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Default.webp"],
    speaker: "樱羽艾玛",
    text: "你觉得情况有改变吗？",
    next: "4.41"
  },
  {
    id: "4.41",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Default.webp"],
    speaker: "佐伯米莉亚",
    text: "应该有吧？不确定的话多看看记录，说不定能发现什么。",
    next: "4.36"
  },
  // ===== 矛盾揭晓：证据37出示后 =====
  {
    id: "4.42",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "樱羽艾玛",
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05117.ogg",
    objectionImg: BASE + "/images/effect/yiyi_upscayl_4x_realesrgan-x4plus.webp",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    bgm: "!stop",
    skip: 0.01,
    next: "4.42.1"
  },
  {
    id: "4.42.1",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA2.webp"],
    speaker: "樱羽艾玛",
    skip:2,
    next: "4.43"
  },
  {
    id: "4.43",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    bgm: BASE + "/audio/bgm/ogg/AA_03_loop.ogg",
    bgmIntro: BASE + "/audio/bgm/ogg/AA_03_intro.ogg",
    bgmVolume:0.6,
    character: [BASE + "/images/character/" + "ema/" + "EMA2.webp"],
    speaker: "樱羽艾玛",
    text: "（出现了………………矛盾！）",
    next: "4.44"
  },
  {
    id: "4.44",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA2.webp"],
    speaker: "樱羽艾玛",
    text: "证人，你刚刚说，只看到诺亚酱捅了可可酱一次，对吧？",
    next: "4.45"
  },
  {
    id: "4.45",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA3.webp"],
    speaker: "樱羽艾玛",
    text: "但是，这句话有一个很大的问题！",
    next: "4.46"
  },
  {
    id: "4.46",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "黑部奈叶香",
    text: "可是我真的只看到捅了一次啊。",
    next: "4.47"
  },
  {
    id: "4.47",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Pensive.webp"],
    speaker: "黑部奈叶香",
    text: "尸检报告也说只有一处伤口不是吗？",
    next: "4.48"
  },
  {
    id: "4.48",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA3.webp"],
    speaker: "樱羽艾玛",
    text: "这些确实都是真的，没有人撒谎。",
    next: "4.49"
  },
  {
    id: "4.49",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA3.webp"],
    speaker: "樱羽艾玛",
    objectionImg: BASE + "/images/effect/yiyi_upscayl_4x_realesrgan-x4plus.webp",
    voice: BASE + "/audio/voice/hiro/ogg/CommonTrial_Hiro06084.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    skip: 0.01,
    next: "4.50"
  },
  {
    id: "4.50",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO6.webp"],
    speaker: "二阶堂希罗",
    text: "你自己都说有矛盾了，那还能是什么情况？",
    next: "4.51"
  },
  {
    id: "4.51",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA3.webp"],
    speaker: "樱羽艾玛",
    text: "听好了！",
    next: "4.52"
  },
  {
    id: "4.52",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA6.webp"],
    speaker: "樱羽艾玛",
    text: "你们看这张照片。",
    next: "4.53"
  },
  {
    id: "4.53",
    bg: BASE + "/images/bg/court06.webp",
    court: "mid",
    table: BASE + "/images/effect/courtTable1.webp",
    character: [BASE + "/images/character/" + "nanoka/" + "Nanoka_ArmL1_ArmR1_Surprised.webp"],
    speaker: "黑部奈叶香",
    text: "这张照片上……钢笔是倒着插的！",
    next: "4.54"
  },
  {
    id: "4.54",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA3.webp"],
    speaker: "樱羽艾玛",
    text: "没错。然而，倒过来插的钢笔是不可能刺入被害体内的。",
    next: "4.55"
  },
  {
    id: "4.55",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/8.webp"],
    speaker: "典狱长",
    text: "到底是怎么回事，请辩方务必说明清楚！",
    next: "4.56"
  },
  {
    id: "4.56",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA3.webp"],
    speaker: "樱羽艾玛",
    text: "很简单。要让钢笔倒着插入被害的体内，只有一种可能性——",
    next: "4.57"
  },
  {
    id: "4.57",
    bgVideo: BASE + "/images/video/cctr.mp4",
    bgPoster: BASE + "/images/video/cctr.webp",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "那就是被害身上本来就有个洞！",
    next: "4.58"
  },
  {
    id: "4.58",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/12.webp"],
    speaker: "典狱长",
    text: "什么？",
    next: "4.59"
  },
  {
    id: "4.59",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "也就是说，真正的凶手，其实是在被害身上留下这个洞的人！",
    bgm: "/stop",
    skip: 3,
    next: "4.60"
  },
  {
    id: "4.60",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "（为什么那家伙完全不着急啊……）",
    next: "4.61"
  },
  {
    id: "4.61",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    bgm: BASE + "/audio/bgm/ogg/AA_09_loop.ogg",
    bgmIntro: BASE + "/audio/bgm/ogg/AA_09_intro.ogg",
    bgmVolume: 0.5,
    character: [BASE + "/images/character/" + "hiro/" + "HIRO4.webp"],
    speaker: "二阶堂希罗",
    text: "完全正确，艾玛。",
    next: "4.62"
  },
  {
    id: "4.62",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO4.webp"],
    speaker: "二阶堂希罗",
    text: "正如辩方所说的，可可遇害的现场可能不是在焚烧炉。",
    next: "4.63"
  },
  {
    id: "4.63",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO4.webp"],
    speaker: "二阶堂希罗",
    text: "凶手通过垃圾滑槽把尸体抛下，成为了唯一的可能性。",
    next: "4.64"
  },
  {
    id: "4.64",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO6.webp"],
    speaker: "二阶堂希罗",
    text: "那么，案发现场是哪里，想必不用多说了吧，艾玛？",
    next: "4.65"
  },
  {
    id: "4.65",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "（为什么她还那么一副胸有成竹的样子啊……）",
    next: "4.66"
  },
  {
    id: "4.66",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    text: "真正的案发现场当然就是——",
    next: "4.66.choice"
  },
  {
    id: "4.66.choice",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA4.webp"],
    speaker: "樱羽艾玛",
    choices: [
      { text: "焚烧炉", next: "4.66.1" },
      { text: "淋浴房", next: "4.67" },
      { text: "（米莉亚救我！）", next: "4.66.8" }
    ]
  },
  {
    id: "4.66.1",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "不对，希罗酱。",
    next: "4.66.2"
  },
  {
    id: "4.66.2",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "案发现场就是在焚烧炉！",
    next: "4.66.3"
  },
  {
    id: "4.66.3",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "凶手先把可可酱杀了，然后藏到炉子里的！",
    next: "4.66.4"
  },
  {
    id: "4.66.4",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    objectionImg: BASE + "/images/effect/yiyi_upscayl_4x_realesrgan-x4plus.webp",
    voice: BASE + "/audio/voice/hiro/ogg/CommonTrial_Hiro06084.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    skip: 0.01,
    next: "4.66.5"
  },
  {
    id: "4.66.5",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO7.webp"],
    speaker: "二阶堂希罗",
    text: "胡言乱语。你有证据吗？",
    next: "4.66.6"
  },
  {
    id: "4.66.6",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "呃……这个…………没有。",
    next: "4.66.7"
  },
  {
    id: "4.66.7",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "（还是想清楚再回答问题吧……）",
    next: "4.66.11"
  },
  {
    id: "4.66.8",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Default.webp"],
    speaker: "樱羽艾玛",
    text: "米莉亚酱，救我！",
    next: "4.66.9"
  },
  {
    id: "4.66.9",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Default.webp"],
    speaker: "佐伯米莉亚",
    text: "别怕呀，艾玛酱。图鉴里面不是有一条规定说得很清楚吗？",
    next: "4.66.10"
  },
  {
    id: "4.66.10",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Default.webp"],
    speaker: "樱羽艾玛",
    text: "（对啊，有不确定的可以看看记录。）",
    next: "4.66.11"
  },
  {
    id: "4.66.11",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/13.webp"],
    speaker: "典狱长",
    text: "请辩方抓紧时间回答问题。",
    next: "4.66.12"
  },
  {
    id: "4.66.12",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA1.webp"],
    speaker: "樱羽艾玛",
    text: "好、好的。",
    next: "4.66"
  },
  {
    id: "4.67",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA6.webp"],
    speaker: "樱羽艾玛",
    text: "通过垃圾滑槽与焚烧炉相连的地方……我只能想到一个。",
    next: "4.68"
  },
  {
    id: "4.68",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA2.webp"],
    speaker: "樱羽艾玛",
    text: "这个地方当然就是淋浴房了。",
    next: "4.69"
  },
  {
    id: "4.69",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO4.webp"],
    speaker: "二阶堂希罗",
    text: "没错，凶手在淋浴房里用钢笔刺中了泽渡可可，然后将可可丢了下去。",
    next: "4.70"
  },
  {
    id: "4.70",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO4.webp"],
    speaker: "二阶堂希罗",
    text: "而做出这一切的人……",
    bgm: "/stop",
    skip: 2,
    next: "4.71"
  },
  {
    id: "4.71",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    bgm: BASE + "/audio/bgm/ogg/Bgm_013_001_Loop.ogg",
    bgmIntro: BASE + "/audio/bgm/ogg/Bgm_013_001_Intro.ogg",
    bgmVolume:0.6,
    character: [BASE + "/images/character/" + "hiro/" + "HIRO4.webp"],
    speaker: "二阶堂希罗",
    text: "就是被告——城崎诺亚啊。",
    next: "4.72"
  },
  {
    id: "4.72",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "什、什、什么？！",
    next: "4.73"
  },
  {
    id: "4.73",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO6.webp"],
    speaker: "二阶堂希罗",
    text: "看守在巡逻的时候会留下录像。",
    next: "4.74"
  },
  {
    id: "4.74",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO8.webp"],
    speaker: "二阶堂希罗",
    text: "而录像中很清楚地拍到了，诺亚在 7:21 进入了淋浴房。",
    next: "4.75"
  },
  {
    id: "4.75",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO8.webp"],
    speaker: "二阶堂希罗",
    text: "随后，在 7:31，她进入了焚烧炉。",
    next: "4.76"
  },
  {
    id: "4.76",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO4.webp"],
    speaker: "二阶堂希罗",
    text: "很不巧，这时候刚好被奈叶香撞见了。",
    next: "4.77"
  },
  {
    id: "4.77",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    speaker: " ",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO4.webp"],
    text: "*图鉴已更新。",
    addEncyclopedia: [
      {
        type: "evidence",
        id: 38,
        name: "看守巡逻录像",
        profile: BASE + "/images/WitchBook/Clues/Clue_003_012.webp",
        desc: "可以清楚看到城崎诺亚在 7:21 进入淋浴房，7:31 进入了焚烧炉。"
      }
    ],
    next: "4.78"
  },
  {
    id: "4.78",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA7.webp"],
    speaker: "樱羽艾玛",
    text: "这、这怎么可能……",
    next: "4.79"
  },
  {
    id: "4.79",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO4.webp"],
    speaker: "二阶堂希罗",
    text: "怎么样，还有话要说吗？",
    next: "4.80"
  },
  {
    id: "4.80",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "（怎么办？如果不能证明凶手不是诺亚酱的话……）",
    next: "4.81"
  },
  {
    id: "4.81",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/1.webp"],
    speaker: "典狱长",
    text: "如果辩方无法证明被告的清白，那么我要下达判决了。",
    bgm: "/stop",
    skip: 1,
    next: "4.82"
  },
  {
    id: "4.82",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/1.webp"],
    speaker: "典狱长",
    skip: 2,
    next: "4.83"
  },
  {
    id: "4.83",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/1.webp"],
    voice: BASE + "/audio/voice/ema/ogg/CommonTrial_Ema05118.ogg",
    se: BASE + "/audio/se/ogg/yjyl.ogg",
    objectionImg: BASE + "/images/effect/dengdeng_upscayl_4x_realesrgan-x4plus.webp",
    skip: 0.01,
    next: "4.84"
  },
  {
    id: "4.84",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "不能就这么下达判决！",
    next: "4.85"
  },
  {
    id: "4.85",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "名单里面不是还有一位证人吗？",
    next: "4.86"
  },
  {
    id: "4.86",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO5.webp"],
    speaker: "二阶堂希罗",
    text: "你说夏目安安啊。她一直待在二楼的画室，跟这件事无关。",
    next: "4.87"
  },
  {
    id: "4.87",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO6.webp"],
    speaker: "二阶堂希罗",
    text: "如果你能证明她跟本案有关系的话，我可以传唤她来证言。",
    next: "4.88"
  },
  {
    id: "4.88",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "（我、我能办得到吗？）",
    next: "4.89"
  },
  {
    id: "4.89",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Angry.webp"],
    speaker: "佐伯米莉亚",
    text: "艾玛酱，不能放弃！",
    next: "4.90"
  },
  {
    id: "4.90",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Angry.webp"],
    speaker: "佐伯米莉亚",
    text: "老师经常说，要把思路逆转过来。",
    next: "4.91"
  },
  {
    id: "4.91",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Angry.webp"],
    speaker: "佐伯米莉亚",
    text: "如果不能证明其他证人在说谎，那就试着证明被告说的是真话！",
    next: "4.92"
  },
  {
    id: "4.92",
    bg: BASE + "/images/bg/court02.webp",
    character: [BASE + "/images/character/" + "miria/" + "Miria_ArmL1_ArmR1_Angry.webp"],
    speaker: "樱羽艾玛",
    text: "（有道理……我不能只局限在谎言上。）",
    next: "4.93"
  },
  {
    id: "4.93",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    se: BASE + "/audio/se/ogg/hit.ogg",
    skip: 1,
    next: "4.94"
  },
  {
    id: "4.94",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "审判长，我申请传唤被告来证言！",
    next: "4.95"
  },
  {
    id: "4.95",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "我能够证明她说的是真话！",
    next: "4.96"
  },
  {
    id: "4.96",
    bg: BASE + "/images/bg/court04.webp",
    court: "left",
    table: BASE + "/images/effect/courtTable0.webp",
    character: [BASE + "/images/character/" + "ema/" + "EMA5.webp"],
    speaker: "樱羽艾玛",
    text: "（虽然我也没什么把握，但是只能这样了。）",
    next: "4.97"
  },
  {
    id: "4.97",
    bg: BASE + "/images/bg/court01.webp",
    character: [BASE + "/images/character/warden/3.webp"],
    speaker: "典狱长",
    text: "二阶堂检察官，你怎么看？",
    next: "4.98"
  },
  {
    id: "4.98",
    bg: BASE + "/images/bg/court05.webp",
    court: "right",
    table: BASE + "/images/effect/courtTable2.webp",
    character: [BASE + "/images/character/" + "hiro/" + "HIRO5.webp"],
    speaker: "二阶堂希罗",
    text: "既然辩方这么坚持，就让她讯问个够吧。",
    next: "demo_end"
  },
  // ===== DEMO 结局 =====
  {
    id: "demo_end",
    isEnding: true,
    endingTitle: "未完待续",
    endingText: "DEMO 版本到此为止"
  }
];
