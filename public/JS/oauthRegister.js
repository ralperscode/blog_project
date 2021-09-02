
const img_div = document.getElementById('img-div');
const title_div = document.getElementById('title-div');

//ajax call for saving blog title to new user
const title_form = document.getElementById('title-form');

title_form.addEventListener("submit", function(e){
  e.preventDefault();
  // grab input values
  const user_name = document.getElementById('newUserName').value;
  const title = document.getElementById('title-input').value;
  var params = "username="+user_name+"&title="+title;
  // instantiate new xml http request
  var xhr = new XMLHttpRequest();
  // open request with post method and appropriate route on server
  xhr.open("POST", "/register/userInfo/blogTitle", true);
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

const next_btn = document.getElementById('next-btn');

next_btn.addEventListener("click", function(){
  title_div.style.display = "none";
  img_div.style.display = "block";
})
