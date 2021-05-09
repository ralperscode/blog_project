function parseQuill(){
  document.getElementById("body").value = encodeURIComponent(JSON.stringify(quill.getContents()));
  document.getElementById("bodyText").value = quill.getText();
  document.getElementById("compose-form").submit();
}
