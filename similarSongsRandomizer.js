let songsByKey = require('./songsByKey.json');

const altKeys = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "A-", "Bb-", "B-", "C-", "C#-", "D-", "Eb-", "E-", "F-", "F#-", "G-", "G#-"]

const longAltKeys = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",
    "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",
    "A-", "Bb-", "B-", "C-", "C#-", "D-", "Eb-", "E-", "F-", "F#-", "G-", "G#-",
    "A-", "Bb-", "B-", "C-", "C#-", "D-", "Eb-", "E-", "F-", "F#-", "G-", "G#-"
]

exports.getFirstRandomSong = function() {
    let randKey
    let randSong
    do {
        randKey = Math.floor(Math.random() * altKeys.length)
        console.log("ok, randkey = " + randKey)
        randSong = Math.floor(Math.random() * songsByKey[altKeys[randKey]].length)
        console.log("ok, randSong = " + randSong)
        firstSong = songsByKey[altKeys[randKey]][randSong]
        console.log("ok, firstSong = " + firstSong)
            //console.log("ok, title = " + firstSong.title)


    } while (firstSong == undefined)

    //firstSong = songsByKey['F'][1]
    //console.log(firstSong)

    return firstSong
}

exports.getSameKeySong = function(songByKey) {
    let key
    let keyIndex
        //let nextSong
    do {
        key = songByKey.key
        console.log("ok, key = " + key)
        keyIndex = altKeys.indexOf(key)
        console.log("ok, keyIndex = " + keyIndex)
            //var nextSong = songs[Math.floor(Math.random() * songs.length)];

        randInKeySong = Math.floor(Math.random() * songsByKey[altKeys[keyIndex]].length)
        console.log("ok, RandInKeySong = " + randInKeySong)
        nextSong = songsByKey[altKeys[keyIndex]][randInKeySong]
        console.log("ok, nextSong = " + nextSong)
        console.log("ok nextKey = " + nextSong.key)
        console.log("ok, title = " + nextSong.title)
            // it repeats the operation untill it gets the same key
    } while (nextSong == undefined)
    return nextSong
}

// Arrays of Keys
const keys = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
    // The minor key has a different order in respect to the major ones for an easier implementation
const minorKeys = ['A-', 'Bb-', 'B-', 'C-', 'C#-', 'D-', 'Eb-', 'E-', 'F-', 'F#-', 'G-', 'G#-'];

// with similar Key I intended: same key, correspondend major-minor, its IV or V.
exports.getSimilarKeySong = function(songByKey) {
    let key
    let currentKeyIndex
    let nextSong
    do {
        // I'm searching the correspondent key on the two arrays
        // If its a majorkey, the minor index will result -1 and viceversa
        key = songByKey.key
        console.log("key = " + key)
            // sto assumendo che l'indexOf sia un firstIndexOf
        currentKeyIndex = longAltKeys.indexOf(key)
        console.log("currentKeyIndex = " + currentKeyIndex)
            // let nextSong
        randomCase = Math.ceil(Math.random() * 3)
        console.log("randomCase = " + randomCase)
        if (randomCase == 1) {
            if (currentKeyIndex < 24) {
                nextKeyIndex = currentKeyIndex + 24
            } else { nextKeyIndex = currentKeyIndex - 24 }
        } else if (randomCase == 2) {
            nextKeyIndex = currentKeyIndex + 5
        } else if (randomCase == 3) {
            nextKeyIndex = currentKeyIndex + 7
        }
        console.log("nextKeyIndex = " + nextKeyIndex)
        simKeySong = Math.floor(Math.random() * songsByKey[longAltKeys[nextKeyIndex]].length)
        console.log("ok, SimKeySong = " + simKeySong)
        nextSong = songsByKey[longAltKeys[nextKeyIndex]][simKeySong]
        console.log("ok, nextSong = " + nextSong)
    } while (nextSong == undefined)

    console.log("ok nextKey = " + nextSong.key)
    console.log("ok, title = " + nextSong.title)

    return nextSong
}


exports.getTargetKeySong = function(key) {
    let targetKeyIndex
    let nextSong
    do {
        //let nextSong
        targetKeyIndex = altKeys.indexOf(key)
        console.log("targetKeyIndex = " + targetKeyIndex)
        targetKeySong = Math.floor(Math.random() * songsByKey[altKeys[targetKeyIndex]].length)
        console.log("targetKeySong = " + targetKeySong)
        nextSong = songsByKey[altKeys[targetKeyIndex]][targetKeySong]
        console.log("nextSong = " + nextSong)
            // console.log("ok nextKey = " + nextSong.key)
            // console.log("ok, title = " + nextSong.title)
    } while (nextSong == undefined)
    return nextSong
}

exports.getRandomSong = function() {
    let randKey
    let randSong
    let nextSong
    do {
        //let nextSong
        randKey = Math.floor(Math.random() * altKeys.length)
        console.log("ok, randkey = " + randKey)
        randSong = Math.floor(Math.random() * songsByKey[altKeys[randKey]].length)
        console.log("ok, randSong = " + randSong)
        nextSong = songsByKey[altKeys[randKey]][randSong]
        console.log("ok, nextSong = " + nextSong)
            //console.log("ok, title = " + nextSong.title)
            //console.log("ok, title = " + nextSong.key)


    } while (nextSong == undefined)

    //firstSong = songsByKey['F'][1]
    console.log(nextSong.key)

    return nextSong
}