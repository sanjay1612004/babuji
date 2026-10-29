import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { buildWorld, type Interactable, type RealmId } from './world';
import { canMoveTo } from './logic';
import { zones, type GameSettings, type Progress } from './config';

export type JoystickInput = { x: number; y: number; jump: boolean; sprint: boolean };
export type Telemetry = { x: number; y: number; z: number; yaw: number; zone: string; near: { id: string; name: string } | null; realm: RealmId | null; speed: number };
export type EngineApi = { destination: (id: string | null) => void; teleport: (id: string) => void; enterRealm: (id: RealmId) => void; exitRealm: () => void; resetCamera: () => void; settings: (value: GameSettings) => void; progress: (value: Progress) => void; dispose: () => void };
export type EngineOptions = { mode: () => 'welcome' | 'play' | 'paused' | 'quick'; input: JoystickInput; settings: GameSettings; telemetry: (value: Telemetry) => void; interact: (id: string) => void; failure: () => void };

export function createEngine(container: HTMLElement, options: EngineOptions): EngineApi {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
  renderer.setClearColor('#091026'); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
  renderer.domElement.setAttribute('aria-label', 'Explorable 3D Codeverse. Use WASD or arrows to move, drag to orbit, E to interact. All content is also available in Quick Portfolio.');
  renderer.domElement.setAttribute('role', 'img'); renderer.domElement.style.touchAction = 'none'; container.appendChild(renderer.domElement);
  renderer.domElement.tabIndex = 0;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#091026'); scene.fog = new THREE.FogExp2('#091026', .006);
  const camera = new THREE.PerspectiveCamera(48, 1, .1, 240);
  scene.add(new THREE.HemisphereLight('#b4dafa', '#24334a', 2.3));
  const keyLight = new THREE.DirectionalLight('#acd9ff', 2.6); keyLight.position.set(20, 35, 10); scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight('#ad9dff', 1.5); fillLight.position.set(-25, 14, -20); scene.add(fillLight);
  const coreLight = new THREE.PointLight('#57e5ee', 30, 28, 1.4); coreLight.position.set(0, 7, 0); scene.add(coreLight);
  const world = buildWorld(scene);
  const player = new THREE.Vector3(0, 0, 6), velocity = new THREE.Vector3();
  let settings = options.settings, realm: RealmId | null = null;
  let effectiveQuality = settings.quality;
  let yaw = .15, pitch = .53, jumpVelocity = 0, jumpLatched = false;
  let frame = 0, last = performance.now(), time = 0, lastTelemetry = 0, disposed = false;
  let lastMode = options.mode(); let cinematic = 0;
  const keys = new Set<string>(); let dragging = false, dragDistance = 0, lastX = 0, lastY = 0;
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), .55, .5, .65); composer.addPass(bloom); composer.addPass(new OutputPass());
  const cameraTarget = new THREE.Vector3(), idealCamera = new THREE.Vector3(), followTarget = new THREE.Vector3();
  const ray = new THREE.Ray(), rayDirection = new THREE.Vector3(), box = new THREE.Box3(), hit = new THREE.Vector3();
  function activeList(): Interactable[] { return realm ? world.realms[realm].interactables : world.interactables; }
  function resize() {
    const { width, height } = container.getBoundingClientRect(); if (!width || !height || disposed) return;
    const pixelRatio = Math.min(devicePixelRatio || 1, effectiveQuality === 'high' ? 1.5 : effectiveQuality === 'medium' ? 1.2 : .85);
    renderer.setPixelRatio(pixelRatio); renderer.setSize(width, height); composer.setPixelRatio(pixelRatio); composer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix();
    bloom.enabled = effectiveQuality === 'high';
  }
  const observer = new ResizeObserver(resize); observer.observe(container); resize();
  function telemetry() {
    let nearest: Interactable | null = null, distance = 3.6;
    activeList().forEach(item => { const d = Math.hypot(player.x - item.position.x, player.z - item.position.z); if (d < distance) { distance = d; nearest = item; } });
    let zone = 'hub';
    if (realm) zone = 'projects'; else zones.forEach(z => { if (Math.hypot(player.x - z.position[0], player.z - z.position[1]) < 9) zone = z.id; });
    const closest = nearest as Interactable | null;
    options.telemetry({ x: player.x, y: player.y, z: player.z, yaw, zone, realm, speed: velocity.length(), near: closest ? { id: closest.id, name: closest.name } : null });
  }
  function clearInput() { keys.clear(); options.input.x = 0; options.input.y = 0; options.input.jump = false; velocity.set(0, 0, 0); }
  function onKey(event: KeyboardEvent, down: boolean) {
    if (options.mode() !== 'play' || (event.target as HTMLElement)?.closest('input,textarea,select,dialog') || (event.code === 'Space' && (event.target as HTMLElement)?.closest('button,a'))) { if (!down) keys.delete(event.code); return; }
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight', 'Space'].includes(event.code)) {
      event.preventDefault(); if (down) keys.add(event.code); else keys.delete(event.code);
    }
  }
  const keydown = (e: KeyboardEvent) => onKey(e, true), keyup = (e: KeyboardEvent) => onKey(e, false);
  window.addEventListener('keydown', keydown); window.addEventListener('keyup', keyup); window.addEventListener('blur', clearInput);
  const canvas = renderer.domElement;
  function pointerDown(e: PointerEvent) { if (options.mode() !== 'play') return; dragging = true; dragDistance = 0; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); }
  function pointerMove(e: PointerEvent) { if (!dragging || options.mode() !== 'play') return; const dx = e.clientX - lastX, dy = e.clientY - lastY; dragDistance += Math.abs(dx) + Math.abs(dy); yaw -= dx * .005; pitch = THREE.MathUtils.clamp(pitch + dy * .003, .28, 1.05); lastX = e.clientX; lastY = e.clientY; }
  function pointerUp(e: PointerEvent) {
    if (!dragging) return; dragging = false; if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    if (dragDistance > 6 || options.mode() !== 'play') return;
    const rect = canvas.getBoundingClientRect(); const pointer = new THREE.Vector2((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1); const raycaster = new THREE.Raycaster(); raycaster.setFromCamera(pointer, camera);
    const targets = activeList(); const hits = raycaster.intersectObjects(targets.map(t => t.mesh), true);
    if (hits[0]) { const target = targets.find(t => t.mesh === hits[0].object || t.mesh.children.includes(hits[0].object)); if (target) options.interact(target.id); }
  }
  canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('pointermove', pointerMove); canvas.addEventListener('pointerup', pointerUp); canvas.addEventListener('pointercancel', pointerUp);
  const contextLost = (e: Event) => { e.preventDefault(); options.failure(); }; canvas.addEventListener('webglcontextlost', contextLost);
  function movable(x: number, z: number) { return realm ? Math.hypot(x, z) < 12.1 && canMoveTo(x, z, world.realms[realm].obstacles) : canMoveTo(x, z, world.obstacles); }
  function move(dt: number) {
    const horizontal = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft')) + options.input.x;
    const vertical = Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown')) - options.input.y;
    const sprint = keys.has('ShiftLeft') || keys.has('ShiftRight') || options.input.sprint;
    const speed = sprint ? 8 : 4.7;
    const vector = new THREE.Vector3(horizontal * Math.cos(yaw) - vertical * Math.sin(yaw), 0, -horizontal * Math.sin(yaw) - vertical * Math.cos(yaw));
    if (vector.lengthSq() > 1) vector.normalize(); vector.multiplyScalar(speed);
    velocity.lerp(vector, 1 - Math.exp(-dt * 12));
    const nextX = player.x + velocity.x * dt, nextZ = player.z + velocity.z * dt;
    if (movable(nextX, player.z)) player.x = nextX; else velocity.x = 0;
    if (movable(player.x, nextZ)) player.z = nextZ; else velocity.z = 0;
    const jump = keys.has('Space') || options.input.jump;
    if (jump && !jumpLatched && player.y < .01) { jumpVelocity = 5.8; jumpLatched = true; }
    if (!jump) jumpLatched = false;
    jumpVelocity -= 15 * dt; player.y = Math.max(0, player.y + jumpVelocity * dt); if (!player.y) jumpVelocity = 0;
    world.avatar.position.copy(player);
    if (velocity.lengthSq() > .03) { const target = Math.atan2(-velocity.x, -velocity.z); const difference = Math.atan2(Math.sin(target - world.avatar.rotation.y), Math.cos(target - world.avatar.rotation.y)); world.avatar.rotation.y += difference * (1 - Math.exp(-dt * 14)); }
  }
  let performanceStart = performance.now(), performanceFrames = 0, lastRender = 0;
  function draw(now: number) {
    if (disposed) return;
    const dt = Math.min((now - last) / 1000, .1); last = now; const mode = options.mode();
    if (document.hidden || mode === 'quick') { performanceStart = now; performanceFrames = 0; frame = requestAnimationFrame(draw); return; }
    if (mode === 'paused' && now - lastRender < 250) { performanceStart = now; performanceFrames = 0; frame = requestAnimationFrame(draw); return; }
    if (mode !== lastMode) { clearInput(); cinematic = settings.reducedMotion ? 0 : .65; lastMode = mode; }
    if (mode === 'play') move(dt); else velocity.multiplyScalar(.5);
    if (mode === 'welcome') {
      const angle = settings.reducedMotion ? .68 : .68 + Math.sin(now / 25000) * .045;
      camera.position.set(Math.sin(angle) * 67, 43, Math.cos(angle) * 67); camera.lookAt(-8, -.5, -3); world.avatar.position.copy(player);
    } else {
      followTarget.set(player.x, player.y + 1.2, player.z);
      const distance = container.clientWidth < 700 ? 19 : 21;
      idealCamera.set(player.x + Math.sin(yaw) * distance, player.y + 3 + Math.sin(pitch) * distance * .9, player.z + Math.cos(yaw) * distance);
      if (!realm) {
        rayDirection.copy(idealCamera).sub(followTarget); const originalLength = rayDirection.length(); ray.set(followTarget, rayDirection.normalize()); let closest = originalLength;
        world.obstacles.forEach(obstacle => { box.min.set(obstacle.x - obstacle.width / 2 - .2, 0, obstacle.z - obstacle.depth / 2 - .2); box.max.set(obstacle.x + obstacle.width / 2 + .2, obstacle.height + .2, obstacle.z + obstacle.depth / 2 + .2); if (ray.intersectBox(box, hit)) { const distanceTo = hit.distanceTo(followTarget) - .4; if (distanceTo > 1.7 && distanceTo < closest) closest = distanceTo; } });
        if (closest < originalLength) idealCamera.copy(followTarget).addScaledVector(rayDirection, closest);
      }
      const damping = settings.reducedMotion ? 1 : 1 - Math.exp(-dt * (cinematic > 0 ? 4 : 9)); camera.position.lerp(idealCamera, damping); cameraTarget.lerp(followTarget, damping); camera.lookAt(cameraTarget); cinematic = Math.max(0, cinematic - dt);
    }
    if (mode === 'play' || mode === 'welcome') { time += dt; world.update(time, velocity.length(), settings.reducedMotion, settings.particles); }
    if (now - lastTelemetry > 110) { telemetry(); lastTelemetry = now; }
    performanceFrames++;
    if (now - performanceStart > 3500) {
      const fps = performanceFrames / ((now - performanceStart) / 1000);
      if (fps < 23 && effectiveQuality !== 'low') { effectiveQuality = effectiveQuality === 'high' ? 'medium' : 'low'; resize(); }
      performanceStart = now; performanceFrames = 0;
    }
    if (effectiveQuality === 'high') composer.render(); else renderer.render(scene, camera);
    lastRender = now;
    frame = requestAnimationFrame(draw);
  }
  frame = requestAnimationFrame(draw);
  function setRealm(id: RealmId | null) {
    realm = id; world.main.visible = !id; world.background.visible = !id; Object.entries(world.realms).forEach(([key, value]) => { value.group.visible = key === id; });
    player.set(0, 0, 6); clearInput(); yaw = 0; pitch = .53; cinematic = settings.reducedMotion ? 0 : .6; telemetry();
  }
  return {
    destination: id => world.destination(id),
    teleport(id) {
      if (realm) setRealm(null);
      const zone = zones.find(z => z.id === id);
      if (zone) { const [x, z] = zone.position; player.set(x, 0, z + 4); if (!movable(player.x, player.z)) player.set(x, 0, z + 3); }
      else player.set(0, 0, 6);
      clearInput(); yaw = 0; pitch = .53; cinematic = settings.reducedMotion ? 0 : .6; telemetry();
    },
    enterRealm: id => setRealm(id),
    exitRealm() { setRealm(null); const zone = zones.find(z => z.id === 'projects')!; player.set(zone.position[0], 0, zone.position[1] + 5); telemetry(); },
    resetCamera() { yaw = 0; pitch = .53; cinematic = .3; },
    settings(value) { if (value.quality !== settings.quality) effectiveQuality = value.quality; settings = value; resize(); },
    progress(value) { world.sync(value); },
    dispose() { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('keydown', keydown); window.removeEventListener('keyup', keyup); window.removeEventListener('blur', clearInput); canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointermove', pointerMove); canvas.removeEventListener('pointerup', pointerUp); canvas.removeEventListener('pointercancel', pointerUp); canvas.removeEventListener('webglcontextlost', contextLost); world.dispose(); composer.passes.forEach(pass => pass.dispose()); composer.dispose(); renderer.dispose(); canvas.remove(); },
  };
}
