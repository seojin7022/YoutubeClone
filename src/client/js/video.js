const video = document.querySelectorAll("video");

video.forEach(video => {
    video.addEventListener("mouseenter", () => {
        video.muted = true;
        video.play();
    });
    
    video.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
        console.log(video.currentTime);
    });

    video.addEventListener("ended", () => {
        video.currentTime = 0;
        fetch(`/api/videos/${video.dataset.id}/view`, {
            method: "POST",
        });
    })
});

