/* eslint-disable */
// Cảnh nền 4 giao diện phòng lab, vẽ bằng SVG (bản dự phòng khi chưa có ảnh bg-hh-*). Sinh từ mockup, chỉ là trang trí.
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k)));
  return "#" + [n >> 16, (n >> 8) & 255, n & 255].map((x) => f(x).toString(16).padStart(2, "0")).join("");
};
void shade;

const nang = `<svg class="lab-scene-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3ff"/><stop offset="1" stop-color="#e6f6ff"/></linearGradient>
<pattern id="nwp" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#fff3e3"/><circle cx="10" cy="10" r="2.2" fill="#ffd9c2"/><circle cx="30" cy="30" r="2.2" fill="#d8eedf"/></pattern>
<pattern id="ntile" width="60" height="30" patternUnits="userSpaceOnUse"><rect width="60" height="30" fill="#e9f6f1"/><rect x="1" y="1" width="58" height="13" rx="3" fill="#fff" stroke="#cfe5dc"/><rect x="-29" y="16" width="58" height="13" rx="3" fill="#fff" stroke="#cfe5dc"/><rect x="31" y="16" width="58" height="13" rx="3" fill="#fff" stroke="#cfe5dc"/></pattern>
<linearGradient id="nbeam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff7d6" stop-opacity=".75"/><stop offset="1" stop-color="#fff7d6" stop-opacity="0"/></linearGradient>
<filter id="nbl"><feGaussianBlur stdDeviation="6"/></filter></defs>
<rect width="1200" height="800" fill="url(#nwp)"/>
<rect y="380" width="1200" height="200" fill="url(#ntile)"/>
<rect x="150" y="70" width="340" height="270" rx="14" fill="#fff" stroke="#e0b98a" stroke-width="10"/>
<rect x="162" y="82" width="316" height="246" rx="6" fill="url(#nsky)"/>
<circle cx="410" cy="140" r="34" fill="#ffe27a"/><circle cx="410" cy="140" r="56" fill="#ffe27a" opacity=".3"/>
<g fill="#fff" opacity=".95"><ellipse cx="240" cy="150" rx="44" ry="16"/><ellipse cx="270" cy="138" rx="30" ry="18"/><ellipse cx="350" cy="220" rx="36" ry="12"/></g>
<path d="M162 270 Q240 230 320 262 T478 250 V328 H162Z" fill="#9fdc8a"/><path d="M162 300 Q260 270 360 300 T478 292 V328 H162Z" fill="#6cc46a"/>
<line x1="320" y1="82" x2="320" y2="328" stroke="#e0b98a" stroke-width="8"/><line x1="162" y1="205" x2="478" y2="205" stroke="#e0b98a" stroke-width="8"/>
<path d="M120 50 H200 Q190 200 210 360 H120Z" fill="#ff9f7a"/><path d="M120 50 H200 Q190 200 210 360 H120Z" fill="url(#nstripe)" opacity=".0"/>
${Array.from({length:4},(_,i)=>`<rect x="${128+i*18}" y="50" width="8" height="310" fill="#fff" opacity=".35"/>`).join('')}
<path d="M520 50 H440 Q450 200 430 360 H520Z" fill="#ff9f7a"/>${Array.from({length:4},(_,i)=>`<rect x="${448+i*18}" y="50" width="8" height="310" fill="#fff" opacity=".35"/>`).join('')}
<rect x="100" y="40" width="440" height="16" rx="8" fill="#c98a4b"/>
<rect x="140" y="342" width="360" height="16" rx="4" fill="#e0b98a"/>
<g transform="translate(190 286)"><path d="M0 56 L6 20 H54 L60 56Z" fill="#ff8a5c"/><rect x="2" y="14" width="56" height="10" rx="3" fill="#ffa982"/><path d="M30 14 Q10 -20 -6 -10 M30 14 Q30 -30 22 -40 M30 14 Q50 -24 70 -14 M30 14 Q44 -36 40 -44" stroke="#2f9e5c" stroke-width="8" fill="none" stroke-linecap="round"/></g>
<g transform="translate(400 300)"><path d="M0 42 L4 14 H40 L44 42Z" fill="#4f72ff"/><circle cx="22" cy="2" r="16" fill="#55c27a"/><circle cx="10" cy="-6" r="10" fill="#6fd98e"/><circle cx="34" cy="-4" r="11" fill="#45b26a"/></g>
<rect x="740" y="120" width="380" height="16" rx="4" fill="#c98a4b"/><rect x="740" y="134" width="380" height="6" fill="#a86d36"/>
<rect x="740" y="250" width="380" height="16" rx="4" fill="#c98a4b"/><rect x="740" y="264" width="380" height="6" fill="#a86d36"/>
${[['#ffd35a',770],['#ff9fc7',840],['#c7f0a8',910],['#f5e6c8',980],['#9b5bd6',1050]].map(([c,x],i)=>`<g transform="translate(${x} ${i%2?62:52})"><rect x="0" y="0" width="54" height="${i%2?58:68}" rx="10" fill="${c}" opacity=".85"/><rect x="0" y="0" width="54" height="${i%2?58:68}" rx="10" fill="none" stroke="#fff" stroke-width="3"/><rect x="-2" y="-10" width="58" height="12" rx="4" fill="#d9b26a"/><rect x="8" y="8" width="7" height="${i%2?40:50}" rx="3" fill="#fff" opacity=".6"/><rect x="10" y="${i%2?26:30}" width="34" height="16" rx="3" fill="#fff" opacity=".85"/></g>`).join('')}
<g transform="translate(770 186)"><circle cx="20" cy="40" r="22" fill="#ffd84d"/><ellipse cx="20" cy="40" rx="22" ry="20" fill="#ffe680"/><circle cx="62" cy="44" r="18" fill="#ffd84d"/><path d="M14 22 q6 -8 12 -4" stroke="#3a9a4a" stroke-width="4" fill="none"/></g>
<g transform="translate(880 168)"><circle cx="40" cy="44" r="40" fill="#7a3fb0"/><circle cx="40" cy="44" r="40" fill="url(#nwp)" opacity=".0"/>${Array.from({length:6},(_,i)=>`<path d="M40 44 Q${10+i*12} ${10+(i%2)*10} ${2+i*14} ${30+(i%3)*20}" stroke="#c9a4f0" stroke-width="3" fill="none"/>`).join('')}<path d="M10 30 Q40 0 70 30" stroke="#9a6ad0" stroke-width="6" fill="none"/></g>
<g transform="translate(1000 196)"><rect width="70" height="52" rx="6" fill="#fff"/><rect y="0" width="70" height="16" rx="6" fill="#4f72ff"/><rect x="10" y="24" width="50" height="6" rx="3" fill="#dbe3ff"/><rect x="10" y="34" width="34" height="6" rx="3" fill="#dbe3ff"/></g>
<g transform="translate(620 120)"><circle r="46" fill="#fff" stroke="#c98a4b" stroke-width="8"/><line x1="0" y1="0" x2="0" y2="-30" stroke="#252845" stroke-width="5" stroke-linecap="round"/><line x1="0" y1="0" x2="22" y2="8" stroke="#252845" stroke-width="5" stroke-linecap="round"/><circle r="5" fill="#ff8a5c"/></g>
<g stroke="#8a8fa8" stroke-width="3"><line x1="600" y1="250" x2="700" y2="250"/></g>${[610,640,670].map((x,i)=>`<g transform="translate(${x} 250)"><line x1="0" y1="0" x2="0" y2="20" stroke="#8a8fa8" stroke-width="3"/><path d="${i==0?'M-8 20 h16 v40 a8 8 0 0 1 -16 0z':i==1?'M0 20 v50 m-10 0 h20':'M-10 20 h20 l-4 50 h-12z'}" fill="#cfd6e8" stroke="#8a8fa8" stroke-width="2"/></g>`).join('')}
<polygon points="160,70 480,70 900,800 380,800" fill="url(#nbeam)" opacity=".55"/>
${Array.from({length:14},(_,i)=>`<circle cx="${300+i*40}" cy="${200+(i*53)%380}" r="${1.5+(i%3)}" fill="#fff" opacity=".8"/>`).join('')}
</svg>
<div class="lab-benchtop" style="background:linear-gradient(#d9a46a 0,#e8b77b 6%,#cf9558 40%,#b9824a 100%);border-top:6px solid #f2cd99;box-shadow:0 -3px 0 #a86d36 inset">
 <div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,#0000 0 140px,#8a5a2b22 140px 143px),repeating-linear-gradient(0deg,#0000 0 9px,#ffffff10 9px 10px);"></div>
 <div style="position:absolute;inset:0;background:linear-gradient(100deg,#ffffff00 20%,#fff3 32%,#fff0 44%)"></div>
</div>`;

