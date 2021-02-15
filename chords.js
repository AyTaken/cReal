const chromaSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

exports.getNotesChord = function (chord) {
    //rqi stands for root, quality, inversion: it is an array containing the chord informations
    let rqi = parse(chord)
    let mask = getMask(rqi[1])

    //we exploit the enharmonic proprerty of the b/#, reducing the
    //problem of finding the notes only to the sharp case, we need only to play them
    if (rqi[0].includes('b'))
        rqi[0] = chromaSharpNormalization(rqi[0]);
    if (rqi[2].includes('b'))
        rqi[2] = chromaSharpNormalization(rqi[2]);

    return notes(rqi[0], mask, rqi[2])

}

//TEST
/*let test =
    ['5', '2', 'add9', '+', 'o', 'h', 'sus', '^', '-', '^7', '-7', '7', '7sus', 'h7', 'o7', '^9', '^13', '6', '69', '^7#11', '^9#11', '^7#5', '-6', '-69', '-^7', '-^9', '-9', '-11', '-7b5', 'h9', '-b6', '-#5', '9', '7b9', '7#9', '7#11', '7b5', '7#5', '9#11', '9b5', '9#5', '7b13', '7#9#5', '7#9b5', '7#9#11', '7b9#11', '7b9b5', '7b9#5', '7b9#9', '7b9b13', '7alt', '13', '13#11', '13b9', '13#9', '7b9sus', '7susadd3', '9sus', '13sus', '7b13sus', '11']

for (let i = 0; i < test.length; i++) {
    let chord = 'B' + test[i] + '/D'
    console.log(chord, ":", getNotesChord(chord))
}
function getNotesChord(chord) {
    //rqi stands for root, quality, inversion: it is an array containing the chord informations
    let rqi = parse(chord)
    let mask = getMask(rqi[1])

    //we exploit the enharmonic proprerty of the b/#, reducing the
    //problem of finding the notes only to the sharp case, we need only to play them
    if (rqi[0].includes('b'))
        rqi[0] = chromaSharpNormalization(rqi[0]);
    if (rqi[2].includes('b'))
        rqi[2] = chromaSharpNormalization(rqi[2]);

    return notes(rqi[0], mask, rqi[2])

}*/


function parse(chord) {
    let root
    let quality = []
    let inversion = []

    let point = 1
    if (chord.length > 1 && (chord[1] == 'b' || chord[1] == '#')) {
        root = chord[0] + chord[1]
        point = 2
    }
    else
        root = chord[0]

    if (chord.includes('/')) {
        for (; point < chord.indexOf('/'); point++)
            quality.push(chord[point])
        for (let index = chord.indexOf('/') + 1; index < chord.length; index++)
            inversion.push(chord[index])
    } else {
        for (; point < chord.length; point++)
            quality.push(chord[point])
    }

    return [root, quality.join(''), inversion.join('')];
}

function chromaSharpNormalization(note) {
    switch (note) {
        case 'Db':
            return 'C#'
        case 'Eb':
            return 'D#'
        case 'Gb':
            return 'F#'
        case 'Ab':
            return 'G#'
        case 'Bb':
            return "A#"
    }
}

function notes(root, mask, inversion) {
    let keyboard = []

    //Keyboard creation
    for (let i = 0; i < 6; i++)
        for (let k = 0; k < chromaSharp.length; k++)
            keyboard.push(chromaSharp[k] + i)

    //Chord note selection        
    let chordNotes = []
    let rootIndex
    if (root == 'C' || root == 'D' || root == 'E' || root == 'F')
        rootIndex = keyboard.indexOf(root + '3');
    else
        rootIndex = keyboard.indexOf(root + '2');

    for (let i = 0; i < mask.length; i++)
        chordNotes.push(keyboard[rootIndex + mask[i]])


    if (inversion != '') {
        let temp = []
        let index

        for (let i = 0; i < chordNotes.length; i++)
            temp.push(chordNotes[i].slice(0, chordNotes[i].length - 1))

        index = temp.indexOf(inversion)

        if (index != -1) {
            let dist = keyboard.indexOf(chordNotes[index]) - keyboard.indexOf(chordNotes[0])

            //In case of extentions over more octaves
            dist = dist % 12
            dist = 12 - dist

            chordNotes[index] = keyboard[keyboard.indexOf(chordNotes[0]) - dist]
        }
    }

    return chordNotes
}













