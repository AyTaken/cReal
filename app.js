const Tone = require('tone');
const Chord = require('./chords.js')
//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

//play a middle 'C' for the duration of an 8th note
Tone.start()

const resumeBtn = document.getElementById("resumeButton");
resumeBtn.onclick = function() {
    synth.triggerAttackRelease("C4", "8n");
}

console.log(Chord.getNotesChord("G7"))