let quizz = {};

addKeyDownEvents();

function openNewQuizzPage() {
  let homePageElements = document.querySelectorAll(".home-page");

  homePageElements.forEach((element) => element.remove());

  buildsElementsOfTheQuizCreationPage();
}

function buildsElementsOfTheQuizCreationPage() {
  let main = document.querySelector("main");

  const formContent = `
    <div class="create-quizz-page">
      <h3 class="create-quizz-title">Comece pelo começo</h3>
      <form class="create-quizz-form" name="create-quizz-init" onsubmit="handleFormSubmit(event)">
        <div class="form-box">
          <div class="input">
            <input class="form-input input-title" required type="text" placeholder="Título do quizz">
          </div>
          <div class="input">
            <input class="form-input input-image" required type="text"  placeholder="URL da imagem do seu quizz">
          </div>
          <div class="input">
            <input class="form-input input-question" required type="number" placeholder="Quantidade de pergutas do quizz">
          </div>
          <div class="input">
            <input class="form-input input-level" required type="number" placeholder="Quantidade de níveis do quizz">
          </div>
        </div>
        <button type="submit" class="form-button">Prosseguir pra criar perguntas</button>
      </form>
    </div>
  `;

  main.innerHTML += formContent;
}

function handleFormSubmit(event) {
  event.preventDefault();
  clearErrors();
  const quizzData = getInitialFormData();
  validatesInitialFormData(quizzData);
}

function getInitialFormData() {
  const formInputsValues = document.querySelectorAll(".form-input");
  let quizzData = {};

  formInputsValues.forEach((element) => {
    const isTitle = element.classList.contains("input-title");
    const isImage = element.classList.contains("input-image");
    const isNumbOfQuestions = element.classList.contains("input-question");
    const isNumbOfLevels = element.classList.contains("input-level");
    const { value } = element;

    if (isTitle) {
      const isValid = validadesTheQuizzTitle(value, element);
      if (isValid) {
        quizzData = { ...quizzData, title: value };
      }
    }

    if (isImage) {
      const isValid = validatesTheImageURL(value, element);
      if (isValid) {
        quizzData = { ...quizzData, image: value };
      }
    }

    if (isNumbOfQuestions) {
      const question = parseInt(value);
      const isValid = validatesTheNumberOfQuestions(question, element);
      if (isValid) {
        quizzData = { ...quizzData, numberOfQuestions: question };
      }
    }

    if (isNumbOfLevels) {
      const level = parseInt(value);
      const isValid = validatesTheNumberOfLevels(level, element);
      if (isValid) {
        quizzData = { ...quizzData, numberOfLevels: level };
      }
    }
  });

  return quizzData;
}

function validatesInitialFormData(quizzData) {
  const errors = document.querySelector(".form-box .error-message");

  if (errors === null) {
    quizz = quizzData;
    buildsElementsOfTheQuestionsCriationPage();
  }
}

function validadesTheQuizzTitle(title, element) {
  const invalidTitle = title.length < 20 || title.length >= 65;

  if (invalidTitle) {
    element.classList.add("input-error");

    const container = element.parentNode;
    const spanError = `
      <span class="error-message">Seu título tem ${title.length} caracteres. Necessita ter entre 20 e 65 caracteres para ser válido</span>
    `;
    container.innerHTML += spanError;
    return false;
  }
  return true;
}

function validatesTheImageURL(image, element) {
  const imageURLRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
  const validImage = imageURLRegex.test(image);

  if (!validImage) {
    element.classList.add("input-error");

    const container = element.parentNode;
    const spanError = `
      <span class="error-message">O valor informado não é uma URL válida</span>
    `;
    container.innerHTML += spanError;
    return false;
  }
  return true;
}

function validatesTheNumberOfQuestions(numberOfQuestions, element) {
  const invalidNumber = numberOfQuestions < 3;

  if (invalidNumber) {
    element.classList.add("input-error");

    const container = element.parentNode;
    const spanError = `
      <span class="error-message">O quizz deve ter no mínimo 3 perguntas</span>
    `;
    container.innerHTML += spanError;
    return false;
  }
  return true;
}

function validatesTheNumberOfLevels(numberOfLevels, element) {
  const invalidNumber = numberOfLevels < 2;

  if (invalidNumber) {
    element.classList.add("input-error");

    const container = element.parentNode;
    const spanError = `
      <span class="error-message">O quizz deve ter no mínimo 2 níveis</span>
    `;
    container.innerHTML += spanError;
    return false;
  }
  return true;
}

