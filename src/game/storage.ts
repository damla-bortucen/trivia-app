import { createMMKV } from 'react-native-mmkv'
import { GameState } from "@/game/types";

export const storage = createMMKV()
const STORAGE_KEY = 'trivia:save';


export function saveGame(state : GameState) {
  storage.set(STORAGE_KEY, JSON.stringify(state));
}


export function loadGame() {
  const raw = storage.getString(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}


export function clearGame() {
  storage.delete(STORAGE_KEY);
}


