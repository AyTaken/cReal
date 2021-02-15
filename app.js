const TonePlayer = require('./TonePlayer.js');
const SimilarSongsRandomizer = require('./similarSongsRandomizer.js')
const View = require('./view.js');

const noAlt = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
const minor = ["A-", "Bb-", "B-", "C-", "C#-", "D-", "Eb-", "E-", "F-", "F#-", "G-", "G#-"]

let currentSong
let nextSong
let currentMeasure = 0
let connectChords
let connectChordsIndex = -1
let lastChordView = 0

exports.setCurrentMeasure = function (measureNum) {
    //Refers to the current played measure by TonePlayer
    currentMeasure = measureNum;
    console.log("App.js: ", currentMeasure, connectChordsIndex)
    scrollSubView()
    //Change nella view la misura illuminata
    updateView(currentSong, viewedBlock)
}

exports.setCurrentMeasureConnect = function (measureNum) {
    //Refers to the current played measure by TonePlayer
    connectChordsIndex = measureNum;
    console.log("App.js: ", currentMeasure, connectChordsIndex)
    //Change nella view la misura illuminata
    updateView(currentSong, viewedBlock)
}

exports.setFinalShiftZeroToStop = function () {
    finalShift = 0
}

const chordPanel = document.getElementById("chords")

exports.triggerNextSong = function () {
    currentSong = nextSong
    measures = currentSong.music.measures
    measures = capChords(measures, currentSong.music.timeSignature)
    TonePlayer.setNextSongCurrent(currentSong)
    setKeyDropdown()

    //Clear chord grid
    for (let i = 0; i < chordPanel.children.length; i++) {
        chordPanel.children[i].textContent = ""
        for (let j = 0; j < chordPanel.children[i].classList.length; j++) {
            if (chordPanel.children[i].classList[j] == "selectedCell") {
                chordPanel.children[i].classList.remove("selectedCell")
            }
        }
    }

    viewedBlock = []
    viewIndex = 0
    lastChordView = measures.length - 1
    finalShift = 0

    for (let i = 0; i < measures.length && i < maxSize; i++) {
        viewedBlock.push(measures[i])
    }

    updateView(currentSong, viewedBlock)
}


const chordPanelConnect = document.getElementById("connectChords")

exports.setConnectChords = function (cChords) {
    connectChords = cChords

    //Remove previous children
    while (chordPanelConnect.firstChild) {
        chordPanelConnect.removeChild(chordPanelConnect.lastChild);
    }

    //Grid generation harmonic conenct
    for (let i = 0; i < connectChords.length; i++) {
        let div = document.createElement("div");
        div.id = "cellHarmonic" + i
        div.classList.add("cell")
        chordPanelConnect.appendChild(div)
    }

    updateView(currentSong, viewedBlock)
}

function updateView(song, subMeasure) {
    View.changeState(song, subMeasure, viewIndex, connectChords, connectChordsIndex, lastChordView)
}


//Initialization
currentSong = SimilarSongsRandomizer.getFirstRandomSong();
//TODO -> CAP SU TUTTE LE NEXT SONG
let measures = currentSong.music.measures
measures = capChords(measures, currentSong.music.timeSignature)
TonePlayer.setCurrentSong(currentSong)
setKeyDropdown()


let playBtn = document.getElementById("play")
let stopBtn = document.getElementById("stop")
let pauseBtn = document.getElementById("pause")
playBtn.onclick = function () {
    TonePlayer.setState("play")
}
stopBtn.onclick = function () {
    TonePlayer.setState("stop")
    let measures = currentSong.music.measures

    //RESET CHORD VIEW
    viewedBlock = []
    lastChordView = -1

    for (let i = 0; i < measures.length && i < maxSize; i++) {
        viewedBlock.push(measures[i])
    }
    updateView(currentSong, viewedBlock)

}
pauseBtn.onclick = function () {
    TonePlayer.setState("pause")
}

//ONCLICK CHANGE SONG BUTTONS
let sameKeyBtn = document.getElementById("sameKey")
let similarKeyBtn = document.getElementById("similarKey")
let targetKeyBtn = document.getElementById("targetKey")
let targetKey = document.getElementById("keys").value
let randomKeyBtn = document.getElementById("randomKey")
let changeKey = document.getElementById("changeKey")
sameKeyBtn.onclick = function () {
    //DUMMY
    nextSong = SimilarSongsRandomizer.getSameKeySong(currentSong)
    setNextSong()
}
similarKeyBtn.onclick = function () {
    //DUMMY
    nextSong = SimilarSongsRandomizer.getSimilarKeySong(currentSong)
    setNextSong()
}
targetKeyBtn.onclick = function () {
    //DUMMY
    let targetKey = document.getElementById("keys").value
    nextSong = SimilarSongsRandomizer.getTargetKeySong(targetKey)
    setNextSong()
}
randomKeyBtn.onclick = function () {
    //DUMMY
    nextSong = SimilarSongsRandomizer.getRandomSong()
    setNextSong()
}
changeKey.onclick = function() {
    let semitones
    let nextKey = document.getElementById("keys").value
    if (currentSong.key == nextKey) {
        console.log("NOP")
        return
    } else {
        if (currentSong.key.includes("-")) {
            semitones = minor.indexOf(nextKey) - minor.indexOf(currentSong.key)
        } else {
            semitones = noAlt.indexOf(nextKey) - noAlt.indexOf(currentSong.key)
        }
    }

    console.log(semitones)
    let chromaFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
    let chromaSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    let usedChroma = []

    let tempChord = []

    for (let i = 0; i < measures.length; i++) {
        let tempMea = []
        for (let j = 0; j < measures[i].length; j++) {
            tempMea.push(measures[i][j])
            let root = measures[i][j][0]
            let hasAlt = false
            if (measures[i][j][1] == 'b' || measures[i][j][1] == '#') {
                hasAlt = true
                root = root + measures[i][j][1]
            }
            if (currentSong.key.includes('#')) {
                usedChroma = chromaSharp
            } else {
                usedChroma = chromaFlat
            }

            let transposed = mod(usedChroma, usedChroma.indexOf(root), semitones)
            tempMea[j] = tempMea[j].replace(root, transposed)
        }

        tempChord.push(tempMea)

    }

    let transposedSong = {}
    Object.assign(transposedSong, currentSong)
    transposedSong.key = nextKey
    transposedSong.music.measures = tempChord

    nextSong = transposedSong
    setNextSong()


}

