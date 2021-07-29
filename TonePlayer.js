const Tone = require('tone');
const Controller = require('./app.js')
const Chord = require('./chords.js');
const HarmonicConnect = require('./hConnect.js')
const Connect = require('./connect.js')

//polysynth temporaneo
const synth = new Tone.PolySynth().toDestination();
synth.volume.value = -12

//Tone.Trasport options
Tone.context.latencyHint = "interactive"


let currentSong = {};
let partiture
let part

let nextSong = {}
let partitureNextSong
let partNextSong

let connectSong = {}
let partitureConnect
let partConnect
let harmonicOn = false
let playedConnect = false

//Lo stato può essere play, stop, pause 
let state = "stop"
let currentMeasure = 0
let connectChordsIndex = -1
let loop = true


exports.setCurrentSong = function (song) {
    Object.assign(currentSong, song)
    let tempPart = generatePartiture(currentSong.music.measures)
    partiture = tempPart[0]
    part = tempPart[1]
}

exports.setNextSongCurrent = function (song) {
    Object.assign(currentSong, song)
}


exports.setNextSong = function (song) {
    Object.assign(nextSong, song)
    let tempPart = generatePartiture(nextSong.music.measures)
    partitureNextSong = tempPart[0]
    partNextSong = tempPart[1]
    //Generazione accordi harmonic connect
    let dummyConnect = Connect.connect(currentSong, nextSong)
    //TO BE REMOVED
    dummyConnect = HarmonicConnect.chainModulation(currentSong, nextSong) //lascio per non rompere la build

    tempPart = generatePartiture(dummyConnect)
    partitureConnect = tempPart[0]
    partConnect = tempPart[1]
    partConnect.loop = false

    Controller.setConnectChords(dummyConnect)
}

exports.setConnectSong = function (song) {
    Object.assign(connectSong, song)
}

let sliderBpm = document.getElementById("sliderTempo")
sliderBpm.onchange = function () {
    currentSong.bpm = sliderBpm.value
    Tone.Transport.bpm.value = currentSong.bpm

    for (let i = 0; i < partiture.length; i++) {
        partiture[i].duration = Tone.Time({ "4n": partiture[i].subdiv }).valueOf()
    }
    if (!(Object.keys(nextSong).length === 0 && nextSong.constructor === Object)) {
        for (let i = 0; i < partitureConnect.length; i++) {
            partitureConnect[i].duration = Tone.Time({ "4n": partitureConnect[i].subdiv }).valueOf()
        }
        for (let i = 0; i < partitureNextSong.length; i++) {
            partitureNextSong[i].duration = Tone.Time({ "4n": partitureNextSong[i].subdiv }).valueOf()
        }
    }
}


//Funzione per generare l'oggetto da dare a ToneEvent.Part
function generatePartiture(chords) {
    Tone.Transport.bpm.value = sliderBpm.value
    let timeSignature = extractTimeSignature(currentSong.music.timeSignature)
    Tone.Transport.timeSignature = timeSignature

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
            let temp = { time: " ", measure: " ", notes: " ", duration: " ", subdiv: [], lastChord: false, firstChord: false }
            temp.measure = i
            if (j > 0)
                count = count + duration[j - 1]
            temp.time = i + ":" + count
            temp.notes = Chord.getNotesChord(chords[i][j])
            temp.duration = Tone.Time({ "4n": duration[j] }).valueOf()
            temp.subdiv = duration[j]
            partitureTemp.push(temp)
        }
    }

    //SETTING LAST CHORD AND FIRST CHORD
    let sum = 0
    for (let i = 0; i < chords.length; i++) {
        sum = sum + chords[i].length
    }
    partitureTemp[sum - 1].lastChord = true
    partitureTemp[0].firstChord = true

    let partTemp = generatePart(partitureTemp, timeSignature)

    /*new Tone.Part(((time, chord) => {
        // the notes given as the second element in the array
        // will be passed in as the second argument
        sampler.triggerAttackRelease(chord.notes, chord.duration, time);
        console.log(currentMeasure)
        if (currentMeasure != chord.measure) {
            currentMeasure = chord.measure
            Controller.setCurrentMeasure(currentMeasure)
        if (harmonicOn) {
            if (connectChordsIndex != chord.measure) {
                connectChordsIndex = chord.measure
                Controller.setCurrentMeasureConnect(currentMeasure)
            }
        }
        }
        if (chord.lastChord) {
            if (!(Object.keys(nextSong).length === 0 && nextSong.constructor === Object)) {
                if (!harmonicOn) {
                    //Play harmonic Connect chords
                    harmonicOn = true
                    Tone.Transport.stop()
                    Tone.Transport.cancel(0)

                    part = generatePart(partitureConnect, timeSignature)
                    part.start(chord.duration)
                    Tone.Transport.start()

                } else {
                    //Delete currente harmonic connect
                    harmonicOn = false
                    Controller.setConnectChords([])


                    Controller.triggerNextSong()
                    //Play next song
                    Tone.Transport.stop()
                    Tone.Transport.cancel(0)

                    partiture = partitureNextSong
                    part = generatePart(partiture, extractTimeSignature(currentSong.music.timeSignature))
                    part.loop = true
                    part.start(chord.duration)
                    Tone.Transport.start()

                }
            }
        }
    }), partitureTemp);
    partTemp.humanize = true
    partTemp.loop = true
    partTemp.loopStart = partitureTemp[0].time
    partTemp.loopEnd = (partitureTemp[partitureTemp.length - 1].measure + ":" + timeSignature)*/

    return [partitureTemp, partTemp]
}

