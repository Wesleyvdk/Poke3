function closeModal() {
  const modal = document.getElementById("notPermitedModal");  
  modal.classList.add("hidden");
}

function openModal() {
  const modal = document.getElementById("notPermitedModal");
  modal.classList.remove("hidden");
}

window.onclick = function(event) {
  const modal = document.getElementById("notPermitedModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 
