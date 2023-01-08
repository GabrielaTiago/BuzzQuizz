const BASE_API_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";

checksForUserQuizzes();
buildsAlQuizzesContainerElement();
getsAllQuizzes();

function goToHomePage() {
  window.location.reload();
}

function checksForUserQuizzes() {
  const userQuizzes = localStorage.getItem("userQuizzes");
  const exitUserQuizzes = JSON.parse(userQuizzes);

  if (exitUserQuizzes) {
    buildsUserQuizzContainerElement();
    getsUserQuizzes(exitUserQuizzes);
  } else {
    buildsCreateQuizzElement();
  }
}

function buildsCreateQuizzElement() {
  const createQuizzContainer = `
    <div class="create-quiz-container home-page">
      <h4 class="create-quiz-text">Você não criou nenhum </br> quizz ainda :(</h4>
      <button class="create-quiz-button" onclick="openNewQuizzPage()">Criar Quiz</button>
    </div>
  `;
  elementConstructor(createQuizzContainer);
}

function buildsUserQuizzContainerElement() {
  const userQuizzesContainer = `
    <div class="quizzes-container home-page user-quizzes-container">
      <div class="user-quizzes-title">
        <h3 class="quizzes-title">Seus Quizzes</h3>
        <i class="fa-solid fa-circle-plus icon add-icon" onclick="openNewQuizzPage()"></i>
      </div>
      <div class="all-user-quizzes"></div>
    </div>
  `;
  elementConstructor(userQuizzesContainer);
}

function buildsAlQuizzesContainerElement() {
  const allQuizzesContainer = `
    <div class="quizzes-container home-page">
      <h3 class="quizzes-title">Todos os Quizzes</h3>
      <div class="all-quizzes"></div>
    </div>
  `;
  elementConstructor(allQuizzesContainer);
}

function buildsQuizzElement(quizz, quizzesContainer) {
  const { id, title, image } = quizz;
  const quizzHTML = `
    <div id="${id}" class="quizz">
      <img class="quizz-img" src="${image}" />
      <div class="quizz-overlay" onclick="accessQuizz(${id})"></div>
      <h5 class="quizz-title" onclick="accessQuizz(${id})">${title}</h5>
    </div>
  `;
  quizzesContainer.innerHTML += quizzHTML;
}

function getsUserQuizzes(userQuizzes) {
  let userQuizzesContainer = document.querySelector(".all-user-quizzes");

  userQuizzes.forEach((quizz) => {
    buildsQuizzElement(quizz, userQuizzesContainer);
  });
}

function getsAllQuizzes() {
  axios
    .get(BASE_API_URL)
    .then((res) => {
      const { data } = res;
      renderQuizzes(data);
    })
    .catch((err) => {
      console.error(err);
      alert(`Erro ${err.status} - Problema ao carregar quizzes`);
      window.location.reload();
    });
}

function renderQuizzes(allQuizzes) {
  let quizzesContainer = document.querySelector(".all-quizzes");

  allQuizzes.forEach((quizz) => {
    buildsQuizzElement(quizz, quizzesContainer);
  });
}

function elementConstructor(elementContainer) {
  const container = document.querySelector("main");
  container.innerHTML += elementContainer;
}
