//const TonePlayer = require('./TonePlayer');
const SimilarSongsRandomizer = require('./similarSongsRandomizer.js')
const View = require('./view.js')

//Cannot use in browser
//const fs = require('fs')
//var contents = fs.readFileSync("./test.json", "utf8")
//var songs = JSON.parse(json);



let measureNumber




exports.setCurrentMeasure = function(measureNum) {
    //Refers to the current played measure by TonePlayer
    this.measureNumber = measureNumber;
    //Change nella view la misura illuminata
}

//Initialization
let initialSong = SimilarSongsRandomizer.getFirstRandomSong();
//TonePlayer.setCurrentSong(initialSong)
updateView(initialSong)


function updateView(song) {
    View.changeState(song)

}

function nextSong(){

}