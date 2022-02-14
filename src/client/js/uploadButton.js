const uploadButton = document.querySelector(".upload-button");
const uploadContainer = document.querySelector(".upload-container");

let isClicked = false;

uploadButton.addEventListener("click", function () {
    if (isClicked) {
        isClicked = false;
        uploadContainer.classList.add("hidden");
    } else {
        isClicked = true;
        uploadContainer.classList.remove("hidden");
    }
})