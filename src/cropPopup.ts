import templateHtml from './template.html';

let cropPopup: HTMLDivElement;

export const initCropPopup = () => {
  cropPopup = document.createElement('div');
  cropPopup.className = 'resize-module resize-module_disable';
  cropPopup.insertAdjacentHTML('beforeend', templateHtml);
  document.body.appendChild(cropPopup);
  return cropPopup;
};

export const openCropPopup = () => {
  cropPopup.classList.remove("resize-module_disable");
};

export const closeCropPopup = () => {
  cropPopup.classList.add("resize-module_disable");
};
