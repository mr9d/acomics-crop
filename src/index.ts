import { compressImage } from './compressImage';
import { pausePageScroll, resumePageScroll } from './pageScroll';
import { initCropPopup, openCropPopup, closeCropPopup } from './cropPopup';

import './index.css';

const dt = new DataTransfer();
const fileReader = new FileReader();

const cropPopup = initCropPopup();

let dRes = 1;
let targetWidth: number;
let targetHeight: number;

let img: HTMLImageElement;
let initImageWidth: number;
let initImageHeight: number;

const cropFileInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[class="imageResizeAndCrop"]');
let currentFileInput: HTMLInputElement;

const backImage: HTMLElement = cropPopup.querySelector(".resize-module-container__body-image");
const frontImage: HTMLElement = cropPopup.querySelector(".resize-module-container__body-image-area");
const confirmButton: HTMLButtonElement = cropPopup.querySelector(".resize-module-container__button_type-confirm");
const denyButton: HTMLButtonElement = cropPopup.querySelector(".resize-module-container__button_type-deny");
const closeButton: HTMLButtonElement = cropPopup.querySelector(".resize-module-container__close-button");

let viewportImageOffset = backImage.getBoundingClientRect();

let areaTop = 0;
let areaLeft = 0;
let areaBottom = 0;
let areaRight = 0;
let fixedPosX: number;
let fixedPosY: number;

let scrollDirection = 0;
let selectDirection = 0;

let clX: number;
let clY: number;
let prevX: number;
let prevY: number;

const alertImageIncorrectSize = () => {
  alert("Размер изображения не соответствует заданным параметрам.");
};

const getTouchCoords = (evt: TouchEvent | MouseEvent) => {
  prevX = clX;
  prevY = clY;
  if (evt.type === 'touchstart' || evt.type === 'touchmove' || evt.type === 'touchend') {
    clX = (evt as TouchEvent).touches[0].clientX;
    clY = (evt as TouchEvent).touches[0].clientY;
  } else {
    clX = (evt as MouseEvent).clientX;
    clY = (evt as MouseEvent).clientY;
  }
};

const checkBorders = () => {
  if (areaTop < 0) {
    areaBottom += areaTop;
    areaTop = 0;
  }
  if (areaLeft < 0) {
    areaRight += areaLeft;
    areaLeft = 0;
  }
  if (areaBottom < 0) {
    areaTop += areaBottom;
    areaBottom = 0;
  }
  if (areaRight < 0) {
    areaLeft += areaRight;
    areaRight = 0;
  }
};

const checkMinSize = () => {
  const dh = (viewportImageOffset.height - areaTop - areaBottom);
  const dw = (viewportImageOffset.width - areaLeft - areaRight);

  if (dh < (targetHeight / dRes) || dw < (targetWidth / dRes)) {
    if (selectDirection === 1) {
      areaTop = viewportImageOffset.height - areaBottom - (targetHeight / dRes);
      areaRight = viewportImageOffset.width - areaLeft - (targetWidth / dRes);
    } else if (selectDirection === 2) {
      areaTop = viewportImageOffset.height - areaBottom - (targetHeight / dRes);
      areaLeft = viewportImageOffset.width - areaRight - (targetWidth / dRes);
    } else if (selectDirection === 3) {
      areaBottom = viewportImageOffset.height - areaTop - (targetHeight / dRes);
      areaLeft = viewportImageOffset.width - areaRight - (targetWidth / dRes);
    } else if (selectDirection === 4) {
      areaBottom = viewportImageOffset.height - areaTop - (targetHeight / dRes);
      areaRight = viewportImageOffset.width - areaLeft - (targetWidth / dRes);
    }
  }
};

