let apiUrl = "https://opentdb.com/api.php?amount=10&category=28&type=multiple";

const question = document.querySelector(".question");
const answer1 = document.querySelector(".answer1");
const answer2 = document.querySelector(".answer2");
const answer3 = document.querySelector(".answer3");
const answer4 = document.querySelector(".answer4");

const nextButton = document.querySelector(".next-button");

let currentQuestionIndex = 0;

//first we need to get quesiton and answer

let questionData = undefined;
let i = 0;
async function getQuestionAnswer() {
  await fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      questionData = data.results;
      console.log(questionData);
      FillDetails(0);
    });
}

getQuestionAnswer();

function FillDetails(currentQuestionIndex) {
  let alreadyClicked = false;
  question.innerText = questionData[currentQuestionIndex].question;
  let answersArray = [
    ...questionData[currentQuestionIndex].incorrect_answers,
    questionData[currentQuestionIndex].correct_answer,
  ];
  console.log(answersArray);
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
    function handleAnswerSelection(selectedAnswer) {
      // Check if the selected answer is correct
      const correctAnswer = questionData[currentQuestionIndex].correct_answer;

      if (selectedAnswer.innerText === correctAnswer) {
        // User selected the correct answer
        selectedAnswer.classList.add("correct-answer");
        // Add your logic for correct answer (e.g., scoring, feedback, etc.)
      } else {
        // User selected the wrong answer
        selectedAnswer.classList.add("wrong-answer");
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
      // if (currentQuestionIndex < 10) {
      //   FillDetails(currentQuestionIndex);
      // } else {
      //   console.log("Reached the end of questions");
      // }
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
  answer1.classList.remove("correct-answer", "wrong-answer");
  answer2.classList.remove("correct-answer", "wrong-answer");
  answer3.classList.remove("correct-answer", "wrong-answer");
  answer4.classList.remove("correct-answer", "wrong-answer");
  currentQuestionIndex++;
  answer1.disabled = false;
  answer2.disabled = false;
  answer3.disabled = false;
  answer4.disabled = false;
  if (currentQuestionIndex < 10) {
    FillDetails(currentQuestionIndex);
  } else {
    console.log("hi");
  }
});
