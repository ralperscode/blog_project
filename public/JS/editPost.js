// NOTE -> SOME VARIABLES ARE DECLARED IN THUMBNAILUPLOAD.JS AND ACCESSED HERE

// populate editor with post
var utf8String = document.getElementById('body').value
var delta = JSON.parse(decodeURIComponent(utf8String));
quill.setContents(delta, "user");

// grab necessary DOM elements
const editThumbnailBtn = document.getElementById('editThumbnailBtn');
const publishBtn = document.getElementById('publishBtn');
const editThumbnailForm = document.getElementById('editThumbnailForm');
const thumbnailCancelBtn = document.getElementById('thumbnailCancelBtn');
const pageContents = document.getElementById('editPageContents');

// button event listeners

// displays div for selecting new thumbnail
editThumbnailBtn.addEventListener("click", function(){
  thumbnailDiv.style.display = "block";
  pageContents.classList.add("blur");
  editThumbnailBtn.disabled = true;
  publishBtn.disabled = true;
});

// hides div for selecting new thumbnail and clears any selections that may have been made
thumbnailCancelBtn.addEventListener("click", function(){
  thumbnailDiv.style.display = "none";
  var radios = document.getElementsByName("thumbnailImageRadio");
  for(var i = 0; i< radios.length; i++){
    if(radios[i].checked){
      document.getElementById(radios[i].id).checked = false;
    }
  }
  // fileInput variable declared in thumbnailUpload.js
  if(fileInput.value != ""){
    fileInput.value = ""
  }
  pageContents.classList.remove("blur");
  editThumbnailBtn.disabled = false;
  publishBtn.disabled = false;
});

// prevent form from submitting if nothing has been selected
document.getElementById('thumbnailConfirmBtn').addEventListener("click", function(){
  if ((imgUploadRadio.checked && fileInput.value != "") || defaultImgRadio.checked){
    // click the submit button to trigger form submission. form.submit() cannot be used
    // because it does not trigger the form event listener
    // form.requestSubmit() could be, but isn't supported by safari or IE
    document.getElementById('editThumbnailFormSubmitBtn').click();
    // click the cancel button to remove image upload div
    thumbnailCancelBtn.click();
  } else{
    alert("Please select an option or select cancel to go back.");
    }
});

// AJAX logic for form submission
editThumbnailForm.addEventListener("submit", function(event){
  event.preventDefault();
  // check if an image was uploaded
  if (fileInput.files[0]!= null){
    // read file with FileReader in order to update thumbnail preview to the newly uploaded image
    var file = fileInput.files[0];
      var reader  = new FileReader();
       reader.readAsDataURL(file);

    // append image to new FormData object
    var form_data = new FormData();
    form_data.append(fileInput.name, file);
  } else{
    // no file uploaded -> default img was selected
    var form_data = new FormData();
    form_data.append(fileInput.name,"useDefualt");
  }

    // instantiate new xml http request
    var xhr = new XMLHttpRequest();
    // open request with post method and appropriate route on server
    const currentPostId = document.getElementById('postID').value
    xhr.open("POST", currentPostId +"/thumbnail", true);

    xhr.onload = function(){
          console.log("In onload");
          if(this.status == 200){
              console.log(xhr.response); //not logging -> response doesn't exist???
          }
    }
    // add on error
    xhr.onerror = function() {
    alert("Request failed: Something went wrong! Please try again.");
    console.log("Request error");
    };

    xhr.send(form_data);
    // display text comfirming changes
    if (file){
      document.getElementById('thumbnailSuccess').innerHTML = "Thumbnail successfully changed to " + file.name + ".";
    } else{
      document.getElementById('thumbnailSuccess').innerHTML = "Thumbnail succesfully changed to the default image."
    }
});
