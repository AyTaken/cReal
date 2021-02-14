// MODULATIONS

// CYCLE OF FIFTHS

const cycleF = ["C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F",
    "C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F",
    "A-", "E-", "B-", "Gb-", "Db-", "Ab-", "Eb-", "Bb-", "F-", "C-", "G-", "D-",
    "A-", "E-", "B-", "Gb-", "Db-", "Ab-", "Eb-", "Bb-", "F-", "C-", "G-", "D-"
]
const keys = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
    'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
    "A-", "Bb-", "B-", "C-", "C#-", "D-", "Eb-", "E-", "F-", "F#-", "G-", "G#-",
    "A-", "Bb-", "B-", "C-", "C#-", "D-", "Eb-", "E-", "F-", "F#-", "G-", "G#-"
]
const modes = ["M", "m", "m", "M", "M", "m", "dim"]
    // There are 4 comon chords for two keys next to each other, if I jump one key, only two are in common
    // (1) first, third, 4th, fifth, (2) third, fifth
    // Pre dom IV & ii (ii is the relative minor in the next key!)
    // I start the modulation in the two chord, because it becomes the relative minor in the new key
    // Pre dom are the common chords for modulation

// Scheletro diatonic (common chord) modulation

exports.diaMod = function(song1, song2) {
    currentFifthIndex = cycleF.indexOf(song1.key)
    currentKeyIndex = keys.indexOf(song1.key)
    n1 = cycleF.indexOf(song1.key)
    n2 = cycleF.indexOf(song2.key)
    n = n2 - n1
    let nextFifthIndex
    let firstChordModulation
    let secondChordModulation
    let thirdChordModulation
    let chords = []
    if (n == 1 || n == 2 || n == -11 || n == 12) {
        nextFifthIndex = currentFifthIndex + n
        firstChordModulation = keys[currentKeyIndex + 4] //iii-
        secondChordModulation = keys[currentKeyIndex + 9] //vi- which is ii- in next key
        currentKeyIndex = keys.indexOf(song2.key)
        thirdChordModulation = keys[currentKeyIndex + 7] //V now you can tell the key is changed
        chords = [firstChordModulation + '-', secondChordModulation + '-', thirdChordModulation + '^']
    } else if (n == -1 || n == -2 || n == 11 || n == -12) {
        if (currentKeyIndex + n < 0) {
            currentKeyIndex = currentKeyIndex + 12
        }
        nextFifthIndex = currentFifthIndex + n
        firstChordModulation = keys[currentKeyIndex + 7]
        currentKeyIndex = keys.indexOf(song2.key)
        secondChordModulation = keys[currentKeyIndex + 9]
        thirdChordModulation = keys[currentKeyIndex + 4]
        chords = [firstChordModulation + '^', secondChordModulation + '-', thirdChordModulation + '-']
    } else if (n == 0) {
        firstChordModulation = keys[currentKeyIndex + 2]
        secondChordModulation = keys[currentKeyIndex + 7]
        thirdChordModulation = keys[currentKeyIndex]
        chords = [firstChordModulation + '-', secondChordModulation + '^', thirdChordModulation + '^']
    } else if (n == 24) {
        // may an I IV V vi could be used before that
        currentKeyIndex = keys.indexOf(song2.key)
        firstChordModulation = keys[currentKeyIndex + 2]
        secondChordModulation = keys[currentKeyIndex + 7]
        thirdChordModulation = keys[currentKeyIndex]
        chords = [firstChordModulation + '-', secondChordModulation + '^', thirdChordModulation + '^']
    }

    console.log(n1)
    console.log(n2)
    console.log(n)
    return chords
}

// Chormatic Pivot CHORD
// From C to E minor
// Chromatic pivot chord is a chod not contained in the first key
// I vii vii (next chord) i

// I, II, iii, IV, V, vi, vii dim
// VI, vii, i, ii#, III, iv, v

exports.pivotChord = function(song_1, song_2) {
    let chords = []
    currentKeyIndex = keys.indexOf(song_1.key)
    nextKeyIndex = keys.indexOf(song_2.key)
    firstChordModulation = currentKeyIndex + 11;
    currentKeyIndex = nextKeyIndex
    secondChordModulation = currentKeyIndex + 11;
    chords = [firstChordModulation, secondChordModulation]
    return chords
}

// Enharmonic dominant
// if the next key dominant equals the augmented sixth of the current key
// I just need this chord as modulation
// it should work only in the case that I'm changin of half-step (is that what sarti asked?)





// Deceptive Cadence
// Dominant chord in a major key goes to the sixth
// If from a major I wanto to go to relative minor I play IV, V, vi (that is our next key i)
// vii, iii (that is ii, v) and then (now I'm in the new key) i of relative minor

