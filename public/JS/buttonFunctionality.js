// custom toolbar button functionality

// captions
document.querySelector('.ql-caption').addEventListener("click", function() {
  // find all images in document and add an id to it
  imgList = document.querySelectorAll('img');
  imgList.forEach(function(img, idx){
    // only add the id if it is a new image
    if(img.id === ""){
      img.id = "image" + (idx + 1);
      // insert radio button and label for the new image so it can be selected for captioning
      imgSelectorP.insertAdjacentHTML('afterend',
      '<input type="radio" name="selectImage" id="for'+img.id+'" value="'+img.id+'">'
      +'<label for="for'+img.id+'">' + img.id + '</label> <br>');
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
  quill.setSelection(range.index + 2, Quill.sources.SILENT);

});

// image from URL
document.querySelector('.ql-imgURL').addEventListener("click", function() {
  var range = quill.getSelection();
  var value = prompt('What is the image URL');
  quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
});
