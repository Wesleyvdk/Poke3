const list1 = document.getElementById("pokemonList1");
const list2 = document.getElementById("pokemonList2");

document.getElementById("switch1").addEventListener("click", function () {
  if (list1.classList.contains("hidden")) {
    list1.classList.remove("hidden");
  } else {
    list1.classList.add("hidden");
  }
});

document.getElementById("switch2").addEventListener("click", function () {
  if (list2.classList.contains("hidden")) {
    list2.classList.remove("hidden");
  } else {
    list2.classList.add("hidden");
  }
});

document
  .getElementById("pokemonItems1")
  .addEventListener("click", function (e) {
    if (e.target.tagName.toLowerCase() === "a") {
      list1.classList.add("hidden"); // Hide the list
    }
  });
document
  .getElementById("pokemonItems2")
  .addEventListener("click", function (e) {
    if (e.target.tagName.toLowerCase() === "a") {
      list2.classList.add("hidden"); // Hide the list
    }
  });
