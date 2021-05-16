// custom toolbar button functionality

// captions
const form = document.querySelector("form");
const composeHeader = document.querySelector(".compose-page-contents h1");
document.querySelector('.ql-caption').addEventListener("click", function() {
  // blur rest of page when button is clicked
  form.classList.add("blur");
  composeHeader.classList.add("blur");
  // find all images in document and add an id to it
  imgList = document.querySelectorAll('img');
  imgList.forEach(function(img, idx){
    // only add the id if it is a new image
    if(img.id === ""){
      img.id = "image" + (idx + 1);
      // insert radio button and label for the new image so it can be selected for captioning
      imgSelectorP.insertAdjacentHTML('afterend',
      '<input type="radio" name="selectImage" id="for'+img.id+'" value="'+img.id+'">'
      +'<label for="for'+img.id+'">' + img.outerHTML + '</label> <br>');
    }
  });
  // show the caption div
  captionDiv.style.display = "block"
});

// divider
document.querySelector('.ql-divider').addEventListener("click", function() {
  // get the range where the user currently has selected with their cursor
  let range = quill.getSelection(true);
  // insert new line, divider, and place cursor below divider
  quill.insertText(range.index, '\n', Quill.sources.USER);
  quill.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
  quill.insertText(range.index + 2, '\n', {"align": "center"}, Quill.sources.USER);
  quill.setSelection(range.index + 3, Quill.sources.SILENT);

});

// image from URL
document.querySelector('.ql-imgURL').addEventListener("click", function() {
  var range = quill.getSelection();
  var value = prompt('What is the image URL');
  quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
});