const giakim = `<svg class="lab-scene-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
<defs><radialGradient id="gwarm" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#6b4423"/><stop offset="1" stop-color="#1d110a"/></radialGradient>
<linearGradient id="gnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1a3d"/><stop offset="1" stop-color="#2b3b72"/></linearGradient>
<filter id="gbl"><feGaussianBlur stdDeviation="8"/></filter><filter id="gbl2"><feGaussianBlur stdDeviation="22"/></filter>
<linearGradient id="gbrass" x1="0" x2="1"><stop offset="0" stop-color="#6b4a1a"/><stop offset=".4" stop-color="#f0cf7a"/><stop offset=".6" stop-color="#c9a24a"/><stop offset="1" stop-color="#5a3c12"/></linearGradient></defs>
<rect width="1200" height="800" fill="url(#gwarm)"/>
${Array.from({length:12},(_,r)=>Array.from({length:14},(_,c)=>`<rect x="${c*92-(r%2)*46}" y="${r*44}" width="88" height="40" rx="6" fill="${['#4a3020','#553824','#3f2818','#5c3d27'][(r*3+c)%4]}" opacity=".75"/>`).join('')).join('')}
<path d="M480 360 V160 A120 120 0 0 1 720 160 V360Z" fill="#2c1a0e"/><path d="M496 352 V164 A104 104 0 0 1 704 164 V352Z" fill="url(#gnight)"/>
<circle cx="650" cy="140" r="30" fill="#fff6d6"/><circle cx="662" cy="132" r="26" fill="#2b3b72" opacity=".0"/><circle cx="650" cy="140" r="60" fill="#fff6d6" opacity=".12"/>
${Array.from({length:16},(_,i)=>`<circle cx="${510+(i*53)%180}" cy="${90+(i*37)%240}" r="${1+(i%3)*.6}" fill="#fff"/>`).join('')}
<line x1="600" y1="60" x2="600" y2="352" stroke="#2c1a0e" stroke-width="10"/><line x1="496" y1="240" x2="704" y2="240" stroke="#2c1a0e" stroke-width="10"/>
<rect x="470" y="352" width="260" height="20" rx="4" fill="#6b4423"/>
${[[60,150],[60,290],[880,150],[880,290]].map(([x,y])=>`<rect x="${x}" y="${y}" width="270" height="18" rx="3" fill="#6b4423"/><rect x="${x}" y="${y+18}" width="270" height="6" fill="#3d2512"/><path d="M${x+20} ${y+24} l14 22 h-8 z M${x+236} ${y+24} l14 22 h-8 z" fill="#3d2512"/>`).join('')}
${(()=>{let h='';const cols=['#46d18a','#9b5bd6','#ff8a5c','#4fb3ff','#ffd24a','#ff4f7b'];[[70,150],[70,290],[890,150],[890,290]].forEach(([x,y],k)=>{for(let i=0;i<5;i++){const c=cols[(i+k)%6],bx=x+10+i*52,hh=40+((i+k)%3)*16;h+=`<ellipse cx="${bx+20}" cy="${y-hh/2}" rx="34" ry="${hh*.7}" fill="${c}" opacity=".25" filter="url(#gbl)"/>`;
 h+=(i%2?`<path d="M${bx+14} ${y-hh} h12 v${hh*.3} q14 6 14 ${hh*.35} v${hh*.25} q0 ${hh*.1} -10 ${hh*.1} h-20 q-10 0 -10 -${hh*.1} v-${hh*.25} q0 -${hh*.29} 14 -${hh*.35}z" fill="${c}" opacity=".85" stroke="#f6e2b8" stroke-width="2"/>`:`<path d="M${bx+15} ${y-hh} h10 v${hh*.35} a${18} ${18} 0 1 1 -10 0z" fill="${c}" opacity=".85" stroke="#f6e2b8" stroke-width="2"/>`)+`<rect x="${bx+13}" y="${y-hh-8}" width="14" height="8" rx="2" fill="#8a5a2b"/><rect x="${bx+9}" y="${y-hh*.5}" width="4" height="${hh*.35}" rx="2" fill="#fff" opacity=".55"/>`}});return h})()}
${[160,240,320].map((x,i)=>`<g transform="translate(${x} 0)"><line x1="0" y1="0" x2="0" y2="${60+i*10}" stroke="#2c1a0e" stroke-width="2"/>${Array.from({length:7},(_,j)=>`<path d="M0 ${60+i*10} q${-14+j*4} ${30+j*3} ${-10+j*3} ${56+j*2}" stroke="${['#5f8a3a','#7aa24a','#8a9a3a'][j%3]}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}<rect x="-8" y="${54+i*10}" width="16" height="10" rx="3" fill="#a7773f"/></g>`).join('')}
<g transform="translate(1000 70)"><line x1="0" y1="-70" x2="0" y2="10" stroke="#3d2512" stroke-width="3"/><path d="M-24 10 h48 l-8 60 h-32z" fill="#2c1a0e" stroke="url(#gbrass)" stroke-width="4"/><ellipse cx="0" cy="44" rx="16" ry="20" fill="#ffcf6a"/><circle cx="0" cy="44" r="70" fill="#ffb347" opacity=".22" filter="url(#gbl)"/></g>
<g transform="translate(830 430)" opacity=".95"><circle r="64" fill="none" stroke="url(#gbrass)" stroke-width="8"/><ellipse rx="64" ry="22" fill="none" stroke="url(#gbrass)" stroke-width="5" transform="rotate(25)"/><ellipse rx="22" ry="64" fill="none" stroke="url(#gbrass)" stroke-width="5" transform="rotate(25)"/><circle r="10" fill="#f0cf7a"/><rect x="-6" y="64" width="12" height="40" fill="url(#gbrass)"/></g>
${[[110,440],[1090,430]].map(([x,y])=>`<g transform="translate(${x} ${y})"><circle cx="0" cy="-34" r="90" fill="#ffb347" opacity=".25" filter="url(#gbl2)"/><rect x="-12" y="-30" width="24" height="70" rx="4" fill="#f3e2bf"/><path d="M-12 -30 q6 10 12 0 q6 12 12 0" fill="#e8d2a6"/><path d="M0 -62 Q10 -46 0 -30 Q-10 -46 0 -62Z" fill="#ffcf6a"/><path d="M0 -54 Q5 -44 0 -34 Q-5 -44 0 -54Z" fill="#fff"/></g>`).join('')}
<rect width="1200" height="800" fill="url(#gwarm)" opacity=".0"/>
${Array.from({length:20},(_,i)=>`<circle cx="${(i*97)%1200}" cy="${120+(i*61)%420}" r="${1.2+(i%3)*.8}" fill="#ffd77a" opacity="${.3+(i%4)*.15}"/>`).join('')}
</svg>
<div class="lab-benchtop" style="background:linear-gradient(#5a3a20 0,#6b4423 8%,#4a2e19 50%,#2c1a0e 100%);border-top:6px solid transparent;border-image:linear-gradient(90deg,#6b4a1a,#f0cf7a,#c9a24a,#f0cf7a,#6b4a1a) 1">
 <div style="position:absolute;inset:0;background:repeating-linear-gradient(88deg,#0000 0 70px,#00000018 70px 74px),repeating-linear-gradient(0deg,#0000 0 6px,#ffffff08 6px 7px)"></div>
 <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0,#ffb34722,#0000 60%)"></div>
