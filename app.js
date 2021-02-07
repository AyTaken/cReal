//const TonePlayer = require('./TonePlayer');
const SimilarSongsRandomizer = require('./similarSongsRandomizer.js')
const View = require('./view.js')

let currentSong
let nextSong 
let currentMeasure = 0

exports.setCurrentMeasure = function(measureNum) {
    //Refers to the current played measure by TonePlayer
    currentMeasure = measureNum;
    //Change nella view la misura illuminata
}

function updateView(song, subMeasure) {
    View.changeState(song, subMeasure, viewIndex)
}


//Initialization
let initialSong = SimilarSongsRandomizer.getFirstRandomSong();
//TonePlayer.setCurrentSong(initialSong)
currentSong = initialSong
let measures = currentSong.music.measures







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
for (let i = 0; i < maxSize; i++) {
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
}, 200);

function scrollSubView() {
    viewIndex = (currentMeasure + finalShift) % maxSize
    console.log("current mes: ", currentMeasure, "-->",circularMotion(currentMeasure, maxSize-1, measures.length))
    console.log(viewedBlock[circularMotion(viewIndex, -1, maxSize)], "-->", measures[circularMotion(currentMeasure, maxSize - 1, measures.length)])

    viewedBlock[circularMotion(viewIndex, -1, maxSize)] = measures[circularMotion(currentMeasure, maxSize - 1, measures.length)]
    if (currentMeasure == measures.length - 1) {
        finalShift = ((currentMeasure % maxSize + 1) + finalShift) % maxSize
    }
    console.log(finalShift)
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

/*function scrollSubView() {
    viewIndex = (currentMeasure + finalShift) % maxSize
    console.log("Current measure: ", currentMeasure, " + Viewed index: ", viewIndex)
    if (currentMeasure > 0) {
        //console.log("Before: ", circularMotion(currentMeasure, -1, maxSize), "after: ", circularMotion(currentMeasure, maxSize - 1, measures.length))
        viewedBlock[circularMotion(viewIndex, -1, maxSize)] = measures[circularMotion(currentMeasure, maxSize - 1, measures.length)]
        if (currentMeasure == measures.length - 1) {
            finalShift = ((currentMeasure % maxSize + 1) + finalShift) % maxSize
        }
        //console.log(finalShift)
    }
}*/