exports.deceptiveCadence = function(song) {
    currentkey = song.key
    keyIndex = keys.indexOf(currentKey)
    let chords = []
    chord1 = keys[keyIndex]
    chord2 = keys[keyIndex + 5]
    chord3 = keys[keyIndex + 7]
    chord4 = keys[keyIndex + 9]
    nextKeyIndex = keys.indexOf(chord4)
    chord5 = keys[nextKeyIndex + 3]
    chord6 = keys[nextKeyIndex + 7]
    chord7 = keys[nextKeyIndex]
    chords = [chord1, chord2, chord3, chord4, chord5, chord6, chord7]
    return chords
}

// Enhamronic dim7
// Major I, V, vii, I, then I go to relative minor vii dim, i (nexy key relative minor)





// dim7 to Dom7
// if I take any dim7, I have just to low the root down of halfstep
// from Cmin to Eb: i, iv, i, vii (dim), V, I.
// In Bdim chord if I go down halfstep on the root (B) I gat Bb chord (a V) of the next key





// Chromatic Mediant
// Mediant = iii, Submediant = vi (in Major)
// Mediant = III, Submediant = VI
// I think there is no use for harmonic connect 
// Maybe I can use it to change from a I to iii or vi





// Common/Pivot NOTE
// Includes chromatic Mediant! The important is to have a common note between the two keys
// Emin = EGB, EbGC (Cmin) <- mediant relationship
// FAC#E (F), DbGbAbC (Db)




// Direct/Linear Modulation
// No common chords between the two. C, B

//if (Chord.getNotesChord(song1.key).filter(value => Chord.getNotesChord(song2.key).includes(value)) == [])

function directModulation(song1, song2) {
    let chords = []
    currentKey = song1.key
    keyIndex = keys.indexOf(currentKey)
    nextKey = song2.key
    nextKeyIndex = keys.indexOf(nextKey)
    chord1 = keys[keyIndex + 7]
    chord2 = keys[nextKeyIndex + 7]
    chords = [chord1, chord2]
    return chords
}
// IV = vii and vicevaersa, two common notes (if Major)
// II = VI and vicevarsa, two common notes (if minor)  
// I first need to do a triton substitution
// potrei provare dall'ultimo accord della prima canzone, il suo tritono e poi la quinta della prossima chiave
// e cosi tornare nella prima della prossima chiave. Senno: ii-V, poi ii-V del tritono e poi ii-V-I della nuova chiave

// preceduto da un if (song1.key == Mayor && (song2.key == song1.key + 5 || song2.key == song1.key + 11)
// || song1.key = minor && (song2.key == song1.key + 2 || song2.key == song1.key + 8))
function tritonModulation(song1, song2) {
    let chords = []
    currentKey = song1.key
    nexyKey = song2.key
    keyIndex = keys.indexOf(currentKey)
    tritonKeyIndex = keys.indexOf(currentKey) + 6
    nextKeyIndex = keys.indexOf(nextKey)
    nextKey = song2.key
    chord1 = keys[currentKey]
    chord2 = keys[currentKey + 2]
    chord3 = keys[currentKey + 7]
    chord4 = keys[tritonKey + 2]
    chord5 = keys[tritonKey + 7]
    chord6 = keys[nextKey + 2]
    chord7 = keys[nextKey + 7]
    chord8 = keys[nextKey]
    chords = [chord1, chord2, chord3, chord4, chord5, chord6, chord7, chord8]
    return chords
}

exports.noChordModulation = function(song1, song2) {
    let chords
    n = Math.ceil(Math.random() * 2)
    if (n == 1) {
        chords = directModulation(song1, song2)
    } else if (n == 2) {
        chords = tritonModulation(song1, song2)
    }
    return chords
}

// Chain modulation I go around the circleof fifths clock or counterclockwise and I do V, V7 in each step
// till I get to play the next song key tonal
exports.chainMOdulation = function(song1, song2) {
    let chords = []
    firstKey = song1.key
    firstFifthIndex = cycleF.indexOf(firstKey)
    secondKey = song2.key
    secondFifthKey = cycleF.indexOf(secondKey)
    n = secondFifthIndex - firstFifthIndex
    if (n > 0) {
        for (i = 0; i <= n; i + 2) {
            chord[i] = cycleF[firstFifthIndex + i]
            if (i != n) {
                chord[i + 1] = cycleF[firstFifthIndex + i] + '7'
            }
        }
    } else {
        n = -n
        for (i = 0; i <= n; i + 2) {
            chord[i] = cycleF[firstFifthIndex - i]
            if (i != n) {
                chord[i + 1] = cycleF[firstFifthIndex - i] + '7'
            }
        }

    }
    return chords
}

exports.parallelMod = function(song1) {
    let chords = []
    key = song1.key
    keyIndex = keys.indexOf(key)
    chord1 = key
    if (chord1.includes("-"))
        chord2 = chord1.replace("-", "^")
    else if (chord1.includes("^"))
        chord2 = chord1.replace("^", "-")
    chords = [chord1, chord2]
    return chords
}



// || (or)