const imageSetAreaPos = (evt: MouseEvent) => {
  evt.preventDefault();
  viewportImageOffset = backImage.getBoundingClientRect();
  getTouchCoords(evt);

  if (scrollDirection === 1) {
    fixedPosX = areaLeft + viewportImageOffset.left;
    fixedPosY = viewportImageOffset.height + viewportImageOffset.top - areaBottom;
  } else if (scrollDirection === 2) {
    fixedPosX = viewportImageOffset.width + viewportImageOffset.left - areaRight;
    fixedPosY = viewportImageOffset.height + viewportImageOffset.top - areaBottom;
  } else if (scrollDirection === 3) {
    fixedPosX = viewportImageOffset.width + viewportImageOffset.left - areaRight;
    fixedPosY = areaTop + viewportImageOffset.top;
  } else if (scrollDirection === 4) {
    fixedPosX = areaLeft + viewportImageOffset.left;
    fixedPosY = areaTop + viewportImageOffset.top;
  } else {
    fixedPosX = clX;
    fixedPosY = clY;
    if (areaTop <= clY - viewportImageOffset.top &&
      areaBottom <= viewportImageOffset.top + viewportImageOffset.height - clY &&
      areaLeft <= clX - viewportImageOffset.left &&
      areaRight <= viewportImageOffset.left + viewportImageOffset.width - clX) {
      scrollDirection = -1;
    }
  }

  cropPopup.addEventListener("touchmove", imageScrollWithArea);
  cropPopup.addEventListener("mousemove", imageScrollWithArea);
};

backImage.addEventListener("mousedown", imageSetAreaPos);
backImage.addEventListener("touchstart", imageSetAreaPos);

cropPopup.querySelector(".scale-cube_pos_tr").addEventListener("mousedown", () => {
  scrollDirection = 1;
});
cropPopup.querySelector(".scale-cube_pos_tl").addEventListener("mousedown", () => {
  scrollDirection = 2;
});
cropPopup.querySelector(".scale-cube_pos_bl").addEventListener("mousedown", () => {
  scrollDirection = 3;
});
cropPopup.querySelector(".scale-cube_pos_br").addEventListener("mousedown", () => {
  scrollDirection = 4;
});
cropPopup.querySelector(".scale-cube_pos_tr").addEventListener("touchstart", () => {
  scrollDirection = 1;
});
cropPopup.querySelector(".scale-cube_pos_tl").addEventListener("touchstart", () => {
  scrollDirection = 2;
});
cropPopup.querySelector(".scale-cube_pos_bl").addEventListener("touchstart", () => {
  scrollDirection = 3;
});
cropPopup.querySelector(".scale-cube_pos_br").addEventListener("touchstart", () => {
  scrollDirection = 4;
});

const imageScrollWithArea = (evt: TouchEvent) => {
  getTouchCoords(evt);

  let tx = 0;
  let ty = 0;

  selectDirection = 0;
  if (scrollDirection !== -1) {
    if (scrollDirection === 1) {
      areaLeft = fixedPosX;
      areaBottom = viewportImageOffset.height - fixedPosY;
    } else if (scrollDirection === 2) {
      areaRight = viewportImageOffset.width - fixedPosX;
      areaBottom = viewportImageOffset.height - fixedPosY;
    } else if (scrollDirection === 3) {
      areaRight = viewportImageOffset.width - fixedPosX;
      areaTop = fixedPosY;
    } else if (scrollDirection === 4) {
      areaLeft = fixedPosX;
      areaTop = fixedPosY;
    }
    if (clX >= fixedPosX) {
      tx = 1;
      areaLeft = fixedPosX - viewportImageOffset.left;
      areaRight = viewportImageOffset.width + viewportImageOffset.left - clX;
    } else {
      tx = -1;
      areaLeft = clX - viewportImageOffset.left;
      areaRight = viewportImageOffset.width + viewportImageOffset.left - fixedPosX;
    }
    if (clY >= fixedPosY) {
      ty = 1;
      areaTop = fixedPosY - viewportImageOffset.top;
      areaBottom = viewportImageOffset.height + viewportImageOffset.top - clY;
    } else {
      ty = -1;
      areaTop = clY - viewportImageOffset.top;
      areaBottom = viewportImageOffset.height + viewportImageOffset.top - fixedPosY;
    }
    if (tx === 1 && ty === -1) {
      selectDirection = 1;
    } else if (tx === -1 && ty === -1) {
      selectDirection = 2;
    } else if (tx === -1 && ty === 1) {
      selectDirection = 3;
    } else if (tx === 1 && ty === 1) {
      selectDirection = 4;
    }
  }

  if (selectDirection === 1 || selectDirection === 2) {
    areaTop = clY - viewportImageOffset.top;
    if (areaTop < 0) {
      areaTop = 0;
    }
  }

  if (selectDirection === 3 || selectDirection === 4) {
    areaBottom = viewportImageOffset.top + viewportImageOffset.height - clY;
    if (areaBottom < 0) {
      areaBottom = 0;
    }
  }

  if (selectDirection === 2 || selectDirection === 3) {
    areaLeft = clX - viewportImageOffset.left;
    if (areaLeft < 0) {
      areaLeft = 0;
    }
  }
  if (selectDirection === 4 || selectDirection === 1) {
    areaRight = viewportImageOffset.left + viewportImageOffset.width - clX;
    if (areaRight < 0) {
      areaRight = 0;
    }
  }

  if (targetWidth !== 0 && targetHeight !== 0) {
    checkProportions();
  }

  checkBorders();

  setImagesWidth();
  setImagesPosition();
};

