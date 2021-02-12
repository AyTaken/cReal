const Tone = require('tone');
const Controller = require('./app.js')
const Chord = require('./chords.js');

//polysynth temporaneo
const synth = new Tone.PolySynth().toDestination();
synth.volume.value = -12

//Tone.Trasport options
Tone.context.latencyHint = "interactive"


let currentSong = {};
let partiture
let part

let nextSong = {};
let connectSong = {};
//Lo stato può essere play, stop, pause 
let state = "stop"
let currentMeasure = 0
let loop = true


exports.setCurrentSong = function (song) {
    Object.assign(currentSong, song)
    partiture = generatePartiture()
}

exports.setNextSong = function (song) {
    Object.assign(nextSong, song)
}

exports.setConnectSong = function (song) {
    Object.assign(connectSong, song)
}


//DA SISTEMARe
/*console.log(currentSong)
console.log(nextSong)
console.log(connectSong)*/

let sliderBpm = document.getElementById("sliderTempo")
sliderBpm.onchange = function () {
    currentSong.bpm = sliderBpm.value
    Tone.Transport.bpm.value = currentSong.bpm

    for (let i = 0; i < partiture.length; i++) {
        partiture[i].duration = Tone.Time({"4n": partiture[i].subdiv}).valueOf()
    }
}

/*function play() {
    Tone.Transport.bpm.value = currentSong.bpm
    Tone.Transport.start();
    let chords = currentSong.music.measures

    //Creazione temp per scheduling sequence
    let temp = []
    for (let i = 0; i < chords.length; i++) {
        if (chords[i].length > 1) {
            let temp2 = []
            for (let j = 0; j < chords[i].length; j++) {
                temp2.push(j)
        }
        temp.push(temp2)
    
        } else {
            temp.push(0)
        } 
    }

    //firstMeasure = currentSong.music.measures[measureNumber]
    pausedMeasure = 0;
    //paused = false;
    const seq = new Tone.Sequence((time, index) => {
        let duration = 4 / chords[index].length
        let durString = duration + "n"
        let temp2 = []
        for (let i = 0; i < chords[index].length; i++) {
            temp2.push(i)
        }
        const seq2 = new Tone.Sequence((time2, id2) => {
            if (state == "play") {
                if (pausedMeasure != 0)
                    index = pausedMeasure
                sampler.triggerAttackRelease(chords[index][id2], durString);
                console.log(time, time2)
                measureNumber = chords[index]
                App.setCurrentMeasure(measureNumber)
                // subdivisions are given as subarrays
            } else if (state = "pause") {
                paused = true
                pausedMeasure = measureNumber
                Tone.Transport.stop()
            }
            if (state = "stop") {
                pausedMeasure = 0
                measureNumber = 0
                Tone.Transport.stop()
            }
            if (measureNumber == currentSong.music.measures.length) {
                measureNumber = 0
                if (loop == false) {
                    if (connectSong)
                        //playConnectSong() -- > "setCurrentMeasureConnect()"
                        currentSong = nextSong
                }
            }
        }, temp2, "4n").start(0)
    }, temp, "1m").start(0);
}*/

