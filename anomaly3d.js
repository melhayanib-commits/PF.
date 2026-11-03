/* Món obert: Observació — lanzador. El importmap de Three.js está fijo en index.html (#pf-importmap). */
(()=>{'use strict';
const files=['game3d/main.js','game3d/core.js','game3d/rooms.js','game3d/nav.js','game3d/station.js','game3d/models.js','game3d/audio.js','game3d/controls.js'];
async function preflight(){
 const map=JSON.parse(document.querySelector('#pf-importmap').textContent).imports;
 const urls=files.map(f=>new URL(f,document.baseURI).href).concat([map['three'],map['three/addons/']+'loaders/GLTFLoader.js',map['three/addons/']+'utils/BufferGeometryUtils.js']);
 const bad=[];await Promise.all(urls.map(async u=>{try{const r=await fetch(u,{cache:'no-cache'});if(!r.ok)bad.push(`${u} → HTTP ${r.status}`)}catch(e){bad.push(`${u} → no se pudo descargar (${e.message})`)}}));
 if(bad.length)throw new Error('Faltan archivos:\n'+bad.join('\n'));
}
document.addEventListener('click',async e=>{
 const t=e.target;if(!t||!t.closest||!t.closest('#launch-game'))return;
 if(document.querySelector('.mode-card.selected')?.dataset.mode!=='anomaly')return;
 e.preventDefault();e.stopImmediatePropagation();if(window.__pfAnomActive)return;
 const menu=document.querySelector('#game-menu'),container=document.querySelector('#game-container');
 try{await preflight();const mod=await import(new URL('game3d/main.js',document.baseURI).href);await mod.launchGame({menu,container,importInfo:{source:'CDN jsDelivr three@0.170.0'}})}
 catch(err){console.error('[Món obert]',err);menu.classList.add('hidden');container.classList.remove('hidden');
  container.innerHTML='<div style="padding:20px;background:#2a0907;border:1px solid #ff5a4d;border-radius:14px;color:#ffe3df"><b>No se pudo iniciar Món obert: Observació.</b><br><small style="white-space:pre-wrap;word-break:break-all"></small><br><br><button class="btn btn-primary" id="anom-err-back">Volver al menú</button></div>';
  container.querySelector('small').textContent=String(err&&err.message||err);
  container.querySelector('#anom-err-back').onclick=()=>{container.innerHTML='';container.classList.add('hidden');menu.classList.remove('hidden')}}
},true);
})();
