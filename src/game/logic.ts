import { zones, missionDefinitions, emptyProgress, type Progress } from './config';

export type Obstacle = { x: number; z: number; width: number; depth: number; height: number };
export function pointSegmentDistance(x: number, z: number, ax: number, az: number, bx: number, bz: number): number {
  const dx = bx - ax, dz = bz - az;
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1)));
  return Math.hypot(x - (ax + t * dx), z - (az + t * dz));
}
export function onWalkableGround(x: number, z: number, radius = .35): boolean {
  if (Math.hypot(x, z) < 12.8 - radius) return true;
  return zones.some(zone => Math.hypot(x - zone.position[0], z - zone.position[1]) < 8.1 - radius || pointSegmentDistance(x, z, 0, 0, zone.position[0], zone.position[1]) < 2.55 - radius);
}
export function canMoveTo(x: number, z: number, obstacles: Obstacle[], radius = .35): boolean {
  return onWalkableGround(x, z, radius) && !obstacles.some(o => Math.abs(x - o.x) < o.width / 2 + radius && Math.abs(z - o.z) < o.depth / 2 + radius);
}
export function nextInSequence<T>(sequence: readonly T[], route: T[], selected: T): { valid: boolean; route: T[]; complete: boolean } {
  if (selected !== sequence[route.length]) return { valid: false, route, complete: false };
  const next = [...route, selected];
  return { valid: true, route: next, complete: next.length === sequence.length };
}
export function cleanSample(source: string): string { return source.replace(/\r/g, '').split('\n').map(line => line.trim().replace(/\s+/g, ' ')).filter(Boolean).join('\n'); }
export function segmentText(text: string): string[] { return text.match(/[\p{L}\p{M}\p{N}]+|[^\s\p{L}\p{M}\p{N}]/gu) ?? []; }
export function sanitizeProgress(value: unknown): Progress {
  if (!value || typeof value !== 'object') return emptyProgress();
  const candidate = value as Partial<Progress>;
  const completed = Array.isArray(candidate.completed) ? candidate.completed.filter(v => typeof v === 'string' && missionDefinitions.some(m => m.id === v)) : [];
  const visited = Array.isArray(candidate.visited) ? candidate.visited.filter(v => typeof v === 'string' && zones.some(z => z.id === v)) : [];
  const data: Progress['data'] = {};
  if (candidate.data && typeof candidate.data === 'object') for (const [key, val] of Object.entries(candidate.data)) {
    if (key.length > 50 || ['__proto__', 'constructor', 'prototype'].includes(key)) continue;
    if (typeof val === 'string') data[key] = val.slice(0, 500);
    else if (typeof val === 'number' && Number.isFinite(val)) data[key] = Math.max(0, Math.min(val, 100));
    else if (typeof val === 'boolean') data[key] = val;
    else if (Array.isArray(val) && val.length <= 40 && val.every(v => typeof v === 'string')) data[key] = val.map(v => v.slice(0, 100));
    else if (Array.isArray(val) && val.length <= 40 && val.every(v => typeof v === 'number' && Number.isFinite(v))) data[key] = val;
  }
  return { completed: [...new Set(completed)], visited: [...new Set(visited)], data };
}
