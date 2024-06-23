import { compressImage } from './compressImage';
import templateHtml from './template.html';

import './index.css';

const imageRefactorPage = document.createElement('div');
const initHTML = () => {
  imageRefactorPage.className = 'resize-module resize-module_disable';
  imageRefactorPage.insertAdjacentHTML('beforeend', templateHtml);
  document.body.appendChild(imageRefactorPage);
};
initHTML();

const resizableFileInputs = document.querySelectorAll('input[class="imageResizeAndCrop"]');
let currentFileInput: HTMLInputElement;
let dRes = 1;
let targetWidth: number;
let targetHeight: number;
const dt = new DataTransfer();

let img: HTMLImageElement;
let initImageWidth: number, initImageHeight: number;

const backImage: HTMLElement = document.querySelector(".resize-module-container__body-image");
const frontImage: HTMLElement = document.querySelector(".resize-module-container__body-image-area");
const moduleTitle: HTMLElement = document.querySelector(".resize-module-container__body-paragraph");

let viewportImageOffset = backImage.getBoundingClientRect();

let areaTop = 0;
let areaLeft = 0;
let areaBot = 0;
let areaRight = 0;
let fixedPosX: number;
let fixedPosY: number;


imageRefactorPage.addEventListener("selectstart", (evt) => evt.preventDefault());

const fileReader = new FileReader();

