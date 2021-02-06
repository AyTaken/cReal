const TonePlayer = require('./TonePlayer');
const SimilarSongsRandomizer = require('./similarSongsRandomizer.js')
const View = require('./view.js')

//Cannot use in browser
//const fs = require('fs')
//var contents = fs.readFileSync("./test.json", "utf8")
//var songs = JSON.parse(json);


let currentSong
let measuresLen
let nextSong 
let currentMeasure = 0
const chunkSize = 24



exports.setCurrentMeasure = function(measureNum) {
    //Refers to the current played measure by TonePlayer
    currentMeasure = measureNum;
    //Change nella view la misura illuminata
}

//Initialization
let initialSong = SimilarSongsRandomizer.getFirstRandomSong();
//TonePlayer.setCurrentSong(initialSong)
currentSong = initialSong



//TEST
function setCurrentMeasure(measureNum) {
    //Refers to the current played measure by TonePlayer
    currentMeasure = measureNum;
    //Change nella view la misura illuminata
}
measuresLen = currentSong.music.measures.length


/*let blockMeasures = chunkArray(currentSong.music.measures, chunkSize)
let viewedBlock = blockMeasures[0]
let currentBlock = 0
let nextBlock = 1
let nextBlockCursor = 0
let currentBlockCursor = 0
updateView(currentSong, viewedBlock)*/

const maxSize = 24
let viewedBlock = []
for (let i = 0; i < maxSize; i++) {
    viewedBlock.push(currentSong.music.measures[i])
    
}
console.log(viewedBlock)
updateView(currentSong, viewedBlock)



//SIMULATION
let temp = 0
setCurrentMeasure(temp)
//setInterval(function(){ temp++; setCurrentMeasure(temp)}, 2000);



function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        tempArray.push(myChunk);
    }

    return tempArray;
}

function updateView(song, subMeasure) {
    View.changeState(song, subMeasure, currentMeasure % maxSize)

}

function scrollSubView() {

}

//functio scollSubView V1
/*function scrollSubView() {
    console.log(currentBlock, ":", nextBlock)
    if (currentBlockCursor == 0) {
        nextBlockCursor = chunkSize - 1
        viewedBlock[nextBlockCursor] = blockMeasures[nextBlock][nextBlockCursor]
        updateView(currentSong, viewedBlock)
    }else if (currentBlockCursor > 0) {
        nextBlockCursor = currentBlockCursor - 1
        viewedBlock[nextBlockCursor] = blockMeasures[nextBlock][nextBlockCursor]
        updateView(currentSong, viewedBlock)
    } 
    if (currentBlockCursor == chunkSize - 1) {
        currentMeasure = 0;
        currentBlock++;
        nextBlock++;
        if (nextBlock == blockMeasures.length)
            nextBlock = 0
        if (currentBlock == blockMeasures.length)
            currentBlock = 0

    }
}*/