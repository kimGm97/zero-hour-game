(function(){
  "use strict";
  var TAU=Math.PI*2;
  function rounded(ctx,x,y,w,h,r){
    r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
  }
  function shade(hex,amount){
    if(!/^#[0-9a-f]{6}$/i.test(hex))return hex;var n=parseInt(hex.slice(1),16),r=Math.max(0,Math.min(255,(n>>16)+amount)),g=Math.max(0,Math.min(255,((n>>8)&255)+amount)),b=Math.max(0,Math.min(255,(n&255)+amount));return"rgb("+r+","+g+","+b+")";
  }
  function ambient(ctx,w,h,rgb,strength){
    var t=performance.now()/1000,alpha=strength||.14;
    ctx.save();ctx.globalCompositeOperation="screen";
    [[w*.18,h*.22,w*.34],[w*.72,h*.43,w*.42],[w*.48,h*.82,w*.32]].forEach(function(p,i){var g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],p[2]);g.addColorStop(0,"rgba("+rgb+","+(alpha*(i?0.3:0.42))+")");g.addColorStop(1,"rgba("+rgb+",0)");ctx.fillStyle=g;ctx.fillRect(p[0]-p[2],p[1]-p[2],p[2]*2,p[2]*2)});
    var sx=(t*38)%(w+420)-210,beam=ctx.createLinearGradient(sx-210,0,sx+210,0);beam.addColorStop(0,"rgba("+rgb+",0)");beam.addColorStop(.5,"rgba("+rgb+","+(alpha*.055)+")");beam.addColorStop(1,"rgba("+rgb+",0)");ctx.fillStyle=beam;ctx.fillRect(0,0,w,h);
    ctx.restore();
    ctx.save();ctx.globalAlpha=.2;ctx.strokeStyle="rgba(220,236,232,.055)";ctx.lineWidth=1;for(var i=0;i<18;i++){var x=(i*137)%w,y=(i*83)%h;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+18+(i%4)*9,y-3);ctx.stroke()}ctx.restore();
  }
  function routePose(points,index){
    var currentA=points[index],currentB=points[Math.min(index+1,points.length-1)],dx=currentB.x-currentA.x,dy=currentB.y-currentA.y,moving=Math.hypot(dx,dy)>.5,j=index;
    while(Math.hypot(dx,dy)<=.5&&j>0){j--;dx=points[j+1].x-points[j].x;dy=points[j+1].y-points[j].y}
    var dir=Math.abs(dx)>Math.abs(dy)?(dx<0?"left":"right"):(dy<0?"up":"down");return{dir:dir,moving:moving};
  }
  function sceneCamera(player,mapW,mapH,screenW,screenH,archiveWidth){
    var zoom=Math.max(1,Math.min(1.45,Math.min(screenW/1440,screenH/810))),clearW=Math.max(360,screenW-(archiveWidth||0)),viewW=clearW/zoom,viewH=screenH/zoom;
    var basePadX=Math.min(190,Math.max(70,viewW*.14)),basePadY=Math.min(150,Math.max(70,viewH*.14));
    var padX=Math.max(basePadX,(viewW-mapW)/2+40),padY=Math.max(basePadY,(viewH-mapH)/2+40),minX=-padX,maxX=mapW+padX-viewW,minY=-padY,maxY=mapH+padY-viewH;
    var targetX=player.x-viewW/2,targetY=player.y-viewH/2;
    if(maxX<minX)targetX=(minX+maxX)/2;else targetX=Math.max(minX,Math.min(maxX,targetX));
    if(maxY<minY)targetY=(minY+maxY)/2;else targetY=Math.max(minY,Math.min(maxY,targetY));
    return{x:targetX,y:targetY,zoom:zoom,viewW:viewW,viewH:viewH,padX:padX,padY:padY};
  }
  function outerGround(ctx,viewX,viewY,viewW,viewH,mapW,mapH,palette){
    palette=palette||{};var base=palette.base||"#091214",grid=palette.grid||"rgba(190,220,215,.035)",edge=palette.edge||"#1b2a2c",step=64,startX=Math.floor((viewX-8)/step)*step,startY=Math.floor((viewY-8)/step)*step;
    ctx.save();ctx.fillStyle=base;ctx.fillRect(viewX-8,viewY-8,viewW+16,viewH+16);ctx.strokeStyle=grid;ctx.lineWidth=1;
    for(var x=startX;x<viewX+viewW+step;x+=step){ctx.beginPath();ctx.moveTo(x,viewY-8);ctx.lineTo(x,viewY+viewH+8);ctx.stroke()}
    for(var y=startY;y<viewY+viewH+step;y+=step){ctx.beginPath();ctx.moveTo(viewX-8,y);ctx.lineTo(viewX+viewW+8,y);ctx.stroke()}
    ctx.fillStyle=edge;ctx.globalAlpha=.72;ctx.fillRect(-26,-26,mapW+52,26);ctx.fillRect(-26,mapH,mapW+52,26);ctx.fillRect(-26,0,26,mapH);ctx.fillRect(mapW,0,26,mapH);ctx.globalAlpha=1;ctx.strokeStyle=palette.border||"rgba(210,232,226,.13)";ctx.setLineDash([10,9]);ctx.strokeRect(-.5,-.5,mapW+1,mapH+1);ctx.setLineDash([]);ctx.restore();
  }
  function npcStyle(seed,overrides){
    var coats=["#3e5963","#66505c","#556647","#765044","#3f526d","#655c42","#4c6260","#60475f"],skins=["#d5b39b","#b9896f","#e0bea5","#9e6f59","#c99d82","#7f5948"],hairs=["#242526","#503a31","#171d21","#6b5847","#332a33","#7a7065"],styles=["short","bob","ponytail","curly","swept","buzz"],s=Math.abs(Math.floor(seed||1));
    var out={coat:coats[s%coats.length],skin:skins[(s*3+1)%skins.length],hair:hairs[(s*5+2)%hairs.length],hairStyle:styles[(s*7+3)%styles.length],glasses:s%4===0,scarf:s%3===1,bag:s%5===0,badge:s%4===2,vest:s%6===3,hat:s%7===0?shade(coats[(s+2)%coats.length],18):null,hatStyle:s%7===0?(s%2?"beanie":"cap"):null};
    if(overrides)Object.keys(overrides).forEach(function(k){out[k]=overrides[k]});return out;
  }
  function label(ctx,text,color,lift){
    if(!text)return;lift=lift||0;ctx.save();ctx.font='600 11px "PingFang SC",sans-serif';ctx.textAlign="center";var width=Math.ceil(ctx.measureText(text).width)+18,y=-53+lift;rounded(ctx,-width/2,y,width,21,4);ctx.fillStyle="rgba(3,8,10,.93)";ctx.fill();ctx.strokeStyle="rgba(255,255,255,.2)";ctx.stroke();ctx.fillStyle=color||"#dce5e1";ctx.shadowColor=color||"#dce5e1";ctx.shadowBlur=8;ctx.fillText(text,0,y+15);ctx.restore();
  }
  function drawFace(ctx,dir,bob,skin,hair,isPlayer){
    var side=dir==="left"||dir==="right",sign=dir==="left"?-1:1,cy=-22+bob;
    ctx.fillStyle=shade(skin,-12);ctx.beginPath();ctx.ellipse(side?-sign*7.7:-8.4,cy,2.2,3.3,0,0,TAU);ctx.fill();if(!side){ctx.beginPath();ctx.ellipse(8.4,cy,2.2,3.3,0,0,TAU);ctx.fill()}
    var face=ctx.createLinearGradient(-8,cy-8,8,cy+8);face.addColorStop(0,shade(skin,18));face.addColorStop(.52,skin);face.addColorStop(1,shade(skin,-17));ctx.fillStyle=face;ctx.strokeStyle="rgba(55,28,25,.45)";ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(0,cy,8.8,10.2,0,0,TAU);ctx.fill();ctx.stroke();
    ctx.fillStyle=hair;ctx.beginPath();if(dir==="up"){ctx.ellipse(0,cy-1,9.6,10.4,0,0,TAU);ctx.fill();ctx.fillStyle=shade(hair,12);ctx.beginPath();ctx.arc(-2,cy-5,5,2.8,5.9);ctx.strokeStyle=shade(hair,12);ctx.lineWidth=2;ctx.stroke();return}ctx.arc(0,cy-4,9.5,Math.PI,TAU);ctx.quadraticCurveTo(8.5,cy-1,7.2,cy+4);ctx.lineTo(5.5,cy);ctx.quadraticCurveTo(1.5,cy-4,-1,cy-7);ctx.quadraticCurveTo(-4,cy-2,-8.2,cy+.8);ctx.lineTo(-8,cy-4);ctx.closePath();ctx.fill();
    ctx.strokeStyle=isPlayer?"#172329":"#2e2423";ctx.fillStyle=isPlayer?"#dce9e6":"#eadfd8";ctx.lineWidth=1.15;ctx.lineCap="round";
    if(side){var ex=sign*2.8;ctx.beginPath();ctx.moveTo(ex-sign*1.7,cy-1.5);ctx.lineTo(ex+sign*1.2,cy-1.2);ctx.stroke();ctx.beginPath();ctx.arc(ex,cy-.7,1.15,0,TAU);ctx.fill();ctx.fillStyle="#172024";ctx.beginPath();ctx.arc(ex+sign*.25,cy-.65,.62,0,TAU);ctx.fill();ctx.strokeStyle=shade(skin,-35);ctx.beginPath();ctx.moveTo(sign*5.5,cy+.3);ctx.lineTo(sign*8.6,cy+1.6);ctx.lineTo(sign*5.7,cy+2.3);ctx.stroke();ctx.beginPath();ctx.moveTo(sign*3.2,cy+5.2);ctx.quadraticCurveTo(sign*5,cy+6.1,sign*6.5,cy+4.9);ctx.stroke()}
    else{[-3.1,3.1].forEach(function(ex){ctx.strokeStyle=isPlayer?"#162328":"#332625";ctx.beginPath();ctx.moveTo(ex-1.7,cy-2.1);ctx.lineTo(ex+1.7,cy-1.8);ctx.stroke();ctx.fillStyle="#edf4f1";ctx.beginPath();ctx.ellipse(ex,cy-.7,1.45,1.05,0,0,TAU);ctx.fill();ctx.fillStyle="#172125";ctx.beginPath();ctx.arc(ex,cy-.55,.72,0,TAU);ctx.fill();if(isPlayer){ctx.fillStyle="#8fd7d1";ctx.beginPath();ctx.arc(ex+.2,cy-.75,.24,0,TAU);ctx.fill()}});ctx.strokeStyle=shade(skin,-36);ctx.lineWidth=.85;ctx.beginPath();ctx.moveTo(.2,cy);ctx.lineTo(-.6,cy+3.3);ctx.lineTo(1.1,cy+3.7);ctx.stroke();ctx.strokeStyle=isPlayer?"#733f3f":"#704343";ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-2.1,cy+6.2);ctx.quadraticCurveTo(0,cy+7.2,2.2,cy+6.1);ctx.stroke()}
  }
  function hairExtra(ctx,dir,bob,color,style){
    var cy=-22+bob,side=dir==="left"||dir==="right",sign=dir==="left"?-1:1;ctx.save();ctx.fillStyle=color;
    if(style==="bob"){ctx.beginPath();ctx.ellipse(-7,cy+5,3.2,6,.12,0,TAU);ctx.ellipse(7,cy+5,3.2,6,-.12,0,TAU);ctx.fill()}
    else if(style==="ponytail"){ctx.beginPath();ctx.ellipse(side?-sign*8:8,cy+2,4,6,sign*.25,0,TAU);ctx.fill();ctx.strokeStyle=shade(color,22);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(side?-sign*6:6,cy-1);ctx.lineTo(side?-sign*9:9,cy+6);ctx.stroke()}
    else if(style==="curly"){[[-7,-5],[-3,-8],[2,-8],[7,-4],[-8,1],[8,1]].forEach(function(p){ctx.beginPath();ctx.arc(p[0],cy+p[1],3.5,0,TAU);ctx.fill()})}
    else if(style==="swept"){ctx.strokeStyle=shade(color,30);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-7,cy-6);ctx.quadraticCurveTo(1,cy-11,7,cy-4);ctx.stroke()}
    else if(style==="buzz"){ctx.strokeStyle=shade(color,35);ctx.lineWidth=1;for(var i=-5;i<=5;i+=3){ctx.beginPath();ctx.moveTo(i,cy-8);ctx.lineTo(i+1,cy-5);ctx.stroke()}}
    ctx.restore();
  }
  function faceGear(ctx,dir,bob,o){
    var cy=-22+bob,side=dir==="left"||dir==="right",sign=dir==="left"?-1:1;if(dir==="up")return;ctx.save();
    if(o.glasses){ctx.strokeStyle="#172125";ctx.lineWidth=1.1;if(side){ctx.beginPath();ctx.ellipse(sign*3,cy-.7,3,2.2,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(sign*5.6,cy-.7);ctx.lineTo(sign*8,cy-1.5);ctx.stroke()}else{[-3.2,3.2].forEach(function(ex){ctx.beginPath();ctx.ellipse(ex,cy-.7,2.6,2,0,0,TAU);ctx.stroke()});ctx.beginPath();ctx.moveTo(-.6,cy-.7);ctx.lineTo(.6,cy-.7);ctx.stroke()}}
    if(o.mask){ctx.fillStyle=o.mask===true?"#9eb7b4":o.mask;ctx.strokeStyle="rgba(20,35,36,.55)";ctx.lineWidth=.7;if(side){rounded(ctx,sign>0?.5:-7.5,cy+1,7,5,1.5)}else rounded(ctx,-6.2,cy+1,12.4,5.2,1.5);ctx.fill();ctx.stroke()}
    if(o.beard&&!side){ctx.fillStyle="rgba(54,39,34,.42)";ctx.beginPath();ctx.arc(0,cy+4.6,6.1,.1,Math.PI-.1);ctx.fill()}
    if(o.earpiece){ctx.fillStyle=o.accent||"#75c9c2";ctx.beginPath();ctx.arc(side?-sign*7.2:7.2,cy,1.8,0,TAU);ctx.fill();ctx.strokeStyle="#253437";ctx.beginPath();ctx.moveTo(side?-sign*7:7,cy+1.4);ctx.lineTo(side?-sign*5.5:5.5,cy+4.5);ctx.stroke()}
    ctx.restore();
  }
  function outfit(ctx,dir,bob,o,coat,accent){
    var side=dir==="left"||dir==="right",sign=dir==="left"?-1:1;ctx.save();
    if(o.vest){ctx.fillStyle=shade(coat,34);ctx.globalAlpha=.75;if(side){ctx.save();ctx.scale(sign,1);rounded(ctx,-5,-7+bob,10,19,3);ctx.fill();ctx.restore()}else{rounded(ctx,-9,-7+bob,18,19,3);ctx.fill()}ctx.globalAlpha=1}
    if(o.scarf){ctx.strokeStyle=o.scarf===true?accent:o.scarf;ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(-6,-13+bob);ctx.quadraticCurveTo(0,-10+bob,6,-13+bob);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(side?sign*3:4,-11+bob);ctx.lineTo(side?sign*8:7,-1+bob);ctx.stroke()}
    if(o.stripe){ctx.strokeStyle=o.stripe===true?accent:o.stripe;ctx.lineWidth=2;ctx.beginPath();if(side){ctx.moveTo(sign*-3,-6+bob);ctx.lineTo(sign*5,13)}else{ctx.moveTo(-10,2+bob);ctx.lineTo(10,2+bob)}ctx.stroke()}
    if(o.badge){ctx.fillStyle=o.badge===true?accent:o.badge;ctx.shadowColor=accent;ctx.shadowBlur=6;ctx.beginPath();ctx.arc(side?sign*3:5,-3+bob,1.8,0,TAU);ctx.fill();ctx.shadowBlur=0}
    if(o.toolbelt){ctx.strokeStyle="#2b2522";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-10,9+bob);ctx.lineTo(10,9+bob);ctx.stroke();ctx.fillStyle="#725542";rounded(ctx,-8,7+bob,5,7,1);ctx.fill();rounded(ctx,4,7+bob,5,7,1);ctx.fill()}
    if(o.briefcase){var bx=side?sign*17:17;ctx.fillStyle="#171b20";rounded(ctx,bx-7,7+bob,14,12,2);ctx.fill();ctx.strokeStyle="#73767c";ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.arc(bx,7+bob,4,Math.PI,TAU);ctx.stroke()}
    if(o.cane){var cx=side?sign*16:16;ctx.strokeStyle=o.cane===true?"#c4c8ce":o.cane;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,5+bob);ctx.lineTo(cx+sign*2,24);ctx.stroke();ctx.beginPath();ctx.arc(cx-1,5+bob,3,Math.PI,TAU);ctx.stroke()}
    ctx.restore();
  }
  function figure(ctx,x,y,o){
    o=o||{};var now=performance.now()/120,walking=o.moving!==false,bob=walking?Math.abs(Math.sin(now+x*.01))*.8:0,stride=walking?Math.sin(now+x*.01)*3:0,coat=o.coat||"#315f65",skin=o.skin||"#cfad96",accent=o.accent||"#d9b875",hair=o.hair||(o.isPlayer?"#17272b":"#282829"),dir=o.dir||"down";
    ctx.save();ctx.translate(Math.round(x),Math.round(y));if(o.isPlayer)ctx.scale(1.12,1.12);
    if(o.bed){
      ctx.save();ctx.shadowColor="#000";ctx.shadowBlur=14;rounded(ctx,-27,4,54,13,5);ctx.fillStyle="rgba(0,0,0,.48)";ctx.fill();ctx.restore();rounded(ctx,-24,-9,48,27,6);var linen=ctx.createLinearGradient(0,-9,0,18);linen.addColorStop(0,"#edf3f0");linen.addColorStop(1,"#a8bbb5");ctx.fillStyle=linen;ctx.fill();ctx.strokeStyle="rgba(255,255,255,.28)";ctx.stroke();ctx.fillStyle=coat;rounded(ctx,-16,-6,32,15,6);ctx.fill();drawFace(ctx,"down",9,skin,hair,false);hairExtra(ctx,"down",9,hair,o.hairStyle);faceGear(ctx,"down",9,o);label(ctx,o.label,o.labelColor,-4);ctx.restore();return;
    }
    var side=dir==="left"||dir==="right",facing=dir==="left"?-1:1;
    ctx.save();ctx.shadowColor="#000";ctx.shadowBlur=14;ctx.fillStyle="rgba(0,0,0,.52)";ctx.beginPath();ctx.ellipse(side?facing*2:0,22,side?22:20,7.5,side?facing*.08:0,0,TAU);ctx.fill();ctx.restore();
    var body=ctx.createLinearGradient(-16,-13,15,19);body.addColorStop(0,shade(coat,30));body.addColorStop(.46,coat);body.addColorStop(1,shade(coat,-30));ctx.lineCap="round";
    if(side){
      ctx.save();ctx.scale(facing,1);ctx.strokeStyle="#0d1518";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-3,11);ctx.lineTo(-5-stride*.28,22);ctx.moveTo(4,11);ctx.lineTo(8+stride*.62,20);ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle="#344246";ctx.beginPath();ctx.moveTo(-6-stride*.28,23);ctx.lineTo(1-stride*.28,23);ctx.moveTo(7+stride*.62,21);ctx.lineTo(14+stride*.62,21);ctx.stroke();ctx.fillStyle=body;ctx.strokeStyle="rgba(1,5,6,.72)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-7,-12+bob);ctx.quadraticCurveTo(-10,-5,-9,10);ctx.quadraticCurveTo(-5,18,3,19);ctx.quadraticCurveTo(10,15,9,2);ctx.quadraticCurveTo(8,-10,3,-12+bob);ctx.quadraticCurveTo(-2,-15,-7,-12+bob);ctx.fill();ctx.stroke();ctx.strokeStyle=shade(coat,-20);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-4,-7+bob);ctx.lineTo(-8,8+bob);ctx.moveTo(5,-7+bob);ctx.lineTo(12,7+bob);ctx.stroke();ctx.fillStyle=o.gloves||skin;[-8,12].forEach(function(hx){ctx.beginPath();ctx.arc(hx,9+bob,2.6,0,TAU);ctx.fill()});if(o.bag){rounded(ctx,-10,-1,10,17,3);ctx.fillStyle=o.bagColor||"#20282a";ctx.fill();ctx.strokeStyle="#697679";ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.arc(-1,-5,8,1.9,4.6);ctx.stroke()}ctx.restore();
    }else{
      ctx.strokeStyle="#0d1518";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-5,11);ctx.lineTo(-7+stride,22);ctx.moveTo(5,11);ctx.lineTo(7-stride,22);ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle=dir==="up"?"#172125":"#344246";ctx.beginPath();ctx.moveTo(-10+stride,23);ctx.lineTo(-3+stride,23);ctx.moveTo(3-stride,23);ctx.lineTo(11-stride,23);ctx.stroke();ctx.fillStyle=body;ctx.strokeStyle="rgba(1,5,6,.72)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-10,-12+bob);ctx.quadraticCurveTo(-16,-7,-15,10);ctx.quadraticCurveTo(-11,19,0,20);ctx.quadraticCurveTo(11,19,15,10);ctx.quadraticCurveTo(16,-7,10,-12+bob);ctx.quadraticCurveTo(0,-16,-10,-12+bob);ctx.fill();ctx.stroke();ctx.strokeStyle=shade(coat,-20);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-10,-7+bob);ctx.lineTo(-15,8+bob);ctx.moveTo(10,-7+bob);ctx.lineTo(15,8+bob);ctx.stroke();ctx.fillStyle=o.gloves||skin;[-15,15].forEach(function(hx){ctx.beginPath();ctx.arc(hx,9+bob,2.6,0,TAU);ctx.fill()});if(o.bag){rounded(ctx,9,-1,11,17,3);ctx.fillStyle=o.bagColor||"#20282a";ctx.fill();ctx.strokeStyle="#697679";ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.arc(9,-5,8,-1.4,1.25);ctx.stroke()}
    }
    outfit(ctx,dir,bob,o,coat,accent);ctx.fillStyle=shade(skin,-12);rounded(ctx,-3,-15+bob,6,5,2);ctx.fill();drawFace(ctx,dir,bob,skin,hair,!!o.isPlayer);hairExtra(ctx,dir,bob,hair,o.hairStyle);faceGear(ctx,dir,bob,o);
    if(o.hat){ctx.fillStyle=o.hat;if(o.hatStyle==="hardhat"){ctx.beginPath();ctx.arc(0,-29+bob,9,Math.PI,TAU);ctx.fill();rounded(ctx,-12,-29+bob,24,4,1);ctx.fill();ctx.fillStyle=shade(o.hat,35);rounded(ctx,-2,-37+bob,4,9,2);ctx.fill()}else if(o.hatStyle==="beanie"){ctx.beginPath();ctx.arc(0,-27+bob,9,Math.PI,TAU);ctx.fill();rounded(ctx,-10,-28+bob,20,5,2);ctx.fill();ctx.beginPath();ctx.arc(0,-36+bob,2.5,0,TAU);ctx.fill()}else{rounded(ctx,-11,-29+bob,22,6,2);ctx.fill();ctx.fillStyle=shade(o.hat,-22);rounded(ctx,-8,-33+bob,16,7,4);ctx.fill()}}
    if(o.umbrella){ctx.save();ctx.strokeStyle="#121719";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(0,-29);ctx.lineTo(0,16);ctx.stroke();ctx.beginPath();ctx.arc(0,-29,26,Math.PI,TAU);ctx.fillStyle="rgba(14,19,23,.96)";ctx.fill();ctx.strokeStyle="#59666c";ctx.lineWidth=1;ctx.stroke();ctx.restore()}
    if(o.isPlayer){ctx.save();ctx.fillStyle=shade(coat,45);if(side){ctx.scale(facing,1);ctx.beginPath();ctx.moveTo(-6,-12+bob);ctx.lineTo(2,-5+bob);ctx.lineTo(6,-12+bob);ctx.lineTo(3,-14+bob);ctx.lineTo(-3,-9+bob);ctx.closePath();ctx.fill();ctx.strokeStyle=accent;ctx.shadowColor=accent;ctx.shadowBlur=10;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-2,-7+bob);ctx.lineTo(5,12);ctx.stroke();ctx.fillStyle="#1a272a";rounded(ctx,2,2+bob,5,8,2);ctx.fill();ctx.strokeStyle=accent;ctx.lineWidth=1;ctx.stroke()}else if(dir==="up"){rounded(ctx,-10,-12+bob,20,6,3);ctx.fill();ctx.strokeStyle=accent;ctx.shadowColor=accent;ctx.shadowBlur=9;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-7+bob);ctx.lineTo(0,13);ctx.stroke();ctx.beginPath();ctx.moveTo(-8,-9+bob);ctx.lineTo(0,-4+bob);ctx.lineTo(8,-9+bob);ctx.stroke()}else{ctx.beginPath();ctx.moveTo(-10,-11+bob);ctx.lineTo(-2,-4+bob);ctx.lineTo(0,-11+bob);ctx.lineTo(2,-4+bob);ctx.lineTo(10,-11+bob);ctx.lineTo(7,-13+bob);ctx.lineTo(0,-8+bob);ctx.lineTo(-7,-13+bob);ctx.closePath();ctx.fill();ctx.strokeStyle=accent;ctx.shadowColor=accent;ctx.shadowBlur=10;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-2,-6+bob);ctx.lineTo(2,13);ctx.stroke();ctx.fillStyle=accent;ctx.beginPath();ctx.arc(3,1+bob,2.2,0,TAU);ctx.fill();ctx.fillStyle="#1a272a";rounded(ctx,-9,1+bob,5,8,2);ctx.fill();ctx.strokeStyle=accent;ctx.lineWidth=1;ctx.stroke()}ctx.restore()}else if(o.mark){ctx.fillStyle=accent;ctx.shadowColor=accent;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(0,0,2.4,0,TAU);ctx.fill();ctx.shadowBlur=0}
    label(ctx,o.label,o.labelColor||accent,o.umbrella?-17:0);ctx.restore();
  }
  window.ZeroArt={ambient:ambient,figure:figure,rounded:rounded,routePose:routePose,npcStyle:npcStyle,sceneCamera:sceneCamera,outerGround:outerGround};
})();
