(function () {
  "use strict";

  var COMMON_CROWD = [[480, 620], [760, 535], [330, 560], [1160, 625]];
  var COMMON_OBSTACLES = [[520, 330, 380, 150]];

  var CONFIGS = {
    7: {
      id: 7, save: "zero-hour-level-seven-v1", title: "焚毁档案", opCode: "ASH ARCHIVE", scene: "archive", music: "hospital",
      spawn: [150, 700], countdownLabel: "距档案焚毁", theme: { accent: "#e5a45d", rgb: "229,164,93", danger: "#ef646c" },
      clues: [
        { id: "archivist", name: "核心人物：市政档案员唐斐", unknown: "确认谁掌握零点协议原始档案" },
        { id: "mole", name: "灰领管理员陆臻：潜伏内鬼", unknown: "识别档案馆中的白鸦残党" },
        { id: "purge", name: "焚毁口令 5082／00:45 启动", unknown: "截获内鬼提交的焚毁指令" },
        { id: "thermite", name: "档案柜内藏有定时铝热剂", unknown: "查明纸质档案如何被同步销毁" }
      ],
      timeline: [
        { time: "04:25", clue: "mole", text: "灰领管理员进入阅档区" },
        { time: "03:20", clue: "purge", text: "焚毁口令上传主机" },
        { time: "02:15", clue: "thermite", text: "铝热剂封条脱落" },
        { time: "00:45", clue: "purge", text: "电子与纸质档案同时焚毁" }
      ],
      target: {
        name: "唐斐", badge: "唐斐", path: [{ t: 0, x: 385, y: 480 }, { t: 55, x: 385, y: 480 }, { t: 130, x: 650, y: 520 }, { t: 220, x: 1030, y: 445 }, { t: 300, x: 1110, y: 520 }],
        inspectLabel: "观察抱着红色档案盒的女人", talkLabel: "与唐斐交谈", followLabel: "确认唐斐状态",
        discover: "她是唐斐，负责保管零点协议原始授权记录。", needIntel: "唐斐不会仅凭你的怀疑移交档案，你还缺少焚毁口令和物证。", needActions: "电子清除与铝热剂仍可启动，现在撤离只会让证据消失。", accept: "你说出 5082 和铝热剂位置，唐斐带上原始档案跟随你撤离。", followStatus: "唐斐正携带原始档案跟随你。",
        style: { coat: "#8b4d3e", skin: "#d0a184", hair: "#302522", hairStyle: "bob", glasses: true, briefcase: true, badge: "#e5a45d", bag: false }
      },
      observer: {
        name: "内鬼陆臻", path: [{ t: 30, x: 90, y: 625 }, { t: 70, x: 430, y: 500 }, { t: 100, x: 920, y: 610 }, { t: 138, x: 920, y: 610 }, { t: 230, x: 1110, y: 570 }, { t: 300, x: 1110, y: 570 }],
        inspectLabel: "观察灰领档案管理员", knownLabel: "跟踪内鬼陆臻", needTarget: "他的权限很高，但你还不知道他真正盯着哪份档案。", discover: "他的胸卡照片属于休假员工，灰领内侧却印着白鸦旧徽。",
        style: { coat: "#555b61", skin: "#a97963", hair: "#1f2325", hairStyle: "buzz", gloves: "#32383b", earpiece: true, badge: "#ef646c", bag: false }
      },
      signal: { x: 1000, y: 610, start: 100, end: 138, label: "监听焚毁主机上传", needObserver: "没有确认上传者身份，这串操作看起来只是日常备份。", discover: "上传记录：焚毁口令 5082，00:45 同步清除全部授权档案。", missed: "焚毁口令已经上传。本轮无法取得 5082，按 R 回溯。" },
      evidence: { x: 700, y: 610, start: 165, label: "检查脱落的耐高温封条", discover: "封条来自军用铝热剂，纸质柜将在电子清除时同时点燃。" },
      autoRewindText: "口令和铝热剂位置已经确认。早期权限窗口已错过，时间即将回溯。",
      access: { x: 260, y: 270, deadline: 78, label: "输入档案中枢口令", openLabel: "档案中枢已开启", openStatus: "档案中枢保持开放。", needIntel: "中枢需要四位紧急口令。", missed: "03:42 后中枢进入自动封存，5082 已失效。按 R 回溯。", success: "5082 验证通过，档案中枢开放。" },
      actions: [
        { x: 260, y: 165, badge: "电子清除", label: "锁死电子清除程序", doneLabel: "电子清除已锁死", locked: "必须先进入档案中枢。", success: "清除程序被离线锁定，电子记录得到保全。", doneStatus: "电子记录保持离线。" },
        { x: 855, y: 185, badge: "铝热剂", label: "启动惰性气体灭火", doneLabel: "铝热剂已失效", locked: "需要中枢权限开启惰性气体管路。", success: "档案柜注入惰性气体，铝热剂无法燃烧。", doneStatus: "纸质档案处于防火保护中。" }
      ],
      safe: { x: 1190, y: 315, label: "进入防火证物室", needTarget: "原始档案仍在唐斐手中。", needActions: "电子或纸质焚毁链仍未切断。" },
      failure: { at: 255, note: "如果内鬼完成最后一次同步焚毁——", code: "ARCHIVE PURGED / 00:45", title: "证据化为灰烬", body: "电子主机被清空，纸质柜同时燃烧。白鸦留下的所有授权记录消失。", shortTitle: "档案已经焚毁", loopText: "00:45，档案馆的喷淋没有启动。橙色火光从每一排档案柜内部同时亮起。" },
      intro: { body: "零点塔沉默后，一条隐藏链路把最后的删除命令送往市政档案馆。那里保存着白鸦全部行动的原始授权记录。", goal: "在 00:45 前保全电子与纸质档案，并带唐斐撤离", button: "进入地下档案馆" },
      resetText: "档案馆回到五分钟前，焚毁口令和铝热剂位置仍在记忆中。",
      win: { title: "灰烬里留下了名字", body: "原始档案证明白鸦只是“回声计划”的现场执行者。真正的项目负责人仍在城市地下活动。", rowValue: "零点协议原始授权记录完整保全" },
      next: "second-act.html#8", nextLabel: "进入第八关：地下末班车", crowd: COMMON_CROWD, obstacles: COMMON_OBSTACLES,
      art: { floor1: "#211b1a", floor2: "#26201e", panel: "#352a27", line: "#6b5147", left: "档案中枢", leftSub: "ARCHIVE CORE", center: "密集档案库", centerSub: "VAULT / A-07", right: "防火证物室", rightSub: "EVIDENCE SAFE" },
      story: { previous: "零点塔被切断，但白鸦在失败前发出了最后一条隐藏指令。", purpose: "识别潜伏内鬼，取得焚毁口令，同时保全电子与纸质证据。", question: "如果白鸦只是执行者，谁批准了整个零点协议？", advance: "原始档案首次出现“回声计划”名称，并指向地下交通实验线。", nextGoal: "前往废弃地铁实验线，救出仍知道循环来源的研究员叶芷。", firstThought: "唐斐抱着红色档案盒。先确认她保管的证据，再观察谁一直靠近她。", targetHint: "寻找抱红色档案盒、戴眼镜的档案员。", observerHint: "真正的管理员不会佩戴灰色访客领带。", signalPlace: "东南侧焚毁主机", evidencePlace: "中央档案库外的耐高温封条", guide: { name: "退休馆员闻叔", x: 205, y: 700 }, thread: { x: 430, y: 655, label: "检查倒放的缩微胶卷", discovery: "胶卷记录的日期比今天晚十二年，却已经写下你的姓名。" } },
      people: [
        { name: "高璇", role: "档案修复师", dir: "right", line: "今晚没有销毁计划，可惰性气体系统却被人手动关闭了。" },
        { name: "穆文", role: "值班保安", dir: "left", line: "灰领管理员刷的是休假同事的卡，我以为系统又出错了。" },
        { name: "周澄", role: "历史研究员", dir: "down", line: "唐斐手里的红盒从不离身，里面应该是不可替代的原始件。" },
        { name: "冉秋", role: "设备维护员", dir: "up", line: "铝热剂不怕水，普通喷淋反而会把火带到更多柜子。" }
      ],
      persona: { guideRole: "退休市政馆员", unknown: "红档案盒女人", targetRole: "市政档案员", targetBefore: "这些原件不能离开证物室。除非你能证明今晚真的有人要销毁它们。", targetKnown: "电子记录可以复制，但红盒里的签名原件只有一份。", targetFollow: "我带着红盒。请走不会经过主机房的路线。", observerUnknown: "灰领管理员", observerRole: "潜伏档案内鬼", observerLine: "例行归档，请不要触碰封存材料。", observerKnown: "五分钟后这里只有灰。你救不了一座已经决定忘记的城市。" }
    },

    8: {
      id: 8, save: "zero-hour-level-eight-v1", title: "地下末班车", opCode: "DEAD AIR", scene: "metro", music: "train",
      spawn: [150, 700], countdownLabel: "距毒气扩散", theme: { accent: "#58c8c1", rgb: "88,200,193", danger: "#f06470" },
      clues: [
        { id: "researcher", name: "核心人物：时间研究员叶芷", unknown: "确认废线中等待转移的研究员" },
        { id: "tech", name: "黄灯维修员：伪装投毒者", unknown: "识别控制通风系统的人" },
        { id: "vent", name: "通风口令 3146／00:30 释放", unknown: "截获毒气释放指令" },
        { id: "gas", name: "N-13 神经气体／逆向排风可清除", unknown: "确认车站事故的真实手段" }
      ],
      timeline: [{ time: "04:20", clue: "tech", text: "黄灯维修员进入废线" }, { time: "03:15", clue: "vent", text: "通风系统接受远程口令" }, { time: "02:05", clue: "gas", text: "N-13 气瓶压力下降" }, { time: "00:30", clue: "vent", text: "毒气覆盖地下实验站" }],
      target: { name: "叶芷", badge: "叶芷", path: [{ t: 0, x: 390, y: 490 }, { t: 60, x: 390, y: 490 }, { t: 135, x: 650, y: 520 }, { t: 225, x: 1040, y: 450 }, { t: 300, x: 1120, y: 530 }], inspectLabel: "观察携带银色数据箱的女人", talkLabel: "与叶芷交谈", followLabel: "确认叶芷状态", discover: "她是叶芷，回声计划早期研究员，也是档案中唯一仍活着的技术负责人。", needIntel: "她担心你是来抢数据的。你还不知道站内的投毒方案。", needActions: "通风系统和封锁门仍由敌人控制。", accept: "你说出 N-13 和 3146，叶芷相信你来自下一次循环并跟随撤离。", followStatus: "叶芷正保护数据箱跟随你。", style: { coat: "#4e7d79", skin: "#d2aa90", hair: "#302c31", hairStyle: "ponytail", glasses: true, briefcase: true, scarf: "#9ce0d8", bag: false } },
      observer: { name: "伪装维修员", path: [{ t: 40, x: 90, y: 620 }, { t: 75, x: 440, y: 505 }, { t: 105, x: 930, y: 610 }, { t: 145, x: 930, y: 610 }, { t: 230, x: 1100, y: 575 }, { t: 300, x: 1100, y: 575 }], inspectLabel: "观察佩戴黄色检修灯的工人", knownLabel: "跟踪伪装投毒者", needTarget: "维修员的动作可疑，但你还不知道谁是他的目标。", discover: "他的检修灯没有地铁频闪认证，腰间却带着化学防护阀。", style: { coat: "#706739", skin: "#a97963", hair: "#202426", hairStyle: "short", hat: "#d1ae45", hatStyle: "hardhat", mask: "#637c78", gloves: "#344442", toolbelt: true, bag: false } },
      signal: { x: 1010, y: 610, start: 105, end: 145, label: "监听通风控制台", needObserver: "你还不能判断这是不是正常的排风测试。", discover: "通风控制：口令 3146，00:30 释放 N-13，随后伪造线路泄漏。", missed: "远程通风测试已经结束，按 R 回溯取得口令。" },
      evidence: { x: 690, y: 600, start: 175, label: "检查结霜的压力阀", discover: "压力阀连接 N-13 气瓶；把风向反转可将毒气排入废弃隧道。" },
      autoRewindText: "毒气型号、口令和排风方法已经确认。带着记忆回到通风权限开放前。",
      access: { x: 260, y: 270, deadline: 82, label: "输入通风控制口令", openLabel: "通风控制室已开启", openStatus: "通风控制室保持开放。", needIntel: "控制室需要四位检修口令。", missed: "03:38 后通风权限转交远程中心，3146 已失效。", success: "3146 验证通过，通风控制室开放。" },
      actions: [
        { x: 260, y: 165, badge: "逆向排风", label: "反转站内排风方向", doneLabel: "排风已经反转", locked: "必须先进入通风控制室。", success: "排风方向反转，N-13 将被送入无人废线。", doneStatus: "逆向排风持续运行。" },
        { x: 860, y: 185, badge: "疏散闸门", label: "解除实验站封锁门", doneLabel: "疏散闸门已开启", locked: "需要通风控制权限解除联动封锁。", success: "疏散闸门开启，人员拥有安全出口。", doneStatus: "疏散路线保持畅通。" }
      ],
      safe: { x: 1190, y: 315, label: "进入正压安全车厢", needTarget: "叶芷和数据箱仍在站台。", needActions: "毒气或封锁链仍未解除。" },
      failure: { at: 270, note: "如果 N-13 进入站内通风系统——", code: "DEAD AIR / 00:30", title: "地下站失去回应", body: "所有监控画面同时静止。事故报告把数十人的死亡写成一次制冷剂泄漏。", shortTitle: "毒气已经扩散", loopText: "00:30，通风口吹出无色冷雾。叶芷倒在数据箱旁，地下实验站失去全部回应。" },
      intro: { body: "档案显示回声计划曾在废弃地铁线进行实验。唯一幸存的研究员叶芷准备交出数据，但白鸦残党已接管通风系统。", goal: "在 00:30 前清除 N-13，并把叶芷带入正压车厢", button: "进入地下实验线" },
      resetText: "地下站回到五分钟前，N-13 与通风口令仍在记忆中。",
      win: { title: "末班车带回一个答案", body: "叶芷确认，时间循环不是武器，而是一套灾难预警系统。有人篡改了它，让城市不断重演最坏的五分钟。", rowValue: "N-13 被排入废线，叶芷与研究数据获救" },
      next: "second-act.html#9", nextLabel: "进入第九关：镜像证人", crowd: COMMON_CROWD, obstacles: COMMON_OBSTACLES,
      art: { floor1: "#152329", floor2: "#18282e", panel: "#213841", line: "#4d6971", left: "通风控制室", leftSub: "VENT CONTROL", center: "废弃实验站", centerSub: "PLATFORM X-13", right: "正压安全车厢", rightSub: "SAFE CARRIAGE" },
      story: { previous: "原始档案指向一条从未对公众开放的地下实验线。", purpose: "识别投毒者，取得通风权限并救出回声计划研究员。", question: "循环究竟是敌人制造的武器，还是被劫持的保护系统？", advance: "叶芷证明回声系统原本用于把灾难前五分钟发送给过去。", nextGoal: "寻找掌握系统密钥的双胞胎证人，辨认真正的罗安。", firstThought: "叶芷携带银色数据箱。先确认她，再观察谁控制站内通风。", targetHint: "寻找始终护着银色数据箱的女人。", observerHint: "真正的地铁维修灯会以固定频率闪烁。", signalPlace: "东南侧通风控制台", evidencePlace: "站台中央结霜的压力阀", guide: { name: "废线司机陈伯", x: 205, y: 700 }, thread: { x: 450, y: 650, label: "读取停运列车的黑匣子", discovery: "黑匣子记录到十二次相同刹车声，其中一次出现了你尚未说出口的警告。" } },
      people: [
        { name: "庄禾", role: "地铁调度员", dir: "right", line: "这条线停运三年了，今晚却收到一条远程通风测试。" },
        { name: "黎阳", role: "隧道检修工", dir: "left", line: "黄色检修灯少了认证频闪，那个工人不是我们班组的。" },
        { name: "丁雪", role: "实验站护士", dir: "down", line: "N-13 无色无味，只有压力阀结霜会暴露它。" },
        { name: "许放", role: "迷路乘客", dir: "up", line: "银箱女人一直说时间不够，好像她知道五分钟后会发生什么。" }
      ],
      persona: { guideRole: "废线末班司机", unknown: "银色数据箱女人", targetRole: "回声计划研究员", targetBefore: "离我远点。今晚每个接近数据箱的人都可能是白鸦的人。", targetKnown: "回声系统能把记忆送回五分钟前，但有人把预警改成了牢笼。", targetFollow: "正压车厢能隔绝 N-13。走，我会带上全部实验数据。", observerUnknown: "黄灯维修员", observerRole: "伪装投毒者", observerLine: "通风测试期间禁止靠近控制台。", observerKnown: "你可以反转一次风向，但下一轮我们会知道你从哪里来。" }
    },

    9: {
      id: 9, save: "zero-hour-level-nine-v1", title: "镜像证人", opCode: "FALSE FACE", scene: "lab", music: "hospital",
      spawn: [150, 700], countdownLabel: "距身份替换", theme: { accent: "#86c98e", rgb: "134,201,142", danger: "#ec6170" },
      clues: [
        { id: "witness", name: "核心人物：左腕旧表的罗安", unknown: "在两名证人中确认真正的罗安" },
        { id: "double", name: "右手墨迹：接受记忆植入的替身", unknown: "识别试图取代证人的人" },
        { id: "swap", name: "身份库口令 2218／00:55 覆写", unknown: "监听身份替换程序" },
        { id: "ink", name: "替身的记忆只到今晚 23:40", unknown: "找到两人叙述中的时间断层" }
      ],
      timeline: [{ time: "04:15", clue: "double", text: "第二名“罗安”进入实验室" }, { time: "03:10", clue: "swap", text: "身份库开始比对覆写" }, { time: "02:00", clue: "ink", text: "替身丢弃记忆校准纸" }, { time: "00:55", clue: "swap", text: "真证人身份被永久删除" }],
      target: { name: "罗安", badge: "真罗安", path: [{ t: 0, x: 380, y: 485 }, { t: 58, x: 380, y: 485 }, { t: 135, x: 640, y: 520 }, { t: 220, x: 1020, y: 445 }, { t: 300, x: 1100, y: 520 }], inspectLabel: "观察左腕戴旧机械表的男人", talkLabel: "核对罗安的记忆", followLabel: "确认真罗安状态", discover: "旧表停在 23:40，他能说出叶芷才知道的实验代号——这是真正的罗安。", needIntel: "只有外貌相同还不够，你需要证明另一人接受了记忆植入。", needActions: "身份库仍会删除真罗安，并把替身登记成唯一合法身份。", accept: "你指出 23:40 的记忆断层，罗安相信你并同意进入隔离室。", followStatus: "真罗安正跟随你前往隔离室。", style: { coat: "#476858", skin: "#bc8e72", hair: "#2d2a27", hairStyle: "curly", beard: true, glasses: true, badge: "#86c98e", bag: false } },
      observer: { name: "镜像替身", path: [{ t: 45, x: 90, y: 620 }, { t: 78, x: 450, y: 505 }, { t: 110, x: 920, y: 610 }, { t: 150, x: 920, y: 610 }, { t: 235, x: 1110, y: 575 }, { t: 300, x: 1110, y: 575 }], inspectLabel: "观察右腕空着的相似男人", knownLabel: "跟踪镜像替身", needTarget: "两个人的外貌和证件完全相同，先找到真正的证人。", discover: "他用右手签名，指侧沾着刚打印的记忆校准墨；真正的罗安是左利手。", style: { coat: "#65464f", skin: "#bc8e72", hair: "#2d2a27", hairStyle: "curly", beard: false, gloves: "#45383c", earpiece: true, badge: "#ec6170", bag: false } },
      signal: { x: 1000, y: 610, start: 110, end: 150, label: "监听身份库覆写程序", needObserver: "尚未识别替身，身份比对日志无法说明谁会被删除。", discover: "身份覆写口令 2218；00:55 后，真罗安会被系统标记为冒名者。", missed: "身份比对已经完成，按 R 回溯监听完整口令。" },
      evidence: { x: 700, y: 600, start: 180, label: "检查记忆校准纸", discover: "校准纸显示替身记忆终止于 23:40，之后的回答全部来自即时提示。" },
      autoRewindText: "真假身份、覆写口令和记忆断层已经确认。回到身份库开放前。",
      access: { x: 260, y: 270, deadline: 84, label: "输入身份库口令", openLabel: "身份库已开启", openStatus: "身份库保持开放。", needIntel: "身份库需要本次比对口令。", missed: "03:36 后身份库进入只读覆写，2218 已失效。", success: "2218 验证通过，身份库管理权限开放。" },
      actions: [
        { x: 260, y: 165, badge: "真身份", label: "锁定罗安原始生物档案", doneLabel: "真身份已锁定", locked: "必须先进入身份库。", success: "罗安的原始生物档案被离线锁定，无法删除。", doneStatus: "真罗安身份受到保护。" },
        { x: 855, y: 185, badge: "替身频道", label: "切断替身即时提示频道", doneLabel: "替身频道已切断", locked: "需要身份库权限定位提示频道。", success: "替身失去即时答案，记忆断层无法继续伪装。", doneStatus: "替身提示频道保持静默。" }
      ],
      safe: { x: 1190, y: 315, label: "进入生物隔离核验室", needTarget: "真正的罗安还没有接受隔离核验。", needActions: "身份覆写链尚未完全失效。" },
      failure: { at: 245, note: "如果身份库完成最终覆写——", code: "IDENTITY REPLACED / 00:55", title: "证人变成了冒名者", body: "安保带走真正的罗安，替身则以合法身份离开实验室。城市再也无法证明谁说过真话。", shortTitle: "身份已经被替换", loopText: "00:55，罗安的通行证变成红色。和他拥有同一张脸的人微笑着通过了出口。" },
      intro: { body: "叶芷交出系统密钥持有人罗安的位置，但实验室里出现了两个拥有相同外貌、证件和大部分记忆的人。", goal: "辨认真罗安，并在 00:55 前阻止身份覆写", button: "进入镜像实验室" },
      resetText: "实验室回到五分钟前，左右手习惯与 23:40 记忆断层仍在记忆中。",
      win: { title: "镜子里只剩一个名字", body: "真罗安保住身份并交出城市回声系统的根密钥。替身失去提示频道后，供出了下一次全城停电计划。", rowValue: "真罗安身份锁定，根密钥得到保全" },
      next: "second-act.html#10", nextLabel: "进入第十关：停电之城", crowd: COMMON_CROWD, obstacles: COMMON_OBSTACLES,
      art: { floor1: "#18241f", floor2: "#1d2a24", panel: "#263a31", line: "#557264", left: "身份数据库", leftSub: "IDENTITY VAULT", center: "镜像观察室", centerSub: "MIRROR LAB", right: "生物隔离室", rightSub: "BIO SAFE" },
      story: { previous: "叶芷指出，根密钥由证人罗安保管，但敌人已启动替身计划。", purpose: "通过行为和记忆差异辨认真证人，阻止合法身份被替换。", question: "如果记忆可以复制，循环中保留下来的“你”还是原来的你吗？", advance: "罗安保住根密钥，替身供出白鸦残党将在三处城市节点制造同步停电。", nextGoal: "在五分钟内同时保住医院、通信塔和东城变电站。", firstThought: "两人几乎一样。先找左腕旧表与左手书写习惯。", targetHint: "真正的罗安把停在 23:40 的旧表戴在左腕。", observerHint: "替身用右手，指侧会留下记忆校准纸的新鲜墨迹。", signalPlace: "东南侧身份比对终端", evidencePlace: "中央观察室外的记忆校准纸", guide: { name: "伦理审查员宋妍", x: 205, y: 700 }, thread: { x: 455, y: 655, label: "读取被覆盖的镜面留言", discovery: "镜面下层刻着：每次复制记忆，都会有一个版本的你被留在原来的时间里。" } },
      people: [
        { name: "秦照", role: "生物识别工程师", dir: "right", line: "虹膜可以复制，习惯动作和无意识偏好却很难在几小时内学会。" },
        { name: "苏岑", role: "实验室保安", dir: "left", line: "系统说两个人都是真的，所以我们只能等身份库给最终答案。" },
        { name: "白荻", role: "记忆治疗师", dir: "down", line: "植入记忆通常停在一个精确时刻，之后只能靠耳机实时补充。" },
        { name: "冯嘉", role: "数据记录员", dir: "up", line: "其中一个人写字时总遮住右耳，像是在听什么提示。" }
      ],
      persona: { guideRole: "身份伦理审查员", unknown: "左腕旧表男人", targetRole: "回声根密钥持有人", targetBefore: "另一个人知道我所有童年记忆。你凭什么认定我是罗安？", targetKnown: "23:40 是实验中断的时刻，也是替身记忆停止复制的时刻。", targetFollow: "先去隔离室。只要根密钥还在，他们就不能重写整座城市。", observerUnknown: "相似的男人", observerRole: "记忆植入替身", observerLine: "我才是罗安。他戴旧表只是为了骗过你。", observerKnown: "你能找出一次断层，却无法证明自己的记忆没有被复制。" }
    },

    10: {
      id: 10, save: "zero-hour-level-ten-v1", title: "停电之城", opCode: "THREE LIGHTS", scene: "blackout", music: "station",
      spawn: [150, 700], countdownLabel: "距全城停电", theme: { accent: "#f0c85a", rgb: "240,200,90", danger: "#f05e66" },
      clues: [
        { id: "engineer", name: "核心人物：电网工程师江瑜", unknown: "确认能协调三处节点的人" },
        { id: "dispatcher", name: "红袖调度员：级联停电执行者", unknown: "识别伪造调度命令的人" },
        { id: "grid", name: "电网口令 7360／00:40 级联", unknown: "截获三节点同步指令" },
        { id: "sequence", name: "医院→通信塔→变电站的断电顺序", unknown: "确认备用电源为何仍会失败" }
      ],
      timeline: [{ time: "04:30", clue: "dispatcher", text: "红袖调度员进入控制层" }, { time: "03:30", clue: "grid", text: "三节点级联脚本上传" }, { time: "02:20", clue: "sequence", text: "备用电源顺序被改写" }, { time: "00:40", clue: "grid", text: "医院、通信塔与东城同时停电" }],
      target: { name: "江瑜", badge: "江瑜", path: [{ t: 0, x: 385, y: 485 }, { t: 55, x: 385, y: 485 }, { t: 125, x: 650, y: 520 }, { t: 220, x: 1030, y: 445 }, { t: 300, x: 1110, y: 520 }], inspectLabel: "观察携带三色线路板的女人", talkLabel: "与江瑜协调节点", followLabel: "确认江瑜状态", discover: "她是江瑜，唯一能同时授权医院、通信塔和东城变电站的人。", needIntel: "她需要明确的级联顺序与口令，不能凭猜测切换全城电网。", needActions: "三个节点尚未全部转入独立供电。", accept: "三处节点全部稳定后，江瑜同意带着根密钥进入独立控制室。", followStatus: "江瑜正在跟随你核验三节点状态。", style: { coat: "#617041", skin: "#d1a084", hair: "#302722", hairStyle: "ponytail", hat: "#d8b74e", hatStyle: "hardhat", toolbelt: true, stripe: "#f0c85a", bag: false } },
      observer: { name: "伪造调度员", path: [{ t: 30, x: 90, y: 625 }, { t: 65, x: 430, y: 500 }, { t: 90, x: 920, y: 610 }, { t: 132, x: 920, y: 610 }, { t: 225, x: 1100, y: 575 }, { t: 300, x: 1100, y: 575 }], inspectLabel: "观察戴红色袖章的调度员", knownLabel: "跟踪级联执行者", needTarget: "调度员有权限，但你还不知道谁能阻止这份命令。", discover: "红袖章编号属于十年前撤销的应急岗位，他正在伪造三节点调度。", style: { coat: "#5b3c42", skin: "#9f705c", hair: "#202326", hairStyle: "buzz", scarf: "#cf505a", earpiece: true, gloves: "#342d30", badge: "#f05e66", bag: false } },
      signal: { x: 1000, y: 610, start: 90, end: 132, label: "监听三节点调度台", needObserver: "没有确认调度员身份，这份脚本可能是正常演练。", discover: "级联脚本口令 7360；00:40 按医院、通信塔、东城顺序切断。", missed: "级联脚本已经上传，按 R 回溯截获完整口令。" },
      evidence: { x: 700, y: 600, start: 160, label: "检查烧毁的备用电源表", discover: "备用电源表被改写；三个节点必须全部切为独立供电，否则会相互拖垮。" },
      autoRewindText: "三节点顺序、口令与独立供电方法已经确认。回到授权窗口。",
      access: { x: 260, y: 270, deadline: 75, label: "输入城市电网口令", openLabel: "电网中枢已开启", openStatus: "电网中枢保持开放。", needIntel: "电网中枢需要四位应急口令。", missed: "03:45 后全城调度权被远程接管，7360 已失效。", success: "7360 验证通过，三节点独立控制开放。" },
      actions: [
        { x: 260, y: 165, badge: "医院电源", label: "切换医院独立供电", doneLabel: "医院电源已独立", locked: "必须先进入电网中枢。", success: "医院生命支持系统脱离级联电网。", doneStatus: "医院独立电源稳定。" },
        { x: 855, y: 185, badge: "通信塔", label: "切换通信塔独立供电", doneLabel: "通信塔电源已独立", locked: "需要电网中枢授权。", success: "通信塔切入本地储能，城市仍能发送警报。", doneStatus: "通信塔本地储能稳定。" },
        { x: 720, y: 520, badge: "东城变电站", label: "断开东城级联母线", doneLabel: "东城母线已断开", locked: "需要电网中枢授权。", success: "东城变电站与恶意级联脚本物理隔离。", doneStatus: "东城母线保持隔离。" }
      ],
      safe: { x: 1190, y: 315, label: "进入城市独立控制室", needTarget: "江瑜仍在主控制层。", needActions: "三个节点中仍有一处连接级联电网。" },
      failure: { at: 260, note: "如果三节点级联脚本按顺序运行——", code: "CITY BLACKOUT / 00:40", title: "整座城市熄灭", body: "医院生命支持、通信警报和东城电网依次停止。黑暗让敌人重新夺回所有节点。", shortTitle: "全城已经停电", loopText: "00:40，地图上的三盏状态灯依次熄灭。窗外的城市像被一只手抹去。" },
      intro: { body: "替身供出白鸦残党的最后反扑：同时切断医院、通信塔和东城变电站，让整座城市在黑暗中失去抵抗。", goal: "在 00:40 前让三个城市节点全部进入独立供电", button: "进入城市电网中枢" },
      resetText: "电网回到五分钟前，三节点顺序和 7360 仍在记忆中。",
      win: { title: "城市留下了三盏灯", body: "医院、通信塔和东城变电站都没有熄灭。级联脚本反向暴露了一台能跨循环发送指令的移动终端。", rowValue: "三处城市节点全部转入独立运行" },
      next: "second-act.html#11", nextLabel: "进入第十一关：循环猎人", crowd: COMMON_CROWD, obstacles: COMMON_OBSTACLES,
      art: { floor1: "#202117", floor2: "#27271a", panel: "#363523", line: "#756e3f", left: "城市电网中枢", leftSub: "GRID CONTROL", center: "三节点母线", centerSub: "THREE-LINK BUS", right: "独立控制室", rightSub: "ISLAND MODE" },
      story: { previous: "替身供出一份将在三处基础设施同步执行的级联停电脚本。", purpose: "取得电网权限，在五分钟内依次隔离医院、通信塔与东城变电站。", question: "谁能在循环重置后继续向白鸦残党发送新命令？", advance: "三节点保住后，恶意脚本暴露了一名能够保留循环记忆的敌人。", nextGoal: "追踪代号“十三”的循环猎人，保护负责定位他的行动员顾宁。", firstThought: "江瑜带着三色线路板，只有她能协调全部节点。", targetHint: "寻找携带红、蓝、黄三色线路板的工程师。", observerHint: "留意使用已撤销红袖章的调度员。", signalPlace: "东南侧三节点调度台", evidencePlace: "中央母线旁烧毁的备用电源表", guide: { name: "电网值长韩启", x: 205, y: 700 }, thread: { x: 450, y: 655, label: "读取反向跳变的电表", discovery: "电表在断电发生前就记录了恢复供电，说明另一个循环的结果正在渗入本轮。" } },
      people: [
        { name: "罗萤", role: "医院电力协调员", dir: "right", line: "医院备用机不是坏了，是仍然被级联母线拖着走。" },
        { name: "袁策", role: "通信塔工程师", dir: "left", line: "只要通信塔保住本地储能，黑暗里的人就还能收到疏散警报。" },
        { name: "杜平", role: "东城变电员", dir: "down", line: "东城母线必须物理断开，远程软件切换会被脚本再次合闸。" },
        { name: "孟夏", role: "城市调度助理", dir: "up", line: "红袖章岗位十年前就撤销了，那个人不该拥有调度权。" }
      ],
      persona: { guideRole: "城市电网值长", unknown: "三色线路板女人", targetRole: "城市电网工程师", targetBefore: "三个节点互相支援，贸然切开任何一个都会引发更大事故。", targetKnown: "顺序被改过。必须同时进入独立模式，不能只救其中一处。", targetFollow: "三盏灯都亮着。现在去独立控制室锁定根密钥。", observerUnknown: "红袖调度员", observerRole: "恶意级联执行者", observerLine: "城市级演练，无关人员离开调度层。", observerKnown: "你这轮保住三盏灯，下一轮也会有人知道你的顺序。" }
    },

    11: {
      id: 11, save: "zero-hour-level-eleven-v1", title: "循环猎人", opCode: "MEMORY HUNTER", scene: "hunter", music: "rain",
      spawn: [150, 700], countdownLabel: "距猎杀完成", theme: { accent: "#ef7c78", rgb: "239,124,120", danger: "#ff4f61" },
      clues: [
        { id: "agent", name: "核心人物：追踪行动员顾宁", unknown: "确认谁掌握循环猎人的坐标" },
        { id: "hunter", name: "十三号：能够保留循环记忆的猎人", unknown: "识别会改变路线的敌人" },
        { id: "beacon", name: "记忆信标口令 9513／00:25 锁定", unknown: "截获猎人的跨循环信标" },
        { id: "pattern", name: "猎人每轮在东西两侧交替布置陷阱", unknown: "找出敌人适应循环的规律" }
      ],
      timeline: [{ time: "04:30", clue: "hunter", text: "十三号进入行动区" }, { time: "03:20", clue: "beacon", text: "记忆信标回传本轮路线" }, { time: "02:10", clue: "pattern", text: "交替陷阱暴露位置" }, { time: "00:25", clue: "beacon", text: "十三号锁定顾宁与回声腕表" }],
      target: { name: "顾宁", badge: "顾宁", path: [{ t: 0, x: 390, y: 485 }, { t: 55, x: 390, y: 485 }, { t: 130, x: 650, y: 520 }, { t: 220, x: 1030, y: 445 }, { t: 300, x: 1110, y: 520 }], inspectLabel: "观察携带折叠天线的行动员", talkLabel: "与顾宁交换坐标", followLabel: "确认顾宁状态", discover: "她是顾宁，正在用折叠天线定位唯一能保留循环记忆的敌人“十三号”。", needIntel: "顾宁不知道哪条路线仍然安全，你必须先破解猎人的交替规律。", needActions: "记忆信标与真实路线仍会暴露你们。", accept: "假路线已经上传，记忆信标被屏蔽。顾宁跟随你进入无信号室。", followStatus: "顾宁正关闭折叠天线跟随你。", style: { coat: "#315d68", skin: "#c99679", hair: "#342729", hairStyle: "bob", earpiece: true, briefcase: true, badge: "#ef7c78", bag: false } },
      observer: { name: "十三号", path: [{ t: 30, x: 90, y: 620 }, { t: 70, x: 430, y: 500 }, { t: 100, x: 920, y: 610 }, { t: 140, x: 920, y: 610 }, { t: 230, x: 1100, y: 570 }, { t: 300, x: 1100, y: 570 }], inspectLabel: "观察戴破损白面具的人", knownLabel: "跟踪循环猎人十三号", needTarget: "你看出他在反侦察，却还不知道他要猎杀谁。", discover: "白面具内侧刻着上一次循环的时间，他也能保留重置前的记忆。", style: { coat: "#3c3035", skin: "#916553", hair: "#18191b", hairStyle: "buzz", mask: "#d8d7cf", gloves: "#2d292b", earpiece: true, toolbelt: true, bag: false } },
      signal: { x: 1000, y: 610, start: 100, end: 140, label: "监听记忆信标", needObserver: "没有确认十三号身份，这段短波无法对应猎人。", discover: "记忆信标口令 9513；00:25 将把顾宁和你的腕表位置传往下一轮。", missed: "记忆信标已经完成回传，按 R 回溯。" },
      evidence: { x: 700, y: 600, start: 170, label: "检查交替触发的陷阱", discover: "陷阱编号显示：奇数循环在西侧，偶数循环改到东侧。十三号正在根据上一轮调整路线。" },
      autoRewindText: "信标口令与交替规律已经确认。下一轮，敌人也会记得你。",
      access: { x: 260, y: 270, deadline: 78, label: "输入反追踪终端口令", openLabel: "反追踪终端已开启", openStatus: "反追踪终端保持开放。", needIntel: "终端需要记忆信标的当前口令。", missed: "03:42 后十三号已锁定终端，9513 失效。", success: "9513 验证通过，反追踪权限开放。" },
      actions: [
        { x: 260, y: 165, badge: "虚假路线", label: "向下一循环上传虚假路线", doneLabel: "虚假路线已上传", locked: "必须先进入反追踪终端。", success: "下一轮信标将收到一条不存在的撤离路线。", doneStatus: "虚假路线正在覆盖真实坐标。" },
        { x: 855, y: 185, badge: "记忆信标", label: "屏蔽记忆信标发射器", doneLabel: "记忆信标已屏蔽", locked: "需要终端权限定位发射器。", success: "十三号无法再把本轮结果带给下一次自己。", doneStatus: "记忆信标保持静默。" }
      ],
      safe: { x: 1190, y: 315, label: "进入无信号审讯室", needTarget: "顾宁仍暴露在猎人的视野中。", needActions: "虚假路线或信标屏蔽尚未完成。" },
      failure: { at: 275, note: "如果十三号把本轮坐标送入下一次循环——", code: "MEMORY LOCK / 00:25", title: "猎人提前等在终点", body: "枪声来自你认为绝对安全的方向。十三号取走回声腕表，并在下一轮拥有比你更多的记忆。", shortTitle: "猎人锁定了你", loopText: "00:25，破损白面具出现在无信号室门外。他准确叫出了你上一轮使用的假名。" },
      intro: { body: "三节点脚本暴露一台跨循环终端。它属于“十三号”——一个和你一样能记住重置、并会根据上一轮改变路线的猎人。", goal: "破解十三号的交替路线，切断记忆信标并保护顾宁", button: "进入反追踪行动区" },
      resetText: "行动区回到五分钟前，但十三号正在根据上一轮改变路线。",
      win: { title: "猎人失去了下一轮", body: "十三号收到虚假路线后进入封锁区，记忆信标也被彻底屏蔽。顾宁从他的终端里找到回声源的最终坐标。", rowValue: "循环猎人被误导，跨循环信标失效" },
      next: "second-act.html#12", nextLabel: "进入最终关：回声终点", crowd: COMMON_CROWD, obstacles: COMMON_OBSTACLES,
      adaptive: {
        even: { signal: { x: 510, y: 590, label: "监听转移到西侧的记忆信标", place: "西南侧临时信标" }, evidence: { x: 1010, y: 590, label: "检查东侧新布置的陷阱", place: "东侧走廊的新陷阱" }, observerPath: [{ t: 30, x: 1330, y: 620 }, { t: 70, x: 1040, y: 520 }, { t: 100, x: 430, y: 590 }, { t: 140, x: 430, y: 590 }, { t: 230, x: 350, y: 430 }, { t: 300, x: 350, y: 430 }], notice: "十三号记得上一轮：信标已转移到西侧，陷阱改在东侧。" },
        odd: { signal: { x: 930, y: 590, label: "监听转移到东侧的记忆信标", place: "东南侧临时信标" }, evidence: { x: 430, y: 590, label: "检查西侧新布置的陷阱", place: "西侧走廊的新陷阱" }, observerPath: [{ t: 30, x: 90, y: 620 }, { t: 70, x: 430, y: 500 }, { t: 100, x: 1010, y: 590 }, { t: 140, x: 1010, y: 590 }, { t: 230, x: 1110, y: 570 }, { t: 300, x: 1110, y: 570 }], notice: "十三号再次调整：信标回到东侧，陷阱改在西侧。" }
      },
      art: { floor1: "#21191c", floor2: "#291d21", panel: "#38262b", line: "#77434b", left: "反追踪终端", leftSub: "COUNTER TRACE", center: "记忆干扰区", centerSub: "NO FIXED ROUTE", right: "无信号审讯室", rightSub: "DEAD ZONE" },
      story: { previous: "级联脚本来自一台能把行动结果带入下一轮的移动终端。", purpose: "观察敌人如何适应循环，利用交替规律反过来误导他。", question: "如果敌人也能记住循环，你还能依靠重复获得优势吗？", advance: "十三号失去信标并被捕，他的终端给出回声系统源头坐标。", nextGoal: "进入回声核心，决定终止、保留还是完成整个时间闭环。", firstThought: "顾宁携带折叠天线，先确认她；之后不要假设敌人会重复上一轮。", targetHint: "寻找携带折叠天线、不断检查信号方向的行动员。", observerHint: "破损白面具记录着上一次循环的时间。", signalPlace: "东南侧记忆信标", evidencePlace: "中央走廊的交替陷阱", guide: { name: "反追踪员洛川", x: 205, y: 700 }, thread: { x: 460, y: 655, label: "拾取十三号遗落的循环计数器", discovery: "计数器显示的循环次数比你记得的多一轮——有人曾经替你完成过一次回溯。" } },
      people: [
        { name: "季岚", role: "信号分析员", dir: "right", line: "同一信标每轮都在换位置，但奇偶循环之间存在固定镜像。" },
        { name: "贺北", role: "封锁队员", dir: "left", line: "十三号刚才叫出了我上一轮才使用的频道，他真的记得。" },
        { name: "唐吉", role: "陷阱拆除员", dir: "down", line: "东侧陷阱的编号都是偶数，西侧都是奇数，这不是巧合。" },
        { name: "凌霜", role: "行动医师", dir: "up", line: "顾宁的折叠天线能定位信标，但打开太久也会暴露她。" }
      ],
      persona: { guideRole: "反追踪行动员", unknown: "折叠天线女人", targetRole: "猎人追踪行动员", targetBefore: "不要靠近。十三号会顺着任何接触找到我的位置。", targetKnown: "他每轮都换路线，但奇偶规律不会变，因为信标只有两组安全密钥。", targetFollow: "信标静默了。现在轮到我们决定他下一轮会看见什么。", observerUnknown: "破损白面具人", observerRole: "循环猎人十三号", observerLine: "这一幕我见过。你下一步会向左。", observerKnown: "不错，你学会改变路线了。但我比你多记得一次循环。" }
    },

    12: {
      id: 12, save: "zero-hour-level-twelve-v1", title: "回声终点", opCode: "FIRST WARNING", scene: "core", music: "tower",
      spawn: [150, 700], countdownLabel: "距永久闭环", theme: { accent: "#b998ff", rgb: "185,152,255", danger: "#f05f82" },
      clues: [
        { id: "future", name: "核心人物：来自下一轮的你", unknown: "确认回声核心中的神秘调查员" },
        { id: "director", name: "项目负责人祁牧：真正幕后操作者", unknown: "识别劫持回声系统的人" },
        { id: "root", name: "根密钥 0005／00:15 永久闭环", unknown: "截获回声核心的最终指令" },
        { id: "choice", name: "系统可终止、保留或完成稳定闭环", unknown: "查清回声核心真正的三种结局" }
      ],
      timeline: [{ time: "04:30", clue: "director", text: "祁牧进入回声核心" }, { time: "03:20", clue: "root", text: "根密钥写入时间锚" }, { time: "02:00", clue: "choice", text: "三种核心协议同时开放" }, { time: "00:15", clue: "root", text: "整座城市进入永久五分钟闭环" }],
      target: { name: "未来的你", badge: "未来的你", path: [{ t: 0, x: 390, y: 480 }, { t: 55, x: 390, y: 480 }, { t: 130, x: 650, y: 520 }, { t: 220, x: 1030, y: 445 }, { t: 300, x: 1110, y: 520 }], inspectLabel: "观察佩戴旧版回声腕表的调查员", talkLabel: "与未来的自己核对记忆", followLabel: "确认未来的你", discover: "那张脸属于更疲惫的你。旧腕表记录着你尚未经历的第十三次循环。", needIntel: "你们拥有相同记忆，但还不知道祁牧如何锁死整座城市。", needActions: "罪证、外部链路和时间锚仍未全部控制。", accept: "三条核心链已经控制。未来的你同意一起进入时间锚室完成最后选择。", followStatus: "未来的你正在跟随，等待你做出最终决定。", style: { coat: "#2d6570", skin: "#c99a7f", hair: "#3a302d", hairStyle: "swept", glasses: false, scarf: "#b998ff", gloves: "#303b43", badge: "#b998ff", bag: false } },
      observer: { name: "祁牧", path: [{ t: 30, x: 90, y: 620 }, { t: 70, x: 430, y: 500 }, { t: 100, x: 920, y: 610 }, { t: 140, x: 920, y: 610 }, { t: 230, x: 1100, y: 570 }, { t: 300, x: 1100, y: 570 }], inspectLabel: "观察佩戴白色时间徽章的负责人", knownLabel: "跟踪回声计划负责人祁牧", needTarget: "你知道他控制这里，却还不知道另一名调查员为何与你相同。", discover: "白色徽章拥有回声核心最高权限；祁牧才是批准零点协议并劫持预警系统的人。", style: { coat: "#e0dde8", skin: "#b98770", hair: "#d2ced2", hairStyle: "swept", glasses: true, cane: "#b998ff", gloves: "#38333f", badge: "#b998ff", bag: false } },
      signal: { x: 1000, y: 610, start: 100, end: 140, label: "监听根密钥写入", needObserver: "没有确认负责人身份，根密钥无法对应最终权限。", discover: "根密钥 0005；00:15 后城市将永久重复最后五分钟，不再产生新的未来。", missed: "根密钥已经写入时间锚，按 R 回溯。" },
      evidence: { x: 700, y: 600, start: 180, label: "读取三重核心协议", discover: "终止会抹去循环记忆；保留会让你成为守门人；十二条暗线可完成稳定闭环。" },
      autoRewindText: "根密钥与三种结局已经确认。回到最后一次权限窗口。",
      access: { x: 260, y: 270, deadline: 78, label: "输入回声核心根密钥", openLabel: "回声核心已开启", openStatus: "回声核心保持开放。", needIntel: "核心需要四位根密钥。", missed: "03:42 后时间锚拒绝外部输入，0005 已失效。", success: "0005 验证通过，回声核心控制层开放。" },
      actions: [
        { x: 260, y: 165, badge: "罪证镜像", label: "锁定十二次行动罪证", doneLabel: "罪证镜像已锁定", locked: "必须先进入回声核心。", success: "十二次行动与祁牧的授权记录被写入离线镜像。", doneStatus: "罪证镜像无法被时间重置。" },
        { x: 855, y: 185, badge: "外部链路", label: "切断祁牧的外部控制链", doneLabel: "外部链路已切断", locked: "需要核心权限解除链路保护。", success: "祁牧失去对城市节点和白鸦残党的控制。", doneStatus: "外部控制链保持静默。" },
        { x: 720, y: 520, badge: "时间锚", label: "稳定五分钟时间锚", doneLabel: "时间锚已稳定", locked: "需要核心权限调整时间锚。", success: "时间锚停止坍缩，最终选择窗口已经打开。", doneStatus: "时间锚等待最终选择。" }
      ],
      safe: { x: 1190, y: 315, label: "进入时间锚室", needTarget: "未来的你还没有进入时间锚室。", needActions: "三条核心链尚未全部控制。" },
      failure: { at: 285, note: "如果祁牧完成永久闭环——", code: "ETERNAL FIVE / 00:15", title: "未来从此消失", body: "城市永远重复同样的五分钟。没有人死亡，也没有人真正活到零点之后。", shortTitle: "永久闭环已经形成", loopText: "00:15，所有钟表停在同一刻。你再次睁眼，却知道这一次再也不会产生新的未来。" },
      intro: { body: "十三号的终端指向回声核心。那里站着一个来自下一轮的你，也站着批准零点协议、劫持灾难预警系统的真正负责人祁牧。", goal: "在 00:15 前控制回声核心，并决定时间循环的最终命运", button: "进入回声核心" },
      resetText: "回声核心回到五分钟前。你已经知道，这是最后一个仍有未来的循环。",
      win: { title: "最后五分钟属于你", body: "祁牧失去全部权限，未来的你站在时间锚前。终止、保留或完成闭环的选择，现在由你决定。", rowValue: "十二次行动全部完成，回声核心已受控制" },
      next: null, nextLabel: "", crowd: [[480, 620], [760, 535], [330, 560], [1160, 625], [850, 675]], obstacles: COMMON_OBSTACLES,
      finalChoice: {
        endTitle: "终止时间循环", endBody: "你关闭时间锚。城市第一次走过零点，而所有关于循环的记忆开始褪色。你救下了所有人，却再也无法证明那些未曾发生的灾难。",
        keepTitle: "成为回声守门人", keepBody: "你保留时间锚，只允许它在真正的城市级灾难前启动。未来的你消失，而你接过了他守望下一次五分钟的职责。",
        perfectTitle: "发送最初的警告", perfectBody: "十二条暗线拼成完整发送坐标。你把“如果钟声归零，跟随白鸟”送回第一关开始前，再关闭时间锚。循环完成了它唯一需要完成的使命。"
      },
      art: { floor1: "#1c1928", floor2: "#231e31", panel: "#302842", line: "#6c5b90", left: "回声核心控制层", leftSub: "ECHO CORE", center: "五分钟时间锚", centerSub: "TEMPORAL ANCHOR", right: "最终选择室", rightSub: "AFTER ZERO" },
      story: { previous: "循环猎人的终端暴露回声源坐标，所有案件终于指向同一个幕后负责人。", purpose: "控制罪证、外部链路与时间锚，阻止城市陷入永久五分钟。", question: "结束循环、保留它，还是完成那条最初的警告？", advance: "十二场灾难全部被阻止，回声系统与城市的命运由你决定。", nextGoal: "做出最终选择；收集十二条暗线可解锁完整闭环结局。", firstThought: "另一名调查员戴着旧版回声腕表。先确认他为何拥有你的脸。", targetHint: "寻找佩戴旧腕表、行动习惯与你完全相同的人。", observerHint: "白色时间徽章代表回声计划最高权限。", signalPlace: "东南侧根密钥写入台", evidencePlace: "时间锚外的三重协议终端", guide: { name: "回声工程师沈未", x: 205, y: 700 }, thread: { x: 460, y: 655, label: "读取最初警告的待发送记录", discovery: "待发送内容正是：如果钟声归零，跟随白鸟。发送者密钥属于现在的你。" } },
      people: [
        { name: "沈未", role: "回声系统工程师", dir: "right", line: "时间锚不是让人永生，而是给一次无法挽回的灾难留下修正机会。" },
        { name: "叶芷", role: "时间研究员", dir: "left", line: "终止会让循环记忆逐渐消失，但城市将重新拥有未知的未来。" },
        { name: "罗安", role: "根密钥持有人", dir: "down", line: "保留系统意味着必须有人永远记得那些没有发生过的死亡。" },
        { name: "顾宁", role: "反追踪行动员", dir: "up", line: "十二条异常记录像坐标。也许它们从一开始就在教你如何发送那条警告。" },
        { name: "唐斐", role: "市政档案员", dir: "left", line: "证据已经离线保存。这一次，无论你选择什么，祁牧都无法抹去真相。" }
      ],
      persona: { guideRole: "回声系统工程师", unknown: "旧腕表调查员", targetRole: "来自下一循环的你", targetBefore: "我知道你会问什么，因为我曾站在你的位置。先别相信我，去确认祁牧的根密钥。", targetKnown: "我不是替身。我是选择保留时间锚之后的你，也是最初警告的发送者。", targetFollow: "走到时间锚前。这一次由现在的你决定，而不是由未来替你决定。", observerUnknown: "白徽章负责人", observerRole: "回声计划负责人祁牧", observerLine: "循环让所有灾难都没有发生。你为什么还要反抗一个完美结果？", observerKnown: "没有新的未来，就没有新的错误。永远重复这五分钟，城市将永远安全。" }
    }
  };

  var levelId = parseInt(window.location.hash.slice(1), 10);
  if (!CONFIGS[levelId]) levelId = 7;
  var C = CONFIGS[levelId];
  var S = C.story;
  var PEOPLE = C.people;
  var PERSONA = C.persona;
  document.body.dataset.music = C.music;
  document.documentElement.style.setProperty("--accent", C.theme.accent);
  document.documentElement.style.setProperty("--accent-rgb", C.theme.rgb);
  document.documentElement.style.setProperty("--danger", C.theme.danger);
  document.title = "零点行动 · 第" + C.id + "关：" + C.title;
  window.ZeroSecondAct = { configs: CONFIGS, current: C };

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var app = document.getElementById("app");
  var modal = document.getElementById("modal");
  var card = document.getElementById("card");
  var meta = load();
  var state;
  var near = null;
  var keys = new Set();
  var touch = { x: 0, y: 0 };
  var touchFast = false;
  var camera = { x: 0, y: 0, zoom: 1, ready: false };
  var cw = 0, ch = 0, dpr = 1, last = performance.now(), toastTimer = 0;
  var EVENT_TIMES = C.timeline.map(function (item) { var p = item.time.split(":"); return 300 - (Number(p[0]) * 60 + Number(p[1])); });

  function $(id) { return document.getElementById(id); }
  function load() { try { return Object.assign({ loop: 1, intel: [], completed: false, prologueSeen: false }, JSON.parse(localStorage.getItem(C.save)) || {}); } catch (e) { return { loop: 1, intel: [], completed: false, prologueSeen: false }; } }
  function save() { localStorage.setItem(C.save, JSON.stringify(meta)); if (meta.completed) ZeroCampaign.complete(C.id); }
  function knows(id) { return meta.intel.indexOf(id) >= 0; }
  function knewAtStart(id) { return state.startIntel.indexOf(id) >= 0; }
  function elapsed() { return 300 - state.time; }
  function fmt(n) { n = Math.max(0, Math.ceil(n)); return String(Math.floor(n / 60)).padStart(2, "0") + ":" + String(n % 60).padStart(2, "0"); }
  function actionsDone() { return C.actions.every(function (_, i) { return state.actions[i]; }); }
  function adaptiveVariant() { if (!C.adaptive || meta.loop <= 1) return null; return meta.loop % 2 === 0 ? C.adaptive.even : C.adaptive.odd; }
  function activeSignal() { var v = adaptiveVariant(); return Object.assign({}, C.signal, v && v.signal ? v.signal : {}); }
  function activeEvidence() { var v = adaptiveVariant(); return Object.assign({}, C.evidence, v && v.evidence ? v.evidence : {}); }
  function activeObserverPath() { var v = adaptiveVariant(); return v && v.observerPath ? v.observerPath : C.observer.path; }

  function newLoop() {
    if (!$("caseQuestion")) mountGuideUI();
    state = { time: 300, running: false, ended: false, player: { x: C.spawn[0], y: C.spawn[1], r: 14, walk: 0, dir: "down" }, startIntel: meta.intel.slice(), flags: {}, access: false, actions: C.actions.map(function () { return false; }), following: false, target: null };
    near = null; camera.x = camera.y = 0; camera.zoom = 1; camera.ready = false;
    if (window.ZeroEventNotice) window.ZeroEventNotice.reset();
    renderUI();
  }

  function addIntel(id, message) { if (!knows(id)) { meta.intel.push(id); save(); if (window.ZeroAudio) ZeroAudio.cue("clue"); toast(message); renderUI(); } }
  function playRewind(done) { var o = $("rewindOverlay"); state.running = false; if (window.ZeroAudio) ZeroAudio.cue("rewind"); o.className = "rewind-overlay"; requestAnimationFrame(function () { o.classList.add("play"); }); setTimeout(function () { o.className = "rewind-overlay hidden"; if (done) done(); }, 1280); }
  function autoRewindWhenReady() { if (knows(C.clues[2].id) && knows(C.clues[3].id) && (!knewAtStart(C.clues[2].id) || !knewAtStart(C.clues[3].id)) && !state.flags.autoRewind) { state.flags.autoRewind = true; state.running = false; toast(C.autoRewindText); setTimeout(resetLoop, 1450); } }
  function threadList() { try { var list = JSON.parse(localStorage.getItem("zero-hour-red-thread-v1") || "[]"); return Array.isArray(list) ? list : []; } catch (e) { return []; } }
  function hasThread() { return threadList().some(function (item) { return item.id === C.id; }); }
  function addThread() { if (!hasThread()) ZeroCampaign.addThread(C.id, S.thread.discovery); toast("暗线证据：" + S.thread.discovery + " 这条记录将进入最终档案。"); }

  function caseData() {
    var e = elapsed(), signal = activeSignal(), evidence = activeEvidence();
    if (!knows(C.clues[0].id)) return { q: "先确认本章的核心人物", t: S.firstThought, h: S.targetHint };
    if (!knows(C.clues[1].id)) return { q: "谁在执行这次行动？", t: "核心人物已经确认。观察与其路线同步、身份细节异常的人。", h: S.observerHint };
    if (!knows(C.clues[2].id)) {
      if (e > signal.end) return { q: "敌方联络窗口已经错过", t: "本轮的关键信号已经结束。", h: "按 R 回溯；下一轮在倒计时 " + fmt(300 - signal.start) + " 前赶到" + (signal.place || S.signalPlace) + "。" };
      if (e < signal.start) return { q: "跟踪执行者的联络路线", t: "对方会在固定时间提交下一步命令。", h: "倒计时 " + fmt(300 - signal.start) + " 左右前往" + (signal.place || S.signalPlace) + "。" };
      return { q: "截获敌方实时联络", t: "信号窗口已经开启。", h: "立即前往" + (signal.place || S.signalPlace) + "并按 E。" };
    }
    if (!knows(C.clues[3].id)) {
      if (e < evidence.start) return { q: "寻找行动留下的物证", t: "解释事故手法的物品还没有出现。", h: "倒计时 " + fmt(300 - evidence.start) + " 后检查" + (evidence.place || S.evidencePlace) + "。" };
      return { q: "检查行动物证", t: "现场已经出现不属于正常流程的物品。", h: "前往" + (evidence.place || S.evidencePlace) + "并按 E。" };
    }
    if (!knewAtStart(C.clues[2].id) || !knewAtStart(C.clues[3].id)) return { q: "把完整情报带回循环起点", t: "情报已经齐全，但最早的授权窗口已经错过。", h: "按 R 回溯，下一轮先进入受限区域。" };
    if (!state.access) return { q: "利用记忆抢先进入受限区域", t: e > C.access.deadline ? "本轮授权窗口已经关闭。" : "你已经知道口令。", h: e > C.access.deadline ? "按 R 重来。" : "前往地图左上方入口，在倒计时 " + fmt(300 - C.access.deadline) + " 前按 E。" };
    for (var i = 0; i < C.actions.length; i++) if (!state.actions[i]) return { q: "切断行动链 " + (i + 1) + " / " + C.actions.length, t: i === 0 ? "先处理会造成当前灾难的核心装置。" : "敌人准备了备用路径，必须全部处理。", h: "寻找“" + C.actions[i].badge + "”并按 E。" };
    if (!state.following) return { q: "用完整证据说服核心人物", t: "行动链已经失效。", h: "找到“" + C.target.name + "”并按 E。" };
    return { q: "把核心人物带到安全区域", t: "最后一步是进入不会被敌方重新控制的区域。", h: "前往地图右上方安全区域并按 E。" };
  }

  function hint() { if (!state.running) return; ZeroDialogue.say(S.guide.name, PERSONA.guideRole, caseData().h); }
  function mountGuideUI() {
    var style = document.createElement("style");
    style.textContent = '.case-nav{position:absolute;z-index:8;top:98px;left:50%;width:min(440px,calc(100% - 500px));transform:translateX(-50%);padding:11px 14px;border:1px solid rgba(var(--accent-rgb),.28);background:linear-gradient(135deg,rgba(8,19,22,.95),rgba(5,11,14,.92));box-shadow:0 14px 36px #0006;pointer-events:none}.case-nav small{display:block;color:var(--accent);font:700 8px ui-monospace,monospace;letter-spacing:.13em}.case-nav h2{margin:5px 0 3px;font:600 14px "Songti SC",serif}.case-nav p{margin:0;color:#93a29f;font:9px/1.5 "Songti SC",serif}.touch-h{position:absolute;right:99px;bottom:101px;width:55px;height:38px;border:1px solid var(--accent);border-radius:4px;background:#03090aaa;color:var(--accent);font-size:9px;pointer-events:auto}.hint-control{border-color:rgba(var(--accent-rgb),.45);color:var(--accent)}@media(max-width:960px){.case-nav{width:min(470px,calc(100% - 280px));left:calc(50% - 110px)}}@media(max-width:720px){.case-nav{left:10px;right:10px;top:72px;width:auto;transform:none;padding:9px 12px}.case-nav h2{font-size:12px}.case-nav p{font-size:8px}}';
    document.head.appendChild(style);
    var section = document.createElement("section"); section.className = "case-nav"; section.innerHTML = '<small>当前调查目的 · H 请求提示</small><h2 id="caseQuestion"></h2><p id="caseThought"></p>';
    var top = document.querySelector(".top"), clock = $("clock"); if (top && clock) top.insertBefore(section, clock); else app.appendChild(section);
    var controls = document.querySelector(".controls"); if (controls) controls.insertAdjacentHTML("beforeend", '<span class="control hint-control"><b>H</b> 询问' + S.guide.name + '</span>');
    var mobile = document.querySelector(".mobile"); if (mobile) { var button = document.createElement("button"); button.className = "touch-h"; button.textContent = "提示 H"; button.onclick = hint; mobile.appendChild(button); }
  }

  function path(points, t) {
    if (t < points[0].t || t > points[points.length - 1].t) return null;
    for (var i = 0; i < points.length - 1; i++) if (t >= points[i].t && t <= points[i + 1].t) { var a = points[i], b = points[i + 1], u = (t - a.t) / (b.t - a.t), pose = ZeroArt.routePose(points, i); return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, dir: pose.dir, moving: pose.moving }; }
    return null;
  }
  function targetPos() { return state.following ? state.target : path(C.target.path, elapsed()); }
  function observerPos() { return path(activeObserverPath(), elapsed()); }

  function objects() {
    var e = elapsed(), t = targetPos(), o = observerPos(), signal = activeSignal(), evidence = activeEvidence();
    var list = [{ id: "guideNpc", x: S.guide.x, y: S.guide.y, label: "询问" + S.guide.name }];
    PEOPLE.forEach(function (n, i) { var p = C.crowd[i]; list.push({ id: "crowd" + i, x: p[0], y: p[1], label: "与" + n.name + "交谈" }); });
    if (!hasThread()) list.push({ id: "thread", x: S.thread.x, y: S.thread.y, label: S.thread.label });
    if (t) list.push({ id: "target", x: t.x, y: t.y, label: knows(C.clues[0].id) ? (state.following ? C.target.followLabel : C.target.talkLabel) : C.target.inspectLabel });
    if (o) list.push({ id: "observer", x: o.x, y: o.y, label: knows(C.clues[1].id) ? C.observer.knownLabel : C.observer.inspectLabel });
    if (e >= signal.start && e <= signal.end) list.push({ id: "signal", x: signal.x, y: signal.y, label: signal.label });
    if (e >= evidence.start) list.push({ id: "evidence", x: evidence.x, y: evidence.y, label: evidence.label });
    list.push({ id: "access", x: C.access.x, y: C.access.y, label: state.access ? C.access.openLabel : C.access.label });
    C.actions.forEach(function (a, i) { list.push({ id: "action" + i, x: a.x, y: a.y, label: state.actions[i] ? a.doneLabel : a.label }); });
    list.push({ id: "safe", x: C.safe.x, y: C.safe.y, label: C.safe.label });
    return list;
  }

  function nearby() {
    var list = objects(), preferredId = null;
    if (!knows(C.clues[0].id)) preferredId = "target";
    else if (!knows(C.clues[1].id)) preferredId = "observer";
    else if (!knows(C.clues[2].id)) preferredId = "signal";
    else if (!knows(C.clues[3].id)) preferredId = "evidence";
    else if (knewAtStart(C.clues[2].id) && knewAtStart(C.clues[3].id)) {
      if (!state.access) preferredId = "access";
      else {
        for (var p = 0; p < C.actions.length; p++) if (!state.actions[p]) { preferredId = "action" + p; break; }
        if (!preferredId) preferredId = state.following ? "safe" : "target";
      }
    }
    if (preferredId) {
      var preferred = list.find(function (o) { return o.id === preferredId; });
      if (preferred && Math.hypot(state.player.x - preferred.x, state.player.y - preferred.y) < 68) return preferred;
    }
    var best = null, d = 60;
    list.forEach(function (o) { var n = Math.hypot(state.player.x - o.x, state.player.y - o.y); if (n < d) { d = n; best = o; } });
    return best;
  }
  function objectivePoint() {
    var t = targetPos(), o = observerPos(), signal = activeSignal(), evidence = activeEvidence();
    if (!knows(C.clues[0].id)) return t;
    if (!knows(C.clues[1].id)) return o;
    if (!knows(C.clues[2].id)) return { x: signal.x, y: signal.y };
    if (!knows(C.clues[3].id)) return { x: evidence.x, y: evidence.y };
    if (!knewAtStart(C.clues[2].id) || !knewAtStart(C.clues[3].id)) return null;
    if (!state.access) return C.access;
    for (var i = 0; i < C.actions.length; i++) if (!state.actions[i]) return C.actions[i];
    if (!state.following) return t;
    return C.safe;
  }

  function interact() {
    if (!state.running || !near || (window.ZeroPause && window.ZeroPause.isPaused())) return;
    var id = near.id, e = elapsed(), signal = activeSignal();
    if (id.indexOf("crowd") === 0) { var n = PEOPLE[Number(id.slice(5))]; ZeroDialogue.say(n.name, n.role, n.line); return; }
    if (id === "guideNpc") { hint(); return; }
    if (id === "thread") { addThread(); return; }
    if (id === "target") {
      if (!knows(C.clues[0].id)) { addIntel(C.clues[0].id, C.target.discover); ZeroDialogue.say(C.target.name, PERSONA.targetRole, PERSONA.targetBefore); return; }
      if (state.following) { ZeroDialogue.say(C.target.name, PERSONA.targetRole, PERSONA.targetFollow); return; }
      if (!knewAtStart(C.clues[2].id) || !knewAtStart(C.clues[3].id)) { ZeroDialogue.say(C.target.name, PERSONA.targetRole, C.target.needIntel); return; }
      if (!actionsDone()) { ZeroDialogue.say(C.target.name, PERSONA.targetRole, C.target.needActions); return; }
      var p = targetPos(); state.following = true; state.target = { x: p.x, y: p.y, dir: p.dir || "down", moving: false }; toast(C.target.accept); renderUI(); return;
    }
    if (id === "observer") {
      if (!knows(C.clues[0].id)) { toast(C.observer.needTarget, true); return; }
      if (!knows(C.clues[1].id)) { addIntel(C.clues[1].id, C.observer.discover); ZeroDialogue.say(C.observer.name, PERSONA.observerRole, PERSONA.observerKnown); } else ZeroDialogue.say(C.observer.name, PERSONA.observerRole, PERSONA.observerKnown);
      return;
    }
    if (id === "signal") { if (!knows(C.clues[1].id)) { toast(signal.needObserver, true); return; } addIntel(C.clues[2].id, signal.discover); autoRewindWhenReady(); return; }
    if (id === "evidence") { var evidence = activeEvidence(); addIntel(C.clues[3].id, evidence.discover || C.evidence.discover); autoRewindWhenReady(); return; }
    if (id === "access") { if (state.access) { toast(C.access.openStatus); return; } if (!knewAtStart(C.clues[2].id)) { toast(C.access.needIntel, true); return; } if (e > C.access.deadline) { toast(C.access.missed, true); return; } state.access = true; toast(C.access.success); renderUI(); return; }
    if (id.indexOf("action") === 0) { var index = Number(id.slice(6)), action = C.actions[index]; if (state.actions[index]) { toast(action.doneStatus); return; } if (!state.access) { toast(action.locked, true); return; } state.actions[index] = true; toast(action.success); renderUI(); return; }
    if (id === "safe") { if (!state.following) { toast(C.safe.needTarget, true); return; } if (!actionsDone()) { toast(C.safe.needActions, true); return; } victory(); }
  }

  function renderUI() {
    var current = caseData();
    $("clock").textContent = fmt(state.time); $("clock").classList.toggle("danger", state.time <= 60); $("clock").dataset.label = C.countdownLabel;
    $("loop").textContent = "循环 " + String(meta.loop).padStart(2, "0"); $("levelCode").textContent = "LEVEL " + String(C.id).padStart(2, "0") + " / " + C.opCode; $("levelTitle").textContent = C.title;
    $("intelCount").textContent = meta.intel.length + " / " + C.clues.length;
    $("clueList").innerHTML = C.clues.map(function (x) { return '<div class="clue ' + (knows(x.id) ? '' : 'locked') + '">' + (knows(x.id) ? x.name : x.unknown) + '</div>'; }).join("");
    $("timeList").innerHTML = C.timeline.map(function (x) { return '<div class="time-row ' + (knows(x.clue) ? '' : 'locked') + '"><time>' + x.time + '</time><span>' + (knows(x.clue) ? x.text : '未知事件') + '</span></div>'; }).join("");
    ["badgeA", "badgeB", "badgeC"].forEach(function (id, i) { var el = $(id), action = C.actions[i]; if (!el) return; el.hidden = !action; if (action) { el.textContent = action.badge + "：" + (state.actions[i] ? "完成" : "未完成"); el.classList.toggle("on", state.actions[i]); } });
    $("targetBadge").textContent = C.target.badge + "：" + (state.following ? "已控制" : "未控制"); $("targetBadge").classList.toggle("on", state.following);
    if ($("caseQuestion")) { $("caseQuestion").textContent = current.q; $("caseThought").textContent = current.t; }
    var fast = isFast(); $("fastBadge").textContent = "时间 ×" + (fast ? 20 : 1); $("fastBadge").classList.toggle("fast", fast);
  }

  function toast(message, bad) { var el = $("toast"); el.textContent = message; el.classList.toggle("bad", !!bad); el.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove("show"); }, 4200); }
  function showPrompt() { $("prompt").classList.toggle("show", !!near); if (near) $("promptText").textContent = near.label; }
  function isMoving() { return keys.has("w") || keys.has("a") || keys.has("s") || keys.has("d") || keys.has("arrowup") || keys.has("arrowdown") || keys.has("arrowleft") || keys.has("arrowright") || Math.hypot(touch.x, touch.y) > .06; }
  function isFast() { return (keys.has("q") || touchFast) && !isMoving(); }
  function blocked(x, y) { var r = state.player.r; return x < 25 + r || y < 25 + r || x > 1425 - r || y > 815 - r || C.obstacles.some(function (b) { return x + r > b[0] && x - r < b[0] + b[2] && y + r > b[1] && y - r < b[1] + b[3]; }); }

  function update(dt) {
    if (!state.running || state.ended || (window.ZeroPause && window.ZeroPause.isPaused())) return;
    state.time = Math.max(0, state.time - dt * (isFast() ? 20 : 1));
    if (window.ZeroEventNotice) window.ZeroEventNotice.tick(elapsed(), EVENT_TIMES);
    var dx = 0, dy = 0;
    if (keys.has("a") || keys.has("arrowleft")) dx--; if (keys.has("d") || keys.has("arrowright")) dx++; if (keys.has("w") || keys.has("arrowup")) dy--; if (keys.has("s") || keys.has("arrowdown")) dy++;
    dx += touch.x; dy += touch.y; var len = Math.hypot(dx, dy);
    if (len > .01) { dx /= len; dy /= len; var speed = 185 * dt, nx = state.player.x + dx * speed, ny = state.player.y + dy * speed; if (!blocked(nx, state.player.y)) state.player.x = nx; if (!blocked(state.player.x, ny)) state.player.y = ny; state.player.walk += dt * 11; state.player.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : (dy < 0 ? "up" : "down"); }
    if (state.following) { var gx = state.player.x - state.target.x, gy = state.player.y - state.target.y, gd = Math.hypot(gx, gy); if (gd > 52) { var gs = Math.min(gd - 52, 150 * dt); state.target.dir = Math.abs(gx) > Math.abs(gy) ? (gx < 0 ? "left" : "right") : (gy < 0 ? "up" : "down"); state.target.moving = true; state.target.x += gx / gd * gs; state.target.y += gy / gd * gs; } else state.target.moving = false; }
    var signal = activeSignal();
    if (knows(C.clues[1].id) && !knows(C.clues[2].id) && elapsed() > signal.end && !state.flags.missedSignal) { state.flags.missedSignal = true; toast(signal.missed, true); }
    if (knewAtStart(C.clues[2].id) && knewAtStart(C.clues[3].id) && !state.access && elapsed() > C.access.deadline && !state.flags.missedAccess) { state.flags.missedAccess = true; toast(C.access.missed, true); }
    near = nearby(); showPrompt(); renderUI(); if (elapsed() >= C.failure.at) fail(C.failure.loopText);
  }

  function fail(reason) { if (state.ended) return; state.ended = true; state.running = false; $("fade").classList.add("on"); setTimeout(function () { $("fade").classList.remove("on"); card.innerHTML = '<span class="eyebrow">LOOP FAILED / MEMORY RETAINED</span><h1>' + C.failure.shortTitle + '</h1><p>' + reason + '</p><div class="brief"><div class="row"><b>保留情报</b><span>' + meta.intel.length + ' / ' + C.clues.length + '</span></div><div class="row"><b>尚未解决</b><span>' + caseData().q + '</span></div><div class="row"><b>下一轮建议</b><span>' + caseData().h + '</span></div></div><button class="primary" id="again">带着记忆回到五分钟前</button>'; modal.classList.remove("hidden"); $("again").onclick = resetLoop; }, 330); }
  function resetLoop() { modal.classList.add("hidden"); playRewind(function () { meta.loop++; save(); newLoop(); state.running = true; var v = adaptiveVariant(); toast(v && v.notice ? v.notice : C.resetText); }); }
  function manualReset() { if (!state.running) return; state.running = false; card.innerHTML = '<span class="eyebrow">VOLUNTARY REWIND</span><h1>主动回溯</h1><p>人物、设备和现场状态会复原，已确认的身份、口令与规律不会消失。</p><div class="brief"><div class="row"><b>当前推理</b><span>' + caseData().q + '</span></div><div class="row"><b>已知情报</b><span>' + meta.intel.length + ' / ' + C.clues.length + '</span></div></div><button class="primary" id="rewind">开始下一次循环</button><button class="secondary" id="cancel">继续本轮</button>'; modal.classList.remove("hidden"); $("rewind").onclick = resetLoop; $("cancel").onclick = function () { modal.classList.add("hidden"); state.running = true; }; }
  function restartFirst() { var was = state.running; state.running = false; card.innerHTML = '<span class="eyebrow">RESTART CAMPAIGN</span><h1>从第一关重新开始？</h1><p>第一关调查记录会被清除，本关与其他章节情报不会删除。</p><button class="primary" id="confirmFirst">确认返回第一关</button><button class="secondary" id="stay">留在当前关卡</button>'; modal.classList.remove("hidden"); $("confirmFirst").onclick = function () { localStorage.removeItem("zero-hour-level-one-v2"); window.location.href = "回声五分钟.html"; }; $("stay").onclick = function () { modal.classList.add("hidden"); state.running = was; }; }

  function victory() {
    state.running = false; state.ended = true; meta.completed = true; save();
    if (C.finalChoice) { showFinalChoice(); return; }
    var next = C.next ? '<button class="primary" id="nextLevel">' + C.nextLabel + '</button>' : '';
    card.innerHTML = '<span class="eyebrow">LEVEL ' + String(C.id).padStart(2, "0") + ' COMPLETE / MAINLINE UPDATED</span><h1>' + C.win.title + '</h1><p>' + C.win.body + '</p><div class="brief"><div class="row"><b>本关结果</b><span>' + C.win.rowValue + '</span></div><div class="row"><b>主线推进</b><span>' + S.advance + '</span></div><div class="row"><b>暗线证据</b><span>' + (hasThread() ? S.thread.discovery : '现场仍有一件不影响本关结果的异常物件未调查') + '</span></div><div class="row"><b>下一目标</b><span>' + S.nextGoal + '</span></div></div>' + next + '<button class="secondary" id="replay">重新演练本关</button><button class="secondary" id="chapters">返回关卡选择</button>';
    modal.classList.remove("hidden"); if (C.next) $("nextLevel").onclick = function () { window.location.href = C.next; }; $("replay").onclick = replay; $("chapters").onclick = ZeroCampaign.backToChapters;
  }

  function showFinalChoice() {
    var perfect = threadList().length >= ZeroCampaign.levels.length;
    card.innerHTML = '<span class="eyebrow">FINAL DECISION / AFTER ZERO</span><h1>' + C.win.title + '</h1><p>' + C.win.body + '</p><div class="brief"><div class="row"><b>终止循环</b><span>城市重新拥有未知的未来，但你的循环记忆会逐渐消失</span></div><div class="row"><b>保留循环</b><span>让系统继续预警灾难，而你成为唯一的回声守门人</span></div>' + (perfect ? '<div class="row"><b>隐藏闭环</b><span>十二条暗线已经拼成最初警告的发送坐标</span></div>' : '<div class="row"><b>隐藏闭环</b><span>收集全部十二条暗线证据后才能理解最初的警告</span></div>') + '</div><button class="primary" id="endLoop">终止时间循环</button><button class="secondary" id="keepLoop">成为回声守门人</button>' + (perfect ? '<button class="secondary perfect-ending" id="perfectLoop">发送最初的警告</button>' : '') + '<button class="secondary" id="chapters">暂不决定，返回关卡选择</button>';
    modal.classList.remove("hidden"); $("endLoop").onclick = function () { chooseEnding("end"); }; $("keepLoop").onclick = function () { chooseEnding("keep"); }; if (perfect) $("perfectLoop").onclick = function () { chooseEnding("perfect"); }; $("chapters").onclick = ZeroCampaign.backToChapters;
  }

  function chooseEnding(type) {
    var title = type === "end" ? C.finalChoice.endTitle : type === "keep" ? C.finalChoice.keepTitle : C.finalChoice.perfectTitle;
    var body = type === "end" ? C.finalChoice.endBody : type === "keep" ? C.finalChoice.keepBody : C.finalChoice.perfectBody;
    localStorage.setItem("zero-hour-ending-v1", type);
    card.innerHTML = '<span class="eyebrow">OPERATION ZERO / ENDING RECORDED</span><h1>' + title + '</h1><p>' + body + '</p><div class="brief"><div class="row"><b>完成进度</b><span>12 / 12</span></div><div class="row"><b>暗线档案</b><span>' + threadList().length + ' / 12</span></div><div class="row"><b>最终选择</b><span>' + title + '</span></div></div><button class="primary" id="chapters">返回十二关行动档案</button><button class="secondary" id="replay">重新演练最终关</button>';
    $("chapters").onclick = ZeroCampaign.backToChapters; $("replay").onclick = replay;
  }

  function replay() { localStorage.removeItem(C.save); meta = load(); newLoop(); modal.classList.add("hidden"); opening(); }
  function briefing() { card.innerHTML = '<button class="briefing-back" id="backToChapters" type="button" aria-label="返回关卡选择"><span aria-hidden="true">←</span>返回关卡选择</button><span class="eyebrow">LEVEL ' + String(C.id).padStart(2, "0") + ' / STORY BRIEFING</span><h1>' + C.title + '</h1><p>' + C.intro.body + '</p><div class="brief"><div class="row"><b>前情</b><span>' + S.previous + '</span></div><div class="row"><b>本章目的</b><span>' + S.purpose + '</span></div><div class="row"><b>核心目标</b><span>' + C.intro.goal + '</span></div><div class="row"><b>主线疑问</b><span>' + S.question + '</span></div><div class="row"><b>特殊机制</b><span>' + (C.adaptive ? '敌人会记住上一轮并改变路线' : C.finalChoice ? '三条核心链完成后，暗线收集会影响最终结局' : C.actions.length === 3 ? '本关需要处理三条行动链' : '观察固定事件，利用记忆抢先行动') + '</span></div><div class="row"><b>求助方式</b><span>按 H 或询问入口处的' + S.guide.name + '</span></div></div><button class="primary" id="start">' + C.intro.button + '</button>'; modal.classList.remove("hidden"); $("backToChapters").onclick = ZeroCampaign.backToChapters; $("start").onclick = function () { modal.classList.add("hidden"); if (!meta.prologueSeen) opening(); else { state.running = true; setTimeout(function () { toast(S.guide.name + "：" + caseData().h); }, 350); } }; }
  function opening() { var p = $("prologue"); state.running = false; state.time = Math.max(0, 300 - C.failure.at); renderUI(); $("prologueNote").innerHTML = '<b>失败结果预演</b>' + C.failure.note; $("failureCode").textContent = C.failure.code; $("failureTitle").textContent = C.failure.title; $("failureBody").textContent = C.failure.body; p.className = "prologue"; setTimeout(function () { state.time = 0; renderUI(); p.classList.add("crash"); }, 1500); setTimeout(function () { p.classList.add("blackout"); }, 2500); setTimeout(function () { p.classList.add("reveal"); }, 3150); $("wake").onclick = function () { meta.prologueSeen = true; save(); p.className = "prologue hidden"; playRewind(function () { newLoop(); state.running = true; setTimeout(function () { toast(S.guide.name + "：" + caseData().h); }, 350); }); }; }

  function resize() { var r = app.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1); cw = r.width; ch = r.height; canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr); canvas.style.width = cw + "px"; canvas.style.height = ch + "px"; }
  function rect(x, y, w, h, color, stroke) { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); if (stroke) { ctx.strokeStyle = stroke; ctx.strokeRect(x + .5, y + .5, w - 1, h - 1); } }
  function line(x1, y1, x2, y2, color, width) { ctx.strokeStyle = color; ctx.lineWidth = width || 1; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  function text(value, x, y, size, color, align) { ctx.fillStyle = color || "#abb8b4"; ctx.font = "600 " + (size || 10) + 'px "PingFang SC",sans-serif'; ctx.textAlign = align || "left"; ctx.fillText(value, x, y); }
  function glow(x, y, radius, color) { var g = ctx.createRadialGradient(x, y, 0, x, y, radius); g.addColorStop(0, color); g.addColorStop(1, "transparent"); ctx.fillStyle = g; ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2); }
  function baseFloor() { rect(0, 0, 1450, 840, C.art.floor1); for (var y = 0; y < 840; y += 38) for (var x = 0; x < 1450; x += 38) { rect(x, y, 36, 36, (x / 38 + y / 38) % 2 ? C.art.floor1 : C.art.floor2); line(x + 4, y + 33, x + 33, y + 4, "rgba(230,240,238,.025)"); } }
  function room(x, y, w, h, title, subtitle) { rect(x, y, w, h, C.art.panel, C.art.line); rect(x + 12, y + 12, w - 24, h - 24, C.art.floor1, "rgba(" + C.theme.rgb + ",.16)"); text(title, x + w / 2, y + h / 2 - 5, 15, "#dce2df", "center"); text(subtitle, x + w / 2, y + h / 2 + 19, 8, "rgba(" + C.theme.rgb + ",.72)", "center"); }
  function drawScene() {
    baseFloor(); glow(720, 410, 310, "rgba(" + C.theme.rgb + ",.07)");
    room(75, 80, 370, 220, C.art.left, C.art.leftSub); room(540, 340, 360, 140, C.art.center, C.art.centerSub); room(1030, 80, 330, 220, C.art.right, C.art.rightSub);
    if (C.scene === "archive") for (var ax = 80; ax < 1380; ax += 125) { rect(ax, 540, 88, 112, "#302623", C.art.line); for (var ay = 555; ay < 635; ay += 20) line(ax + 8, ay, ax + 80, ay, "rgba(" + C.theme.rgb + ",.24)", 3); }
    else if (C.scene === "metro") { rect(0, 680, 1450, 160, "#080e12"); for (var my = 705; my < 830; my += 55) { line(0, my, 1450, my, "#63747a", 4); line(0, my + 11, 1450, my + 11, "#263238", 3); } for (var mx = 0; mx < 1450; mx += 46) rect(mx, 686, 10, 150, "#38342d"); }
    else if (C.scene === "lab") for (var lx = 70; lx < 1400; lx += 150) { glow(lx, 620, 46, "rgba(" + C.theme.rgb + ",.08)"); rect(lx - 30, 560, 60, 110, "rgba(" + C.theme.rgb + ",.07)", C.art.line); }
    else if (C.scene === "blackout") { var nodes = [[250, 600], [720, 560], [1190, 600]]; line(nodes[0][0], nodes[0][1], nodes[1][0], nodes[1][1], C.theme.accent, 5); line(nodes[1][0], nodes[1][1], nodes[2][0], nodes[2][1], C.theme.accent, 5); nodes.forEach(function (n, i) { glow(n[0], n[1], 70, "rgba(" + C.theme.rgb + ",.15)"); ctx.strokeStyle = C.theme.accent; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(n[0], n[1], 28 + i * 3, 0, Math.PI * 2); ctx.stroke(); }); }
    else if (C.scene === "hunter") { ctx.save(); ctx.setLineDash([12, 10]); line(100, 610, 520, 510, "rgba(255,80,95,.32)", 3); line(1350, 610, 930, 510, "rgba(255,80,95,.32)", 3); ctx.restore(); }
    else if (C.scene === "core") { ctx.strokeStyle = "rgba(" + C.theme.rgb + ",.25)"; for (var r = 95; r < 310; r += 55) { ctx.lineWidth = r % 2 ? 2 : 7; ctx.beginPath(); ctx.arc(720, 550, r, 0, Math.PI * 2); ctx.stroke(); } }
    text(C.title.toUpperCase() + " / OPERATION ZERO", 720, 735, 18, "rgba(230,236,234,.12)", "center");
  }

  function drawObjects() { objects().forEach(function (o) { var d = Math.hypot(state.player.x - o.x, state.player.y - o.y); if (o.id === "target" || o.id === "observer" || o.id === "guideNpc" || o.id.indexOf("crowd") === 0 || d > 115) return; var active = near && near.id === o.id, size = active ? 10 : 7; ctx.save(); ctx.translate(o.x, o.y + Math.sin(performance.now() / 310 + o.x) * 3); ctx.rotate(Math.PI / 4); ctx.fillStyle = active ? "rgba(" + C.theme.rgb + ",.3)" : "rgba(" + C.theme.rgb + ",.12)"; ctx.strokeStyle = active ? C.theme.accent : "rgba(" + C.theme.rgb + ",.7)"; ctx.shadowColor = C.theme.accent; ctx.shadowBlur = active ? 18 : 7; ctx.fillRect(-size, -size, size * 2, size * 2); ctx.strokeRect(-size + .5, -size + .5, size * 2 - 1, size * 2 - 1); ctx.restore(); }); }
  function person(x, y, style, label, dir, moving) { var look = ZeroArt.npcStyle(style.seed || 1, style); Object.assign(look, { accent: C.theme.accent, label: label || "", labelColor: C.theme.accent, dir: dir || "down", moving: !!moving }); ZeroArt.figure(ctx, x, y, look); }
  function drawNPCs() { var t = targetPos(), o = observerPos(); if (t) person(t.x, t.y, Object.assign({ seed: C.id * 100 + 1 }, C.target.style), knows(C.clues[0].id) ? C.target.name : "", t.dir, t.moving); if (o) person(o.x, o.y, Object.assign({ seed: C.id * 100 + 2 }, C.observer.style), knows(C.clues[1].id) ? C.observer.name : "", o.dir, o.moving); PEOPLE.forEach(function (n, i) { var p = C.crowd[i]; person(p[0], p[1], Object.assign({ seed: C.id * 100 + 10 + i, coat: ["#526e72", "#6d5d4d", "#5e556e", "#54705b"][i % 4], bag: i % 3 === 0 }, n.style || {}), "", n.dir, false); }); person(S.guide.x, S.guide.y, { seed: C.id * 100 + 3, coat: "#45636a", skin: "#c99d82", hair: "#5a4a3d", hairStyle: "swept", badge: true, bag: false }, S.guide.name, "right", false); }
  function drawPlayer() { var p = state.player; ZeroArt.figure(ctx, p.x, p.y, { coat: "#286a72", accent: C.theme.accent, isPlayer: true, moving: isMoving(), dir: p.dir }); }
  function drawObjective() { var t = objectivePoint(); if (!t) return; var pulse = 30 + Math.sin(performance.now() / 180) * 5; glow(t.x, t.y, 65, "rgba(" + C.theme.rgb + ",.14)"); ctx.save(); ctx.strokeStyle = C.theme.accent; ctx.lineWidth = 2; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(t.x, t.y, pulse, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); var z = camera.zoom || 1, sx = (t.x - camera.x) * z, sy = (t.y - camera.y) * z, margin = 58, top = 175; if (sx > margin && sx < cw - margin && sy > top && sy < ch - margin) return; var x = Math.max(margin, Math.min(cw - margin, sx)), y = Math.max(top, Math.min(ch - margin, sy)), angle = Math.atan2(sy - y, sx - x); ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.fillStyle = C.theme.accent; ctx.shadowColor = C.theme.accent; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(-9, -8); ctx.lineTo(-5, 0); ctx.lineTo(-9, 8); ctx.closePath(); ctx.fill(); ctx.restore(); }
  function drawShade() { var z = camera.zoom || 1, px = (state.player.x - camera.x) * z, py = (state.player.y - camera.y) * z, g = ctx.createRadialGradient(px, py, 95 * z, px, py, Math.max(cw, ch) * .75); g.addColorStop(0, "rgba(1,4,5,0)"); g.addColorStop(.55, "rgba(1,4,5,.08)"); g.addColorStop(1, "rgba(1,4,5,.65)"); ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch); }
  function draw() { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = true; ctx.clearRect(0, 0, cw, ch); var archiveSpace = document.body.classList.contains("archive-open") && cw > 720 ? 320 : 0, plan = ZeroArt.sceneCamera(state.player, 1450, 840, cw, ch, archiveSpace); if (!camera.ready) { camera.x = plan.x; camera.y = plan.y; camera.ready = true; } else { camera.x += (plan.x - camera.x) * .09; camera.y += (plan.y - camera.y) * .09; } camera.zoom = plan.zoom; ctx.save(); ctx.scale(camera.zoom, camera.zoom); ctx.translate(-camera.x, -camera.y); ZeroArt.outerGround(ctx, camera.x, camera.y, cw / camera.zoom, ch / camera.zoom, 1450, 840, { base: C.art.floor1, grid: "rgba(" + C.theme.rgb + ",.04)", edge: C.art.panel, border: "rgba(" + C.theme.rgb + ",.18)" }); drawScene(); ZeroArt.ambient(ctx, 1450, 840, C.theme.rgb, .16); drawObjective(); drawObjects(); drawNPCs(); drawPlayer(); ctx.restore(); drawShade(); }
  function frame(now) { var dt = Math.min(.04, (now - last) / 1000); last = now; update(dt); draw(); requestAnimationFrame(frame); }

  window.addEventListener("resize", resize);
  window.addEventListener("hashchange", function () { window.location.reload(); });
  window.addEventListener("keydown", function (event) { var key = event.key.toLowerCase(); if (["w", "a", "s", "d", "q", "e", "h", "r", "arrowup", "arrowdown", "arrowleft", "arrowright"].indexOf(key) >= 0) event.preventDefault(); if (key === "e" && !event.repeat) interact(); else if (key === "h" && !event.repeat) hint(); else if (key === "r" && !event.repeat) manualReset(); else keys.add(key); renderUI(); });
  window.addEventListener("keyup", function (event) { keys.delete(event.key.toLowerCase()); renderUI(); });
  window.addEventListener("blur", function () { keys.clear(); touchFast = false; renderUI(); });
  var stick = $("stick"), knob = $("knob");
  function setStick(event) { var r = stick.getBoundingClientRect(), x = event.clientX - (r.left + r.width / 2), y = event.clientY - (r.top + r.height / 2), m = Math.hypot(x, y), max = 34, u = Math.min(1, max / Math.max(m, 1)); touch.x = x / Math.max(m, 1) * Math.min(1, m / max); touch.y = y / Math.max(m, 1) * Math.min(1, m / max); knob.style.transform = "translate(" + x * u + "px," + y * u + "px)"; }
  stick.addEventListener("pointerdown", function (event) { stick.setPointerCapture(event.pointerId); setStick(event); });
  stick.addEventListener("pointermove", function (event) { if (stick.hasPointerCapture(event.pointerId)) setStick(event); });
  stick.addEventListener("pointerup", function () { touch.x = touch.y = 0; knob.style.transform = ""; });
  $("touchE").onpointerdown = function (event) { event.preventDefault(); interact(); };
  $("touchR").onclick = manualReset;
  $("touchQ").onpointerdown = function () { touchFast = true; renderUI(); };
  $("touchQ").onpointerup = $("touchQ").onpointercancel = function () { touchFast = false; renderUI(); };
  $("restartOne").onclick = restartFirst;

  newLoop(); resize(); requestAnimationFrame(frame); briefing();
})();
