let songs = require('./test.json');

exports.getFirstRandomSong = function() {
    var firstSong = songs[Math.floor(Math.random() * songs.length)];
    //console.log(firstSong.title)
    //TEST 
    firstSong = songs[21]
        //allBlues[0][1] = 'C7'
        //firstSong.music.measures = allBlues
    return firstSong
}

exports.getSameKeySong = function(song) {

    var nextSong = songs[Math.floor(Math.random() * songs.length)];
    // it repeats the operation untill it gets the same key
    while (nextSong.key != song.key)
        nextSong = songs[Math.floor(Math.random() * songs.length)];

    return nextSong
}

// Arrays of Keys
const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    // The minor key has a different order in respect to the major ones for an easier implementation
const minorKeys = ['A-', 'A#-', 'B-', 'C-', 'C#-', 'D-', 'D#-', 'E-', 'F-', 'F#-', 'G-', 'G#-'];

// with similar Key I intended: same key, correspondend major-minor, its IV or V.
exports.getSimilarKeySong = function(song) {

    var nextSong = songs[Math.floor(Math.random() * songs.length)];
    // I'm searching the correspondent key on the two arrays
    // If its a majorkey, the minor index will result -1 and viceversa
    let keyIndex = keys.findIndex(nextSong.key)
    let minorKeyIndex = minorKeys.findIndex(nextSong.key)
        // If its a major ker
    if (keyIndex != -1) {
        // It will continue to repeat the operations in case the two keys are not same or correspondent minor
        while (nextSong.key != song.key || nextSong.key != minorKeys[keyIndex]) {
            // This else-if cascade is due to the fact that I didn't though of doing the two keys arrays
            // two octaves long. That would simplify the implementation. Btw I'm searching for the IV and V by 
            // making sure to not get further than the arrays length
            // ***************** CORRECT THE ARRAYS AND SIMPLIFY THIS PART ************ reminder for myself
            if (keyIndex <= 5 && keyIndex != -1) {
                while (nextSong.key != keys[keyIndex + 5] || nextSong.key != keys[keyIndex + 7]) {
                    nextSong = songs[Math.floor(Math.random() * songs.length)];
                }
            } else if (keyIndex > 5 && keyIndex <= 7 && keyIndex != -1) {
                while (nextSong.key != keys[keyIndex + 5] || nextSong.key != keys[keyIndex + -5]) {
                    nextSong = songs[Math.floor(Math.random() * songs.length)];
                }
            } else if (keyIndex > 7 && keyIndex != -1) {
                while (nextSong.key != keys[keyIndex - 5] || nextSong.key != keys[keyIndex - 7]) {
                    nextSong = songs[Math.floor(Math.random() * songs.length)];
                }
            }
        }
        // same of major but for minor
    } else {
        while (nextSong.key != song.key || nextSong.key != keys[minorKeyIndex]) {
            if (minorKeyIndex <= 5 && minorKeyIndex != -1) {
                while (nextSong.key != minorKeys[minorKeyIndex + 5] || nextSong.key != minorKeys[minorKeyIndex + 7]) {
                    nextSong = songs[Math.floor(Math.random() * songs.length)];
                }
            } else if (minorKeyIndex > 5 && minorKeyIndex <= 7 && minorKeyIndex != -1) {
                while (nextSong.key != minorKeys[minorKeyIndex + 5] || nextSong.key != minorKeys[minorKeyIndex + -5]) {
                    nextSong = songs[Math.floor(Math.random() * songs.length)];
                }
            } else if (minorKeyIndex > 7 && minorKeyIndex != -1) {
                while (nextSong.key != minorKeys[minorKeyIndex - 5] || nextSong.key != minorKeys[minorKeyIndex - 7]) {
                    nextSong = songs[Math.floor(Math.random() * songs.length)];
                }
            }
        }
    }
    return nextSong
}