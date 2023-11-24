let apiUrl = "https://opentdb.com/api.php?amount=10&type=multiple";

const quizContainer = document.querySelector(".main-container");
const question = document.querySelector(".question");
const answer1 = document.querySelector(".answer1");
const answer2 = document.querySelector(".answer2");
const answer3 = document.querySelector(".answer3");
const answer4 = document.querySelector(".answer4");

const nextButton = document.querySelector(".next-button");
let selectedAnswerUser = [];

let currentQuestionIndex = 0;
let noOfCorrectAnswers = 0;

//first we need to get quesiton and answer

let questionData = undefined;
let i = 0;
async function getQuestionAnswer() {
  await fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      questionData = data.results;
      FillDetails(0);
    });
}

getQuestionAnswer();
let alreadyClicked = false;

function FillDetails(currentQuestionIndex) {
  alreadyClicked = false;
  question.innerText = questionData[currentQuestionIndex].question;
  let answersArray = [
    ...questionData[currentQuestionIndex].incorrect_answers,
    questionData[currentQuestionIndex].correct_answer,
  ];

  shuffleArray(answersArray);

  answer1.innerText = answersArray[0];
  answer2.innerText = answersArray[1];
  answer3.innerText = answersArray[2];
  answer4.innerText = answersArray[3];

  if (!alreadyClicked) {
    answer1.addEventListener("click", () => handleAnswerSelection(answer1));
    answer2.addEventListener("click", () => handleAnswerSelection(answer2));
    answer3.addEventListener("click", () => handleAnswerSelection(answer3));
    answer4.addEventListener("click", () => handleAnswerSelection(answer4));

    // Function to handle user's answer selection
    // ...

    function handleAnswerSelection(selectedAnswer) {
      // Check if the selected answer is correct
      if (alreadyClicked) {
        return; // Do nothing if the user has already clicked
      }
      alreadyClicked = true;
      const correctAnswer = questionData[currentQuestionIndex].correct_answer;
      // console.log("Selected answer:", selectedAnswer.innerText);
      // console.log("Correct answer:", correctAnswer);

      if (selectedAnswer.innerText === correctAnswer) {
        // User selected the correct answer
        selectedAnswer.classList.add("correct-answer");
        noOfCorrectAnswers++;
        selectedAnswerUser.push(selectedAnswer.innerText);

        // Add your logic for correct answer (e.g., scoring, feedback, etc.)
      } else {
        // User selected the wrong answer
        selectedAnswer.classList.add("wrong-answer");
        selectedAnswerUser.push(selectedAnswer.innerText);

        for (let i = 1; i <= 4; i++) {
          const answerElement = document.querySelector(`.answer${i}`);
          if (answerElement.innerText === correctAnswer) {
            answerElement.classList.add("correct-answer");
          }
        }

        // Add your logic for wrong answer (e.g., feedback, etc.)
      }

      // Remove event listeners after answer is selected
      answer1.disabled = true;
      answer2.disabled = true;
      answer3.disabled = true;
      answer4.disabled = true;

      alreadyClicked = true;

      // Proceed to the next question
      currentQuestionIndex++;
    }
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

//next button functionality

nextButton.addEventListener("click", () => {
  if (!alreadyClicked) {
    alert("Please Select one answer");
  } else {
    answer1.classList.remove("correct-answer", "wrong-answer");
    answer2.classList.remove("correct-answer", "wrong-answer");
    answer3.classList.remove("correct-answer", "wrong-answer");
    answer4.classList.remove("correct-answer", "wrong-answer");
    currentQuestionIndex++;
    answer1.disabled = false;
    answer2.disabled = false;
    answer3.disabled = false;
    answer4.disabled = false;
    if (currentQuestionIndex < 9) {
      FillDetails(currentQuestionIndex);
    } else if (currentQuestionIndex == 9) {
      FillDetails(currentQuestionIndex);
    } else {
      quizContainer.removeChild(document.querySelector(".question-div"));
      quizContainer.removeChild(document.querySelector(".answer-div"));
      quizContainer.removeChild(nextButton);
      const showResultsButton = document.createElement("button");
      showResultsButton.textContent = "Show Your Result";
      showResultsButton.classList.add("next-button");

      quizContainer.appendChild(showResultsButton);

      showResultsButton.addEventListener("click", () => {
        quizContainer.removeChild(showResultsButton);
        quizContainer.style.height = "600px";
        quizContainer.innerHTML = `
        <div id="myProgress">
          <div id="myBar"></div>
        </div>
        `;
        const divele = document.createElement("div");
        divele.id = "progress-bar";
        divele.style.width = "100%";
        const mybardiv = document.createElement("div");
        mybardiv.id = "myBar";

        mybardiv.style.width = `${noOfCorrectAnswers * 10}%`;
        mybardiv.style.height = "30px";
        mybardiv.style.backgroundColor = "#071CA2";
        mybardiv.style.textAlign = "center";
        mybardiv.style.lineHeight = "30px"; /* To center it vertically */
        mybardiv.style.color = "white";
        divele.appendChild(mybardiv);
        quizContainer.appendChild(divele);

        const resultContainer = document.createElement("ul");
        resultContainer.classList.add("list", "answer-div");
        quizContainer.appendChild(resultContainer);
        console.log(selectedAnswerUser);

        for (let i = 0; i < 10; i++) {
          let listItem = document.createElement("li");
          if (selectedAnswerUser[i] === questionData[i].correct_answer) {
            listItem.innerHTML = `<span id="correct">Correct :</span>    ${questionData[i].correct_answer}`;
          } else {
            listItem.innerHTML = `
              <span id="correct">Correct :</span> ${questionData[i].correct_answer}                
              <span id="incorrect">         Your Answer :</span>     ${selectedAnswerUser[i]}
            `;
          }
          resultContainer.appendChild(listItem);
        }
      });
    }
  }
});
