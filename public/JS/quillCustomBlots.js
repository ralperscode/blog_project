// quill imports
var FontAttributor = Quill.import('attributors/class/font');
var BlockEmbed = Quill.import('blots/block/embed');
var Image = Quill.import('formats/image');
// whitelist for supported fonts
FontAttributor.whitelist = [
'libre-baskerville', 'pt-serif', 'playfair-display'
];

// extend quill to support dividers in post content (horizontal rule)
class DividerBlot extends BlockEmbed { }
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr'

// extend quill to support images from URL's
class ImageURL extends Image{}
ImageURL.blotName = 'imgURL';
ImageURL.tagName = 'img'

// extend quill to support image captions
class CaptionBlot extends BlockEmbed{
// create a node whose innerHTML will be the value passed to it at creation
static create(value){
  let node = super.create();
  node.innerHTML = value
  return node;
}
// set renderAsBlock to true for quill-delta-to-html conversion
formats() {
  return {renderAsBlock: true}
}
// provide node's content for rendering
static value(node){
  return node.innerHTML
}
}
CaptionBlot.blotName = "caption";
CaptionBlot.tagName = "div";
CaptionBlot.className = "ql-caption-wrapper" // className necessary so quill differentiates between default div types

// register new quill features
Quill.register(FontAttributor, true);
Quill.register(DividerBlot);
Quill.register(ImageURL);
Quill.register(CaptionBlot);
