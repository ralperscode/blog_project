const thumbnailDiv = document.getElementById('thumbnailUploadDiv');
const fileInput = document.getElementById('fileUploadInput');
const imgUploadRadio = document.getElementById('imgUpload');
const imgUploadLabel = document.getElementById('imgUploadLabel')
const defaultImgRadio = document.getElementById('defaultImg');

imgUploadRadio.addEventListener("click", function(){
    if(imgUploadLabel.nextElementSibling.id != "toRemove"){
      var lineBreak = document.createElement("br");
      lineBreak.id = "toRemove"
      imgUploadLabel.insertAdjacentHTML('afterend', lineBreak.outerHTML);
    }
    fileInput.style.display = "inline-block"
});

defaultImgRadio.addEventListener("click", function(){
    fileInput.style.display = "none"
    if(imgUploadLabel.nextElementSibling.id === "toRemove"){
        document.getElementById('toRemove').remove();
    }
    if(fileInput.value != ""){
      fileInput.value = ""
    }
});

// still need to do additional file content validation on server side
function validateFileType(){
        var fileName = fileInput.value;
        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (extFile=="jpg" || extFile=="jpeg" || extFile=="png"){
            return
        }else{
            alert("Only jpg/jpeg and png files are allowed!");
            fileInput.value = ""
        }
    }
