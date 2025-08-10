// weighted sampling + canvas compose
function loadData(){
  return Promise.resolve({NAME_PARTS, CHAR_LAYERS});
}

function rng(seedStr){
  let h=0;
  for(let i=0;i<seedStr.length;i++){ h=(h<<5)-h+seedStr.charCodeAt(i); h|=0;}
  let s = h>>>0;
  return ()=> (s = Math.imul(1664525, s) + 1013904223 >>> 0) / 4294967296;
}

function weightedPick(arr, axes, rand){
  // arr items: {t|id, w:{axis:weight}}
  const weights = arr.map(it=>{
    let w = 0.0001;
    if (it.w){
      for (const k in it.w){
        w += (axes[k]||0) * it.w[k];
      }
    } else { w += 0.1; }
    return w;
  });
  const sum = weights.reduce((a,b)=>a+b,0);
  let r = rand()*sum;
  for (let i=0;i<arr.length;i++){
    if((r-=weights[i])<=0) return arr[i];
  }
  return arr[arr.length-1];
}

function choice(arr, rand){ return arr[Math.floor(rand()*arr.length)]; }

function buildName(parts, axes, rand){
  const adj = weightedPick(parts.adjectives, axes, rand).t;
  const noun = weightedPick(parts.nouns, axes, rand).t;
  const mod  = weightedPick(parts.modifiers, axes, rand).t;
  const style = choice(parts.styles, rand);
  let name = `${adj} ${noun}`;
  if (rand()<0.8) name = `${mod} ${noun}`; // 변이
  if (style==='poetic') name = `${adj} ${noun}, ${mod}`;
  if (style==='cute') name = `${noun} • ${mod}`;
  if (style==='en') name = toEN(adj,noun,mod);
  return {name, style, tokens:[adj,noun,mod]};
}

function toEN(adj,noun,mod){
  // very simple romanization-ish placeholder
  return `Wind ${Math.random()<.5?'Spirit':'Walker'} • ${Date.now()%999}`;
}

function generateBlurb(tokens, axes){
  const [adj,noun,mod] = tokens;
  let mood = '감성적인';
  if (axes.free>0.7) mood='자유로운';
  else if (axes.warm>0.7) mood='다정한';
  else if (axes.lively>0.7) mood='활기찬';
  return `${mood} 결이 담긴 당신. ‘${adj} ${noun}’(와)과 ‘${mod}’라는 단서가 당신의 하루를 설명해요.`;
}

function tagsFromAxes(axes){
  const tags=[];
  if (axes.free>0.6) tags.push('#자유');
  if (axes.extra>0.6) tags.push('#소셜');
  if (axes.lively>0.6) tags.push('#에너지');
  if (axes.warm>0.6) tags.push('#다정');
  if (axes.dreamy>0.6) tags.push('#몽글');
  if (tags.length===0) tags.push('#차분한');
  return tags;
}

function drawCharacter(ctx, layers, axes, rand){
  const size = 900;
  // palette bg
  const pal = weightedPick(layers.palettes, axes, rand).id;
  const bgGrad = ctx.createLinearGradient(0,0,0,size);
  const palMap = {
    apricot:['#FFE6E0','#FFFFFF'],
    lilac:['#F2EEFF','#FFFFFF'],
    mint:['#E6FAFB','#FFFFFF'],
    butter:['#FFF6D6','#FFFFFF'],
    rose:['#FFE0EA','#FFFFFF'],
    sea:['#E3F4FF','#FFFFFF']
  };
  const [c1,c2] = palMap[pal]||['#FFF','#FFF'];
  bgGrad.addColorStop(0,c1); bgGrad.addColorStop(1,c2);
  ctx.fillStyle = bgGrad; ctx.fillRect(0,0,size,size);

  // animal body (simple rounded blob)
  const animal = weightedPick(layers.animals, axes, rand).id;
  ctx.save();
  ctx.translate(size/2, size/2+40);
  const color = choice(['#FFE4E1','#E6F3FF','#E8FFE6','#FFF2CC','#FDEBFF'], rand);
  ctx.fillStyle = color;
  roundedBlob(ctx, 0,0, 280, 0.4); ctx.fill();

  // pattern
  const pattern = choice(layers.patterns, rand);
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#ffffff';
  drawPattern(ctx, pattern, 280);
  ctx.globalAlpha = 1;

  // face
  const face = choice(layers.faces, rand);
  drawFace(ctx, face);

  // accessory
  const acc = weightedPick(layers.accessories, axes, rand).id;
  drawAccessory(ctx, acc);

  ctx.restore();
  // glossy highlight
  ctx.beginPath();
  ctx.arc(size*0.28,size*0.28,12,0,Math.PI*2);
  ctx.fillStyle='#fff'; ctx.fill();
}

