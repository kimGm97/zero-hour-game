(function(){
  "use strict";
  var KEY="zero-hour-campaign-progress-v1";
  var THREAD_KEY="zero-hour-red-thread-v1";
  var ADMIN_KEY="zero-hour-admin-mode-v1";
  var ADMIN_SNAPSHOT_KEY="zero-hour-admin-snapshot-v1";
  var LEVELS=[
    {id:1,code:"CENTRAL HUB",title:"枢纽爆破案",objective:"阻止中央枢纽炸弹在零点引爆",href:"回声五分钟.html",save:"zero-hour-level-one-v2",tone:"#f3b64f"},
    {id:2,code:"SILENT WITNESS",title:"钟楼猎杀",objective:"在雨夜枪击前救下小满",href:"level2.html",save:"zero-hour-level-two-v1",tone:"#61d3d1"},
    {id:3,code:"WHITE TOWER",title:"无声清除",objective:"阻止关键证人被伪装成医疗事故清除",href:"level3.html",save:"zero-hour-level-three-v1",tone:"#62d3b5"},
    {id:4,code:"BLACK TIDE",title:"黑潮港口",objective:"切断绑架链并救出工程师顾岚",href:"level4.html",save:"zero-hour-level-four-v1",tone:"#e3a85f"},
    {id:5,code:"BROKEN LINE",title:"断线列车",objective:"让末班列车安全驶入维修线",href:"level5.html",save:"zero-hour-level-five-v1",tone:"#6bb8ea"},
    {id:6,code:"ZERO TOWER",title:"零点塔",objective:"阻止全城清除名单被激活",href:"level6.html",save:"zero-hour-level-six-v1",tone:"#b48cff"},
    {id:7,code:"ASH ARCHIVE",title:"焚毁档案",objective:"保全白鸦留下的原始行动档案",href:"second-act.html#7",save:"zero-hour-level-seven-v1",tone:"#e5a45d"},
    {id:8,code:"DEAD AIR",title:"地下末班车",objective:"清除 N-13 毒气并救出研究员叶芷",href:"second-act.html#8",save:"zero-hour-level-eight-v1",tone:"#58c8c1"},
    {id:9,code:"FALSE FACE",title:"镜像证人",objective:"辨认真罗安并阻止身份覆写",href:"second-act.html#9",save:"zero-hour-level-nine-v1",tone:"#86c98e"},
    {id:10,code:"THREE LIGHTS",title:"停电之城",objective:"同时保住医院、通信塔与东城变电站",href:"second-act.html#10",save:"zero-hour-level-ten-v1",tone:"#f0c85a"},
    {id:11,code:"MEMORY HUNTER",title:"循环猎人",objective:"反制会记住循环并改变路线的十三号",href:"second-act.html#11",save:"zero-hour-level-eleven-v1",tone:"#ef7c78"},
    {id:12,code:"FIRST WARNING",title:"回声终点",objective:"控制回声核心并决定循环的命运",href:"second-act.html#12",save:"zero-hour-level-twelve-v1",tone:"#b998ff"}
  ];
  function admin(){try{return localStorage.getItem(ADMIN_KEY)==="1"}catch(e){return false}}
  function snapshotKeys(){return[KEY,THREAD_KEY,"zero-hour-ending-v1","zero-hour-achievement-aunt-v1"].concat(LEVELS.map(function(level){return level.save}))}
  function setAdmin(enabled){
    try{
      if(enabled){
        if(!admin()){
          var snapshot={};snapshotKeys().forEach(function(key){snapshot[key]=localStorage.getItem(key)});
          localStorage.setItem(ADMIN_SNAPSHOT_KEY,JSON.stringify(snapshot));
          localStorage.setItem(ADMIN_KEY,"1");
        }
      }else{
        var raw=localStorage.getItem(ADMIN_SNAPSHOT_KEY),snapshot=raw?JSON.parse(raw):null;
        if(snapshot)Object.keys(snapshot).forEach(function(key){if(snapshot[key]===null)localStorage.removeItem(key);else localStorage.setItem(key,snapshot[key])});
        localStorage.removeItem(ADMIN_SNAPSHOT_KEY);localStorage.removeItem(ADMIN_KEY);
      }
    }catch(e){try{localStorage.removeItem(ADMIN_KEY)}catch(ignore){}}
    return admin();
  }
  function completed(save){try{return!!(JSON.parse(localStorage.getItem(save)||"null")||{}).completed}catch(e){return false}}
  function progress(){
    var value=parseInt(localStorage.getItem(KEY)||"0",10);if(!Number.isFinite(value))value=0;
    LEVELS.forEach(function(level){if(completed(level.save))value=Math.max(value,level.id)});
    value=Math.max(0,Math.min(LEVELS.length,value));
    try{localStorage.setItem(KEY,String(value))}catch(e){}
    return value;
  }
  function complete(level){var value=Math.max(progress(),Math.max(0,Math.min(LEVELS.length,Number(level)||0)));try{localStorage.setItem(KEY,String(value))}catch(e){}return value}
  function unlocked(level){return admin()||Number(level)<=Math.min(LEVELS.length,progress()+1)}
  function threads(){try{var value=JSON.parse(localStorage.getItem(THREAD_KEY)||"[]");return Array.isArray(value)?value:[]}catch(e){return[]}}
  function addThread(level,text){var list=threads(),id=Number(level);if(!list.some(function(item){return item.id===id})){list.push({id:id,text:text});try{localStorage.setItem(THREAD_KEY,JSON.stringify(list))}catch(e){}}return list}
  function hasThread(level){return threads().some(function(item){return item.id===Number(level)})}
  function backToChapters(){window.location.href="回声五分钟.html#chapters"}
  function mainline(value){
    var lines=[
      "你因一条匿名警告来到中央枢纽。对方只留下八个字：零点不是一次爆炸。",
      "爆炸装置与追杀小满的人使用了相同的白鸦加密签名。你开始怀疑，两起案件只是同一计划的不同节点。",
      "小满的存储器列出一批将被制造成意外的关键人物。名单的用途仍不明。",
      "林舟证明名单上的人并非普通受害者，而是掌握城市基础设施权限的“钥匙持有人”。",
      "港口绑架失败后，供电网后门清单被交给信使陈默。敌方正在清除所有能阻止零点协议的人。",
      "所有路线最终指向零点广播塔。前五关不是独立案件，而是白鸦启动全城清除系统前的准备。",
      "零点塔已经沉默，但时间再次倒退。白鸦只是执行者，真正的“回声计划”正在删除原始档案。",
      "档案证明回声计划的源头在地下实验线，唯一幸存的研究员正遭到毒气清除。",
      "叶芷揭开真相：循环原本是灾难预警系统。掌握根密钥的证人罗安即将被替身覆盖。",
      "真罗安带回根密钥，也带回一张全城停电图。敌人准备让三处生命线同时熄灭。",
      "三处节点获救后，一个异常事实浮出水面：敌方特工开始记住你的循环，并主动改变路线。",
      "循环猎人被反制，回声核心坐标终于解锁。你必须决定这座城市是否还应拥有五分钟前的第二次机会。",
      "十二次行动已经结束。你的最终选择被写入回声档案，但最初那条警告是否形成闭环，取决于暗线证据。"
    ];
    var index=Math.max(0,Math.min(lines.length-1,Number(value)||0));
    if(index===12){
      try{
        var ending=localStorage.getItem("zero-hour-ending-v1");
        if(ending==="end")return"回声核心已关闭。城市重新拥有未知的未来，而你的循环记忆正在成为最后一份档案。";
        if(ending==="keep")return"回声系统仍在运行。你成为新的守门人，等待下一次只有你能听见的五分钟警报。";
        if(ending==="perfect")return"十二条暗线拼成完整坐标。你把“零点不是一次爆炸”发送给五分钟前的自己，闭环由你亲手开始。";
      }catch(e){}
    }
    return lines[index];
  }
  window.ZeroCampaign={key:KEY,threadKey:THREAD_KEY,adminKey:ADMIN_KEY,levels:LEVELS,progress:progress,complete:complete,unlocked:unlocked,threads:threads,addThread:addThread,hasThread:hasThread,mainline:mainline,admin:admin,setAdmin:setAdmin,backToChapters:backToChapters};
})();
