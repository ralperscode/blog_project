
function parseQuill(){
  var submittedForm = document.getElementById("publishBtn").form
  document.getElementById("body").value = encodeURIComponent(JSON.stringify(quill.getContents()));
  document.getElementById("bodyText").value = quill.getText();
  // document.getElementById("compose-form").submit();
  submittedForm.submit();
}