function roundedBlob(ctx, x,y, r, wobble){
  ctx.beginPath();
  for (let a=0;a<=Math.PI*2;a+=Math.PI/24){
    const rr = r*(1+wobble*Math.sin(a*3));
    const px = x + rr*Math.cos(a);
    const py = y + rr*Math.sin(a);
    if(a===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.closePath();
}

function drawPattern(ctx, type, r){
  if (type==='plain') return;
  for (let i=-r;i<=r;i+=40){
    for (let j=-r;j<=r;j+=40){
      const x=i, y=j;
      if (Math.hypot(x,y)>r-20) continue;
      ctx.beginPath();
      if (type==='dots'){ ctx.arc(x,y,6,0,Math.PI*2); }
      else if (type==='stripes'){ ctx.rect(x-20,y-4,40,8); }
      else if (type==='stars'){ star(ctx,x,y,8,5,3); }
      else if (type==='hearts'){ heart(ctx,x,y,10); }
      else if (type==='waves'){ wave(ctx,x,y,20); }
      else if (type==='flowers'){ flower(ctx,x,y,8); }
      else if (type==='check'){ ctx.rect(x-10,y-10,20,20); }
      else if (type==='patch'){ ctx.rect(x-16,y-12,32,24); }
      else if (type==='gradient'){ ctx.globalAlpha=.1; ctx.arc(x,y,12,0,Math.PI*2); ctx.globalAlpha=1; }
      ctx.fill();
    }
  }
}

function star(ctx,x,y,r,spikes,inner){
  let rot = Math.PI/2*3; let cx=x; let cy=y; let step=Math.PI/spikes;
  ctx.moveTo(cx, cy-r);
  for(let i=0;i<spikes;i++){
    ctx.lineTo(cx+Math.cos(rot)*r, cy+Math.sin(rot)*r); rot+=step;
    ctx.lineTo(cx+Math.cos(rot)*inner, cy+Math.sin(rot)*inner); rot+=step;
  }
  ctx.lineTo(cx, cy-r); ctx.closePath();
}

function heart(ctx,x,y,s){
  ctx.moveTo(x,y);
  ctx.bezierCurveTo(x-s,y-s, x-2*s,y+s/2, x,y+1.5*s);
  ctx.bezierCurveTo(x+2*s,y+s/2, x+s,y-s, x,y);
  ctx.closePath();
}

function wave(ctx,x,y,w){
  ctx.moveTo(x-w,y); ctx.quadraticCurveTo(x,y-w, x+w,y); ctx.quadraticCurveTo(x+2*w,y+w, x+3*w,y);
  ctx.closePath();
}

function flower(ctx,x,y,r){
  for(let a=0;a<Math.PI*2;a+=Math.PI/3){
    ctx.moveTo(x,y);
    ctx.arc(x+Math.cos(a)*r, y+Math.sin(a)*r, r/2, 0, Math.PI*2);
  }
}

function drawFace(ctx,type){
  ctx.save();
  ctx.translate(0,-30);
  ctx.fillStyle='#222';
  // eyes
  ctx.beginPath(); ctx.arc(-70,-20,10,0,Math.PI*2); ctx.arc(70,-20,10,0,Math.PI*2); ctx.fill();
  // mouth
  ctx.lineWidth=6; ctx.lineCap='round'; ctx.strokeStyle='#222';
  ctx.beginPath();
  if (type==='smile'){ ctx.arc(0,10,30,0,Math.PI,false); }
  else if (type==='shy'){ ctx.arc(0,14,26,0,Math.PI,false); }
  else if (type==='cool'){ ctx.moveTo(-20,12); ctx.lineTo(20,12); }
  else if (type==='sleepy'){ ctx.moveTo(-20,5); ctx.lineTo(0,12); ctx.lineTo(20,5); }
  else if (type==='curious'){ ctx.arc(0,8,16,0,Math.PI,false); }
  else if (type==='calm'){ ctx.moveTo(-18,12); ctx.lineTo(18,12); }
  else if (type==='proud'){ ctx.arc(0,10,26,0,Math.PI*.9,false); }
  else if (type==='playful'){ ctx.arc(0,10,30,0,Math.PI,false); ctx.moveTo(30,10); ctx.arc(34,10,4,0,Math.PI*2);}
  ctx.stroke();
  // blush
  ctx.globalAlpha=.4;
  ctx.fillStyle='#ffb3c1';
  ctx.beginPath(); ctx.arc(-110,-6,14,0,Math.PI*2); ctx.arc(110,-6,14,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha=1;
  ctx.restore();
}

function drawAccessory(ctx,id){
  ctx.save();
  if (id==='compass'){
    ctx.translate(140,-80);
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(0,0,26,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#222'; ctx.lineWidth=4; ctx.stroke();
    ctx.rotate(.6); ctx.fillStyle='#ff8fab'; ctx.beginPath(); ctx.moveTo(0,-18); ctx.lineTo(8,8); ctx.lineTo(-8,8); ctx.closePath(); ctx.fill();
  } else if (id==='book'){
    ctx.translate(-160,40); ctx.fillStyle='#fff'; ctx.fillRect(-40,-26,80,52);
    ctx.strokeStyle='#222'; ctx.lineWidth=4; ctx.strokeRect(-40,-26,80,52);
  } else if (id==='headphones'){
    ctx.translate(0,-120);
    ctx.strokeStyle='#222'; ctx.lineWidth=10; ctx.beginPath(); ctx.arc(0,0,120,Math.PI*1.1,Math.PI*1.9); ctx.stroke();
    ctx.fillStyle='#222'; ctx.fillRect(-140,-20,28,70); ctx.fillRect(112,-20,28,70);
  } else if (id==='flower'){
    ctx.translate(160,-120); ctx.fillStyle='#ff8fab';
    for(let i=0;i<6;i++){ ctx.beginPath(); ctx.arc(0,0,16,0,Math.PI*2); ctx.fill(); ctx.rotate(Math.PI/3); }
    ctx.fillStyle='#ffd166'; ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.fill();
  } else if (id==='camera'){
    ctx.translate(-160,-60);
    ctx.fillStyle='#222'; ctx.fillRect(-40,-24,80,48); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.fill();
  } else if (id==='wand'){
    ctx.translate(130,-70); ctx.strokeStyle='#ffafcc'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(60,-40); ctx.stroke();
    ctx.fillStyle='#ffd166'; star(ctx,60,-40,10,5,5); ctx.fill();
  } else if (id==='scarf'){
    ctx.translate(0,70); ctx.fillStyle='#ffd6a5'; ctx.fillRect(-80,-10,160,20);
  } else if (id==='umbrella'){
    ctx.translate(120,-140); ctx.fillStyle='#a0c4ff'; ctx.beginPath(); ctx.arc(0,0,60,Math.PI,0); ctx.fill();
  }
  ctx.restore();
}

function main(){
  const payload = JSON.parse(localStorage.getItem('resultPayload')||'null');
  if (!payload){ location.href='index.html'; return; }
  loadData().then(({NAME_PARTS, CHAR_LAYERS})=>{
    const seedStr = JSON.stringify(payload.axes) + '|' + payload.seed;
    const rand = rng(seedStr);
    const built = buildName(NAME_PARTS, payload.axes, rand);
    document.getElementById('nameText').textContent = built.name;
    document.getElementById('blurb').textContent = generateBlurb(built.tokens, payload.axes);
    const tgs = tagsFromAxes(payload.axes);
    const tagsDiv = document.getElementById('tags');
    tgs.forEach(t=>{ const s=document.createElement('span'); s.className='tag'; s.textContent=t; tagsDiv.appendChild(s); });

    // draw canvas
    const canvas = document.getElementById('charCanvas');
    const ctx = canvas.getContext('2d');
    drawCharacter(ctx, CHAR_LAYERS, payload.axes, rand);

    // download
    document.getElementById('downloadBtn').onclick = ()=>{
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a'); a.href=url; a.download='my_starwind_name.png'; a.click();
    };
    document.getElementById('shareBtn').onclick = async ()=>{
      if (navigator.share){
        const blob = await (await fetch(canvas.toDataURL('image/png'))).blob();
        const file = new File([blob], 'starwind.png', {type:'image/png'});
        navigator.share({title:'내 별바람 이름', text: built.name, files:[file]}).catch(()=>{});
      } else {
        navigator.clipboard.writeText(location.href);
        alert('링크가 복사되었습니다!');
      }
    };
  });
}
main();