//Funzione per generare l'oggetto da dare a ToneEvent.Part
function generatePartiture() {
    Tone.Transport.bpm.value = sliderBpm.value
    let timeSignature = extractTimeSignature(currentSong.music.timeSignature)
    Tone.Transport.timeSignature = timeSignature
    let chords = currentSong.music.measures

    let partitureTemp = []

    //CALCOLO DURATE
    for (let i = 0; i < chords.length; i++) {
        let duration = []

        for (let j = 0; j < chords[i].length; j++) {
            duration.push(Math.floor(timeSignature / chords[i].length))
        }
        if (timeSignature % chords[i].length != 0) {
            let sum = 0
            for (let j = 1; j < duration.length; j++)
                sum = sum + duration[j]
            duration[0] = timeSignature - sum
        }


        //CREAZIONE PARTITURA
        let count = 0
        for (let j = 0; j < chords[i].length; j++) {
            let temp = { time: " ", measure: " ", notes: " ", duration: " " , subdiv: []}
            temp.measure = i
            if (j > 0)
                count = count + duration[j - 1]
            temp.time = i + ":" + count
            temp.notes = Chord.getNotesChord(chords[i][j])
            temp.duration = Tone.Time({ "4n": duration[j] }).valueOf() * 0.9
            temp.subdiv = duration[j]
            partitureTemp.push(temp)
        }
    }

    part = new Tone.Part(((time, chord) => {
        // the notes given as the second element in the array
        // will be passed in as the second argument
        synth.triggerAttackRelease(chord.notes, chord.duration, time);
        if (currentMeasure != chord.measure) {
            currentMeasure = chord.measure
            Controller.setCurrentMeasure(currentMeasure)
        }
    }), partitureTemp);
    part.humanize = true
    part.loop = true
    part.loopStart = partitureTemp[0].time
    part.loopEnd = (partitureTemp[partitureTemp.length - 1].measure + ":" + timeSignature)

    return partitureTemp
}

function play() {
    Tone.start()
    part.start()
    Tone.Transport.start()
}

function stop() {
    Tone.Transport.stop()
    Controller.setCurrentMeasure(0)
}

function pause() {
    Tone.Transport.pause()
}

// Chiamare la next song solo in play?


exports.setState = function (appState) {
    state = appState
    switch (state) {
        case "play":
            play()
            break;
        case "stop":
            stop()
            break;
        case "pause":
            pause()
            break;
        default:
            break;
    }
}

// Non credo ci sia piu il bisogno...
/*exports.setNextAndConnect = function (nSong, cSong) {
    nextSong = nSong
    connectSong = cSong
    loop = false
 
}*/

// Scheletro
exports.loopCurrentSong = function (loop, song) {
    currentSong = song
    currentMeasure = song.music.measure;
    if (loop == true) {
        if (currentMeasure == song.music.measures.length) {
            currentMeasure = 0
        }
    }
    return loop;
}

exports.loopMeasures = function (time, chord, nLoops, nMeasures) {
    var loopChords = new Tone.Event(function (time, chord, nLoops, nMeasures) {
        //the chord as well as the exact time of the event
        //are passed in as arguments to the callback function
    }, chord);
    //start the chord at the beginning of the transport timeline
    loopChords.start();
    //loop it every measure for 8 measures
    loopChords.loop = nLoops; // int
    loopChords.loopEnd = nMeasures; // "1m" one measure
}

/*exports.setNextSong = function (song) {
    nextSong = song;
}*/

exports.changeSong = function (song_1, song_2) {
    for (let index = 0; index < song_1.music.measures.length; index++) {
        if (index == song_1.music.measures.length) {
            song_2.bpm = song_1.bpm
            song_1 = song_2;
        }
    }
}

exports.bpmModulation = function (song) {
    let bpmMod = new Tone.Transport()
    Tone.Transport.bpm.value = song.bpm;
    //ramp the bpm to the right one over 12 seconds
    bpmMatch = songs.find(song.title).bpm;
    Tone.Transport.bpm.rampTo(bpmMatch, 12);
    // now I have to find a way to make follow the Tone.Transport bpm change to the original song.
}

exports.chooseNextSong = function (song) {

}

/*exports.setConnectSong = function (song, type) {
    connectSong = song;
}*/


//DA ELIMINARE?
/*function play(song) {
    firstMeasure = song.music.measures[measureNumber]
    pausedMeasure = 0;
    paused = false;
    for (i = 0; i < song.music.measures.length && paused == false && state != "stop"; i++) {
        if (pausedMeasure != 0)
            measureNumber = pausedMeasure
        App.setCurrentMeasure(measureNumber)
        measureNumber++
        if (state = "pause") {
            paused = true
            pausedMeasure = measureNumber - 1
        }
        if (state = "stop") {
            pausedMeasure = 0
            measureNumber = 0
        }
        if (measureNumber == song.music.measures.length) {
            measureNumber = 0
            if (loop == false) {
                if (connectSong)
                    //playConnectSong() -- > "setCurrentMeasureConnect()"
                    currentSong = nextSong
            }
        }
    }
}*/

