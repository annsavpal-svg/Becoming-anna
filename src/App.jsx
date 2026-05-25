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
      8%   { opacity: 1; } 92% { opacity: 0.7; }
      100% { transform: translateY(-110vh) rotate(540deg); opacity: 0; }
    }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(24px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.85); }
      65% { transform: scale(1.03); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes starTwinkle {
      0%, 100% { opacity: 0.25; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.5); }
    }
    @keyframes breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.06); }
    }
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
    @keyframes toastIn {
      from { transform: translateX(-50%) translateY(60px); opacity: 0; }
      to   { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes fadeRotate {
      0%   { opacity: 0; transform: translateY(8px); }
      15%  { opacity: 1; transform: translateY(0); }
      85%  { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-8px); }
    }
    @keyframes bulbWarm {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.65; filter: brightness(0.75); }
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
      border-radius: 20px;
    }
    .flip-front { overflow: hidden; }
    .flip-back { transform: rotateY(180deg); overflow-y: auto; -webkit-overflow-scrolling: touch; }
    .tap { transition: transform 0.15s ease; cursor: pointer; }
    .tap:active { transform: scale(0.96); }
    input, textarea, button { font-family: inherit; }
    textarea { resize: none; }
  `}</style>
);

const C = {
  cream:"#fdf6ee", creamWarm:"#faf0e4", creamDeep:"#f5e8d4",
  magenta:"#c0235e", magentaLight:"#e05585", hotPink:"#e8306a", roseDust:"#d4728a",
  gold:"#c9a84c", goldLight:"#e8c97a", goldPale:"#f5e6c0",
  teal:"#1a8a7a", tealLight:"#2ab5a0",
  cobalt:"#2855b8", cobaltLight:"#4a78e0",
  emerald:"#1a7a4a", emeraldLight:"#2aaa6a",
  violet:"#7a30b0", violetLight:"#a055d8",
  text:"#2a1520", textMid:"#6a3a50", textLight:"#a07080",
  border:"rgba(201,168,76,0.25)",
};

const POWER_QUOTES = [
  { law:"Law 1",  title:"Never Outshine the Master",            body:"Always make those above you feel comfortably superior. In your desire to please and impress them, do not go too far in displaying your talents or you might accomplish the opposite — inspire fear and insecurity. Make your masters appear more brilliant than they are and you will attain the heights of power." },
  { law:"Law 3",  title:"Conceal Your Intentions",              body:"Keep people off-balance and in the dark by never revealing the purpose behind your actions. If they have no clue what you are up to, they cannot prepare a defense. Guide them far enough down the wrong path, envelope them in enough smoke, and by the time they realize your intentions, it will be too late." },
  { law:"Law 5",  title:"So Much Depends on Reputation",        body:"Reputation is the cornerstone of power. Through reputation alone you can intimidate and win; once it slips, however, you are vulnerable, and will be attacked on all sides. Make your reputation unassailable. Always be alert to potential attacks and thwart them before they happen." },
  { law:"Law 6",  title:"Court Attention at All Costs",         body:"Everything is judged by its appearance; what is unseen counts for nothing. Never let yourself get lost in the crowd, or buried in oblivion. Stand out. Be conspicuous, at all cost. Make yourself a magnet of attention by appearing larger, more colorful, more mysterious than the bland and timid masses." },
  { law:"Law 9",  title:"Win Through Actions, Never Through Argument", body:"Any momentary triumph you think you have gained through argument is really a Pyrrhic victory: the resentment and ill will you stir up is stronger and lasts longer than any change of opinion. It is much more powerful to get others to agree with you through your actions, without saying a word. Demonstrate, do not explicate." },
  { law:"Law 15", title:"Crush Your Enemy Totally",             body:"All great leaders since Moses have known that a feared enemy must be crushed completely. If you stop halfway, he will recover and seek revenge. Crush him, not only in body but in spirit. The more thoroughly you destroy any possibility of resurgence, the more you secure your own position." },
  { law:"Law 16", title:"Use Absence to Increase Respect",      body:"Too much circulation makes the price go down: the more you are seen and heard from, the more common you appear. If you are already established in a group, temporary withdrawal from it will make you more talked about, even more admired. You must learn when to leave. Create value through scarcity." },
  { law:"Law 25", title:"Re-Create Yourself",                   body:"Do not accept the roles that society foists on you. Re-create yourself by forging a new identity, one that commands attention and never bores the audience. Be the master of your own image rather than letting others define it for you. Incorporate dramatic devices into your public gestures and actions." },
  { law:"Law 28", title:"Enter Action with Boldness",           body:"If you are unsure of a course of action, do not attempt it. Your doubts and hesitations will infect your execution. Timidity is dangerous: better to enter with boldness. Any mistakes you commit through audacity are easily corrected with more audacity. Everyone admires the bold; no one honors the timid." },
  { law:"Law 34", title:"Be Royal in Your Own Fashion",         body:"Act like a king to be treated like one. The way you carry yourself will often determine how you are treated. In the long run, appearing vulgar or common will make people disrespect you. For a king respects himself and inspires the same sentiment in others. By acting regally and confident of your powers, you make yourself seem destined to wear a crown." },
  { law:"Law 47", title:"Do Not Go Past the Mark You Aimed For",body:"In the heat of victory, arrogance and overconfidence can push you past the goal you had aimed for, and by going too far, you make more enemies than you defeat. Do not allow success to go to your head. There is no substitute for strategy and careful planning. Set a goal, and when you reach it, stop." },
  { law:"Law 48", title:"Assume Formlessness",                  body:"By taking a shape, by having a visible plan, you open yourself to attack. Instead of taking a form for your enemy to grasp, keep yourself adaptable and on the move. Accept the fact that nothing is certain and no law is fixed. The best way to protect yourself is to be as fluid and formless as water." },
];

const PSALM_91 = `He who dwells in the shelter of the Most High will rest in the shadow of the Almighty. I will say of the Lord, "He is my refuge and my fortress, my God, in whom I trust." Surely he will save you from the fowler's snare and from the deadly pestilence. He will cover you with his feathers, and under his wings you will find refuge; his faithfulness will be your shield and rampart.\n\nYou will not fear the terror of night, nor the arrow that flies by day, nor the pestilence that stalks in the darkness, nor the plague that destroys at midday. A thousand may fall at your side, ten thousand at your right hand, but it will not come near you.\n\n"Because he loves me," says the Lord, "I will rescue him; I will protect him, for he acknowledges my name. He will call on me, and I will answer him; I will be with him in trouble, I will deliver him and honor him. With long life I will satisfy him and show him my salvation."`;

const PSALM_23 = `The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name's sake.\n\nEven though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.\n\nYou prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows. Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.`;

const GODDESS_TITLES = ["Goddess","Divine One","Queen","Sacred One","Her Majesty","Beloved"];
const MOODS = [
  { emoji:"🔥", label:"On Fire",  color:C.magenta },
  { emoji:"✨", label:"Glowing",  color:C.gold },
  { emoji:"🌸", label:"Soft Day", color:C.roseDust },
  { emoji:"🌊", label:"Flowing",  color:C.teal },
  { emoji:"🌙", label:"Mystical", color:C.violet },
  { emoji:"💎", label:"Abundant", color:C.cobalt },
];
const DEFAULT_HABITS       = ["🌊 Drink 8 glasses of water","🙏 Morning prayer & meditation","🚶‍♀️ Move your body","📖 Read for 20 minutes","✨ Skincare ritual"];
const DEFAULT_MONTH_HABITS = ["💪 Exercise 4x this week","📵 No phone before 9am","🥗 Eat whole foods","💤 Sleep by 11pm","🎨 Practice my craft"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const S = {
  set:(k,v)=>{ try{ localStorage.setItem("annaV4_"+k, typeof v==="string"?v:JSON.stringify(v)); }catch{} },
  get:(k,fb="")=>{ try{ const v=localStorage.getItem("annaV4_"+k); return v!==null?v:fb; }catch{ return fb; } },
  getJ:(k,fb)=>{ try{ const v=localStorage.getItem("annaV4_"+k); return v?JSON.parse(v):fb; }catch{ return fb; } },
};

async function ai(prompt) {
  const r = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content:prompt}] }),
  });
  const d = await r.json();
  return d.content?.[0]?.text || "";
}

