/**
 * Wraps each question json from open trivia db in a self-contained pack.
 * Packs have an id, a name, a description, a color and questions.
 * 
 * Run with: node scripts/reformatQuestionPacks.js
 */

const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "..", "assets", "questions");
const OUTPUT_DIR = path.join(__dirname, "..", "assets", "packs")

const PACKS = {
  "entertainment.json": {
    id: "entertainment",
    name: "Entertainment",
    description: "Film, television and music.",
    color: "#fc716b",
  },
  "general-knowledge.json": {
    id: "general-knowledge",
    name: "General Knowledge",
    description: "A bit of everything.",
    color: "#b3a7fe",
  },
  "geography.json": {
    id: "geography",
    name: "Geography",
    description: "Countries, capitals and landmarks.",
    color: "#fb9b00",
  },
  "history.json": {
    id: "history",
    name: "History",
    description: "People and events that shaped the world.",
    color: "#f7da21",
  },
  "science-nature.json": {
    id: "science-nature",
    name: "Science and Nature",
    description: "The natural world and how it works.",
    color: "#6AAA64",
  },
  "sports.json": {
    id: "sports",
    name: "Sports",
    description: "Teams, records and the people who set them.",
    color: "#daa8d0",
  },
  "mythology.json": {
    id: "mythology",
    name: "Mythology",
    description: "Gods, monsters and ancient legends.",
    color: "#7ba8ef",
  },
  "art.json": {
    id: "art",
    name: "Art",
    description: "Painters, sculptors and famous works.",
    color: "#c0ddd9",
  },
};

async function main() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    for (const [file, meta] of Object.entries(PACKS)) {
        const questions = JSON.parse(fs.readFileSync(path.join(SRC_DIR, file), "utf8"));

        fs.writeFileSync(
            path.join(OUTPUT_DIR, file),
            JSON.stringify(
                {
                    ...meta,
                    // category comes from the pack id so the two can never disagree
                    questions: questions.map((q) => ({ ...q, category: meta.id })),
                },
                null,
                2
            ) + "\n"
        );

        console.log(`${file}: ${questions.length} questions -> ${meta.id}`);
    }
}

main();