</div>`;

const neon = `<svg class="lab-scene-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="nbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050a22"/><stop offset="1" stop-color="#0d1745"/></linearGradient>
<pattern id="hex" width="56" height="48" patternUnits="userSpaceOnUse"><path d="M14 0 H42 L56 24 L42 48 H14 L0 24Z" fill="none" stroke="#2fd3ff" stroke-opacity=".08" stroke-width="1.5"/></pattern>
<filter id="glw"><feGaussianBlur stdDeviation="4"/></filter><filter id="glw2"><feGaussianBlur stdDeviation="14"/></filter>
<linearGradient id="hood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2fd3ff" stop-opacity=".18"/><stop offset="1" stop-color="#2fd3ff" stop-opacity=".02"/></linearGradient></defs>
<rect width="1200" height="800" fill="url(#nbg)"/><rect width="1200" height="800" fill="url(#hex)"/>
${[0,300,600,900].map(x=>`<rect x="${x}" y="0" width="4" height="800" fill="#141d52"/>`).join('')}
<rect x="0" y="96" width="1200" height="4" fill="#ff4fd8" filter="url(#glw)"/><rect x="0" y="96" width="1200" height="2" fill="#ffb3f0"/>
<rect x="0" y="580" width="1200" height="3" fill="#2fd3ff" filter="url(#glw)"/>
<g transform="translate(400 130)"><rect width="400" height="360" rx="14" fill="#0a1240" stroke="#2a3a85" stroke-width="6"/><rect x="16" y="16" width="368" height="300" rx="8" fill="url(#hood)" stroke="#2fd3ff" stroke-opacity=".6" stroke-width="2"/><rect x="30" y="26" width="18" height="280" rx="6" fill="#fff" opacity=".08"/><rect x="60" y="26" width="6" height="280" rx="3" fill="#fff" opacity=".06"/><rect x="0" y="324" width="400" height="36" rx="6" fill="#141d52"/><rect x="20" y="334" width="120" height="14" rx="7" fill="#2fd3ff" opacity=".7" filter="url(#glw)"/><circle cx="360" cy="341" r="7" fill="#8dff6a" filter="url(#glw)"/><rect x="20" y="0" width="360" height="10" fill="#2fd3ff" opacity=".5" filter="url(#glw)"/></g>
<g transform="translate(70 150)" opacity=".95"><rect width="260" height="170" rx="12" fill="#2fd3ff" fill-opacity=".07" stroke="#2fd3ff" stroke-opacity=".6"/><path d="M20 130 L60 90 L100 110 L150 50 L200 70 L240 30" stroke="#2fd3ff" stroke-width="3" fill="none" filter="url(#glw)"/><path d="M20 130 L60 90 L100 110 L150 50 L200 70 L240 30" stroke="#bff3ff" stroke-width="1.5" fill="none"/>${Array.from({length:5},(_,i)=>`<rect x="${20+i*48}" y="146" width="30" height="8" rx="4" fill="#2fd3ff" opacity=".35"/>`).join('')}<rect x="16" y="14" width="80" height="10" rx="5" fill="#ff4fd8" opacity=".7"/></g>
<g transform="translate(880 140)"><rect width="250" height="200" rx="12" fill="#ff4fd8" fill-opacity=".05" stroke="#ff4fd8" stroke-opacity=".5"/>${Array.from({length:4},(_,r)=>Array.from({length:6},(_,c)=>`<rect x="${16+c*38}" y="${20+r*42}" width="32" height="36" rx="5" fill="${['#2fd3ff','#ff4fd8','#8dff6a','#7b6bff'][(r+c)%4]}" fill-opacity="${.12+((r*c)%3)*.1}" stroke="${['#2fd3ff','#ff4fd8','#8dff6a','#7b6bff'][(r+c)%4]}" stroke-opacity=".6"/>`).join('')).join('')}</g>
<g stroke="#2a3a85" stroke-width="14" fill="none"><path d="M0 40 H340 Q360 40 360 60 V130"/><path d="M1200 60 H860 Q840 60 840 80 V130"/></g>
<g stroke="#2fd3ff" stroke-opacity=".4" stroke-width="2" fill="none"><path d="M0 40 H340 Q360 40 360 60 V130"/><path d="M1200 60 H860 Q840 60 840 80 V130"/></g>
<circle cx="600" cy="300" r="260" fill="#2fd3ff" opacity=".06" filter="url(#glw2)"/>
${Array.from({length:24},(_,i)=>`<circle cx="${(i*131)%1200}" cy="${110+(i*71)%460}" r="${1+(i%3)*.6}" fill="${i%3?'#2fd3ff':'#ff4fd8'}" opacity=".7"/>`).join('')}
</svg>
<div class="lab-benchtop" style="background:linear-gradient(#0b1236 0,#060a22 30%,#03061a 100%);border-top:3px solid #2fd3ff;box-shadow:0 -8px 30px #2fd3ff55,inset 0 10px 30px #2fd3ff22">
 <div style="position:absolute;inset:0;background:linear-gradient(100deg,#fff0 25%,#ffffff0c 35%,#fff0 45%)"></div>
 <div style="position:absolute;left:0;right:0;bottom:0;height:10px;background:linear-gradient(90deg,#ff4fd8,#2fd3ff,#8dff6a);opacity:.5;filter:blur(3px)"></div>
