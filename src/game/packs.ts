import { Question, Category, Pack } from "./types";

import entertainment from "@/assets/packs/entertainment.json";
import generalKnowledge from "@/assets/packs/general-knowledge.json";
import geography from "@/assets/packs/geography.json";
import history from "@/assets/packs/history.json";
import scienceNature from "@/assets/packs/science-nature.json";
import sports from "@/assets/packs/sports.json";

const PACKS = [
    entertainment,
    generalKnowledge,
    geography,
    history,
    scienceNature,
    sports,
] as Pack[];

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