document.addEventListener("DOMContentLoaded", () => {
  const pokeball = document.getElementById("pokeball");
  const modal = document.getElementById("modal");
  const redhalf = document.getElementById("redhalf");
  const svgContainer = document.getElementById("svg-container");

  pokeball.addEventListener("click", function () {
    if (redhalf.classList.contains("bg-green-500")) {
      modal.innerHTML = `
        <article class="bg-white p-4 rounded-lg shadow-lg text-center">
          <p>Je hebt deze Pokemon al gevangen. Wil je deze vrijlaten?</p>
          <button id="yesRelease" class="bg-red-500 text-white py-2 px-4 rounded-lg m-2">Ja</button>
          <button id="noRelease" class="bg-blue-500 text-white py-2 px-4 rounded-lg m-2">Nee</button>
        </article>
      `;
      modal.classList.remove("hidden");
      document
        .getElementById("yesRelease")
        .addEventListener("click", function () {
          redhalf.classList.remove("bg-green-500");
          redhalf.classList.add("bg-red-600");
          modal.classList.add("hidden");
        });

      document
        .getElementById("noRelease")
        .addEventListener("click", function () {
          modal.classList.add("hidden");
        });
    } else {
      modal.innerHTML = `
      <article class="bg-white p-4 rounded-lg shadow-lg text-center">
        <p>Je hebt de Pokemon gevangen! Wil je deze een naam geven?</p>
        <button id="giveName" class="bg-green-500 text-white py-2 px-4 rounded-lg m-2">Ja</button>
        <button id="defaultName" class="bg-blue-500 text-white py-2 px-4 rounded-lg m-2">Nee</button>
      </article>`;
      modal.classList.remove("hidden");
      document
        .getElementById("giveName")
        .addEventListener("click", function () {
          modal.innerHTML = `
          <form
          id="nameForm"
          action="#"
          method="post"
          class="bg-white p-4 rounded-lg shadow-lg text-center"
        >
          <label for="name">Vul een naam in</label><br />
          <input
            type="text"
            name="name"
            id="input"
            placeholder="Ditto"
            class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            type="submit"
            value="Accept"
            class="bg-green-500 text-white py-2 px-4 rounded-lg m-2"
          />
        </form>`;
        });
      const form = document.getElementById("nameForm");

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        modal.innerHTML = `
          <article class="bg-white p-4 rounded-lg shadow-lg text-center">
            <p>Je hebt de Pokemon gevangen!</p>
            <button id="showPokemon" class="bg-green-500 text-white py-2 px-4 rounded-lg m-2">Bekijk Pokemon</button>
            <button id="catchAnother" class="bg-blue-500 text-white py-2 px-4 rounded-lg m-2">Vang een nieuwe Pokemon</button>
          </article>
        `;
      });
      document
        .getElementById("defaultName")
        .addEventListener("click", function () {
          modal.innerHTML = `
          <article class="bg-white p-4 rounded-lg shadow-lg text-center">
            <p>Je hebt de Pokemon gevangen!</p>
            <button id="showPokemon" class="bg-green-500 text-white py-2 px-4 rounded-lg m-2">Bekijk Pokemon</button>
            <button id="catchAnother" class="bg-blue-500 text-white py-2 px-4 rounded-lg m-2">Vang een nieuwe Pokemon</button>
          </article>
        `;
        });

      document
        .getElementById("showPokemon")
        .addEventListener("click", function () {
          modal.classList.add("hidden");
        });
      document
        .getElementById("catchAnother")
        .addEventListener("click", function () {
          window.location.href = "capture.html";
        });
    }

    redhalf.classList.remove("bg-red-600");
    redhalf.classList.add("bg-green-500");
    svgContainer.innerHTML = `
      <rect width="24" height="24"/>
      <path d="M5 13.3636L8.03559 16.3204C8.42388 16.6986 9.04279 16.6986 9.43108 16.3204L19 7" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"/>
  `;
  });
});
