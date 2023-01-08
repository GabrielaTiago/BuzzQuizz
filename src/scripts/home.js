const BASE_API_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";

getsAllQuizzes();

function goToHomePage() {
  window.location.reload();
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

  allQuizzes.forEach((quiz) => {
    const { id, title, image } = quiz;

    quizzesContainer.innerHTML += `
      <div class="quizz">
        <img class="quizz-img" src="${image}" />
        <div class="quizz-overlay"></div>
        <h5 class="quizz-title">${title}</h5>
      </div>
    `;
  });
}
