const projects = [
  {id:'linla',name:'Linla',location:'Surry Hills',type:'Hospitality',year:'2026',subtitle:'Modern social dining bar',image:0,detail:'A quiet conversation between light, shadow and the social ritual of dining.',services:['Concept & branding design','Design documentation','CDC approval documentation']},
  {id:'barsumi-regentplace',name:'Bar Sumi',location:'Regent Place',type:'Hospitality',year:'2024',subtitle:'Cocktail bar',image:2,detail:'An intimate world of warm material, low light and evening atmosphere.',services:['Concept & branding design','Design documentation & RDM approval','CDC approval documentation','On-site management & construction review']},
  {id:'yebisu',name:'Yebisu',location:'Regent Place',type:'Hospitality',year:'2026',subtitle:'Authentic Japanese izakaya',image:0,detail:'Lantern light, layered textures and the energy of gathering around a table.',services:['Concept & branding design','Design documentation & RDM approval','CDC approval documentation','Construction documentation','On-site management & construction review']},
  {id:'arcticwhite-westfieldsydney',name:'Arctic White',location:'Westfield Sydney',type:'Retail',year:'2024',subtitle:'Bubble tea shop',image:2,detail:'Soft curves and a bright material palette give a daily ritual its own sense of place.',services:['Concept & branding design','Design documentation & RDM approval','CDC approval documentation','On-site management & construction review']},
  {id:'sakusushi-tramsheds',name:'Saku Sushi',location:'Tramsheds',type:'Hospitality',year:'2025',subtitle:'Sushi restaurant',image:1,detail:'A place for everyday encounters within the generous volume of the Tramsheds.',services:['Concept & branding design','Design documentation & RDM approval','DA & CDC approval documentation','Construction documentation','On-site management & construction review']},
  {id:'lumiere-apartment-sydney',name:'Lumiere Apartment',location:'Sydney',type:'Residential',year:'2024',subtitle:'Home renovation',image:2,detail:'Warm timber, considered details and a sense of calm. A personal place to return to.',services:['Concept design','Design documentation','Construction documentation','On-site management & construction review']},
  {id:'koko-amusement-chinatown',name:'Koko Amusement',location:'Haymarket',type:'Leisure',year:'2025',subtitle:'Amusement centre',image:2,detail:'A bold interplay of colour, light and play.',services:['Concept & branding design','Design documentation & RDM approval','CDC approval documentation','Construction documentation','On-site management & construction review']},
  {id:'violet-lab-by-k',name:'Violet Lab by K',location:'Cosmetics & lifestyle boutique',type:'Retail',year:'2022',subtitle:'Cosmetics & lifestyle boutique retailer',image:3,detail:'A laboratory-inspired interior where transparent purple, clean lines and lighting guide discovery.',services:['Concept & branding design','Design documentation & RDM approval','CDC approval documentation','Design management & construction review']}
];
const $ = (s,scope=document) => scope.querySelector(s);
const $$ = (s,scope=document) => [...scope.querySelectorAll(s)];
const number = n => String(n).padStart(2,'0');
const imageURL = (p,i=p.image) => `assets/${p.id}-${i}.webp`;
let filter='all', currentView='gallery', selectedProject=0, slide=0;

