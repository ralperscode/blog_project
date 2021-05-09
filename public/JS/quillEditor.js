var toolbarOptions = [
// font options with defaults from theme. Custom size options
[{ 'font': ['','libre-baskerville', 'pt-serif', 'playfair-display'] },{ 'size': ['small', false, 'large', 'huge'] }],
// font color and highlight options with defaults from theme
[{ 'color': [] }, { 'background': [] }],
// font styling
['bold', 'italic', 'underline', 'strike'],
// formatting
[{ 'align': [] }],
[{ 'list': 'ordered'}, { 'list': 'bullet' }],
[{ 'script': 'sub'}, { 'script': 'super' }],
[{ 'indent': '-1'}, { 'indent': '+1' }],
// embed image or video
['image', 'video'],
// quotes or code
['link','blockquote', 'code-block', 'code'],
// optional header buttons and formatting
[{ 'header': 1 }, { 'header': 2 },{ 'header': [1, 2, 3, 4, 5, 6, false] }],
// invert text direction button
[{ 'direction': 'rtl' }],
// reset formatting button
['clean']
];

var quill = new Quill('#editor', {
modules: {
  toolbar: toolbarOptions,
  // setup quill image resize and drop modules
  imageResize: {
    modules:['Resize', 'DisplaySize']
  },
  imageDrop: true,
},
theme: 'snow',
placeholder: "Write and format post here."
});
