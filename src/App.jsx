import { useState, useEffect, useCallback } from "react";

const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Josefin+Sans:wght@200;300;400;600&family=Great+Vibes&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fdf6ee; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.4); border-radius: 2px; }

    @keyframes floatUp {
      0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
      8%   { opacity: 1; }
      92%  { opacity: 0.7; }
      100% { transform: translateY(-110vh) rotate(540deg); opacity: 0; }
    }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(24px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes popIn {
      0%   { opacity: 0; transform: scale(0.85); }
      65%  { transform: scale(1.03); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes starTwinkle {
      0%, 100% { opacity: 0.25; transform: scale(1); }
      50%      { opacity: 1;    transform: scale(1.5); }
    }
    @keyframes breathe {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(1.06); }
    }
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes toastIn {
      from { transform: translateX(-50%) translateY(60px); opacity: 0; }
      to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
    }
    @keyframes shimmerBg {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .flip-container { perspective: 1200px; }
    .flip-inner {
      position: relative; width: 100%; height: 100%;
      transition: transform 0.7s cubic-bezier(.4,2,.55,1);
      transform-style: preserve-3d;
    }
    .flip-inner.flipped { transform: rotateY(180deg); }
    .flip-front, .flip-back {
      position: absolute; inset: 0;
      backface-visibility: hidden; -webkit-backface-visibility: hidden;
      border-radius: 20px; overflow: hidden;
    }
    .flip-back { transform: rotateY(180deg); }
    .tap { transition: transform 0.15s ease; cursor: pointer; }
    .tap:active { transform: scale(0.96); }
    input, textarea, button { font-family: inherit; }
    textarea { resize: none; }
  `}</style>
);

/* ── PALETTE ── */
const C = {
  cream:      "#fdf6ee",
  creamWarm:  "#faf0e4",
  creamDeep:  "#f5e8d4",
  magenta:    "#c0235e",
  magentaLight:"#e05585",
  hotPink:    "#e8306a",
  roseDust:   "#d4728a",
  gold:       "#c9a84c",
  goldLight:  "#e8c97a",
  goldPale:   "#f5e6c0",
  teal:       "#1a8a7a",
  tealLight:  "#2ab5a0",
  cobalt:     "#2855b8",
  cobaltLight:"#4a78e0",
  emerald:    "#1a7a4a",
  emeraldLight:"#2aaa6a",
  violet:     "#7a30b0",
  violetLight:"#a055d8",
  text:       "#2a1520",
  textMid:    "#6a3a50",
  textLight:  "#a07080",
  border:     "rgba(201,168,76,0.25)",
};

/* ── DATA ── */
const POWER_QUOTES = [
  { law:"Law 1", title:"Never Outshine the Master", body:"Always make those above you feel comfortably superior. In your desire to please and impress them, do not go too far in displaying your talents or you might accomplish the opposite — inspire fear and insecurity. Make your masters appear more brilliant than they are and you will attain the heights of power." },
  { law:"Law 3", title:"Conceal Your Intentions", body:"Keep people off-balance and in the dark by never revealing the purpose behind your actions. If they have no clue what you are up to, they cannot prepare a defense. Guide them far enough down the wrong path, envelope them in enough smoke, and by the time they realize your intentions, it will be too late." },
  { law:"Law 5", title:"So Much Depends on Reputation", body:"Reputation is the cornerstone of power. Through reputation alone you can intimidate and win; once it slips, however, you are vulnerable, and will be attacked on all sides. Make your reputation unassailable. Always be alert to potential attacks and thwart them before they happen. Learn to destroy your enemies by letting them destroy their own reputation." },
  { law:"Law 6", title:"Court Attention at All Costs", body:"Everything is judged by its appearance; what is unseen counts for nothing. Never let yourself get lost in the crowd, or buried in oblivion. Stand out. Be conspicuous, at all cost. Make yourself a magnet of attention by appearing larger, more colorful, more mysterious than the bland and timid masses." },
  { law:"Law 9", title:"Win Through Actions, Never Through Argument", body:"Any momentary triumph you think you have gained through argument is really a Pyrrhic victory: the resentment and ill will you stir up is stronger and lasts longer than any change of opinion. It is much more powerful to get others to agree with you through your actions, without saying a word. Demonstrate, do not explicate." },
  { law:"Law 16", title:"Use Absence to Increase Respect", body:"Too much circulation makes the price go down: the more you are seen and heard from, the more common you appear. If you are already established in a group, temporary withdrawal from it will make you more talked about, even more admired. You must learn when to leave. Create value through scarcity." },
  { law:"Law 25", title:"Re-Create Yourself", body:"Do not accept the roles that society foists on you. Re-create yourself by forging a new identity, one that commands attention and never bores the audience. Be the master of your own image rather than letting others define it for you. Incorporate dramatic devices into your public gestures and actions — a sense of the theater." },
  { law:"Law 28", title:"Enter Action with Boldness", body:"If you are unsure of a course of action, do not attempt it. Your doubts and hesitations will infect your execution. Timidity is dangerous: better to enter with boldness. Any mistakes you commit through audacity are easily corrected with more audacity. Everyone admires the bold; no one honors the timid." },
  { law:"Law 34", title:"Be Royal in Your Own Fashion", body:"Act like a king to be treated like one. The way you carry yourself will often determine how you are treated. In the long run, appearing vulgar or common will make people disrespect you. For a king respects himself and inspires the same sentiment in others. By acting regally and confident of your powers, you make yourself seem destined to wear a crown." },
  { law:"Law 47", title:"Do Not Go Past the Mark You Aimed For", body:"In the heat of victory, arrogance and overconfidence can push you past the goal you had aimed for, and by going too far, you make more enemies than you defeat. Do not allow success to go to your head. There is no substitute for strategy and careful planning. Set a goal, and when you reach it, stop." },
  { law:"Law 48", title:"Assume Formlessness", body:"By taking a shape, by having a visible plan, you open yourself to attack. Instead of taking a form for your enemy to grasp, keep yourself adaptable and on the move. Accept the fact that nothing is certain and no law is fixed. The best way to protect yourself is to be as fluid and formless as water; never bet on stability or lasting order." },
];

const MIRROR_PROMPTS = [
  "What is one thing your body did for you today that you haven't thanked it for?",
  "Name something you did this week that took courage — even if no one noticed.",
  "What would the most powerful version of you do differently tomorrow?",
  "If Michael Jackson approached his craft with this much intention — what does that look like for you today?",
  "What dream have you been shrinking to make others comfortable?",
  "What does your highest self want you to let go of?",
  "Where in your life are you playing small? What would boldness look like there?",
  "What are three words that describe the woman you are becoming?",
  "What would you do today if you knew you could not fail?",
  "What is your body asking for right now? Rest, movement, nourishment?",
  "Write one thing you love about yourself that has nothing to do with productivity.",
  "What would you tell a younger Anna about the road ahead?",
];

const GODDESS_TITLES = ["Goddess","Divine One","Queen","Sacred One","Her Majesty","Beloved"];
const MOODS = [
  { emoji:"🔥", label:"On Fire",   color: C.magenta },
  { emoji:"✨", label:"Glowing",   color: C.gold },
  { emoji:"🌸", label:"Soft Day",  color: C.roseDust },
  { emoji:"🌊", label:"Flowing",   color: C.teal },
  { emoji:"🌙", label:"Mystical",  color: C.violet },
  { emoji:"💎", label:"Abundant",  color: C.cobalt },
];
const DEFAULT_HABITS = ["🌊 Drink 8 glasses of water","🙏 Morning prayer & meditation","🚶‍♀️ Move your body","📖 Read for 20 minutes","✨ Skincare ritual"];
const WINDDOWN = ["📓 Journal","🙏 Evening prayer","🧴 Skincare","📵 Phone off","🕯️ Gratitude reflection"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

/* ── STORAGE ── */
const S = {
  set:(k,v)=>{ try{localStorage.setItem("annaL_"+k,typeof v==="string"?v:JSON.stringify(v));}catch{} },
  get:(k,fb="")=>{ try{const v=localStorage.getItem("annaL_"+k);return v!==null?v:fb;}catch{return fb;} },
  getJ:(k,fb)=>{ try{const v=localStorage.getItem("annaL_"+k);return v?JSON.parse(v):fb;}catch{return fb;} },
};

/* ── AI ── */
async function ai(prompt) {
  const r = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]}),
  });
  const d = await r.json();
  return d.content?.[0]?.text||"";
}

/* ── GLITTER ── */
function Glitter() {
  const colors=[C.magenta,C.gold,C.teal,C.cobalt,C.goldLight,C.hotPink,C.violet];
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:1}}>
      {Array.from({length:32},(_,i)=>{
        const size=Math.random()*5+2;
        const color=colors[Math.floor(Math.random()*colors.length)];
        return <div key={i} style={{
          position:"absolute",left:`${Math.random()*100}%`,bottom:"-8px",
          width:size,height:size,borderRadius:Math.random()>0.5?"50%":"2px",
          background:color,opacity:0,
          animation:`floatUp ${Math.random()*9+6}s ${Math.random()*10}s linear infinite`,
          boxShadow:`0 0 6px ${color}88`,
        }}/>;
      })}
    </div>
  );
}

/* ── SIDE STARS ── */
function SideStars() {
  const starColors=[C.magenta,C.gold,C.teal,C.cobalt,C.violet,C.hotPink];
  const stars=Array.from({length:20},(_,i)=>({
    top:`${4+i*4.8}%`,
    size:Math.random()*12+7,
    delay:Math.random()*5,
    dur:Math.random()*3+2,
    side:i%2===0?"left":"right",
    offset:Math.random()*10+2,
    color:starColors[i%starColors.length],
  }));
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:1,overflow:"hidden"}}>
      {stars.map((s,i)=>(
        <div key={i} style={{
          position:"absolute",top:s.top,[s.side]:`${s.offset}px`,
          fontSize:s.size,color:s.color,
          animation:`starTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
          textShadow:`0 0 10px ${s.color}`,
        }}>✦</div>
      ))}
    </div>
  );
}