const checkProportions = () => {
  const dw = (viewportImageOffset.width - areaLeft - areaRight) * targetHeight;
  const dh = (viewportImageOffset.height - areaTop - areaBottom) * targetWidth;

  if (selectDirection === 1) {
    if (dw <= dh) {
      areaTop += (dh - dw) / targetWidth;
    } else {
      areaRight += (dw - dh) / targetHeight;
    }
  } else if (selectDirection === 2) {
    if (dw <= dh) {
      areaTop += (dh - dw) / targetWidth;
    } else {
      areaLeft += (dw - dh) / targetHeight;
    }
  } else if (selectDirection === 3) {
    if (dw <= dh) {
      areaBottom += (dh - dw) / targetWidth;
    } else {
      areaLeft += (dw - dh) / targetHeight;
    }
  } else if (selectDirection === 4) {
    if (dw <= dh) {
      areaBottom += (dh - dw) / targetWidth;
    } else {
      areaRight += (dw - dh) / targetHeight;
    }
  } else if (scrollDirection === -1) {
    areaLeft += clX - prevX;
    areaRight -= clX - prevX;
    areaTop += clY - prevY;
    areaBottom -= clY - prevY;

    prevX = clX;
    prevY = clY;
  }
};

const imageClickUp = () => {
  checkProportions();

  checkMinSize();
  checkProportions();
  checkBorders();

  setImagesWidth();
  setImagesPosition();

  scrollDirection = 0;
  cropPopup.removeEventListener("mousemove", imageScrollWithArea);
  cropPopup.removeEventListener("touchmove", imageScrollWithArea);
};

cropPopup.addEventListener("mouseup", imageClickUp);
cropPopup.addEventListener("touchend", imageClickUp);

const cropFileInputChangeListener = async (evt: Event) => {
  currentFileInput = evt.target as HTMLInputElement;

  targetWidth = Number(currentFileInput.dataset.targetWidth);
  targetHeight = Number(currentFileInput.dataset.targetHeight);

  const moduleHeaderElement: HTMLElement = cropPopup.querySelector(".resize-module-container__header-text");
  const moduleDescriptionElement: HTMLElement = cropPopup.querySelector(".resize-module-container__body-paragraph");

  if (currentFileInput.dataset.moduleHeader) {
    moduleHeaderElement.textContent = currentFileInput.dataset.moduleHeader;
  }

  if (currentFileInput.dataset.moduleDescription) {
    moduleDescriptionElement.textContent = currentFileInput.dataset.moduleDescription;
  }

  const file: File = currentFileInput.files[0];

  const compressedFile: Blob = await compressImage(file, {
    quality: Math.min(1, (2097152 / file.size)),
    type: 'image/jpeg',
  });

  fileReader.readAsDataURL(compressedFile);
  fileReader.addEventListener("load", () => {
    img = new Image();
    img.src = fileReader.result as string;
    img.addEventListener("load", checkImageAndOpenPopup);
  }, { once: true });
};

const checkImageAndOpenPopup = () => {
  if (img.width < targetWidth || img.height < targetHeight) {
    removeUpdates();
    alertImageIncorrectSize();
  } else if (img.width !== targetWidth || img.height !== targetHeight) {
    pausePageScroll();
    openCropPopup();
    getImageData();
  } else {
    // Если изображение уже правильного размера, ничего не делаем
  }
};

