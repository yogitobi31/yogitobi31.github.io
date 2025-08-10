// ===== 별바람 이름 테스트: 15문항 → 결과 페이지로 전달 =====

// 15문항(5축: free, extra, lively, warm, dreamy)
const QUESTIONS = [
  {axis:'free',   q:'나는 새로운 장소로 훌쩍 떠나는 상상을 자주 한다.'},
  {axis:'free',   q:'계획 없이 움직이는 편이다.'},
  {axis:'free',   q:'자유 시간이 많을수록 에너지가 차오른다.'},
  {axis:'extra',  q:'처음 본 사람과도 금방 이야기하는 편이다.'},
  {axis:'extra',  q:'여럿이 모인 자리에서 자연스럽게 리드한다.'},
  {axis:'extra',  q:'사람들과 함께 있을 때 더 즐겁다.'},
  {axis:'lively', q:'새로운 취미를 금방 시도해 본다.'},
  {axis:'lively', q:'기다리는 것보다 움직이는 걸 선호한다.'},
  {axis:'lively', q:'가만히 있으면 금방 심심해진다.'},
  {axis:'warm',   q:'주변 사람들의 마음을 자주 신경 쓴다.'},
  {axis:'warm',   q:'귀여운 것들을 보면 기분이 좋아진다.'},
  {axis:'warm',   q:'상냥하다는 말을 자주 듣는다.'},
  {axis:'dreamy', q:'창밖을 멍하니 보며 생각에 잠길 때가 많다.'},
  {axis:'dreamy', q:'감성적인 음악/영화를 좋아한다.'},
  {axis:'dreamy', q:'현실적 이득보다 분위기를 중시할 때가 있다.'}
];

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

    for (let k=1; k<=5; k++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option' + (answers[idx]===k ? ' selected' : '');
      btn.textContent = k===1 ? '전혀아님' : (k===5 ? '매우그렇다' : (''+k));
      btn.onclick = () => { answers[idx] = k; render(); };
      opts.appendChild(btn);
    }

    wrap.appendChild(opts);
    root.appendChild(wrap);
  });

  prevBtn.disabled = page===0;
  const last = Math.ceil(QUESTIONS.length/PER_PAGE) - 1;
  nextBtn.classList.toggle('hidden', page===last);
  submitBtn.classList.toggle('hidden', page!==last);

  const filled = answers.filter(v=>v!==null).length;
  bar.style.width = Math.round((filled/QUESTIONS.length)*100)+'%';
}

prevBtn.onclick = ()=>{ if (page>0){ page--; render(); } };
nextBtn.onclick = ()=>{
  const start = page * PER_PAGE;
  const anyMissing = QUESTIONS.slice(start, start + PER_PAGE)
    .some((_,i)=>answers[start+i]==null);
  if (anyMissing){ alert('이 페이지의 문항에 모두 답해주세요 🙂'); return; }
  page++; render();
};

document.getElementById('quizForm').onsubmit = (e)=>{
  e.preventDefault();
  if (answers.some(v=>v===null)){ alert('모든 문항에 답해주세요!'); return; }

  // 축별 점수(0~1 정규화)
  const axes = {free:0, extra:0, lively:0, warm:0, dreamy:0};
  const counts = {free:0, extra:0, lively:0, warm:0, dreamy:0};
  QUESTIONS.forEach((q,i)=>{
    axes[q.axis] += answers[i]; counts[q.axis]++;
  });
  Object.keys(axes).forEach(k=>{
    axes[k] = axes[k]/(counts[k]*5); // 0..1
  });

  const payload = {axes, ts: Date.now(), seed: cryptoSeed(), ver: 1};
  localStorage.setItem('resultPayload', JSON.stringify(payload));
  location.href = 'result.html';
};

function cryptoSeed(){
  if (window.crypto && crypto.getRandomValues){
    const arr = new Uint32Array(4);
    crypto.getRandomValues(arr);
    return Array.from(arr).join('-');
  }
  return String(Math.random()).slice(2);
}

render();
