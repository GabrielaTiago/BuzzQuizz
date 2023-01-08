function accessQuizz(id) {
  document.querySelector("main").remove();
  getQuizzData(id);
}

function getQuizzData(id) {
  axios
    .get(`${BASE_API_URL}/${id}`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
      alert(`Erro ${err.status} - Problema ao carregar quizzes`);
      window.location.reload();
    });
}
