// grab all buttons
const nameEditBtn = document.getElementById('name-edit-btn');
const nameCancelBtn = document.getElementById('name-cancel-btn');
const nameSaveBtn = document.getElementById('name-save-btn');

const emailEditBtn = document.getElementById('email-edit-btn');
const emailCancelBtn = document.getElementById('email-cancel-btn');
const emailSaveBtn = document.getElementById('email-save-btn');

const passwordEditBtn = document.getElementById('password-edit-btn');
const passwordCancelBtn = document.getElementById('password-cancel-btn');
const passwordSaveBtn = document.getElementById('password-save-btn');

const fbEditBtn = document.getElementById('fb-edit-btn');
const fbCancelBtn = document.getElementById('fb-cancel-btn');
const fbSaveBtn = document.getElementById('fb-save-btn');

const twitterEditBtn = document.getElementById('twitter-edit-btn');
const twitterCancelBtn = document.getElementById('twitter-cancel-btn');
const twitterSaveBtn = document.getElementById('twitter-save-btn');

const instaEditBtn = document.getElementById('insta-edit-btn');
const instaCancelBtn = document.getElementById('insta-cancel-btn');
const instaSaveBtn = document.getElementById('insta-save-btn');

const githubEditBtn = document.getElementById('github-edit-btn');
const githubCancelBtn = document.getElementById('github-cancel-btn');
const githubSaveBtn = document.getElementById('github-save-btn');

const titleEditBtn = document.getElementById('title-edit-btn');
const titleCancelBtn = document.getElementById('title-cancel-btn');
const titleSaveBtn = document.getElementById('title-save-btn');

const thumbnailEditBtn = document.getElementById('thumbnail-edit-btn');
const thumbnailCancelBtn = document.getElementById('thumbnail-cancel-btn');
const thumbnailSaveBtn = document.getElementById('thumbnail-save-btn');

const bannerEditBtn = document.getElementById('banner-edit-btn');
const bannerCancelBtn = document.getElementById('banner-cancel-btn');
const bannerSaveBtn = document.getElementById('banner-save-btn');

const featuredPostEditBtn = document.getElementById('featuredPost-edit-btn');
const featuredPostCancelBtn = document.getElementById('featuredPost-cancel-btn');
const featuredPostSaveBtn = document.getElementById('featuredPost-save-btn');

// grab all inputs
const name = document.getElementById('name-input');
const email = document.getElementById('email-input');
const password = document.getElementById('password-input');
const fb = document.getElementById('fb-input');
const twitter = document.getElementById('twitter-input');
const insta = document.getElementById('insta-input');
const github = document.getElementById('github-input');
const title = document.getElementById('title-input');
const thumbnail = document.getElementById('thumbnail-input');
const banner = document.getElementById('banner-input')
const featuredPost = document.getElementById('featuredPost-select');

// grab images
const thumbnailPreview = document.getElementById('thumbnail-preview');
const bannerPreview = document.getElementById('banner-preview');

// button click event listeners functions

function editBtnEventListener(input, editBtn, cancelBtn, saveBtn){
  input.removeAttribute("readonly");
  input.focus();
  if (input.type === "email"){
    input.type = "text"
    input.setSelectionRange(input.value.length, input.value.length);
    input.type = "email"
  }else{
    input.setSelectionRange(input.value.length, input.value.length);
  }
  editBtn.setAttribute("hidden", true);
  cancelBtn.removeAttribute("hidden");
  saveBtn.removeAttribute("hidden");
  input.style.width = "150px"
}

function cancelBtnEventListener(input, editBtn, cancelBtn, saveBtn){
  input.setAttribute("readonly", true);
  cancelBtn.setAttribute("hidden", true);
  saveBtn.setAttribute("hidden", true);
  editBtn.removeAttribute("hidden");
  input.style.width = "216.8px"
}

function saveBtnEventListener(input, editBtn, cancelBtn, saveBtn){
  //todo
}

function editImgEventListener(input, editBtn, cancelBtn, saveBtn, img){
  input.style.display = "block"
  editBtn.setAttribute("hidden", true);
  cancelBtn.parentElement.style.display = "block"
  cancelBtn.removeAttribute("hidden");
  saveBtn.removeAttribute("hidden");
  img.style.display = "none"
}

function cancelImgEventListener(input, editBtn, cancelBtn, saveBtn, img){
  input.style.display = "none"
  cancelBtn.parentElement.style.display = "none"
  cancelBtn.setAttribute("hidden", true);
  saveBtn.setAttribute("hidden", true);
  editBtn.removeAttribute("hidden");
  img.style.display = "block"
}

function editFeaturedEventListener(input, editBtn, cancelBtn, saveBtn){
  input.removeAttribute("disabled");
  input.focus();
  editBtn.setAttribute("hidden", true);
  cancelBtn.removeAttribute("hidden");
  saveBtn.removeAttribute("hidden");
}

function cancelFeaturedEventListener(input, editBtn, cancelBtn, saveBtn){
  input.setAttribute("disabled", true);
  cancelBtn.setAttribute("hidden", true);
  saveBtn.setAttribute("hidden", true);
  editBtn.removeAttribute("hidden");
}

