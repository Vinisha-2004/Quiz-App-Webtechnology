const q = (question, options, answer) => ({
  question,
  options1: options[0],
  options2: options[1],
  options3: options[2],
  options4: options[3],
  answer,
});

const QUIZ_BANK = {
  html: {
    title: "HTML",
    questions: [
      q("Which tag is used to create a hyperlink?", ["<a>", "<link>", "<href>", "<url>"], "<a>"),
      q("Which element is used for the largest heading?", ["<h6>", "<heading>", "<h1>", "<head>"], "<h1>"),
      q("Which attribute is used to provide alternate text for an image?", ["alt", "title", "src", "text"], "alt"),
      q("Which tag is used to create an unordered list?", ["<ol>", "<li>", "<ul>", "<list>"], "<ul>"),
      q("What does HTML stand for?", ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool Multi Language", "Home Tool Markup Language"], "Hyper Text Markup Language"),
    ],
  },
  css: {
    title: "CSS",
    questions: [
      q("Which property changes the text color?", ["font-color", "text-style", "color", "foreground"], "color"),
      q("Which unit is relative to the root font size?", ["em", "rem", "vh", "%"], "rem"),
      q("Which layout method is best for one-dimensional alignment?", ["Grid", "Flexbox", "Float", "Table"], "Flexbox"),
      q("Which pseudo-class targets an element when hovered?", [":focus", ":active", ":hover", ":visited"], ":hover"),
      q("What does CSS stand for?", ["Cascading Style Sheets", "Creative Style Sheets", "Computer Styled Sections", "Colorful Style Sheets"], "Cascading Style Sheets"),
    ],
  },
  javascript: {
    title: "JavaScript",
    questions: [
      q("Which keyword declares a block-scoped variable?", ["var", "let", "static", "define"], "let"),
      q("Which method converts JSON text into an object?", ["JSON.parse()", "JSON.stringify()", "JSON.object()", "JSON.decode()"], "JSON.parse()"),
      q("What is the result of typeof null?", ["null", "object", "undefined", "number"], "object"),
      q("Which array method adds an element to the end?", ["push()", "pop()", "shift()", "slice()"], "push()"),
      q("Which event runs when a page finishes loading?", ["onhover", "load", "submit", "change"], "load"),
    ],
  },
  react: {
    title: "React",
    questions: [
      q("What is the primary building block in React?", ["Module", "Component", "Service", "Template"], "Component"),
      q("Which hook is used for side effects?", ["useState", "useMemo", "useEffect", "useReducer"], "useEffect"),
      q("How do you pass data from parent to child?", ["Context", "Props", "State", "Router"], "Props"),
      q("What does JSX allow you to write?", ["Database queries", "HTML-like syntax in JavaScript", "CSS variables", "Server code"], "HTML-like syntax in JavaScript"),
      q("What is React primarily used for?", ["Building user interfaces", "Writing databases", "Creating operating systems", "Configuring routers"], "Building user interfaces"),
    ],
  },
  nodejs: {
    title: "Node.js",
    questions: [
      q("What is Node.js mainly used for?", ["Styling pages", "Server-side JavaScript", "Database design", "Image editing"], "Server-side JavaScript"),
      q("Which package manager comes with Node.js?", ["Yarn", "npm", "pnpm", "Bun"], "npm"),
      q("Which module is used to create an HTTP server?", ["http", "fs", "path", "url"], "http"),
      q("What does npm stand for?", ["Node Package Manager", "Network Program Module", "New Project Manager", "Node Project Method"], "Node Package Manager"),
      q("Which command starts a Node app from package.json?", ["npm run", "npm start", "node run", "start node"], "npm start"),
    ],
  },
  database: {
    title: "Database",
    questions: [
      q("Which language is commonly used to query relational databases?", ["HTML", "SQL", "CSS", "JSON"], "SQL"),
      q("What does SQL stand for?", ["Structured Query Language", "Simple Query Logic", "System Query List", "Secure Question Language"], "Structured Query Language"),
      q("Which key uniquely identifies a row?", ["Foreign key", "Primary key", "Unique index", "Candidate field"], "Primary key"),
      q("Which command is used to remove rows from a table?", ["DELETE", "DROP", "REMOVE", "CLEAR"], "DELETE"),
      q("Which database model stores data in tables?", ["Relational", "Hierarchical", "Network", "Document"], "Relational"),
    ],
  },
  programming: {
    title: "Programming",
    questions: [
      q("What is an algorithm?", ["A type of browser", "A step-by-step solution", "A file format", "A programming language"], "A step-by-step solution"),
      q("Which of these is a loop construct?", ["if", "switch", "for", "try"], "for"),
      q("What does debugging mean?", ["Writing comments", "Finding and fixing errors", "Encrypting code", "Copying code"], "Finding and fixing errors"),
      q("Which data structure works on FIFO?", ["Stack", "Queue", "Tree", "Graph"], "Queue"),
      q("What is the output of 2 + 2 * 2?", ["8", "6", "4", "10"], "6"),
    ],
  },
  "general-knowledge": {
    title: "General Knowledge",
    questions: [
      q("Which planet is known as the Red Planet?", ["Earth", "Mars", "Venus", "Jupiter"], "Mars"),
      q("How many continents are there on Earth?", ["5", "6", "7", "8"], "7"),
      q("Which is the largest ocean on Earth?", ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], "Pacific Ocean"),
      q("Who wrote 'Romeo and Juliet'?", ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], "William Shakespeare"),
      q("What is the capital of India?", ["Mumbai", "Delhi", "Kolkata", "Chennai"], "Delhi"),
    ],
  },
};

