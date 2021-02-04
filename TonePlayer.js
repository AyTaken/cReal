const Tone = require('tone');
const App = require('./app.js')
const Chord = require('./chords.js');

let currentSong;
let nextSong;
let connectSong;

exports.setCurrentSong = function(song) {
    currentSong = song;
    song.forEach(element => {
        for (let index = 0; index < element.length; index++) {
            console.log(Chord.getNotesChord(element[index]))
        }
    });
}

exports.setNextSong = function(song) {
    nextSong = song;
}

exports.setConnectSong = function(song) {
    connectSong = song;

}

function play() {
    App.setCurrentMeasure()
}

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.PolySynth().toDestination()

//play a middle 'C' for the duration of an 8th note
Tone.start()

const resumeBtn = document.getElementById("resumeButton");
resumeBtn.onclick = function() {
    synth.triggerAttackRelease(Chord.getNotesChord(currentSong[0][0]), "4n");
}
