$(document).ready(function () {
    console.log("ready!");

const loginFormHandler = (event) => {

    //NEED TO CHANGE DOCUMENT.LOCATION.REPLACE WITH /USER INFO HERE
    event.preventDefault();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    if (email && password) {
      const response = fetch('/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => {
        if (response.ok) {
          console.log(response)
          document.location.replace('/');
        } else {
          alert('Failed to sign up.');
        }
      });
    }
  };
  document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
})