function Glitter() {
  const colors=[C.magenta,C.gold,C.teal,C.cobalt,C.goldLight,C.hotPink,C.violet];
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:1}}>
      {Array.from({length:28},(_,i)=>{
        const size=Math.random()*5+2;
        const color=colors[Math.floor(Math.random()*colors.length)];
        return <div key={i} style={{
          position:"absolute", left:`${Math.random()*100}%`, bottom:"-8px",
          width:size, height:size, borderRadius:Math.random()>0.5?"50%":"2px",
          background:color, opacity:0,
          animation:`floatUp ${Math.random()*9+6}s ${Math.random()*10}s linear infinite`,
          boxShadow:`0 0 6px ${color}88`,
        }}/>;
      })}
    </div>
  );
}

function SideStars() {
  const starColors=[C.magenta,C.gold,C.teal,C.cobalt,C.violet,C.hotPink];
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:1,overflow:"hidden"}}>
      {Array.from({length:20},(_,i)=>({
        top:`${4+i*4.8}%`, size:Math.random()*12+7,
        delay:Math.random()*5, dur:Math.random()*3+2,
        side:i%2===0?"left":"right", offset:Math.random()*10+2,
        color:starColors[i%starColors.length],
      })).map((s,i)=>(
        <div key={i} style={{
          position:"absolute", top:s.top, [s.side]:`${s.offset}px`,
          fontSize:s.size, color:s.color,
          animation:`starTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
          textShadow:`0 0 10px ${s.color}`,
        }}>✦</div>
      ))}
    </div>
  );
}

function Toast({msg}) {
  if(!msg) return null;
  return <div style={{
    position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)",
    background:`linear-gradient(135deg,${C.magenta},${C.gold})`,
    color:"white", padding:"11px 24px", borderRadius:24,
    fontSize:12, letterSpacing:2, textTransform:"uppercase",
    zIndex:500, fontFamily:"'Josefin Sans',sans-serif",
    whiteSpace:"nowrap", boxShadow:`0 6px 24px rgba(192,35,94,0.3)`,
    animation:"toastIn 0.4s ease",
  }}>{msg}</div>;
}

function Card({children, style={}, delay=0, gradient=null}) {
  return <div style={{
    background: gradient||"rgba(255,253,249,0.92)",
    backdropFilter:"blur(16px)",
    border:`1.5px solid ${C.border}`,
    borderRadius:22, padding:"22px 20px",
    boxShadow:"0 4px 32px rgba(192,35,94,0.07), 0 1px 0 rgba(255,255,255,0.9) inset",
    animation:`cardIn 0.6s ${delay}s ease both`,
    marginBottom:14,
    ...style,
  }}>{children}</div>;
}

function Label({emoji, text, color=C.gold}) {
  return <div style={{
    display:"flex", alignItems:"center", gap:8,
    fontFamily:"'Josefin Sans',sans-serif", fontSize:10,
    letterSpacing:3, textTransform:"uppercase",
    color, marginBottom:14, fontWeight:400,
  }}>
    {emoji} {text}
    <div style={{flex:1, height:"1.5px", background:`linear-gradient(to right,${color}55,transparent)`}}/>
  </div>;
}

function Modal({open, onClose, children}) {
  if(!open) return null;
  return <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{
    position:"fixed", inset:0, background:"rgba(42,21,32,0.6)", backdropFilter:"blur(8px)",
    zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center",
  }}>
    <div style={{
      background:C.cream, border:`1.5px solid ${C.border}`,
      borderRadius:"26px 26px 0 0", padding:"28px 22px 48px",
      width:"100%", maxWidth:480,
      animation:"slideUp 0.35s cubic-bezier(.2,.8,.4,1)",
      maxHeight:"88vh", overflowY:"auto",
    }}>{children}</div>
  </div>;
}

function MTitle({children}) {
  return <div style={{fontFamily:"'Great Vibes',cursive",fontSize:36,color:C.magenta,textAlign:"center",marginBottom:20}}>{children}</div>;
}
function MInput({placeholder, value, onChange, type="text", multiline=false, rows=3}) {
  const base={width:"100%", background:C.creamWarm, border:`1.5px solid ${C.border}`, borderRadius:14,
    padding:"12px 16px", fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontStyle:"italic",
    color:C.text, outline:"none", marginBottom:12, display:"block"};
  return multiline
    ? <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows} style={base}/>
    : <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={base}/>;
}
function MBtns({onCancel, onSave, label="Save ✦"}) {
  return <div style={{display:"flex", gap:10, marginTop:8}}>
    <button onClick={onCancel} style={{flex:1,background:"none",border:`1.5px solid ${C.border}`,borderRadius:22,padding:"12px 0",fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:2,textTransform:"uppercase",color:C.textMid,cursor:"pointer"}}>Cancel</button>
    <button onClick={onSave} style={{flex:2,background:`linear-gradient(135deg,${C.magenta},${C.gold})`,border:"none",borderRadius:22,padding:"12px 0",fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"white",cursor:"pointer",boxShadow:`0 4px 16px rgba(192,35,94,0.3)`}}>{label}</button>
  </div>;
}
function Loading({text=""}) {
  return <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",color:C.textLight,fontSize:16,textAlign:"center",padding:"12px 0"}}>{text||"Conjuring"}...</div>;
}

/* ══════════════════════════════════════
   MAIN APP
══════════════════════════════════════ */
export default function BecomingAnna() {
  const today    = new Date().toDateString();
  const todayDow = new Date().getDay();
  const dayIdx   = new Date().getDate() % POWER_QUOTES.length;

  /* greeting */
  const [greeting,    setGreeting]    = useState("");
  const [dateStr,     setDateStr]     = useState("");
  const [titleIdx,    setTitleIdx]    = useState(0);
  const [toast,       setToast]       = useState("");

  /* bible popup */
  const [biblePopup,  setBiblePopup]  = useState(false);
  const [bibleVerse,  setBibleVerse]  = useState(null);
  const [loadB,       setLoadB]       = useState(false);

  /* psalms expand */
  const [psalm91Open, setPsalm91Open] = useState(false);
  const [psalm23Open, setPsalm23Open] = useState(false);

  /* horoscope */
  const [horoscope,   setHoroscope]   = useState(null);
  const [loadH,       setLoadH]       = useState(false);

  /* affirmation AI */
  const [affAI,       setAffAI]       = useState(null);
  const [loadA,       setLoadA]       = useState(false);

  /* manifestations — list + rotation */
  const [manifList,   setManifList]   = useState(S.getJ("manifList",["I am magnetic, abundant and divinely guided.","Everything I touch turns to gold.","I am becoming the woman I was always destined to be."]));
  const [manifIdx,    setManifIdx]    = useState(0);
  const [manifModal,  setManifModal]  = useState(false);
  const [manifEdit,   setManifEdit]   = useState("");

  /* mood & intention */
  const [mood,        setMood]        = useState(S.getJ("mood",null));
  const [intention,   setIntention]   = useState(S.get("intention",""));
  const [intentModal, setIntentModal] = useState(false);
  const [intentInput, setIntentInput] = useState("");

  /* daily habits */
  const [habits,      setHabits]      = useState(S.getJ("habits",DEFAULT_HABITS));
  const [hDone,       setHDone]       = useState(S.getJ("hDone_"+today,[]));
  const [habitModal,  setHabitModal]  = useState(false);
  const [editHIdx,    setEditHIdx]    = useState(null);
  const [habitInput,  setHabitInput]  = useState("");

  /* monthly habits */
  const monthKey = `${new Date().getFullYear()}_${new Date().getMonth()}`;
  const [mHabits,     setMHabits]     = useState(S.getJ("mHabits",DEFAULT_MONTH_HABITS));
  const [mHDone,      setMHDone]      = useState(S.getJ("mHDone_"+monthKey,{}));
  const [mHabitModal, setMHabitModal] = useState(false);
  const [editMHIdx,   setEditMHIdx]   = useState(null);
  const [mHabitInput, setMHabitInput] = useState("");
  const daysInMonth   = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
  const currentDay    = new Date().getDate();

  /* goals */
  const [goals,       setGoals]       = useState(S.getJ("goals",[]));
  const [goalModal,   setGoalModal]   = useState(false);
  const [goalName,    setGoalName]    = useState("");
  const [goalDate,    setGoalDate]    = useState("");

  /* brain dump / week */
  const [brainDump,   setBrainDump]   = useState(S.get("brainDump",""));
  const [todos,       setTodos]       = useState(S.getJ("todos",[]));
  const [todoInput,   setTodoInput]   = useState("");

  /* gratitude */
  const [gratitude,   setGratitude]   = useState(S.getJ("gratitude",["","",""]));

  /* money */
  const [mSaved,      setMSaved]      = useState(parseInt(S.get("mSaved","0"))||0);
  const [mGoal,       setMGoal]       = useState(parseInt(S.get("mGoal","0"))||0);
  const [expenses,    setExpenses]    = useState(S.getJ("expenses",[]));
  const [mGoalInp,    setMGoalInp]    = useState("");
  const [mAddInp,     setMAddInp]     = useState("");
  const [expDesc,     setExpDesc]     = useState("");
  const [expAmt,      setExpAmt]      = useState("");

  /* period */
  const [period,      setPeriod]      = useState(S.get("period",""));

  /* soirées */
  const [soirees,     setSoirees]     = useState(S.getJ("soirees",[]));
  const [soireeModal, setSoireeModal] = useState(false);
  const [soireeName,  setSoireeName]  = useState("");
  const [soireeDate,  setSoireeDate]  = useState("");
  const [soireeStatus,setSoireeStatus]= useState("enquiry");

  /* flip */
  const [qFlip,       setQFlip]       = useState(false);

  /* christmas */
  const [xmasTick,    setXmasTick]    = useState(0);

  const showToast = (m)=>{ setToast(m); setTimeout(()=>setToast(""),2600); };

  /* ── persist ── */
  useEffect(()=>S.set("mood",mood),[mood]);
  useEffect(()=>S.set("intention",intention),[intention]);
  useEffect(()=>S.set("manifList",manifList),[manifList]);
  useEffect(()=>S.set("habits",habits),[habits]);
  useEffect(()=>S.set("hDone_"+today,hDone),[hDone,today]);
  useEffect(()=>S.set("mHabits",mHabits),[mHabits]);
  useEffect(()=>S.set("mHDone_"+monthKey,mHDone),[mHDone,monthKey]);
  useEffect(()=>S.set("goals",goals),[goals]);
  useEffect(()=>S.set("brainDump",brainDump),[brainDump]);
  useEffect(()=>S.set("todos",todos),[todos]);
  useEffect(()=>S.set("gratitude",gratitude),[gratitude]);
  useEffect(()=>S.set("mSaved",mSaved),[mSaved]);
  useEffect(()=>S.set("mGoal",mGoal),[mGoal]);
  useEffect(()=>S.set("expenses",expenses),[expenses]);
  useEffect(()=>S.set("period",period),[period]);
  useEffect(()=>S.set("soirees",soirees),[soirees]);

  /* ── greeting ── */
  useEffect(()=>{
    const upd=()=>{
      const h=new Date().getHours();
      setGreeting(h<12?"Good morning":h<17?"Good afternoon":"Good evening");
      setDateStr(new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).toUpperCase());
    };
    upd(); const iv=setInterval(upd,60000); return()=>clearInterval(iv);
  },[]);

  /* ── title rotation ── */
  useEffect(()=>{
    const iv=setInterval(()=>setTitleIdx(p=>(p+1)%GODDESS_TITLES.length),4000);
    return()=>clearInterval(iv);
  },[]);

  /* ── manifestation rotation every 6s ── */
  useEffect(()=>{
    if(manifList.length<2) return;
    const iv=setInterval(()=>setManifIdx(p=>(p+1)%manifList.length),6000);
    return()=>clearInterval(iv);
  },[manifList]);

  /* ── christmas ticker ── */
  useEffect(()=>{
    const tick=()=>{
      const now=new Date();
      const yr=now.getMonth()>=11&&now.getDate()>25?now.getFullYear()+1:now.getFullYear();
      const xmas=new Date(yr,11,25);
      setXmasTick(Math.max(0,xmas-now));
    };
    tick(); const iv=setInterval(tick,1000); return()=>clearInterval(iv);
  },[]);

  /* ── AI: bible ── */
  const loadBible=useCallback(async(force=false)=>{
    const c=S.get("bDate",""), t=S.get("bText","");
    if(!force&&c===today&&t){ setBibleVerse(t); return; }
    setLoadB(true);
    try{
      const text=await ai("Give me one deeply hopeful, intimate Bible verse about God's presence, miracles, or divine love. Make it feel personal and warm. Format: first line is the verse text only, second line is the reference (e.g. Isaiah 41:10). Nothing else.");
      setBibleVerse(text); S.set("bDate",today); S.set("bText",text);
    }catch{ setBibleVerse("For I know the plans I have for you, declares the Lord.\nJeremiah 29:11"); }
    setLoadB(false);
  },[today]);

  /* ── AI: horoscope (Chani Nicholas style, daily) ── */
  const loadHoroscope=useCallback(async(force=false)=>{
    const c=S.get("hDate",""), t=S.get("hText","");
    if(!force&&c===today&&t){ setHoroscope(t); return; }
    setLoadH(true);
    try{
      const text=await ai(`Write a daily horoscope for an Aries woman born March 25 1992, in the style of Chani Nicholas — honest, soulful, poetic, spiritually grounded, never superficial. She is 34, fiercely ambitious, a visual and experiential artist, deeply spiritual, channeling the energy of Michael Jackson in her relentless pursuit of creative excellence. She runs three creative businesses. Be specific, real, and compassionate. 4-5 sentences. Include a theme or focus for the day. Today: ${new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}. End with a one-line power theme prefixed with "Today's theme:"`);
      setHoroscope(text); S.set("hDate",today); S.set("hText",text);
    }catch{ setHoroscope("The stars see you, Aries — every quiet act of discipline you perform in private is being recorded by the universe. Today asks you to go inward before you go outward. Your creativity is not separate from your spirituality; they are the same flame. Trust what you are building even when the results are not yet visible. Today's theme: Sacred Discipline."); }
    setLoadH(false);
  },[today]);

  /* ── AI: affirmation ── */
  const loadAff=useCallback(async(force=false)=>{
    const c=S.get("aDate",""), t=S.get("aText","");
    if(!force&&c===today&&t){ setAffAI(t); return; }
    setLoadA(true);
    try{
      const text=await ai("Write one powerful divine feminine affirmation for an Aries woman channeling the energy of Michael Jackson — creative excellence, relentless intention, magical artistry. Celestial, bold, deeply personal. Start with 'I am' or 'I'. One sentence only, no quotes.");
      setAffAI(text); S.set("aDate",today); S.set("aText",text);
    }catch{ setAffAI("I am an instrument of divine excellence, crafted to create magic that moves the world."); }
    setLoadA(false);
  },[today]);

  useEffect(()=>{
    loadBible(); loadHoroscope(); loadAff();
    const last=S.get("lastOpen","");
    if(last!==today){ setBiblePopup(true); S.set("lastOpen",today); }
  },[loadBible,loadHoroscope,loadAff,today]);

  /* ── helpers ── */
  const toggleH=(i)=>{ setHDone(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]); if(!hDone.includes(i))showToast("✨ Ritual complete!"); };

  const toggleMH=(habitIdx, dayNum)=>{
    setMHDone(p=>{
      const key=`${habitIdx}_${dayNum}`;
      const n={...p};
      n[key]=!n[key];
      return n;
    });
  };

  const addGoal=()=>{
    if(!goalName||!goalDate) return;
    setGoals(p=>[...p,{ name:goalName, targetDate:goalDate, id:Date.now() }]);
    setGoalName(""); setGoalDate(""); setGoalModal(false);
    showToast("🌕 Moon goal set ✦");
  };

  const getGoalCountdown=(targetDate)=>{
    const diff=new Date(targetDate)-new Date();
    if(diff<=0) return { days:0, done:true };
    return { days:Math.ceil(diff/86400000), done:false };
  };

  const addTodo=()=>{
    if(!todoInput.trim()) return;
    setTodos(p=>[...p,{ text:todoInput.trim(), done:false, id:Date.now() }]);
    setTodoInput("");
  };

  const toggleTodo=(id)=>setTodos(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));
  const deleteTodo=(id)=>setTodos(p=>p.filter(t=>t.id!==id));

  const addSoiree=()=>{
    if(!soireeName) return;
    setSoirees(p=>[...p,{ name:soireeName, date:soireeDate, status:soireeStatus, milestones:[], id:Date.now() }]);
    setSoireeName(""); setSoireeDate(""); setSoireeStatus("enquiry"); setSoireeModal(false);
    showToast("🥂 Event added!");
  };

  const toggleMilestone=(eid,midx)=>{
    setSoirees(p=>p.map(e=>e.id===eid?{...e,milestones:e.milestones.map((m,i)=>i===midx?{...m,done:!m.done}:m)}:e));
  };

  const getPeriodInfo=()=>{
    if(!period) return null;
    const start=new Date(period), cycleLen=28, periodLen=5;
    const raw=Math.floor((new Date()-start)/86400000)%cycleLen;
    const day=((raw%cycleLen)+cycleLen)%cycleLen;
    let phase,icon;
    if(day<periodLen){ phase="Menstrual Phase"; icon="🌹"; }
    else if(day<13){ phase="Follicular Phase"; icon="🌱"; }
    else if(day<16){ phase="Ovulation ✨"; icon="🌟"; }
    else{ phase="Luteal Phase"; icon="🌙"; }
    return{ phase, icon, day, next:cycleLen-day, cycleLen, periodLen };
  };
  const pi=getPeriodInfo();

  const xDays=Math.floor(xmasTick/86400000);
  const xHrs=Math.floor((xmasTick%86400000)/3600000);
  const xMins=Math.floor((xmasTick%3600000)/60000);
  const xSecs=Math.floor((xmasTick%60000)/1000);

  const annDate=new Date(new Date().getFullYear(),8,21);
  if(annDate<new Date()) annDate.setFullYear(annDate.getFullYear()+1);
  const annDiff=Math.ceil((annDate-new Date())/86400000);

  const quote=POWER_QUOTES[dayIdx];

  const inp={
    background:C.creamWarm, border:`1.5px solid ${C.border}`,
    borderRadius:12, padding:"10px 14px",
    fontFamily:"'Josefin Sans',sans-serif", fontSize:13,
    color:C.text, outline:"none", boxSizing:"border-box",
  };

  const rBtn=(fn,color=C.gold)=>(
    <button onClick={fn} style={{display:"block",margin:"12px auto 0",background:"none",border:`1.5px solid ${color}88`,borderRadius:20,padding:"6px 20px",fontFamily:"'Josefin Sans',sans-serif",fontSize:10,letterSpacing:2,color,cursor:"pointer",textTransform:"uppercase"}}>✦ Refresh</button>
  );

  /* ══════ RENDER ══════ */
  return (
    <div style={{background:`linear-gradient(145deg,${C.cream} 0%,${C.creamWarm} 50%,#fae8dc 100%)`,minHeight:"100vh",position:"relative",fontFamily:"'Josefin Sans',sans-serif",color:C.text,overflowX:"hidden"}}>
      <FontStyle/>
      <Glitter/>
      <SideStars/>

      {/* ── BIBLE POPUP ── */}
      {biblePopup&&(
        <div onClick={()=>setBiblePopup(false)} style={{position:"fixed",inset:0,background:"rgba(42,21,32,0.55)",backdropFilter:"blur(10px)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div onClick={e=>e.stopPropagation()} style={{background:`linear-gradient(160deg,${C.cream},${C.creamWarm})`,border:`2px solid ${C.magenta}44`,borderRadius:28,padding:"40px 28px",maxWidth:380,width:"100%",boxShadow:`0 0 60px rgba(192,35,94,0.2),0 20px 60px rgba(0,0,0,0.15)`,animation:"popIn 0.6s cubic-bezier(.2,.8,.4,1)",textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:14,animation:"breathe 3s ease-in-out infinite"}}>🕊️</div>
            <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:10,letterSpacing:4,color:C.magenta,textTransform:"uppercase",marginBottom:20}}>Word of God · Today</div>
            {loadB?<Loading text="Receiving the word"/>:bibleVerse&&(()=>{
              const lines=bibleVerse.split("\n").filter(l=>l.trim());
              return <>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontStyle:"italic",lineHeight:1.8,color:C.text,marginBottom:16}}>{lines[0]}</div>
                {lines[1]&&<div style={{fontSize:11,letterSpacing:3,color:C.magenta,textTransform:"uppercase"}}>{lines[1]}</div>}
              </>;
            })()}
            <button onClick={()=>setBiblePopup(false)} style={{marginTop:28,background:`linear-gradient(135deg,${C.magenta},${C.gold})`,border:"none",borderRadius:24,padding:"13px 36px",fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:3,color:"white",cursor:"pointer",textTransform:"uppercase",boxShadow:`0 6px 24px rgba(192,35,94,0.3)`}}>Receive & Enter ✦</button>
          </div>
        </div>
      )}

      <div style={{position:"relative",zIndex:2,maxWidth:480,margin:"0 auto",padding:"22px 20px 60px"}}>

        {/* ── HEADER ── */}
        <Card delay={0.05} gradient={`linear-gradient(145deg,#fff0f5,${C.goldPale},#f0f5ff)`} style={{textAlign:"center",padding:"34px 22px",border:`1.5px solid ${C.magenta}33`,boxShadow:`0 8px 40px rgba(192,35,94,0.1),0 2px 0 white inset`}}>
          <div style={{fontSize:11,letterSpacing:5,color:C.magenta,textTransform:"uppercase",marginBottom:8}}>{greeting}, {GODDESS_TITLES[titleIdx]} ✦</div>
          <div style={{fontFamily:"'Great Vibes',cursive",fontSize:54,color:C.magenta,textShadow:`0 2px 20px rgba(192,35,94,0.25)`,lineHeight:1,marginBottom:10}}>Becoming Anna</div>
          <div style={{fontSize:10,letterSpacing:2.5,color:C.textLight,textTransform:"uppercase"}}>{dateStr}</div>
          <div style={{marginTop:18,display:"flex",justifyContent:"center",gap:7,flexWrap:"wrap"}}>
            {MOODS.map(m=>(
              <button key={m.label} onClick={()=>{setMood(m);showToast(`${m.emoji} ${m.label} energy set`);}} className="tap"
                style={{background:mood?.label===m.label?`${m.color}22`:"rgba(255,255,255,0.6)",border:`1.5px solid ${mood?.label===m.label?m.color:C.border}`,borderRadius:20,padding:"6px 12px",fontSize:12,cursor:"pointer",color:mood?.label===m.label?m.color:C.textMid,transition:"all 0.3s"}}>
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
          <div onClick={()=>{setIntentInput(intention);setIntentModal(true);}} className="tap"
            style={{marginTop:16,background:"rgba(255,255,255,0.7)",border:`1.5px dashed ${C.magenta}55`,borderRadius:16,padding:"12px 18px",cursor:"pointer"}}>
            {intention
              ? <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,letterSpacing:5,color:C.magenta,textTransform:"uppercase"}}>{intention}</div>
              : <div style={{fontSize:11,letterSpacing:3,color:C.textLight,textTransform:"uppercase"}}>✦ Tap to set today's intention</div>}
          </div>
        </Card>

        {/* ── 48 LAWS — full width, bigger ── */}
        <Card delay={0.1} gradient={`linear-gradient(145deg,#fff0f5,#ffe8f0)`} style={{border:`1.5px solid ${C.magenta}44`}}>
          <Label emoji="⚔️" text="Law of the Day" color={C.magenta}/>
          <div style={{fontFamily:"'Great Vibes',cursive",fontSize:26,color:C.gold,marginBottom:6}}>{quote.law}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:C.text,lineHeight:1.4,marginBottom:16}}>{quote.title}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",lineHeight:1.8,color:C.textMid,marginBottom:12}}>{quote.body}</div>
          <div style={{fontSize:10,letterSpacing:2,color:C.gold,textTransform:"uppercase",textAlign:"right"}}>— 48 Laws of Power</div>
        </Card>

        {/* ── HOROSCOPE — full width, Chani style ── */}
        <Card delay={0.15} gradient={`linear-gradient(145deg,#f0eaff,#ede8ff)`} style={{border:`1.5px solid ${C.violet}44`}}>
          <Label emoji="♈" text="Aries · Daily Reading" color={C.violet}/>
          <div style={{fontSize:9,letterSpacing:2,color:C.textLight,textTransform:"uppercase",marginBottom:12,fontFamily:"'Josefin Sans',sans-serif"}}>
            In the style of Chani Nicholas · {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}
          </div>
          {loadH?<Loading text="Reading your stars"/>:horoscope&&(()=>{
            const parts=horoscope.split("Today's theme:");
            const body=parts[0].trim();
            const theme=parts[1]?.trim();
            return <>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",lineHeight:1.85,color:C.text,marginBottom:16}}>{body}</div>
              {theme&&<div style={{background:`${C.violet}12`,border:`1px solid ${C.violet}33`,borderRadius:12,padding:"10px 14px",textAlign:"center"}}>
                <div style={{fontSize:9,letterSpacing:3,color:C.violet,textTransform:"uppercase",marginBottom:4}}>Today's Theme</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:C.violet}}>{theme}</div>
              </div>}
            </>;
          })()}
          {rBtn(()=>{S.set("hDate","");loadHoroscope(true);},C.violet)}
        </Card>

        {/* ── MANIFESTATIONS — rotating + editable ── */}
        <Card delay={0.2} gradient={`linear-gradient(145deg,#fff8f0,${C.goldPale}88,#fff0f8)`} style={{border:`1.5px solid ${C.gold}44`}}>
          <Label emoji="✨" text="Manifestations" color={C.gold}/>
          {/* AI affirmation */}
          <div style={{background:`linear-gradient(135deg,${C.magenta}12,${C.gold}10)`,borderRadius:16,padding:"16px",marginBottom:16,border:`1px solid ${C.magenta}20`}}>
            <div style={{fontSize:9,letterSpacing:2,color:C.magenta,textTransform:"uppercase",marginBottom:8,fontFamily:"'Josefin Sans',sans-serif"}}>Today's Divine Affirmation</div>
            {loadA?<Loading text="Channeling your power"/>:
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",lineHeight:1.7,color:C.text,textAlign:"center"}}>{affAI}</div>}
            {rBtn(()=>{S.set("aDate","");loadAff(true);},C.magenta)}
          </div>
          {/* Rotating manifestations */}
          <div style={{fontSize:9,letterSpacing:2,color:C.textLight,textTransform:"uppercase",marginBottom:10,fontFamily:"'Josefin Sans',sans-serif"}}>My Manifestations</div>
          {manifList.length>0&&(
            <div style={{background:"rgba(255,255,255,0.7)",border:`1.5px solid ${C.gold}44`,borderRadius:16,padding:"18px",marginBottom:12,minHeight:70,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div key={manifIdx} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontStyle:"italic",lineHeight:1.65,color:C.text,animation:"fadeRotate 6s ease both"}}>
                {manifList[manifIdx]}
              </div>
              {manifList.length>1&&(
                <div style={{position:"absolute",bottom:8,display:"flex",gap:4,justifyContent:"center",width:"100%"}}>
                  {manifList.map((_,i)=>(
                    <div key={i} onClick={()=>setManifIdx(i)} style={{width:6,height:6,borderRadius:"50%",background:i===manifIdx?C.gold:`${C.gold}44`,cursor:"pointer",transition:"all 0.3s"}}/>
                  ))}
                </div>
              )}
            </div>
          )}
          <button onClick={()=>{setManifEdit(manifList.join("\n"));setManifModal(true);}} style={{width:"100%",background:"none",border:`1.5px dashed ${C.gold}66`,borderRadius:14,padding:"10px",fontFamily:"'Josefin Sans',sans-serif",fontSize:10,letterSpacing:2,color:C.gold,cursor:"pointer",textTransform:"uppercase"}}>✦ Edit My Manifestations</button>
        </Card>

        {/* ── DAILY HABITS ── */}
        <Card delay={0.25} gradient={`linear-gradient(145deg,#f0f8ff,#e8f2ff)`} style={{border:`1.5px solid ${C.cobalt}33`}}>
          <Label emoji="🌙" text="Morning Rituals" color={C.cobalt}/>
          {habits.map((h,i)=>{
            const done=hDone.includes(i);
            return <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:`1px solid ${C.cobalt}15`}}>
              <div onClick={()=>toggleH(i)} className="tap" style={{width:26,height:26,borderRadius:"50%",flexShrink:0,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${done?C.cobalt:`${C.cobalt}44`}`,background:done?`linear-gradient(135deg,${C.cobalt},${C.cobaltLight})`:"transparent",transition:"all 0.3s",boxShadow:done?`0 0 12px ${C.cobalt}55`:"none"}}>
                {done&&<span style={{color:"white",fontSize:14,fontWeight:"bold"}}>✓</span>}
              </div>
              <div style={{flex:1,fontSize:15,color:done?C.textLight:C.text,textDecoration:done?"line-through":"none",transition:"all 0.3s"}}>{h}</div>
              <button onClick={()=>{setEditHIdx(i);setHabitInput(h);setHabitModal(true);}} style={{background:"none",border:"none",fontSize:13,cursor:"pointer",opacity:0.4,color:C.text}}>✏️</button>
            </div>;
          })}
        </Card>

        {/* ── MONTHLY HABIT TRACKER ── */}
        <Card delay={0.3} gradient={`linear-gradient(145deg,#f5f0ff,#ede8ff)`} style={{border:`1.5px solid ${C.violet}33`}}>
          <Label emoji="📅" text="Monthly Habit Tracker" color={C.violet}/>
          <div style={{fontSize:10,letterSpacing:1.5,color:C.textLight,textTransform:"uppercase",marginBottom:12,fontFamily:"'Josefin Sans',sans-serif"}}>
            {new Date().toLocaleDateString("en-IN",{month:"long",year:"numeric"})} · Tap a day to check off
          </div>
          {mHabits.map((h,hi)=>{
            const doneCount=Array.from({length:currentDay},(_,d)=>mHDone[`${hi}_${d+1}`]?1:0).reduce((a,b)=>a+b,0);
            return (
              <div key={hi} style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{fontSize:14,color:C.text,fontFamily:"'Josefin Sans',sans-serif"}}>{h}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{fontSize:10,color:C.violet,fontFamily:"'Josefin Sans',sans-serif"}}>{doneCount}/{currentDay}d</div>
                    <button onClick={()=>{setEditMHIdx(hi);setMHabitInput(h);setMHabitModal(true);}} style={{background:"none",border:"none",fontSize:12,cursor:"pointer",opacity:0.4,color:C.text}}>✏️</button>
                  </div>
                </div>
                <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                  {Array.from({length:daysInMonth},(_,d)=>{
                    const dayNum=d+1;
                    const isFuture=dayNum>currentDay;
                    const isDone=mHDone[`${hi}_${dayNum}`];
                    return (
                      <div key={d} onClick={()=>!isFuture&&toggleMH(hi,dayNum)} style={{
                        width:22,height:22,borderRadius:6,
                        background:isDone?`linear-gradient(135deg,${C.violet},${C.violetLight})`:isFuture?"rgba(0,0,0,0.04)":`${C.violet}15`,
                        border:`1px solid ${isDone?C.violet:isFuture?"rgba(0,0,0,0.06)":`${C.violet}33`}`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:8,color:isDone?"white":isFuture?C.textLight:C.violet,
                        cursor:isFuture?"default":"pointer",
                        transition:"all 0.2s",
                        fontFamily:"'Josefin Sans',sans-serif",fontWeight:400,
                      }}>{isDone?"✓":dayNum}</div>
                    );
                  })}
                </div>
                <div style={{height:3,background:`${C.violet}15`,borderRadius:2,overflow:"hidden",marginTop:8}}>
                  <div style={{height:"100%",width:`${(doneCount/currentDay)*100}%`,background:`linear-gradient(to right,${C.violet},${C.violetLight})`,transition:"width 0.5s"}}/>
                </div>
              </div>
            );
          })}
        </Card>

        {/* ── MOON GOALS — date based ── */}
        <Card delay={0.35} gradient={`linear-gradient(145deg,#fff8f0,#fff0e8)`} style={{border:`1.5px solid ${C.gold}44`}}>
          <Label emoji="🌕" text="Moon Goals" color={C.gold}/>
          {goals.length===0&&<div style={{textAlign:"center",color:C.textLight,fontStyle:"italic",fontSize:16,padding:"10px 0",fontFamily:"'Cormorant Garamond',serif"}}>Your moon goals await ✦</div>}
          {goals.map((g,i)=>{
            const cd=getGoalCountdown(g.targetDate);
            const totalDays=Math.ceil((new Date(g.targetDate)-new Date(g.id))/86400000);
            const elapsed=totalDays-cd.days;
            const pct=Math.min(100,Math.max(0,(elapsed/totalDays)*100)).toFixed(0);
            const moons=Array.from({length:Math.min(Math.ceil(totalDays/3),28)},(_,mi)=>mi<Math.ceil(elapsed/3)?"🌕":mi===Math.ceil(elapsed/3)?"🌗":"🌑");
            return <div key={g.id} style={{background:`${C.goldPale}88`,border:`1px solid ${C.gold}33`,borderRadius:18,padding:16,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:C.text}}>{g.name}</div>
                <div style={{textAlign:"right"}}>
                  {cd.done
                    ? <div style={{fontSize:14,color:C.emerald}}>🎉 Complete!</div>
                    : <div style={{fontSize:22,fontWeight:600,color:C.magenta,fontFamily:"'Cormorant Garamond',serif",lineHeight:1}}>{cd.days}<span style={{fontSize:11,color:C.textLight,letterSpacing:1,marginLeft:4}}>days left</span></div>}
                  <div style={{fontSize:9,color:C.textLight,letterSpacing:1,textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>{new Date(g.targetDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:2,flexWrap:"wrap",marginBottom:8}}>{moons.map((m,mi)=><span key={mi} style={{fontSize:14}}>{m}</span>)}</div>
              <div style={{height:5,background:`${C.gold}22`,borderRadius:3,overflow:"hidden",marginBottom:8}}>
                <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(to right,${C.magenta},${C.gold})`,borderRadius:3,transition:"width 0.8s ease"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:10,color:C.textLight,fontFamily:"'Josefin Sans',sans-serif"}}>{pct}% of the journey</div>
                <button onClick={()=>setGoals(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:20,padding:"4px 12px",fontSize:9,letterSpacing:1.5,color:C.textLight,cursor:"pointer",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>Remove</button>
              </div>
            </div>;
          })}
          <button onClick={()=>setGoalModal(true)} style={{width:"100%",background:"none",border:`1.5px dashed ${C.gold}66`,borderRadius:18,padding:13,fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:2,color:C.gold,cursor:"pointer",textTransform:"uppercase"}}>✦ Add New Goal</button>
        </Card>

        {/* ── BRAIN DUMP & TO-DO ── */}
        <Card delay={0.4} gradient={`linear-gradient(145deg,#f0fff8,#e8f8f0)`} style={{border:`1.5px solid ${C.emerald}33`}}>
          <Label emoji="🧠" text="Brain Dump & To-Do" color={C.emerald}/>
          <textarea value={brainDump} onChange={e=>setBrainDump(e.target.value)}
            placeholder={"Get it all out of your head and onto this page...\n\nThoughts, ideas, things to remember, things bothering you — dump it all here. ✦"}
            rows={7}
            style={{...inp,width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",lineHeight:1.75,marginBottom:16,background:"rgba(255,255,255,0.7)"}}/>
          <div style={{fontSize:10,letterSpacing:2,color:C.emerald,textTransform:"uppercase",marginBottom:10,fontFamily:"'Josefin Sans',sans-serif"}}>Action Items</div>
          {todos.map(t=>(
            <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.emerald}15`}}>
              <div onClick={()=>toggleTodo(t.id)} className="tap" style={{width:22,height:22,borderRadius:6,flexShrink:0,border:`2px solid ${t.done?C.emerald:`${C.emerald}44`}`,background:t.done?C.emerald:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s"}}>
                {t.done&&<span style={{color:"white",fontSize:12,fontWeight:"bold"}}>✓</span>}
              </div>
              <div style={{flex:1,fontSize:15,color:t.done?C.textLight:C.text,textDecoration:t.done?"line-through":"none",fontFamily:"'Cormorant Garamond',serif"}}>{t.text}</div>
              <button onClick={()=>deleteTodo(t.id)} style={{background:"none",border:"none",fontSize:14,cursor:"pointer",color:C.textLight,opacity:0.5}}>✕</button>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <input type="text" placeholder="Add a task..." value={todoInput} onChange={e=>setTodoInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&addTodo()}
              style={{...inp,flex:1,fontSize:14}}/>
            <button onClick={addTodo} style={{background:`linear-gradient(135deg,${C.emerald},${C.teal})`,border:"none",borderRadius:12,width:44,fontSize:22,color:"white",cursor:"pointer"}}>+</button>
          </div>
        </Card>

        {/* ── PSALM 91 ── */}
        <Card delay={0.42} gradient={`linear-gradient(145deg,#f5fff5,#edfaed)`} style={{border:`1.5px solid ${C.emerald}44`}}>
          <div onClick={()=>setPsalm91Open(p=>!p)} className="tap" style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
            <div>
              <Label emoji="🕊️" text="Psalm 91" color={C.emerald}/>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontStyle:"italic",color:C.textMid,marginTop:-8}}>He who dwells in the shelter of the Most High...</div>
            </div>
            <div style={{fontSize:20,color:C.emerald,marginLeft:10}}>{psalm91Open?"▲":"▼"}</div>
          </div>
          {psalm91Open&&(
            <div style={{marginTop:16,fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontStyle:"italic",lineHeight:1.9,color:C.text,whiteSpace:"pre-line"}}>
              {PSALM_91}
            </div>
          )}
        </Card>

        {/* ── PSALM 23 ── */}
        <Card delay={0.44} gradient={`linear-gradient(145deg,#f5fff5,#edfaed)`} style={{border:`1.5px solid ${C.emerald}44`}}>
          <div onClick={()=>setPsalm23Open(p=>!p)} className="tap" style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
            <div>
              <Label emoji="🕊️" text="Psalm 23" color={C.emerald}/>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontStyle:"italic",color:C.textMid,marginTop:-8}}>The Lord is my shepherd, I lack nothing...</div>
            </div>
            <div style={{fontSize:20,color:C.emerald,marginLeft:10}}>{psalm23Open?"▲":"▼"}</div>
          </div>
          {psalm23Open&&(
            <div style={{marginTop:16,fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontStyle:"italic",lineHeight:1.9,color:C.text,whiteSpace:"pre-line"}}>
              {PSALM_23}
            </div>
          )}
        </Card>

        {/* ── BIBLE VERSE (daily AI) ── */}
        <Card delay={0.46} gradient={`linear-gradient(145deg,#f5fff5,#f0fff8)`} style={{border:`1.5px solid ${C.emerald}33`}}>
          <Label emoji="📖" text="Word of God · Today" color={C.emerald}/>
          {loadB?<Loading text="Receiving the word"/>:bibleVerse&&(()=>{
            const lines=bibleVerse.split("\n").filter(l=>l.trim());
            return <>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",lineHeight:1.8,color:C.text,textAlign:"center",marginBottom:12}}>{lines[0]}</div>
              {lines[1]&&<div style={{textAlign:"center",fontSize:10,letterSpacing:3,color:C.emerald,textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>{lines[1]}</div>}
            </>;
          })()}
          {rBtn(()=>{S.set("bDate","");loadBible(true);},C.emerald)}
        </Card>

        {/* ── MINI SOIRÉES ── */}
        <Card delay={0.5} gradient={`linear-gradient(145deg,#f0f8ff,#e8f5ff,#f5f0ff)`} style={{border:`1.5px solid ${C.cobalt}44`}}>
          <Label emoji="🥂" text="Mini Soirées" color={C.cobalt}/>
          {soirees.length===0&&<div style={{textAlign:"center",color:C.textLight,fontStyle:"italic",fontSize:15,padding:"10px 0",fontFamily:"'Cormorant Garamond',serif"}}>Your first event awaits ✦</div>}
          {soirees.map((e)=>{
            const daysTo=e.date?Math.ceil((new Date(e.date)-new Date())/86400000):null;
            const statusColors={"enquiry":C.gold,"confirmed":C.emerald,"completed":C.textLight,"planning":C.cobalt};
            const statusColor=statusColors[e.status]||C.gold;
            const [newMs, setNewMs]=useState("");
            return (
              <div key={e.id} style={{background:"rgba(255,255,255,0.7)",border:`1.5px solid ${statusColor}44`,borderRadius:18,padding:14,marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:C.text}}>{e.name}</div>
                    {e.date&&<div style={{fontSize:10,color:C.textLight,letterSpacing:1,fontFamily:"'Josefin Sans',sans-serif"}}>{new Date(e.date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                    <div style={{fontSize:9,letterSpacing:1.5,color:statusColor,textTransform:"uppercase",background:`${statusColor}18`,borderRadius:10,padding:"3px 8px",fontFamily:"'Josefin Sans',sans-serif"}}>{e.status}</div>
                    {daysTo!==null&&<div style={{fontSize:10,color:C.textLight,fontFamily:"'Josefin Sans',sans-serif"}}>{daysTo>0?`${daysTo}d away`:daysTo===0?"Today! 🎉":"Past"}</div>}
                  </div>
                </div>
                {e.milestones.length>0&&<>
                  <div style={{height:4,background:`${C.cobalt}15`,borderRadius:2,overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",width:`${(e.milestones.filter(m=>m.done).length/e.milestones.length)*100}%`,background:`linear-gradient(to right,${C.cobalt},${C.teal})`,transition:"width 0.5s"}}/>
                  </div>
                  {e.milestones.map((m,mi)=>(
                    <div key={mi} onClick={()=>toggleMilestone(e.id,mi)} className="tap"
                      style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",cursor:"pointer"}}>
                      <div style={{width:16,height:16,borderRadius:"50%",flexShrink:0,border:`2px solid ${m.done?C.cobalt:`${C.cobalt}44`}`,background:m.done?C.cobalt:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {m.done&&<span style={{color:"white",fontSize:9,fontWeight:"bold"}}>✓</span>}
                      </div>
                      <div style={{fontSize:13,color:m.done?C.textLight:C.text,textDecoration:m.done?"line-through":"none"}}>{m.text}</div>
                    </div>
                  ))}
                </>}
                <div style={{display:"flex",gap:6,marginTop:10}}>
                  <input type="text" placeholder="Add milestone..." value={newMs} onChange={ev=>setNewMs(ev.target.value)}
                    onKeyDown={ev=>{if(ev.key==="Enter"&&newMs.trim()){setSoirees(p=>p.map(s=>s.id===e.id?{...s,milestones:[...s.milestones,{text:newMs.trim(),done:false}]}:s));setNewMs("");}}}
                    style={{...inp,flex:1,fontSize:12,padding:"7px 10px"}}/>
                  <button onClick={()=>{if(newMs.trim()){setSoirees(p=>p.map(s=>s.id===e.id?{...s,milestones:[...s.milestones,{text:newMs.trim(),done:false}]}:s));setNewMs("");}}}
                    style={{background:`linear-gradient(135deg,${C.cobalt},${C.teal})`,border:"none",borderRadius:10,width:36,fontSize:18,color:"white",cursor:"pointer"}}>+</button>
                  <button onClick={()=>setSoirees(p=>p.filter(s=>s.id!==e.id))}
                    style={{background:"none",border:`1px solid ${C.border}`,borderRadius:10,width:36,fontSize:14,color:C.textLight,cursor:"pointer"}}>✕</button>
                </div>
              </div>
            );
          })}
          <button onClick={()=>setSoireeModal(true)} style={{width:"100%",background:"none",border:`1.5px dashed ${C.cobalt}55`,borderRadius:18,padding:13,fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:2,color:C.cobalt,cursor:"pointer",textTransform:"uppercase"}}>🥂 Add Event</button>
        </Card>

        {/* ── ANNARTISTRY COUNTDOWN ── */}
        <Card delay={0.55} gradient={`linear-gradient(145deg,#fff5f0,#ffe8e0,#fff0f8)`} style={{border:`1.5px solid ${C.magenta}55`}}>
          <Label emoji="🎨" text="Annartistry Rebrand" color={C.magenta}/>
          <div style={{textAlign:"center",padding:"8px 0"}}>
            <div style={{fontFamily:"'Great Vibes',cursive",fontSize:32,color:C.magenta,marginBottom:4}}>September 21st</div>
            <div style={{fontSize:11,letterSpacing:3,color:C.textLight,textTransform:"uppercase",marginBottom:16,fontFamily:"'Josefin Sans',sans-serif"}}>6th Anniversary · New Era Begins</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:56,fontWeight:600,color:C.magenta,lineHeight:1,marginBottom:4}}>{annDiff}</div>
            <div style={{fontSize:9,letterSpacing:3,color:C.textLight,textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif",marginBottom:16}}>Days</div>
            <div style={{height:6,background:`${C.magenta}15`,borderRadius:3,overflow:"hidden",marginBottom:12}}>
              <div style={{height:"100%",width:`${Math.max(0,Math.min(100,(1-(annDiff/365))*100))}%`,background:`linear-gradient(to right,${C.magenta},${C.gold})`,borderRadius:3}}/>
            </div>
            <div style={{fontSize:13,color:C.textMid,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}>
              {annDiff<=7?"✨ It's almost time, Queen!":annDiff<=30?"🔥 The rebrand is close — keep building!":annDiff<=90?"🎨 Every day you create is a day closer to your new era.":"🌙 Your new chapter is being written. Stay the course."}
            </div>
          </div>
        </Card>

        {/* ── SAVINGS + CYCLE ── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <Card gradient={`linear-gradient(145deg,#f0fff8,#e0f8ee)`} style={{border:`1.5px solid ${C.teal}44`,padding:"18px 16px",marginBottom:0}}>
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

          <Card gradient={`linear-gradient(145deg,#fff0f8,#ffe8f4)`} style={{border:`1.5px solid ${C.magenta}33`,padding:"18px 16px",marginBottom:0}}>
            <Label emoji="🌸" text="Cycle" color={C.magenta}/>
            {pi?<>
              <div style={{fontSize:30,textAlign:"center",marginBottom:6}}>{pi.icon}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontWeight:600,color:C.text,textAlign:"center",marginBottom:4}}>{pi.phase}</div>
              <div style={{fontSize:10,color:C.textLight,textAlign:"center",marginBottom:10,fontFamily:"'Josefin Sans',sans-serif"}}>Day {pi.day+1} · Next ~{pi.next}d</div>
              <div style={{display:"flex",gap:2,flexWrap:"wrap",justifyContent:"center"}}>
                {Array.from({length:pi.cycleLen},(_,i)=>(
                  <div key={i} style={{width:8,height:8,borderRadius:"50%",background:i===pi.day?C.gold:i<pi.periodLen?C.magenta:(i>=12&&i<=15)?C.goldLight:`${C.magenta}18`,boxShadow:i===pi.day?`0 0 6px ${C.gold}`:"none"}}/>
                ))}
              </div>
            </>:<div style={{color:C.textLight,fontStyle:"italic",fontSize:13,textAlign:"center",padding:"10px 0",fontFamily:"'Cormorant Garamond',serif"}}>Enter your last period date below</div>}
            <input type="date" value={period} onChange={e=>{setPeriod(e.target.value);showToast("Cycle updated ✦");}}
              style={{...inp,width:"100%",marginTop:10,fontSize:11}}/>
          </Card>
        </div>

        {/* ── EXPENSES ── */}
        <Card delay={0.6} gradient={`linear-gradient(145deg,#f8f0ff,#f0e8ff)`} style={{border:`1.5px solid ${C.violet}33`}}>
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

        {/* ── GRATITUDE — pushed down ── */}
        <Card delay={0.65} gradient={`linear-gradient(145deg,#f5fff5,#e8f8e8)`} style={{border:`1.5px solid ${C.emerald}44`}}>
          <Label emoji="🌸" text="I Am Grateful For" color={C.emerald}/>
          {["Something beautiful today...","A person I'm thankful for...","Something about myself..."].map((ph,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontFamily:"'Great Vibes',cursive",fontSize:22,color:C.gold,minWidth:20}}>{i+1}</span>
              <input type="text" placeholder={ph} value={gratitude[i]}
                onChange={e=>setGratitude(p=>{const g=[...p];g[i]=e.target.value;return g;})}
                style={{flex:1,background:"none",border:"none",borderBottom:`1.5px solid ${C.emerald}44`,padding:"6px 2px",fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.text,outline:"none"}}/>
            </div>
          ))}
        </Card>

        {/* ── CHRISTMAS COUNTDOWN ── */}
        <div style={{borderRadius:22,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.18)"}}>
          <div style={{position:"relative",overflow:"hidden",borderRadius:22,background:"#1e4d2b",padding:"28px 22px 24px"}}>
            <div style={{position:"absolute",inset:0,opacity:0.18,background:`repeating-linear-gradient(0deg,transparent,transparent 18px,#8b1a1a 18px,#8b1a1a 20px),repeating-linear-gradient(90deg,transparent,transparent 18px,#8b1a1a 18px,#8b1a1a 20px)`}}/>
            <div style={{position:"absolute",inset:0,opacity:0.10,background:`repeating-linear-gradient(0deg,transparent,transparent 54px,#ffffff 54px,#ffffff 58px),repeating-linear-gradient(90deg,transparent,transparent 54px,#ffffff 54px,#ffffff 58px)`}}/>
            <div style={{position:"absolute",top:-30,left:"50%",transform:"translateX(-50%)",width:300,height:80,background:"radial-gradient(ellipse,rgba(255,200,80,0.18) 0%,transparent 70%)",pointerEvents:"none"}}/>
            <div style={{position:"relative",zIndex:2,display:"flex",alignItems:"flex-end",justifyContent:"center",gap:0,marginBottom:20,height:36}}>
              <div style={{position:"absolute",top:8,left:"5%",right:"5%",height:"2px",background:"rgba(40,20,10,0.7)",borderRadius:1,zIndex:1}}/>
              {[{c:"#c8240c"},{c:"#1a6b2a"},{c:"#c8850c"},{c:"#c8240c"},{c:"#1a6b2a"},{c:"#c8850c"},{c:"#c8240c"},{c:"#1a6b2a"},{c:"#c8850c"},{c:"#c8240c"}].map((b,i)=>(
                <div key={i} style={{position:"relative",zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",flex:1}}>
                  <div style={{width:6,height:5,background:"rgba(40,20,10,0.8)",borderRadius:"1px 1px 0 0"}}/>
                  <div style={{width:14,height:18,borderRadius:"50% 50% 45% 45%",background:`radial-gradient(ellipse at 35% 30%,${b.c}ff,${b.c}99)`,boxShadow:`0 0 8px 3px ${b.c}88,0 0 18px 6px ${b.c}44`,animation:`bulbWarm ${2+i*0.3}s ${i*0.2}s ease-in-out infinite`}}/>
                </div>
              ))}
            </div>
            <div style={{position:"relative",zIndex:2,textAlign:"center",marginBottom:18}}>
              <div style={{fontFamily:"'Great Vibes',cursive",fontSize:42,lineHeight:1,marginBottom:6,color:"#ffe8b0",textShadow:"0 0 20px rgba(255,200,80,0.6),0 2px 4px rgba(0,0,0,0.4)"}}>Christmas</div>
              <div style={{fontSize:11,letterSpacing:4,color:"rgba(255,232,176,0.65)",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>is coming</div>
            </div>
            <div style={{position:"relative",zIndex:2,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
              {[{n:xDays,l:"Days"},{n:xHrs,l:"Hours"},{n:xMins,l:"Mins"},{n:xSecs,l:"Secs"}].map(({n,l})=>(
                <div key={l} style={{background:"rgba(10,30,10,0.55)",border:"1.5px solid rgba(139,26,26,0.5)",borderRadius:14,padding:"14px 6px",textAlign:"center",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.06)"}}>
                  <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:30,fontWeight:600,lineHeight:1,color:"#ffe8b0",textShadow:"0 0 12px rgba(255,200,80,0.5)"}}>{String(n).padStart(2,"0")}</div>
                  <div style={{fontSize:8,letterSpacing:2.5,color:"rgba(255,232,176,0.45)",textTransform:"uppercase",marginTop:5,fontFamily:"'Josefin Sans',sans-serif"}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{position:"relative",zIndex:2,textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:8,filter:"drop-shadow(0 0 8px rgba(255,200,80,0.4))"}}>🎄</div>
              <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,letterSpacing:3,color:"rgba(255,232,176,0.5)",textTransform:"uppercase",borderTop:"1px solid rgba(139,26,26,0.4)",paddingTop:10}}>Keep the change, ya filthy animal</div>
            </div>
          </div>
        </div>

      </div>{/* end container */}

      {/* ══ MODALS ══ */}
      <Modal open={intentModal} onClose={()=>setIntentModal(false)}>
        <MTitle>Today's Intention</MTitle>
        <MInput placeholder="One word. Make it powerful." value={intentInput} onChange={e=>setIntentInput(e.target.value)}/>
        <MBtns onCancel={()=>setIntentModal(false)} onSave={()=>{setIntention(intentInput.toUpperCase());setIntentModal(false);showToast("Intention set ✦");}} label="Set It ✦"/>
      </Modal>

      <Modal open={manifModal} onClose={()=>setManifModal(false)}>
        <MTitle>My Manifestations</MTitle>
        <div style={{fontSize:12,color:C.textLight,marginBottom:12,textAlign:"center",fontFamily:"'Josefin Sans',sans-serif"}}>One per line. They will rotate automatically.</div>
        <MInput placeholder={"I am magnetic and abundant.\nI am becoming who I was meant to be.\nEverything I touch turns to gold."} value={manifEdit} onChange={e=>setManifEdit(e.target.value)} multiline rows={8}/>
        <MBtns onCancel={()=>setManifModal(false)} onSave={()=>{
          const list=manifEdit.split("\n").map(l=>l.trim()).filter(l=>l.length>0);
          setManifList(list); setManifIdx(0); setManifModal(false); showToast("Manifestations saved ✦");
        }} label="Save ✦"/>
      </Modal>

      <Modal open={goalModal} onClose={()=>setGoalModal(false)}>
        <MTitle>New Moon Goal</MTitle>
        <MInput placeholder="What are you working toward?" value={goalName} onChange={e=>setGoalName(e.target.value)}/>
        <div style={{fontSize:11,letterSpacing:2,color:C.textLight,textTransform:"uppercase",marginBottom:8,fontFamily:"'Josefin Sans',sans-serif"}}>Target Date</div>
        <MInput placeholder="Target date" value={goalDate} onChange={e=>setGoalDate(e.target.value)} type="date"/>
        <MBtns onCancel={()=>setGoalModal(false)} onSave={addGoal} label="Add Goal ✦"/>
      </Modal>

      <Modal open={habitModal} onClose={()=>setHabitModal(false)}>
        <MTitle>Edit Ritual</MTitle>
        <MInput placeholder="Your ritual..." value={habitInput} onChange={e=>setHabitInput(e.target.value)}/>
        <MBtns onCancel={()=>setHabitModal(false)} onSave={()=>{setHabits(p=>{const h=[...p];h[editHIdx]=habitInput;return h;});setHabitModal(false);showToast("Ritual updated ✦");}}/>
      </Modal>

      <Modal open={mHabitModal} onClose={()=>setMHabitModal(false)}>
        <MTitle>Edit Monthly Habit</MTitle>
        <MInput placeholder="Your habit..." value={mHabitInput} onChange={e=>setMHabitInput(e.target.value)}/>
        <MBtns onCancel={()=>setMHabitModal(false)} onSave={()=>{setMHabits(p=>{const h=[...p];h[editMHIdx]=mHabitInput;return h;});setMHabitModal(false);showToast("Habit updated ✦");}}/>
      </Modal>

      <Modal open={soireeModal} onClose={()=>setSoireeModal(false)}>
        <MTitle>New Soirée ✦</MTitle>
        <MInput placeholder="Event name..." value={soireeName} onChange={e=>setSoireeName(e.target.value)}/>
        <MInput placeholder="Event date" value={soireeDate} onChange={e=>setSoireeDate(e.target.value)} type="date"/>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,letterSpacing:2,color:C.textLight,textTransform:"uppercase",marginBottom:8,fontFamily:"'Josefin Sans',sans-serif"}}>Status</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["enquiry","planning","confirmed","completed"].map(s=>(
              <button key={s} onClick={()=>setSoireeStatus(s)} style={{background:soireeStatus===s?`linear-gradient(135deg,${C.cobalt},${C.teal})`:"none",border:`1.5px solid ${soireeStatus===s?C.cobalt:C.border}`,borderRadius:20,padding:"6px 14px",fontSize:10,letterSpacing:1.5,color:soireeStatus===s?"white":C.textMid,cursor:"pointer",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>{s}</button>
            ))}
          </div>
        </div>
        <MBtns onCancel={()=>setSoireeModal(false)} onSave={addSoiree} label="Add Event ✦"/>
      </Modal>

      <Toast msg={toast}/>
    </div>
  );
}