</div>`;

const phantu = `<svg class="lab-scene-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="pw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7faff"/><stop offset="1" stop-color="#e3ebf7"/></linearGradient>
<linearGradient id="psky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0ff"/><stop offset="1" stop-color="#eaf4ff"/></linearGradient>
<radialGradient id="atomR" cx=".35" cy=".3"><stop offset="0" stop-color="#ffd0d0"/><stop offset=".5" stop-color="#ff5b5b"/><stop offset="1" stop-color="#b52a2a"/></radialGradient>
<radialGradient id="atomW" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#e8eef8"/><stop offset="1" stop-color="#9db4e0"/></radialGradient>
<radialGradient id="atomB" cx=".35" cy=".3"><stop offset="0" stop-color="#b3d1ff"/><stop offset=".5" stop-color="#3a7bff"/><stop offset="1" stop-color="#1d4bb5"/></radialGradient>
<radialGradient id="atomK" cx=".35" cy=".3"><stop offset="0" stop-color="#8a93a8"/><stop offset=".5" stop-color="#3b4256"/><stop offset="1" stop-color="#1b2030"/></radialGradient>
<filter id="pbl"><feGaussianBlur stdDeviation="10"/></filter><filter id="pbl2"><feGaussianBlur stdDeviation="2.5"/></filter></defs>
<rect width="1200" height="800" fill="url(#pw)"/>
${Array.from({length:9},(_,i)=>`<line x1="${i*150}" y1="0" x2="${i*150}" y2="800" stroke="#d6e0ef" stroke-width="2"/>`).join('')}
<rect x="0" y="0" width="1200" height="40" fill="#eef3fb"/>${[200,600,1000].map(x=>`<rect x="${x-90}" y="16" width="180" height="12" rx="6" fill="#fff"/><rect x="${x-90}" y="28" width="180" height="60" fill="#fff" opacity=".35" filter="url(#pbl)"/>`).join('')}
<g transform="translate(60 120)"><rect width="460" height="300" rx="10" fill="url(#psky)" stroke="#c9d8f2" stroke-width="8"/>
${[[20,120,50],[80,90,40],[130,150,60],[200,70,46],[260,130,40],[310,100,56],[380,140,50]].map(([x,h,w])=>`<rect x="${x}" y="${292-h-60}" width="${w}" height="${h+60}" fill="#b9cbe6"/>${Array.from({length:Math.floor(h/20)},(_,k)=>`<rect x="${x+8}" y="${292-h-50+k*20}" width="${w-16}" height="6" fill="#dbe7f8"/>`).join('')}`).join('')}
<line x1="230" y1="0" x2="230" y2="300" stroke="#c9d8f2" stroke-width="6"/><rect x="30" y="10" width="40" height="280" fill="#fff" opacity=".35"/><rect x="250" y="10" width="20" height="280" fill="#fff" opacity=".3"/></g>
<g transform="translate(860 250)"><g stroke="#9db4e0" stroke-width="10" stroke-linecap="round"><line x1="0" y1="0" x2="-110" y2="-70"/><line x1="0" y1="0" x2="120" y2="-60"/><line x1="0" y1="0" x2="10" y2="120"/><line x1="10" y1="120" x2="-80" y2="170"/><line x1="10" y1="120" x2="110" y2="160"/></g>
<circle r="54" fill="url(#atomK)"/><circle cx="-110" cy="-70" r="40" fill="url(#atomR)"/><circle cx="120" cy="-60" r="32" fill="url(#atomW)"/><circle cx="10" cy="120" r="46" fill="url(#atomB)"/><circle cx="-80" cy="170" r="30" fill="url(#atomW)"/><circle cx="110" cy="160" r="30" fill="url(#atomW)"/>
<ellipse cx="0" cy="250" rx="160" ry="16" fill="#3a7bff" opacity=".12" filter="url(#pbl)"/></g>
<g transform="translate(600 130)"><rect width="190" height="130" rx="12" fill="#fff" stroke="#c9d8f2" stroke-width="3"/><rect x="14" y="14" width="80" height="10" rx="5" fill="#3a7bff"/>${Array.from({length:7},(_,i)=>`<rect x="${18+i*24}" y="${110-((i*37)%60)-20}" width="14" height="${(i*37)%60+20}" rx="3" fill="${i%2?'#3fd0c9':'#3a7bff'}" opacity=".85"/>`).join('')}</g>
<g transform="translate(590 300)" stroke="#9aa9c4" stroke-width="16" stroke-linecap="round" fill="none"><path d="M0 0 V80 L60 120"/><circle cx="0" cy="0" r="14" fill="#fff" stroke="#c9d8f2" stroke-width="6"/><circle cx="0" cy="80" r="12" fill="#fff" stroke="#c9d8f2" stroke-width="6"/><path d="M60 120 v40" stroke="#3a7bff" stroke-width="8"/></g>
</svg>
<div class="lab-benchtop" style="background:linear-gradient(#ffffff 0,#eef3fa 10%,#dfe7f2 60%,#cdd8e8 100%);border-top:4px solid #ffffff;box-shadow:0 -1px 0 #c9d8f2,0 -10px 30px #3a7bff14">
 <div style="position:absolute;inset:0;background:linear-gradient(100deg,#fff0 20%,#ffffffaa 30%,#fff0 40%)"></div>
 <div style="position:absolute;left:0;right:0;top:12%;height:3px;background:#3a7bff33"></div>
</div>`;


export const SCENE_HTML: Record<"nang" | "giakim" | "neon" | "phantu", string> = { nang, giakim, neon, phantu };
