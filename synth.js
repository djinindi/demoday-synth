const audioContext = new AudioContext();
const canvas = document.getElementById('synth-pad');
const context = canvas.getContext('2d');
const frequencyLabel = document.getElementById('frequency');
const volumeLabel = document.getElementById('volume');
const waveformElement = document.getElementById('shape');
const lowNote = 220;
const highNote = 880;
let isDrawing = false;
let oscillator, amp, filter;
let lastMouse = {x: 0, y: 0};
let mouse = {x: 0, y: 0};

canvas.addEventListener('mousedown', this.playSound);
canvas.addEventListener('mouseup', this.stopSound);
document.addEventListener('mouseleave', this.stopSound);

canvas.addEventListener('mousemove', (event) => {
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    mouse.x = event.x - canvas.offsetLeft;
    mouse.y = event.y - canvas.offsetTop;
});

function clearPaint() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function playSound(event) {
    isDrawing = true;
    oscillator = audioContext.createOscillator();
    amp = audioContext.createGain();
    oscillator.type = waveformElement.value;
    amp.connect(audioContext.destination);
    oscillator.connect(amp);

    updateFrequency(event);

    oscillator.start(0);

    canvas.addEventListener('mousemove', (event) => {
        updateFrequency(event);
    });
    canvas.addEventListener('mouseout', (event) => {
        stopSound(event);
    });
}

function stopSound(event) {
    isDrawing = false;
    oscillator.stop(0);
    clearPaint();
    canvas.removeEventListener('mousemove', (event) => {
        updateFrequency(event)
    });
    canvas.removeEventListener('mouseout', (event) => {
        stopSound(event)
    });
}

function updateFrequency(event) {
    if (event.type == 'mousedown' || event.type == 'mousemove') {
        calculateFrequency(event.x, event.y);
    }
    if(!isDrawing) {
        return;
    }
    const radius = 5;
    let i = Math.floor(Math.random() * 6) + 1;
    let j = Math.floor(Math.random() * 6) + 1;
    let k = Math.floor(Math.random() * 6) + 1;
    const r = Math.floor(255 - 42.5 * i);
    const g = Math.floor(255 - 42.5 * j);
    const b = Math.floor(255 - 42.5 * k);
    context.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`
    context.lineWidth = 15;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(lastMouse.x, lastMouse.y);
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
}

function calculateFrequency(x, y) {
    let noteValue = calculateNote(x);
    let volumeValue = calculateVolume(y);

    oscillator.frequency.value = noteValue;
    amp.gain.value = volumeValue;
    frequencyLabel.innerHTML = Math.floor(noteValue) + ' Hz';
    volumeLabel.innerHTML = Math.floor(volumeValue * 100) + '%';
}

function calculateNote(x) {
    let noteDifference = highNote - lowNote;
    let noteOffset = (noteDifference / canvas.offsetWidth) * (x - canvas.offsetLeft);
    return lowNote + noteOffset;
}

function calculateVolume(y) {
    return 1 - (((100 / canvas.offsetHeight) * (y - canvas.offsetTop)) / 100);
}