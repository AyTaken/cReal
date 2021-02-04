const TonePlayer = require('./TonePlayer');
//const fs = require('fs')
//var contents = fs.readFileSync("./test.json", "utf8")
let songs = require('./test.json');
//var songs = JSON.parse(json);
let allBlues = songs[0].music.measures
allBlues[0][1] = 'C7'
TonePlayer.setCurrentSong(allBlues)
let measureNumber

exports.setCurrentMeasure = function(measureNum) {
    //Refers to the current played measure by TonePlayer
    this.measureNumber = measureNumber;
    //Change nella view la misura illuminata
}
