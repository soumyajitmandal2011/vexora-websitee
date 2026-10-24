import * as THREE from 'three';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Navigation, scroll progress, mobile menu, and accessible reveal animations.
const header = $('.header');
const progress = $('.scroll-progress');
function onScroll(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
  header.classList.toggle('scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
const menuButton = $('.menu-toggle');
const mobileNav = $('#mobile-nav');
function closeMenu(){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation menu');}
menuButton.addEventListener('click',()=>{
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded',String(!open));
  menuButton.setAttribute('aria-label',open?'Open navigation menu':'Close navigation menu');
  mobileNav.hidden = open;
  if(!open) $('a',mobileNav).focus();
});
$$('.mobile-nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){closeMenu();menuButton.focus();}});
// Cinematic entrance system: deliberately visible movement, staggered by visual groups.
// Add reveal hooks to meaningful content that was not already marked in the HTML.
const cinematicTargets = [
  '.section-meta', '.display-heading', '.intro-copy', '.intro-bottom',
  '.section-title-row > p', '.service-row', '.services-aside > *',
  '.project', '.work-cta', '.manifesto-label', '.manifesto-heading',
  '.about-copy > *', '.about-grid > *', '.why-layout > *', '.process-step',
  '.collab-content > *', '.contact-copy > *', '.contact-form', '.footer-main > *',
  '.footer-links > *', '.footer-bottom > *'
];
cinematicTargets.forEach(selector => $$(selector).forEach(el => {
  if (!el.closest('.hero') && !el.classList.contains('reveal')) el.classList.add('reveal');
}));
const revealElements = $$('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const parent = el.parentElement;
      const siblings = parent ? [...parent.children].filter(n => n.classList && n.classList.contains('reveal')) : [];
      const index = Math.max(0, siblings.indexOf(el));
      // Stagger neighbouring items, capped to prevent long lists feeling sluggish.
      el.style.setProperty('--reveal-delay', `${Math.min(index * 115, 575)}ms`);
      el.classList.add('is-visible');
      revealObserver.unobserve(el);
    });
  }, { threshold: .10, rootMargin: '0px 0px -6% 0px' });
  revealElements.forEach(el => revealObserver.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('is-visible'));
}
// Hero intro sequence: eyebrow, each headline line, supporting copy, buttons, footer.
if (!reducedMotion) {
  const heroSequence = [$('.hero .eyebrow'), ...$$('.hero-title .title-line'), $('.hero-description'), $('.hero-actions'), $('.hero-foot')].filter(Boolean);
  heroSequence.forEach((el, i) => {
    el.classList.add('hero-enter');
    el.style.setProperty('--hero-delay', `${220 + i * 260}ms`);
  });
  requestAnimationFrame(() => requestAnimationFrame(() => heroSequence.forEach(el => el.classList.add('hero-entered'))));
}
$('#year').textContent = new Date().getFullYear();

