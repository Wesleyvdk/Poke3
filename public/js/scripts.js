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
notLoggedInModal.addEventListener("click", e => {
  const notLoggedInModalDimensions = notLoggedInModal.getBoundingClientRect()
  if (
    e.clientX < notLoggedInModalDimensions.left ||
    e.clientX > notLoggedInModalDimensions.right ||
    e.clientY < notLoggedInModalDimensions.top ||
    e.clientY > notLoggedInModalDimensions.bottom
  ) {
    notLoggedInModal.close()
  }
});

//Because id is used multiple times across the project page
openNotLoggedInModal.addEventListener("click", () => {
  if(!notLoggedIn){
    notLoggedInModal.showModal();
  } else {
    //If logged in go to Game
    window.location.href = "./login.html"
  }
  
});

closeNotLoggedInModal.addEventListener("click", () => {
  notLoggedInModal.close();
});
