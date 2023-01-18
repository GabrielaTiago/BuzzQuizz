const BASE_API_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";
let QUIZZ = {};
let UPDATE_QUIZZ = null;
let UPDATE_ID = 0;
let UPDATE_KEY = "";

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
        <i class="fa-regular fa-pen-to-square icon edit" onclick="updateQuizzData(${id}, '${key}')"></i>
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

function updateQuizzData(id, key) {
  openNewQuizzPage();
  getTheQuizzDataToBeUpdated(id);
  UPDATE_ID = id;
  UPDATE_KEY = key;
}

function getTheQuizzDataToBeUpdated(id) {
  axios
    .get(`${BASE_API_URL}/${id}`)
    .then((res) => {
      UPDATE_QUIZZ = res.data;
      updateInitalsInputs();
    })
    .catch((err) => {
      console.error(err);
      alert(`Erro ${err.status} - Problema ao buscar quiz`);
    });
}

function updateInitalsInputs() {
  const { title, image, questions, levels } = UPDATE_QUIZZ;
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

function updateQuestionsInputs() {
  const { questions } = UPDATE_QUIZZ;

  questions.forEach((question, indexQuestion) => {
    const { title, color, answers } = question;

    const allQuestions = document.querySelectorAll(".form-box");

    allQuestions.forEach((element, indexElement) => {
      if (indexQuestion === indexElement) {
        updateQuestionTitleAndColor(element, title, color);
        updateAnswersInputs(element, answers);
      }
    });
  });
}

function updateQuestionTitleAndColor(element, title, color) {
  const allInputs = element.querySelectorAll(".title-color .form-input");

  allInputs.forEach((element) => {
    const isTitle = element.classList.contains("input-title");
    const isColor = element.classList.contains("input-color");

    if (isTitle) {
      element.value = title;
    }
    if (isColor) {
      element.value = color;
    }
  });
}

function updateAnswersInputs(element, answers) {
  const answersInputs = element.querySelectorAll(".answers");

  answersInputs.forEach((answerBox, answerBoxIndex) => {
    const inputs = answerBox.querySelectorAll(".form-input");

    inputs.forEach((input) => {
      const isText = input.classList.contains("input-txt");
      const isImage = input.classList.contains("input-image");

      answers.forEach((answer, answerIndex) => {
        const { text, image } = answer;

        if (answerBoxIndex === answerIndex) {
          if (isText) {
            input.value = text;
          }
          if (isImage) {
            input.value = image;
          }
        }
      });
    });
  });
}

function updateLevelData() {
  const { levels } = UPDATE_QUIZZ;

  levels.forEach((level, levelIndex) => {
    const allLevels = document.querySelectorAll(".form-box");

    allLevels.forEach((element, elementIndex) => {
      if (levelIndex === elementIndex) {
        updateLevelsInputs(element, level);
      }
    });
  });
}

function updateLevelsInputs(element, level) {
  const { title, image, text, minValue } = level;
  const allInputs = element.querySelectorAll(".form-input");

  allInputs.forEach((input) => {
    const isTitle = input.classList.contains("input-title");
    const isPercentage = input.classList.contains("input-percentage");
    const isImage = input.classList.contains("input-image");
    const isDescription = input.classList.contains("input-description");

    if (isTitle) {
      input.value = title;
    }
    if (isPercentage) {
      input.value = minValue;
    }
    if (isImage) {
      input.value = image;
    }
    if (isDescription) {
      input.value = text;
    }
  });
}

function updateQuizz() {
  const requestURL = `${BASE_API_URL}/${UPDATE_ID}`;
  const requestBody = QUIZZ;
  const requestHeaders = { headers: { "Secret-Key": UPDATE_KEY } };

  axios
    .put(requestURL, requestBody, requestHeaders)
    .then((res) => {
      const { status, statusText } = res;
      console.info(
        `%c${status}, ${statusText} - Quiz atualizado com sucesso`,
        "color: blue; font-weight: bold; font-size: 15px; line-height: 25px;"
      );
      goToHomePage();
    })
    .catch((err) => {
      console.error(err);
      alert(`Erro ${err.status} - Problema ao atualizar o quiz`);
    });
}

function elementConstructor(elementContainer) {
  const container = document.querySelector(".home-page-container");
  container.innerHTML += elementContainer;
}

function startsLoading() {
  const container = document.querySelector("body");
  const loadingHTML = `
    <div class="modal-loading">
      <img
        class="spinner"
        src="src/assets/img/spinner.gif"
        alt="spinner-gif"
      />
    </div>
  `;
  container.innerHTML += loadingHTML;
}

function endsLoading() {
  document.querySelector(".modal-loading").remove();
}
