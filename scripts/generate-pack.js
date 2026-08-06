/**
 * Generates trivia questions for a blueprint and prints them.
 *
 *
 * Run it with:
 * node --env-file=.env scripts/generate-pack.js food-drink-ai 5           # read only, with custom number
 * node --env-file=.env scripts/generate-pack.js food-drink-ai             # read only, full counts
 * node --env-file=.env scripts/generate-pack.js food-drink-ai --save      # full counts, writes
 */

const fs = require("fs");
const path = require("path")

const { setGlobalDispatcher, Agent } = require("undici");

// node's http client aborts if response headers take longer than five minutes,
// and a reasoning model sends none at all until it has finished thinking.
// zero disables the limit
setGlobalDispatcher(new Agent({ headersTimeout: 0, bodyTimeout: 0 }));

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL;
const API_URL = "https://api.openai.com/v1/chat/completions";

const BLUEPRINT_DIR = path.join(__dirname, "blueprints");
const PACKS_DIR = path.join(__dirname, "..", "assets", "packs");

const LEVELS = ["easy", "medium", "hard"];
const POINTS = { easy: 1, medium: 2, hard: 3 };


// ----------------------------- PROMPT ---------------------------------
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

    The difficulty levels must be clearly separated. A hard question should be one that a player
    who answered every easy question correctly would still probably miss. If you
    cannot decide whether a question is easy or medium, label it easy.

    HOW TO MAKE A QUESTION HARDER
    Do not reach for a more obscure subject. Ask something more specific about a
    subject people know: a year, a person, a place of origin, a technique, a regional
    variant, or a distinguishing ingredient.

    MULTIPLE CHOICE
    At most ${maxChoice} of the ${total} questions may offer options and at least 15 of them should, 
    and only where the question would otherwise be unanswerable or way harder. Write the options inside the
    question text, like this:

    "Which country did the croissant originate in?\\n\\nA) France\\nB) Austria\\nC) Italy\\nD) Turkey"

    The answer field must be the option's text, not its letter.
    There must be at least 3 options and at most 4 per question.

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



// ------------------------ GENERATE, VALIDATE, SAVE  ----------------------------
function parseArgs() {
    // read the elements in the prompt after and including the 2nd item
    // avoid --save landing in the name or perLevel slot
    const args = process.argv.slice(2);
    const save = args.includes("--save");
    const [name, countText] = args.filter((arg) => arg !== "--save");

    // optional: a number overrides the blueprint counts for quick test runs
    const perLevel = countText === undefined ? null : Number(countText);

    if (!name || (perLevel !== null && (!Number.isInteger(perLevel) || perLevel < 1))) {        
        throw new Error("Usage: node --env-file=.env scripts/generate-pack.js <name> <per-level> [--save]");
    }

    if (!API_KEY || !OPENAI_MODEL) {
        throw new Error("OPENAI_API_KEY and OPENAI_MODEL must be set.");
    }

    return { name, perLevel, save };
}


function loadBlueprint(name) {
    const file = path.join(BLUEPRINT_DIR, `${name}.json`);
    const blueprint = JSON.parse(fs.readFileSync(file, "utf8"));

     // if counts are wrong fail here
    for (const level of LEVELS) {
        if (!Number.isInteger(blueprint.counts?.[level])) {
            throw new Error(`${name}.json needs an integer counts.${level}`);
        }
    }
    return blueprint;
}


async function generateQuestions(prompt) {
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
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message ?? `OpenAI returned ${response.status}`);
    }

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("The model returned no content.");
    }

    const parsed = JSON.parse(content);
    return parsed.questions ?? [];
}


// drop anything the app could not use, and say why
function validate(questions) {
    const seen = new Set();
    const kept = [];
    const rejected = [];

    for (const q of questions) {
        const reason =
            !q.question || !q.answer ? "missing question or answer"
            : !(q.difficulty in POINTS) ? `bad difficulty "${q.difficulty}"`
            : seen.has(q.question.toLowerCase()) ? "duplicate question"
            : q.answer.split(/\s+/).length > 5 ? `answer too long: "${q.answer}"`
            : null;

        if (reason) {
            rejected.push({ question: q.question, reason });
        } else {
            seen.add(q.question.toLowerCase());
            kept.push(q);
        }
    }
    return { kept, rejected };
}


function makePack(blueprint, questions) {
    return {
        id: blueprint.id,
        name: blueprint.name,
        description: blueprint.description,
        color: blueprint.color,
        source: "generated",
        questions: questions.map((q, i) => ({
            id: `${blueprint.id}-${String(i + 1).padStart(3, "0")}`,
            category: blueprint.id,
            question: q.question,
            answer: q.answer,
            difficulty: q.difficulty,
            points: POINTS[q.difficulty],
        })),
    };
}


function printQuestions(questions, rejected) {
    for (const level of LEVELS) {
        const group = questions.filter(
            (question) => question.difficulty === level
        );

        console.log(`\n${level.toUpperCase()} (${group.length})\n`);

        for (const question of group) {
            console.log(`  ${question.question}`);
            console.log(`    → ${question.answer}\n`);
        }
    }

    if (rejected.length) {
        console.log(`\nREJECTED (${rejected.length})\n`);

        for (const item of rejected) {
            console.log(`  ${item.question ?? "Unknown question"}`);
            console.log(`    → ${item.reason}\n`);
        }
    }

    console.log(`${questions.length} kept, ${rejected.length} rejected.`);
}



async function main() {
    const { name, perLevel, save } = parseArgs();
    const blueprint = loadBlueprint(name);

    console.log(`Generating for "${blueprint.name}" using ${OPENAI_MODEL}...\n`);

    const counts = perLevel === null ? blueprint.counts : { easy: perLevel, medium: perLevel, hard: perLevel };

    const generated = await generateQuestions(buildPrompt(blueprint, counts));
    const { kept, rejected } = validate(generated);

    printQuestions(kept, rejected);

    if (!save) {
        console.log("\nNothing written. Re-run with --save once you are happy.");
        return;
    }

    // save
    fs.mkdirSync(PACKS_DIR, { recursive: true });

    const file = path.join(PACKS_DIR, `${blueprint.id}.json`);
    const pack = makePack(blueprint, kept);

    fs.writeFileSync(file, `${JSON.stringify(pack, null, 2)}\n`);
    console.log(`\nWrote ${kept.length} questions to ${file}`);
}


main();