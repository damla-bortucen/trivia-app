import { createMMKV } from 'react-native-mmkv'
import { GameState } from "@/game/types";

export const storage = createMMKV()

const GAME_KEY = 'trivia:save';
const PACKS_KEY = 'trivia:packs';

// --------------- Game -----------------
export function saveGame(state : GameState) {
    storage.set(GAME_KEY, JSON.stringify(state));
}


export function loadGame() {
  const raw = storage.getString(GAME_KEY);
  return raw ? JSON.parse(raw) : null;
}


export function clearGame() {
  storage.remove(GAME_KEY);
}


// --------------- Packs -----------------
export function savePacks(state : GameState) {
  storage.set(PACKS_KEY, JSON.stringify(state));
}


// null means the player has never chosen - different from choosing none
export function loadPacks(): string[] | null {
  const raw = storage.getString(PACKS_KEY);
  return raw ? JSON.parse(raw) : null;
}


