let songs = require('./test.json');

exports.getFirstRandomSong = function () {
    var firstSong = songs[Math.floor(Math.random()*songs.length)];
    //console.log(firstSong.title)
    //TEST 
    let allBlues = songs[0].music.measures
    allBlues[0][1] = 'C7'
    firstSong.music.measures = allBlues
    return firstSong
}