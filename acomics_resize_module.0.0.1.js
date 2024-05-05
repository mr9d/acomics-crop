(function () {

    const imageRefactorPage = document.createElement('div');
    const initHTML = () => {
        imageRefactorPage.className = 'resize-module resize-module_disable';
        const htmlString =
            '            <div class="resize-module-background"></div>\n' +
            '            <div class="resize-module-container">\n' +
            '                <div class="resize-module-container__header">\n' +
            '                    <div class="resize-module-container__header-text">Ваша фотография</div>\n' +
            '                    <div class="resize-module-container__close-button"></div>\n' +
            '                </div>\n' +
            '                <div class="zoom-variant-container">\n' +
            '                    <div data-type="wheel" class="zoom-variant-item zoom-variant-item_type_wheel"></div>\n' +
            '                    <div data-type="arrows" class="zoom-variant-item zoom-variant-item_type_arrows"></div>\n' +
            '                    <div data-type="area" class="zoom-variant-item zoom-variant-item_type_area"></div>\n' +
            '                </div>\n' +
            '                <div class="resize-module-container__body resize-module-container__body_type_wheel">\n' +
            '                    <p class="resize-module-container__body-text">Выбранная область будет показываться на вашей странице</p>\n' +
            '                    <p class="resize-module-container__body-paragraph">Вы можете изменять размер изображения при помощи колёсика мыши</p>\n' +
            '                    <div class="resize-module-container__body-box resize-module-container__body-box_type_wheel">\n' +
            '                        <div class="resize-module-container__body-file resize-module-container__file_place-back resize-module-container__file_place-back_t_w"></div>\n' +
            '                        <div class="resize-module-container__circle-box">\n' +
            '                            <div class="resize-module-container__body-file resize-module-container__file_place-front resize-module-container__file_place-front_t_w"></div>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <div class="resize-module-container__body resize-module-container__body_type_arrows">\n' +
            '                    <p class="resize-module-container__body-text">Выбранная область будет показываться на вашей странице</p>\n' +
            '                    <p class="resize-module-container__body-paragraph">Вы можете изменять размер изображения при помощи стягивания углов</p>\n' +
            '                    <div class="resize-module-container__body-box resize-module-container__body-box_type_arrows">\n' +
            '                        <div class="resize-module-container__body-file resize-module-container__file_place-back resize-module-container__file_place-back_t_a"></div>\n' +
            '                        <div class="resize-module-container__circle-box">\n' +
            '                            <div class="resize-module-container__body-file resize-module-container__file_place-front resize-module-container__file_place-front_t_a"></div>\n' +
            '                        </div>\n' +
            '                        <div class="resize-module-container__zoom-arrows">\n' +
            '                            <div class="resize-module-container__zoom-button resize-module-container__zoom-button_place_top"></div>\n' +
            '                            <div class="resize-module-container__zoom-button resize-module-container__zoom-button_place_bottom"></div>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <div class="resize-module-container__body resize-module-container__body_type_area">\n' +
            '                    <p class="resize-module-container__body-text">Выбранная область будет показываться на вашей странице</p>\n' +
            '                    <p class="resize-module-container__body-paragraph">Вы можете выбрать необходимый участок изображения</p>\n' +
            '                    <div class="resize-module-container__body-box resize-module-container__body-box_type_area">\n' +
            '                        <div class="resize-module-container__body-image resize-module-container__file_place-back_t_area">\n' +
            '                            <div class="resize-module-container__background-box">\n' +
            '                                <div class="resize-module-container__background resize-module-container__background_pos_t"></div>\n' +
            '                                <div class="resize-module-container__background resize-module-container__background_pos_l"></div>\n' +
            '                                <div class="resize-module-container__background resize-module-container__background_pos_b"></div>\n' +
            '                                <div class="resize-module-container__background resize-module-container__background_pos_r"></div>\n' +
            '                            </div>\n' +
            '                            <div class="resize-module-container__body-image-area resize-module-container__file_place-front_t_area">\n' +
            '                                <div class="scale-cube scale-cube_pos_tl"></div>\n' +
            '                                <div class="scale-cube scale-cube_pos_tr"></div>\n' +
            '                                <div class="scale-cube scale-cube_pos_bl"></div>\n' +
            '                                <div class="scale-cube scale-cube_pos_br"></div>\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <div class="resize-module-container__footer">\n' +
            '                    <div class="resize-module-container__button resize-module-container__button_type-confirm">\n' +
            '                        <span>Сохранить изменения</span>\n' +
            '                    </div>\n' +
            '                    <div class="resize-module-container__button resize-module-container__button_type-deny">\n' +
            '                        <span>Вернуться назад</span>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '              <canvas class="canvas_crop"></canvas>\n' +
            '            </div>'
        imageRefactorPage.insertAdjacentHTML('beforeend', htmlString);
        document.body.appendChild(imageRefactorPage);
    }
    initHTML();

    const resizableFileInputs = document.querySelectorAll('input[class="imageResizeAndCrop"]');
    let currentFileInput;
    let targetWidth;
    let targetHeight;
    const dt = new DataTransfer();
    const resizeWindowWidth = 500;
    const resizeWindowHeight = 500;

    let img;
    let initImageWidth;
    let initImageHeight;
    let imageWidth;
    let imageHeight;
    let zoom = 1;
    let zoomDelta = 0;
    let zoomVariant = "area";
    let imagePosX = 0, imagePosY = 0;

    const backImageTypeWheel = document.querySelector(".resize-module-container__file_place-back_t_w");
    const frontImageTypeWheel = document.querySelector(".resize-module-container__file_place-front_t_w");

    const backImageTypeArrows = document.querySelector(".resize-module-container__file_place-back_t_a");
    const frontImageTypeArrows = document.querySelector(".resize-module-container__file_place-front_t_a");

    const backImageTypeArea = document.querySelector(".resize-module-container__file_place-back_t_area");
    const frontImageTypeArea = document.querySelector(".resize-module-container__file_place-front_t_area");

    let areaTop = 0;
    let areaLeft = 0;
    let areaBot = 0;
    let areaRight = 0;


    imageRefactorPage.addEventListener("selectstart", (evt) => evt.preventDefault());
    const resizeModuleBody = document.querySelector(".resize-module-container__body_type_area");

    const fileReader = new FileReader();

    const resizeModuleContainers = document.querySelectorAll("[data-type]");

    const compressImage = async (file, {quality = 1, type = file.type}) => {
        // Get as image data
        const imageBitmap = await createImageBitmap(file);

        // Draw to canvas
        const canvas = document.createElement('canvas');
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageBitmap, 0, 0);

        // Turn into Blob
        return await new Promise((resolve) =>
            canvas.toBlob(resolve, type, quality)
        );
    };

    const imageRefactorMethod = () => {
        let mousePosX, mousePosY;

        let scrollDirection = 0;

        const arrowsEvents = () => {
            const imageScrollWithArrows = (evt) => {
                {
                    zoom = 1 + zoomDelta + ((evt.clientX - mousePosX) + (evt.clientY - mousePosY))
                        / (100 + Math.sqrt((evt.clientX - mousePosX) * (evt.clientX - mousePosX) +
                            (evt.clientY - mousePosY) * (evt.clientY - mousePosY)));
                }
                if (scrollDirection === 4) {
                    zoom = 1 + zoomDelta - ((evt.clientX - mousePosX) + (evt.clientY - mousePosY))
                        / (100 + Math.sqrt((evt.clientX - mousePosX) * (evt.clientX - mousePosX) +
                            (evt.clientY - mousePosY) * (evt.clientY - mousePosY)));
                }

                if (initImageWidth * zoom < resizeWindowWidth || initImageHeight * zoom < resizeWindowHeight) {
                    zoom = resizeWindowWidth / Math.min(initImageWidth, initImageHeight);
                    zoomDelta = zoom - 1;
                }

                imageWidth = initImageWidth * zoom;
                imageHeight = initImageHeight * zoom;

                document.querySelector(".resize-module-container__zoom-button_place_top").style.margin = (32 * zoom + 4) / (zoom + 4) + "px";
                document.querySelector(".resize-module-container__zoom-button_place_bottom").style.margin = (32 * zoom + 4) / (zoom + 4) + "px";
                makePositionValid();
                setImagesWidth(imageWidth);
            }

            const arrowClickDown = (evt) => {
                mousePosX = evt.clientX;
                mousePosY = evt.clientY;

                document.addEventListener("mousemove", imageScrollWithArrows);
            }

            document.querySelector(".resize-module-container__zoom-button_place_top")
                .addEventListener("mousedown", (event) => {
                    scrollDirection = 2;
                    arrowClickDown(event);
                });
            document.querySelector(".resize-module-container__zoom-button_place_bottom")
                .addEventListener("mousedown", (event) => {
                    scrollDirection = 4;
                    arrowClickDown(event);
                });

            const imageClickUp = () => {
                zoomDelta = zoom - 1;
                document.removeEventListener("mousemove", imageScrollWithArrows);
            }

            document.addEventListener("mouseup", imageClickUp);

        }
        arrowsEvents();

        const wheelEvents = () => {
            const imageScrollWithWheel = (evt) => {
                zoom -= evt.deltaY / 2400;
                if (initImageWidth * zoom >= resizeWindowWidth && initImageHeight * zoom >= resizeWindowHeight) {
                    imageWidth = initImageWidth * zoom;
                    imageHeight = initImageHeight * zoom;
                } else {
                    zoom += evt.deltaY / 2400;
                }
                makePositionValid();
                setImagesWidth(imageWidth);
            }

            if ('onwheel' in document) {
                backImageTypeWheel.addEventListener("wheel", imageScrollWithWheel);
            } else if ('onmousewheel' in document) {
                backImageTypeWheel.addEventListener("mousewheel", imageScrollWithWheel);
            } else {
                backImageTypeWheel.addEventListener("MozMousePixelScroll", imageScrollWithWheel);
            }
        }
        wheelEvents();

        const areaEvents = () => {
            let clX, clY;
            let prevX, prevY;
            const getTouchCoords = (evt) => {
                prevX = clX;
                prevY = clY;
                if (evt.touches != null) {
                    clX = evt.touches[0].clientX;
                    clY = evt.touches[0].clientY;
                } else {
                    clX = evt.clientX;
                    clY = evt.clientY;
                }
            }
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
            }
            const imageSelectViewArea = (evt) => {
                let viewportImageOffset = backImageTypeArea.getBoundingClientRect();
                getTouchCoords(evt);

                areaTop = clY - viewportImageOffset.top - 125;
                areaBot = viewportImageOffset.height - areaTop - 250;
                areaLeft = clX - viewportImageOffset.left - 125;
                areaRight = viewportImageOffset.width - areaLeft - 250;

                checkBorders();

                setImagesWidth(imageWidth);
                setImagesPosition(imagePosX, imagePosY);
            }
            resizeModuleBody.addEventListener("dblclick", imageSelectViewArea);
            const imageSetAreaPos = (evt) => {
                let viewportImageOffset = backImageTypeArea.getBoundingClientRect();
                getTouchCoords(evt);

                let tx = 0;
                let ty = 0;
                const viewportHeight_pt = (viewportImageOffset.height - areaTop - areaBot) / 5;
                const viewportWidth_pt = (viewportImageOffset.width - areaLeft - areaRight) / 5;
                if (areaTop >= clY - viewportImageOffset.top - viewportHeight_pt) {
                    ty = -1;
                }
                if (areaBot > viewportImageOffset.top + viewportImageOffset.height - clY - viewportHeight_pt) {
                    ty = 1;
                }
                if (areaLeft >= clX - viewportImageOffset.left - viewportWidth_pt) {
                    tx = -1;
                }
                if (areaRight > viewportImageOffset.left + viewportImageOffset.width - clX - viewportWidth_pt) {
                    tx = 1;
                }

                if (tx === 1 && ty === -1) {
                    scrollDirection = 1;
                } else if (tx === -1 && ty === -1) {
                    scrollDirection = 2;
                } else if (tx === -1 && ty === 1) {
                    scrollDirection = 3;
                } else if (tx === 1 && ty === 1) {
                    scrollDirection = 4;
                } else if (tx === 0 && ty === 0) {
                    scrollDirection = 0;
                } else {
                    scrollDirection = -1;
                }

                document.addEventListener("touchmove", imageScrollWithArea);
                document.addEventListener("mousemove", imageScrollWithArea);
            }
            backImageTypeArea.addEventListener("mousedown", imageSetAreaPos);
            const imageScrollWithArea = (evt) => {
                let viewportImageOffset = backImageTypeArea.getBoundingClientRect();
                getTouchCoords(evt);

                if (scrollDirection === 1 || scrollDirection === 2) {
                    areaTop = clY - viewportImageOffset.top;
                    if (areaTop < 0) {
                        areaTop = 0;
                    } else if (areaTop + 50 > viewportImageOffset.height - areaBot) {
                        areaTop = viewportImageOffset.height - areaBot - 50;
                    }
                }

                if (scrollDirection === 3 || scrollDirection === 4) {
                    areaBot = viewportImageOffset.top + viewportImageOffset.height - clY;
                    if (areaBot < 0) {
                        areaBot = 0;
                    } else if (areaBot + 50 > viewportImageOffset.height - areaTop) {
                        areaBot = viewportImageOffset.height - areaTop - 50;
                    }
                }

                if (scrollDirection === 2 || scrollDirection === 3) {
                    areaLeft = clX - viewportImageOffset.left;
                    if (areaLeft < 0) {
                        areaLeft = 0;
                    } else if (areaLeft + 50 > viewportImageOffset.width - areaRight) {
                        areaLeft = viewportImageOffset.width - areaRight - 50;
                    }
                }
                if (scrollDirection === 4 || scrollDirection === 1) {
                    areaRight = viewportImageOffset.left + viewportImageOffset.width - clX;
                    if (areaRight < 0) {
                        areaRight = 0;
                    } else if (areaRight + 50 > viewportImageOffset.width - areaLeft) {
                        areaRight = viewportImageOffset.width - areaLeft - 50;
                    }
                }

                const dw = viewportImageOffset.width - areaLeft - areaRight;
                const dh = viewportImageOffset.height - areaTop - areaBot;

                if (scrollDirection === 1) {
                    if (dw <= dh) {
                        areaTop += dh - dw;
                    } else {
                        areaRight += dw - dh;
                    }
                } else if (scrollDirection === 2) {
                    if (dw <= dh) {
                        areaTop += dh - dw;
                    } else {
                        areaLeft += dw - dh;
                    }
                } else if (scrollDirection === 3) {
                    if (dw <= dh) {
                        areaBot += dh - dw;
                    } else {
                        areaLeft += dw - dh;
                    }
                } else if (scrollDirection === 4) {
                    if (dw <= dh) {
                        areaBot += dh - dw;
                    } else {
                        areaRight += dw - dh;
                    }
                } else if (scrollDirection === 0) {
                    areaLeft += clX - prevX;
                    areaRight -= clX - prevX;
                    areaTop += clY - prevY;
                    areaBot -= clY - prevY;

                    prevX = clX;
                    prevY = clY;
                }

                checkBorders();

                setImagesWidth(imageWidth);
                setImagesPosition(imagePosX, imagePosY);
            }
            const imageClickUp = () => {
                document.removeEventListener("mousemove", imageScrollWithArea);
            }
            document.addEventListener("mouseup", imageClickUp);
        }
        areaEvents();

        const makePositionValid = () => {
            if (2 * imagePosX + resizeWindowWidth > imageWidth) {
                imagePosX = imageWidth / 2 - resizeWindowWidth / 2;
            } else if (2 * imagePosX - resizeWindowWidth < -imageWidth) {
                imagePosX = -imageWidth / 2 + resizeWindowWidth / 2;
            }

            if (2 * imagePosY + resizeWindowHeight > imageHeight) {
                imagePosY = imageHeight / 2 - resizeWindowHeight / 2;
            } else if (2 * imagePosY - resizeWindowHeight < -imageHeight) {
                imagePosY = -imageHeight / 2 + resizeWindowHeight / 2;
            }
            const posX = "calc(50% + " + imagePosX + "px)";
            const posY = "calc(50% + " + imagePosY + "px)";

            setImagesPosition(posX, posY)
        }

        const imageMoveEvents = () => {
            const imageMove = (evt) => {
                const deltaX = evt.clientX;
                const deltaY = evt.clientY;

                imagePosX = (deltaX - mousePosX);
                imagePosY = (deltaY - mousePosY);
                makePositionValid();
            }

            const imageClickDown = (evt) => {
                mousePosX = evt.clientX - imagePosX;
                mousePosY = evt.clientY - imagePosY;

                document.addEventListener("mousemove", imageMove);
            }

            backImageTypeWheel.addEventListener("mousedown", imageClickDown);
            backImageTypeArrows.addEventListener("mousedown", imageClickDown);
            backImageTypeArea.addEventListener("mousedown", imageClickDown);

            const imageClickUp = () => {
                document.removeEventListener("mousemove", imageMove);
            }

            document.addEventListener("mouseup", imageClickUp);
        }
        imageMoveEvents();
    }
    const imageInputChangeMethod = () => {

        const fileChange = async function () {
            imageRefactorPage.classList.remove("resize-module_disable");

            let file = currentFileInput.files[0];

            let compressedFile = await compressImage(file, {
                quality: Math.min(1, (2097152 / file.size)),
                type: 'image/jpeg',
            });

            fileReader.readAsDataURL(compressedFile);
            fileReader.addEventListener("load", () => {
                img = new Image();
                img.src = fileReader.result;
                img.addEventListener("load", getImageData);

                window.addEventListener("resize", updateImageAfterWindowResize);
            });

            setEnableZoomVariant("area");
        };
        resizableFileInputs.forEach((fileInput) => {
            fileInput.addEventListener("change", () => {
                currentFileInput = fileInput;
                fileChange();
            });
            targetWidth = Number(fileInput.getAttribute('data-target-width'));
            targetHeight = Number(fileInput.getAttribute('data-target-height'));
        })
        const getImageData = () => {
            initImageWidth = img.naturalWidth;
            initImageHeight = img.naturalHeight;

            backImageTypeWheel.style.backgroundImage = "url('" + fileReader.result + "')";
            frontImageTypeWheel.style.backgroundImage = "url('" + fileReader.result + "')";

            backImageTypeArrows.style.backgroundImage = "url('" + fileReader.result + "')";
            frontImageTypeArrows.style.backgroundImage = "url('" + fileReader.result + "')";

            let dw = initImageWidth / Math.min(window.innerWidth, 900);
            let dh = initImageHeight / Math.min(window.innerHeight - 200, 600);

            let dRes = Math.min(dw, dh);

            backImageTypeArea.style.width = (initImageWidth / dRes - 88) + "px";
            backImageTypeArea.style.height = (initImageHeight / dRes - 88) + "px";
            backImageTypeArea.style.backgroundSize = (initImageWidth / dRes - 88) + "px " + (initImageHeight / dRes - 88) + "px";
            backImageTypeArea.style.backgroundImage = "url('" + fileReader.result + "')";

            let viewportImageOffset = backImageTypeArea.getBoundingClientRect();
            areaLeft = 50;
            areaTop = 50;
            areaRight = viewportImageOffset.width - 300;
            areaBot = viewportImageOffset.height - 300;

            imagePosY = 0;
            imagePosX = 0;
            zoom = (resizeWindowWidth * Math.max((resizeWindowWidth / targetWidth), 1)) / Math.min(initImageWidth, initImageHeight);

            zoomDelta = 0;
            imageWidth = initImageWidth * zoom;
            imageHeight = initImageHeight * zoom;

            setImagesWidth(imageWidth);
            setImagesPosition("50%", "50%")
        }
        const updateImageAfterWindowResize = () => {
            if (window.innerWidth <= 720) {
                zoomVariant = "area";
                setEnableZoomVariant();
            }
            getImageData();
        }
        window.removeEventListener("resize", updateImageAfterWindowResize);

        const setEnableZoomVariant = () => {
            for (let el of resizeModuleContainers) {
                const type = el.dataset.type;
                if (type === zoomVariant) {
                    document.querySelector(".resize-module-container__body_type_" + zoomVariant).style.display = "flex";
                    document.querySelector(".zoom-variant-item_type_" + zoomVariant).style.backgroundColor = "var(--color-active)";
                } else {
                    document.querySelector(".resize-module-container__body_type_" + type).style.display = "none";
                    document.querySelector(".zoom-variant-item_type_" + type).style.backgroundColor = "transparent";
                }
            }
        }
        const setDifferentScaleTypesMethod = () => {
            for (let el of resizeModuleContainers) {
                const type = el.dataset.type
                document.querySelector(".zoom-variant-item_type_" + type)
                    .addEventListener("click", () => {
                        zoomVariant = type;
                        setEnableZoomVariant();
                    });
            }
        }
        setDifferentScaleTypesMethod();

        const saveUpdatedImageEvent = () => {
            const cropButton = document.querySelector(".resize-module-container__button_type-confirm");
            const canvas = document.querySelector('.canvas_crop');

            cropButton.addEventListener("click", () => {
                if (zoomVariant === "area") {
                    let viewportImageOffset = backImageTypeArea.getBoundingClientRect();

                    const dx = initImageWidth / viewportImageOffset.width;
                    const dy = initImageHeight / viewportImageOffset.height;

                    canvas.width = targetWidth * dx;
                    canvas.height = targetHeight * dy;
                    let context = canvas.getContext('2d');

                    context.drawImage(img, areaLeft * dx, areaTop * dy, initImageWidth - areaLeft * dx - areaRight * dx, initImageHeight - areaTop * dy - areaBot * dy, 0, 0, canvas.width, canvas.height);
                } else {
                    const dx = Math.min(initImageWidth / resizeWindowWidth, initImageHeight / resizeWindowHeight);
                    canvas.width = targetWidth * dx;
                    canvas.height = targetHeight * dx;
                    let context = canvas.getContext('2d');

                    const sourceX = initImageWidth / 2 - imagePosX / zoom - (resizeWindowWidth / 2) / zoom;
                    const sourceY = initImageHeight / 2 - imagePosY / zoom - (resizeWindowHeight / 2) / zoom;

                    const sourceWidth = resizeWindowWidth / zoom;
                    const sourceHeight = resizeWindowHeight / zoom;
                    context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
                }
                canvas.toBlob(function (blob) {
                    dt.items.clear();
                    dt.items.add(new File([blob], 'updatedFile.png', {type: "image/png"}));
                    currentFileInput.files = dt.files;
                    imageRefactorPage.classList.add('resize-module_disable')
                });
            });
        }
        saveUpdatedImageEvent();
        const denyUpdatedImageEvent = () => {
            window.removeEventListener("resize", updateImageAfterWindowResize);

            const removeUpdates = () => {
                imageRefactorPage.classList.add('resize-module_disable')
            }

            document.querySelector(".resize-module-container__button_type-deny").addEventListener("click", removeUpdates);
            document.querySelector(".resize-module-container__close-button").addEventListener("click", removeUpdates);
        }
        denyUpdatedImageEvent();
    }
    const setImagesWidth = (width) => {
        let viewportImageOffset = backImageTypeArea.getBoundingClientRect();

        backImageTypeWheel.style.backgroundSize = width + "px";
        frontImageTypeWheel.style.backgroundSize = width + "px";

        backImageTypeArrows.style.backgroundSize = width + "px";
        frontImageTypeArrows.style.backgroundSize = width + "px";

        frontImageTypeArea.style.height = (viewportImageOffset.height - areaTop - areaBot) + "px";
        frontImageTypeArea.style.width = (viewportImageOffset.width - areaLeft - areaRight) + "px";

        document.querySelector(".resize-module-container__background_pos_t").style.height = areaTop + "px";
        document.querySelector(".resize-module-container__background_pos_b").style.height = areaBot + "px";

        document.querySelector(".resize-module-container__background_pos_l").style.top = areaTop + "px";
        document.querySelector(".resize-module-container__background_pos_l").style.bottom = areaBot + "px";
        document.querySelector(".resize-module-container__background_pos_l").style.width = areaLeft + "px";

        document.querySelector(".resize-module-container__background_pos_r").style.top = areaTop + "px";
        document.querySelector(".resize-module-container__background_pos_r").style.bottom = areaBot + "px";
        document.querySelector(".resize-module-container__background_pos_r").style.width = areaRight + "px";
    }
    const setImagesPosition = (posX, posY) => {
        backImageTypeWheel.style.backgroundPosition = posX + " " + posY;
        frontImageTypeWheel.style.backgroundPosition = posX + " " + posY;

        backImageTypeArrows.style.backgroundPosition = posX + " " + posY;
        frontImageTypeArrows.style.backgroundPosition = posX + " " + posY;

        frontImageTypeArea.style.backgroundPosition = -areaLeft + "px " + -areaTop + "px";
        frontImageTypeArea.style.left = areaLeft + "px";
        frontImageTypeArea.style.right = areaRight + "px";
        frontImageTypeArea.style.top = areaTop + "px";
        frontImageTypeArea.style.bottom = areaBot + "px";
    }

    imageInputChangeMethod();
    imageRefactorMethod();
})();