const stopPageScrolling = () => {
  document.body.style.top = '-' + window.scrollY + 'px';
  document.body.style.position = 'fixed';
  if (document.body.clientHeight > document.scrollingElement.clientHeight) {
    document.body.style.overflowY = 'scroll';
  }
};
const continuePageScrolling = () => {
  const scrollY = document.body.style.top;
  document.body.style.position = '';
  document.body.style.top = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
  document.body.style.overflowY = '';
};
const alertImageIncorrectSize = () => {
  alert("Размер изображения не соответствует заданным параметрам.");
};
const imageRefactorMethod = () => {
  let scrollDirection = 0;
  let selectDirection = 0;

  const areaEvents = () => {
    let clX: number, clY: number;
    let prevX: number, prevY: number;
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
        areaBot += areaTop;
        areaTop = 0;
      }
      if (areaLeft < 0) {
        areaRight += areaLeft;
        areaLeft = 0;
      }
      if (areaBot < 0) {
        areaTop += areaBot;
        areaBot = 0;
      }
      if (areaRight < 0) {
        areaLeft += areaRight;
        areaRight = 0;
      }
    };
    const checkMinSize = () => {
      const dh = (viewportImageOffset.height - areaTop - areaBot);
      const dw = (viewportImageOffset.width - areaLeft - areaRight);

      if (dh < (targetHeight / dRes) || dw < (targetWidth / dRes)) {
        if (selectDirection === 1) {
          areaTop = viewportImageOffset.height - areaBot - (targetHeight / dRes);
          areaRight = viewportImageOffset.width - areaLeft - (targetWidth / dRes);
        } else if (selectDirection === 2) {
          areaTop = viewportImageOffset.height - areaBot - (targetHeight / dRes);
          areaLeft = viewportImageOffset.width - areaRight - (targetWidth / dRes);
        } else if (selectDirection === 3) {
          areaBot = viewportImageOffset.height - areaTop - (targetHeight / dRes);
          areaLeft = viewportImageOffset.width - areaRight - (targetWidth / dRes);
        } else if (selectDirection === 4) {
          areaBot = viewportImageOffset.height - areaTop - (targetHeight / dRes);
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
        fixedPosY = viewportImageOffset.height + viewportImageOffset.top - areaBot;
      } else if (scrollDirection === 2) {
        fixedPosX = viewportImageOffset.width + viewportImageOffset.left - areaRight;
        fixedPosY = viewportImageOffset.height + viewportImageOffset.top - areaBot;
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
          areaBot <= viewportImageOffset.top + viewportImageOffset.height - clY &&
          areaLeft <= clX - viewportImageOffset.left &&
          areaRight <= viewportImageOffset.left + viewportImageOffset.width - clX) {
          scrollDirection = -1;
        }
      }

      document.addEventListener("touchmove", imageScrollWithArea);
      document.addEventListener("mousemove", imageScrollWithArea);
    };
    backImage.addEventListener("mousedown", imageSetAreaPos);
    backImage.addEventListener("touchstart", imageSetAreaPos);
    document.querySelector(".scale-cube_pos_tr").addEventListener("mousedown", () => {
      scrollDirection = 1;
    });
    document.querySelector(".scale-cube_pos_tl").addEventListener("mousedown", () => {
      scrollDirection = 2;
    });
    document.querySelector(".scale-cube_pos_bl").addEventListener("mousedown", () => {
      scrollDirection = 3;
    });
    document.querySelector(".scale-cube_pos_br").addEventListener("mousedown", () => {
      scrollDirection = 4;
    });
    document.querySelector(".scale-cube_pos_tr").addEventListener("touchstart", () => {
      scrollDirection = 1;
    });
    document.querySelector(".scale-cube_pos_tl").addEventListener("touchstart", () => {
      scrollDirection = 2;
    });
    document.querySelector(".scale-cube_pos_bl").addEventListener("touchstart", () => {
      scrollDirection = 3;
    });
    document.querySelector(".scale-cube_pos_br").addEventListener("touchstart", () => {
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
          areaBot = viewportImageOffset.height - fixedPosY;
        } else if (scrollDirection === 2) {
          areaRight = viewportImageOffset.width - fixedPosX;
          areaBot = viewportImageOffset.height - fixedPosY;
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
          areaBot = viewportImageOffset.height + viewportImageOffset.top - clY;
        } else {
          ty = -1;
          areaTop = clY - viewportImageOffset.top;
          areaBot = viewportImageOffset.height + viewportImageOffset.top - fixedPosY;
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
        areaBot = viewportImageOffset.top + viewportImageOffset.height - clY;
        if (areaBot < 0) {
          areaBot = 0;
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
      const dh = (viewportImageOffset.height - areaTop - areaBot) * targetWidth;

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
          areaBot += (dh - dw) / targetWidth;
        } else {
          areaLeft += (dw - dh) / targetHeight;
        }
      } else if (selectDirection === 4) {
        if (dw <= dh) {
          areaBot += (dh - dw) / targetWidth;
        } else {
          areaRight += (dw - dh) / targetHeight;
        }
      } else if (scrollDirection === -1) {
        areaLeft += clX - prevX;
        areaRight -= clX - prevX;
        areaTop += clY - prevY;
        areaBot -= clY - prevY;

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
      document.removeEventListener("mousemove", imageScrollWithArea);
      document.removeEventListener("touchmove", imageScrollWithArea);
    };
    document.addEventListener("mouseup", imageClickUp);
    document.addEventListener("touchend", imageClickUp);

  };
  areaEvents();
};
const imageInputChangeMethod = () => {

  const fileChange = async function () {
    targetWidth = Number(currentFileInput.getAttribute('data-target-width'));
    targetHeight = Number(currentFileInput.getAttribute('data-target-height'));
    const moduleTitleText = currentFileInput.getAttribute('data-module-title');

    if (moduleTitleText !== "" || moduleTitleText !== undefined) {
      moduleTitle.textContent = moduleTitleText;
    } else {
      moduleTitle.textContent = "Модуль обработки изображений";
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
      img.addEventListener("load", checkImageForCompliance);
    }, {once:true});
  };
  resizableFileInputs.forEach((fileInput: HTMLInputElement) => {
    fileInput.addEventListener("change", () => {
      currentFileInput = fileInput;
      fileChange();
    });
  });
  const checkImageForCompliance = () => {
    if (img.width < targetWidth || img.height < targetHeight) {
      removeUpdates();
      alertImageIncorrectSize();
    } else if (img.width !== targetWidth || img.height !== targetHeight) {
      openResizeModule();
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
    areaBot = (viewportImageOffset.height - imageDy) / 2;

    setImagesWidth();
    setImagesPosition();
  };
  const updateImageAfterWindowResize = () => {
    getImageData();
  };
  window.removeEventListener("resize", updateImageAfterWindowResize);

  const saveUpdatedImageEvent = () => {
    const cropButton = document.querySelector(".resize-module-container__button_type-confirm");
    const canvas: HTMLCanvasElement = document.querySelector('.canvas_crop');

    cropButton.addEventListener("click", () => {
      continuePageScrolling();

      const dx = initImageWidth / viewportImageOffset.width;
      const dy = initImageHeight / viewportImageOffset.height;

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext('2d');

      context.drawImage(img, areaLeft * dx, areaTop * dy, initImageWidth - areaLeft * dx - areaRight * dx, initImageHeight - areaTop * dy - areaBot * dy, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(function (blob) {
        dt.items.clear();
        dt.items.add(new File([blob], 'updatedFile.png', { type: "image/png" }));
        currentFileInput.files = dt.files;
      });
      closeResizeModule();
    });
  };
  saveUpdatedImageEvent();
  const removeUpdates = () => {
    currentFileInput.files = null;
    currentFileInput.value = '';
    closeResizeModule();
  };
  const closeResizeModule = () => {
    continuePageScrolling();
    imageRefactorPage.classList.add("resize-module_disable");

    window.removeEventListener("resize", updateImageAfterWindowResize);
  };
  const openResizeModule = () => {
    stopPageScrolling();
    imageRefactorPage.classList.remove("resize-module_disable");

    window.addEventListener("resize", updateImageAfterWindowResize);
    getImageData();
  };
  document.querySelector(".resize-module-container__button_type-deny").addEventListener("click", removeUpdates);
  document.querySelector(".resize-module-container__close-button").addEventListener("click", removeUpdates);
};
const setImagesWidth = () => {
  frontImage.style.height = (viewportImageOffset.height - areaTop - areaBot) + "px";
  frontImage.style.width = (viewportImageOffset.width - areaLeft - areaRight) + "px";

  (document.querySelector(".resize-module-container__background_pos_t") as HTMLElement).style.height = areaTop + "px";
  (document.querySelector(".resize-module-container__background_pos_b") as HTMLElement).style.height = areaBot + "px";

  (document.querySelector(".resize-module-container__background_pos_l") as HTMLElement).style.top = areaTop + "px";
  (document.querySelector(".resize-module-container__background_pos_l") as HTMLElement).style.bottom = areaBot + "px";
  (document.querySelector(".resize-module-container__background_pos_l") as HTMLElement).style.width = areaLeft + "px";

  (document.querySelector(".resize-module-container__background_pos_r") as HTMLElement).style.top = areaTop + "px";
  (document.querySelector(".resize-module-container__background_pos_r") as HTMLElement).style.bottom = areaBot + "px";
  (document.querySelector(".resize-module-container__background_pos_r") as HTMLElement).style.width = areaRight + "px";
};
const setImagesPosition = () => {
  frontImage.style.backgroundPosition = -areaLeft + "px " + -areaTop + "px";
  frontImage.style.left = areaLeft + "px";
  frontImage.style.right = areaRight + "px";
  frontImage.style.top = areaTop + "px";
  frontImage.style.bottom = areaBot + "px";
};

imageInputChangeMethod();
imageRefactorMethod();
