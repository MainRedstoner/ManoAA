const BASE = "https://cnb.cool/MainR256/Gresource/-/git/raw/master";

const encyclopedia = {
  evidence: [
    { id: 32, name: "手机", desc: "刚到监狱的时候，典狱长分发的，每个人都有。", profile: BASE + "/images/WitchBook/Clues/Clue_002_007.webp" },
    { id: 33, name: "名单", desc: "与本案有关系的人员名单\n\n[点击图标查看详情]", profile: BASE + "/images/WitchBook/Clues/Clue_005_007.webp", details: ["涉案人员：\n    被告：城崎 诺亚\n    被害：泽渡 可可", "负责人员：\n    检察官：二阶堂 希罗\n    搜查官：莲见 蕾雅\n    辩护律师：樱羽 艾玛", "证人（若无意外则按顺序出场）：\n    莲见 蕾雅\n    黑部 奈叶香\n    夏目 安安"] },
    { id: 34, name: "草稿", desc: "在焚烧炉里找到的垃圾。\n上面有一些涂鸦和文稿。", profile: BASE + "/images/WitchBook/Clues/Clue_007_009.webp"},
  ],
  witness: [
    { id: 1, name: "樱羽 艾玛", desc: "囚犯编号 658。\n\n15 岁。\n\n没有掌握魔法。", profile: BASE + "/images/WitchBook/Profiles/Profile_Ema.webp" },
    { id: 2, name: "二阶堂 希罗", desc: "囚犯编号 659。\n\n15 岁。\n\n艾玛的儿时玩伴，也是同班同学。\n\n自称不会魔法。", profile: BASE + "/images/WitchBook/Profiles/Profile_Hiro.webp" },
    { id: 3, name: "夏目 安安", desc: "囚犯编号 660。\n\n拥有【洗脑】魔法，可以让对方服从其认可的命令，属于轻度的催眠魔法。", profile: BASE + "/images/WitchBook/Profiles/Profile_AnAn.webp" },
    { id: 4, name: "城崎 诺亚", desc: "囚犯编号 661。\n\n可以使出【控制液体】画画的魔法，但似乎不好控制。\n\n真实身份是世界有名的街头艺术家【气球】。", profile: BASE + "/images/WitchBook/Profiles/Profile_Noah.webp" },
    { id: 5, name: "莲见 蕾雅", desc: "囚犯编号 662。\n\n艺能事务所所属的舞台剧演员。在电视上也经常露面。\n\n拥有【视线诱导】魔法，能将对方视线固定到任意位置。", profile: BASE + "/images/WitchBook/Profiles/Profile_Leia.webp" },
    { id: 6, name: "佐伯 米莉亚", desc: "囚犯编号 663。\n\n【互换】魔法的拥有者。可以互换人格。", profile: BASE + "/images/WitchBook/Profiles/Profile_Miria.webp" },
    { id: 7, name: "宝生 玛格", desc: "囚犯编号 664。\n\n拥有【口技】魔法。", profile: BASE + "/images/WitchBook/Profiles/Profile_Margo.webp" },
    { id: 8, name: "黑部 奈叶香", desc: "囚犯编号 665。\n\n拥有【幻视】魔法，能以视觉和听觉的形式感知到触碰之物的过去和未来情况。", profile: BASE + "/images/WitchBook/Profiles/Profile_Nanoka.webp" },
    { id: 9, name: "紫藤 亚里沙", desc: "囚犯编号 666。\n\n拥有【点火】魔法。", profile: BASE + "/images/WitchBook/Profiles/Profile_Alisa.webp" },
    { id: 10, name: "橘 雪莉", desc: "囚犯编号 667。\n\n拥有【怪力】魔法。", profile: BASE + "/images/WitchBook/Profiles/Profile_Sherry.webp" },
    { id: 11, name: "远野 汉娜", desc: "囚犯编号 668。\n\n拥有【漂浮】魔法，可以让自己的身体漂浮起来。\n\n擅长洗衣以及缝纫等家务。", profile: BASE + "/images/WitchBook/Profiles/Profile_Hanna.webp" },
    { id: 12, name: "泽渡 可可", desc: "囚犯编号 669。\n\n拥有【千里眼】魔法。能够知晓正在注视自己之人的状况，也可以通过照片或影像，知道身处远方的人的情况。", profile: BASE + "/images/WitchBook/Profiles/Profile_Coco.webp" },
    { id: 13, name: "冰上 梅露露", desc: "囚犯编号 670。\n\n拥有【治疗】魔法，可以瞬间治疗身体。", profile: BASE + "/images/WitchBook/Profiles/Profile_Meruru.webp" },
    { id: 14, name: "典狱长", desc: "可以理解并用人类语言交流的猫头鹰怪物。职责是管理囚犯。\n\n似乎对违纪的行为睁一只眼闭一只眼。", profile: BASE + "/images/WitchBook/Profiles/Profile_Warden.webp" },
    { id: 15, name: "看守", desc: "魔女的残骸，听命于典狱长。\n\n拥有异常的战斗能力和恢复能力，人类绝不可能战胜。吧？", profile: BASE + "/images/WitchBook/Profiles/Profile_Jailer.webp" },
  ],
  map: [
    { id: 16, name: "地下一楼", details: BASE + "/images/WitchBook/Map/-1F.webp" },
    { id: 17, name: "地面一楼", details: BASE + "/images/WitchBook/Map/1F.webp" },
    { id: 18, name: "二楼", details: BASE + "/images/WitchBook/Map/2F.webp" },
  ],
  rule: [
    { id: 19, name: "生活规定", desc: "【牢房滞留】\n▪ 除放风时间外，囚犯必须待在与囚犯编号对应的牢房内。\n▪ 若在非放风时间被发现身处牢房外，将当场被移送至惩罚室（惩罚室关禁闭2天）。\n\n【监视体制】\n▪ 看守会常时巡逻，一旦发现囚犯有违反规定的行为，将会将其移送至惩罚室。\n\n【衣物的处理】\n▪ 囚犯须每日将衣物丢弃于淋浴房内的垃圾滑槽中。\n▪ 焚烧炉会在每周一 15 时启动，处理废弃物。\n\n【身体不适及受伤时的应对】\n▪ 即使在拘禁时间内，若出现身体不适或受伤的情况，准许其在医务室进行休息。\n▪ 允许最多 1 名看护人员陪同。\n\n【用餐时间】\n▪ 提供 1 日 3 餐，在各放风时间内于食堂用餐。\n▪ 若超过用餐时间，丧失用餐权利。\n\n【就寝规定】\n▪ 晚上 10 时至早上 6 时必须在牢房内就寝。\n▪ 熄灯后，囚犯之间的交谈亦属于应受惩罚的情况。" },
    { id: 20, name: "警卫巡逻", desc: "【定期巡逻】\n▪ 警卫会在全区域范围常时巡逻。\n▪ 巡逻排班不会告知囚犯。\n\n【发现违规时的罚则】\n▪ 非放风时间的外出：惩罚室禁闭 2 天。\n▪ 对看守的反抗：若有暴力行为，将当场对其处刑。" },
    { id: 21, name: "放风时间规定", desc: "【放风时间的范围】\n▪ 囚犯可以在可出入的区域内自由行动。\n▪ 若行动范围超出受允许的区域，将视其违规。\n\n【受允许的活动】\n▪ 在图书室内阅读。\n▪ 在娱乐室游玩。\n▪ 在野外运动或散步。\n\n※不受允许的活动：集体抗议、策划逃走。" },
    { id: 22, name: "魔女审判", desc: "【审判开庭条件】\n▪ 若在监狱岛中发生杀人的情况，为处刑危险的魔女，将举行魔女审判。\n▪ 经囚犯之间的讨论、投票，被认定为魔女之人将被当场处刑。\n\n【审判的结束条件】\n▪ 若开庭审判，监牢内人士须在指定的时间之内，讨论谁是凶手。\n▪ 遵循少数服从多数原则，最高得票者将被认定为【魔女】并受处刑。\n▪ 只要仍在指定的时间内，若有人士希望进行讨论，则继续审判。\n\n【搜查的条件】\n▪ 若发现尸体，直至在审判开始前，允许在监狱岛内自由进行【搜查】。\n▪ 即使在非放风时间或在拘禁时间内，若发现尸体，则解除一切拘留及拘禁，准许各自进行搜查。\n▪ 若遇紧急情况或有销毁证据的疑虑时，可依管理者的判断，在审判开始前的搜查时间内，对重要嫌疑人加以拘禁。\n\n【无法选定魔女的情况】\n▪ 若无法选定魔女，将对全部参加者处刑。\n▪ 但，若全场一致达成【不存在凶手】的结论，并且管理者认可存在合理证据可供时，则终止审判。" },
    { id: 23, name: "时间表", desc: "6:00~10:00\n牢房门锁打开，因处于放风时间内，可以出入。\n食堂内备有早餐。\n\n10:00~12:00\n在监牢内活动。\n（属看守进行巡逻以及管理者检查的指定时间）\n\n12:00~15:00\n门锁打开，因处于放风时间内，可以出入。\n食堂内备有午餐。\n\n15:00~17:00\n在监牢内活动。\n（属看守进行巡逻以及管理者检查的指定时间）\n\n17:00~22:00\n门锁打开，因处于放风时间内，可以出入。\n食堂内备有晚餐。\n可使用淋浴房。（在此时段外无热水供应）\n\n22:00~次日6:00\n禁止外出时间。" },
  ],
  record: [
    { id: 24, name: "魔女", desc: "给国家带来灾难的不死造物。\n在转变为魔女的过程中，会逐渐受杀意与妄想所支配。\n\n但在大众认知之中，魔女是能运用咒术与魔法的虚构形象。\n各地均流传有飞天骑扫帚，或使役恶魔的女性传说。\n在现代也成为了创作题材。以面向儿童的作品为例，描写【身为魔女】的少女在变身后与邪恶作战的作品并不罕见。\n\n在少女之间煞有介事地悄然流传着这样的都市传说：【能使用魔法的人，因有可能成为魔女，要在 15 岁时送到监牢里】。" },
    { id: 25, name: "魔女因子", desc: "身为魔女之人所携带的因子。\n国家正以全国性检查的手段暗中调查。" },
    { id: 26, name: "监牢", desc: "是一所将全国范围内的魔女集中起来加以管理的设施，\n少女们正以囚犯的身份被关押在此。" },
    { id: 27, name: "大魔女", desc: "据典狱长所说，找到大魔女后，会发生某些事情。" },
    { id: 28, name: "残骸", desc: "是魔女最终转变成的怪物。\n其中最容易被控制的个体会遭洗脑，成为监牢的看守。" },
    { id: 29, name: "魔女化", desc: "囚犯生来就带有魔女因子。\n在遭受强烈的精神压力时，魔女因子会得到刺激，趋于活跃。\n魔女因子活跃时，囚犯将产生极为强烈的杀人冲动。" },
    { id: 30, name: "处刑", desc: "是揭露魔女真身的仪式。\n将对魔女施加难以忍受的痛苦，在短时间内促成完全的魔女化。\n完全转变为魔女之人，将得到接近不死的肉体，以及爆发式增强的魔力。\n完全转变为魔女之人，最终将失去人形，变质为【残骸】。\n成为【残骸】后，其人身将交由运营方管理。" },
    { id: 31, name: "艾玛的笔记1", desc: "监牢已有 500 年的历史，过去曾是以大魔女为中心的众多魔女们幸福生活着的大宅邸。" },
  ],
};

module.exports = encyclopedia;