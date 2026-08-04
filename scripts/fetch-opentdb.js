/**
 * Fetches trivia questions from the free Open Trivia DB API
 * and saves them as JSON files.
 *
 * Run it with: node scripts/fetch-opentdb.js
 */

const fs = require("fs");
const path = require("path");
 
// where the JSON files will be saved.
const OUTPUT_DIR = path.join(__dirname, "..", "assets", "packs");

// how many questions to fetch per difficulty
const QUESTIONS_PER_DIFFICULTY = 50;

// pause between API calls to bypass rate-limits
const API_DELAY_MS = 5500;

// map "easy" to 1 etc.
const DIFFICULTY_POINTS = { easy: 1, medium: 2, hard: 3 };

const PACKS = [
    {
        id: "sports",
        name: "Sports",
        description: "Teams, records and the people who set them.",
        color: "#daa8d0",
        opentdbIds: [21],
    },
    {
        id: "history",
        name: "History",
        description: "People and events that shaped the world.",
        color: "#f7da21",
        opentdbIds: [23],
    },
    {
        id: "geography",
        name: "Geography",
        description: "Countries, capitals and landmarks.",
        color: "#fb9b00",
        opentdbIds: [22],
    },
    {
        // Science and Nature and Animals combined
        id: "science-nature",
        name: "Science and Nature",
        description: "The natural world and how it works.",
        color: "#6AAA64",
        opentdbIds: [17, 27],
    },
    {
        id: "general-knowledge",
        name: "General Knowledge",
        description: "A bit of everything.",
        color: "#b3a7fe",
        opentdbIds: [9],
    },
    {
        // Books, Film, Music, Musicals & Theatres, TV combined
        id: "entertainment",
        name: "Entertainment",
        description: "Film, television and music.",
        color: "#fc716b",
        opentdbIds: [10, 11, 12, 13, 14],
    },
    {
        id: "mythology",
        name: "Mythology",
        description: "Gods, monsters and ancient legends.",
        color: "#7ba8ef",
        opentdbIds: [20],
    },
    {
        id: "art",
        name: "Art",
        description: "Painters, sculptors and famous works.",
        color: "#c0ddd9",
        opentdbIds: [25],
    },
];



// sleep between API calls
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}



// convert html special character tags to text
function decode(str) {
    return Buffer.from(str, "base64").toString("utf8")
}



// helper to check if multiple choice options needed for the question
function needsOptions(question) {
    return /which of the following|which of these|following (is|are|was|were)/i.test(question);
}



// shuffle options to have the correct answer in a random spot - Fisher-Yates
function shuffle(arr) { 
    const result = [...arr]; // Copy so the original isn't modified

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}



// append options to question
function appendOptions(question, correct, incorrect) {
    const labels = ["A", "B", "C", "D", "E", "F"];
    const list = shuffle([correct, ...incorrect])
        .map((opt, i) => `${labels[i]}) ${opt}`)
        .join("\n");
    return `${question}\n\n${list}`;
}



// how many questions OpenTDB has per difficulty. this counts true/false questions as well
async function fetchCounts(opentdbId) {
    const response = await fetch(`https://opentdb.com/api_count.php?category=${opentdbId}`);
    const data = await response.json();
    const counts = data.category_question_count;

    return {
        easy: counts.total_easy_question_count,
        medium: counts.total_medium_question_count,
        hard: counts.total_hard_question_count,
    };
}



// turn an OpenTDB result into the correct shape to store
function toQuestion(item) {
    const question = decode(item.question);
    const correct = decode(item.correct_answer);
    const incorrect = item.incorrect_answers.map(decode);
    const difficulty = decode(item.difficulty);
    const type = decode(item.type);

    // handle true or false questions
    if (type === "boolean") {
        return {
            question: `True or false?\n${question}`,
            answer: correct,
            difficulty,
        };
    }

    return {
        question: needsOptions(question)
            ? appendOptions(question, correct, incorrect)
            : question,
        answer: correct,
        difficulty,
    };
}



// fetch a batch of questions for one OpenTDB category + one difficulty.
// OpenTDB returns nothing rather than a short list, so halve and retry until request met
async function fetchBatch(opentdbId, difficulty, amount) {
    let want = amount; // reassignable var

    while (want > 0) {
        const url = `https://opentdb.com/api.php?amount=${want}&category=${opentdbId}&difficulty=${difficulty}&encode=base64`;

        const response = await fetch(url);
        const data = await response.json();

        // response_code 0 means success
        if (data.response_code === 0) {
            if (want < amount) {
                console.log(`  ~ ${difficulty}: got ${want}, asked for ${amount}`);
            }
            return data.results.map(toQuestion);
        }

        // 1 means not enough questions for the query
        if (data.response_code !== 1) {
            console.warn(`  ! ${difficulty}: response_code ${data.response_code}`);
            return [];
        }

        want = Math.floor(want / 2);
        await sleep(API_DELAY_MS)
    }

    console.warn(`  ! No ${difficulty} questions found for category ${opentdbId}`);
    return [];
}



// build ONE full category of questions
async function buildCategory(pack) {
    console.log(`Fetching "${pack.name}"...`);
    
    const difficulties = ["easy", "medium", "hard"];
    const idsCount = pack.opentdbIds.length;
    
    // split the target amount evenly across however many OpenTDB IDs this category uses
    // for Entertainment which has multiple
    const amountPerId = Math.ceil(QUESTIONS_PER_DIFFICULTY / idsCount);
    
    const allQuestions = [];
    
    for (const opentdbId of pack.opentdbIds) {
        const counts = await fetchCounts(opentdbId);
        await sleep(API_DELAY_MS);

        for (const difficulty of difficulties) {
            // never ask for more than exists
            const want = Math.min(amountPerId, counts[difficulty]);
            const batch = await fetchBatch(opentdbId, difficulty, want);
            allQuestions.push(...batch);
            await sleep(API_DELAY_MS);
        }
    }
    
    // turn the raw list into the final shape our app expects, with a unique id per question
    return allQuestions.map((q, index) => ({
        id: `${pack.id}-${String(index + 1).padStart(3, "0")}`,
        category: pack.id,
        question: q.question,
        answer: q.answer,
        difficulty: q.difficulty,
        points: DIFFICULTY_POINTS[q.difficulty],
    }));
}



function makePack(pack, questions) {
    return {
        id: pack.id,
        name: pack.name,
        description: pack.description,
        color: pack.color,
        source: "obentdb",
        questions,
    };
}



async function main() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    for (const pack of PACKS) {
        const questions = await buildCategory(pack);

        const file = path.join(OUTPUT_DIR, `${pack.id}.json`);
        fs.writeFileSync(file, `${JSON.stringify(makePack(pack, questions), null, 2)}\n`);

        console.log(`  -> wrote ${questions.length} questions to ${file}\n`);
    }
}
 
main();