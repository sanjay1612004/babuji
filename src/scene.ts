import * as THREE from 'three';

export function mountScene(container: HTMLElement): () => void {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' }); } catch { return () => {}; }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
  camera.position.z = 8;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  const group = new THREE.Group();
  scene.add(group);
  const points: THREE.Vector3[] = [];
  // Deterministic Fibonacci sphere keeps the network spatially balanced.
  for (let i = 0; i < 56; i++) {
    const y = 1 - i / 55 * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * i;
    points.push(new THREE.Vector3(Math.cos(theta) * radius * 2.9, y * 3.2, Math.sin(theta) * radius * 2.9));
  }
  const pointGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const pointMaterial = new THREE.PointsMaterial({ size: .038, color: 0xbdff78, transparent: true, opacity: .65, sizeAttenuation: true });
  group.add(new THREE.Points(pointGeometry, pointMaterial));
  const connections: number[] = [];
  points.forEach((p, i) => points.forEach((q, j) => { if (j > i && p.distanceTo(q) < 1.7) connections.push(p.x, p.y, p.z, q.x, q.y, q.z); }));
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connections, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x81ae73, transparent: true, opacity: .12 });
  group.add(new THREE.LineSegments(lineGeometry, lineMaterial));
  let pointerX = 0; let pointerY = 0; let frame = 0; let visible = true; let running = false;
  const resize = new ResizeObserver(() => { const { width, height } = container.getBoundingClientRect(); if (!width || !height) return; renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); });
  resize.observe(container);
  const onPointer = (e: PointerEvent) => { pointerX = (e.clientX / innerWidth - .5) * .3; pointerY = (e.clientY / innerHeight - .5) * .2; };
  window.addEventListener('pointermove', onPointer, { passive: true });
  const draw = () => {
    if (!visible || document.hidden) { running = false; return; }
    running = true; group.rotation.y += .0011; group.rotation.x += (pointerY - group.rotation.x) * .025; group.position.x += (pointerX - group.position.x) * .025;
    renderer.render(scene, camera); frame = requestAnimationFrame(draw);
  };
  const resume = () => { if (visible && !document.hidden && !running) draw(); };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); }, { rootMargin: '80px' });
  observer.observe(container); document.addEventListener('visibilitychange', resume); draw();
  return () => { cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); window.removeEventListener('pointermove', onPointer); document.removeEventListener('visibilitychange', resume); pointGeometry.dispose(); pointMaterial.dispose(); lineGeometry.dispose(); lineMaterial.dispose(); renderer.dispose(); renderer.domElement.remove(); };
}