function buildsElementsOfTheQuestionsCriationPage() {
  document.querySelector(".create-quizz-page").remove();

  let container = document.querySelector("main");

  const questionsContent = `
    <div class="create-quizz-page">
      <h3 class="create-quizz-title">Crie suas perguntas</h3>
      <form class="create-quizz-form" name="create-quizz-questions" onsubmit="handleQuestionsForm(event)">
        <div class="all-questions"></div>
        <button type="submit" class="form-button">Prosseguir para criar níveis</button>
      </form>
    </div>
  `;

  container.innerHTML += questionsContent;

  buildsQuestions();
}

function buildsQuestions() {
  let allQuestions = document.querySelector(".all-questions");

  for (let i = 1; i <= quizz.numberOfQuestions; i++) {
    const questionHTML = `
      <div class="form-box">
        <div class="create-quizz-toggle">
          <h3 class="create-quizz-title">
            Pergunta ${i}
          </h3>
          <i class="fa-solid fa-pen-to-square icon" onclick="editForm(this)"></i>
        </div>
        <div class="create-quizz-data hidden">
          <div class="box-inputs title-color">
            <div class="input input-title">
              <input class="form-input input-title" type="text" placeholder="Texto da pergunta"/>
            </div>
            <div class="input input-color">
              <input class="form-input input-color" type="text" placeholder="Cor de fundo da pergunta"/>
            </div>
          </div>
        </div>
        <div class="create-quizz-data hidden">
          <h3 class="create-quizz-title" name="create-quizz-questions">
            Resposta correta
          </h3>
          <div class="box-inputs answers">
            <div class="input input-txt">
              <input class="form-input input-txt correct-answer" type="text" placeholder="Resposta correta"/>
            </div>
            <div class="input input-image">
              <input class="form-input input-image" type="text" placeholder="URL da imagem"/>
            </div>
          </div>
        </div>
        <div class="create-quizz-data hidden">
          <h3 class="create-quizz-title" name="create-quizz-questions">
            Respostas incorretas
          </h3>
          <div class="box-inputs answers">
            <div class="input input-txt">
              <input class="form-input input-txt" type="text" placeholder="Resposta incorreta 1"/>
            </div>
            <div class="input input-image">
              <input class="form-input input-image" type="text" placeholder="URL da imagem 1"/>
            </div>
          </div>
          <div class="box-inputs answers">
            <div class="input input-txt">
              <input class="form-input input-txt" type="text" placeholder="Resposta incorreta 2"/>
            </div>
            <div class="input input-image">
              <input class="form-input input-image" type="text" placeholder="URL da imagem 2"/>
            </div>
          </div>
          <div class="box-inputs answers">
            <div class="input input-txt">
              <input class="form-input input-txt" type="text" placeholder="Resposta incorreta 3"/>
            </div>
            <div class="input input-image">
              <input class="form-input input-image" type="text" placeholder="URL da imagem 3"/>
            </div>
          </div>
        </div>
      </div>
    `;
    allQuestions.innerHTML += questionHTML;
  }
}

function editForm(element) {
  let alreadyEdited = document.querySelector(".edited");

  if (alreadyEdited) {
    alreadyEdited.classList.remove("edited");
    alreadyEdited.style.display = "block";

    const container = alreadyEdited.parentNode.parentNode;
    const questions = container.querySelectorAll(".create-quizz-data");

    questions.forEach((element) => element.classList.add("hidden"));
  }
  element.classList.add("edited");
  element.style.display = "none";

  const elementsContainer = element.parentNode.parentNode;
  const hiddenElements = elementsContainer.querySelectorAll(".hidden");

  hiddenElements.forEach((element) => element.classList.remove("hidden"));
}

function handleQuestionsForm(event) {
  event.preventDefault();
  clearErrors();
  const questions = getsQuestionsFormData();
  checksTheQuestionFormForErrors(questions);
}

function checksTheQuestionFormForErrors(questions) {
  const errors = document.querySelector(".form-box .error-message");

  if (errors === null) {
    quizz = { ...quizz, questions };
    buildsElementsOfTheLevelsCriationPage();
  }
}

function getsQuestionsFormData() {
  const allQuestions = document.querySelectorAll(".form-box");
  const questions = [];
  let answers = [];

  allQuestions.forEach((element) => {
    let allAnswers = element.querySelectorAll(".answers");

    allAnswers.forEach((item) => {
      let answer = getsTheAnswers(item);
      answers.push(answer);
    });

    let question = getsTitleAndColor(element);
    question = { ...question, answers };
    questions.push(question);

    answers = [];
  });

  return questions;
}

function getsTitleAndColor(element) {
  const formInputsValues = element.querySelectorAll(".title-color .form-input");
  let question = {};

  formInputsValues.forEach((element) => {
    const isTitle = element.classList.contains("input-title");
    const isColor = element.classList.contains("input-color");
    const { value } = element;

    if (isTitle) {
      const isValid = validadesTheQuestionTitle(value, element);
      if (isValid) {
        question = { ...question, title: value };
      }
    }

    if (isColor) {
      const isValid = validatesTheColor(value, element);
      if (isValid) {
        question = { ...question, color: value };
      }
    }
  });

  return question;
}

