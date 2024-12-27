let quesArr = [];
let questionPage = [];
let nextBtn;
let questionArray = [];
let score = 0;
let attempt = false;
let submit = false;
let lastPageArray = [];
let currentIndex = 0;

async function getQuestions() {
  try {
    // Fetching the Questions from The API
    const response = await fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const questions = await response.json();
    questionArray = questions.results;

    

    for (let i = 0; i < questionArray.length; i++) {
      quesArr.push(questionArray[i].question);
    }

    let div = document.createElement("div");
    div.classList.add("questions_div");
    let ul = document.createElement("ul");
    div.appendChild(ul);

    let quiz_area = document.getElementById("quiz_area");
    for (let i = 0; i < quesArr.length; i++) {
      ul.innerHTML += `<li class="questionli">Question${i + 1}</li>`;
      await showTheQuestionPage(i);
    }
    quiz_area.appendChild(div);

    let strtBtn = document.getElementById("start_btn");
    strtBtn.addEventListener("click", () => {
      div.classList.add("slider");
      quiz_area.classList.add("hidden");
    });


    for (let i = 0; i < questionPage.length - 1; i++) {
      let next = questionPage[i].querySelector("#next");
      let spanBox = questionPage[i].getElementsByClassName("spanBox");

      Array.from(spanBox).forEach((element) => {
        element.addEventListener("click", () => {
          checkValidation(i, element, spanBox, next);
        });
      });


      next.addEventListener("click", function () {
        currentIndex = i;
        if (currentIndex < questionPage.length - 1) {
          if (submit == true) {
            questionPage[currentIndex].classList.add("slider2");
            currentIndex += 1;
            questionPage[currentIndex].classList.add("slider");
            quiz_area.appendChild(questionPage[currentIndex]);
            submit = false;
          } else {
            alert("Please submit properly");
          }

        }
      });


    }
    let lastNextBtn = questionPage[questionPage.length - 1].querySelector("#next");

    let spanBox = questionPage[questionPage.length - 1].getElementsByClassName("spanBox");

    Array.from(spanBox).forEach((element) => {
      element.addEventListener("click", () => {
        checkValidation(questionPage.length - 1, element, spanBox, next);
      });
    });


    lastNextBtn.addEventListener("click", function () {
      if (submit == true) {
        showTheLastPage();
      } else {
        alert("submit the question first Proeperly")
      }
    });

    function showTheQuestionPage(i) {
      let j = i;
      let div2 = document.createElement("div");
      div2.classList.add("questions_div2");
      div2.classList.add("slider");
      let p = document.createElement("p");
      p.classList.add("question_p_tag");
      p.textContent += `Ques${i + 1}-> ${questionArray[i].question}`;

      let optionUl = document.createElement("ul");
      optionUl.classList.add("optionUl");

      // Combine correct and incorrect answers and shuffle them
      let options = [...questionArray[i].incorrect_answers, questionArray[i].correct_answer];
      options = options.sort(() => Math.random() - 0.5);

      options.forEach((option, index) => {
        optionUl.innerHTML += `
          <div class="optionDiv">
            <li>${index + 1}. ${option}</li>
            <span class="spanBox" data-answer="${option}"></span>
          </div>`;
      });

      let BtnContainer = document.createElement("div");
      BtnContainer.classList.add("next_prev_btn")
      let scoreButton = document.createElement("button");
      scoreButton.textContent = `Submit`;
      scoreButton.classList.add("score_button");
      nextBtn = document.createElement("button");

      nextBtn.id = "next";

      nextBtn.textContent += "Next";
      BtnContainer.appendChild(scoreButton);
      BtnContainer.appendChild(nextBtn);

      div2.appendChild(p);
      div2.appendChild(optionUl);
      div2.appendChild(BtnContainer);
      questionPage.push(div2);
    }

    let quesLi = Array.from(document.getElementsByClassName("questionli"));
    quesLi[0].classList.add("transformClass")
    quesLi[0].textContent += "\u00A0\u00A0\u00A0Start"
    quesLi[0].addEventListener("click", () => {
      div.classList.add("slider2");
      quiz_area.appendChild(questionPage[0]);
    });

  } catch (error) {
    console.error("Error fetching quiz questions:", error.message);
  }
}

