import { createContext, useContext } from 'react';
import type { Progress, ProgressValue } from './config';
export type GameContextValue = {
  progress: Progress;
  complete: (id: string) => void;
  setData: (key: string, value: ProgressValue) => void;
  notice: (message: string) => void;
  copy: (details?: boolean) => void;
  quick: () => void;
  restart: () => void;
  navigate: (id: string) => void;
  enterProject: (id: string) => void;
};
export const GameContext = createContext<GameContextValue | null>(null);
export function useGame() { const value = useContext(GameContext); if (!value) throw new Error('Game provider unavailable'); return value; }
export function stringArray(value: unknown): string[] { return Array.isArray(value) && value.every(v => typeof v === 'string') ? value : []; }
export function numberArray(value: unknown): number[] { return Array.isArray(value) && value.every(v => typeof v === 'number') ? value : []; }
