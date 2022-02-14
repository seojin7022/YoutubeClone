const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const currentTime = document.getElementById("current-time");
const totalTime = document.getElementById("total-time");
const volume = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("full-screen");
const videoContainer = document.getElementById("video-container");
const videoControls = document.getElementById("video-controls");
const videoMixinThumb = document.querySelector(".video-mixin_thumb");

let volumeValue = localStorage.getItem("volumeValue");
let controlsTimeout;
let controlsMovementTimeout;
let mouseenter = false;
volume.value = volumeValue;

const handlePlay = (e) => {
    controlsMovementTimeout = null;
    handleMouseMove();
    if (video.paused) {
        video.play();

    } else {
        video.pause();
    }
    playBtn.querySelector("i").className = video.paused ? "fas fa-play" : "fas fa-pause";
}

const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.querySelector("i").className = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volume.value = video.muted ? 0 : volumeValue;
}

const handleVolumeChange = (event) => {
    const value = volume.value;
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    localStorage.setItem("volumeValue", volumeValue);
    video.volume = value;
    const process = (volumeValue / 1) * 100;
    volume.style.background = `linear-gradient(to right, white 0%, white ${process}%, rgba(255, 255, 255, 0.6) ${process}%, rgba(255, 255, 255, 0.6) 100%)`;
}

const process = (volumeValue / 1) * 100;
    volume.style.background = `linear-gradient(to right, white 0%, white ${process}%, rgba(255, 255, 255, 0.6) ${process}%, rgba(255, 255, 255, 0.6) 100%)`;

const formatTime = (seconds) => {
    let finish = undefined;
    if (seconds > (60 * 60)) {
        const hour = String(Math.floor(seconds / (60 * 60)));
        const min = String(Math.floor(seconds / 60));
        seconds = String(seconds).padStart(2, "0");
        finish = `${hour}:${min}:${seconds}`;
    } else if (seconds > 60) {
        const min = Math.floor(seconds / 60);
        seconds = String(seconds).padStart(2, "0");
        finish = `${min}:${seconds}`;
    } else {
        seconds = String(seconds).padStart(2, "0");
        finish = `0:${seconds}`;
    }
    return finish;
};
const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
}

const handleTimeUpdate = (e) => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = video.currentTime;
    const process = (timeline.value / timeline.max) * 100;
    timeline.style.background = `linear-gradient(to right, red 0%, red ${process}%, rgba(255, 255, 255, 0.6) ${process}%, rgba(255, 255, 255, 0.6) 100%)`;
}

const handleTimelineChange = (e) => {
    video.currentTime = timeline.value;
    const process = (timeline.value / timeline.max) * 100;
    timeline.style.background = `linear-gradient(to right, red 0%, red ${process}%, rgba(255, 255, 255, 0.6) ${process}%, rgba(255, 255, 255, 0.6) 100%)`;
}

const handleVideoEnded = () => {
    playBtn.querySelector("i").className = "fas fa-play";
    const baseUrl = `/api/videos/${videoContainer.dataset.id}/view?`
    const config = {
        playing: !video.paused,
    };
    const finalUrl = baseUrl + new URLSearchParams(config);
    fetch(finalUrl, {
        method: "POST",
    });
}

const handleFullScreen = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        fullScreenBtn.querySelector("i").className = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenBtn.querySelector("i").className = "fas fa-compress";
    }
    
}

const hideControls = () => {
    if (mouseenter) return;
    videoControls.classList.remove("showing");
}
const handleMouseMove = () => {
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
}

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 0);
}

handleLoadedMetadata();
handleTimeUpdate();

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volume.addEventListener("input", handleVolumeChange);
timeline.addEventListener("input", handleTimelineChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleVideoEnded);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
videoControls.addEventListener("mouseenter", () => {
    mouseenter = true;
});
videoControls.addEventListener("mouseleave", () => {
    mouseenter = false;
});
video.addEventListener("click", handlePlay);