function checkValidation(i, element, spanBox) {
  if (submit === false) {
    Array.from(spanBox).forEach((item) => {
      item.style.backgroundColor = "white";
    });
    element.style.backgroundColor = "green";

    let selectedAnswer = element.dataset.answer;

    if (questionArray[i].answered) {
      if (selectedAnswer !== questionArray[i].correct_answer) {
        attempt = true;
        score -= 10;
        questionArray[i].answered = false;
      }
    } else {
      if (selectedAnswer === questionArray[i].correct_answer) {
        attempt = true;
        score += 10;
        questionArray[i].answered = true;
      }
    }
  }
  const nextScoreButton = questionPage[i].querySelector(".score_button");
  nextScoreButton.addEventListener("click", function () {
    submit = true;

    nextScoreButton.textContent = `Score : ${score}`
  });
  const lastnextScoreButton = questionPage[questionPage.length - 1].querySelector(".score_button");
  lastnextScoreButton.addEventListener("click", function () {
    submit = true;
    console.log(submit);
    nextScoreButton.textContent = `Score : ${score}`
  });


}
function showTheLastPage() {
  
  for (let i = 0; i < questionArray.length; i++) {
    lastPageArray.push(questionArray[i].question);
  }
  let div = document.createElement("div");
  div.classList.add("questions_div3");
  let ul = document.createElement("ul");
  div.appendChild(ul);
  questionPage[questionPage.length - 1].classList.add("slider2")
  let quiz_area = document.getElementById("quiz_area");
  for (let i = 0; i < lastPageArray.length; i++) {
    ul.innerHTML += `<div class="optionDiv2"><li class="questionli2">Question${i + 1}</li> <span class="spanBox"></span></div>`;
  }
  for (let i = 0; i < questionPage.length; i++) {
    let spanBox = div.querySelectorAll(".spanBox")[i]; // Select the specific spanBox for this question

    if (questionArray[i].answered === true) {
      spanBox.style.backgroundColor = "green";  // Color green if answered
    } else {
      spanBox.style.backgroundColor = "red";  // Color red if not answered
    }
  }
  let buttondiv = document.createElement("div");
  let replay = document.createElement("button");
  replay.textContent = "Restart";
  let scoreBtn = document.createElement("button");
  scoreBtn.textContent = `You Scored : ${score}`;
  buttondiv.appendChild(scoreBtn);
  buttondiv.appendChild(replay);
  div.appendChild(buttondiv)
  div.classList.add("slider");
  quiz_area.appendChild(div);
  replay.addEventListener("click", restartQuiz);
}
function restartQuiz() {
  // Reset variables
  questionArray = [];
  score = 0;
  attempt = false;
  submit = false;
  lastPageArray = [];
  currentIndex = 0;
  questionPage = [];
  quesArr = [];

  // Clear the quiz content from the UI
  let quiz_area = document.getElementById("quiz_area");
  quiz_area.innerHTML = "";  // Clear all existing content

  // Reinitialize the UI to show the start message
  quiz_area.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 5px;">
      <h1 style="text-align: center;">Quiz App</h1>
      <img style="border-radius: 20px; box-shadow: 0px 0px 8px black; width: 90%;" src="image.png" alt="">
    </div>
    <div>
      <p style="font-size: 20px;">Welcome to the quiz! Test your knowledge and learn new things. Click "Start" to begin your journey!</p>
    </div>
    <div class="button">
      <button id="start_btn" style="font-size: 18px;">Start Quiz</button>
    </div>
  `;

  // Re-add the start button event listener to begin the quiz
  let strtBtn = document.getElementById("start_btn");
  strtBtn.addEventListener("click", () => {
    quiz_area.classList.add("hidden");  // Hide the welcome message and start button
    getQuestions();  // Load the questions again
  });
}



getQuestions();
