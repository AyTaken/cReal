let songs = require('./test.json');

exports.getFirstRandomSong = function () {
    var firstSong = songs[Math.floor(Math.random()*songs.length)];
    //console.log(firstSong.title)
    //TEST 
    firstSong = songs[21]
    //allBlues[0][1] = 'C7'
    //firstSong.music.measures = allBlues
    return firstSong
}