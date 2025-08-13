const CONFIG={whatsappNumber:'+212600000000',apiEndpoint:'/api/devis',instagramUrl:'#',whatsappUrl:'#',facebookUrl:'#'};
const waBtns=[document.getElementById('cta-wa'),document.getElementById('waForm')];
waBtns.forEach(b=>b&&b.addEventListener('click',()=>{const p=document.getElementById('prenom')?.value?.trim()||'';const n=document.getElementById('nom')?.value?.trim()||'';const t=document.getElementById('tel')?.value?.trim()||'';const m=document.getElementById('message')?.value?.trim()||'';const text=`Bonjour, je souhaite passer commande/obtenir un devis.%0A%0ANom: ${p} ${n}%0ATéléphone: ${t}%0A${m?`Message: ${encodeURIComponent(m)}%0A`:''}Je joins ma liste en pièce jointe.`;const url=`https://wa.me/${CONFIG.whatsappNumber.replace(/[^0-9]/g,'')}?text=${text}`;window.open(url,'_blank','noopener');}));
document.getElementById('ig')?.setAttribute('href',CONFIG.instagramUrl);
document.getElementById('wa')?.setAttribute('href',CONFIG.whatsappUrl||`https://wa.me/${CONFIG.whatsappNumber.replace(/[^0-9]/g,'')}`);
document.getElementById('fb')?.setAttribute('href',CONFIG.facebookUrl);
function isValidMarocPhone(v){v=v.replace(/\s|-/g,'');return/(^\+212[67]|^0[67])\d{8}$/.test(v);}
const form=document.getElementById('devisForm');const statusEl=document.getElementById('status');
form?.addEventListener('submit',async e=>{e.preventDefault();statusEl.hidden=true;const d=new FormData(form);let ok=true;
const tel=String(d.get('tel')||'').trim();if(!d.get('prenom'))ok=false;if(!d.get('nom'))ok=false; if(!tel||!isValidMarocPhone(tel))ok=false;
if(!d.get('fichier') or not d.get('fichier').size){};  // front-only build: disable actual upload
statusEl.textContent='Front‑end déployé. Configurez un backend si vous voulez recevoir les fichiers.';statusEl.hidden=false;});
// Promo bar WhatsApp
document.getElementById('promo-wa')?.addEventListener('click', ()=>{
  const p=document.getElementById('prenom')?.value?.trim()||'';
  const n=document.getElementById('nom')?.value?.trim()||'';
  const t=document.getElementById('tel')?.value?.trim()||'';
  const m=document.getElementById('message')?.value?.trim()||'';
  const text=`Bonjour, je souhaite passer commande/obtenir un devis.%0A%0ANom: ${p} ${n}%0ATéléphone: ${t}%0A${m?`Message: ${encodeURIComponent(m)}%0A`:''}Je joins ma liste en pièce jointe.`;
  const url=`https://wa.me/${CONFIG.whatsappNumber.replace(/[^0-9]/g,'')}?text=${text}`;
  window.open(url,'_blank','noopener');
});
