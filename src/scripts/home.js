const BASE_API_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";

checksForUserQuizzes();
buildsAlQuizzesContainerElement();
getsAllQuizzes();

function goToHomePage() {
  window.location.reload();
}

function getPersistedQuizzesFromLocalStorage() {
  const userQuizzes = localStorage.getItem("userQuizzes");
  const exitUserQuizzes = JSON.parse(userQuizzes);

  return exitUserQuizzes;
}

function checksForUserQuizzes() {
  const exitUserQuizzes = getPersistedQuizzesFromLocalStorage();

  if (exitUserQuizzes) {
    getsUserQuizzes(exitUserQuizzes);
    buildsUserQuizzContainerElement();
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
      <div class="quizzes-title-container">
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
      <div class="quizzes-title-container">
        <h3 class="quizzes-title">Todos os Quizzes</h3>
      </div>
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

function buildsUserQuizzesElements(quizz, quizzesContainer) {
  const { id, title, image, key } = quizz;
  const quizzHTML = `
    <div id="${id}" class="quizz">
      <div class="edit-delete-container">
        <i class="fa-regular fa-pen-to-square icon edit" onclick="updateQuizz(${id}, '${key}')"></i>
        <i class="fa-regular fa-trash-can icon delete" onclick="deleteQuizz(${id}, '${key}')"></i>
      </div>
      <img class="quizz-img" src="${image}" />
      <div class="quizz-overlay" onclick="accessQuizz(${id})"></div>
      <h5 class="quizz-title" onclick="accessQuizz(${id})">${title}</h5>
    </div>
  `;
  quizzesContainer.innerHTML += quizzHTML;
}

function getsUserQuizzes(userQuizzes) {
  userQuizzes.forEach((quizz) => {
    const { id, key } = quizz;

    axios
      .get(`${BASE_API_URL}/${id}`)
      .then((res) => {
        const { data } = res;
        renderUserQuizzes([{ ...data, key }]);
      })
      .catch((err) => {
        console.error(err);
        alert(`Erro ${err.status} - Problema ao carregar seus quizzes`);
        window.location.reload();
      });
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

function renderUserQuizzes(userQuizzes) {
  let userQuizzesContainer = document.querySelector(".all-user-quizzes");

  userQuizzes.forEach((quizz) => {
    buildsUserQuizzesElements(quizz, userQuizzesContainer);
  });
}

function deleteQuizz(id, key) {
  const userDecision = confirm("Realmente deseja deletar este quiz?");
  const requestURL = `${BASE_API_URL}/${id}`;
  const requestHeaders = { headers: { "Secret-Key": key } };

  if (!userDecision) {
    return;
  }

  axios
    .delete(requestURL, requestHeaders)
    .then((res) => {
      const { status, statusText } = res;
      deleteFromLocalStorage(id);
      console.info(
        `%c${status}, ${statusText} - Quiz deletado com sucesso`,
        "color: red; font-weight: bold; font-size: 15px; line-height: 25px;"
      );
      window.location.reload();
    })
    .catch((err) => {
      console.error(err);
      alert(`Err ${err.message} - Problema ao deletar quiz`);
    });
}

function deleteFromLocalStorage(id) {
  const allUserQuizzes = getPersistedQuizzesFromLocalStorage();
  let remainingQuizzes = allUserQuizzes.filter((quizz) => quizz.id !== id);

  if (remainingQuizzes.length === 0) remainingQuizzes = null;

  localStorage.userQuizzes = JSON.stringify(remainingQuizzes);
}

function updateQuizz(id, key) {
  openNewQuizzPage();
  getTheQuizzDataToBeUpdated(id);
}

function getTheQuizzDataToBeUpdated(id) {
  let quizz = {};

  axios
    .get(`${BASE_API_URL}/${id}`)
    .then((res) => {
      quizz = res.data;
      updateInitalsInputs(quizz);
    })
    .catch((err) => {
      console.error(err);
      alert(`Erro ${err.status} - Problema ao buscar quiz`);
    });
}

function updateInitalsInputs(quizz) {
  const { title, image, questions, levels } = quizz;
  const numberOfQuestions = questions.length;
  const numberOfLevels = levels.length;

  const allInputs = document.querySelectorAll(".form-input");

  allInputs.forEach((element) => {
    const isTitle = element.classList.contains("input-title");
    const isImage = element.classList.contains("input-image");
    const isNumbOfQuestions = element.classList.contains("input-question");
    const isNumbOfLevels = element.classList.contains("input-level");

    if (isTitle) {
      element.value = title;
    }
    if (isImage) {
      element.value = image;
    }
    if (isNumbOfQuestions) {
      element.value = numberOfQuestions;
    }
    if (isNumbOfLevels) {
      element.value = numberOfLevels;
    }
  });
}

function elementConstructor(elementContainer) {
  const container = document.querySelector(".home-page-container");
  container.innerHTML += elementContainer;
}
