// MODULATIONS

// CYCLE OF FIFTHS

const cycleF = ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A", "F"]
const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const modes = ["M", "m", "m", "M", "M", "m", "dim"]
    // There are 4 comon chords for two keys next to each other, if I jump one key, only two are in common
    // (1) first, third, 4th, fifth, (2) third, fifth
    // Pre dom IV & ii (ii is the relative minor in the next key!)
    // I start the modulation in the two chord, because it becomes the relative minor in the new key
    // Pre dom are the common chords for modulation

// Scheletro diatonic modulation

function DiaMod(song) {
    currentFifthIndex = cycleF.indexOf(song.key)
    currentKeyIndex = keys.indexOf(song.key)
    n = Math.ceil(Math.random() * 5)
    nextFifthIndex = currentFifthIndex
    if (n == 1) {
        nextFifthIndex = currentKFifthndex + 1
        firstChordModulation = currentKeyIndex + 4
        secondChordModulation = currentKeyIndex + 9
        currentKeyIndex = keys.indexOf(nextFifthIndex)
        thirdChordModulation = currentKeyIndex + 7
    } else if (n == 2) {
        nextFifthIndex = currentFifthIndex + 2
        firstChordModulation = currentKeyIndex + 4
        secondChordModulation = currentKeyIndex + 9
        currentKeyIndex = keys.indexOf(nextFifthIndex)
        thirdChordModulation = currentKeyIndex + 7
    } else if (n = 3) {
        nextFifthIndex = currentFifthIndex - 1
        firstChordModulation = currentKeyIndex + 7
        currentKeyIndex = keys.indexOf(nextFifthIndex)
        secondChordModulation = currentKeyIndex + 9
        thirdChordModulation = currentKeyIndex + 4
    } else if (n = 4) {
        nextFifthIndex = currentFifthIndex - 2
        firstChordModulation = currentKeyIndex + 7
        currentKeyIndex = keys.indexOf(nextFifthIndex)
        secondChordModulation = currentKeyIndex + 9
        thirdChordModulation = currentKeyIndex + 4
    }
}

// Chormatic Pivot CHORD
// From C to E minor
// Chromatic pivot chord is a chod not contained in the first key
// I vii vii (next chord) i

// I, II, iii, IV, V, vi, vii dim
// VI, vii, i, ii#, III, iv, v

function pivotChord(song_1, song_2) {
    currentKeyIndex = keys.indexOf(song_1.key)
    nextKeyIndex = keys.indexOf(song_2.key)
    firstChordModulation = currentKeyIndex + 11;
    currentKeyIndex = nextKeyIndex
    SecondChordMudaltion = currentKeyIndex + 11;
}

// Enharmonic dominant
// if the next key dominant equals the augmented sixth of the current key
// I just need this chord as modulation
// it should work only in the case that I'm changin of half-step (is that what sarti asked?)





// Deceptive Cadence
// Dominant chord in a major key goes to the sixth
// If from a major I wanto to go to relative minor I play IV, V, vi (that is our next key i)
// vii, iii (that is ii, v) and then (now I'm in the new key) i of relative minor

function DeceptiveCadence(song) {
    currentkey = song.key
    keyIndex = keys.indexOf(currentKey)
    chord1 = currentKey
    chord2 = currentKey + 5
    chord3 = currentKey + 7
    chord4 = currentKey + 9
    currentKey = chord4
    chord5 = currentKey + 3
    chord6 = currentKey + 7
    chord7 = currentKey
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

if (Chord.getNotesChord(song1.key).filter(value => Chord.getNotesChord(song2.key).includes(value)) == [])

function directModulation(song1, song2) {
    currentKey = song1.key
    keyIndex = keys.indexOf(currentKey)
    nextKey = song2.key
    chord1 = currentKey + 7
    currentKey = nextKey
    chord2 = currentKey + 7
}
// IV = vii and vicevaersa, two common notes (if Major)
// II = VI and vicevarsa, two common notes (if minor)  
// I first need to do a triton substitution
// potrei provare dall'ultimo accord della prima canzone, il suo tritono e poi la quinta della prossima chiave
// e cosi tornare nella prima della prossima chiave. Senno: ii-V, poi ii-V del tritono e poi ii-V-I della nuova chiave

// preceduto da un if (song1.key == Mayor && (song2.key == song1.key + 5 || song2.key == song1.key + 11)
// || song1.key = minor && (song2.key == song1.key + 2 || song2.key == song1.key + 8))
function tritonModulation(song1, song2) {
    currentKey = song1.key
    tritonKey = currentKey + 6
    nextKey = song2.key
    chord1 = currentKey
    chord2 = currentKey + 2
    chord3 = currentKey + 7
    currentKey = tritonKey
    chord4 = currentKey + 2
    chord5 = currentKey + 7
    currentKey = nextKey
    chord6 = currentKey + 2
    chord7 = currentKey + 7
    chord8 = currentKey

}

function noChordModulation() {
    n = Math.ceil(Math.random() * 2)
    if (n == 1)
        directModulation(song1, song2)
    else if (n == 2)
        tritonModulation(song1, song2)
}


// || (or)