// Shared helpers for the two real WebGL scenes. Scenes stop rendering when off-screen.
function makeRenderer(canvas){
  const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:!matchMedia('(max-width: 760px)').matches,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, matchMedia('(max-width: 760px)').matches ? 1.35 : 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  return renderer;
}
function createHeroScene(){
 const canvas=$('#hero-canvas'); if(!canvas || !window.WebGLRenderingContext) return;
 let renderer, scene, camera, sculpture, frame=0, visible=true, pointerX=0, pointerY=0, targetX=0, targetY=0, disposed=false;
 try{
  renderer=makeRenderer(canvas);scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,8.6);
  scene.add(new THREE.AmbientLight(0x8c8ab5,1.1));
  const key=new THREE.DirectionalLight(0xffffff,3.8);key.position.set(4,5,5);scene.add(key);
  const violet=new THREE.PointLight(0x8b5cf6,38,12);violet.position.set(-3,1.4,2);scene.add(violet);
  const cyan=new THREE.PointLight(0x54e8ff,28,10);cyan.position.set(3,-1.5,1.5);scene.add(cyan);
  const rim=new THREE.PointLight(0xffffff,22,10);rim.position.set(0,3,-3);scene.add(rim);
  sculpture=new THREE.Group();scene.add(sculpture);
  const chrome=new THREE.MeshPhysicalMaterial({color:0xd9d9e6,metalness:.96,roughness:.18,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:1.3});
  const darkChrome=new THREE.MeshPhysicalMaterial({color:0x353343,metalness:.94,roughness:.24,clearcoat:1,clearcoatRoughness:.12});
  // VEXORA signature: an interwoven liquid-chrome sculpture, deliberately NOT a sphere.
  const liquid=new THREE.MeshPhysicalMaterial({color:0xdedbea,metalness:.88,roughness:.13,clearcoat:1,clearcoatRoughness:.035,reflectivity:1,iridescence:.42,iridescenceIOR:1.32,iridescenceThicknessRange:[180,620]});
  const shadowChrome=new THREE.MeshPhysicalMaterial({color:0x252235,metalness:.96,roughness:.2,clearcoat:1,clearcoatRoughness:.06});
  const ring1=new THREE.Mesh(new THREE.TorusKnotGeometry(1.02,.245,240,24,2,3),liquid);ring1.rotation.set(.82,.24,.38);ring1.scale.set(1.02,1.22,.78);sculpture.add(ring1);
  const loop2=new THREE.Mesh(new THREE.TorusKnotGeometry(.72,.14,200,18,3,5),shadowChrome);loop2.rotation.set(.25,1.02,.7);loop2.scale.set(1.08,1.32,.9);sculpture.add(loop2);
  const loop3=new THREE.Mesh(new THREE.TorusGeometry(1.12,.085,24,180),chrome);loop3.rotation.set(1.18,.3,.62);loop3.scale.set(.82,1.3,1);sculpture.add(loop3);
  // Swept ribbon: an asymmetrical folded blade catches long cinematic highlights.
  const ribbonPoints=[];for(let i=0;i<=120;i++){const t=i/120*Math.PI*2; ribbonPoints.push(new THREE.Vector3(Math.sin(t)*(.72+.22*Math.sin(3*t)),Math.cos(t*1.5)*1.22,Math.sin(t*2)*.42));}
  const ribbonCurve=new THREE.CatmullRomCurve3(ribbonPoints,true,'catmullrom',.5);
  const ribbon=new THREE.Mesh(new THREE.TubeGeometry(ribbonCurve,240,.105,12,true),liquid);ribbon.rotation.set(.35,.15,-.32);sculpture.add(ribbon);
  // Floating fractured obsidian pieces around the main form.
  const shardGeo=new THREE.OctahedronGeometry(1,0);const shards=[];
  for(let i=0;i<13;i++){const shard=new THREE.Mesh(shardGeo,i%3===0?liquid:shadowChrome);const a=i*2.399;const r=1.65+(i%4)*.22;shard.position.set(Math.cos(a)*r,Math.sin(a*1.3)*1.48,Math.sin(a)*.75);const z=.09+(i%4)*.045;shard.scale.set(z*1.4,z*2.1,z);shard.rotation.set(a*.7,a, a*.43);sculpture.add(shard);shards.push({mesh:shard,phase:a,base:shard.position.clone()});}
  const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(1.35,1.62,.13,64,1,true),new THREE.MeshPhysicalMaterial({color:0x15131e,metalness:.9,roughness:.23,clearcoat:1}));pedestal.position.set(0,-1.72,0);pedestal.rotation.x=-.06;sculpture.add(pedestal);
  const pedestalEdge=new THREE.Mesh(new THREE.TorusGeometry(1.46,.018,8,100),new THREE.MeshBasicMaterial({color:0x9c7bff}));pedestalEdge.rotation.x=Math.PI/2;pedestalEdge.position.y=-1.65;sculpture.add(pedestalEdge);
  const ring2=new THREE.Mesh(new THREE.TorusGeometry(1.58,.025,10,160),new THREE.MeshStandardMaterial({color:0x8b5cf6,metalness:.75,roughness:.25,emissive:0x251044,emissiveIntensity:.5}));ring2.rotation.set(1.12,.2,.35);sculpture.add(ring2);
  const ring3=new THREE.Mesh(new THREE.TorusGeometry(1.78,.012,8,160),new THREE.MeshStandardMaterial({color:0x54e8ff,metalness:.6,roughness:.3,emissive:0x09232b,emissiveIntensity:.7}));ring3.rotation.set(.3,1.1,.7);sculpture.add(ring3);
  const beadGeo=new THREE.SphereGeometry(.055,16,12);const beadMat=new THREE.MeshStandardMaterial({color:0xffffff,metalness:.7,roughness:.18,emissive:0x54e8ff,emissiveIntensity:.4});
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2;const b=new THREE.Mesh(beadGeo,beadMat);b.position.set(Math.cos(a)*2.03,Math.sin(a)*.85,Math.sin(a*2)*.4);sculpture.add(b);}
  // Fake an environment through luminous cards around the object; the object itself is genuine 3D geometry.
  const cardMat=(color,opacity)=>new THREE.MeshBasicMaterial({color,transparent:true,opacity,side:THREE.DoubleSide});
  const card1=new THREE.Mesh(new THREE.PlaneGeometry(5,1.4),cardMat(0x8b5cf6,.13));card1.position.set(-2.2,1.8,-1.5);card1.rotation.z=.4;scene.add(card1);
  const card2=new THREE.Mesh(new THREE.PlaneGeometry(4,1.1),cardMat(0x54e8ff,.1));card2.position.set(2,-1.7,-1.8);card2.rotation.z=-.35;scene.add(card2);
  const starGeometry=new THREE.BufferGeometry(), positions=[];for(let i=0;i<450;i++){positions.push((Math.random()-.5)*10,(Math.random()-.5)*7,(Math.random()-.5)*4-1.5);}starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));const stars=new THREE.Points(starGeometry,new THREE.PointsMaterial({color:0xa9a5c6,size:.012,transparent:true,opacity:.7}));scene.add(stars);
  function resize(){const w=canvas.clientWidth||600,h=canvas.clientHeight||500;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);resize();
  const clock=new THREE.Clock(),visual=$('.hero-visual')||canvas;
  // Track the pointer across the whole viewport, not only the canvas. This keeps
  // the sculpture responsive even when the cursor is over hero copy or UI layers.
  const pointer=e=>{const r=visual.getBoundingClientRect();if(!r.width||!r.height)return;const nx=(e.clientX-r.left)/r.width,ny=(e.clientY-r.top)/r.height;targetX=Math.max(-1.1,Math.min(1.1,(nx-.5)*1.9));targetY=Math.max(-.9,Math.min(.9,(ny-.5)*1.45));};
  const pointerLeave=()=>{targetX=0;targetY=0;};window.addEventListener('pointermove',pointer,{passive:true});window.addEventListener('blur',pointerLeave);document.addEventListener('mouseleave',pointerLeave);
  const visObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!frame)animate();});visObserver.observe(canvas);
  let elapsed=0;function animate(){if(disposed||!visible){frame=0;return;}frame=requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);elapsed+=dt;const ease=1-Math.exp(-dt*12);pointerX+=(targetX-pointerX)*ease;pointerY+=(targetY-pointerY)*ease;sculpture.rotation.y=elapsed*.28+pointerX*.52;sculpture.rotation.x=Math.sin(elapsed*.38)*.12-pointerY*.36;sculpture.rotation.z=Math.sin(elapsed*.27)*.055+pointerX*.1;sculpture.position.x=pointerX*.28;sculpture.position.y=Math.sin(elapsed*.8)*.075-pointerY*.16;ring1.rotation.x=.82+elapsed*.19+pointerY*.16;ring1.rotation.y=.24-elapsed*.23+pointerX*.15;loop2.rotation.y=1.02-elapsed*.21;loop2.rotation.z=.7+Math.sin(elapsed*.4)*.09;loop3.rotation.y=.3+elapsed*.17;ribbon.rotation.y=.15+Math.sin(elapsed*.31)*.12;shards.forEach(o=>{o.mesh.position.y=o.base.y+Math.sin(elapsed*.8+o.phase)*.07;o.mesh.rotation.y+=dt*.12;});stars.rotation.y=elapsed*.035;stars.rotation.x=Math.sin(elapsed*.15)*.03;renderer.render(scene,camera);}
  animate();window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();visObserver.disconnect();window.removeEventListener('pointermove',pointer);window.removeEventListener('blur',pointerLeave);document.removeEventListener('mouseleave',pointerLeave);renderer.dispose();starGeometry.dispose();chrome.dispose();darkChrome.dispose();liquid.dispose();shadowChrome.dispose();});
 }catch(err){console.warn('3D hero unavailable; continuing with the page content.',err);canvas.style.display='none';}
}
function createServiceScene(){
 const canvas=$('#service-canvas');if(!canvas)return;let renderer,scene,camera,group,frame=0,visible=true,disposed=false;
 try{
  renderer=makeRenderer(canvas);scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(40,1,.1,100);camera.position.z=7;
  scene.add(new THREE.AmbientLight(0x777799,1.5));const light=new THREE.PointLight(0x8b5cf6,28);light.position.set(-3,3,3);scene.add(light);const light2=new THREE.PointLight(0x54e8ff,20);light2.position.set(3,-2,2);scene.add(light2);
  group=new THREE.Group();scene.add(group);
  // Animated water-planet core: procedural ocean currents and moving cyan highlights.
  const waterUniforms={uTime:{value:0}};
  const waterMaterial=new THREE.ShaderMaterial({uniforms:waterUniforms,vertexShader:`
    varying vec3 vPos; varying vec3 vNormal;
    void main(){ vPos=position; vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }
  `,fragmentShader:`
    uniform float uTime; varying vec3 vPos; varying vec3 vNormal;
    void main(){
      vec3 p=normalize(vPos);
      float wave1=sin(p.x*13.0+p.y*8.0+uTime*1.2+sin(p.z*7.0-uTime*.7));
      float wave2=sin(p.z*19.0-p.x*6.0-uTime*.85+cos(p.y*11.0+uTime*.55));
      float current=smoothstep(.05,.9,(wave1+wave2)*.25+.5);
      float ridge=pow(max(0.0,sin(p.x*22.0+p.z*16.0+uTime*1.5+sin(p.y*12.0))),12.0);
      vec3 deep=vec3(.008,.055,.13); vec3 ocean=vec3(.015,.30,.48); vec3 cyan=vec3(.20,.88,1.0);
      vec3 color=mix(deep,ocean,current*.92); color=mix(color,cyan,ridge*.75);
      float fresnel=pow(1.0-max(dot(normalize(vNormal),normalize(vec3(0.0,0.0,1.0))),0.0),2.0);
      color+=vec3(.015,.28,.42)*fresnel*.8;
      gl_FragColor=vec4(color,1.0);
    }
  `});
  const sphere=new THREE.Mesh(new THREE.SphereGeometry(1.12,96,64),waterMaterial);group.add(sphere);
  // Thin atmospheric rim around the ocean globe.
  const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(1.16,64,48),new THREE.MeshBasicMaterial({color:0x28dfff,transparent:true,opacity:.09,side:THREE.BackSide}));group.add(atmosphere);
  const points=[];for(let i=0;i<14;i++){const phi=Math.acos(-1+(2*i)/14),theta=Math.sqrt(14*Math.PI)*phi;const p=new THREE.Vector3(Math.cos(theta)*Math.sin(phi)*2,Math.sin(theta)*Math.sin(phi)*2,Math.cos(phi)*2);points.push(p);const node=new THREE.Mesh(new THREE.SphereGeometry(i%3===0?.075:.045,12,10),new THREE.MeshStandardMaterial({color:i%3===0?0x54e8ff:0x8b5cf6,emissive:i%3===0?0x123f47:0x24103f,emissiveIntensity:.8,metalness:.4,roughness:.3}));node.position.copy(p);group.add(node);}
  const lineMat=new THREE.LineBasicMaterial({color:0x8b5cf6,transparent:true,opacity:.45});for(let i=0;i<points.length;i++){for(let j=i+1;j<points.length;j++){if(points[i].distanceTo(points[j])<1.65){const geo=new THREE.BufferGeometry().setFromPoints([points[i],points[j]]);group.add(new THREE.Line(geo,lineMat));}}}
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.75,.012,8,100),new THREE.MeshBasicMaterial({color:0x54e8ff,transparent:true,opacity:.55}));ring.rotation.x=1.1;group.add(ring);
  const clock=new THREE.Clock(),visual=$('.aside-visual')||canvas;let tx=0,ty=0,fx=0,fy=0;
  const onPointer=e=>{const r=visual.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*1.9;ty=((e.clientY-r.top)/r.height-.5)*1.5;};const onLeave=()=>{tx=0;ty=0;};visual.addEventListener('pointermove',onPointer,{passive:true});visual.addEventListener('pointerleave',onLeave,{passive:true});
  function resize(){const w=canvas.clientWidth||350,h=canvas.clientHeight||300;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.render(scene,camera);}const ro=new ResizeObserver(resize);ro.observe(canvas);resize();const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible&&frame===0&&!disposed)animate();});io.observe(canvas);
  let elapsed=0;function animate(){if(disposed){frame=0;return;}if(!visible){frame=0;return;}frame=requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);elapsed+=dt;waterUniforms.uTime.value=elapsed;const ease=1-Math.exp(-dt*13);fx+=(tx-fx)*ease;fy+=(ty-fy)*ease;group.rotation.y=elapsed*.8+fx*.68;group.rotation.x=Math.sin(elapsed*.5)*.14-fy*.46;group.rotation.z=Math.sin(elapsed*.34)*.07+fx*.14;group.position.x=fx*.26;group.position.y=Math.sin(elapsed*.95)*.10-fy*.16;ring.rotation.z=elapsed*.55;renderer.render(scene,camera);}
  animate();window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();visual.removeEventListener('pointermove',onPointer);visual.removeEventListener('pointerleave',onLeave);renderer.dispose();});
 }catch(err){console.warn('Secondary 3D scene unavailable.',err);canvas.style.display='none';}
}
createHeroScene();createServiceScene();