//var sampler = new Tone.Sampler({
//"A": "./piano_notes/A.wav",
//"A#": "./piano_notes/A#.wav",
//"B": "./piano_notes/B.wav",
//"C": "./piano_notes/C.wav",
//"C#": "./piano_notes/C#.wav",
//"D": "./piano_notes/D.wav",
//"D#": "./piano_notes/D#.wav",
//"E": "./piano_notes/E.wav",
//"F": "./piano_notes/F.wav",
// "F#": "./piano_notes/F#.wav",
// "G": "./piano_notes/G.wav",
//"G#": "./piano_notes/G#.wav",

//}, function() {
//sampler will repitch the closest sample
//sampler.triggerAttack("A")
//})

//create a synth and connect it to the main output (your speakers)
//const synth = new Tone.PolySynth().toDestination();

// passing an array of instrument names will load all the instruments listed returning a new object, 
// each property a tone.js object
////var instruments = SampleLibrary.load({
//instruments: ["piano", "harmonium", "violin"]
//});

// waits for instrument sound files to load from /samples/
//Tone.Buffer.on('load', function() {
// play instrument sound
//  instruments['piano'].toMaster();
//instruments['piano'].triggerAttack("A3");
//});

const sampler_2 = new Tone.Sampler({
    urls: {
        "A2": "./piano_notes/A.wav",
        //"A#2": "./piano_notes/A#.wav",
        //"B2": "./piano_notes/B.wav",
        //"C3": "./piano_notes/C.wav",
        //"C#3": "./piano_notes/C#.wav",
        //"D4": "./piano_notes/D.wav",
        //"D#3": "./piano_notes/D#.wav",
        //"E3": "./piano_notes/E.wav",
        //"F4": "./piano_notes/F.wav",
        //"F#3": "./piano_notes/F#.wav",
        //"G3": "./piano_notes/G.wav",
        //"G#3": "./piano_notes/G#.wav",
    },
    release: 1,
    //baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

const sampler = new Tone.Sampler({
    A2: './piano_notes/A.wav'
    //"A#2": "./piano_notes/A#.wav",
    //"B2": "./piano_notes/B.wav",
    //"C3": "./piano_notes/C.wav",
    //"C#3": "./piano_notes/C#.wav",
    //"D4": "./piano_notes/D.wav",
    //"D#3": "./piano_notes/D#.wav",
    //"E3": "./piano_notes/E.wav",
    //"F4": "./piano_notes/F.wav",
    //"F#3": "./piano_notes/F#.wav",
    //"G3": "./piano_notes/G.wav",
    //"G#3": "./piano_notes/G#.wav",
    //baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

//Tone.loaded().then(() => {
//sampler.triggerAttackRelease(Chord.getNotesChord(currentSong[0][0]), "4n");
//  sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 4);
//})


//play a middle 'C' for the duration of an 8th note
Tone.start()

/*const resumeBtn = document.getElementById("resumeButton");
resumeBtn.onclick = function () {
 
    Tone.loaded().then(() => {
        sampler.triggerAttackRelease(Chord.getNotesChord(currentSong[0][0]), "4n");
 
    })
    // synth.triggerAttackRelease(Chord.getNotesChord(currentSong[0][0]), "4n")
    //sampler.triggerAttackRelease(Chord.getNotesChord(currentSong[0][0]), "4n");
}
 
document.querySelector("tone-slider").addEventListener("input", (e) => Tone.Transport.bpm.value = parseFloat(e.target.value));
//document.querySelector("tone-step-sequencer").addEventListener("trigger", ({ detail }) => {
//keys.player(detail.row).start(detail.time, 0, "16t");
//});
 
Tone.Transport.scheduleRepeat((time) => {
    // use the callback time to schedule events
    osc.start(time).stop(time + 0.1);
}, "8n");*/


function extractTimeSignature(ts) {
    let ris = ts[0]
    if (ts == 12)
        ris = 6
    return ris
}