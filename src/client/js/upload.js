const uploadForm = document.querySelector("#upload-form");
const video = document.querySelector("#video");


video.addEventListener("change", function (event) {
    uploadForm.submit();
})