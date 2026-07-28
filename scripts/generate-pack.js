/**
 * Generates trivia questions for a blueprint and prints them.
 *
 *
 * Run it with: node --env-file=.env scripts/generate-pack.js food-drink easy 10
 */

const fs = require("fs");
const path = require("path")

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL;

const API_URL = "https://api.openai.com/v1/chat/completions";

const BLUEPRINT_DIR = path.join(__dirname, "blueprints");

const DIFFICULTY = {
    easy: "most adults would answer without having to think",
    medium: "someone with a general interest in the subject would know it, a casual player might guess",
    hard: "needs specific knowledge or real enthusiasm for the subject",
};


function buildPrompt(blueprint, difficulty, count) {
    return `You are writing trivia questions for a pass-and-play party game.

    HOW YOUR ANSWER IS USED
    One player reads the question aloud, another says an answer out loud, and the
    first player decides whether it matched. There is no answer key beyond the
    single string you provide, so the answer must be short and unmistakable.

    TOPIC
    ${blueprint.theme}

    AVOID
    ${blueprint.avoid}

    DIFFICULTY
    Write ${count} questions where ${DIFFICULTY[difficulty]}.

    RULES
    - The answer must be at most four words, and one accepted form only.
    - No alternatives, no parenthetical notes, no explanations.
    - Some questions can be multiple choice given its a difficult enough question.
    - Multiple choice questions can at most make up 20% of the question deck.
    - Nothing that changes over time.
    - No question where a well informed person could reasonably give a different
    answer and still be right.
    - Vary the subject matter across the ${count} questions.

    OUTPUT
    Return JSON only, in exactly this shape:
    {"questions":[{"question":"...","answer":"..."}]}`;
}


async function callModel(prompt) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.8,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI returned ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}


async function main() {
    // read the elements in the prompt after and including the 2nd item   ... food-drink easy 10
    const [name, difficulty = "easy", count = "10"] = process.argv.slice(2); 

    // verify
    if (!name) { throw new Error("No name.");}

    if (!DIFFICULTY[difficulty]) { throw new Error(`Unknown difficulty "${difficulty}"`);}

    const blueprint = JSON.parse(
        fs.readFileSync(path.join(BLUEPRINT_DIR, `${name}.json`), "utf8")
    );

    console.log(`Generating ${count} ${difficulty} questions for "${blueprint.name}" using ${OPENAI_MODEL}...\n`);
    
    const raw = await callModel(buildPrompt(blueprint, difficulty, Number(count)));
    const parsed = JSON.parse(raw);
    const questions = Array.isArray(parsed) ? parsed : parsed.questions ?? [];

    console.log(questions);
}


main();