// add ability for inputs to revert back to OG content if cancel is hit after changes were made

// event listeners

nameEditBtn.addEventListener("click", editBtnEventListener.bind(null, name, nameEditBtn, nameCancelBtn, nameSaveBtn), false);
nameCancelBtn.addEventListener("click", cancelBtnEventListener.bind(null, name, nameEditBtn, nameCancelBtn, nameSaveBtn), false);
nameSaveBtn.addEventListener("click", saveBtnEventListener.bind(null, name, nameEditBtn, nameCancelBtn, nameSaveBtn), false);

emailEditBtn.addEventListener("click", editBtnEventListener.bind(null, email, emailEditBtn, emailCancelBtn, emailSaveBtn), false);
emailCancelBtn.addEventListener("click", cancelBtnEventListener.bind(null, email, emailEditBtn, emailCancelBtn, emailSaveBtn), false);
emailSaveBtn.addEventListener("click", saveBtnEventListener.bind(null, email, emailEditBtn, emailCancelBtn, emailSaveBtn), false);

passwordEditBtn.addEventListener("click", editBtnEventListener.bind(null, password, passwordEditBtn, passwordCancelBtn, passwordSaveBtn), false);
passwordCancelBtn.addEventListener("click", cancelBtnEventListener.bind(null, password, passwordEditBtn, passwordCancelBtn, passwordSaveBtn), false);
passwordSaveBtn.addEventListener("click", saveBtnEventListener.bind(null, password, passwordEditBtn, passwordCancelBtn, passwordSaveBtn), false);

fbEditBtn.addEventListener("click", editBtnEventListener.bind(null, fb, fbEditBtn, fbCancelBtn, fbSaveBtn), false);
fbCancelBtn.addEventListener("click", cancelBtnEventListener.bind(null, fb, fbEditBtn, fbCancelBtn, fbSaveBtn), false);
fbSaveBtn.addEventListener("click", saveBtnEventListener.bind(null, fb, fbEditBtn, fbCancelBtn, fbSaveBtn), false);

twitterEditBtn.addEventListener("click", editBtnEventListener.bind(null, twitter, twitterEditBtn, twitterCancelBtn, twitterSaveBtn), false);
twitterCancelBtn.addEventListener("click", cancelBtnEventListener.bind(null, twitter, twitterEditBtn, twitterCancelBtn, twitterSaveBtn), false);
twitterSaveBtn.addEventListener("click", saveBtnEventListener.bind(null, twitter, twitterEditBtn, twitterCancelBtn, twitterSaveBtn), false);

instaEditBtn.addEventListener("click", editBtnEventListener.bind(null, insta, instaEditBtn, instaCancelBtn, instaSaveBtn), false);
instaCancelBtn.addEventListener("click", cancelBtnEventListener.bind(null, insta, instaEditBtn, instaCancelBtn, instaSaveBtn), false);
instaSaveBtn.addEventListener("click", saveBtnEventListener.bind(null, insta, instaEditBtn, instaCancelBtn, instaSaveBtn), false);

githubEditBtn.addEventListener("click", editBtnEventListener.bind(null, github, githubEditBtn, githubCancelBtn, githubSaveBtn), false);
githubCancelBtn.addEventListener("click", cancelBtnEventListener.bind(null, github, githubEditBtn, githubCancelBtn, githubSaveBtn), false);
githubSaveBtn.addEventListener("click", saveBtnEventListener.bind(null, github, githubEditBtn, githubCancelBtn, githubSaveBtn), false);

titleEditBtn.addEventListener("click", editBtnEventListener.bind(null, title, titleEditBtn, titleCancelBtn, titleSaveBtn), false);
titleCancelBtn.addEventListener("click", cancelBtnEventListener.bind(null, title, titleEditBtn, titleCancelBtn, titleSaveBtn), false);
titleSaveBtn.addEventListener("click", saveBtnEventListener.bind(null, title, titleEditBtn, titleCancelBtn, titleSaveBtn), false);

thumbnailEditBtn.addEventListener("click", editImgEventListener.bind(null, thumbnail, thumbnailEditBtn, thumbnailCancelBtn, thumbnailSaveBtn, thumbnailPreview), false);
thumbnailCancelBtn.addEventListener("click", cancelImgEventListener.bind(null, thumbnail, thumbnailEditBtn, thumbnailCancelBtn, thumbnailSaveBtn, thumbnailPreview), false);
//save todo

bannerEditBtn.addEventListener("click", editImgEventListener.bind(null, banner, bannerEditBtn, bannerCancelBtn, bannerSaveBtn, bannerPreview), false);
bannerCancelBtn.addEventListener("click", cancelImgEventListener.bind(null, banner, bannerEditBtn, bannerCancelBtn, bannerSaveBtn, bannerPreview), false);
//save todo

featuredPostEditBtn.addEventListener("click", editFeaturedEventListener.bind(null, featuredPost, featuredPostEditBtn, featuredPostCancelBtn, featuredPostSaveBtn), false);
featuredPostCancelBtn.addEventListener("click", cancelFeaturedEventListener.bind(null, featuredPost, featuredPostEditBtn, featuredPostCancelBtn, featuredPostSaveBtn), false);