function generatePart(targetPartiture, timeSignature) {
    let partTemp = new Tone.Part(((time, chord) => {
        // the notes given as the second element in the array
        // will be passed in as the second argument
        sampler.triggerAttackRelease(chord.notes, chord.duration, time, velocity = 0.3);
        console.log("PART CURRENT MEASURE: ", chord.measure)
        if (currentMeasure != chord.measure && !harmonicOn) {
            currentMeasure = chord.measure
            Controller.setCurrentMeasure(currentMeasure)
            //First chord after harmonic connect
            if (chord.firstChord && playedConnect) {
                Controller.setConnectChords([])
                connectChordsIndex = -1
                Controller.setCurrentMeasureConnect(-1)
            }
        }
        if (harmonicOn) {
            //First chord harmonic connect
            if (chord.firstChord) {
                Controller.triggerNextSong()
                currentMeasure = -1
                Controller.setCurrentMeasure(-1)
            }
            if (connectChordsIndex != chord.measure) {
                connectChordsIndex = chord.measure
                Controller.setCurrentMeasureConnect(connectChordsIndex)
            }
        }
        console.log("TonePlayer: ", currentMeasure, connectChordsIndex)
        if (chord.lastChord) {
            if (!(Object.keys(nextSong).length === 0 && nextSong.constructor === Object)) {
                if (!harmonicOn) {
                    //Play harmonic Connect chords
                    harmonicOn = true
                    Tone.Transport.stop()
                    Tone.Transport.cancel(0)

                    part = generatePart(partitureConnect, timeSignature)
                    part.loop = false
                    part.start(chord.duration)
                    Tone.Transport.start()
                } else {
                    //Delete currente harmonic connect
                    harmonicOn = false
                    playedConnect = true
                    /*Controller.setConnectChords([])
                    connectChordsIndex = -1
                    Controller.setCurrentMeasureConnect(-1)*/

                    nextSong = {}
                    connectSong = {}


                    //Play next song
                    Tone.Transport.stop()
                    Tone.Transport.cancel(0)

                    partiture = partitureNextSong
                    part = generatePart(partiture, timeSignature)
                    part.loop = true
                    part.start(chord.duration)
                    Tone.Transport.start()

                }
            }
        }
    }), targetPartiture);
    partTemp.humanize = true
    partTemp.loop = true
    partTemp.loopStart = targetPartiture[0].time
    partTemp.loopEnd = (targetPartiture[targetPartiture.length - 1].measure + ":" + timeSignature)

    return partTemp;
}

function play() {
    Tone.start()
    part.start()
    /* if (harmonicOn)
        partConnect.start(Tone.Transport.ticks)
    else
        part.start(Tone.Transport.ticks) */
    Tone.Transport.start()
}

function stop() {
    Tone.Transport.stop()
    Tone.Transport.cancel(0)
    Controller.setFinalShiftZeroToStop()


    if (harmonicOn) {
        part = generatePart(partitureConnect, extractTimeSignature(currentSong.music.timeSignature))
    } else {
        part = generatePart(partiture, extractTimeSignature(currentSong.music.timeSignature))
    }
    part.start()
}

