// ELEMENTI BASE
const cover = document.getElementById("cover");
const enterBtn = document.getElementById("enterBtn");
const startPage = document.getElementById("startPage");
const yesBtn = document.getElementById("yesBtn");
const fakeYesBtn = document.getElementById("fakeYesBtn");
const mainContent = document.getElementById("mainContent");
const bgMusic = document.getElementById("bgMusic");

// ------------------------------------------------------
// PLAYLIST AUTOMATICA
// ------------------------------------------------------
async function loadPlaylist() {
    const response = await fetch("audio/");
    const text = await response.text();
    const files = [...text.matchAll(/href="([^"]+\.mp3)"/g)].map(m => "audio/" + m[1]);
    return files;
}

let playlist = [];
let currentTrack = 0;

// FADE IN
function fadeIn(audio, duration = 3000) {
    audio.volume = 0;
    let step = 0.02;
    let interval = setInterval(() => {
        if (audio.volume < 0.4) audio.volume += step;
        else clearInterval(interval);
    }, duration / (0.4 / step));
}

// FADE OUT
function fadeOut(audio, callback, duration = 2000) {
    let step = 0.02;
    let interval = setInterval(() => {
        if (audio.volume > 0) audio.volume -= step;
        else {
            clearInterval(interval);
            audio.pause();
            if (callback) callback();
        }
    }, duration / (0.4 / step));
}

// CAMBIO CANZONE AUTOMATICO
bgMusic.addEventListener("ended", () => {
    currentTrack++;
    if (currentTrack < playlist.length) {
        bgMusic.src = playlist[currentTrack];
        bgMusic.play();
        fadeIn(bgMusic);
    }
});

// COPERTINA → PAGINA PULSANTI
enterBtn.addEventListener("click", () => {
    cover.remove();
    startPage.classList.remove("hidden");
});

// TASTO "SÌ" CHE SCAPPA
yesBtn.addEventListener("mouseover", () => {
    const x = Math.random() * 300 - 150;
    const y = Math.random() * 300 - 150;
    yesBtn.style.transform = `translate(${x}px, ${y}px)`;
});

// “NO MA FINGO DI SÌ” → MOSTRA ALBUM + MUSICA
fakeYesBtn.addEventListener("click", async () => {
    startPage.classList.add("hidden");
    mainContent.classList.remove("hidden");
    playlist = await loadPlaylist();
    if (playlist.length > 0) {
        bgMusic.src = playlist[0];
        bgMusic.play();
        fadeIn(bgMusic);
    }
});

// -----------------------------
// LETTERA NEL POPUP
// -----------------------------
let letterStarted = false;

function showLetter() {
    if (letterStarted) return;
    letterStarted = true;

    const text = `Sei quella parte di cui non sapevo di aver bisogno,
sei la persone più forte che io abbia mai conosciuto,mi hai salvato 
da quella che è la mia miserabile vita...e io te ne devo una.
Non importa se tu non mi vorrai affianco, non importa se mi dirai 
che riesci a fare tutto da sola, non importa se non siamo più le stesse
di tre anni fa...nulla di questo ha importanza, io ci sarò in qualsiasi 
situazione, e non mi importa se per te non sembrano parole vere...per me 
lo sono al 100%, io ti devo quello che sono ora, ti devo tutto quello che tu 
mi hai dato in questi anni senza nemmeno accorgertene, non solo un'amica ma una spalla..
una confidente, qualcuno da incolpare o da abbracciare...
Lo so che tu alle mere parole non credi...ma la mia è una promessa..e un dato di fatto.
E ti assicuro che io le promesse le mantengo, ancor di più verso chi tengo con tutto
il cuore perchè per me non sei solo un'amica..sei mia sorella   
Buon Compleanno piccola stella ❤️`;

    const popup = document.getElementById("letterPopup");
    const popupText = document.getElementById("popupText");
    const closePopup = document.getElementById("closePopup");

    popup.classList.remove("hidden");
    popupText.textContent = "";

    let i = 0;

    function type() {
        if (i < text.length) {
            popupText.textContent += text.charAt(i);
            i++;
            setTimeout(type, 40);
        }
    }

    type();

    closePopup.addEventListener("click", () => {
        popup.classList.add("hidden");
    }, { once: true });
}

// CLICK SULLA POLAROID DELLA LETTERA
const letterItem = document.querySelector(".letter-item");
if (letterItem) {
    letterItem.addEventListener("click", () => {
        fadeOut(bgMusic);
        showLetter();
    });
}