/* ── TOAST ── */
function Toast({msg}) {
  if(!msg) return null;
  return <div style={{
    position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",
    background:`linear-gradient(135deg,${C.magenta},${C.gold})`,
    color:"white",padding:"11px 24px",borderRadius:24,
    fontSize:12,letterSpacing:2,textTransform:"uppercase",
    zIndex:500,fontFamily:"'Josefin Sans',sans-serif",fontWeight:400,
    whiteSpace:"nowrap",boxShadow:`0 6px 24px rgba(192,35,94,0.3)`,
    animation:"toastIn 0.4s ease",
  }}>{msg}</div>;
}

/* ── CARD ── */
function Card({children,style={},delay=0,gradient=null}) {
  return <div style={{
    background: gradient||"rgba(255,253,249,0.92)",
    backdropFilter:"blur(16px)",
    border:`1.5px solid ${C.border}`,
    borderRadius:22,padding:"22px 20px",
    boxShadow:"0 4px 32px rgba(192,35,94,0.07), 0 1px 0 rgba(255,255,255,0.9) inset",
    animation:`cardIn 0.6s ${delay}s ease both`,
    ...style,
  }}>{children}</div>;
}

/* ── SECTION LABEL ── */
function Label({emoji,text,color=C.gold}) {
  return <div style={{
    display:"flex",alignItems:"center",gap:8,
    fontFamily:"'Josefin Sans',sans-serif",fontSize:10,
    letterSpacing:3,textTransform:"uppercase",
    color,marginBottom:14,fontWeight:400,
  }}>
    {emoji} {text}
    <div style={{flex:1,height:"1.5px",background:`linear-gradient(to right,${color}55,transparent)`}}/>
  </div>;
}

/* ── MODAL ── */
function Modal({open,onClose,children}) {
  if(!open) return null;
  return <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{
    position:"fixed",inset:0,background:"rgba(42,21,32,0.6)",backdropFilter:"blur(8px)",
    zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center",
  }}>
    <div style={{
      background:C.cream,border:`1.5px solid ${C.border}`,
      borderRadius:"26px 26px 0 0",padding:"28px 22px 48px",
      width:"100%",maxWidth:480,animation:"slideUp 0.35s cubic-bezier(.2,.8,.4,1)",
      maxHeight:"88vh",overflowY:"auto",
    }}>{children}</div>
  </div>;
}
function MTitle({children}) {
  return <div style={{fontFamily:"'Great Vibes',cursive",fontSize:36,color:C.magenta,textAlign:"center",marginBottom:20}}>{children}</div>;
}
function MInput({placeholder,value,onChange,type="text",multiline=false,rows=3}) {
  const base={width:"100%",background:C.creamWarm,border:`1.5px solid ${C.border}`,borderRadius:14,
    padding:"12px 16px",fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",
    color:C.text,outline:"none",marginBottom:12,display:"block"};
  return multiline
    ? <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows} style={base}/>
    : <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={base}/>;
}
function MBtns({onCancel,onSave,label="Save ✦"}) {
  return <div style={{display:"flex",gap:10,marginTop:8}}>
    <button onClick={onCancel} style={{flex:1,background:"none",border:`1.5px solid ${C.border}`,borderRadius:22,padding:"12px 0",fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:2,textTransform:"uppercase",color:C.textMid,cursor:"pointer"}}>Cancel</button>
    <button onClick={onSave} style={{flex:2,background:`linear-gradient(135deg,${C.magenta},${C.gold})`,border:"none",borderRadius:22,padding:"12px 0",fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"white",cursor:"pointer",boxShadow:`0 4px 16px rgba(192,35,94,0.3)`}}>{label}</button>
  </div>;
}
function Loading({text=""}) {
  return <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",color:C.textLight,fontSize:16,textAlign:"center",padding:"12px 0"}}>{text||"Conjuring"}...</div>;
}

