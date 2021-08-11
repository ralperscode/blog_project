const email_btn = document.getElementById('email-signup');
const btn_div = document.getElementById('register-btns');
const input_div = document.getElementById('register-inputs');

email_btn.addEventListener('click', function(){
  btn_div.style.display= 'none';
  input_div.style.display= 'block'
});


// register input validation
const email_input = document.getElementById('email-field');
const password1_input = document.getElementById('password1-field');
const password2_input = document.getElementById('password2-field');

email_input.addEventListener('change', function(e){
  if(!email_input.validity.valid){
    if(document.getElementById('email-warning')){
      // nothing to do
    } else{
      var warning = document.createElement("P");
      warning.innerHTML = "Please enter a valid email address."
      warning.classList.add("warning-text");
      warning.id = "email-warning"
      email_input.insertAdjacentElement("afterend", warning);
    }
  } else{
    if(document.getElementById('email-warning')){
      document.getElementById('email-warning').remove();
    }
  }
});
// could make more complete email validation function, but still easy to skirt.
// only real way to validate an email is to send a validation link

function matchPasswords(){
  if(password2_input.value !== password1_input.value){
    var warning = document.createElement("P");
    warning.innerHTML = "Passwords do not match."
    warning.classList.add("warning-text");
    warning.id = "password-warning"
    password2_input.insertAdjacentElement("afterend", warning);
  } else {
    if(document.getElementById('password-warning')){
      document.getElementById('password-warning').remove();
    }
  }
}

password1_input.addEventListener("change", matchPasswords);
password2_input.addEventListener("change", matchPasswords);
