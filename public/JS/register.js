const email_btn = document.getElementById('email-signup');
const btn_div = document.getElementById('register-btns');
const input_div = document.getElementById('register-inputs');
const img_div = document.getElementById('img-div');

email_btn.addEventListener('click', function(){
  btn_div.style.display= 'none';
  input_div.style.display= 'block'
});

// continue and back buttons
const continue_btn = document.getElementById('continue-btn');
const back_btn = document.getElementById('back-btn');

// register input fields
const username_input = document.getElementById('username-field')
const email_input = document.getElementById('email-field');
const password1_input = document.getElementById('password1-field');
const password2_input = document.getElementById('password2-field');

// email and password validation
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

// validate username with ajax post call -> app.js route uses res.send() to send
// message of taken or not_taken. Use this to display p element message to user and
// lock form submission until fixed
// username availability check
username_input.addEventListener("change", function(){
  const name = username_input.value;
  var params = "username=" + name;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/register/userInfo/nameCheck", true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onload = function(){
        console.log("In onload");
        if (this.status == 200){
            console.log(xhr.responseText);
            if(this.responseText === "taken"){
              var warning = document.createElement("P");
              warning.innerHTML = "Username not available."
              warning.classList.add("warning-text");
              warning.id = "username-warning"
              username_input.insertAdjacentElement("afterend", warning);
              continue_btn.setAttribute('disabled', true);
            } else {
              if(document.getElementById('username-warning')){
                document.getElementById('username-warning').remove();
                continue_btn.removeAttribute('disabled');
              }
            }
        }
  }
  // add onerror
  xhr.onerror = function() {
  alert("Request failed: Something went wrong! Please try again.");
  console.log("Request error");
  };

  xhr.send(params);
})

// uploading email form to create account
const signup_form = document.getElementById('signup-form');
signup_form.addEventListener("submit", function(e){
  e.preventDefault();
  // grab input values
  const user_name = username_input.value;
  const email = email_input.value;
  const password = password1_input.value;
  var params = "username="+user_name+"&email="+email+"&password="+password;
  // instantiate new xml http request
  var xhr = new XMLHttpRequest();
  // open request with post method and appropriate route on server
  xhr.open("POST", "/register/userInfo", true);
  // set content type of request
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onload = function(){
        console.log("In onload");
        if (this.status == 200){
            console.log(xhr.responseText); //never logging -> response doesn't exist???
        }
  }
  // add onerror
  xhr.onerror = function() {
  alert("Request failed: Something went wrong! Please try again.");
  console.log("Request error");
  };

  xhr.send(params);
});

// onclick functions for continue and all sign up option buttons
back_btn.addEventListener("click", function(){
    btn_div.style.display= 'block';
    input_div.style.display= 'none'
});

continue_btn.addEventListener("click", function(){
  input_div.style.display= 'none'
  img_div.style.display = "block"
  document.getElementById('newUserName').value = username_input.value;
});


// ajax call for uploading images
const img_form = document.getElementById('img-form');
const thumbnailInput = document.getElementById('defaultThumbnail');
const bannerInput = document.getElementById('banner');

// img_form.addEventListener("submit", function(e){
//   e.preventDefault();
//
//   const thumbnailImg = thumbnailInput.files[0];
//   const bannerImg = bannerInput.files[0];
//   var form_data = new FormData();
//   form_data.append(thumbnailInput.name, thumbnailImg);
//   form_data.append(bannerInput.name, bannerImg);
//   var xhr = new XMLHttpRequest();
//   xhr.open("POST", "/register/userInfo/" + username_input.value + "/img", true);
//
//   xhr.onload = function(){
//         console.log("In onload");
//         if(this.status == 200){
//             console.log(xhr.response);
//         }
//   }
//   // add onerror
//   xhr.onerror = function() {
//   alert("Request failed: Something went wrong! Please try again.");
//   console.log("Request error");
//   };
//
//   xhr.send(form_data);
// });