function renderProjects(){
  const selection=projects.map((p,i)=>({...p,index:i})).filter(p=>filter==='all'||p.type===filter);
  $('#project-gallery').classList.toggle('filtered',filter!=='all');
  $('#project-gallery').innerHTML=selection.map(p=>`<button class="project-card" data-project="${p.index}" aria-label="View ${p.name}, ${p.location}"><span class="project-number">DDO / ${number(p.index+1)}</span><div class="project-image"><img src="${imageURL(p)}" alt="${p.name} interior, ${p.location}" loading="lazy" decoding="async"><span class="project-view">VIEW ↗</span></div><div class="project-meta"><span><span class="project-title">${p.name}</span><span class="project-location">${p.location.toUpperCase()}</span></span><span>${p.type.toUpperCase()}<br>${p.year}</span></div></button>`).join('');
  $('#index-rows').innerHTML=selection.map(p=>`<button class="index-row" data-project="${p.index}" aria-label="View ${p.name}, ${p.location}"><span class="index-title">${p.name}<span class="index-location">${p.location.toUpperCase()}</span></span><span class="micro">${p.type}</span><span class="micro">${p.year}</span><span class="index-arrow">↗</span><img class="index-thumb" src="${imageURL(p)}" alt="" loading="lazy"></button>`).join('');
  $('#project-count').textContent=`SHOWING ${number(selection.length)} ${selection.length===1?'SPACE':'SPACES'}`;
}
renderProjects();
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.filter;
  $$('[data-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});
  renderProjects();
}));
$$('[data-view]').forEach(button=>button.addEventListener('click',()=>{
  currentView=button.dataset.view;
  $$('[data-view]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});
  $('#project-gallery').hidden=currentView!=='gallery';$('#project-index').hidden=currentView!=='index';
}));
document.addEventListener('click',e=>{const card=e.target.closest('[data-project]');if(card)openProject(Number(card.dataset.project))});

const heroProjects=[1,0,5];
function setSlide(i){
  slide=i;$$('.hero-image').forEach((im,n)=>im.classList.toggle('active',n===i));
  $$('[data-slide]').forEach((button,n)=>{button.classList.toggle('active',i===n);button.setAttribute('aria-pressed',i===n)});
  $('#slide-number').textContent=number(i+1);
  const p=projects[heroProjects[i]];
  $('#hero-project-name').innerHTML=`${p.name}, ${p.location} <span>↗</span>`;
  $('#hero-project>.micro').textContent=`IN FOCUS / ${number(i+1)}`;
}
$$('[data-slide]').forEach(button=>button.addEventListener('click',()=>setSlide(Number(button.dataset.slide))));
$('#hero-project').addEventListener('click',()=>openProject(heroProjects[slide]));

const header=$('#header'), menu=$('#mobile-menu'), menuButton=$('.menu-trigger');
function updateHeader(){header.classList.toggle('scrolled',window.scrollY>60||!menu.hidden)}
window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
function syncLock(){document.body.classList.toggle('locked',!!$('dialog[open]')||!menu.hidden)}
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');syncLock();updateHeader()}
menuButton.addEventListener('click',()=>{const opening=menu.hidden;menu.hidden=!opening;menuButton.setAttribute('aria-expanded',opening);menuButton.setAttribute('aria-label',opening?'Close menu':'Open menu');syncLock();updateHeader()});
$$('a',menu).forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden)closeMenu()});
window.addEventListener('resize',()=>{if(innerWidth>700&&!menu.hidden)closeMenu()});

const projectDialog=$('#project-dialog'), spatialDialog=$('#spatial-dialog');
let returnToSpatial=false;
function projectMarkup(p){
  const photos=[0,1,2,3];
  if(p.id==='violet-lab-by-k')photos.splice(0,4,3,2,0,1);
  return `<div class="project-detail-intro"><div><p class="micro">DDO / ${number(selectedProject+1)} — ${p.type.toUpperCase()} / ${p.year}</p><h2 id="project-detail-title">${p.name}</h2><p class="detail-location">${p.location}</p></div><div class="detail-info"><p>${p.detail}</p><span class="micro">${p.subtitle.toUpperCase()}</span><ul>${p.services.map(s=>`<li>${s}</li>`).join('')}</ul></div></div><div class="detail-gallery">${photos.map((i,n)=>`<img src="${imageURL(p,i)}" alt="${p.name} — interior view ${n+1}" ${n>0?'loading="lazy"':''}>`).join('')}</div><div class="project-detail-footer"><a href="https://ddesignoffice.com/${p.id}" target="_blank" rel="noopener">VIEW ORIGINAL PROJECT ↗</a><button id="next-project">Next: ${projects[(selectedProject+1)%projects.length].name} ↗</button></div>`;
}
function renderProject(){const p=projects[selectedProject];$('#project-dialog-body').innerHTML=projectMarkup(p);projectDialog.setAttribute('aria-labelledby','project-detail-title');projectDialog.scrollTop=0;$('#next-project').addEventListener('click',()=>{selectedProject=(selectedProject+1)%projects.length;renderProject()})}
function openProject(index){
  selectedProject=index;
  if(spatialDialog.open){returnToSpatial=true;spatialDialog.close()}
  renderProject();if(!projectDialog.open)projectDialog.showModal();syncLock();
}
$('#close-project').addEventListener('click',()=>projectDialog.close());
$$('[data-close-project]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();projectDialog.close()}));
projectDialog.addEventListener('close',()=>{syncLock();if(returnToSpatial){returnToSpatial=false;openSpatial()}});
projectDialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();selectedProject=(selectedProject+1)%projects.length;renderProject()}if(e.key==='ArrowLeft'){e.preventDefault();selectedProject=(selectedProject+projects.length-1)%projects.length;renderProject()}});