function getsTheAnswers(element) {
  const formInputsValues = element.querySelectorAll(".answers .form-input");
  let answers = {};

  formInputsValues.forEach((element) => {
    const isCorrectAnswer = element.classList.contains("correct-answer");
    const isText = element.classList.contains("input-txt");
    const isImage = element.classList.contains("input-image");
    const { value } = element;

    if (isText) {
      if (isCorrectAnswer) {
        answers = { ...answers, isCorrectAnswer: true };
      } else {
        answers = { ...answers, isCorrectAnswer: false };
      }

      const isValid = validatesTheQuestionText(value, element);
      if (isValid) {
        answers = { ...answers, text: value };
      }
    } else if (isImage) {
      const isValid = validatesTheImageURL(value, element);
      if (isValid) {
        answers = { ...answers, image: value };
      }
    }
  });
  return answers;
}

function validadesTheQuestionTitle(title, element) {
  const invalidTitle = title.length < 20;

  if (invalidTitle) {
    element.classList.add("input-error");

    const container = element.parentNode;
    const spanError = `
      <span class="error-message">Pergunta com apenas ${title.length} caracteres. Necessita ter no mínimo 20 caracteres para ser válida</span>
    `;
    container.innerHTML += spanError;
    return false;
  }
  return true;
}

function validatesTheColor(color, element) {
  const colorRegex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
  const validColor = colorRegex.test(color);

  if (!validColor) {
    element.classList.add("input-error");

    const container = element.parentNode;
    const spanError = `
      <span class="error-message">O valor informado não é uma cor válida</span>
    `;
    container.innerHTML += spanError;
    return false;
  }
  return true;
}

function validatesTheQuestionText(text, element) {
  const validText = text.length >= 1;

  if (!validText) {
    element.classList.add("input-error");

    const container = element.parentNode;
    const spanError = `
        <span class="error-message">Este campo é obrigatório</span>
      `;
    container.innerHTML += spanError;

    return false;
  }
  return true;
}

function buildsElementsOfTheLevelsCriationPage() {
  document.querySelector(".create-quizz-page").remove();

  let container = document.querySelector("main");

  const levelsContent = `
    <div class="create-quizz-page">
      <h3 class="create-quizz-title">Agora, decida os níveis!</h3>
      <form class="create-quizz-form" name="create-quizz-levels" onsubmit="handleLevelsForm(event)">
        <div class="all-levels"></div>
        <button type="submit" class="form-button">Finalizar Quizz</button>
      </form>
    </div>
  `;

  container.innerHTML += levelsContent;

  buildsLevels();
}

function buildsLevels() {
  let allLevels = document.querySelector(".all-levels");

  for (let i = 1; i <= quizz.numberOfLevels; i++) {
    const levelHTML = `
      <div class="form-box">
        <div class="create-quizz-toggle">
          <h3 class="create-quizz-title">
            Nível ${i}
          </h3>
          <i class="fa-solid fa-pen-to-square icon" onclick="editForm(this)"></i>
        </div>
        <div class="create-quizz-data hidden"> 
          <div class="input input-title">
            <input class="form-input input-title" type="text" placeholder="Título do nível"/>
          </div>
          <div class="input percentage">
            <input class="form-input input-percentage" type="number" placeholder="% de acerto mínima"/>
          </div>
          <div class="input input-image">
            <input class="form-input input-image" type="text" placeholder="URL da imagem do nível"/>
          </div>
          <div class="input input-description">
            <textarea class="form-input description input-description" type="text" placeholder="Descrição do nível"></textarea>
          </div>
        </div>
      </div>
    `;

    allLevels.innerHTML += levelHTML;
  }
}

function handleLevelsForm(event) {
  event.preventDefault();
  clearErrors();
  const levels = getsLevelsFormData();
  checksPercentages();
  checksTheLevelFormForErrors(levels);
}

function checksTheLevelFormForErrors(levels) {
  const errors = document.querySelector(".error-message");

  if (errors === null) {
    delete quizz.numberOfQuestions;
    delete quizz.numberOfLevels;
    quizz = { ...quizz, levels };
    postQuizzToTheServer();
  }
}

function getsLevelsFormData() {
  const allLevels = document.querySelectorAll(".form-box");
  const levels = [];

  allLevels.forEach((element) => {
    const level = getLevelsValues(element);
    levels.push(level);
  });

  return levels;
}

