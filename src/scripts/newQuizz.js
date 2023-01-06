function openNewQuizzPage() {
  let homePageElements = document.querySelectorAll(".home-page");

  homePageElements.forEach((element) => element.remove());

  buildsElementsOfTheQuizCreationPage();
}

function buildsElementsOfTheQuizCreationPage() {
  let main = document.querySelector("main");

  const formContent = `
    <div class="create-quizz-page">
      <h3 class="create-quizz-title">Crie suas perguntas</h3>
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