function pause() {
    Tone.Transport.pause()
}


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


const sampler = new Tone.Sampler({
    'A0': './piano/A0.mp3',
    'A1': './piano/A1.mp3',
    'A2': './piano/A2.mp3',
    'A3': './piano/A3.mp3',
    'A4': './piano/A4.mp3',
    'A5': './piano/A5.mp3',
    'A6': './piano/A6.mp3',
    'A#0': './piano/As0.mp3',
    'A#1': './piano/As1.mp3',
    'A#2': './piano/As2.mp3',
    'A#3': './piano/As3.mp3',
    'A#4': './piano/As4.mp3',
    'A#5': './piano/As5.mp3',
    'A#6': './piano/As6.mp3',
    'B0': './piano/B0.mp3',
    'B1': './piano/B1.mp3',
    'B2': './piano/B2.mp3',
    'B3': './piano/B3.mp3',
    'B4': './piano/B4.mp3',
    'B5': './piano/B5.mp3',
    'B6': './piano/B6.mp3',
    'C0': './piano/C0.mp3',
    'C1': './piano/C1.mp3',
    'C2': './piano/C2.mp3',
    'C3': './piano/C3.mp3',
    'C4': './piano/C4.mp3',
    'C5': './piano/C5.mp3',
    'C6': './piano/C6.mp3',
    'C7': './piano/C7.mp3',
    'C#0': './piano/Cs0.mp3',
    'C#1': './piano/Cs1.mp3',
    'C#2': './piano/Cs2.mp3',
    'C#3': './piano/Cs3.mp3',
    'C#4': './piano/Cs4.mp3',
    'C#5': './piano/Cs5.mp3',
    'C#6': './piano/Cs6.mp3',
    'D0': './piano/D0.mp3',
    'D1': './piano/D1.mp3',
    'D2': './piano/D2.mp3',
    'D3': './piano/D3.mp3',
    'D4': './piano/D4.mp3',
    'D5': './piano/D5.mp3',
    'D6': './piano/D6.mp3',
    'D#0': './piano/Ds0.mp3',
    'D#1': './piano/Ds1.mp3',
    'D#2': './piano/Ds2.mp3',
    'D#3': './piano/Ds3.mp3',
    'D#4': './piano/Ds4.mp3',
    'D#5': './piano/Ds5.mp3',
    'D#6': './piano/Ds6.mp3',
    'E0': './piano/E0.mp3',
    'E1': './piano/E1.mp3',
    'E2': './piano/E2.mp3',
    'E3': './piano/E3.mp3',
    'E4': './piano/E4.mp3',
    'E5': './piano/E5.mp3',
    'E6': './piano/E6.mp3',
    'F0': './piano/F0.mp3',
    'F1': './piano/F1.mp3',
    'F2': './piano/F2.mp3',
    'F3': './piano/F3.mp3',
    'F4': './piano/F4.mp3',
    'F5': './piano/F5.mp3',
    'F6': './piano/F6.mp3',
    'F#0': './piano/Fs0.mp3',
    'F#1': './piano/Fs1.mp3',
    'F#2': './piano/Fs2.mp3',
    'F#3': './piano/Fs3.mp3',
    'F#4': './piano/Fs4.mp3',
    'F#5': './piano/Fs5.mp3',
    'F#6': './piano/Fs6.mp3',
    'G0': './piano/G0.mp3',
    'G1': './piano/G1.mp3',
    'G2': './piano/G2.mp3',
    'G3': './piano/G3.mp3',
    'G4': './piano/G4.mp3',
    'G5': './piano/G5.mp3',
    'G6': './piano/G6.mp3',
    'G#0': './piano/Gs0.mp3',
    'G#1': './piano/Gs1.mp3',
    'G#2': './piano/Gs2.mp3',
    'G#3': './piano/Gs3.mp3',
    'G#4': './piano/Gs4.mp3',
    'G#5': './piano/Gs5.mp3',
    'G#6': './piano/Gs6.mp3',
    //baseUrl: "./piano/",
}).chain(new Tone.Reverb(0.1), Tone.Destination);

sampler.volume.value = 0
let volSlider = document.getElementById("sliderVolume")
volSlider.onchange = function () {
    sampler.volume.value = volSlider.value
    console.log(sampler.volume.value)
}


function extractTimeSignature(ts) {
    let ris = ts[0]
    if (ts == 12)
        ris = 6
    return ris
}