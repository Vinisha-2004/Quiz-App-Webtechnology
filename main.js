var ArrayQuiz = [
  {
    question: "Which method is used to add an element at the end of an array?",
    options1: "push()",
    options2: "pop()",
    options3: "shift()",
    options4: "unshift()",
    answer: "push()"
  },
  {
    question: "Which method removes the first element from an array?",
    options1: "shift()",
    options2: "slice()",
    options3: "splice()",
    options4: "pop()",
    answer: "shift()"
  },
  {
    question: "What is the output of typeof []?",
    options1: "'array'",
    options2: "'object'",
    options3: "'list'",
    options4: "'undefined'",
    answer: "'object'"
  },
  {
    question: "Which method creates a new array without changing the original array?",
    options1: "splice()",
    options2: "slice()",
    options3: "push()",
    options4: "pop()",
    answer: "slice()"
  },
  {
    question: "What is the output?\nlet arr = [1,2,3]; arr.push(4); console.log(arr.length);",
    options1: "3",
    options2: "4",
    options3: "5",
    options4: "Error",
    answer: "4"
  },
  {
    question: "Which method is used to merge two arrays?",
    options1: "concat()",
    options2: "combine()",
    options3: "merge()",
    options4: "join()",
    answer: "concat()"
  },
  {
    question: "What does splice() do?",
    options1: "Removes elements and returns a new array",
    options2: "Adds or removes elements from the original array",
    options3: "Returns shallow copy",
    options4: "Joins elements into string",
    answer: "Adds or removes elements from the original array"
  },
  {
    question: "let arr = [2,4,6]; arr[5] = 10; console.log(arr.length);",
    options1: "3",
    options2: "4",
    options3: "6",
    options4: "10",
    answer: "6"
  }
];

let timerDisplay = document.querySelector("#timer");
let questions = document.querySelector(".ques");
let option1 = document.querySelector("#btn1");
let option2 = document.querySelector("#btn2");
let option3 = document.querySelector("#btn3");
let option4 = document.querySelector("#btn4");
let nextbtn = document.querySelector("#next-btn");
let resultBox = document.querySelector(".result-box");

let currQuestion = 0;
let totalQuestion = ArrayQuiz.length;
let score = 0;
let timer;
let timeLeft = 30;
let isAnswered = false;

let allButtons = [option1, option2, option3, option4];


// ✅ TIMER FUNCTION
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


// ✅ AUTO SUBMIT
function autoSubmit() {
  if (!isAnswered) {
    let correctAnswer = ArrayQuiz[currQuestion].answer;

    allButtons.forEach(btn => {
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


// ✅ LOAD QUESTION
function loadQuestion(index) {

  clearInterval(timer);
  startTimer();

  isAnswered = false;

  allButtons.forEach(btn => {
    btn.style.backgroundColor = "";
    btn.disabled = false;
  });

  let data = ArrayQuiz[index];

  questions.textContent = (index + 1) + ". " + data.question;
  option1.textContent = data.options1;
  option2.textContent = data.options2;
  option3.textContent = data.options3;
  option4.textContent = data.options4;
}



// ✅ CHECK ANSWER
function checkAnswer(selectedBtn) {

  if (isAnswered) return;
  clearInterval(timer);

  let correctAnswer = ArrayQuiz[currQuestion].answer;
  let userAnswer = selectedBtn.textContent.trim();

  isAnswered = true;

  if (userAnswer === correctAnswer) {
    selectedBtn.style.backgroundColor = "green";
    score++;
  } else {
    selectedBtn.style.backgroundColor = "red";

    allButtons.forEach(btn => {
      if (btn.textContent.trim() === correctAnswer) {
        btn.style.backgroundColor = "green";
      }
    });
  }

  allButtons.forEach(btn => btn.disabled = true);
}


// ✅ NEXT QUESTION
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


// ✅ SHOW RESULT
function showResult() {

  clearInterval(timer);

  document.querySelector(".outer").style.display = "none";

  resultBox.style.display = "block";

  resultBox.innerHTML = `
    <h2 style="margin-top:15px;color:green;">Quiz Completed!</h2>
    <p style="margin-top:15px;">Your Score: <strong>${score} / ${totalQuestion}</strong></p>
    <button onclick="location.reload()" 
      style="margin-top:15px;padding:10px 20px;background:#007bff;color:#fff;border:none;border-radius:8px;">
      Restart Quiz
    </button>
  `;
}


// ✅ EVENT LISTENERS
allButtons.forEach(btn => {
  btn.addEventListener("click", () => checkAnswer(btn));
});

nextbtn.addEventListener("click", loadNextQuestion);


// ✅ START QUIZ
loadQuestion(currQuestion);
