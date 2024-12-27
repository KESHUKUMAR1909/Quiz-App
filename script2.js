let quesArr = []; // Initialize quesArr properly
let questionPage = [];
let nextBtn;
let prevBtn;
let questionArray = [];
let score = 0;
let submit = false;

async function getQuestions() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const questions = await response.json();
    questionArray = questions.results;

    console.log(questionArray); // Log to check the structure

    // Populate quesArr with questions from API
    quesArr = questionArray.map((question) => question.question); // Store questions in quesArr

    let div = document.createElement("div");
    div.classList.add("questions_div");
    let ul = document.createElement("ul");
    div.appendChild(ul);

    let quiz_area = document.getElementById("quiz_area");
    for (let i = 0; i < quesArr.length; i++) {
      ul.innerHTML += `<li class="questionli">Question ${i + 1}</li>`;
      await showTheQuestionPage(i);
    }
    quiz_area.appendChild(div);

    let strtBtn = document.getElementById("start_btn");
    strtBtn.addEventListener("click", () => {
      div.classList.add("slider");
      quiz_area.classList.add("hidden");
    });

    // Handle navigation and interaction with each question
    for (let i = 0; i < questionPage.length; i++) {
      let next = questionPage[i].querySelector("#next");
      let prev = questionPage[i].querySelector("#prev");
      let spanBox = questionPage[i].getElementsByClassName("spanBox");

      Array.from(spanBox).forEach((element) => {
        element.addEventListener("click", () => {
          checkValidation(i, element, spanBox, next);
        });
      });

      prev.addEventListener("click", () => {
        if (i >= 1) {
          questionPage[i].classList.add("slider2");
          i -= 1;
          questionPage[i].classList.add("slider");
          quiz_area.appendChild(questionPage[i]);
        }
      });

      next.addEventListener("click", function () {
        if (i < questionPage.length - 1) {
          if (submit == true) {
            questionPage[i].classList.add("slider2");
            i += 1;
            questionPage[i].classList.add("slider");
            quiz_area.appendChild(questionPage[i]);
            submit = false;
          } else {
            console.log(submit);
          }
        }
      });

      // Check if all options for the current question have been attempted
      if (i == questionPage.length - 1) {
        if (Array.from(spanBox).every(element => element.hasAttribute("data-selected"))) {
          nextBtn.addEventListener("click", () => {
            console.log("hitted");
            showTheLastPage();
          });
        }
      }

      const nextScoreButton = questionPage[i].querySelector(".score_button");
      nextScoreButton.addEventListener("click", function () {
        submit = true;
        console.log(submit);
        nextScoreButton.textContent = `Score: ${score}`;
      });
    }

    function showTheQuestionPage(i) {
      let j = i;
      let div2 = document.createElement("div");
      div2.classList.add("questions_div2");
      div2.classList.add("slider");
      let p = document.createElement("p");
      p.classList.add("question_p_tag");
      p.textContent += `Ques${i + 1}-> ${quesArr[i]}`;

      let optionUl = document.createElement("ul");
      optionUl.classList.add("optionUl");

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
      let scoreButton = document.createElement("button");
      scoreButton.textContent = `Submit`;
      scoreButton.classList.add("score_button");
      BtnContainer.classList.add("next_prev_btn");
      nextBtn = document.createElement("button");
      prevBtn = document.createElement("button");
      nextBtn.id = "next";
      prevBtn.id = "prev";
      nextBtn.textContent += "Next";
      prevBtn.textContent += "Prev";
      BtnContainer.appendChild(prevBtn);
      BtnContainer.appendChild(scoreButton);
      BtnContainer.appendChild(nextBtn);

      div2.appendChild(p);
      div2.appendChild(optionUl);
      div2.appendChild(BtnContainer);
      questionPage.push(div2);
    }

    let quesLi = Array.from(document.getElementsByClassName("questionli"));
    for (let i = 0; i < quesLi.length; i++) {
      quesLi[i].addEventListener("click", () => {
        div.classList.add("slider2");
        quiz_area.appendChild(questionPage[i]);
      });
    }
  } catch (error) {
    console.error("Error fetching quiz questions:", error.message);
  }
}

function checkValidation(i, element, spanBox) {
  Array.from(spanBox).forEach((item) => {
    item.style.backgroundColor = "white";
    item.removeAttribute("data-selected"); // Remove previous selection
  });
  element.style.backgroundColor = "green";
  element.setAttribute("data-selected", "true"); // Mark as selected

  let selectedAnswer = element.dataset.answer;

  if (questionArray[i].answered) {
    if (selectedAnswer !== questionArray[i].correct_answer) {
      score -= 10;
      questionArray[i].answered = false;
    }
  } else {
    if (selectedAnswer === questionArray[i].correct_answer) {
      score += 10;
      questionArray[i].answered = true;
    }
  }
}

function showTheLastPage() {
  console.log("hello");
}

getQuestions();
