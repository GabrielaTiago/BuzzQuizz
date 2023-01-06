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
          <div class="input input-title">
            <input class="form-input" required type="text" placeholder="Título do quizz">
          </div>
          <div class="input input-image">
            <input class="form-input" required type="text"  placeholder="URL da imagem do seu quizz">
          </div>
          <div class="input input-question">
            <input class="form-input" required type="number" placeholder="Quantidade de pergutas do quizz">
          </div>
          <div class="input input-level">
            <input class="form-input" required type="number" placeholder="Quantidade de níveis do quizz">
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
  const values = getInitialFormData();
  validatesInitialFormData(values);
}

function getInitialFormData() {
  const formInputsValues = document.querySelectorAll(".form-input");
  const values = {};
  const objKeys = ["title", "image", "numberOfQuestions", "numberOfLevels"];
  const formAnswers = [];

  formInputsValues.forEach((element) => {
    const { value } = element;
    formAnswers.push(value);
  });

  objKeys.forEach((item, index) => {
    values[item] = formAnswers[index];
  });

  return values;
}

function validatesInitialFormData(values) {
  const { title, image, numberOfQuestions, numberOfLevels } = values;
  const isValidTitle = validatesTheTitle(title);
  const isValidImage = validatesTheImageURL(image);
  const isValidNumberOfQuestions =
    validatesTheNumberOfQuestions(numberOfQuestions);
  const isValidNumberOfLevels = validatesTheNumberOfLevels(numberOfLevels);

  if (
    isValidTitle &&
    isValidImage &&
    isValidNumberOfQuestions &&
    isValidNumberOfLevels
  ) {
    buildsElementsOfTheQuestionsCriationPage(numberOfQuestions);
  }
}

function validatesTheTitle(title) {
  const invalidTitle = title.length < 20 || title.length >= 65;

  if (invalidTitle) {
    document
      .querySelector(".input-title .form-input")
      .classList.add("input-error");

    const container = document.querySelector(".input-title");
    const spanError = `
      <span class="error-message">Seu título tem ${title.length} caracteres. Necessita ter entre 20 e 65 caracteres para ser válido</span>
    `;
    container.innerHTML += spanError;
    return false;
  }
  return true;
}

function validatesTheImageURL(image) {
  const imageURLRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
  const validImage = imageURLRegex.test(image);

  if (!validImage) {
    document
      .querySelector(".input-image .form-input")
      .classList.add("input-error");

    const container = document.querySelector(".input-image");
    const spanError = `
      <span class="error-message">O valor informado não é uma URL válida</span>
    `;
    container.innerHTML += spanError;
    return false;
  }
  return true;
}

function validatesTheNumberOfQuestions(numberOfQuestions) {
  const number = parseInt(numberOfQuestions);
  const invalidNumber = number < 3;

  if (invalidNumber) {
    document
      .querySelector(".input-question .form-input")
      .classList.add("input-error");

    const container = document.querySelector(".input-question");
    const spanError = `
      <span class="error-message">O quizz deve ter no mínimo 3 perguntas</span>
    `;
    container.innerHTML += spanError;
    return false;
  }
  return true;
}

function validatesTheNumberOfLevels(numberOfLevels) {
  const number = parseInt(numberOfLevels);
  const invalidNumber = number < 2;

  if (invalidNumber) {
    document
      .querySelector(".input-level .form-input")
      .classList.add("input-error");

    const container = document.querySelector(".input-level");
    const spanError = `
      <span class="error-message">O quizz deve ter no mínimo 2 níveis</span>
    `;
    container.innerHTML += spanError;
    return false;
  }
  return true;
}

function buildsElementsOfTheQuestionsCriationPage(numberOfQuestions) {
  document.querySelector(".create-quizz-page").remove();

  let container = document.querySelector("main");

  const questionsContent = `
    <div class="create-quizz-page">
      <h3 class="create-quizz-title">Crie suas perguntas</h3>
      <form class="create-quizz-form" name="create-quizz-questions">
        <div class="all-questions"></div>
        <button type="submit" class="form-button">Prosseguir para criar níveis</button>
      </form>
    </div>
  `;

  container.innerHTML += questionsContent;

  buildsQuestions(numberOfQuestions);
}

function buildsQuestions(numberOfQuestions) {
  let allQuestions = document.querySelector(".all-questions");

  for (let i = 1; i <= numberOfQuestions; i++) {
    const questionHTML = `
      <div class="form-box">
        <div class="create-quizz-toggle">
          <h3 class="create-quizz-title">
            Pergunta ${i}
          </h3>
          <i class="fa-solid fa-pen-to-square icon" onclick="editForm(this)"></i>
        </div>
        <div class="create-quizz-data hidden">
          <div class="box-inputs">
            <div class="input question">
              <input class="form-input" required type="text" placeholder="Texto da pergunta"/>
            </div>
            <div class="input color">
              <input class="form-input" required type="text" placeholder="Cor de fundo da pergunta"/>
            </div>
          </div>
        </div>
        <div class="create-quizz-data hidden">
          <h3 class="create-quizz-title" name="create-quizz-questions">
            Resposta correta
          </h3>
          <div class="box-inputs">
            <div class="input correct-answer">
              <input class="form-input" required type="text" placeholder="Resposta correta"/>
            </div>
            <div class="input">
              <input class="form-input" required type="text" placeholder="URL da imagem"/>
            </div>
          </div>
        </div>
        <div class="create-quizz-data hidden">
          <h3 class="create-quizz-title" name="create-quizz-questions">
            Respostas incorretas
          </h3>
          <div class="box-inputs">
            <div class="input">
              <input class="form-input" required type="text" placeholder="Resposta incorreta 1"/>
            </div>
            <div class="input">
              <input class="form-input" required type="text" placeholder="URL da imagem 1"/>
            </div>
          </div>
          <div class="box-inputs">
            <div class="input">
              <input class="form-input" required type="text" placeholder="Resposta incorreta 2"/>
            </div>
            <div class="input">
              <input class="form-input" required type="text" placeholder="URL da imagem 2"/>
            </div>
          </div>
          <div class="box-inputs">
            <div class="input">
              <input class="form-input" required type="text" placeholder="Resposta incorreta 3"/>
            </div>
            <div class="input">
              <input class="form-input" required type="text" placeholder="URL da imagem 3"/>
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
