import * as THREE from 'three';
import { zones, type Progress } from './config';
import type { Obstacle } from './logic';

export type Interactable = { id: string; name: string; position: THREE.Vector3; mesh: THREE.Object3D };
export type RealmId = 'interngo' | 'fclabs' | 'aokah';

const palette = { dark: '#0b1625', steel: '#162a3b', cyan: '#5de3f2', violet: '#a58aff', lime: '#c6ef8b' };
export function buildWorld(scene: THREE.Scene) {
  const materials = new Map<string, THREE.Material>();
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 48);
  const sphereGeometry = new THREE.SphereGeometry(1, 12, 8);
  const main = new THREE.Group(); scene.add(main);
  const background = new THREE.Group(); scene.add(background);
  const interactables: Interactable[] = [];
  const obstacles: Obstacle[] = [];
  const animated: { object: THREE.Object3D; kind: 'ring' | 'float' | 'rotate'; base: number; speed: number }[] = [];
  const completionLights: { mesh: THREE.Mesh; id: string; color: THREE.Color }[] = [];
  const textures: THREE.Texture[] = [];
  function material(color: string, glow = false, opacity = 1) {
    const key = `${color}-${glow}-${opacity}`;
    if (!materials.has(key)) materials.set(key, glow ? new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: opacity === 1 }) : new THREE.MeshStandardMaterial({ color, roughness: .55, metalness: .25 }));
    return materials.get(key)!;
  }
  function box(parent: THREE.Object3D, x: number, y: number, z: number, width: number, height: number, depth: number, color: string, glow = false, opacity = 1) {
    const mesh = new THREE.Mesh(boxGeometry, material(color, glow, opacity)); mesh.position.set(x, y, z); mesh.scale.set(width, height, depth); parent.add(mesh); return mesh;
  }
  function cylinder(parent: THREE.Object3D, x: number, y: number, z: number, radius: number, height: number, color: string, glow = false) {
    const mesh = new THREE.Mesh(cylinderGeometry, material(color, glow)); mesh.position.set(x, y, z); mesh.scale.set(radius, height, radius); parent.add(mesh); return mesh;
  }
  function ball(parent: THREE.Object3D, x: number, y: number, z: number, radius: number, color: string, glow = false) {
    const mesh = new THREE.Mesh(sphereGeometry, material(color, glow)); mesh.position.set(x, y, z); mesh.scale.setScalar(radius); parent.add(mesh); return mesh;
  }
  function ring(parent: THREE.Object3D, x: number, y: number, z: number, radius: number, color: string, horizontal = false, tube = .035) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 6, 64), material(color, true)); mesh.position.set(x, y, z); if (horizontal) mesh.rotation.x = Math.PI / 2; parent.add(mesh); return mesh;
  }
  function label(parent: THREE.Object3D, text: string, x: number, y: number, z: number, color = '#b6d0de', scale = 1) {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 112;
    const ctx = canvas.getContext('2d')!; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '500 31px monospace';
    ctx.fillStyle = '#081421dd'; ctx.fillRect(80, 19, 864, 74); ctx.strokeStyle = `${color}70`; ctx.lineWidth = 1; ctx.strokeRect(80, 19, 864, 74);
    ctx.fillStyle = color; ctx.fillText(text.toUpperCase(), 512, 56, 830);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })); sprite.position.set(x, y, z); sprite.scale.set(8 * scale, .875 * scale, 1); parent.add(sprite); return sprite;
  }
  function connect(parent: THREE.Object3D, points: THREE.Vector3[], color: string, opacity = .45) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points); const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity }); const line = new THREE.Line(geometry, mat); parent.add(line); return line;
  }
  function platform(parent: THREE.Object3D, x: number, z: number, radius: number, color: string) {
    cylinder(parent, x, -.8, z, radius, 1.6, '#101d2d'); cylinder(parent, x, -.025, z, radius * .98, .06, '#1b3045');
    ring(parent, x, -.28, z, radius, color, true, .045); ring(parent, x, -1.1, z, radius * .96, color, true, .02);
    const base = new THREE.Mesh(new THREE.ConeGeometry(radius * .6, 5, 6), material('#0c1826')); base.rotation.x = Math.PI; base.position.set(x, -4.1, z); parent.add(base);
    cylinder(parent, x, -4.8, z, .25, .6, color, true);
    for (let i = 0; i < 6; i++) { const angle = i * Math.PI / 3; box(parent, x + Math.cos(angle) * radius * .8, .03, z + Math.sin(angle) * radius * .8, .1, .025, 1.4, color, true, .55).rotation.y = -angle + Math.PI / 2; }
  }
  function terminal(parent: THREE.Object3D, id: string, name: string, x: number, z: number, color: string, targetList = interactables) {
    cylinder(parent, x, .12, z, 1.05, .24, '#192d41'); ring(parent, x, .27, z, .82, color, true, .025);
    const stand = box(parent, x, .8, z, .65, 1.2, .45, '#233a4d');
    const screen = box(parent, x, 1.6, z, 1.4, .92, .07, color, true, .4); screen.rotation.x = -.15;
    box(parent, x, 1.65, z + .06, 1.16, .035, .02, color, true); box(parent, x - .3, 1.43, z + .06, .53, .025, .02, color, true);
    const orb = ball(parent, x, 2.55, z, .14, color, true); animated.push({ object: orb, kind: 'float', base: 2.55, speed: 1 });
    targetList.push({ id, name, position: new THREE.Vector3(x, 0, z), mesh: screen });
    label(parent, name, x, 3.15, z, color, .5); return stand;
  }
  function portal(parent: THREE.Object3D, id: string, name: string, x: number, z: number, color: string, list = interactables) {
    cylinder(parent, x, .1, z, 1.8, .2, '#172b3f'); const outer = ring(parent, x, 2.4, z, 2.2, color, false, .075); ring(parent, x, 2.4, z, 1.96, color, false, .018);
    const plane = new THREE.Mesh(new THREE.CircleGeometry(1.93, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .055, side: THREE.DoubleSide, depthWrite: false })); plane.position.set(x, 2.4, z); parent.add(plane);
    for (let i = 0; i < 8; i++) { const angle = i * Math.PI / 4; box(parent, x + Math.cos(angle) * 2.2, 2.4 + Math.sin(angle) * 2.2, z, .2, .2, .22, '#29405a').rotation.z = angle; }
    label(parent, name, x, 5.25, z, color, .72); list.push({ id, name, position: new THREE.Vector3(x, 0, z + .5), mesh: outer });
    completionLights.push({ mesh: plane, id: id.split(':')[1] || id, color: new THREE.Color(color) });
    animated.push({ object: plane, kind: 'float', base: 2.4, speed: .5 });
  }
  // A layered, floating city assembled from original low-poly geometry.
  platform(main, 0, 0, 13, palette.cyan);
  const grid = new THREE.GridHelper(18, 18, 0x244a60, 0x1a3448); grid.position.y = .015; main.add(grid);
  ring(main, 0, .04, 0, 6.5, '#2f7a8a', true, .02); ring(main, 0, .06, 0, 3, '#376b86', true, .035);
  cylinder(main, 0, .12, -2, 1.8, .24, '#20364c');
  const hubCore = new THREE.Mesh(new THREE.IcosahedronGeometry(.75, 0), material('#65e8f2', true, .7)); hubCore.position.set(0, 2.5, -2); main.add(hubCore); animated.push({ object: hubCore, kind: 'rotate', base: 2.5, speed: .3 });
  ring(main, 0, 1.9, -2, 1.4, palette.cyan, true); label(main, 'KISHORE.EXE / CENTRAL HUB', 0, 5, -2, '#98e5ef', 1.1);
  zones.forEach(zone => {
    const [x, z] = zone.position; platform(main, x, z, 8.3, zone.color);
    const distance = Math.hypot(x, z); const angle = Math.atan2(x, z);
    const bridgeCenter = (distance + 4.5) / 2; const bridgeLength = Math.max(1, distance - 17.5); const bridgeX = x / distance * bridgeCenter, bridgeZ = z / distance * bridgeCenter; const bridge = box(main, bridgeX, -.32, bridgeZ, 5.2, .6, bridgeLength, '#21394e'); bridge.rotation.y = angle;
    [-1, 1].forEach(side => { const railX = bridgeX + Math.cos(angle) * 2.4 * side; const railZ = bridgeZ - Math.sin(angle) * 2.4 * side; const rail = box(main, railX, .06, railZ, .035, .04, bridgeLength, zone.color, true, .7); rail.rotation.y = angle; });
    label(main, `${zone.symbol} / ${zone.name}`, x, 7, z - 2, zone.color, 1.1);
    if (zone.id === 'identity') {
      terminal(main, 'identity', 'Developer profile', x, z + 1, zone.color);
      const bust = new THREE.Group(); main.add(bust); cylinder(bust, x, .15, z - 3, 1.7, .3, '#1d3449');
      const holoBody = new THREE.Mesh(new THREE.CapsuleGeometry(.45, 1.2, 4, 8), material(zone.color, true, .25)); holoBody.position.set(x, 2, z - 3); bust.add(holoBody); ball(bust, x, 3.4, z - 3, .42, zone.color, true);
      ring(bust, x, 1.1, z - 3, 1.05, zone.color, true); ring(bust, x, 3.8, z - 3, 1.25, zone.color, true, .015);
      terminal(main, 'identity:frontend', 'Frontend', x - 4, z - 1, zone.color); terminal(main, 'identity:backend', 'Backend', x + 4, z - 1, zone.color);
      terminal(main, 'identity:ai', 'Intelligence', x, z - 6, zone.color);
    } else if (zone.id === 'career') {
      portal(main, 'career:0', '2026 / Codingmart', x - 3.1, z - 1, zone.color); portal(main, 'career:1', '2025 / Finestcoder', x + 3.1, z - 1, '#6eb7ed');
      for (let i = 0; i < 7; i++) box(main, x, .03, z - 6 + i * 1.5, .2, .03, .7, zone.color, true, .4);
    } else if (zone.id === 'projects') {
      portal(main, 'project:interngo', 'Interngo', x - 4.6, z, palette.lime); portal(main, 'project:fclabs', 'FC Labs', x, z - 3, palette.cyan); portal(main, 'project:aokah', 'AOKAH', x + 4.6, z, palette.violet);
    } else if (zone.id === 'skills') {
      terminal(main, 'skills', 'Connect the constellation', x, z + 2, zone.color);
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; const py = 2.5 + (i % 3) * .8; const p = new THREE.Vector3(x + Math.cos(a) * 3.3, py, z - 2 + Math.sin(a) * 2.4); points.push(p); const orb = ball(main, p.x, p.y, p.z, .25, i % 2 ? palette.cyan : zone.color, true); animated.push({ object: orb, kind: 'float', base: py, speed: .5 + i * .1 }); }
      points.forEach((p, i) => connect(main, [p, points[(i + 3) % 8]], zone.color));
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 0), new THREE.MeshBasicMaterial({ color: zone.color, wireframe: true, transparent: true, opacity: .5 })); core.position.set(x, 3.7, z - 2); main.add(core); animated.push({ object: core, kind: 'rotate', base: 3.7, speed: .2 });
    } else if (zone.id === 'lab') {
      terminal(main, 'lab', 'Experimental archive', x, z + 1, zone.color);
      [-3.7, 3.7].forEach((offset, i) => { const px = x + offset; cylinder(main, px, .4, z - 2, 1.3, .8, '#1a2e45'); box(main, px, 2.1, z - 2, 1.5, 2.8, 1.5, '#1d3045'); const holo = new THREE.Mesh(new THREE.OctahedronGeometry(.7), material(i ? palette.cyan : zone.color, true, .6)); holo.position.set(px, 4.3, z - 2); main.add(holo); animated.push({ object: holo, kind: 'rotate', base: 4.3, speed: .3 }); ring(main, px, 1.1, z - 2, 1.5, zone.color, true); obstacles.push({ x: px, z: z - 2, width: 1.5, depth: 1.5, height: 3.5 }); });
    } else {
      portal(main, 'connection', 'Open a connection', x, z - 1, zone.color); ring(main, x, 3.6, z - 1.2, 3.5, zone.color, false, .05); ring(main, x, 3.6, z - 1.4, 3.8, zone.color, false, .02);
      [-5, 5].forEach(offset => { box(main, x + offset, 2.5, z - 1, .8, 5, .8, '#1d3447'); box(main, x + offset, 2.5, z - .55, .08, 4.5, .04, zone.color, true); obstacles.push({ x: x + offset, z: z - 1, width: .8, depth: .8, height: 5 }); });
    }
    // Perimeter architecture keeps navigable paths legible.
    for (let i = 0; i < 3; i++) { const a = Math.atan2(z, x) + (i - 1) * .38; const px = x + Math.cos(a) * 6.7, pz = z + Math.sin(a) * 6.7; const h = 2.7 + i * 1.6; box(main, px, h / 2, pz, 1.4, h, 1.4, i % 2 ? '#1b3047' : '#15283d'); box(main, px, h / 2, pz + .72, .055, h * .8, .04, zone.color, true, .8); ring(main, px, h + .08, pz, .8, zone.color, true, .018); obstacles.push({ x: px, z: pz, width: 1.4, depth: 1.4, height: h }); }
  });
  // Instanced distant skyline: visual depth without dozens of unique materials.
  const skyline = new THREE.InstancedMesh(boxGeometry, material('#1b2e45'), 70); const matrix = new THREE.Matrix4();
  const skylineWindows = new THREE.InstancedMesh(boxGeometry, material('#70a4ba', true), 560);
  for (let i = 0; i < 70; i++) { const angle = i * 2.39996; const radius = 48 + (i % 5) * 6; const height = 3 + ((i * 17) % 15); const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius; matrix.compose(new THREE.Vector3(x, -4 + height / 2, z), new THREE.Quaternion(), new THREE.Vector3(1.5 + i % 3, height, 1.5 + i % 2)); skyline.setMatrixAt(i, matrix); box(background, x, -4 + height / 2, z + 1, .045, height * .9, .05, i % 3 ? '#3a7993' : '#7764b1', true, .6);
    for (let row = 0; row < 8; row++) { const y = -3 + row * 1.6; const visible = y < height - 4.3; matrix.compose(new THREE.Vector3(x, y, z + (1.5 + i % 2) / 2 + .015), new THREE.Quaternion(), new THREE.Vector3(visible ? 1 + i % 3 : 0, .065, .025)); skylineWindows.setMatrixAt(i * 8 + row, matrix); }
  }
  background.add(skyline, skylineWindows);
  const starPositions: number[] = [];
  for (let i = 0; i < 320; i++) { const a = i * 2.39996, radius = 55 + i % 80; starPositions.push(Math.cos(a) * radius, 8 + (i * 7 % 65), Math.sin(a) * radius); }
  const starsGeometry = new THREE.BufferGeometry(); starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3)); const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: '#78b5d0', size: .09, transparent: true, opacity: .65 })); background.add(stars);
  const dataPositions: number[] = [];
  for (let i = 0; i < 100; i++) { const a = i * 2.39996; dataPositions.push(Math.cos(a) * (8 + i % 28), 1 + i % 12, Math.sin(a) * (8 + i % 28)); }
  const particleGeometry = new THREE.BufferGeometry(); particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dataPositions, 3)); const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: '#76e4e8', size: .045, transparent: true, opacity: .6 })); main.add(particles);

  const realms = {} as Record<RealmId, { group: THREE.Group; interactables: Interactable[]; obstacles: Obstacle[]; lights: THREE.Mesh[] }>;
  (['interngo', 'fclabs', 'aokah'] as RealmId[]).forEach((id, index) => {
    const color = [palette.lime, palette.cyan, palette.violet][index]; const group = new THREE.Group(); group.visible = false; scene.add(group); const list: Interactable[] = []; const lights: THREE.Mesh[] = []; const realmObstacles: Obstacle[] = [];
    platform(group, 0, 0, 13, color); const grid = new THREE.GridHelper(18, 18, new THREE.Color(color).multiplyScalar(.25), 0x192a3c); grid.position.y = .02; group.add(grid);
    label(group, `${id} / ${['WORKFLOW COMMAND CENTER', 'DIGITAL CAMPUS', 'CONTEXT ENGINE'][index]}`, 0, 6.5, -5, color, 1.3);
    terminal(group, `mission:${id}`, ['Restore the workflow', 'Activate the campus', 'Awaken the AI core'][index], 0, 2.7, color, list);
    portal(group, 'exit', 'Return to the codeverse', 0, 9, '#7693b5', list);
    if (id === 'interngo') {
      for (let i = 0; i < 6; i++) { const a = Math.PI + i * Math.PI / 5; const px = Math.cos(a) * 6.8, pz = -2 + Math.sin(a) * 4.2;
        cylinder(group, px, .5, pz, .8, 1, '#1d3442'); const panel = box(group, px, 2, pz, 1.65, 1.3, .1, '#31492d', true); panel.material = (panel.material as THREE.Material).clone(); lights.push(panel); label(group, ['Attendance', 'Performance', 'Resources', 'Helpdesk', 'Analytics', 'Daily report'][i], px, 3.15, pz, color, .45);
        connect(group, [new THREE.Vector3(px, .07, pz), new THREE.Vector3(0, .07, 0)], color, .3); list.push({ id: 'mission:interngo', name: 'Connect workflow modules', position: new THREE.Vector3(px, 0, pz), mesh: panel });
      }
      ring(group, 0, 2, -2, 2, color, true); const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.8), material(color, true, .7)); core.position.set(0, 2, -2); group.add(core); animated.push({ object: core, kind: 'rotate', base: 2, speed: .25 });
    } else if (id === 'fclabs') {
      for (let i = 0; i < 6; i++) { const px = (i % 3 - 1) * 4.5, pz = -3 - Math.floor(i / 3) * 4; const h = 1 + (i % 3) * .5; box(group, px, h / 2, pz, 2.3, h, 2, '#213f54'); box(group, px, h + .1, pz, 2.5, .2, 2.2, '#234659'); realmObstacles.push({ x: px, z: pz, width: 2.3, depth: 2, height: h }); const lamp = box(group, px, h / 2, pz + 1.02, 1.9, .06, .04, color, true); lights.push(lamp); label(group, ['React Studio', 'API Workshop', 'Learning archive', 'Trainers', 'Participation', 'Analytics'][i], px, h + .8, pz, color, .42); }
    } else {
      const reactor = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 1), new THREE.MeshBasicMaterial({ color, wireframe: true })); reactor.position.set(0, 3.5, -3); group.add(reactor); animated.push({ object: reactor, kind: 'rotate', base: 3.5, speed: .2 }); lights.push(reactor);
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; const px = Math.cos(a) * 5, pz = -3 + Math.sin(a) * 4; const node = ball(group, px, 2 + i % 2, pz, .35, '#584775', true); node.material = (node.material as THREE.Material).clone(); lights.push(node); connect(group, [node.position, reactor.position], color); label(group, ['Documents', 'Extraction', 'Processing', 'Retrieval', 'LLM', 'Response'][i], px, 3.1 + i % 2, pz, color, .4); }
      const orbit = ring(group, 0, 3.5, -3, 2.4, color); orbit.rotation.x = .6; animated.push({ object: orbit, kind: 'ring', base: 3.5, speed: .2 });
    }
    realms[id] = { group, interactables: list, obstacles: realmObstacles, lights };
  });

  // Original, articulated explorer with animated limbs and a luminous visor.
  const avatar = new THREE.Group(); scene.add(avatar); const body = new THREE.Group(); avatar.add(body);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.3, .55, 4, 8), material('#223c51')); torso.position.y = 1.05; body.add(torso);
  box(body, 0, 1.18, -.29, .18, .06, .045, palette.cyan, true); box(body, 0, 1.2, .3, .24, .32, .17, '#102b3e');
  const head = ball(body, 0, 1.68, 0, .27, '#213c51'); head.scale.y *= 1.1;
  box(body, 0, 1.72, -.245, .39, .1, .07, palette.cyan, true); ring(body, 0, 1.42, 0, .23, '#64c9df', true, .018);
  const limbs: THREE.Group[] = [];
  [-1, 1].forEach(side => {
    const arm = new THREE.Group(); arm.position.set(side * .4, 1.2, 0); body.add(arm); const armMesh = new THREE.Mesh(new THREE.CapsuleGeometry(.09, .4, 3, 6), material('#29475b')); armMesh.position.y = -.24; arm.add(armMesh); box(arm, 0, -.36, -.09, .11, .06, .03, palette.cyan, true); limbs.push(arm);
    const leg = new THREE.Group(); leg.position.set(side * .16, .72, 0); body.add(leg); const legMesh = new THREE.Mesh(new THREE.CapsuleGeometry(.115, .4, 3, 6), material('#182e43')); legMesh.position.y = -.25; leg.add(legMesh); box(leg, 0, -.56, -.07, .23, .14, .36, '#244257'); limbs.push(leg);
  });
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(.55, 24), new THREE.MeshBasicMaterial({ color: '#00020b', transparent: true, opacity: .5, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = .035; avatar.add(shadow);
  const pointerRing = ring(avatar, 0, .045, 0, .7, '#70d5e3', true, .018);
  function update(time: number, movement: number, reducedMotion: boolean, showParticles: boolean) {
    if (!reducedMotion) animated.forEach(({ object, kind, base, speed }) => {
      if (!object.visible) return;
      if (kind === 'float') object.position.y = base + Math.sin(time * speed) * .1;
      else { object.rotation.y = time * speed; if (kind === 'ring') object.rotation.z = time * speed * .3; else object.position.y = base + Math.sin(time * .7) * .08; }
    });
    particles.visible = showParticles; stars.visible = showParticles;
    if (!reducedMotion && showParticles) particles.rotation.y = time * .006;
    limbs.forEach((limb, i) => { limb.rotation.x = Math.sin(time * (movement > 5 ? 13 : 9) + (i === 0 || i === 3 ? 0 : Math.PI)) * Math.min(movement / 7, 1) * .65; });
    body.position.y = reducedMotion ? 0 : Math.sin(time * (movement > .2 ? 18 : 2)) * (movement > .2 ? .025 : .015); pointerRing.rotation.z = time * .2;
  }
  function sync(progress: Progress) {
    completionLights.forEach(({ mesh, id, color }) => { const mat = mesh.material as THREE.MeshBasicMaterial; mat.opacity = progress.completed.includes(id) ? .22 : .055; mat.color.copy(color); });
    const workflow = Array.isArray(progress.data.workflow) ? progress.data.workflow as number[] : [];
    realms.interngo.lights.forEach((mesh, i) => (mesh.material as THREE.MeshBasicMaterial).color.set(workflow.includes(i) || progress.completed.includes('interngo') ? palette.lime : '#31492d'));
    realms.aokah.lights.forEach((mesh, i) => { const stage = Number(progress.data.ragStage || 0); (mesh.material as THREE.MeshBasicMaterial).color.set(progress.completed.includes('aokah') || i <= stage ? palette.violet : '#584775'); });
  }
  function dispose() {
    const geometries = new Set<THREE.BufferGeometry>(), mats = new Set<THREE.Material>();
    scene.traverse(object => { const mesh = object as THREE.Mesh; if (mesh.geometry) geometries.add(mesh.geometry); if (mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(m => mats.add(m)); });
    geometries.forEach(g => g.dispose()); mats.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
  }
  return { main, background, avatar, interactables, obstacles, realms, update, sync, dispose };
}
