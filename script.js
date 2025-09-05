// ===== Scratch Card =====
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const poemContent = document.querySelector('.poem-content');
const container = document.querySelector('.scratch-container');

function resizeCanvas() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#b65a18';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

let isDrawing = false;

// Adjust radius for mobile
function getScratchRadius() {
    return window.innerWidth <= 768 ? 40 : 25;
}

function getXY(e) {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (e.touches) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }
    return { x, y };
}

function startDraw(e) { e.preventDefault(); isDrawing = true; }
function endDraw(e) { e.preventDefault(); isDrawing = false; checkReveal(); }
function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getXY(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, getScratchRadius(), 0, Math.PI * 2);
    ctx.fill();
}

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', startDraw);
canvas.addEventListener('touchend', endDraw);
canvas.addEventListener('touchmove', draw);

function checkReveal() {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 128) transparent++;
    }
    const percent = (transparent / (canvas.width * canvas.height)) * 100;
    // lower threshold for mobile
    const revealPercent = window.innerWidth <= 768 ? 5 : 10;
    if (percent > revealPercent) {
        poemContent.style.opacity = 1;
        canvas.style.transition = 'opacity 1s ease';
        canvas.style.opacity = 0;
        setTimeout(() => { canvas.style.display = 'none'; }, 1000);
    }
}

// ===== Memory Lane =====
const memoryBtn = document.getElementById('memoryBtn');
const memoryLane = document.getElementById('memoryLane');
const closeBtn = memoryLane.querySelector('.close-btn');

memoryBtn.addEventListener('click', () => { memoryLane.style.display = 'flex'; });
closeBtn.addEventListener('click', () => { memoryLane.style.display = 'none'; });
memoryLane.addEventListener('click', e => { if (e.target === memoryLane) memoryLane.style.display = 'none'; });
