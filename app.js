// بوابة الحضور - السيم الرابع - تنفيذ فاطمة
const doctorsDB = {
  "WALEED01": {name:"أ. وليد البرغثي", subjects:["البرمجة المرئية","مقدمة في برمجة الانترنت"], time:"08:30 - 10:00"},
  "RANIA02": {name:"د. رانيا", subjects:["اللغة الانجليزية"], time:"10:00 - 11:00"},
  "AIDA03": {name:"د. عايدة زقوزي", subjects:["تراكيب بيانات وخوارزميات"], time:"11:00 - 12:30"},
  "MASOUD04": {name:"د. مسعود بالغني", subjects:["هندسة البرمجيات","ADO.NET"], time:"12:30 - 02:00"},
  "WIJDAN05": {name:"د. وجدان", subjects:["منهجية بحث"], time:"02:00 - 03:30"}
};

// جدول الاسبوع - انتي تقدري تغيري المواد لكل يوم من هنا
const weeklySchedule = {
  "السبت": ["WALEED01", "RANIA02"],
  "الأحد": ["AIDA03", "MASOUD04"],
  "الاثنين": ["WALEED01", "WIJDAN05"],
  "الثلاثاء": ["AIDA03", "RANIA02"],
  "الأربعاء": ["MASOUD04", "WALEED01"],
  "الخميس": ["WIJDAN05", "AIDA03"],
  "الجمعة": []
};

const motivations = [
  "🌟 أهلا بك يا فاطمة ويا طلاب السيم الرابع، نتمنى لكم يوم موفق!",
  "💪 كل محاضرة تحضرها اليوم تقربك من التخرج!",
  "🚀 يوم جديد وفرصة جديدة للابداع!",
  "📚 حضورك اليوم هو نجاحك غدا!",
  "✨ خليك متفائل، انت قدها!"
];

const now = new Date();
const dayName = now.toLocaleDateString('ar-LY', {weekday:'long'});
const todayKey = now.toLocaleDateString('ar-LY');
const todayLong = now.toLocaleDateString('ar-LY',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

function getAttendance(){ return JSON.parse(localStorage.getItem('attendance')||'{}'); }
function saveAttendance(d){ localStorage.setItem('attendance', JSON.stringify(d)); }

function renderStudentPage(){
  const table = document.getElementById('studentTable');
  if(!table) return;

  document.getElementById('today').innerText = todayLong;
  document.getElementById('dayName').innerText = `📅 جدول اليوم: ${dayName}`;
  document.getElementById('motivation').innerText = motivations[new Date().getDate() % motivations.length];

  const data = getAttendance()[todayKey] || {};
  const codes = weeklySchedule[dayName] || weeklySchedule["الاثنين"]; // لو الاسم اختلف

  if(codes.length === 0){
    table.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; font-size:20px;">🎉 اليوم ${dayName} عطلة - استمتع بيومك!</td></tr>`;
    document.getElementById('cPresent').innerText = 0;
    document.getElementById('cGhayeb').innerText = 0;
    document.getElementById('cPending').innerText = 0;
    return;
  }

  table.innerHTML = "";
  let p=0,g=0,pe=0;
  codes.forEach(code=>{
    const doc = doctorsDB[code];
    const att = data[code];
    const status = att?.status || "لم يحدد بعد";
    const note = att?.note || "-";
    let cls = status=="حاضر"?"hader":status=="غايب"?"ghayeb":"pending";
    if(status=="حاضر") p++; else if(status=="غايب") g++; else pe++;
    table.innerHTML += `<tr><td>${doc.time}</td><td>${doc.subjects.join('<br>')}</td><td>${doc.name}</td><td><span class="badge ${cls}">${status}</span></td><td>${note}</td></tr>`;
  });
  document.getElementById('cPresent').innerText = p;
  document.getElementById('cGhayeb').innerText = g;
  document.getElementById('cPending').innerText = pe;
}

function initDoctorPage(){
  if(!document.getElementById('docName')) return;
  document.getElementById('today1').innerText = todayLong;
  const code = localStorage.getItem('currentDoctor');
  if(!code ||!doctorsDB[code]) { location.href="index.html"; return; }
  const doc = doctorsDB[code];
  document.getElementById('docName').innerText = doc.name;
  document.getElementById('docSubjects').innerHTML = doc.subjects.map(s=>`<span class="subject">${s}</span>`).join('');
  document.getElementById('docTime').innerText = doc.time;
}
function setStatus(s){
  const code = localStorage.getItem('currentDoctor');
  const note = document.getElementById('note').value;
  let all = getAttendance();
  all[todayKey] = all[todayKey] || {};
  all[todayKey][code] = {status:s, note, time: new Date().toLocaleTimeString('ar-LY')};
  saveAttendance(all);
  document.getElementById('msg').innerText = `✅ تم التسجيل: ${s}`;
}
function logout(){ localStorage.removeItem('currentDoctor'); location.href="index.html"; }

document.addEventListener('DOMContentLoaded', ()=>{ renderStudentPage(); initDoctorPage(); });