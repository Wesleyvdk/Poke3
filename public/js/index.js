// Not Permitted Modal - Project Page
const openNotPermittedModal = document.querySelectorAll(
  "#openNotPermittedModal"
);
const CloseNotPermittedModal = document.querySelector(
  "#closeNotPermittedModal"
);
const notPermittedModal = document.querySelector("#notPermittedModal");

notPermittedModal.addEventListener("click", (e) => {
  const notPermittedModalDimensions = notPermittedModal.getBoundingClientRect();
  if (
    e.clientX < notPermittedModalDimensions.left ||
    e.clientX > notPermittedModalDimensions.right ||
    e.clientY < notPermittedModalDimensions.top ||
    e.clientY > notPermittedModalDimensions.bottom
  ) {
    notPermittedModal.close();
  }
});

//Because id is used multiple times across the project page
openNotPermittedModal.forEach((link) => {
  link.addEventListener("click", () => {
    notPermittedModal.showModal();
  });
});

CloseNotPermittedModal.addEventListener("click", () => {
  notPermittedModal.close();
});

// Not Logged In Modal - Project Page
const openNotLoggedInModal = document.querySelector("#openNotLoggedInModal");
const closeNotLoggedInModal = document.querySelector("#closeNotLoggedInModal");
const notLoggedInModal = document.querySelector("#notLoggedInModal");
let notLoggedIn = false;

// notLoggedInModal.showModal();
notLoggedInModal.addEventListener("click", (e) => {
  const notLoggedInModalDimensions = notLoggedInModal.getBoundingClientRect();
  if (
    e.clientX < notLoggedInModalDimensions.left ||
    e.clientX > notLoggedInModalDimensions.right ||
    e.clientY < notLoggedInModalDimensions.top ||
    e.clientY > notLoggedInModalDimensions.bottom
  ) {
    notLoggedInModal.close();
  }
});

//Because id is used multiple times across the project page
openNotLoggedInModal.addEventListener("click", () => {
  if (
    localStorage.getItem("isLoggedIn") == "false" ||
    localStorage.getItem("isLoggedIn") == null
  ) {
    notLoggedInModal.showModal();
  } else {
    //If logged in go to Game
    window.location.href = "./starter.html";
  }
});

closeNotLoggedInModal.addEventListener("click", () => {
  notLoggedInModal.close();
});

// Dropdown hamburger menu

const dropdownHamburger = document.querySelector("#hamburgerIcon");
const dropdownMenu = document.querySelector("#hamburgerMenu");

dropdownMenu.addEventListener("click", (e) => {
  const clickedElement = e.target;
  const dropdownMenuWidth = dropdownMenu.offsetWidth;
  const dropdownMenuHeight = dropdownMenu.offsetHeight;

  if (
    !dropdownMenu.contains(clickedElement) ||
    e.clientX < dropdownMenu.offsetLeft ||
    e.clientX > dropdownMenu.offsetLeft + dropdownMenuWidth ||
    e.clientY < dropdownMenu.offsetTop ||
    e.clientY > dropdownMenu.offsetTop + dropdownMenuHeight
  ) {
    dropdownMenu.classList.add("hidden");
  }
});

dropdownHamburger.addEventListener("click", () => {
  if (dropdownMenu.classList.contains("hidden")) {
    dropdownMenu.classList.remove("hidden");
  } else {
    dropdownMenu.classList.add("hidden");
  }
});

// If logged in -> log in and register hidden and profile avatar visible

const navbar = document.querySelector("#navbar");

if (localStorage.getItem("isLoggedIn") == "true") {
  navbar.classList.add("hidden");
} else {
  navbar.classList.remove("hidden");
}

//Profile icon

const profileIcon = document.querySelector("#profileIcon");

if (localStorage.getItem("isLoggedIn") == "true") {
  profileIcon.classList.remove("hidden");
} else {
  profileIcon.classList.add("hidden");
}

// Dropdown Profile menu

const dropdownProfileBtn = document.querySelector(".relative button");
const dropdownProfileMenu = document.querySelector(".relative div");

dropdownProfileBtn.addEventListener("click", function () {
  dropdownProfileMenu.classList.toggle("hidden");
});

dropdownProfileBtn.addEventListener("click", (e) => {
  const dropdownProfileBtnDimensions =
    dropdownProfileBtn.getBoundingClientRect();
  if (
    e.clientX < dropdownProfileBtnDimensions.left ||
    e.clientX > dropdownProfileBtnDimensions.right ||
    e.clientY < dropdownProfileBtnDimensions.top ||
    e.clientY > dropdownProfileBtnDimensions.bottom
  ) {
    dropdownProfileBtn.classList.remove("hidden");
  }
});

dropdownProfileMenu.addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "./index.html";
});
