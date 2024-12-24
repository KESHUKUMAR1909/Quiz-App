let quesArr = [];
async function getQuestions() {
  try {

    // Fetching the Questions from The Api--------------->
    const response = await fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple");

    if (!response.ok) {
      // Handle HTTP errors
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Getting the response in the JSON form
    const questions = await response.json(); // Await JSON parsing
    // Getting the Questions Array From the  questions we got  along with the answers 
    const questionArray = questions.results;
    console.log(questions.results);


    // Making the array of only questions 
    for (let i = 0; i < questionArray.length; i++) {
      quesArr.push(((questionArray[i].question)));
    }
    console.log(quesArr);

    // Code for appending the questions in the body---->
    let div = document.createElement("div");
    div.classList.add("questions_div");
    let ul = document.createElement("ul");
    div.appendChild(ul);

    for (let i = 0; i < quesArr.length; i++) {
      ul.innerHTML += `<li class="questionli">Question${i + 1}</>`
    }
    let quiz_area = document.getElementById("quiz_area");
    quiz_area.appendChild(div);

    function showtheNextPage() {
      div.classList.add("slider");
      quiz_area.classList.add("hidden")

    }

    // Adding event listener to the Start Button------------>
    let strtBtn = document.getElementById("start_btn");
    console.log(strtBtn);
    strtBtn.addEventListener("click", (e) => {
      console.log("Button Clicked")
      showtheNextPage(e);
    });

    function showTheQuestionPage(i) {
      console.log(`index ${i} hitted`);
      let j =i;
      let div2 = document.createElement("div");
      div2.classList.add("questions_div2");
      div2.classList.add("slider");
      div.classList.add("slider2");
      let p = document.createElement("p");
      p.classList.add("question_p_tag");
      p.textContent += `Ques${i + 1}-> ${questionArray[i].question}`;
      let optionUl = document.createElement("ul");
      optionUl.classList.add("optionUl")
      optionUl.innerHTML += `<li> ${1}.  ${questionArray[i].correct_answer}</li>`;
      for (let i = 0; i < questionArray[j].incorrect_answers.length; i++) {
        console.log(questionArray[j].incorrect_answers[i]);
        optionUl.innerHTML += `<li> ${i + 2}.  ${questionArray[j].incorrect_answers[i]}</li>`;
      }
     
      let BtnContainer = document.createElement("div");
      BtnContainer.classList.add("next_prev_btn")
      let nextBtn = document.createElement("button");
      let prevBtn = document.createElement("button");
      nextBtn.textContent += "Next";
      prevBtn.textContent += "Prev";
      BtnContainer.appendChild(prevBtn);
      BtnContainer.appendChild(nextBtn);
      div2.appendChild(p);
      div2.appendChild(optionUl);
      div2.appendChild(BtnContainer);
      quiz_area.appendChild(div2);

      nextBtn.addEventListener("click",()=>{
        showTheNextQuestion(i,div2);
      });
      prevBtn.addEventListener("click",()=>{
        showThePreviousQuestioin(i,div2);
      })


    }
    function showTheNextQuestion(i ,div2){
      if(i<quesArr.length-1){
        div2.classList.add("slider2");
        i+=1
        showTheQuestionPage(i);
       
       }
    }
    function showThePreviousQuestioin(i,div2){
       if(i>0){
        div2.classList.add("slider2");
        i-=1;
        showTheQuestionPage(i);
       
       }
        
    }

    // Adding event listeners to the li element
    let quesLi = Array.from(document.getElementsByClassName("questionli"));
    for (let i = 0; i < quesLi.length; i++) {
      quesLi[i].addEventListener("click", () => {
        showTheQuestionPage(i);
      })
    }

  } catch (error) {
    console.error("Error fetching quiz questions:", error.message);
  }
}

getQuestions();
