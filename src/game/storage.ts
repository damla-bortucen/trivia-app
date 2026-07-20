import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameState } from "@/game/types";

const STORAGE_KEY = '@save';


export async function saveGame(game: GameState): Promise<void> { // return type of an async function must be a Promise
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(game));
    } catch (e) {
        console.warn("Failed to save game", e);
    }
}


export async function loadGame(): Promise<GameState | null> {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        return stored ? (JSON.parse(stored) as GameState) : null
    }  catch (e) {
        console.warn("Failed to load game", e);
        return null;
    }
}


export async function clearGame(): Promise<void> {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.warn("Failed to clear game", e);
    }
}