function getMask(quality) {
    let ris
    switch (quality) {
        case '5':
            //Power chord
            ris = [0, 7]
            break;
        case '2':
            //Major triad + major 2nd
            ris = [0, 2, 4, 7]
            break;
        case 'add9':
            //Major triad + 9th
            ris = [0, 4, 7, 14]
            break;
        case '+':
            //Augmented major triad
            ris = [0, 4, 8]
            break;
        case 'o':
            //Diminished minor triad
            ris = [0, 3, 6]
            break;
        case 'h':
            //Diminished major triad
            ris = [0, 4, 6]
            break;
        case 'sus':
            //Major triad + 4th - major 3rd
            ris = [0, 5, 7]
            break;
        case '^':
            //Major triad
            ris = [0, 4, 7]
            break;
        case '-':
            //Minor triad
            ris = [0, 3, 7]
            break;
        case '^7':
            //Major 7th
            ris = [0, 4, 7, 11]
            break;
        case '-7':
            //Minor 7th
            ris = [0, 3, 7, 10]
            break;
        case '7':
            //Dominant 7th
            ris = [0, 4, 7, 10]
            break;
        case '7sus':
            //Dominant 7th sus4
            ris = [0, 5, 7, 10]
            break;
        case 'h7':
            //Half-diminished 7th
            ris = [0, 3, 6, 10]
            break;
        case 'o7':
            //Diminished 7th
            ris = [0, 3, 6, 9]
            break;
        case '^9':
            //Major 9th
            ris = [0, 4, 7, 11, 14]
            break;
        case '^13':
            //Major 13th
            ris = [0, 4, 7, 11, 14, 17, 21]
            break;
        case '6':
            //Major 6th
            ris = [0, 4, 7, 9]
            break;
        case '69':
            //Major 6th 9th
            ris = [0, 4, 7, 9, 14]
            break;
        case '^7#11':
            //Major 7th #11
            ris = [0, 4, 7, 11, 18]
            break;
        case '^9#11':
            //Major 9th #11
            ris = [0, 4, 7, 11, 14, 18]
            break;
        case '^7#5':
            //Major 7th #5
            ris = [0, 4, 8, 11]
            break;
        case '-6':
            //Minor 6th 
            ris = [0, 3, 7, 9]
            break;
        case '-69':
            //Minor 6th 9th
            ris = [0, 3, 7, 9, 14]
            break;
        case '-^7':
            //Minor 6th 9th
            ris = [0, 3, 7, 11]
            break;
        case '-^9':
            //Minor 6th 9th
            ris = [0, 3, 7, 11, 14]
            break;
        case '-9':
            //Minor 9th
            ris = [0, 3, 7, 10, 14]
            break;
        case '-11':
            //Minor 11th
            ris = [0, 3, 7, 10, 14, 17]
            break;
        case '-7b5':
            //Minor 7th b5
            ris = [0, 3, 6, 10]
            break;
        case 'h9':
            //Half-diminished 9th
            ris = [0, 3, 6, 10, 14]
            break;
        case '-b6':
            //Minor b6
            ris = [0, 3, 7, 8]
            break;
        case '-#5':
            //Minor #5
            ris = [0, 3, 7, 8]
            break;
        case '9':
            //Dominant 9th
            ris = [0, 4, 7, 10, 14]
            break;
        case '7b9':
            //Dominant 7th b9
            ris = [0, 4, 7, 10, 13]
            break;
        case '7#9':
            //Dominant 7th #9
            ris = [0, 4, 7, 10, 15]
            break;
        case '7#11':
            //Dominant 7th #11
            ris = [0, 4, 7, 10, 18]
            break;
        case '7b5':
            //Dominant 7th b5
            ris = [0, 4, 7, 10, 13]
            break;
        case '7#5':
            //Dominant 7th #5
            ris = [0, 4, 8, 10]
            break;
        case '9#11':
            //Dominant 9th #11
            ris = [0, 4, 7, 10, 14, 18]
            break;
        case '9b5':
            //Dominant 9th b5
            ris = [0, 4, 6, 10, 14]
            break;
        case '9#5':
            //Dominant 9th #5
            ris = [0, 4, 8, 10, 14]
            break;
        case '7b13':
            //Dominant 7th b13
            ris = [0, 4, 7, 10, 20]
            break;
        case '7#9#5':
            //Dominant 7th #9 #5
            ris = [0, 4, 8, 10, 15]
            break;
        case '7#9b5':
            //Dominant 7th #9 b5
            ris = [0, 4, 6, 10, 15]
            break;
        case '7#9#11':
            //Dominant 7th #9 #11
            ris = [0, 4, 7, 10, 15, 18]
            break;
        case '7b9#11':
            //Dominant 7th b9 #11
            ris = [0, 4, 7, 10, 13, 18]
            break;
        case '7b9b5':
            //Dominant 7th b9 b5
            ris = [0, 4, 6, 10, 13]
            break;
        case '7b9#5':
            //Dominant 7th b9 #5
            ris = [0, 4, 8, 10, 13]
            break;
        case '7b9#9':
            //Dominant 7th b9 #9
            ris = [0, 4, 7, 10, 13, 15]
            break;
        case '7b9b13':
            //Dominant 7th b9 b13
            ris = [0, 4, 7, 10, 13, 20]
            break;
        case '7alt':
            //Dominant 7th with altered extentions as choise
            ris = [0, 4, 7, 10]
            break;
        case '13':
            //Dominant 13th
            ris = [0, 4, 7, 10, 14, 21]
            break;
        case '13#11':
            //Dominant 13th #11
            ris = [0, 4, 7, 10, 14, 18, 21]
            break;
        case '13b9':
            //Dominant 13th b9
            ris = [0, 4, 7, 10, 13, 21]
            break;
        case '13#9':
            //Dominant 13th #9
            ris = [0, 4, 7, 10, 15, 21]
            break;
        case '7b9sus':
            //Dominant 7th b9 without third with perfect 4th
            ris = [0, 5, 7, 10, 13]
            break;
        case '7susadd3':
            //Dominant 7th without third + perfect 4th, major 3rd
            ris = [0, 4, 5, 7, 10, 13]
            break;
        case '9sus':
            //Dominant 9th no M3 + P4
            ris = [0, 5, 7, 10, 14]
            break;
        case '13sus':
            //Dominant 13th no M3 + P4 
            ris = [0, 5, 7, 10, 14, 21]
            break;
        case '7b13sus':
            //Dominant 7th b13 no M3 + P4
            ris = [0, 5, 7, 10, 20]
            break;
        case '11':
            //Dominant 11th
            ris = [0, 4, 7, 10, 14, 17]
            break;


        default:
            //Dominant 7th
            ris = [0, 4, 7, 10]
            break;
    }

    return ris;
}