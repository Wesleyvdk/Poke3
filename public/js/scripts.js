// Not Permitted Modal - Project Page
const openNotPermittedModal = document.querySelectorAll("#openNotPermittedModal");
const CloseNotPermittedModal = document.querySelector("#closeNotPermittedModal");
const notPermittedModal = document.querySelector("#notPermittedModal");

notPermittedModal.addEventListener("click", e => {
  const notPermittedModalDimensions = notPermittedModal.getBoundingClientRect()
  if (
    e.clientX < notPermittedModalDimensions.left ||
    e.clientX > notPermittedModalDimensions.right ||
    e.clientY < notPermittedModalDimensions.top ||
    e.clientY > notPermittedModalDimensions.bottom
  ) {
    notPermittedModal.close()
  }
});

//Because id is use multiple times across the project page
openNotPermittedModal.forEach(link => {
  link.addEventListener('click', () => {
    notPermittedModal.showModal();
  });
});

CloseNotPermittedModal.addEventListener('click', () => {
  notPermittedModal.close();
});

