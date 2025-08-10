// quiz paging + score compute + navigation to result
const PER_PAGE = 5;
const root = document.getElementById('quizRoot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const bar = document.getElementById('bar');

let page = 0;
const answers = Array(QUESTIONS.length).fill(null); // 1..5

function render() {
  root.innerHTML = '';
  const start = page * PER_PAGE;
  const slice = QUESTIONS.slice(start, start + PER_PAGE);
  slice.forEach((q, i) => {
    const idx = start + i;
    const wrap = document.createElement('div');
    wrap.className = 'question';
    wrap.innerHTML = `<div>${idx+1}. ${q.q}</div>`;
    const opts = document.createElement('div');
    opts.className = 'options';
    for (let k=1;k<=5;k++) {
      const btn = document.createElement('button');
      btn.type='button';
      btn.className = 'option' + (answers[idx]===k?' selected':'');
      btn.textContent = k===1?'전혀아님':k===5?'매우그렇다':(''+k);
      btn.onclick = () => { answers[idx]=k; render(); };
      opts.appendChild(btn);
    }
    wrap.appendChild(opts);
    root.appendChild(wrap);
  });

  prevBtn.disabled = page===0;
  const last = Math.ceil(QUESTIONS.length/PER_PAGE)-1;
  nextBtn.classList.toggle('hidden', page===last);
  submitBtn.classList.toggle('hidden', page!==last);

  const filled = answers.filter(v=>v!==null).length;
  bar.style.width = Math.round((filled/QUESTIONS.length)*100)+'%';
}

prevBtn.onclick = ()=>{ if(page>0){page--;render();}};
nextBtn.onclick = ()=>{
  // 페이지 내 필수 응답 유도
  const start = page * PER_PAGE;
  const needed = QUESTIONS.slice(start, start + PER_PAGE).some((_,i)=>answers[start+i]==null);
  if (needed) { alert('이 페이지의 문항에 모두 답해주세요 🙂'); return; }
  page++; render();
};
document.getElementById('quizForm').onsubmit = (e)=>{
  e.preventDefault();
  if (answers.some(v=>v===null)) { alert('모든 문항에 답해주세요!'); return; }
  // compute axes 0..1
  const axes = {free:0, extra:0, lively:0, warm:0, dreamy:0};
  const counts = {free:0, extra:0, lively:0, warm:0, dreamy:0};
  QUESTIONS.forEach((q,i)=>{
    axes[q.axis] += answers[i];
    counts[q.axis]++;
  });
  Object.keys(axes).forEach(k=>{
    axes[k] = (axes[k]/(counts[k]*5)); // normalize 0..1
  });
  const payload = {axes, ts: Date.now(), seed: cryptoRandomSeed(), ver:1};
  localStorage.setItem('resultPayload', JSON.stringify(payload));
  location.href = 'result.html';
};

function cryptoRandomSeed(){
  const arr = new Uint32Array(4);
  crypto.getRandomValues(arr);
  return Array.from(arr).join('-');
}

render();
