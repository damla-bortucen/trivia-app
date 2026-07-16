/**
 * Fetches trivia questions from the free Open Trivia DB API
 * and saves them as JSON files.
 *
 * Run it with: node scripts/generateQuestions.js
 */

const fs = require("fs");
const path = require("path");
 
// where the JSON files will be saved.
const OUTPUT_DIR = path.join(__dirname, "..", "assets", "questions");

// how many questions to fetch per difficulty
const QUESTIONS_PER_DIFFICULTY = 50;

// map "easy" to 1 etc.
const DIFFICULTY_POINTS = { easy: 1, medium: 2, hard: 3 };

const CATEGORIES = [
    { slug: "sports", label: "Sports", opentdbIds: [21] },
    { slug: "history", label: "History", opentdbIds: [23] },
    { slug: "geography", label: "Geography", opentdbIds: [22] },
    { slug: "science-nature", label: "Science and Nature", opentdbIds: [17] },
    { slug: "general-knowledge", label: "General Knowledge", opentdbIds: [9] },
    // Books, Film, Music, Musicals & Theatres combined into one "Entertainment" bucket.
    { slug: "entertainment", label: "Entertainment", opentdbIds: [10, 11, 12, 13] },
];


// sleep between API calls - rate limits for ever 5s
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


// convert html special character tags to text
function decodeHtml(str) {
    const map = {
    "&quot;": '"',
    "&#039;": "'",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&eacute;": "é",
    "&rsquo;": "’",
    };

    // replace every "&something;" pattern using the map above.
    return str.replace(/&[a-z0-9#]+;/gi, (match) => map[match] ?? match);
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


// fetch ONE batch of questions for one OpenTDB category + one difficulty.
async function fetchBatch(opentdbId, difficulty, amount) {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${opentdbId}&difficulty=${difficulty}&type=multiple`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // response_code 0 means "success". Anything else means no questions were found.
    if (data.response_code !== 0) {
        console.warn(`  ! No ${difficulty} questions found for category ${opentdbId}`);
        console.log(`${data.response_code}`)
        return [];
    }
    
    // Pull out just the question + correct answer tag the difficulty.
    return data.results.map((item) => {
        const question = decodeHtml(item.question);
        const correct = decodeHtml(item.correct_answer);
        const incorrect = item.incorrect_answers.map(decodeHtml);

        return {
            question: needsOptions(question)
                ? appendOptions(question, correct, incorrect)
                : question,
            answer: correct,
            difficulty,
        };
    });
}


// build ONE full category of questions
async function buildCategory(categoryConfig) {
    console.log(`Fetching "${categoryConfig.label}"...`);
    
    const difficulties = ["easy", "medium", "hard"];
    const idsCount = categoryConfig.opentdbIds.length;
    
    // split the target amount evenly across however many OpenTDB IDs this category uses
    // for Entertainment which has multiple
    const amountPerId = Math.ceil(QUESTIONS_PER_DIFFICULTY / idsCount);
    
    const allQuestions = [];
    
    for (const difficulty of difficulties) {
        for (const opentdbId of categoryConfig.opentdbIds) {
        const batch = await fetchBatch(opentdbId, difficulty, amountPerId);
        allQuestions.push(...batch);
        await sleep(5500); // pause between requests
        }
    }
    
    // turn the raw list into the final shape our app expects, with a unique id per question
    return allQuestions.map((q, index) => ({
        id: `${categoryConfig.slug}-${String(index + 1).padStart(3, "0")}`,
        category: categoryConfig.label,
        question: q.question,
        answer: q.answer,
        difficulty: q.difficulty,
        points: DIFFICULTY_POINTS[q.difficulty],
    }));
}



async function main() {
    // make sure the output folder exists (creates it if it doesn't)
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    
    for (const categoryConfig of CATEGORIES) {
        const questions = await buildCategory(categoryConfig);
    
        const outputPath = path.join(OUTPUT_DIR, `${categoryConfig.slug}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
    
        console.log(`  -> saved ${questions.length} questions to ${outputPath}`);
    }
    
    console.log("\nDone! Check assets/questions/ for your JSON files.");
}
 
main();