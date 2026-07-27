import { createMMKV } from 'react-native-mmkv'
import { GameState } from "@/game/types";

export const storage = createMMKV()

const GAME_KEY = 'trivia:save';
const PACKS_KEY = 'trivia:packs';

const SAVE_VERSION = 1; // to prevent changes from breaking with old aves

// --------------- Game -----------------
export function saveGame(state : GameState) {
    storage.set(GAME_KEY, JSON.stringify({ version: SAVE_VERSION, state}));
}


export function loadGame(): GameState | null {
    const raw = storage.getString(GAME_KEY);
    if (!raw) return null;

    try {
        const saved = JSON.parse(raw);

        // a save from an older build cannot be trusted -  wrong shape
        if (saved?.version !== SAVE_VERSION) return null;

        return saved.state;
    } catch {
        return null;
    }
}


export function clearGame() {
    storage.remove(GAME_KEY);
}


// --------------- Packs -----------------
export function savePacks(ids : string[]) {
    storage.set(PACKS_KEY, JSON.stringify(ids));
}


// null means the player has never chosen - different from choosing none
export function loadPacks(): string[] | null {
    const raw = storage.getString(PACKS_KEY);
    return raw ? JSON.parse(raw) : null;
}


