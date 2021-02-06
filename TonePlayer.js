const Tone = require('tone');
const App = require('./app.js')
const Chord = require('./chords.js');
let songs = require('./test.json');

let currentSong;
let nextSong;
let connectSong;
//Lo stato può essere play, stop, pause 
let state = "stop"
let measureNumber = 0
let loop = true


exports.setCurrentSong = function(song) {
    currentSong = song;
    song.forEach(element => {
        for (let index = 0; index < element.length; index++) {
            console.log(Chord.getNotesChord(element[index]))
        }
    });
}

exports.setState = function(appState) {
    state = appState
    if (state == "play")
        play()
}

exports.setNextAndConnect = function(nSong, cSong) {
    nextSong = nSong
    connectSong = cSong
    loop = false
}

// Scheletro
exports.loopCurrentSong = function(measure, loop, song) {
    currentSong = song
    currentMeasure = measure;
    if (loop == true) {
        if (currentMeasure == song.music.measures.length) {
            currentMeasure = 0
        }
    }
    return loop;
}

exports.loopMeasures = function(time, chord, nLoops, nMeasures) {
    var loopChords = new Tone.Event(function(time, chord, nLoops, nMeasures) {
        //the chord as well as the exact time of the event
        //are passed in as arguments to the callback function
    }, chord);
    //start the chord at the beginning of the transport timeline
    loopChords.start();
    //loop it every measure for 8 measures
    loopChords.loop = nLoops; // int
    loopChords.loopEnd = nMeasures; // "1m" one measure
}

exports.setNextSong = function(song) {
    nextSong = song;
}

exports.changeSong = function(song_1, song_2) {
    for (let index = 0; index < song_1.music.measures.length; index++) {
        if (index == song_1.music.measures.length) {
            song_2.bpm = song_1.bpm
            song_1 = song_2;
        }
    }
}

exports.bpmModulation = function(song) {
    let bpmMod = new Tone.Transport()
    Tone.Transport.bpm.value = song.bpm;
    //ramp the bpm to the right one over 12 seconds
    bpmMatch = songs.find(song.title).bpm;
    Tone.Transport.bpm.rampTo(bpmMatch, 12);
    // now I have to find a way to make follow the Tone.Transport bpm change to the original song.
}

exports.chooseNextSong = function(song) {

}

exports.setConnectSong = function(song, type) {
    connectSong = song;
}


function play(song) {
    firstMeasure = song.music.measures[measureNumber]
    for (i = 0; i < song.music.measures.length; i++) {
        App.setCurrentMeasure(measureNumber)
        measureNumber++
        /**
         * if (check sullo stato: pause, stop)
         *      se pause salva measureNumber ed esce dal for
         *      se stop meausreNumber = 0 ed esce dal for
         */
        /**
         * if (fine song: measureNumber == song.music.measures.length)
         *      if (loop == true)
         *          measureNumber = 0
         *      else (loop == false) {
         *          if (connectSong)
         *              playConnectSong() --> "setCurrentMeasureConnect()"
         *        
         *          currentSong = nextSong
         *          measureNumber = 0
         *          
         *      }
         *          
         *          
         */
        
    }

}

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

const sampler = new Tone.Sampler({
    urls: {
        "A2": "./piano_notes/A.wav",
        "A#2": "./piano_notes/A#.wav",
        "B2": "./piano_notes/B.wav",
        "C3": "./piano_notes/C.wav",
        "C#3": "./piano_notes/C#.wav",
        "D4": "./piano_notes/D.wav",
        "D#3": "./piano_notes/D#.wav",
        "E3": "./piano_notes/E.wav",
        "F4": "./piano_notes/F.wav",
        "F#3": "./piano_notes/F#.wav",
        "G3": "./piano_notes/G.wav",
        "G#3": "./piano_notes/G#.wav",
    },
    release: 1,
    //baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

//Tone.loaded().then(() => {
//sampler.triggerAttackRelease(Chord.getNotesChord(currentSong[0][0]), "4n");
//  sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 4);
//})


//play a middle 'C' for the duration of an 8th note
Tone.start()

const resumeBtn = document.getElementById("resumeButton");
resumeBtn.onclick = function() {

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
}, "8n");







//TEST FATTI INSOMMA
/* const Tone = require('tone');
Tone.start();
//create a synth and connect it to the main output (your speakers)
const synth = new Tone.PolySynth().toDestination();
synth.volume.value = -6

//play a middle 'C' for the duration of an 8th note

let button = document.getElementById("btn")
button.onclick = function() {
    Tone.Transport.start()
}

let chords = [[["C3", "E4", "G3"],["G3", "B4", "E3"]], [["G3", "B4", "E3"]], [["F3", "A4", "C3"]], [["A3", "C4", "E3"]]]
let temp = []
for (let i = 0; i < chords.length; i++) {
    temp.push(i)
}

Tone.Transport.bpm.value = 120
const seq = new Tone.Sequence((time, index) => {
    let duration = 4 / chords[index].length
    let durString = duration + "n"
    let temp2 = []
    for (let i = 0; i < chords[index].length; i++) {
        temp2.push(i)      
    }
    
    const seq2 = new Tone.Sequence((time2, id2) => {
        synth.triggerAttackRelease(chords[index][id2], durString);
        console.log(time, time2)
        // subdivisions are given as subarrays
    }, temp2, "4n").start(0)


}, temp, "1m").start(0);*/