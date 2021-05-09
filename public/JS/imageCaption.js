// get caption creation div elements
captionDiv = document.getElementById('captionDiv');
cancelBTN = document.getElementById('cancelCaption');
addBTN = document.getElementById('addCaption');
imgSelectorP = document.getElementById('imgSelectorP');
captionTextInput = document.getElementById('captionText');

cancelBTN.addEventListener("click", function(){
  // vars from buttonFunctionality.js
  form.classList.remove("blur");
  composeHeader.classList.remove("blur");
  captionDiv.style.display ="none"
});

addBTN.addEventListener("click", function(){
  // get caption and dom node of image to caption
  let caption = captionTextInput.value
  let checkedRadio = document.querySelector('input[type="radio"]:checked');
  let imgToCaption = document.getElementById(checkedRadio.value);
  // create p element for holding the caption
  let captionP = document.createElement("p");
  captionP.classList.add("ql-caption-p");
  captionP.innerText = caption;
  // make inner caption div to hold image and caption and allow for formatting
  let innerCaptionDiv = document.createElement('div');
  innerCaptionDiv.classList.add("ql-caption-inner-div")
  innerCaptionDiv.appendChild(imgToCaption);
  innerCaptionDiv.appendChild(captionP);

  // get the blot of the image that is being captioned
  const blot = Quill.find(imgToCaption);
  // find it's index
  const index = blot.offset(quill.scroll);
  // total blot length
  const length = quill.getLength();
  // get current contents of quill
  const contents = quill.getContents();
  // slice contents from beginning up until image (returns delta)
  const startOps = contents.slice(0, index);
  // slice contents from image to end
  if(length > index){
    console.log("setting endOps");
    var endOps = contents.slice(index + 1, length);
  }
  // set new delta contents - image to caption is now removed
  if(endOps){
    var newOps = startOps.concat(endOps);
  } else{
    var newOps = startOps
  }
  quill.setContents(newOps);
  // insert the new caption div containing the image and it's caption at the appropriate index
  quill.insertEmbed(index, 'caption', innerCaptionDiv.outerHTML, Quill.sources.USER);
  // close the caption div and re-focus page
  form.classList.remove("blur");
  composeHeader.classList.remove("blur");
  captionDiv.style.display ="none"
  // reset caption div by removing all inputs and labels
  children = captionDiv.childNodes;
  for (var i = children.length - 1; i >= 0; i--) {
    if(children[i].name === "selectImage" || (children[i].tagName === "LABEL" && children[i].id === "")){
      captionDiv.removeChild(children[i]);
    }
  }
  captionTextInput.value = ""
});
