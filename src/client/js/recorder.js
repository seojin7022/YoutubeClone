import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const video = document.getElementById("preview");
const recordContainer = document.querySelector(".recorder-container");
const recordBtn = document.getElementById("recordBtn");
const loading = document.getElementById("loading");
let stream = undefined;
let recorder = undefined;
let videoFile = undefined;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg"
}

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 960, height: 540 } });
    loading.classList.add("hidden");
    recordContainer.classList.remove("hidden");
    video.srcObject = stream;
    video.play();
}

const handleRecord = () => {
    recordBtn.innerText = "녹화 중지";
    recordBtn.removeEventListener("click", handleRecord);
    recordBtn.addEventListener("click", handleStop);
    recordBtn.style.background = "#FF0075";

    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        videoFile = URL.createObjectURL(e.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    };
    recorder.start();
    
}
const handleStop = () => {
    recordBtn.innerText = "동영상 다운로드";
    recordBtn.removeEventListener("click", handleStop);
    recordBtn.addEventListener("click", handleDownload);
    recorder.stop();
    recordBtn.style.background = "#172774";
}

const handleDownload = async () => {
    recordBtn.removeEventListener("click", handleDownload);
    recordBtn.innerText = "Transcoding...";
    recordBtn.disabled = true;
    recordBtn.style.background = "gray";
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
    await ffmpeg.run("-i", files.input, "-r", "60", files.output);
    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);

    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbFile = ffmpeg.FS("readFile", files.thumb);
    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url, "MyRecording.mp4");
    downloadFile(thumbUrl, "thumbnail.jpg");

    
    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);
    
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(videoFile);

    recordBtn.disabled = false;
    recordBtn.innerText = "동영상 녹화";
    recordBtn.style.background = "#77D970";
    video.srcObject = stream;
    recordBtn.addEventListener("click", handleRecord);
}

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
}

init();
recordBtn.addEventListener("click", handleRecord);