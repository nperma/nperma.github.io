document.addEventListener("DOMContentLoaded", function () {
    var betons = document.querySelectorAll(".beton");
    betons.forEach(function (beton) {
        beton.addEventListener("click", function () {
            var loadingElement = document.querySelector(".loading");
            if (loadingElement) {
                loadingElement.style.opacity = "0";
                setTimeout(() => {
                    loadingElement.style.opacity = "1";
                }, 10000);
            }
        });
    });
});

const a = document.getElementById("manifestGeneratorMCBE");
const b = document.getElementById("MaiYutub");
const c = document.getElementById("MaiGrup");

a.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href =
            "https://nperma.github.io/site/manifest-generator.html";
    }, 1000);
});

b.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href =
            "https://youtube.com/@Nperma?si=tDClozgSYfDis8WR";
    }, 1000);
});

c.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "https://chat.whatsapp.com/DvLA5dm50I44OY9WMejoTm";
    }, 1000);
});
