let quizzLevels = [];
let numberOfQuestions = 0;
let answeredQuestionsCounter = 0;
let correctAnswersCounter = 0;

function accessQuizz(id) {
  document.querySelector("main").remove();
  getQuizzData(id);
}

function getQuizzData(id) {
  axios
    .get(`${BASE_API_URL}/${id}`)
    .then((res) => {
      const { data } = res;
      buildsElementsOfThePlayQuizzPage(data);
    })
    .catch((err) => {
      console.error(err);
      alert(`Erro ${err.status} - Problema ao carregar quizz`);
      window.location.reload();
    });
}

function buildsElementsOfThePlayQuizzPage(data) {
  const { title, image, questions, levels } = data;
  quizzLevels = levels;

  buildsQuizzContainerElement();
  buildsQuizzBannerElement(title, image);
  buildsQuestionsElements(questions);
}

function buildsQuizzContainerElement() {
  const container = `
    <main class="main">
      <div class="play-quizz-container"></div>
    </main>
  `;
  document.querySelector("body").innerHTML += container;
}

function buildsQuizzBannerElement(title, image) {
  const container = document.querySelector(".play-quizz-container");
  const bannerHTML = `
    <div class="play-quizz-container">
      <div class="banner">
        <img class="quizz-img" src="${image}" alt="quizz-image" />
        <div class="banner-overlay"></div>
        <h2 class="banner-title">${title}</h2>
      </div>
    </div>
  `;
  container.innerHTML += bannerHTML;
}

function buildsQuestionsElements(questions) {
  numberOfQuestions = questions.length;
  questions.forEach((question, index) => {
    const { title, color, answers } = question;
    buildsQuestion(index, title, color, answers);
  });
}

function buildsQuestion(questionIndex, title, color, answers) {
  const container = document.querySelector(".play-quizz-container");
  const questionHTML = `
    <div class="question-box question-${questionIndex}">
      <div class="question-box-title" style="background-color:${color}">
        <h4 class="question-title">${title}</h4>
      </div>
      <div class="answers-container">${buildsAnswersElements(
        answers,
        questionIndex
      )}</div>
    </div>
  `;
  container.innerHTML += questionHTML;
}

function buildsAnswersElements(answers, questionIndex) {
  const randomAnswers = suffleQuizz(answers);
  let questionAnswers = "";

  randomAnswers.forEach((answer) => {
    const { text, image, isCorrectAnswer } = answer;
    questionAnswers += buildsAnswerElement(
      text,
      image,
      isCorrectAnswer,
      questionIndex
    );
  });
  return questionAnswers;
}

function buildsAnswerElement(text, image, isCorrectAnswer, questionIndex) {
  let answerType = "incorrect-answer";
  if (isCorrectAnswer) answerType = "correct-answer";

  const answerHTML = `
    <div
      class="answer-box ${answerType}"
      onclick="selectAnswer(this, ${isCorrectAnswer}, ${questionIndex})"
    >
      <img class="answer-image" src="${image}" alt="answer-image" />
      <h6 class="answer-text">${text}</h6>
    </div>
  `;
  return answerHTML;
}

function suffleQuizz(array) {
  const suffledArray = array.sort(() => Math.random() - 0.5);
  return suffledArray;
}

function selectAnswer(answer, isCorrectAnswer, questionIndex) {
  answeredQuestionsCounter++;
  if (isCorrectAnswer) correctAnswersCounter++;

  const answers = answer.parentNode;
  const answerBox = answers.querySelectorAll(".answer-box");

  answers.classList.add("answered");

  answerBox.forEach((item) => {
    const correct = item.classList.contains("correct-answer");

    if (item !== answer) item.classList.add("unselected");

    if (correct) item.classList.add("correct");
    else item.classList.add("incorrect");
  });

  checksTheEndOfTheQuizz(questionIndex);
}

function checksTheEndOfTheQuizz(questionIndex) {
  const lastQuestion = numberOfQuestions - 1;

  if (answeredQuestionsCounter !== numberOfQuestions) {
    if (questionIndex !== lastQuestion) {
      const nextQuestion = document.querySelector(
        `.question-${questionIndex + 1}`
      );
      scrollToTheNextElement(nextQuestion);
    }
  } else {
    endQuizz();
    const level = document.querySelector(".level-container");
    scrollToTheNextElement(level);
  }
}

function calculatesHitLevel() {
  const x = correctAnswersCounter * 100;
  const hitLevel = parseInt(x / numberOfQuestions);

  return hitLevel;
}

function decreasingOrder() {
  quizzLevels.sort((a, b) => {
    return b.minValue - a.minValue;
  });
}

function endQuizz() {
  decreasingOrder();
  const hitLevel = calculatesHitLevel();

  for (const element of quizzLevels) {
    const level = element;
    const { title, image, text, minValue } = level;

    if (minValue <= hitLevel) {
      buildsQuizzLevelElement(hitLevel, title, image, text);
      break;
    }
  }
}

function buildsQuizzLevelElement(hitLevel, title, image, text) {
  const container = document.querySelector(".play-quizz-container");
  const levelHTML = `
    <div class="level-container">
      <div class="level-box">
        <div class="level-box-title">
          <h4 class="level-title">${hitLevel}% de acerto: ${title}</h4>
        </div>
        <div class="level-content">
          <img class="level-image" src="${image}" alt="level-image" />
          <p class="level-text">${text}</p>
        </div>
      </div>
      <div class="buttons">
        <button class="button-quizz">Reiniciar Quizz</button>
        <button class="button-quizz-home">Voltar pra home</button>
      </div>
    </div>
  `;
  container.innerHTML += levelHTML;
}

function scrollToTheNextElement(element) {
  const TWO_SECONDS = 2000;
  function scroll() {
    element.scrollIntoView({ behavior: "smooth" });
  }
  setTimeout(scroll, TWO_SECONDS);
}
