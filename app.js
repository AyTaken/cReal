const TonePlayer = require('./TonePlayer.js');
const SimilarSongsRandomizer = require('./similarSongsRandomizer.js')
const View = require('./view.js');

const noAlt = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
const minor = ["A-", "Bb-", "B-", "C-", "C#-", "D-", "Eb-", "E-", "F-", "F#-", "G-", "G#-"]

let currentSong
let nextSong 
let currentMeasure = 0

exports.setCurrentMeasure = function(measureNum) {
    //Refers to the current played measure by TonePlayer
    currentMeasure = measureNum;
    scrollSubView()
    //Change nella view la misura illuminata
    updateView(currentSong, viewedBlock)
}

function updateView(song, subMeasure) {
    View.changeState(song, subMeasure, viewIndex)
}


//Initialization
let initialSong = SimilarSongsRandomizer.getFirstRandomSong();
//TonePlayer.setCurrentSong(initialSong)
currentSong = initialSong
TonePlayer.setCurrentSong(currentSong)
let measures = currentSong.music.measures
setKeyDropdown()


//TEST TONEJS
let playBtn = document.getElementById("play")
playBtn.onclick = function () {
    TonePlayer.setState("play")
} 


//TEST


function setCurrentMeasure(measureNum) {
    //Refers to the current played measure by TonePlayer
    currentMeasure = measureNum;
    scrollSubView()
    //Change nella view la misura illuminata
    updateView(currentSong, viewedBlock)
}


const maxSize = 24
let viewedBlock = []
let viewIndex = 0
let finalShift = 0
for (let i = 0; i < measures.length && i < maxSize; i++) {
    viewedBlock.push(measures[i]) 
}


//SIMULATION
let temp = 0
setCurrentMeasure(temp)
setInterval(function(){ 
    temp++; 
    if (temp == currentSong.music.measures.length)
        temp = 0
    setCurrentMeasure(temp)
}, 2000);

function scrollSubView() {
    viewIndex = (currentMeasure + finalShift) % maxSize

    if (measures.length < maxSize)
        return
    viewedBlock[circularMotion(viewIndex, -1, maxSize)] = measures[circularMotion(currentMeasure, maxSize - 1, measures.length)]
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

document.getElementById("onClickSubmit").onclick = function (){
    let semitones 
    let nextKey = document.getElementById("keys").value
    if (currentSong.key == nextKey) {
        //console.log("NOP")
        return
    } else {
        if (currentSong.key.includes("-")) {
            semitones = minor.indexOf(value) - minor.indexOf(currentSong.key)
        } else {
            semitones = noAlt.indexOf(value) - noAlt.indexOf(currentSong.key)
        }
    }

    
    
}