const form = document.getElementById("quizForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const guess = document.getElementById("input").value;
  const correctAnswer = "ditto";
  const next = document.getElementById("next");

  if (guess === correctAnswer) {
    pokemon.style.filter = "none";
    // Show the notification
    var notification = document.getElementById("notification");
    notification.classList.remove("hidden", "opacity-0");
    notification.style.animation = "slideUp 0.5s forwards";
    form.classList.add("hidden");
    next.classList.remove("hidden");

    // Hide the notification after 5 seconds
    setTimeout(function () {
      notification.style.animation = "";
      notification.classList.add("opacity-0");
      notification.classList.add("hidden");
    }, 5000);
  } else {
    alert("Wrong! Try again.");
  }
});

next.addEventListener("click", function () {
  window.location.href = "quiz.html";
});
