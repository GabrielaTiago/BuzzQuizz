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
  const { title, image } = data;

  buildsQuizzContainerElement();
  buildsQuizzBannerElement(title, image);
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
