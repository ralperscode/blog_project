"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskerFigure = void 0;
const quill_1 = __importDefault(require("quill"));
const Embed = quill_1.default.import('blots/embed');
class TaskerFigure extends Embed {
    static value(domNode) {
        const taskerImage = domNode.querySelector('.tasker-image');
        const taskerCaption = domNode.querySelector('.tasker-caption');
        if (taskerImage && taskerCaption) {
            return {
                original: {
                    url: taskerImage.dataset.originalUrl,
                    path: taskerImage.dataset.originalPath
                },
                normal: {
                    url: taskerImage.dataset.normalUrl,
                    path: taskerImage.dataset.normalPath
                },
                small: {
                    url: taskerImage.dataset.smallUrl,
                    path: taskerImage.dataset.smallPath
                },
                name: taskerCaption.innerText
            };
        }
        else {
            return {};
        }
    }
    static create(value) {
        const node = super.create(value);
        node.setAttribute('contenteditable', false);
        node.style.fontSize = '0';
        node.classList.add('tasker-figure');
        const image = document.createElement('img');
        image.setAttribute('src', value.normal.url);
        image.classList.add('tasker-image');
        image.dataset.normalUrl = value.normal.url;
        image.dataset.smallUrl = value.small.url;
        image.dataset.originalUrl = value.original.url;
        image.dataset.normalPath = value.normal.path;
        image.dataset.smallPath = value.small.path;
        image.dataset.originalPath = value.original.path;
        node.appendChild(image);
        const caption = document.createElement('a');
        caption.innerText = value.name;
        caption.classList.add('tasker-caption');
        caption.setAttribute('href', value.original.url);
        caption.setAttribute('target', '_blank');
        node.appendChild(caption);
        return node;
    }
    format(format, value) {
        if (format === 'tasker-caption') {
            this.domNode.querySelector('.tasker-caption').innerText = value;
        }
    }
}
exports.TaskerFigure = TaskerFigure;
TaskerFigure.blotName = 'taskerFigure';
TaskerFigure.tagName = 'div';
