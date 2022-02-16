const videoContainer = document.querySelector("#video-container");
const form = document.getElementById("commentForm");
const videoComments = document.querySelector(".video_comments ul");
const videoCommentsli = videoComments.getElementsByTagName("li");

const handleDelete = async (e) => {
    const li = e.target.parentElement;
    const { id } = li.dataset;
    const response = await fetch(`/api/videos/${videoContainer.dataset.id}/comment/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id
        }),
    });
    if (response.status === 200) {
        li.remove();
    }
}

const addComment = (text, commentId) => {
    const newComment = document.createElement("li");
    newComment.dataset.id = commentId;
    newComment.className = "video_comment"
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    span.innerText = text;
    span2.innerText = "X";
    span2.className = "video_comment-delete";
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
    span2.addEventListener("click", handleDelete);
}

const handleSubmit = async (e) => {
    e.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = String(textarea.value).trim();
    const video = videoContainer.dataset.id;
    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${video}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({text}),
    });
    
    if (response.status === 201) {
        textarea.value = "";
        const {newComment} = await response.json();
        addComment(text, newComment);
    }
}

if (form) {
    form.addEventListener("submit", handleSubmit);
}

for (let i = 0; i < videoCommentsli.length; i++) {
    const button = videoCommentsli[i].querySelector(".video_comment-delete");
    button.addEventListener("click", handleDelete);
}