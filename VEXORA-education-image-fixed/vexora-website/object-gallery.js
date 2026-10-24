import * as THREE from 'three';
const canvases=[...document.querySelectorAll('canvas[data-object]')];
const live=new Set();let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function make(canvas){
 let renderer,scene,camera,root,frame=0,dead=false,visible=true,elapsed=0,ro;
 try{
  renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setClearColor(0x000000,0);
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.z=4.8;
  scene.add(new THREE.AmbientLight(0x9a9ac0,1.7));
  const a=new THREE.PointLight(0x54e8ff,26);a.position.set(3,3,4);scene.add(a);
  const b=new THREE.PointLight(0x8b5cf6,22);b.position.set(-3,-2,2);scene.add(b);
  root=new THREE.Group();scene.add(root);
  const type=canvas.dataset.object||'torus';
  const mat=new THREE.MeshPhysicalMaterial({color:canvas.dataset.color||'#8b5cf6',metalness:.68,roughness:.23,clearcoat:.9,clearcoatRoughness:.12,emissive:canvas.dataset.color||'#8b5cf6',emissiveIntensity:.12});
  let mesh;
  if(type==='planet'){
   const geo=new THREE.SphereGeometry(1.15,72,56);
   const uni={uTime:{value:0}};
   const water=new THREE.ShaderMaterial({uniforms:uni,vertexShader:'varying vec3 vP; void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform float uTime; varying vec3 vP; void main(){vec3 p=normalize(vP);float w=sin(p.x*16.0+p.y*11.0+uTime*1.4+sin(p.z*10.0-uTime));float q=pow(max(0.0,sin(p.z*22.0+p.x*9.0-uTime*1.6)),8.0);vec3 c=mix(vec3(.005,.04,.13),vec3(.01,.3,.52),smoothstep(-.7,.8,w));c=mix(c,vec3(.18,.9,1.),q*.85);gl_FragColor=vec4(c,1.);}'});
   mesh=new THREE.Mesh(geo,water);mesh.userData.uniforms=uni;root.add(mesh);
   const rim=new THREE.Mesh(new THREE.SphereGeometry(1.2,48,36),new THREE.MeshBasicMaterial({color:0x54e8ff,transparent:true,opacity:.1,side:THREE.BackSide}));root.add(rim);
   const ring=new THREE.Mesh(new THREE.TorusGeometry(1.55,.018,8,100),new THREE.MeshBasicMaterial({color:0x54e8ff,transparent:true,opacity:.8}));ring.rotation.x=1.08;root.add(ring);
  }else if(type==='laptop'){
   const dark=new THREE.MeshPhysicalMaterial({color:0x252936,metalness:.82,roughness:.24,clearcoat:.8});
   const edge=new THREE.MeshStandardMaterial({color:0x54e8ff,metalness:.55,roughness:.3,emissive:0x073b48,emissiveIntensity:.5});
   const screen=new THREE.Mesh(new THREE.BoxGeometry(1.82,1.12,.075),dark);screen.position.set(0,.58,-.25);screen.rotation.x=-.12;root.add(screen);
   const display=new THREE.Mesh(new THREE.PlaneGeometry(1.67,.94),new THREE.MeshBasicMaterial({color:0x071a2a}));display.position.set(0,.59,-.205);display.rotation.x=-.12;root.add(display);
   const glowLine=new THREE.Mesh(new THREE.PlaneGeometry(1.24,.025),new THREE.MeshBasicMaterial({color:0x54e8ff}));glowLine.position.set(-.12,.72,-.19);glowLine.rotation.x=-.12;root.add(glowLine);
   const base=new THREE.Mesh(new THREE.BoxGeometry(2.05,.09,1.25),dark);base.position.set(0,-.04,.25);root.add(base);
   const keyboard=new THREE.Mesh(new THREE.BoxGeometry(1.55,.018,.48),new THREE.MeshStandardMaterial({color:0x10131b,metalness:.3,roughness:.6}));keyboard.position.set(0,.015,.12);root.add(keyboard);
   for(let r=0;r<4;r++)for(let c=0;c<12;c++){const key=new THREE.Mesh(new THREE.BoxGeometry(.09,.012,.065),edge);key.position.set(-.68+c*.124,.028,-.06+r*.105);root.add(key);}
   const track=new THREE.Mesh(new THREE.BoxGeometry(.38,.012,.22),edge);track.position.set(0,.02,.52);root.add(track);
  }else if(type==='plant'){
   const potMat=new THREE.MeshPhysicalMaterial({color:0x20232b,metalness:.35,roughness:.32,clearcoat:.7});const soilMat=new THREE.MeshStandardMaterial({color:0x34271e,roughness:1});const leafMat=new THREE.MeshStandardMaterial({color:0x178f65,roughness:.36,metalness:.08,emissive:0x063d27,emissiveIntensity:.3,side:THREE.DoubleSide});
   const pot=new THREE.Mesh(new THREE.CylinderGeometry(.48,.34,.62,40,1,false),potMat);pot.position.y=-.55;root.add(pot);const soil=new THREE.Mesh(new THREE.CylinderGeometry(.425,.425,.035,36),soilMat);soil.position.y=-.225;root.add(soil);
   const stemMat=new THREE.MeshStandardMaterial({color:0x3eaa72,roughness:.7});const stem=new THREE.Mesh(new THREE.CylinderGeometry(.025,.04,.95,10),stemMat);stem.position.y=.28;root.add(stem);
   for(let i=0;i<9;i++){const angle=i*2.399;const h=-.05+(i%4)*.19;const len=.42+(i%3)*.07;const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,20,12),leafMat);leaf.scale.set(.16,len,.065);leaf.position.set(Math.cos(angle)*(.18+(i%2)*.09),h+.12,Math.sin(angle)*(.18+(i%2)*.09));leaf.rotation.z=Math.cos(angle)*.85;leaf.rotation.x=Math.sin(angle)*.8;root.add(leaf);const branch=new THREE.Mesh(new THREE.CylinderGeometry(.012,.02,.36,8),stemMat);branch.position.set(leaf.position.x*.48,h,leaf.position.z*.48);branch.rotation.z=Math.cos(angle)*-.8;branch.rotation.x=Math.sin(angle)*.8;root.add(branch);}
  }else if(type==='phone'){
   const body=new THREE.Mesh(new THREE.BoxGeometry(.82,1.55,.12),new THREE.MeshPhysicalMaterial({color:0x252936,metalness:.8,roughness:.22,clearcoat:1}));root.add(body);const screen=new THREE.Mesh(new THREE.PlaneGeometry(.72,1.38),new THREE.MeshBasicMaterial({color:0x071b2a}));screen.position.z=.066;root.add(screen);const line=new THREE.Mesh(new THREE.PlaneGeometry(.5,.025),new THREE.MeshBasicMaterial({color:0x54e8ff}));line.position.set(0,.28,.07);root.add(line);const lens=new THREE.Mesh(new THREE.CircleGeometry(.045,24),new THREE.MeshBasicMaterial({color:0x8b5cf6}));lens.position.set(0,.65,.071);root.add(lens);
  }else if(type==='headphones'){
   const metal=new THREE.MeshPhysicalMaterial({color:0x292d38,metalness:.82,roughness:.2,clearcoat:1});const pad=new THREE.MeshStandardMaterial({color:0x101219,roughness:.65});const arch=new THREE.Mesh(new THREE.TorusGeometry(.68,.09,16,80,Math.PI),metal);arch.rotation.z=Math.PI;arch.position.y=.12;root.add(arch);for(const x of [-.68,.68]){const cup=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.22,36),metal);cup.rotation.z=Math.PI/2;cup.position.set(x,-.25,0);root.add(cup);const cushion=new THREE.Mesh(new THREE.TorusGeometry(.19,.055,12,36),pad);cushion.position.set(x+Math.sign(x)*.12,-.25,0);cushion.rotation.y=Math.PI/2;root.add(cushion);}
  }else if(type==='camera'){
   const body=new THREE.Mesh(new THREE.BoxGeometry(1.35,.85,.6),new THREE.MeshPhysicalMaterial({color:0x252a34,metalness:.72,roughness:.27,clearcoat:.8}));root.add(body);const top=new THREE.Mesh(new THREE.BoxGeometry(.48,.18,.35),mat);top.position.set(-.25,.5,0);root.add(top);const lens=new THREE.Mesh(new THREE.CylinderGeometry(.3,.25,.42,40),new THREE.MeshPhysicalMaterial({color:0x111722,metalness:.9,roughness:.12}));lens.rotation.x=Math.PI/2;lens.position.z=.42;root.add(lens);const glass=new THREE.Mesh(new THREE.CircleGeometry(.22,40),new THREE.MeshBasicMaterial({color:0x54e8ff,transparent:true,opacity:.75}));glass.position.z=.64;root.add(glass);
  }else{
   let geo;
   if(type==='torus')geo=new THREE.TorusKnotGeometry(.75,.24,140,18,2,3);
   else if(type==='crystal')geo=new THREE.OctahedronGeometry(1.05,1);
   else if(type==='cube')geo=new THREE.BoxGeometry(1.45,1.45,1.45,5,5,5);
   else if(type==='ring')geo=new THREE.TorusGeometry(.8,.13,20,100);
   else if(type==='icosa')geo=new THREE.IcosahedronGeometry(1.08,1);
   else if(type==='diamond')geo=new THREE.OctahedronGeometry(1.1,0);
   else if(type==='knot')geo=new THREE.TorusKnotGeometry(.8,.16,120,14,3,5);
   else geo=new THREE.DodecahedronGeometry(1.05,1);
   mesh=new THREE.Mesh(geo,mat);root.add(mesh);
   if(type==='cube'){const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:0x54e8ff,transparent:true,opacity:.65}));root.add(edges);}
   const ring=new THREE.Mesh(new THREE.TorusGeometry(1.42,.009,6,100),new THREE.MeshBasicMaterial({color:0x54e8ff,transparent:true,opacity:.48}));ring.rotation.set(.7,.4,.8);root.add(ring);
  }
  function resize(){const w=canvas.clientWidth||280,h=canvas.clientHeight||230;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  ro=new ResizeObserver(resize);ro.observe(canvas);resize();
  const io=new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible&&!frame&&!dead)animate();});io.observe(canvas);
  function animate(){if(dead||!visible){frame=0;return;}frame=requestAnimationFrame(animate);const dt=Math.min(.05,clock.getDelta());elapsed+=dt;if(!reduced){root.rotation.y=elapsed*.55;root.rotation.x=Math.sin(elapsed*.45)*.17;root.rotation.z=Math.sin(elapsed*.3)*.12;}root.position.y=Math.sin(elapsed*.8)*.045;if(mesh.userData.uniforms)mesh.userData.uniforms.uTime.value=elapsed;renderer.render(scene,camera);}
  const clock=new THREE.Clock();animate();
  live.add({dispose(){dead=true;cancelAnimationFrame(frame);io.disconnect();ro.disconnect();renderer.dispose();}});
 }catch(e){console.warn('Orbital object unavailable',e);canvas.replaceWith(Object.assign(document.createElement('div'),{className:'object-fallback',textContent:'3D preview requires WebGL'}));}
}
canvases.forEach(make);
window.addEventListener('pagehide',()=>live.forEach(x=>x.dispose()));