const CATEGORY_ALIASES = {
  node: "nodejs",
  "node.js": "nodejs",
  general: "general-knowledge",
  "general knowledge": "general-knowledge",
};

const normalizeCategory = (value) => {
  if (!value) return "general-knowledge";
  const key = String(value).trim().toLowerCase();
  return CATEGORY_ALIASES[key] || key;
};

const params = new URLSearchParams(window.location.search);
const requestedCategory = normalizeCategory(
  params.get("category") ||
    localStorage.getItem("smartspark.activeCategory") ||
    localStorage.getItem("smartspark.pendingCategory")
);

const activeQuiz = QUIZ_BANK[requestedCategory] || QUIZ_BANK["general-knowledge"];
const ArrayQuiz = activeQuiz.questions;

const quizTitle = document.querySelector(".inner h1");
if (quizTitle) {
  quizTitle.textContent = `${activeQuiz.title} Quiz`;
}
document.title = `${activeQuiz.title} Quiz | SMART SPARK`;

const timerDisplay = document.querySelector("#timer");
const questions = document.querySelector(".ques");
const option1 = document.querySelector("#btn1");
const option2 = document.querySelector("#btn2");
const option3 = document.querySelector("#btn3");
const option4 = document.querySelector("#btn4");
const nextbtn = document.querySelector("#next-btn");
const resultBox = document.querySelector(".result-box");

let currQuestion = 0;
let totalQuestion = ArrayQuiz.length;
let score = 0;
let timer;
let timeLeft = 30;
let isAnswered = false;

const allButtons = [option1, option2, option3, option4];

function startTimer() {
  timeLeft = 30;
  timerDisplay.textContent = "Time Left: " + timeLeft + "s";

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = "Time Left: " + timeLeft + "s";

    if (timeLeft <= 0) {
      clearInterval(timer);
      autoSubmit();
    }
  }, 1000);
}

function autoSubmit() {
  if (!isAnswered) {
    const correctAnswer = ArrayQuiz[currQuestion].answer;

    allButtons.forEach((btn) => {
      if (btn.textContent.trim() === correctAnswer) {
        btn.style.backgroundColor = "green";
      }
      btn.disabled = true;
    });

    isAnswered = true;
  }

  setTimeout(() => {
    loadNextQuestion();
  }, 1000);
}

function loadQuestion(index) {
  clearInterval(timer);
  startTimer();

  isAnswered = false;

  allButtons.forEach((btn) => {
    btn.style.backgroundColor = "";
    btn.disabled = false;
  });

  const data = ArrayQuiz[index];

  questions.textContent = `${index + 1}. ${data.question}`;
  option1.textContent = data.options1;
  option2.textContent = data.options2;
  option3.textContent = data.options3;
  option4.textContent = data.options4;
}

function checkAnswer(selectedBtn) {
  if (isAnswered) return;

  clearInterval(timer);

  const correctAnswer = ArrayQuiz[currQuestion].answer;
  const userAnswer = selectedBtn.textContent.trim();

  isAnswered = true;

  if (userAnswer === correctAnswer) {
    selectedBtn.style.backgroundColor = "green";
    score++;
  } else {
    selectedBtn.style.backgroundColor = "red";

    allButtons.forEach((btn) => {
      if (btn.textContent.trim() === correctAnswer) {
        btn.style.backgroundColor = "green";
      }
    });
  }

  allButtons.forEach((btn) => {
    btn.disabled = true;
  });
}

function loadNextQuestion() {
  if (!isAnswered) {
    alert("Please select an answer before going to next question.");
    return;
  }

  currQuestion++;

  if (currQuestion >= totalQuestion) {
    showResult();
    return;
  }

  loadQuestion(currQuestion);
}

function showResult() {
  clearInterval(timer);

  document.querySelector(".outer").style.display = "none";
  resultBox.style.display = "grid";

  const percentage = Math.round((score / totalQuestion) * 100);
  const incorrect = totalQuestion - score;
  const resultMessage =
    percentage >= 80
      ? "Excellent work. You really know this topic."
      : percentage >= 50
        ? "Good effort. A quick revision will make it stronger."
        : "Keep practicing. Every attempt builds confidence.";

  resultBox.style.setProperty("--score-percent", `${percentage}%`);

  resultBox.innerHTML = `
    <div class="result-card">
      <span class="result-badge">Quiz Completed</span>
      <h2>${activeQuiz.title} Quiz</h2>
      <p class="result-message">${resultMessage}</p>

      <div class="score-ring" aria-label="Score ${score} out of ${totalQuestion}">
        <div class="score-ring-inner">
          <strong>${score}</strong>
          <span>/ ${totalQuestion}</span>
        </div>
      </div>

      <div class="result-stats">
        <div>
          <span>${percentage}%</span>
          <p>Score</p>
        </div>
        <div>
          <span>${score}</span>
          <p>Correct</p>
        </div>
        <div>
          <span>${incorrect}</span>
          <p>Missed</p>
        </div>
      </div>

      <div class="result-actions">
        <button class="restart-btn" type="button" onclick="location.reload()">Restart Quiz</button>
        <button class="home-btn" type="button" onclick="window.location.href='Home.html'">Home</button>
      </div>
    </div>
  `;
}

allButtons.forEach((btn) => {
  btn.addEventListener("click", () => checkAnswer(btn));
});

nextbtn.addEventListener("click", loadNextQuestion);

loadQuestion(currQuestion);