// Each project is a physical plane. Scroll and drag change the camera position.
let spatialPosition=2, spatialTarget=2, spatialRAF=0, previousActive=-1;
const track=$('#spatial-track'),stage=$('#spatial-stage'),reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
track.innerHTML=projects.map((p,i)=>`<button class="spatial-card" data-name="${p.name.toUpperCase()}" aria-label="Open ${p.name}" data-spatial-project="${i}"><img src="${imageURL(p)}" alt="${p.name} interior" draggable="false" loading="lazy"></button>`).join('');
const spatialCards=$$('.spatial-card');
function spatialPaint(){
  const mobile=innerWidth<=700,spacing=mobile?115:190;
  spatialCards.forEach((card,i)=>{
    const r=i-spatialPosition, x=r*spacing+(mobile?20:250), y=-r*(mobile?40:65), z=-Math.abs(r)*(mobile?45:70);
    card.style.transform=`translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px) rotateY(-32deg) rotateZ(-5deg)`;
    card.style.zIndex=String(100-Math.round(Math.abs(r)*10));
    card.style.filter=`brightness(${Math.max(.62,1-Math.abs(r)*.075)})`;
    card.classList.toggle('active',i===Math.round(spatialPosition));
  });
  const current=Math.max(0,Math.min(projects.length-1,Math.round(spatialPosition)));
  if(previousActive!==current){previousActive=current;$('#spatial-counter').textContent=`${number(current+1)} / ${number(projects.length)}`;$('#spatial-open').innerHTML=`${projects[current].name} <span>↗</span>`}
  $('#spatial-prev').disabled=spatialTarget<=0;$('#spatial-next').disabled=spatialTarget>=projects.length-1;
}
function spatialAnimate(){
  spatialRAF=0;
  if(!spatialDialog.open)return;
  spatialPosition=reduceMotion.matches?spatialTarget:spatialPosition+(spatialTarget-spatialPosition)*.12;
  if(Math.abs(spatialTarget-spatialPosition)<.002)spatialPosition=spatialTarget;
  spatialPaint();
  if(spatialPosition!==spatialTarget)spatialRAF=requestAnimationFrame(spatialAnimate);
}
function moveSpatial(value){spatialTarget=Math.max(0,Math.min(projects.length-1,value));if(!spatialRAF)spatialRAF=requestAnimationFrame(spatialAnimate)}
function openSpatial(){closeMenu();if(!spatialDialog.open)spatialDialog.showModal();syncLock();spatialPaint();if(!spatialRAF)spatialRAF=requestAnimationFrame(spatialAnimate)}
$$('[data-spatial]').forEach(button=>button.addEventListener('click',openSpatial));
$('#close-spatial').addEventListener('click',()=>spatialDialog.close());
spatialDialog.addEventListener('close',()=>{syncLock();cancelAnimationFrame(spatialRAF);spatialRAF=0});
$('#spatial-prev').addEventListener('click',()=>moveSpatial(Math.round(spatialTarget)-1));
$('#spatial-next').addEventListener('click',()=>moveSpatial(Math.round(spatialTarget)+1));
$('#spatial-open').addEventListener('click',()=>openProject(Math.round(spatialPosition)));
stage.addEventListener('wheel',e=>{e.preventDefault();moveSpatial(spatialTarget+(e.deltaY+e.deltaX)*.0025)},{passive:false});
spatialDialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();moveSpatial(Math.round(spatialTarget)+1)}if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();moveSpatial(Math.round(spatialTarget)-1)}});
let dragging=false,dragged=false,startX=0,startY=0,startPosition=0,pointerProject=null;
stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;dragged=false;startX=e.clientX;startY=e.clientY;startPosition=spatialTarget;pointerProject=e.target.closest('[data-spatial-project]');stage.setPointerCapture(e.pointerId)});
stage.addEventListener('pointermove',e=>{if(!dragging)return;const delta=(startX-e.clientX)+(e.clientY-startY)*.7;if(Math.abs(delta)>5)dragged=true;if(dragged)moveSpatial(startPosition+delta/(innerWidth<=700?130:210))});
stage.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);if(!dragged&&pointerProject)openProject(Number(pointerProject.dataset.spatialProject));else moveSpatial(Math.round(spatialTarget));pointerProject=null});
stage.addEventListener('pointercancel',()=>{dragging=false;pointerProject=null;moveSpatial(Math.round(spatialTarget))});
spatialCards.forEach(card=>card.addEventListener('click',e=>{if(e.detail===0)openProject(Number(card.dataset.spatialProject))}));
window.addEventListener('resize',()=>{if(spatialDialog.open)spatialPaint()});

const enquiryDialog=$('#enquiry-dialog');
$('#open-enquiry').addEventListener('click',()=>{enquiryDialog.showModal();syncLock()});
$('#close-enquiry').addEventListener('click',()=>enquiryDialog.close());
enquiryDialog.addEventListener('close',syncLock);
$('#enquiry-form').addEventListener('submit',e=>{
  e.preventDefault();const data=new FormData(e.currentTarget);
  const subject=`Project enquiry — ${data.get('type')} — ${data.get('name')}`;
  const body=`Hello D Design Office,\n\n${data.get('message')}\n\nType of space: ${data.get('type')}\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\nLooking forward to hearing from you.`;
  location.href=`mailto:info@ddesignoffice.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  toast('Your project brief is ready in your email app.');
});
let toastTimer;
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3500)}
$('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('info@ddesignoffice.com');toast('Email address copied.')}catch{toast('info@ddesignoffice.com')}});
$('#copyright-year').textContent=String(new Date().getFullYear());
