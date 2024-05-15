const loginForm = document.getElementById("login");
const testEmail = "test@gmail.com";
const testPassword = "test123";

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email format check
  if (!emailRegex.test(email)) {
    alert("Invalid email format. Please enter a valid email address.");
    return;
  }

  if (email === testEmail && password === testPassword) {
    window.location.href = "./index";
    localStorage.setItem("isLoggedIn", true);
    email.value = "";
    password.value = "";
  } else {
    alert("Incorrect email or password. Please try again.");
  }
});
