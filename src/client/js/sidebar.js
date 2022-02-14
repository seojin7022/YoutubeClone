const triggerBtn = document.getElementById("triggerBtn");
const sidenav = document.getElementById("mySidenav");
let a = sidenav.getElementsByTagName("a");
const home = sidenav.querySelector("a:first-child");

let cntBtn = localStorage.getItem("cntBtn") ? localStorage.getItem("cntBtn") : home;
console.log(cntBtn);
for (let i = 0; i < a.length; a++) {
    const newA = a[i];
    newA.addEventListener("click", function (e) {
        e.preventDefault();
        cntBtn = newA;
        localStorage.setItem("cntBtn", cntBtn);
        newA.click();
    });

    if (cntBtn === newA) {
        newA.style.backgroundColor = "#e5e5e5";
    }
}

let isOpen = false;

function openNav() {
    if (isOpen) {
        isOpen = false;
        sidenav.style.width = "0";
    } else {
        isOpen = true;
        sidenav.style.width = "250px";
    }
}

openNav();

triggerBtn.addEventListener("click", openNav);