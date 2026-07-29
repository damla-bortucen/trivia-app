import { Question, Category, Pack } from "./types";

import entertainment from "@/assets/packs/entertainment.json";
import generalKnowledge from "@/assets/packs/general-knowledge.json";
import geography from "@/assets/packs/geography.json";
import history from "@/assets/packs/history.json";
import scienceNature from "@/assets/packs/science-nature.json";
import sports from "@/assets/packs/sports.json";
import mythology from "@/assets/packs/mythology.json";
import art from "@/assets/packs/art.json";
import foodDrink from "@/assets/packs/food-drink.json";

const PACKS = [
    entertainment,
    generalKnowledge,
    geography,
    history,
    scienceNature,
    sports,
    mythology,
    art,
    foodDrink,
] as Pack[];

export const MAX_PACKS = 6;
export const DEFAULT_PACK_IDS = PACKS.slice(0, MAX_PACKS).map((p) => p.id);

export function getPacks(): Pack[] {
    return PACKS;
}

export function getPackById(id : Category): Pack | undefined {
    return PACKS.find((p) => p.id === id)
}

// get all questions belongong to given packs
export function getPackQuestions(ids : Category[]): Question[] {
    // flatMap maps each id to that pack's question array, then flattens the arrays into one
    return ids.flatMap((id) => getPackById(id)?.questions ?? []); 
}