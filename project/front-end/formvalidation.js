const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const signupError = document.getElementById('signup-error');
const lnameError = document.getElementById('lname-error');
const lemailError = document.getElementById('lemail-error');
const lpasswordError = document.getElementById('lpassword-error');
const loginError = document.getElementById('login-error');
const formError = document.getElementById('form-error');
const formError1 = document.getElementById('form-error1');

function nameValidate() {
    const name = document.getElementById('form-name').value;
    if (name.length === 0) {
        nameError.textContent = "Name is required";
        nameError.style.color = 'white';
        return false;
    }
    if (!name.match(/^[a-zA-Z]+\s[a-zA-Z]+$/)) {
        nameError.textContent = "Name is invalid";
        nameError.style.color = 'red';
        return false;
    }
    nameError.textContent = "Success";
    nameError.style.color = 'orange';
    return true;
}

function emailValidate() {
    const email = document.getElementById('form-email').value;
    if (email.length === 0) {
        emailError.textContent = "Email is required";
        emailError.style.color = 'white';
        return false;
    }
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/)) {
        emailError.textContent = "Email is invalid";
        emailError.style.color = 'red';
        return false;
    }
    emailError.textContent = "Success";
    emailError.style.color = 'orange';
    return true;
}

function passwordValidate() {
    const password = document.getElementById('form-pass').value;
    if (password.length === 0) {
        passwordError.textContent = "Password is required";
        passwordError.style.color = 'white';
        return false;
    }
    if (!password.match(/^[a-zA-Z0-9.]{6,}$/)) {
        passwordError.textContent = "Password is invalid";
        passwordError.style.color = 'red';
        return false;
    }
    passwordError.textContent = "Success";
    passwordError.style.color = 'orange';
    return true;
}

formError.addEventListener("submit", async function (event) {
  event.preventDefault();

  const isNameValid = nameValidate();
  const isEmailValid = emailValidate();
  const isPasswordValid = passwordValidate();

  if (isNameValid && isEmailValid && isPasswordValid) {
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const password = document.getElementById('form-pass').value;
    const role = document.querySelector('select').value;

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      if (res.ok) {
        signupError.textContent = data.message;
        signupError.style.color = 'lime';
        alert('Signup successful!');
      } else {
        signupError.textContent = data.message || 'Signup failed';
        signupError.style.color = 'red';
      }
    } catch (err) {
      signupError.textContent = 'Server error';
      signupError.style.color = 'red';
    }
  } else {
    signupError.textContent = "SignUp is invalid!";
    signupError.style.color = 'red';
    alert(signupError.textContent);
  }
});




function lemailValidate() {
    const lemail = document.getElementById('login-email').value;
    if (lemail.length === 0) {
        lemailError.textContent = "Email is required";
        lemailError.style.color = 'white';
        return false;
    }
    if (!lemail.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/)) {
        lemailError.textContent = "Email is invalid";
        lemailError.style.color = 'red';
        return false;
    }
    lemailError.textContent = "Success";
    lemailError.style.color = 'orange';
    return true;
}

function lpasswordValidate() {
    const lpassword = document.getElementById('login-pass').value;
    if (lpassword.length === 0) {
        lpasswordError.textContent = "Password is required";
        lpasswordError.style.color = 'white';
        return false;
    }
    if (!lpassword.match(/^[a-zA-Z0-9.]{6,}$/)) {
        lpasswordError.textContent = "Password is invalid";
        lpasswordError.style.color = 'red';
        return false;
    }
    lpasswordError.textContent = "Success";
    lpasswordError.style.color = 'orange';
    return true;
}

formError1.addEventListener("submit", async function (event) {
  event.preventDefault();

  
  const isEmailValid = lemailValidate();
  const isPasswordValid = lpasswordValidate();

  if (isEmailValid && isPasswordValid) {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        loginError.textContent = "Login successful!";
        loginError.style.color = 'lime';
        localStorage.setItem("token", data.token);
        alert(`Welcome, ${data.user.name}`);
        
      } else {
        loginError.textContent = data.message || "Login failed";
        loginError.style.color = 'red';
      }
    } catch (err) {
      loginError.textContent = "Server error";
      loginError.style.color = 'red';
    }
  } else {
    loginError.textContent = "Login credentials are invalid!";
    loginError.style.color = 'red';
    alert(loginError.textContent);
  }
});
