import { Question, Category, Pack } from "./types";

import entertainment from "@/assets/packs/entertainment.json";
import generalKnowledge from "@/assets/packs/general-knowledge.json";
import geography from "@/assets/packs/geography.json";
import history from "@/assets/packs/history.json";
import scienceNature from "@/assets/packs/science-nature.json";
import sports from "@/assets/packs/sports.json";
import mythology from "@/assets/packs/mythology.json";
import art from "@/assets/packs/art.json";
import foodDrinkAi from "@/assets/packs/food-drink-ai.json";
import generalKnowledgeAi from "@/assets/packs/general-knowledge-ai.json";
import geographyAi from "@/assets/packs/geography-ai.json";
import historyAi from "@/assets/packs/history-ai.json";
import scienceNatureAi from "@/assets/packs/science-nature-ai.json";
import sportsAi from "@/assets/packs/sports-ai.json";
import mythologyAi from "@/assets/packs/mythology-ai.json";
import filmTvAi from "@/assets/packs/film-tv-ai.json";
import literatureAi from "@/assets/packs/literature-ai.json";
import musicAi from "@/assets/packs/music-ai.json";

const PACKS = [
    entertainment,
    generalKnowledge,
    geography,
    history,
    scienceNature,
    sports,
    mythology,
    art,
    foodDrinkAi,
    generalKnowledgeAi,
    geographyAi,
    historyAi,
    mythologyAi,
    scienceNatureAi,
    sportsAi,
    filmTvAi,
    literatureAi,
    musicAi,
] as Pack[];

export const MAX_PACKS = 6;

export const DEFAULT_PACK_IDS = ["general-knowledge", "history", "geography", "science-nature", "entertainment", "sports"];

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