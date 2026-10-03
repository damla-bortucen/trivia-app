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

    // worked examples pin the difficulty bar far better than percentages do
    const examples = blueprint.examples
        ? `
    EXAMPLES OF EACH LEVEL FOR THIS TOPIC
    Match these levels. Do not reuse these questions.
${LEVELS.map((level) =>
    `    ${level}:\n${(blueprint.examples[level] ?? []).map((e) => `    - ${e}`).join("\n")}`
).join("\n")}
`
        : "";

    return `You are writing trivia questions for a pass-and-play party game.

    HOW YOUR ANSWER IS USED
    One player reads the question aloud, another says an answer out loud, and the
    first player decides whether it matched. There is no answer key beyond the
    single string you provide, so the answer must be short and unmistakable.

    TOPIC
    ${blueprint.theme}

    WRITE ${total} QUESTIONS AS A DIFFICULTY LADDER
    The players are ordinary adults at a pub quiz, not trivia enthusiasts.
    - ${counts.easy} easy: about four in five players would get it. Ask well known
    facts about a well known subject. Do not add a specific detail to make it harder.
    - ${counts.medium} medium: roughly a quarter to half would get it. Someone with a
    general interest knows it, others might reason their way there.
    - ${counts.hard} hard: one in five or fewer would get it.

    The difficulty levels must be clearly separated. A hard question should be one that a player
    who answered every easy question correctly would still probably miss. If you
    cannot decide between two levels, label it the harder one.
    ${examples}
    
    ANGLES
    Use these angles for medium and hard questions, and use every one at least
    once. Easy questions should cover the most famous facts of the topic instead.
    No single angle may account for more than one in ten questions.
    ${angles}

    AVOID
    ${blueprint.avoid}

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


// one chat call that must come back as a JSON object
async function askModel(prompt) {
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

    return JSON.parse(content);
}


async function generateQuestions(prompt) {
    const parsed = await askModel(prompt);
    return parsed.questions ?? [];
}


// --------------------------- DIFFICULTY CHECK ------------------------------
// a writer grades its own questions generously, so a second call rates each
// one cold - without seeing the label it was given - and the label is set
// from that estimate instead
const EASY_FROM = 70;   // at least this % of adults would get it
const HARD_UPTO = 25;   // at most this %

function buildCheckPrompt(questions) {
    const list = questions
        .map((q, i) => `${i}. ${q.question.replace(/\n+/g, " ")}\n   answer: ${q.answer}`)
        .join("\n");

    return `You are checking questions for a pub quiz trivia game played by ordinary
    English-speaking adults, not trivia enthusiasts.

    For each question, estimate the percentage of those adults who would give this
    exact answer from memory, with no help beyond any options in the question.
    Be realistic rather than generous: a fact being famous among quiz fans does not
    make it widely known.

    Also set "bad" to true if the answer is wrong, or if a well informed person
    could give a different answer and reasonably expect to be marked right.

    QUESTIONS
    ${list}

    OUTPUT
    Return JSON only, one entry per question, in exactly this shape:
    {"ratings":[{"i":0,"percent":85,"bad":false}]}`;
}

function levelFor(percent) {
    if (percent >= EASY_FROM) return "easy";
    if (percent <= HARD_UPTO) return "hard";
    return "medium";
}

// relabels each question from its rating and drops the ones flagged bad
async function checkDifficulty(questions) {
    const { ratings = [] } = await askModel(buildCheckPrompt(questions));
    const byIndex = new Map(ratings.map((r) => [r.i, r]));

    const kept = [];
    const rejected = [];
    let moved = 0;

    questions.forEach((q, i) => {
        const rating = byIndex.get(i);

        if (!rating || typeof rating.percent !== "number") {
            rejected.push({ question: q.question, reason: "not rated by the check" });
        } else if (rating.bad) {
            rejected.push({ question: q.question, reason: "check flagged the answer as wrong or ambiguous" });
        } else {
            const difficulty = levelFor(rating.percent);
            if (difficulty !== q.difficulty) moved++;
            kept.push({ ...q, difficulty, percent: rating.percent, was: q.difficulty });
        }
    });

    return { kept, rejected, moved };
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


function countByLevel(questions) {
    return Object.fromEntries(
        LEVELS.map((level) => [level, questions.filter((q) => q.difficulty === level).length])
    );
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
            const moved = question.was && question.was !== question.difficulty ? ` (was ${question.was})` : "";
            const rated = question.percent === undefined ? "" : `[${question.percent}%] `;
            console.log(`  ${rated}${question.question}`);
            console.log(`    → ${question.answer}${moved}\n`);
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
    const valid = validate(generated);

    console.log(`Checking difficulty of ${valid.kept.length} questions...`);
    const checked = await checkDifficulty(valid.kept);

    const kept = checked.kept;
    const rejected = [...valid.rejected, ...checked.rejected];

    printQuestions(kept, rejected);
    console.log(`${checked.moved} relabelled by the difficulty check.`);
    console.log(`Target ${JSON.stringify(counts)}, got ${JSON.stringify(countByLevel(kept))}.`);

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