/* ════ MAIN ════ */
export default function BecomingAnna() {
  const today    = new Date().toDateString();
  const todayDow = new Date().getDay();
  const dayIdx   = new Date().getDate() % POWER_QUOTES.length;
  const mirrorIdx= new Date().getDate() % MIRROR_PROMPTS.length;

  const [toast,       setToast]       = useState("");
  const [greeting,    setGreeting]    = useState("");
  const [dateStr,     setDateStr]     = useState("");
  const [titleIdx,    setTitleIdx]    = useState(0);
  const [biblePopup,  setBiblePopup]  = useState(false);
  const [bibleVerse,  setBibleVerse]  = useState(null);
  const [horoscope,   setHoroscope]   = useState(null);
  const [affAI,       setAffAI]       = useState(null);
  const [loadB,       setLoadB]       = useState(false);
  const [loadH,       setLoadH]       = useState(false);
  const [loadA,       setLoadA]       = useState(false);
  const [mood,        setMood]        = useState(S.getJ("mood",null));
  const [intention,   setIntention]   = useState(S.get("intention",""));
  const [myAff,       setMyAff]       = useState(S.get("myAff",""));
  const [gratitude,   setGratitude]   = useState(S.getJ("gratitude",["","",""]));
  const [habits,      setHabits]      = useState(S.getJ("habits",DEFAULT_HABITS));
  const [hDone,       setHDone]       = useState(S.getJ("hDone_"+today,[]));
  const [wDone,       setWDone]       = useState(S.getJ("wDone_"+today,[]));
  const [goals,       setGoals]       = useState(S.getJ("goals",[]));
  const [weekData,    setWeekData]    = useState(S.getJ("weekData",{}));
  const [mSaved,      setMSaved]      = useState(parseInt(S.get("mSaved","0"))||0);
  const [mGoal,       setMGoal]       = useState(parseInt(S.get("mGoal","0"))||0);
  const [expenses,    setExpenses]    = useState(S.getJ("expenses",[]));
  const [period,      setPeriod]      = useState(S.get("period",""));
  const [letter,      setLetter]      = useState(S.get("letter",""));
  const [mirrorAns,   setMirrorAns]   = useState(S.get("mirror_"+today,""));
  const [qFlip,       setQFlip]       = useState(false);
  const [hFlip,       setHFlip]       = useState(false);

  /* modals */
  const [goalModal,   setGoalModal]   = useState(false);
  const [goalName,    setGoalName]    = useState("");
  const [goalDays,    setGoalDays]    = useState("");
  const [habitModal,  setHabitModal]  = useState(false);
  const [editHIdx,    setEditHIdx]    = useState(null);
  const [habitInput,  setHabitInput]  = useState("");
  const [dayModal,    setDayModal]    = useState(false);
  const [editDayKey,  setEditDayKey]  = useState("");
  const [editDayName, setEditDayName] = useState("");
  const [dayIntent,   setDayIntent]   = useState("");
  const [intentModal, setIntentModal] = useState(false);
  const [intentInput, setIntentInput] = useState("");
  const [expDesc,     setExpDesc]     = useState("");
  const [expAmt,      setExpAmt]      = useState("");
  const [mGoalInp,    setMGoalInp]    = useState("");
  const [mAddInp,     setMAddInp]     = useState("");

  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),2600);};

  useEffect(()=>S.set("mood",mood),[mood]);
  useEffect(()=>S.set("intention",intention),[intention]);
  useEffect(()=>S.set("myAff",myAff),[myAff]);
  useEffect(()=>S.set("gratitude",gratitude),[gratitude]);
  useEffect(()=>S.set("habits",habits),[habits]);
  useEffect(()=>S.set("hDone_"+today,hDone),[hDone,today]);
  useEffect(()=>S.set("wDone_"+today,wDone),[wDone,today]);
  useEffect(()=>S.set("goals",goals),[goals]);
  useEffect(()=>S.set("weekData",weekData),[weekData]);
  useEffect(()=>S.set("mSaved",mSaved),[mSaved]);
  useEffect(()=>S.set("mGoal",mGoal),[mGoal]);
  useEffect(()=>S.set("expenses",expenses),[expenses]);
  useEffect(()=>S.set("period",period),[period]);
  useEffect(()=>S.set("letter",letter),[letter]);
  useEffect(()=>S.set("mirror_"+today,mirrorAns),[mirrorAns,today]);

  useEffect(()=>{
    const update=()=>{
      const h=new Date().getHours();
      setGreeting(h<12?"Good morning":h<17?"Good afternoon":"Good evening");
      setDateStr(new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).toUpperCase());
    };
    update(); const iv=setInterval(update,60000); return()=>clearInterval(iv);
  },[]);

  useEffect(()=>{
    const iv=setInterval(()=>setTitleIdx(p=>(p+1)%GODDESS_TITLES.length),4000);
    return()=>clearInterval(iv);
  },[]);

  const loadBible=useCallback(async(force=false)=>{
    const c=S.get("bDate",""),t=S.get("bText","");
    if(!force&&c===today&&t){setBibleVerse(t);return;}
    setLoadB(true);
    try{
      const text=await ai("Give me one deeply hopeful, intimate Bible verse about God's presence, miracles, or divine love. Make it feel personal and warm. Format: first line is the verse text only, second line is the reference (e.g. Isaiah 41:10). Nothing else.");
      setBibleVerse(text);S.set("bDate",today);S.set("bText",text);
    }catch{setBibleVerse("For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.\nJeremiah 29:11");}
    setLoadB(false);
  },[today]);

  const loadHoroscope=useCallback(async(force=false)=>{
    const c=S.get("hDate",""),t=S.get("hText","");
    if(!force&&c===today&&t){setHoroscope(t);return;}
    setLoadH(true);
    try{
      const text=await ai(`Write a rich daily horoscope for an Aries woman born March 25 1992. She is 34, fiercely ambitious, deeply spiritual, creatively gifted, channeling the energy of Michael Jackson — relentless pursuit of excellence, craft, and intention. Make it mystical, personal, empowering. 4-5 full sentences. Include a power theme for the day. Today: ${new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}.`);
      setHoroscope(text);S.set("hDate",today);S.set("hText",text);
    }catch{setHoroscope("The stars align in your favour today, Aries. Your fire is your greatest gift — let it illuminate rather than consume. Trust the process of becoming; greatness is built in the quiet moments of intention. Today, channel your inner architect. Power theme: EXCELLENCE.");}
    setLoadH(false);
  },[today]);

  const loadAff=useCallback(async(force=false)=>{
    const c=S.get("aDate",""),t=S.get("aText","");
    if(!force&&c===today&&t){setAffAI(t);return;}
    setLoadA(true);
    try{
      const text=await ai("Write one powerful divine feminine affirmation for an Aries woman channeling the energy of Michael Jackson — creative excellence, relentless intention, magical artistry. Celestial, bold, deeply personal. Start with 'I am' or 'I'. One sentence only, no quotes.");
      setAffAI(text);S.set("aDate",today);S.set("aText",text);
    }catch{setAffAI("I am an instrument of divine excellence, crafted to create magic that moves the world.");}
    setLoadA(false);
  },[today]);

  useEffect(()=>{
    loadBible();loadHoroscope();loadAff();
    const last=S.get("lastOpen","");
    if(last!==today){setBiblePopup(true);S.set("lastOpen",today);}
  },[loadBible,loadHoroscope,loadAff,today]);

  const toggleH=(i)=>{setHDone(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);if(!hDone.includes(i))showToast("✨ Ritual complete!");};
  const toggleW=(i)=>setWDone(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);
  const addGoal=()=>{
    if(!goalName||!goalDays)return;
    setGoals(p=>[...p,{name:goalName,totalDays:parseInt(goalDays),daysDone:0}]);
    setGoalName("");setGoalDays("");setGoalModal(false);showToast("🌕 New moon goal set ✦");
  };
  const tickGoal=(i)=>setGoals(p=>{
    const g=[...p];
    if(g[i].daysDone<g[i].totalDays){
      g[i]={...g[i],daysDone:g[i].daysDone+1};
      if(g[i].daysDone===g[i].totalDays)showToast("🌕 Goal complete! You are radiant!");
      else showToast("🌒 Day marked ✦");
    }
    return g;
  });
  const getMoons=(total,done)=>Array.from({length:Math.min(total,28)},(_,i)=>i<done?"🌕":i===done?"🌗":"🌑");
  const weekDays=Array.from({length:7},(_,d)=>{
    const day=new Date();day.setDate(new Date().getDate()-todayDow+d);
    return{key:day.toDateString(),num:day.getDate(),name:DAYS[d],isToday:d===todayDow};
  });
  const getPeriod=()=>{
    if(!period)return null;
    const start=new Date(period),cycleLen=28,periodLen=5;
    const raw=Math.floor((new Date()-start)/86400000)%cycleLen;
    const day=((raw%cycleLen)+cycleLen)%cycleLen;
    let phase,icon;
    if(day<periodLen){phase="Menstrual Phase";icon="🌹";}
    else if(day<13){phase="Follicular Phase";icon="🌱";}
    else if(day<16){phase="Ovulation ✨";icon="🌟";}
    else{phase="Luteal Phase";icon="🌙";}
    return{phase,icon,day,next:cycleLen-day,cycleLen,periodLen};
  };
  const pi=getPeriod();
  const quote=POWER_QUOTES[dayIdx];

  const inp={
    background:C.creamWarm,border:`1.5px solid ${C.border}`,
    borderRadius:12,padding:"10px 14px",
    fontFamily:"'Josefin Sans',sans-serif",fontSize:13,
    color:C.text,outline:"none",boxSizing:"border-box",
  };
  const rBtn=(fn,color=C.gold)=>(
    <button onClick={fn} style={{display:"block",margin:"12px auto 0",background:"none",border:`1.5px solid ${color}88`,borderRadius:20,padding:"6px 20px",fontFamily:"'Josefin Sans',sans-serif",fontSize:10,letterSpacing:2,color,cursor:"pointer",textTransform:"uppercase"}}>✦ Refresh</button>
  );

  return (
    <div style={{background:`linear-gradient(145deg,${C.cream} 0%,${C.creamWarm} 50%,#fae8dc 100%)`,minHeight:"100vh",position:"relative",fontFamily:"'Josefin Sans',sans-serif",color:C.text,overflowX:"hidden"}}>
      <FontStyle/>
      <Glitter/>
      <SideStars/>

      {/* ── BIBLE POPUP ── */}
      {biblePopup&&(
        <div onClick={()=>setBiblePopup(false)} style={{position:"fixed",inset:0,background:"rgba(42,21,32,0.55)",backdropFilter:"blur(10px)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:`linear-gradient(160deg,${C.cream},${C.creamWarm})`,
            border:`2px solid ${C.magenta}44`,borderRadius:28,padding:"40px 28px",
            maxWidth:380,width:"100%",
            boxShadow:`0 0 60px rgba(192,35,94,0.2),0 20px 60px rgba(0,0,0,0.15)`,
            animation:"popIn 0.6s cubic-bezier(.2,.8,.4,1)",textAlign:"center",
          }}>
            <div style={{fontSize:40,marginBottom:14,animation:"breathe 3s ease-in-out infinite"}}>🕊️</div>
            <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:10,letterSpacing:4,color:C.magenta,textTransform:"uppercase",marginBottom:20,fontWeight:400}}>Word of God · Today</div>
            {loadB?<Loading text="Receiving the word"/>:bibleVerse&&(()=>{
              const lines=bibleVerse.split("\n").filter(l=>l.trim());
              return <>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontStyle:"italic",lineHeight:1.8,color:C.text,marginBottom:16}}>{lines[0]}</div>
                {lines[1]&&<div style={{fontSize:11,letterSpacing:3,color:C.magenta,textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>{lines[1]}</div>}
              </>;
            })()}
            <button onClick={()=>setBiblePopup(false)} style={{marginTop:28,background:`linear-gradient(135deg,${C.magenta},${C.gold})`,border:"none",borderRadius:24,padding:"13px 36px",fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:3,color:"white",cursor:"pointer",textTransform:"uppercase",boxShadow:`0 6px 24px rgba(192,35,94,0.3)`}}>Receive & Enter ✦</button>
          </div>
        </div>
      )}

      <div style={{position:"relative",zIndex:2,maxWidth:480,margin:"0 auto",padding:"22px 20px 60px"}}>

        {/* ── HEADER ── */}
        <Card delay={0.05} gradient={`linear-gradient(145deg,#fff0f5,${C.goldPale},#f0f5ff)`} style={{
          textAlign:"center",padding:"34px 22px",marginBottom:14,
          border:`1.5px solid ${C.magenta}33`,
          boxShadow:`0 8px 40px rgba(192,35,94,0.1),0 2px 0 white inset`,
        }}>
          <div style={{fontSize:11,letterSpacing:5,color:C.magenta,textTransform:"uppercase",marginBottom:8,fontWeight:400}}>
            {greeting}, {GODDESS_TITLES[titleIdx]} ✦
          </div>
          <div style={{fontFamily:"'Great Vibes',cursive",fontSize:54,color:C.magenta,textShadow:`0 2px 20px rgba(192,35,94,0.25)`,lineHeight:1,marginBottom:10}}>
            Becoming Anna
          </div>
          <div style={{fontSize:10,letterSpacing:2.5,color:C.textLight,textTransform:"uppercase"}}>{dateStr}</div>

          {/* Mood */}
          <div style={{marginTop:18,display:"flex",justifyContent:"center",gap:7,flexWrap:"wrap"}}>
            {MOODS.map(m=>(
              <button key={m.label} onClick={()=>{setMood(m);showToast(`${m.emoji} ${m.label} energy set`);}} className="tap"
                style={{
                  background:mood?.label===m.label?`${m.color}22`:"rgba(255,255,255,0.6)",
                  border:`1.5px solid ${mood?.label===m.label?m.color:C.border}`,
                  borderRadius:20,padding:"6px 12px",fontSize:12,cursor:"pointer",color:mood?.label===m.label?m.color:C.textMid,
                  transition:"all 0.3s",fontFamily:"'Josefin Sans',sans-serif",
                }}>{m.emoji} {m.label}</button>
            ))}
          </div>

          {/* Intention */}
          <div onClick={()=>{setIntentInput(intention);setIntentModal(true);}} className="tap"
            style={{marginTop:16,background:"rgba(255,255,255,0.7)",border:`1.5px dashed ${C.magenta}55`,borderRadius:16,padding:"12px 18px",cursor:"pointer"}}>
            {intention
              ? <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,letterSpacing:5,color:C.magenta,textTransform:"uppercase"}}>{intention}</div>
              : <div style={{fontSize:11,letterSpacing:3,color:C.textLight,textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>✦ Tap to set today's intention</div>}
          </div>
        </Card>

        {/* ── FLIP CARDS ROW: 48 Laws + Horoscope ── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>

          {/* 48 Laws flip */}
          <div className="flip-container" style={{height:230}} onClick={()=>setQFlip(p=>!p)}>
            <div className={`flip-inner${qFlip?" flipped":""}`} style={{height:"100%"}}>
              <div className="flip-front" style={{
                background:`linear-gradient(145deg,#fff0f5,#ffe0ec)`,
                border:`1.5px solid ${C.magenta}44`,
                display:"flex",flexDirection:"column",justifyContent:"center",padding:18,
              }}>
                <div style={{fontSize:10,letterSpacing:2.5,color:C.magenta,textTransform:"uppercase",marginBottom:10,fontFamily:"'Josefin Sans',sans-serif"}}>⚔️ Law of the Day</div>
                <div style={{fontFamily:"'Great Vibes',cursive",fontSize:22,color:C.gold,marginBottom:8}}>{quote.law}</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:600,color:C.text,lineHeight:1.45,marginBottom:12}}>{quote.title}</div>
                <div style={{fontSize:9,letterSpacing:2,color:C.textLight,textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>Tap to read ✦</div>
              </div>
              <div className="flip-back" style={{
                background:`linear-gradient(145deg,#ffe8f0,#fff0e8)`,
                border:`1.5px solid ${C.magenta}44`,
                padding:16,display:"flex",flexDirection:"column",justifyContent:"center",
              }}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:"italic",lineHeight:1.7,color:C.text,marginBottom:10}}>{quote.body}</div>
                <div style={{fontSize:9,letterSpacing:2,color:C.gold,textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>— 48 Laws of Power</div>
              </div>
            </div>
          </div>

          {/* Horoscope flip */}
          <div className="flip-container" style={{height:230}} onClick={()=>setHFlip(p=>!p)}>
            <div className={`flip-inner${hFlip?" flipped":""}`} style={{height:"100%"}}>
              <div className="flip-front" style={{
                background:`linear-gradient(145deg,#f0eaff,#e8f0ff)`,
                border:`1.5px solid ${C.violet}44`,
                display:"flex",flexDirection:"column",justifyContent:"center",padding:18,
              }}>
                <div style={{fontSize:32,textAlign:"center",marginBottom:8}}>♈</div>
                <div style={{fontSize:10,letterSpacing:2,color:C.violet,textTransform:"uppercase",textAlign:"center",marginBottom:8,fontFamily:"'Josefin Sans',sans-serif"}}>Aries Reading</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:"italic",color:C.textMid,textAlign:"center",lineHeight:1.5}}>
                  {loadH?"Reading the stars...":(horoscope?.split(".")[0]||"")+"." }
                </div>
                <div style={{fontSize:9,letterSpacing:2,color:C.textLight,textTransform:"uppercase",textAlign:"center",marginTop:10,fontFamily:"'Josefin Sans',sans-serif"}}>Tap to read ✦</div>
              </div>
              <div className="flip-back" style={{
                background:`linear-gradient(145deg,#ede8ff,#e8eeff)`,
                border:`1.5px solid ${C.violet}44`,
                padding:16,overflowY:"auto",
              }}>
                <div style={{fontSize:10,letterSpacing:2,color:C.violet,textTransform:"uppercase",marginBottom:10,fontFamily:"'Josefin Sans',sans-serif"}}>♈ Full Reading</div>
                {loadH?<Loading text="Reading the stars"/>
                  :<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:"italic",lineHeight:1.7,color:C.text}}>{horoscope}</div>}
                <button onClick={e=>{e.stopPropagation();S.set("hDate","");loadHoroscope(true);}}
                  style={{marginTop:10,background:"none",border:`1px solid ${C.violet}55`,borderRadius:20,padding:"4px 12px",fontSize:9,letterSpacing:2,color:C.violet,cursor:"pointer",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>✦ Refresh</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── AFFIRMATION ── */}
        <Card delay={0.2} gradient={`linear-gradient(145deg,#fff8f0,${C.goldPale}88,#fff0f8)`} style={{marginBottom:14,border:`1.5px solid ${C.gold}44`}}>
          <Label emoji="✨" text="Divine Affirmation" color={C.gold}/>
          <div style={{background:`linear-gradient(135deg,${C.magenta}12,${C.gold}10)`,borderRadius:16,padding:"18px",marginBottom:16,border:`1px solid ${C.magenta}20`}}>
            {loadA?<Loading text="Channeling your power"/>:
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",lineHeight:1.7,color:C.text,textAlign:"center"}}>{affAI}</div>}
            {rBtn(()=>{S.set("aDate","");loadAff(true);},C.magenta)}
          </div>
          <div style={{fontSize:10,letterSpacing:2,color:C.textLight,textTransform:"uppercase",marginBottom:10,fontFamily:"'Josefin Sans',sans-serif"}}>My Manifestations</div>
          <textarea value={myAff} onChange={e=>setMyAff(e.target.value)}
            placeholder="I am becoming the woman I was always meant to be..."
            rows={4}
            style={{...inp,width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontStyle:"italic",lineHeight:1.65,background:C.creamWarm}}/>
        </Card>

        {/* ── GRATITUDE + MIRROR ── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <Card gradient={`linear-gradient(145deg,#f5fff5,#e8f8e8)`} style={{border:`1.5px solid ${C.emerald}44`,padding:"18px 16px"}}>
            <Label emoji="🌸" text="Grateful" color={C.emerald}/>
            {["Today...","A person...","About me..."].map((ph,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontFamily:"'Great Vibes',cursive",fontSize:20,color:C.gold,minWidth:16}}>{i+1}</span>
                <input type="text" placeholder={ph} value={gratitude[i]}
                  onChange={e=>setGratitude(p=>{const g=[...p];g[i]=e.target.value;return g;})}
                  style={{flex:1,background:"none",border:"none",borderBottom:`1.5px solid ${C.emerald}44`,padding:"5px 2px",fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontStyle:"italic",color:C.text,outline:"none"}}/>
              </div>
            ))}
          </Card>

          <Card gradient={`linear-gradient(145deg,#fffbf0,#fff5e0)`} style={{border:`1.5px solid ${C.gold}44`,padding:"18px 16px"}}>
            <Label emoji="🪞" text="Mirror" color={C.gold}/>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:"italic",lineHeight:1.65,color:C.textMid,marginBottom:10}}>{MIRROR_PROMPTS[mirrorIdx]}</div>
            <textarea placeholder="Your answer..." value={mirrorAns} onChange={e=>setMirrorAns(e.target.value)}
              rows={3}
              style={{...inp,width:"100%",fontSize:14,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}/>
          </Card>
        </div>

        {/* ── HABITS ── */}
        <Card delay={0.3} gradient={`linear-gradient(145deg,#f0f8ff,#e8f2ff)`} style={{marginBottom:14,border:`1.5px solid ${C.cobalt}33`}}>
          <Label emoji="🌙" text="Morning Rituals" color={C.cobalt}/>
          {habits.map((h,i)=>{
            const done=hDone.includes(i);
            return <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:`1px solid ${C.cobalt}15`}}>
              <div onClick={()=>toggleH(i)} className="tap" style={{
                width:26,height:26,borderRadius:"50%",flexShrink:0,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",
                border:`2px solid ${done?C.cobalt:`${C.cobalt}44`}`,
                background:done?`linear-gradient(135deg,${C.cobalt},${C.cobaltLight})`:"transparent",
                transition:"all 0.3s",boxShadow:done?`0 0 12px ${C.cobalt}55`:"none",
              }}>
                {done&&<span style={{color:"white",fontSize:14,fontWeight:"bold"}}>✓</span>}
              </div>
              <div style={{flex:1,fontSize:15,color:done?C.textLight:C.text,textDecoration:done?"line-through":"none",transition:"all 0.3s"}}>{h}</div>
              <button onClick={()=>{setEditHIdx(i);setHabitInput(h);setHabitModal(true);}}
                style={{background:"none",border:"none",fontSize:13,cursor:"pointer",opacity:0.4,color:C.text}}>✏️</button>
            </div>;
          })}
        </Card>

        {/* ── GOALS ── */}
        <Card delay={0.35} gradient={`linear-gradient(145deg,#fff8f0,#fff0e8)`} style={{marginBottom:14,border:`1.5px solid ${C.gold}44`}}>
          <Label emoji="🌕" text="Moon Goals" color={C.gold}/>
          {goals.length===0&&<div style={{textAlign:"center",color:C.textLight,fontStyle:"italic",fontSize:16,padding:"10px 0",fontFamily:"'Cormorant Garamond',serif"}}>Your moon goals await ✦</div>}
          {goals.map((g,i)=>{
            const pct=Math.min((g.daysDone/g.totalDays)*100,100).toFixed(0);
            return <div key={i} style={{background:`${C.goldPale}88`,border:`1px solid ${C.gold}33`,borderRadius:18,padding:16,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:C.text}}>{g.name}</div>
                <div style={{fontSize:10,letterSpacing:1.5,color:C.textLight,textTransform:"uppercase",textAlign:"right",fontFamily:"'Josefin Sans',sans-serif"}}>Day {g.daysDone}/{g.totalDays}<br/>{pct}%</div>
              </div>
              <div style={{display:"flex",gap:2,flexWrap:"wrap",marginBottom:8}}>
                {getMoons(g.totalDays,g.daysDone).map((m,mi)=><span key={mi} style={{fontSize:16}}>{m}</span>)}
              </div>
              <div style={{height:5,background:`${C.gold}22`,borderRadius:3,overflow:"hidden",marginBottom:12}}>
                <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(to right,${C.magenta},${C.gold})`,borderRadius:3,transition:"width 0.8s ease"}}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setGoals(p=>p.filter((_,j)=>j!==i))}
                  style={{flex:1,background:"none",border:`1.5px solid ${C.border}`,borderRadius:22,padding:"7px 0",fontFamily:"'Josefin Sans',sans-serif",fontSize:10,letterSpacing:1.5,color:C.textLight,cursor:"pointer",textTransform:"uppercase"}}>Remove</button>
                <button onClick={()=>tickGoal(i)} className="tap"
                  style={{flex:2,background:`linear-gradient(135deg,${C.magenta},${C.gold})`,border:"none",borderRadius:22,padding:"7px 0",fontFamily:"'Josefin Sans',sans-serif",fontSize:10,letterSpacing:1.5,color:"white",cursor:"pointer",textTransform:"uppercase",boxShadow:`0 4px 14px rgba(192,35,94,0.3)`}}>+ Mark Day ✦</button>
              </div>
            </div>;
          })}
          <button onClick={()=>setGoalModal(true)} style={{width:"100%",background:"none",border:`1.5px dashed ${C.gold}66`,borderRadius:18,padding:13,fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:2,color:C.gold,cursor:"pointer",textTransform:"uppercase"}}>✦ Add New Goal</button>
        </Card>

        {/* ── WEEKLY PLANNER ── */}
        <Card delay={0.4} gradient={`linear-gradient(145deg,#f5f0ff,#ede8ff)`} style={{marginBottom:14,border:`1.5px solid ${C.violet}33`}}>
          <Label emoji="📅" text="This Week's Intentions" color={C.violet}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>
            {weekDays.map(d=>(
              <div key={d.key} style={{textAlign:"center"}}>
                <div style={{fontSize:9,letterSpacing:1,textTransform:"uppercase",color:C.textLight,marginBottom:4,fontFamily:"'Josefin Sans',sans-serif"}}>{d.name}</div>
                <div onClick={()=>{setEditDayKey(d.key);setEditDayName(d.name);setDayIntent(weekData[d.key]||"");setDayModal(true);}} className="tap"
                  style={{
                    background:d.isToday?`linear-gradient(135deg,${C.violet}22,${C.magenta}15)`:"rgba(255,255,255,0.7)",
                    border:`1.5px solid ${d.isToday?C.violet:C.border}`,
                    borderRadius:12,padding:"7px 2px",minHeight:72,
                    fontSize:9,color:C.textMid,cursor:"pointer",
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",lineHeight:1.3,fontFamily:"'Josefin Sans',sans-serif",
                  }}>
                  <span style={{fontSize:13,color:d.isToday?C.violet:C.text,fontWeight:d.isToday?600:400,marginBottom:3}}>{d.num}</span>
                  {weekData[d.key]||"···"}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── SAVINGS + CYCLE ── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <Card gradient={`linear-gradient(145deg,#f0fff8,#e0f8ee)`} style={{border:`1.5px solid ${C.teal}44`,padding:"18px 16px"}}>
            <Label emoji="💛" text="Savings" color={C.teal}/>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:C.teal,marginBottom:2}}>₹{mSaved.toLocaleString("en-IN")}</div>
            <div style={{fontSize:10,color:C.textLight,marginBottom:10,fontFamily:"'Josefin Sans',sans-serif"}}>of ₹{mGoal.toLocaleString("en-IN")}</div>
            <div style={{height:6,background:`${C.teal}18`,borderRadius:3,overflow:"hidden",marginBottom:12}}>
              <div style={{height:"100%",width:`${mGoal>0?Math.min((mSaved/mGoal)*100,100):0}%`,background:`linear-gradient(to right,${C.teal},${C.gold})`,transition:"width 0.8s"}}/>
            </div>
            <input type="number" placeholder="Set goal ₹" value={mGoalInp} onChange={e=>setMGoalInp(e.target.value)}
              onBlur={()=>{if(mGoalInp){setMGoal(parseInt(mGoalInp)||0);setMGoalInp("");showToast("Goal set ✦");}}}
              style={{...inp,width:"100%",marginBottom:8,fontSize:12}}/>
            <input type="number" placeholder="Add savings ₹" value={mAddInp} onChange={e=>setMAddInp(e.target.value)}
              onBlur={()=>{if(mAddInp){const v=parseInt(mAddInp)||0;setMSaved(p=>p+v);showToast(`₹${v.toLocaleString("en-IN")} saved 💛`);setMAddInp("");}}}
              style={{...inp,width:"100%",fontSize:12}}/>
          </Card>

          <Card gradient={`linear-gradient(145deg,#fff0f8,#ffe8f4)`} style={{border:`1.5px solid ${C.magenta}33`,padding:"18px 16px"}}>
            <Label emoji="🌸" text="Cycle" color={C.magenta}/>
            {pi?<>
              <div style={{fontSize:30,textAlign:"center",marginBottom:6}}>{pi.icon}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontWeight:600,color:C.text,textAlign:"center",marginBottom:4}}>{pi.phase}</div>
              <div style={{fontSize:10,color:C.textLight,textAlign:"center",marginBottom:10,fontFamily:"'Josefin Sans',sans-serif"}}>Day {pi.day+1} · Next ~{pi.next}d</div>
              <div style={{display:"flex",gap:2,flexWrap:"wrap",justifyContent:"center"}}>
                {Array.from({length:pi.cycleLen},(_,i)=>(
                  <div key={i} style={{width:8,height:8,borderRadius:"50%",
                    background:i===pi.day?C.gold:i<pi.periodLen?C.magenta:(i>=12&&i<=15)?C.goldLight:`${C.magenta}18`,
                    boxShadow:i===pi.day?`0 0 6px ${C.gold}`:"none"}}/>
                ))}
              </div>
            </>:<div style={{color:C.textLight,fontStyle:"italic",fontSize:13,textAlign:"center",padding:"10px 0",fontFamily:"'Cormorant Garamond',serif"}}>Enter your last period date below</div>}
            <input type="date" value={period} onChange={e=>{setPeriod(e.target.value);showToast("Cycle updated ✦");}}
              style={{...inp,width:"100%",marginTop:10,fontSize:11}}/>
          </Card>
        </div>

        {/* ── EXPENSES ── */}
        <Card delay={0.5} gradient={`linear-gradient(145deg,#f8f0ff,#f0e8ff)`} style={{marginBottom:14,border:`1.5px solid ${C.violet}33`}}>
          <Label emoji="📊" text="Monthly Expenses" color={C.violet}/>
          {expenses.length===0
            ?<div style={{color:C.textLight,fontStyle:"italic",fontSize:15,textAlign:"center",padding:8,fontFamily:"'Cormorant Garamond',serif"}}>No expenses logged yet</div>
            :<>
              {expenses.slice(0,6).map((e,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.violet}15`,fontSize:14,color:C.textMid}}>
                  <span>{e.desc} <span style={{color:C.textLight,fontSize:11}}>{e.date}</span></span>
                  <span style={{color:C.magenta,fontWeight:600}}>₹{e.amt.toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",fontSize:13}}>
                <span style={{fontSize:10,textTransform:"uppercase",letterSpacing:1,color:C.textLight,fontFamily:"'Josefin Sans',sans-serif"}}>Total this month</span>
                <span style={{color:C.magenta,fontWeight:600}}>₹{expenses.reduce((s,e)=>s+e.amt,0).toLocaleString("en-IN")}</span>
              </div>
            </>}
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <input type="text" placeholder="What for?" value={expDesc} onChange={e=>setExpDesc(e.target.value)} style={{...inp,flex:1}}/>
            <input type="number" placeholder="₹" value={expAmt} onChange={e=>setExpAmt(e.target.value)} style={{...inp,width:72}}/>
            <button onClick={()=>{if(!expDesc||!expAmt)return;setExpenses(p=>[{desc:expDesc,amt:parseInt(expAmt)||0,date:new Date().toLocaleDateString("en-IN")},...p].slice(0,20));setExpDesc("");setExpAmt("");showToast("Expense logged ✦");}}
              style={{background:`linear-gradient(135deg,${C.magenta},${C.gold})`,border:"none",borderRadius:12,width:44,fontSize:22,color:"white",cursor:"pointer"}}>+</button>
          </div>
        </Card>

        {/* ── WIND DOWN ── */}
        <Card delay={0.55} gradient={`linear-gradient(145deg,#f0f5ff,#e8f0ff)`} style={{marginBottom:14,border:`1.5px solid ${C.cobalt}33`}}>
          <Label emoji="🌙" text="Tonight's Wind-Down" color={C.cobalt}/>
          {WINDDOWN.map((item,i)=>{
            const done=wDone.includes(i);
            return <div key={i} onClick={()=>toggleW(i)} className="tap"
              style={{display:"flex",alignItems:"center",gap:14,padding:"11px 0",borderBottom:`1px solid ${C.cobalt}12`,cursor:"pointer"}}>
              <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,
                border:`2px solid ${done?C.cobalt:`${C.cobalt}44`}`,
                background:done?`linear-gradient(135deg,${C.cobalt},${C.cobaltLight})`:"transparent",
                display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s",
              }}>
                {done&&<span style={{color:"white",fontSize:12,fontWeight:"bold"}}>✓</span>}
              </div>
              <div style={{flex:1,fontSize:15,color:done?C.textLight:C.text,textDecoration:done?"line-through":"none",transition:"all 0.3s"}}>{item}</div>
            </div>;
          })}
        </Card>

        {/* ── LETTER TO FUTURE ANNA ── */}
        <Card delay={0.6} gradient={`linear-gradient(145deg,#fffbf0,${C.goldPale}66,#fff8f5)`} style={{marginBottom:14,border:`1.5px solid ${C.gold}55`}}>
          <Label emoji="💌" text="Letter to Future Anna" color={C.gold}/>
          <div style={{fontSize:10,letterSpacing:2,color:C.textLight,textTransform:"uppercase",marginBottom:12,fontFamily:"'Josefin Sans',sans-serif"}}>
            Written · {new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}
          </div>
          <textarea value={letter} onChange={e=>setLetter(e.target.value)}
            placeholder={"Dear Anna,\n\nBy the time you read this, I want you to know..."}
            rows={6}
            style={{...inp,width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontStyle:"italic",lineHeight:1.75}}/>
          <button onClick={()=>{S.set("letter",letter);showToast("💌 Letter saved ✦");}} className="tap"
            style={{marginTop:12,display:"block",marginLeft:"auto",background:`linear-gradient(135deg,${C.magenta},${C.gold})`,border:"none",borderRadius:22,padding:"10px 28px",fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:2,color:"white",cursor:"pointer",textTransform:"uppercase"}}>
            Save Letter ✦
          </button>
        </Card>

        {/* ── BIBLE (always visible) ── */}
        <Card delay={0.65} gradient={`linear-gradient(145deg,#f5fff5,#f0fff8)`} style={{border:`1.5px solid ${C.emerald}33`}}>
          <Label emoji="🕊️" text="Word of God" color={C.emerald}/>
          {loadB?<Loading text="Receiving the word"/>:bibleVerse&&(()=>{
            const lines=bibleVerse.split("\n").filter(l=>l.trim());
            return <>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",lineHeight:1.8,color:C.text,textAlign:"center",marginBottom:12}}>{lines[0]}</div>
              {lines[1]&&<div style={{textAlign:"center",fontSize:10,letterSpacing:3,color:C.emerald,textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>{lines[1]}</div>}
            </>;
          })()}
          {rBtn(()=>{S.set("bDate","");loadBible(true);},C.emerald)}
        </Card>

      </div>

      {/* ── MODALS ── */}
      <Modal open={intentModal} onClose={()=>setIntentModal(false)}>
        <MTitle>Today's Intention</MTitle>
        <MInput placeholder="One word. Make it powerful." value={intentInput} onChange={e=>setIntentInput(e.target.value)}/>
        <MBtns onCancel={()=>setIntentModal(false)} onSave={()=>{setIntention(intentInput.toUpperCase());setIntentModal(false);showToast("Intention set ✦");}} label="Set It ✦"/>
      </Modal>

      <Modal open={goalModal} onClose={()=>setGoalModal(false)}>
        <MTitle>New Moon Goal</MTitle>
        <MInput placeholder="What are you working toward?" value={goalName} onChange={e=>setGoalName(e.target.value)}/>
        <MInput placeholder="How many days?" value={goalDays} onChange={e=>setGoalDays(e.target.value)} type="number"/>
        <MBtns onCancel={()=>setGoalModal(false)} onSave={addGoal} label="Add Goal ✦"/>
      </Modal>

      <Modal open={habitModal} onClose={()=>setHabitModal(false)}>
        <MTitle>Edit Ritual</MTitle>
        <MInput placeholder="Your ritual..." value={habitInput} onChange={e=>setHabitInput(e.target.value)}/>
        <MBtns onCancel={()=>setHabitModal(false)} onSave={()=>{setHabits(p=>{const h=[...p];h[editHIdx]=habitInput;return h;});setHabitModal(false);showToast("Ritual updated ✦");}}/>
      </Modal>

      <Modal open={dayModal} onClose={()=>setDayModal(false)}>
        <MTitle>{editDayName}</MTitle>
        <MInput placeholder="My intention for this day..." value={dayIntent} onChange={e=>setDayIntent(e.target.value)} multiline rows={4}/>
        <MBtns onCancel={()=>setDayModal(false)} onSave={()=>{setWeekData(p=>({...p,[editDayKey]:dayIntent}));setDayModal(false);showToast("Intention set ✦");}} label="Set Intention ✦"/>
      </Modal>

      <Toast msg={toast}/>
    </div>
  );
}
