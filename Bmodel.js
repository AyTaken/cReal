// ho ritrovato il pen dove si era fatta la drum machine a scorrimento automatico.
// Te l'ho messo qui magari ti poteva servire per l'app.js


// MODEL
var model = Array(key_number).fill(false)
var previous_model = Array(key_number).fill(false)
var tick = 0

// INTERNAL STATE
var keys = document.querySelectorAll(".key");

// CONTROLLER
function click_assignment(key, index) {
    key.onclick = function() {
        model[index] = !model[index];
        render()
    }
}

keys.forEach(click_assignment);

function reset_all() {
    previous_model = model
    model = Array(key_number).fill(false)
    render()
}

reset.onclick = reset_all;

function select_all() {
    previous_model = model
    model = Array(key_number).fill(true)
    render()
}

select.onclick = select_all;

function restore_all() {
    model = previous_model
    render()
}

restore.onclick = restore_all;

function next_tick() {
    tick = (tick + 1) % key_number
    render()
}

setInterval(next_tick, 1000)

render()

// Anche qui ci sono dei metodi con fuzionalita' che ci potrebbero scoprire per 
// la struttare app.js-TonePlayer.js

audioCtx = new AudioContext()
var data = {};

function getData(url) {
    console.log("starting")
    var request = new XMLHttpRequest();

    request.open('GET', url, true);

    request.responseType = 'arraybuffer';

    request.onload = function() {
        var audioData = request.response;
        console.log("loadaed")
        audioCtx.decodeAudioData(audioData, function(buffer) {
                data.buffer = buffer;
                console.log("loaded", data)

            },

            function(e) { console.log("Error with decoding audio data" + e.err); });

    }

    request.send();
    console.log("laoding")
}

getData("https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg")

function play() {
    source = audioCtx.createBufferSource();
    source.buffer = data.buffer;
    source.connect(audioCtx.destination);
    source.start();
}

var pads = [document.querySelector("#pad1"),
    document.querySelector("#pad2"),
    document.querySelector("#pad3"),
    document.querySelector("#pad4")
]

var shouldPlay = [false, false, false, false];

function hl(pad) {
    pads.forEach(function(p) { p.classList.remove("hl") })
    pads[pad].classList.add("hl")

}

var count = 0;
setInterval(function() {
    if (shouldPlay[count % 4]) { play() }
    hl(count++ % 4);

}, 400)

function sw(p) {
    shouldPlay[p] = !shouldPlay[p]
    pads[p].classList.toggle("tbp")
}