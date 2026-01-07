
/* Öffnet Modal */
function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = 'flex';
}

/* Stoppt Audio/Video in einem Modal*/
function stopMediaInModal(modal) {
    if (!modal) return;

    // Alle Audios stoppen
    modal.querySelectorAll('audio').forEach(a => {
        a.pause();
        a.currentTime = 0;
    });

    // Alle Videos stoppen
    modal.querySelectorAll('video').forEach(v => {
        v.pause();
        v.currentTime = 0;
    });

    // Play-Button für Video zurücksetzen (falls vorhanden)
    const playBtn = modal.querySelector('#play-pause');
    if (playBtn) playBtn.textContent = '▶ Play';

    // spezieller Audio-Button Modal 4
    if (typeof window.updateAudioBtn === 'function') {
        window.updateAudioBtn(false);
    }
}

// Schließt Modal
function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    stopMediaInModal(modal);
    modal.style.display = 'none';
}


/* Hotspots verbinden*/

const hotspotIds = [
 'hotspot1','hotspot2','hotspot3','hotspot4','hotspot5',
 'hotspot6','hotspot7','hotspot8','hotspot9','hotspot10','hotspot11',
 'hotspot12','hotspot13','hotspot14','hotspot15'
];

const clickedHotspots = new Set();

function setupHotspot(hotspotId, modalId) {
    const el = document.getElementById(hotspotId);
    if (!el) return;

    el.addEventListener('click', e => {

        // optionales aktives Icon
        const openSrc = el.dataset.openSrc;
        if (openSrc) el.src = openSrc;

        openModal(modalId);

        // Fortschrittslogik
        clickedHotspots.add(hotspotId);
        if (clickedHotspots.size === hotspotIds.length) {
            document.body.classList.add('all-hotspots-done');
        }

        e.stopPropagation();
    });
}

// automatisch modal1..modal11 verbinden
hotspotIds.forEach((id, index) => setupHotspot(id, `modal${index + 1}`));

/*--------------------------
  Slide Logig Modal 3
  ------------------------*/
  let currentIndex = 0;

function moveSlide(direction) {
    const slides = document.getElementById("slides");
    const total = slides.children.length;

    currentIndex = currentIndex + direction;

    if (currentIndex < 0) currentIndex = total - 1;
    if (currentIndex >= total) currentIndex = 0;

    const width = slides.children[0].clientWidth + 10; // Bildbreite + Abstand
    slides.style.transform = "translateX(" + (-currentIndex * width) + "px)";
}
/* -------------------------
   Audio Modal 4
--------------------------*/
(function () {
    const audio = document.getElementById('modal4-audio');
    const btn = document.getElementById('modal4-audio-btn');

    function updateAudioBtn(playing) {
        if (!btn) return;
        btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
        btn.textContent = playing ? '■ Stopp' : '▶ Vorlesen lassen';
    }

    // global für closeModal
    window.updateAudioBtn = updateAudioBtn;

    if (audio && btn) {
        btn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play()
                    .then(() => updateAudioBtn(true))
                    .catch(console.warn);
            } else {
                audio.pause();
                audio.currentTime = 0;
                updateAudioBtn(false);
            }
        });

        audio.addEventListener('ended', () => updateAudioBtn(false));
    }
})();


/* -------------------------
   Info-Dots – Tastaturzugang
--------------------------*/
document.querySelectorAll('.info-dot').forEach(dot => {
    dot.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            dot.style.transform = 'scale(1.25)';
            setTimeout(() => dot.style.transform = '', 350);
        }
    });
});


/* -------------------------
   Overlay-Klick schließt Modal
--------------------------*/
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal(overlay.id);
    });
});


/* -------------------------
   ESC schließt alle Modals
--------------------------*/
document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;

    document.querySelectorAll('.modal-overlay').forEach(modal => {
        stopMediaInModal(modal);
        modal.style.display = 'none';
    });
});


/* -------------------------
   Video-Steuerung – kurz & universal
--------------------------*/
document.querySelectorAll('.jump-video').forEach(video => {

    const container = video.closest('div'); // derselbe Block
    const playBtn = container.querySelector('.play-pause');
    const timeDisplay = container.querySelector('.time-display');

    // Sprung-Buttons im gleichen Container
    container.querySelectorAll('.jump-to').forEach(btn => {
        btn.addEventListener('click', () => {
            const sec = Number(btn.dataset.seconds);
            if (!isNaN(sec)) {
                video.currentTime = sec;
                video.play().catch(()=>{});
            }
        });
    });

});