let nextSongVis = document.getElementById("nextSongVis")

function setNextSong() {
    nextSongVis.textContent = nextSong.title + " in " + nextSong.key
    TonePlayer.setNextSong(nextSong)
}


//GESTIONE BLOCCO VISUALLIZATO
const maxSize = 24
let viewedBlock = []
let viewIndex = 0
lastChordView = measures.length - 1
let finalShift = 0
for (let i = 0; i < measures.length && i < maxSize; i++) {
    viewedBlock.push(measures[i])
}
updateView(currentSong, viewedBlock)



//FUNZIONI VIEW ACCORDI
function scrollSubView() {
    viewIndex = (currentMeasure + finalShift) % maxSize

    if (measures.length < maxSize)
        return
    viewedBlock[circularMotion(viewIndex, -1, maxSize)] = measures[circularMotion(currentMeasure, maxSize - 1, measures.length)]

    //Impostazione lastCord
    if (circularMotion(currentMeasure, maxSize - 1, measures.length) == measures.length - 1) {
        lastChordView = circularMotion(viewIndex, -1, maxSize)
    }
    if (currentMeasure == measures.length - 1) {
        finalShift = ((currentMeasure % maxSize + 1) + finalShift) % maxSize
    }


}

function circularMotion(num, addSocNum, mod) {
    let ris
    //num sempre postivo, il secgno di addSocNum decice se l'operazione è una somma o una sottrazione
    if (addSocNum >= 0) {
        ris = num + addSocNum
        ris = ris % mod
    } else {
        let opposite = addSocNum + mod
        ris = num + opposite
        ris = ris % mod
    }
    return ris
}


function setKeyDropdown() {

    let dropdown = document.getElementById("keys")

    if (currentSong.key.includes("-")) {
        for (let i = 0; i < dropdown.children.length; i++) {
            dropdown.children[i].textContent = minor[i]
            dropdown.children[i].value = minor[i]
        }
    } else {

        for (let i = 0; i < dropdown.children.length; i++) {
            dropdown.children[i].textContent = noAlt[i]
            dropdown.children[i].value = noAlt[i]
        }
    }
}

/*document.getElementById("onClickSubmit").onclick = function () {
    let semitones
    let nextKey = document.getElementById("keys").value
    if (currentSong.key == nextKey) {
        console.log("NOP")
        return
    } else {
        if (currentSong.key.includes("-")) {
            semitones = minor.indexOf(nextKey) - minor.indexOf(currentSong.key)
        } else {
            semitones = noAlt.indexOf(nextKey) - noAlt.indexOf(currentSong.key)
        }
    }

    console.log(semitones)
    let chromaFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
    let chromaSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    let usedChroma = []

    let tempChord = []

    for (let i = 0; i < measures.length; i++) {
        let tempMea = []
        for (let j = 0; j < measures[i].length; j++) {
            tempMea.push(measures[i][j])
            let root = measures[i][j][0]
            let hasAlt = false
            if (measures[i][j][1] == 'b' || measures[i][j][1] == '#') {
                hasAlt = true
                root = root + measures[i][j][1]
            }
            if (currentSong.key.includes('#')) {
                usedChroma = chromaSharp
            } else {
                usedChroma = chromaFlat
            }

            let transposed = mod(usedChroma, usedChroma.indexOf(root), semitones)
            tempMea[j] = tempMea[j].replace(root, transposed)
        }

        tempChord.push(tempMea)

    }

    let transposedSong = {}
    Object.assign(transposedSong, currentSong)
    transposedSong.key = nextKey
    transposedSong.music.measures = tempChord

    nextSong = transposedSong
    setNextSong()

}*/

function mod(arr, num, index) {
    let sum = index + num
    if (sum >= arr.length)
        return arr[sum % arr.length]
    else if (sum < 0) {
        sum = sum + arr.length
        return arr[sum]
    }
    return arr[sum]
}


//Cap sul massimo di accordi suonabili, per gestire il caso di accordi tra parentesi
//ritorna delle measure tagliate in base al timeSignature
function capChords(songMeasures, ts) {
    let cap = extractTimeSignature(ts)
    for (let i = 0; i < songMeasures.length; i++) {
        let popNumber = songMeasures[i].length - cap
        if (popNumber > 0) {
            for (let j = 0; j < popNumber; j++) {
                songMeasures[i].pop()
            }
        }
    }
    return songMeasures
}

function extractTimeSignature(ts) {
    let ris = ts[0]
    if (ts == 12)
        ris = 6
    return ris
}