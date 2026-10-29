const $=(s,scope=document)=>scope.querySelector(s);
const $$=(s,scope=document)=>[...scope.querySelectorAll(s)];
const pad=(n,width=2)=>String(n).padStart(width,'0');
const photo=(p,n=p.image)=>`assets/${p.id}-${n}.webp`;
let filter='all',view='wall';
function renderCollection(){
  const works=projects.map((p,index)=>({...p,index})).filter(p=>filter==='all'||p.type===filter);
  $('#collection-wall').classList.toggle('filtered',filter!=='all');
  $('#collection-wall').innerHTML=works.map(p=>`<button class="work-card" data-room="${p.index}" aria-label="Enter ${p.name} viewing room"><span class="work-number">DDO / ${pad(p.index+1,3)}</span><div class="work-frame"><img src="${photo(p)}" alt="${p.name} interior" loading="lazy" decoding="async"></div><div class="work-caption"><h3 class="work-title">${p.name}</h3><span class="work-year">${p.year}</span><span class="work-place">${p.location}</span></div></button>`).join('');
  $('#register-rows').innerHTML=works.map(p=>`<button class="register-row" data-room="${p.index}" aria-label="Enter ${p.name} viewing room"><span><span>${pad(p.index+1,3)}</span>${p.name}</span><span class="micro">${p.location}</span><span class="micro">${p.year}</span><span>↗</span><img class="register-thumb" src="${photo(p)}" alt="" loading="lazy"></button>`).join('');
  $('#collection-count').textContent=filter==='all'?'001 — 008':`${pad(works.length,3)} / 008 WORKS`;
}
renderCollection();
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.filter;
  $$('[data-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});renderCollection();
}));
$$('[data-view]').forEach(button=>button.addEventListener('click',()=>{
  view=button.dataset.view;
  $$('[data-view]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  $('#collection-wall').hidden=view!=='wall';$('#collection-register').hidden=view!=='register';
}));
const featured=[{index:0,image:0,note:'A STUDY IN<br>LIGHT & GATHERING'},{index:1,image:1,note:'A STUDY IN<br>SHADOW & RITUAL'},{index:5,image:2,note:'A STUDY IN<br>MATERIAL & THE EVERYDAY'}];
let feature=0;
function renderFeature(){
  const f=featured[feature],p=projects[f.index],img=$('#feature-photo');
  img.src=photo(p,f.image);img.alt=`${p.name}, ${p.location} — interior study`;
  $('#featured-image').setAttribute('aria-label',`Enter the ${p.name} exhibition`);
  $('#feature-number').textContent=`WORK ${pad(f.index+1,3)}`;$('#feature-name').textContent=p.name;
  $('#feature-location').textContent=`${p.location.toUpperCase()} / ${p.year}`;$('.feature-caption').innerHTML=f.note;$('#feature-count').textContent=pad(feature+1);
}
$('#feature-prev').addEventListener('click',()=>{feature=(feature+featured.length-1)%featured.length;renderFeature()});
$('#feature-next').addEventListener('click',()=>{feature=(feature+1)%featured.length;renderFeature()});
$('#featured-image').addEventListener('click',()=>openRoom(featured[feature].index,featured[feature].image));

const roomDialog=$('#room-dialog'),infoDialog=$('#info-dialog');
let roomIndex=0,photoIndex=0,isDark=false;
function lock(){document.body.classList.toggle('locked',!!$('dialog[open]'))}
$('#room-plan').innerHTML=projects.map((p,i)=>`<button data-choose-room="${i}" aria-label="Room ${pad(i+1)}: ${p.name}" aria-pressed="false"><span></span></button>`).join('');
function renderPhotograph(){
  const p=projects[roomIndex],image=$('#room-photo');image.src=photo(p,photoIndex);image.alt=`${p.name}, ${p.location} — photograph ${photoIndex+1} of 4`;
  $('#photo-number').textContent=`${pad(photoIndex+1)} / 04`;
  $('#room-status').textContent=`Room ${roomIndex+1} of ${projects.length}. ${p.name}, ${p.location}, ${p.year}. Photograph ${photoIndex+1} of 4.`;
}
function renderRoom(){
  const p=projects[roomIndex];$('#wall-number').textContent=pad(roomIndex+1);$('#room-number').textContent=`WORK ${pad(roomIndex+1,3)} / 008`;$('#room-title').textContent=p.name;$('#room-meta').textContent=`${p.location}, ${p.year}`;$('#room-note').textContent=p.detail;
  $('#room-deliverables').innerHTML=`<p class="micro" style="margin-top:15px">${p.subtitle.toUpperCase()}<br>INTERIOR DESIGN / D DESIGN OFFICE</p><a href="https://ddesignoffice.com/${p.id}" target="_blank" rel="noopener">ORIGINAL PROJECT ↗</a>`;
  $('#room-deliverables').hidden=true;$('#room-details').setAttribute('aria-expanded','false');$('#room-details').innerHTML='Exhibition notes <span>+</span>';
  $$('[data-choose-room]').forEach((b,i)=>{b.classList.toggle('active',i===roomIndex);b.setAttribute('aria-pressed',String(i===roomIndex))});
  $('#room-prev').setAttribute('aria-label',`Previous space: ${projects[(roomIndex+projects.length-1)%projects.length].name}`);
  $('#room-next').setAttribute('aria-label',`Next space: ${projects[(roomIndex+1)%projects.length].name}`);
  $('.room-scene').scrollTop=0;$('.wall-label').scrollTop=0;renderPhotograph();
}
function openRoom(index,initialPhoto){roomIndex=index;photoIndex=initialPhoto??projects[index].image;renderRoom();if(!roomDialog.open)roomDialog.showModal();lock()}
function changeRoom(direction){roomIndex=(roomIndex+direction+projects.length)%projects.length;photoIndex=projects[roomIndex].image;renderRoom()}
function changePhoto(direction){photoIndex=(photoIndex+direction+4)%4;renderPhotograph()}
$('#close-room').addEventListener('click',()=>roomDialog.close());
roomDialog.addEventListener('close',lock);
$('#photo-prev').addEventListener('click',()=>changePhoto(-1));$('#photo-next').addEventListener('click',()=>changePhoto(1));
$('#room-prev').addEventListener('click',()=>changeRoom(-1));$('#room-next').addEventListener('click',()=>changeRoom(1));
$('#toggle-light').addEventListener('click',()=>{isDark=!isDark;roomDialog.classList.toggle('dark',isDark);$('#toggle-light').setAttribute('aria-pressed',String(isDark));$('#toggle-light').innerHTML=`Lights ${isDark?'off':'on'} <span>●</span>`});
$('#room-details').setAttribute('aria-expanded','false');$('#room-details').setAttribute('aria-controls','room-deliverables');
$('#room-details').addEventListener('click',()=>{const opening=$('#room-deliverables').hidden;$('#room-deliverables').hidden=!opening;$('#room-details').setAttribute('aria-expanded',String(opening));$('#room-details').innerHTML=`Exhibition notes <span>${opening?'−':'+'}</span>`});
roomDialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();changePhoto(-1)}if(e.key==='ArrowRight'){e.preventDefault();changePhoto(1)}if(e.key==='PageDown'||e.key==='ArrowDown'){e.preventDefault();changeRoom(1)}if(e.key==='PageUp'||e.key==='ArrowUp'){e.preventDefault();changeRoom(-1)}});
let touchStart=null;
$('.room-frame').addEventListener('pointerdown',e=>{if(e.pointerType==='touch')touchStart={x:e.clientX,y:e.clientY}});
$('.room-frame').addEventListener('pointerup',e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))changePhoto(dx<0?1:-1);touchStart=null});
$('.room-frame').addEventListener('pointercancel',()=>{touchStart=null});
document.addEventListener('click',e=>{const work=e.target.closest('[data-room]');if(work)openRoom(Number(work.dataset.room));const plan=e.target.closest('[data-choose-room]');if(plan){roomIndex=Number(plan.dataset.chooseRoom);photoIndex=projects[roomIndex].image;renderRoom()}});
$$('[data-info]').forEach(button=>button.addEventListener('click',()=>{infoDialog.showModal();infoDialog.scrollTop=0;lock()}));
$('#close-info').addEventListener('click',()=>infoDialog.close());infoDialog.addEventListener('close',lock);
$('#year').textContent=String(new Date().getFullYear());