// Honest project inquiry form: validate locally, then show the documented integration step.
const form=$('#project-form');const status=$('#form-status');
form.addEventListener('submit',event=>{
 event.preventDefault();status.className='form-status';
 if(form.elements.website.value){status.textContent='Unable to process this enquiry.';return;}
 if(!form.checkValidity()){
  const invalid=form.querySelector(':invalid');status.classList.add('error');status.textContent=invalid.validationMessage||'Please complete the required fields with valid information.';invalid.focus();invalid.reportValidity();return;
 }
 const data=new FormData(form);const payload={name:data.get('name').trim(),business:data.get('business').trim(),email:data.get('email').trim(),service:data.get('service'),budget:data.get('budget'),timeline:data.get('timeline'),message:data.get('message').trim()};
 // Configure VEXORA_FORM_ENDPOINT in this file to a real HTTPS form endpoint before enabling transmission.
 const endpoint='';
 if(!endpoint){status.classList.add('success');status.textContent='Your details passed validation in this browser. No message was sent or stored: configure a secure form endpoint in script.js to receive enquiries.';return;}
 status.textContent='Sending…';
 fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)}).then(response=>{if(!response.ok)throw new Error('Request failed');form.reset();status.classList.add('success');status.textContent='Thanks — your project enquiry has been sent.';}).catch(()=>{status.classList.add('error');status.textContent='The enquiry could not be sent. Please try again later or configure the form endpoint.';});
});