function getLevelsValues(element) {
  const formInputsValues = element.querySelectorAll(".form-input");
  let level = {};

  formInputsValues.forEach((input) => {
    const isTitle = input.classList.contains("input-title");
    const isPercentage = input.classList.contains("input-percentage");
    const isImage = input.classList.contains("input-image");
    const isDescription = input.classList.contains("input-description");
    const { value } = input;

    if (isTitle) {
      const isValid = validadesTheLevelTitle(value, input);
      if (isValid) {
        level = { ...level, title: value };
      }
    }
    if (isPercentage) {
      const percentage = parseFloat(value);
      const isValid = validatesThePercentage(percentage, input);
      if (isValid) {
        level = { ...level, minValue: percentage };
      }
    }
    if (isImage) {
      const isValid = validatesTheImageURL(value, input);
      if (isValid) {
        level = { ...level, image: value };
      }
    }
    if (isDescription) {
      const isValid = validatesTheDescriptionText(value, input);
      if (isValid) {
        level = { ...level, text: value };
      }
    }
  });

  return level;
}

function validadesTheLevelTitle(title, element) {
  const invalidTitle = title.length < 10;

  if (invalidTitle) {
    element.classList.add("input-error");

    const container = element.parentNode;
    const spanError = `
      <span class="error-message">Título do nível possui apenas ${title.length} caracteres. Necessita ter no mínimo 10 caracteres para ser válido</span>
    `;
    container.innerHTML += spanError;
    return false;
  }
  return true;
}

function validatesThePercentage(percentage, element) {
  const invalidPercentage = percentage < 0 || percentage > 100;

  if (invalidPercentage) {
    element.classList.add("input-error");

    const container = element.parentNode;
    const spanError = `
      <span class="error-message">Percentual inválido. Escolha um número entre 0 e 100</span>
    `;
    container.innerHTML += spanError;
    return false;
  }
  return true;
}

function checksPercentages() {
  const allPercentages = document.querySelectorAll(".input-percentage");
  const percentages = [];
  const requiredValue = 0;

  allPercentages.forEach((element) => {
    const { value } = element;
    const percentage = convertPercentageInStringToNumber(value);
    percentages.push(percentage);
  });

  const hasNumberZero = percentages.includes(requiredValue);

  if (!hasNumberZero) {
    const percentageBoxes = document.querySelectorAll(".percentage");

    percentageBoxes.forEach((box) => {
      const spanError = `
        <span class="error-message">Ao menos um dos níveis deve ser igual a zero</span>
      `;

      box.innerHTML += spanError;
    });
  }
}

function convertPercentageInStringToNumber(number) {
  return parseFloat(number);
}

function validatesTheDescriptionText(text, element) {
  const invalidText = text.length < 30;

  if (invalidText) {
    element.classList.add("input-error");

    const container = element.parentNode;
    const spanError = `
      <span class="error-message">Sua descrição possui apenas ${text.length} caracteres. Necessita ter no mínimo 30 caracteres para ser válida</span>
    `;
    container.innerHTML += spanError;
    return false;
  }
  return true;
}

function postQuizzToTheServer() {
  axios
    .post("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes", quizz)
    .then((res) => {
      const { data, status, statusText } = res;
      console.info(
        `%c${status}, ${statusText} - Quiz criado com sucesso`,
        "color: green; font-weight: bold; font-size: 15px; line-height: 25px;"
      );
      buildsElementsOfTheCreatedQuizzPage(data);
    })
    .catch((err) => {
      console.error(err);
      alert(`Erro ${err.status} - Problema ao criar quiz`);
    });
}

function buildsElementsOfTheCreatedQuizzPage(data) {
  document.querySelector(".create-quizz-page").remove();

  const { id, title, image } = data;
  const container = document.querySelector("main");

  const quizzContent = `
    <div class="create-quizz-page">
      <h3 class="create-quizz-title">Seu quizz está pronto!</h3>
      <div id="${id}" class="quizz">
        <img class="quizz-img" src="${image}" />
        <div class="quizz-overlay" onclick="accessQuizz(${id})"></div>
        <h5 class="quizz-title" onclick="accessQuizz(${id})">${title}</h5>
      </div>
      <div class="buttons">
        <button class="button-user-quizz" onclick="accessQuizz(${id})">Acessar Quizz</button>
        <button class="button-user-quizz-home" onclick="goToHomePage()">Voltar para home</button>
      </div>
    </div>
  `;

  container.innerHTML += quizzContent;
}

function clearErrors() {
  let errorBackground = document.querySelectorAll(".input .input-error");
  let errorElements = document.querySelectorAll(".input .error-message");

  errorBackground.forEach((element) => element.classList.remove("input-error"));
  errorElements.forEach((element) => element.remove());
}

function addKeyDownEvents() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleFormSubmit(event);

    if (event.key === "Tab") clearErrors();
  });
}