const getImageData = () => {
  initImageWidth = img.naturalWidth;
  initImageHeight = img.naturalHeight;

  const dw = initImageWidth / Math.min(window.innerWidth, 900);
  const dh = initImageHeight / Math.min(window.innerHeight - 200, 600);
  const areaMargin = 88;

  dRes = Math.min(dw, dh);

  backImage.style.width = (initImageWidth / dRes - areaMargin) + "px";
  backImage.style.height = (initImageHeight / dRes - areaMargin) + "px";
  backImage.style.backgroundSize = (initImageWidth / dRes - areaMargin) + "px " + (initImageHeight / dRes - areaMargin) + "px";
  backImage.style.backgroundImage = "url('" + fileReader.result + "')";

  viewportImageOffset = backImage.getBoundingClientRect();
  backImage.scrollIntoView({
    block: 'center',
    inline: 'center'
  });
  const imageDx = Math.min(
    viewportImageOffset.width,
    viewportImageOffset.height * targetWidth / targetHeight);
  const imageDy = Math.min(
    viewportImageOffset.height,
    viewportImageOffset.width * targetHeight / targetWidth);

  areaLeft = (viewportImageOffset.width - imageDx) / 2;
  areaRight = (viewportImageOffset.width - imageDx) / 2;
  areaTop = (viewportImageOffset.height - imageDy) / 2;
  areaBottom = (viewportImageOffset.height - imageDy) / 2;

  setImagesWidth();
  setImagesPosition();
};

const confirmButtonClickListener = () => {
  resumePageScroll();

  const dx = initImageWidth / viewportImageOffset.width;
  const dy = initImageHeight / viewportImageOffset.height;

  const canvas: HTMLCanvasElement = cropPopup.querySelector('.canvas_crop');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext('2d');

  context.drawImage(img, areaLeft * dx, areaTop * dy, initImageWidth - areaLeft * dx - areaRight * dx, initImageHeight - areaTop * dy - areaBottom * dy, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    dt.items.clear();
    dt.items.add(new File([blob], 'updatedFile.png', { type: "image/png" }));
    currentFileInput.files = dt.files;
    submitFormIfNecessary();
  });
  closeResizeModule();
};

const submitFormIfNecessary = () => {
  if (!currentFileInput.dataset.submitOnSuccess) {
    return;
  }

  const form = currentFileInput.closest('form');

  if (!form) {
    return;
  }

  form.submit();
};

const removeUpdates = () => {
  currentFileInput.files = null;
  currentFileInput.value = '';
  closeResizeModule();
};

const closeResizeModule = () => {
  resumePageScroll();
  closeCropPopup();
};

const setImagesWidth = () => {
  frontImage.style.height = (viewportImageOffset.height - areaTop - areaBottom) + "px";
  frontImage.style.width = (viewportImageOffset.width - areaLeft - areaRight) + "px";

  (cropPopup.querySelector(".resize-module-container__background_pos_t") as HTMLElement).style.height = areaTop + "px";
  (cropPopup.querySelector(".resize-module-container__background_pos_b") as HTMLElement).style.height = areaBottom + "px";

  (cropPopup.querySelector(".resize-module-container__background_pos_l") as HTMLElement).style.top = areaTop + "px";
  (cropPopup.querySelector(".resize-module-container__background_pos_l") as HTMLElement).style.bottom = areaBottom + "px";
  (cropPopup.querySelector(".resize-module-container__background_pos_l") as HTMLElement).style.width = areaLeft + "px";

  (cropPopup.querySelector(".resize-module-container__background_pos_r") as HTMLElement).style.top = areaTop + "px";
  (cropPopup.querySelector(".resize-module-container__background_pos_r") as HTMLElement).style.bottom = areaBottom + "px";
  (cropPopup.querySelector(".resize-module-container__background_pos_r") as HTMLElement).style.width = areaRight + "px";
};

const setImagesPosition = () => {
  frontImage.style.backgroundPosition = -areaLeft + "px " + -areaTop + "px";
  frontImage.style.left = areaLeft + "px";
  frontImage.style.right = areaRight + "px";
  frontImage.style.top = areaTop + "px";
  frontImage.style.bottom = areaBottom + "px";
};

cropFileInputs.forEach((cropFileInput: HTMLInputElement) => {
  cropFileInput.addEventListener("change", cropFileInputChangeListener);
});

closeButton.addEventListener("click", removeUpdates);
denyButton.addEventListener("click", removeUpdates);
confirmButton.addEventListener("click", confirmButtonClickListener);
