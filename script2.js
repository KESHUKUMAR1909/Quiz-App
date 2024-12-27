let quesArr = [];
let questionPage = [];
let score = 0;
let currentQuestionIndex = 0;
let questionArray = [];

async function getQuestions() {
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const questions = await response.json();
        questionArray = questions.results;

        // Create question pages
        questionArray.forEach((question, index) => {
            quesArr.push(question.question);
            showTheQuestionPage(question, index);
        });

        // Setup start button
        const strtBtn = document.getElementById("start_btn");
        strtBtn.addEventListener("click", () => {
            document.getElementById("quiz_area").classList.remove("hidden");
            showQuestion(currentQuestionIndex);
        });

    } catch (error) {
        console.error("Error fetching quiz questions:", error.message);
    }
}

function showTheQuestionPage(question, index) {
    const div2 = document.createElement("div");
    div2.classList.add("questions_div2");
    div2.classList.add("slider");

    const p = document.createElement("p");
    p.classList.add("question_p_tag");
    p.textContent = `Ques ${index + 1}: ${question.question}`;

    const optionUl = document.createElement("ul");
    optionUl.classList.add("optionUl");

    // Add correct answer
    optionUl.innerHTML += `<div class="optionDiv"><li>1. ${question.correct_answer}</li><span class="spanBox"></span></div>`;
    
    // Add incorrect answers
    question.incorrect_answers.forEach((answer, i) => {
        optionUl.innerHTML += `<div class="optionDiv"><li>${i + 2}. ${answer}</li><span class="spanBox"></span></div>`;
    });

    const BtnContainer = document.createElement("div");
    const scoreButton = document.createElement("button");
    scoreButton.textContent = `Score: ${score}`;
    scoreButton.classList.add("score_button");

    const nextBtn = document.createElement("button");
    const prevBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    prevBtn.textContent = "Prev";

    BtnContainer.appendChild(prevBtn);
    BtnContainer.appendChild(scoreButton);
    BtnContainer.appendChild(nextBtn);
    div2.appendChild(p);
    div2.appendChild(optionUl);
    div2.appendChild(BtnContainer);
    questionPage.push(div2);

    // Add event listeners for options
    const spanBoxes = div2.getElementsByClassName("spanBox");
    Array.from(spanBoxes).forEach((element, idx) => {
        element.addEventListener("click", () => checkValidation(index, idx));
    });

    // Add event listeners for navigation buttons
    nextBtn.addEventListener("click", () => {
        if (currentQuestionIndex < questionPage.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }
    });
}

function showQuestion(index) {
    const quizArea = document.getElementById("quiz_area");
    quizArea.innerHTML = ''; // Clear previous question
    quizArea.appendChild(questionPage[index]); // Show current question
    const scoreButton = quizArea.querySelector(".score_button");
    scoreButton.textContent = `Score: ${score}`;
}

function checkValidation(questionIndex, selectedIndex) {
    const question = questionArray[questionIndex];
    const correctAnswer = question.correct_answer;
    const selectedAnswer = selectedIndex === 0 ? correctAnswer : question.incorrect_answers[selectedIndex - 1];

    // Update score based on the selected answer
    if (selectedAnswer === correctAnswer) {
        score += 10; // Increment score
    } else {
        score -= 10; // Decrement score
    }

    // Update score display
    const scoreButton = document.querySelector(".score_button");
    scoreButton.textContent = `Score: ${score}`;

    // Highlight the selected option
    const optionDivs = document.querySelectorAll('.optionDiv');
    optionDivs.forEach((div, idx) => {
        const span = div.querySelector('.spanBox');
        if (idx === selectedIndex) {
            span.style.backgroundColor = selectedAnswer === correctAnswer ? "green" : "red";
        }
        span.style.pointerEvents = "none"; // Disable further clicks on options
    });

    // Disable further interaction with options
    const spanBoxes = document.querySelectorAll(".spanBox");
    spanBoxes.forEach(span => {
        span.style.pointerEvents = "none";
    });
}

getQuestions();  // Call the function to start fetching questions
