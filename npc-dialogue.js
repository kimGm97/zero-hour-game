(function(){
  "use strict";
  var root,timer;
  function ensure(){if(root)return;root=document.createElement("section");root.className="npc-dialogue";root.setAttribute("aria-live","polite");root.innerHTML='<div class="npc-avatar" id="npcAvatar"></div><div class="npc-copy"><div class="npc-meta"><b id="npcName"></b><span id="npcRole"></span></div><p id="npcLine"></p></div><span class="npc-key">E · 继续行动</span>';document.body.appendChild(root)}
  function initials(name){var clean=String(name||"?").replace(/[·\s]/g,"");return clean.slice(Math.max(0,clean.length-2))}
  function say(name,role,text,duration){ensure();document.getElementById("npcAvatar").textContent=initials(name);document.getElementById("npcName").textContent=name;document.getElementById("npcRole").textContent=role||"现场人物";document.getElementById("npcLine").textContent=text;root.classList.remove("show");requestAnimationFrame(function(){root.classList.add("show")});clearTimeout(timer);timer=setTimeout(close,duration||4800);if(window.ZeroAudio)window.ZeroAudio.cue("dialog")}
  function close(){if(root)root.classList.remove("show")}
  window.ZeroDialogue={say:say,close:close};
})();
