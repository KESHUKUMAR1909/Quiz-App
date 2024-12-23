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
    console.table(questionArray);


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

    for(let i =0;i<quesArr.length;i++) {
        ul.innerHTML+=`<li class="questionli">Question${i+1}</>`
    }
    let quiz_area= document.getElementById("quiz_area");
    quiz_area.appendChild(div);

    function showtheNextPage(){
      div.classList.add("slider");
      quiz_area.classList.add("hidden")
    
    }
   

    // Adding event listener to the Start Button------------>
    let strtBtn = document.getElementById("start_btn");
    console.log(strtBtn);
    strtBtn.addEventListener("click",(e)=>{
      console.log("Button Clicked")
      showtheNextPage(e);
    })

  } catch (error) {
    console.error("Error fetching quiz questions:", error.message);
  }
}

getQuestions();
