document.addEventListener("DOMContentLoaded", () => {
  const pokeball = document.getElementById("pokeball");
  const redhalf = document.getElementById("redhalf");
  const svgContainer = document.getElementById("svg-container");
  const caughtPokemon = document.getElementById("caughtPokemon");
  const giveName = document.getElementById("giveName");
  const giveNickname = document.getElementById("giveNickname");
  const defaultName = document.getElementById("defaultName");
  const nextModal = document.getElementById("nextModal");
  const showPokemon = document.getElementById("showPokemon");
  const catchAnother = document.getElementById("catchAnother");
  const alreadyCaptured = document.getElementById("alreadyCaptured");
  const noRelease = document.getElementById("noRelease");
  const yesRelease = document.getElementById("yesRelease");

  pokeball.addEventListener("click", () => {
    if (redhalf.classList.contains("bg-red-600")) {
      caughtPokemon.showModal();
      giveName.addEventListener("click", () => {
        caughtPokemon.close();
        giveNickname.showModal();
      });
      defaultName.addEventListener("click", () => {
        caughtPokemon.close();
        nextModal.showModal();
        showPokemon.addEventListener("click", () => {
          nextModal.close();
        });
        catchAnother.addEventListener("click", () => {
          window.location.href = "capture.html";
        });
      });
      redhalf.classList.remove("bg-red-600");
      redhalf.classList.add("bg-green-500");
      svgContainer.innerHTML = `
          <rect width="24" height="24"/>
          <path d="M5 13.3636L8.03559 16.3204C8.42388 16.6986 9.04279 16.6986 9.43108 16.3204L19 7" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    } else {
      alreadyCaptured.showModal();
      noRelease.addEventListener("click", () => {
        alreadyCaptured.close();
      });
      yesRelease.addEventListener("click", () => {
        redhalf.classList.remove("bg-green-500");
        redhalf.classList.add("bg-red-600");
        svgContainer.innerHTML = `            
        <rect width="24" height="24" />
        <path
          d="M7 17L16.8995 7.10051"
          stroke="#000000"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M7 7.00001L16.8995 16.8995"
          stroke="#000000"
          stroke-linecap="round"
          stroke-linejoin="round"
        />`;
        alreadyCaptured.close();
      });
    }
  });

  document.getElementById("nameForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("input").value;

    console.log("Submitted name:", name);

    giveNickname.close();
    nextModal.showModal();
    showPokemon.addEventListener("click", () => {
      nextModal.close();
    });
    catchAnother.addEventListener("click", () => {
      window.location.href = "capture.html";
    });
  });
});
