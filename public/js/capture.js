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
      window.location.href = "capture";
    });
  });
});
