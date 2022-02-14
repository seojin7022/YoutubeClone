import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const thumb = document.querySelector("#thumb");

console.log(thumb.dataset.path);

const extension = String(thumb.dataset.path.mimetype).split("/")[1];
const videoUrl = URL.createObjectURL(new Blob(thumb.dataset.path));

const files = {
    input: "video." + extension,
    thumb: "thumbnail.jpg",
}

const loadThumb = async () => {

    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
    console.log(videoUrl);
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoUrl));
    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);
    const thumbFile = ffmpeg.FS("readFile", files.thumb);
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
    const thumbUrl = URL.createObjectURL(thumbBlob);
    ffmpeg.FS("unlink", files.thumb);
    URL.revokeObjectURL(thumbUrl);
}

loadThumb();