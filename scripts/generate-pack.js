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


function buildPrompt(blueprint, counts) {
    const total = counts.easy + counts.medium + counts.hard;
    const maxChoice = Math.floor(total * 0.2);

    const angles = (blueprint.angles ?? [])
        .map((a) => `- ${a}`)
        .join("\n")

    return `You are writing trivia questions for a pass-and-play party game.

    HOW YOUR ANSWER IS USED
    One player reads the question aloud, another says an answer out loud, and the
    first player decides whether it matched. There is no answer key beyond the
    single string you provide, so the answer must be short and unmistakable.

    TOPIC
    ${blueprint.theme}

    ANGLES
    Come at the topic from these angles, and use every one at least once:
    ${angles}

    AVOID
    ${blueprint.avoid}

    WRITE ${total} QUESTIONS AS A DIFFICULTY LADDER
    - ${counts.easy} easy: about three in five players would get it, though it should
    take a moment's recall rather than being automatic.
    - ${counts.medium} medium: less than half would get it. Someone with a general
    interest knows it, others might reason their way there.
    - ${counts.hard} hard: less than or equal to one in five would get it.

    The levels must be clearly separated. A hard question should be one that a player
    who answered every easy question correctly would still probably miss. If you
    cannot decide whether a question is easy or medium, label it easy.

    HOW TO MAKE A QUESTION HARDER
    Do not reach for a more obscure subject. Ask something more specific about a
    subject people know: a year, a person, a place of origin, a technique, a regional
    variant, or a distinguishing ingredient.

    MULTIPLE CHOICE
    At most ${maxChoice} of the ${total} questions may offer options, and only where
    the question would otherwise be unanswerable. Write the options inside the
    question text, like this:

    "Which country did the croissant originate in?\\n\\nA) France\\nB) Austria\\nC) Italy\\nD) Turkey"

    The answer field must be the option's text, not its letter.

    RULES
    - The answer must be at most four words, and one accepted form only.
    - No alternatives, no parenthetical notes, no explanations.
    - No question where a well informed person could reasonably give a different
    answer and still be right.
    - An easy question should still be a question. If the answer is obvious to anyone who has 
    heard of the subject, it is too easy.
    - Use ${total} different subjects. Never ask two questions about the same thing.
    - DO NOT mention the answer in the question

    OUTPUT
    Return JSON only, in exactly this shape:
    {"questions":[{"question":"...","answer":"...","difficulty":"easy"}]}
    difficulty must be exactly "easy", "medium" or "hard".`;
};


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
    // read the elements in the prompt after and including the 2nd item
    const [name, perLevel] = process.argv.slice(2);

    // verify
    if (!name) { throw new Error("No name.");}

    const blueprint = JSON.parse(
        fs.readFileSync(path.join(BLUEPRINT_DIR, `${name}.json`), "utf8")
    );

    console.log(`Generating for "${blueprint.name}" using ${OPENAI_MODEL}...\n`);

    const counts = { easy: Number(perLevel), medium: Number(perLevel), hard: Number(perLevel) }

    const raw = await callModel(buildPrompt(blueprint, counts));
    const parsed = JSON.parse(raw);
    const questions = Array.isArray(parsed) ? parsed : parsed.questions ?? [];

    for (const level of ["easy", "medium", "hard"]) {
        const group = questions.filter((q) => q.difficulty === level);

        console.log(`\n${level.toUpperCase()}  (${group.length})\n`);

        group.forEach((q) => {
            console.log(`  ${q.question}`);
            console.log(`    → ${q.answer}\n`);
        });
    }
}


main();