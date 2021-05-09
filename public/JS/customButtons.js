// add custom blot buttons
var qlTollbar = document.querySelector(".ql-toolbar");

// add divider button
dividerButton = document.createElement("button");
        dividerButton.innerHTML = '<i class="fas fa-minus"></i>';
        dividerButton.classList.add("ql-divider")
        dividerButton.setAttribute("type", "button");
        dividerButton.id="divider-button";

dividerButtonSpan = document.createElement("span");
        dividerButtonSpan.classList.add("ql-formats");
        dividerButtonSpan.appendChild(dividerButton);
        qlTollbar.appendChild(dividerButtonSpan);

// add image URL button
imgURLButton = document.createElement("button");
        imgURLButton.innerHTML = '<i class="fas fa-window-maximize"></i>';
        imgURLButton.classList.add("ql-imgURL")
        imgURLButton.setAttribute("type", "button");
        imgURLButton.id="imgURL-button";

// grab all format spans so button can be added to right group (currently hard coded)
const formatSpans = document.querySelectorAll(".ql-formats")
formatSpans[7].appendChild(imgURLButton);

// add caption button
captionButton = document.createElement("button");
        captionButton.innerHTML = '<i class="fab fa-cuttlefish"></i>';
        captionButton.classList.add("ql-caption");
        captionButton.setAttribute("type", "button");
        captionButton.id="caption-button"

formatSpans[7].appendChild(captionButton);
