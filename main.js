(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//const TonePlayer = require('./TonePlayer');
const SimilarSongsRandomizer = require('./similarSongsRandomizer.js')
const View = require('./view.js')

let currentSong
let nextSong 
let currentMeasure = 0

exports.setCurrentMeasure = function(measureNum) {
    //Refers to the current played measure by TonePlayer
    currentMeasure = measureNum;
    //Change nella view la misura illuminata
}

function updateView(song, subMeasure) {
    View.changeState(song, subMeasure, viewIndex)
}


//Initialization
let initialSong = SimilarSongsRandomizer.getFirstRandomSong();
//TonePlayer.setCurrentSong(initialSong)
currentSong = initialSong
let measures = currentSong.music.measures
setKeyDropdown()


//TEST


function setCurrentMeasure(measureNum) {
    //Refers to the current played measure by TonePlayer
    currentMeasure = measureNum;
    scrollSubView()
    //Change nella view la misura illuminata
    updateView(currentSong, viewedBlock)
}


const maxSize = 24
let viewedBlock = []
let viewIndex = 0
let finalShift = 0
for (let i = 0; i < maxSize; i++) {
    viewedBlock.push(measures[i])  
}

//SIMULATION
let temp = 0
setCurrentMeasure(temp)
setInterval(function(){ 
    temp++; 
    if (temp == currentSong.music.measures.length)
        temp = 0
    setCurrentMeasure(temp)
}, 2000);

function scrollSubView() {
    viewIndex = (currentMeasure + finalShift) % maxSize
    //console.log("current mes: ", currentMeasure, "-->",circularMotion(currentMeasure, maxSize-1, measures.length))
    //console.log(viewedBlock[circularMotion(viewIndex, -1, maxSize)], "-->", measures[circularMotion(currentMeasure, maxSize - 1, measures.length)])

    viewedBlock[circularMotion(viewIndex, -1, maxSize)] = measures[circularMotion(currentMeasure, maxSize - 1, measures.length)]
    if (currentMeasure == measures.length - 1) {
        finalShift = ((currentMeasure % maxSize + 1) + finalShift) % maxSize
    }
    //console.log(finalShift)
}

function circularMotion(num, addSocNum, mod) {
    let ris
    //num sempre postivo, il secgno di addSocNum decice se l'operazione è una somma o una sottrazione
    if (addSocNum >= 0) {
        ris = num + addSocNum
        ris = ris % mod
    } else {
        let opposite = addSocNum + mod
        ris = num + opposite
        ris = ris % mod
    }
    return ris
}


function setKeyDropdown() {
    let noAlt = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
    let minor = ["A-", "Bb-", "B-", "C-", "C#-", "D-", "Eb-", "E-", "F-", "F#-", "G-", "G#-"] 

    let dropdown = document.getElementById("keys")
    
    if (currentSong.key.includes("-")) {
        console.log("OKS")
        for (let i = 0; i < dropdown.children.length; i++) {
            dropdown.children[i].textContent = minor[i]
            dropdown.children[i].value = minor[i]
        }
    } else {
        
        for (let i = 0; i < dropdown.children.length; i++) {
            dropdown.children[i].textContent = noAlt[i]
            dropdown.children[i].value = noAlt[i]
        }
    }
}

document.getElementById("onClickSubmit").onclick = function (){
    let nextKey = document.getElementById("keys").value
    if (currentSong.key == nextKey) {
        console.log("NOP")
        return
    }
    
}
},{"./similarSongsRandomizer.js":2,"./view.js":4}],2:[function(require,module,exports){
let songs = require('./test.json');

exports.getFirstRandomSong = function() {
    var firstSong = songs[Math.floor(Math.random() * songs.length)];
    //console.log(firstSong.title)
    //TEST 
    firstSong = songs[18]
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
},{"./test.json":3}],3:[function(require,module,exports){
module.exports=[{"title":"All Blues","composer":"Davis Miles","style":"Waltz","key":"G","transpose":null,"music":{"measures":[["G7"],["G7"],["G7"],["G7"],["G7"],["G7"],["G7"],["G7"],["C7/G"],["C7/G"],["C7/G"],["C7/G"],["G7"],["G7"],["G7"],["G7"],["D7#9"],["D7#9"],["Eb7#9"],["D7#9"],["G7"],["G7"],["G7"],["G7"]],"timeSignature":"34","raw":"[T34G7XyQKcl LZ x LZ x LZG7XyQKcl LZ x LZ x LZC7/GXyQKcl LZ x LZ x LZ|G7XyQKcl LZ x LZ x LZD7#9XyQKcl LZEb7#9XyQ|D7#9XyQ|G7XyQKcl LZ x LZ x  Z"},"bpm":0,"repeats":0},{"title":"All Of Me","composer":"Marks Gerald","style":"Medium Swing","key":"C","transpose":null,"music":{"measures":[["C^7"],["C^7"],["E7"],["E7"],["A7"],["A7"],["D-7"],["D-7"],["E7"],["E7"],["A-7"],["A-7"],["D7"],["D7"],["D-7"],["G7"],["C^7"],["C^7"],["E7"],["E7"],["A7"],["A7"],["D-7"],["D-7"],["F^7"],["F-6","F#o7"],["E-7","C^7/G"],["A7"],["D-7"],["G7"],["C6","Ebo7"],["D-7","G7"]],"timeSignature":"44","raw":"*A[T44C^7XyQKcl LZE7XyQKcl LZA7XyQKcl LZD-7XyQKcl  ]*B[E7XyQKcl LZA-7XyQKcl LZD7XyQKcl LZD-7XyQ|G7XyQ]*A[C^7XyQKcl LZE7XyQKcl LZA7XyQKcl LZD-7XyQKcl  ]*C[F^7XyQ|F-6(F#o7)XyQ|E-7(C^7/G)XyQ|A7XyQ|D-7XyQ|G7XyQ|C6 Ebo7LZD-7 G7 Z"},"compStyle":"Jazz-Medium Swing","bpm":90,"repeats":10},{"title":"Autumn Leaves","composer":"Kosma Joseph","style":"Medium Swing","key":"G-","transpose":null,"music":{"measures":[["C-7"],["F7"],["Bb^7"],["Eb^7"],["Ah7"],["D7b13"],["G-6"],["G-6"],["C-7"],["F7"],["Bb^7"],["Eb^7"],["Ah7"],["D7b13"],["G-6"],["G-6"],["Ah7"],["D7b13"],["G-6"],["G-6"],["C-7"],["F7"],["Bb^7"],["Eb^7"],["Ah7"],["D7b13"],["G-7","Gb7"],["F-7","E7"],["Ah7"],["D7b13"],["G-6"],["G-6"]],"timeSignature":"44","raw":"*A{T44C-7XyQ|F7XyQ|Bb^7XyQ|Eb^7XyQ|Ah7XyQ|D7b13XyQ|G-6XyQKcl  }*B[Ah7XyQ|D7b13XyQ|G-6XyQKcl LZC-7XyQ|F7XyQ|Bb^7XyQ|Eb^7XyQ]*C[Ah7XyQ|D7b13XyQ|G-7 Gb7LZF-7 E7LZAh7XyQ|D7b13XyQ|G-6XyQKcl  Z"},"bpm":0,"repeats":0},{"title":"Blue Bossa","composer":"Dorham Kenny","style":"Bossa Nova","key":"C-","transpose":null,"music":{"measures":[["C-7"],["C-7"],["F-7"],["F-7"],["Dh7"],["G7b9"],["C-7"],["C-7"],["Eb-7"],["Ab7"],["Db^7"],["Db^7"],["Dh7"],["G7b9"],["C-7"],["Dh7","G7b9"]],"timeSignature":"44","raw":"[T44C-7XyQKcl LZF-7XyQKcl LZDh7XyQ|G7b9XyQ|C-7XyQKcl LZEb-7XyQ|Ab7XyQ|Db^7XyQKcl LZDh7XyQ|G7b9XyQ|C-7XyQ|Dh7 G7b9 Z"},"compStyle":"Jazz-Bossa Nova","bpm":100,"repeats":10},{"title":"Blue In Green","composer":"Miles Davis, Bill Evans","style":"Ballad","key":"D-","transpose":null,"music":{"measures":[["G-6"],["A7#9"],["D-7","Db7"],["C-7","F7"],["Bb^7#11"],["A7#9"],["D-6"],["E7b13"],["A-7"],["D-7"],["G-6"],["A7#9"],["D-6"],["D-6"]],"timeSignature":"44","raw":"[T44G-6XyQ|A7#9XyQ|D-7 Db7LZC-7 F7LZBb^7#11XyQ|A7#9XyQ|D-6XyQ|E7b13XyQ|A-7XyQ|D-7  Q ZXyQXyQ  Y|QG-6XyQ|A7#9XyQ|D-6XyQ|fD-6   Z"},"bpm":0,"repeats":0},{"title":"Cantaloupe Island","composer":"Hancock Herbie","style":"Rock Pop","key":"F-","transpose":null,"music":{"measures":[["F-11"],["F-11"],["F-11"],["F-11"],["Db7#11"],["Db7#11"],["Db7#11"],["Db7#11"],["D-11"],["D-11"],["D-11"],["D-11"],["F-11"],["F-11"],["F-11"],["F-11"]],"timeSignature":"44","raw":"[T44F-11XyQKcl LZ x LZ x LZDb7#11XyQKcl LZ x LZ x LZD-11XyQKcl LZ x LZ x LZF-11XyQKcl LZ x LZ x  Z"},"bpm":0,"repeats":0},{"title":"Caravan","composer":"Ellington Duke","style":"Latin","key":"F-","transpose":null,"music":{"measures":[["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["F-"],["F-"],["F-"],["F-"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["F-"],["F-"],["F-"],["F-"],["F7"],["F7"],["F7"],["F7"],["Bb7"],["Bb7"],["Bb7"],["Bb7"],["Eb7"],["Eb7"],["Eb7"],["Eb7"],["Ab6"],["Ab6"],["G7"],["Db7"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["C7b9"],["F-"],["F-"],["F-"],["F-"]],"timeSignature":"44","raw":"*A{T44C7b9XyQKcl LZ x LZ x LZC7b9XyQKcl LZ x LZ x LZC7b9XyQKcl LZ x LZ x LZF-XyQKcl LZ x LZ x<Fine>  }Y*B[F7XyQKcl LZ x LZ x LZBb7XyQKcl LZ x LZ x LZEb7XyQKcl LZ x LZ x LZAb6XyQKcl LZG7XyQ<D.C. al Fine>|Db7   Z"},"bpm":0,"repeats":0},{"title":"Charleston, The","composer":"Johnson James","style":"Medium Up Swing","key":"Bb","transpose":null,"music":{"measures":[["Bb"],["D7"],["G7"],["G7"],["C7"],["F7"],["Bb","Dbo7"],["C-7","F7"],["Bb"],["D7"],["G7"],["Eo7"],["D-7"],["A7"],["D"],["F7"],["Bb"],["D7"],["G7"],["G7"],["C7"],["F7"],["Bb","Dbo7"],["C-7","F7"],["Bb7"],["Bb7"],["Eb7"],["Eb-7"],["Bb","G-7"],["C-7","F7"],["Bb"],["C-7","F7"]],"timeSignature":"44","raw":"[*AT44Bb,XyQ|D7XyQ|G7XyQKcl LZC7XyQ|F7XyQ|Bb, Dbo7LZC-7 F7 ][*BBb,XyQ|D7XyQ|G7XyQ|Eo7XyQ|D-7XyQ|A7XyQ|D,XyQ|F7XyQ][*ABb,XyQ|D7XyQ|G7XyQKcl LZC7XyQ|F7XyQ|Bb, Dbo7LZC-7 F7 ][*CBb7XyQKcl LZEb7XyQ|Eb-7XyQ|Bb, G-7LZC-7 F7LZBbXyQ|C-7 F7 Z "},"bpm":0,"repeats":0},{"title":"Desafinado","composer":"Jobim Antonio-Carlos","style":"Bossa Nova","key":"F","transpose":null,"music":{"measures":[["F^7"],["F^7"],["G7#11"],["G7#11"],["G-7"],["C7"],["Ah7"],["D7b9"],["G-7"],["A7b9"],["D7"],["D7b9"],["G7b9"],["G7b9"],["Gb^7"],["Gb^7"],["F^7"],["F^7"],["G7#11"],["G7#11"],["G-7"],["C7"],["Ah7"],["D7b9"],["G-7"],["Bb-6"],["F^7"],["E7#9"],["A^7"],["Bbo7"],["B-7"],["E7"],["A^7"],["Bbo7"],["B-7"],["E7"],["A^7"],["F#-7"],["B-7"],["E7"],["C^7"],["C#o7"],["D-7"],["G7"],["G-7"],["Eb-6"],["G7"],["C7b9"],["F^7"],["F^7"],["G7#11"],["G7#11"],["G-7"],["C7"],["Ah7"],["D7b9"],["G-7"],["Bb-6"],["F^7"],["D-7"],["G7"],["G7"],["Eb7"],["Eb7"],["G7"],["G-7","C7"],["F6"],["C7"]],"timeSignature":"44","raw":"*A[T44F^7LZxLZG7#11LZxLZG-7LZC7LZAh7LZD7b9LZG-7LZA7b9LZD7LZD7b9LZG7b9LZxLZGb^7LZx ]*A[F^7LZxLZG7#11LZxLZG-7LZC7LZAh7LZD7b9LZG-7LZBb-6LZF^7LZE7#9LZA^7LZBbo7LZB-7LZE7 ]*B[A^7LZBbo7LZB-7LZE7LZA^7LZF#-7LZB-7LZE7LZC^7LZC#o7LZD-7LZG7LZG-7LZEb-6LZG7LZC7b9 ]*A[F^7LZxLZG7#11LZxLZG-7LZC7LZAh7LZD7b9LZG-7LZBb-6LZF^7LZD-7LZG7LZxLZEb7LZxLZG7LZsG-7,C7,|lF6LZC7 Z"},"bpm":0,"repeats":0},{"title":"Dexterity","composer":"Parker Charlie","style":"Medium Up Swing","key":"Bb","transpose":null,"music":{"measures":[["Bb^7","G7"],["C-7","F7"],["D-7","G7"],["C-7","F7"],["F-7","Bb7"],["Eb^7","Ab7"],["D-7","G7"],["C-7","F7"],["Bb^7","G7"],["C-7","F7"],["D-7","G7"],["C-7","F7"],["F-7","Bb7"],["Eb^7","Ab7"],["C-7","F7"],["Bb6"],["D7"],["D7"],["G7"],["G7"],["C7"],["C7"],["F7"],["F7"],["Bb^7","G7"],["C-7","F7"],["D-7","G7"],["C-7","F7"],["F-7","Bb7"],["Eb^7","Ab7"],["C-7","F7"],["Bb6"]],"timeSignature":"44","raw":"{*AT44Bb^7 G7LZC-7 F7LZD-7 G7LZC-7 F7LZF-7 Bb7LZEb^7 Ab7LZN1D-7 G7LZC-7 F7 }XyQXyQ LZN2C-7 F7LZBb6XyQ][*BD7XyQKcl LZG7XyQKcl LZC7XyQKcl LZF7XyQKcl  ][*ABb^7 G7LZC-7 F7LZD-7 G7LZC-7 F7LZF-7 Bb7LZEb^7 Ab7LZC-7 F7LZBb6XyQZ "},"bpm":0,"repeats":0},{"title":"Freddie Freeloader","composer":"Davis Miles","style":"Medium Swing","key":"Bb","transpose":null,"music":{"measures":[["Bb7"],["Bb7"],["Bb7"],["Bb7"],["Eb7"],["Eb7"],["Bb7"],["Bb7"],["F7"],["Eb7"],["Ab7"],["Ab7"],["Bb7"],["Bb7"],["Bb7"],["Bb7"],["Eb7"],["Eb7"],["Bb7"],["Bb7"],["F7"],["Eb7"],["Bb7"],["Bb7"]],"timeSignature":"44","raw":"[T44Bb7XyQKcl LZ x LZ x LZEb7XyQKcl LZBb7XyQKcl LZF7XyQ|Eb7XyQ|N1Ab7XyQKcl  }XyQXyQ LZN2Bb7XyQKcl  Z"},"bpm":0,"repeats":0},{"title":"Giant Steps","composer":"Coltrane John","style":"Up Tempo Swing","key":"Eb","transpose":null,"music":{"measures":[["B^7","D7"],["G^7","Bb7"],["Eb^7"],["A-7","D7"],["G^7","Bb7"],["Eb^7","F#7"],["B^7"],["F-7","Bb7"],["Eb^7"],["A-7","D7"],["G^7"],["C#-7","F#7"],["B^7"],["F-7","Bb7"],["Eb^7"],["C#-7","F#7"]],"timeSignature":"44","raw":"[T44B^7 D7LZG^7 Bb7LZEb^7XyQ|A-7 D7LZG^7 Bb7LZEb^7 F#7LZB^7XyQ|F-7 Bb7LZEb^7XyQ|A-7 D7LZG^7XyQ|C#-7 F#7LZB^7XyQ|F-7 Bb7LZUEb^7XyQ|C#-7 F#7 Z"},"bpm":0,"repeats":0},{"title":"Girl From Ipanema, The","composer":"Jobim Antonio-Carlos","style":"Bossa Nova","key":"F","transpose":null,"music":{"measures":[["F^7"],["F^7"],["G7#11"],["G7#11"],["G-7"],["Gb7#11"],["F^7"],["Gb7"],["F^7"],["F^7"],["G7#11"],["G7#11"],["G-7"],["Gb7#11"],["F^7"],["F^7"],["F#^7"],["F#^7"],["B7"],["B7"],["F#-7"],["F#-7"],["D7"],["D7"],["G-7"],["G-7"],["Eb7"],["Eb7"],["A-7"],["D7b9b5"],["G-7"],["C7b9b5"],["F^7"],["F^7"],["G7#11"],["G7#11"],["G-7"],["Gb7#11"],["F^7"],["Gb7"]],"timeSignature":"44","raw":"*A{T44F^7XyQKcl LZG7#11XyQKcl LZG-7XyQ|Gb7#11XyQ|N1F^7XyQ|Gb7XyQ}XyQXyQ LZN2F^7XyQKcl  ]*B[F#^7XyQKcl LZB7XyQKcl LZF#-7XyQKcl LZD7XyQKcl LZG-7XyQKcl LZEb7XyQKcl LZA-7XyQ|D7b9b5XyQ|G-7XyQ|C7b9b5XyQ]*A[F^7XyQKcl LZG7#11XyQKcl LZG-7XyQ|Gb7#11XyQ|F^7XyQ|Gb7   Z"},"bpm":0,"repeats":0},{"title":"I Got Rhythm","composer":"Gershwin George","style":"Up Tempo Swing","key":"Bb","transpose":null,"music":{"measures":[["Bb6","G-7"],["C-7","F7"],["D-7","G-7"],["C-7","F7"],["Bb7","Bb7/D"],["Eb7","Eo7"],["Bb6/F","F7"],["Bb6","F7"],["Bb6","G-7"],["C-7","F7"],["D-7","G-7"],["C-7","F7"],["Bb7","Bb7/D"],["Eb7","Eo7"],["Bb6/F","F7"],["Bb6"],["D7"],["D7"],["G7"],["G7"],["C7"],["C7"],["F7"],["F7"],["Bb6","G-7"],["C-7","F7"],["D-7","G-7"],["C-7","F7"],["Bb7","Bb7/D"],["Eb7","Eo7"],["Bb6/F","F7"],["Bb6","F7"],["Bb6/F","Eb9"],["D-7","G7"],["C-7","F7"],["Bb6"]],"timeSignature":"44","raw":"*A{T44Bb6 G-7LZC-7 F7LZD-7 G-7LZC-7 F7LZBb7 Bb7/DLZEb7 Eo7LZBb6/F F7LZN1Bb6 F7 }XyQXyQXyQXyQ|N2Bb6XyQ]*B[D7XyQKcl LZG7XyQKcl LZC7XyQKcl LZF7XyQKcl  ]*A[Bb6 G-7LZC-7 F7LZD-7 G-7LZC-7 F7LZBb7 Bb7/DLZEb7 Eo7,QLZBb6/F F7LZBb6 < D.C.>F7 ZYQ|Bb6/F Eb9LZD-7 <Original takes Coda every time>G7LZC-7 F7LZBb6   Z"},"bpm":0,"repeats":0},{"title":"My Funny Valentine","composer":"Rodgers Richard","style":"Ballad","key":"Eb","transpose":null,"music":{"measures":[["C-6"],["Dh7","C-^7/B","G7b9"],["C-7","C-7/Bb"],["F7","C-6/A"],["Ab^7"],["F-7"],["Dh7"],["G7b9"],["C-6"],["Dh7","C-^7/B","G7b9"],["C-7","C-7/Bb"],["F7","C-6/A"],["Ab^7"],["F-7"],["Fh7","B7"],["Bb7"],["Eb^7","F-7"],["G-7","F-7"],["Eb^7","F-7"],["G-7","F-7"],["Eb^7","G7b9"],["C-7","B7","Bb-7","A7"],["Ab^7"],["Dh7","G7b9"],["C-6"],["Dh7","C-^7/B","G7b9"],["C-7","C-7/Bb"],["F7","C-6/A"],["Ab^7"],["Dh7","G7b9"],["C-7","B7"],["Bb-7","Eb7"],["Ab^7"],["F-7","Bb7"],["Eb6"],["Dh7","G7b9"]],"timeSignature":"44","raw":"*A[T44C-6XyQ|Dh7(C-^7/B) G7b9LZC-7(C-7/Bb)XyQ|F7(C-6/A)XyQ|Ab^7XyQ|F-7XyQ|Dh7XyQ|G7b9XyQ]*A[C-6XyQ|Dh7(C-^7/B) G7b9LZC-7(C-7/Bb)XyQ|F7(C-6/A)XyQ|Ab^7XyQ|F-7XyQ|Fh7(B7)XyQ|Bb7XyQ]*B[Eb^7 F-7LZG-7 F-7LZEb^7 F-7LZG-7 F-7LZEb^7 G7b9LZsC-7,B7,Bb-7,A7,l|Ab^7XyQ|Dh7 G7b9 ]*C[C-6XyQ|Dh7(C-^7/B) G7b9LZC-7(C-7/Bb)XyQ|F7(C-6/A)XyQ|Ab^7XyQ|Dh7 G7b9LZC-7 B7LZBb-7 Eb7LZAb^7XyQ|F-7 Bb7LZUEb6XyQ|Dh7 G7b9 Z"},"bpm":0,"repeats":0},{"title":"New York, New York","composer":"Kander John","style":"Medium Swing","key":"F","transpose":null,"music":{"measures":[["F"],["F"],["G-7"],["C7"],["F"],["F"],["G-7"],["C7"],["F"],["F"],["G-7"],["C7"],["F"],["F"],["C-7"],["F7"],["Bb"],["Bb-"],["F"],["F"],["A-7"],["D7"],["G-7"],["C7"],["F"],["F"],["G-7"],["C7"],["F"],["F"],["C-7"],["F7"],["Bb"],["Bb-"],["F/C"],["D7"],["G-7","A-7"],["Bb","C7"],["F"],["F"],["G-7"],["C7"]],"timeSignature":"44","raw":"*A{T44FXyQKcl LZG-7XyQ|C7XyQ|FXyQKcl LZN1G-7XyQ|C7XyQ}|N2C-7XyQ|F7XyQ*B[BbXyQ|Bb-XyQ|FXyQKcl LZA-7XyQ|D7XyQ|G-7XyQ|C7XyQ*A[FXyQKcl LZG-7XyQ|C7XyQ|FXyQKcl LZC-7XyQ|F7XyQ|BbXyQ|Bb-XyQ|F/CXyQ|D7XyQ|G-7 A-7LZBb C7LZFXyQKcl LZG-7XyQ|C7   Z"},"bpm":0,"repeats":0},{"title":"Night In Tunisia, A","composer":"Gillespie Dizzy","style":"Latin","key":"D-","transpose":null,"music":{"measures":[["Eb7"],["D-"],["Eb7"],["D-"],["Eb7"],["D-"],["Eh7","A7b9"],["D-"],["Eb7"],["D-"],["Eb7"],["D-"],["Eb7"],["D-"],["Eh7","A7b9"],["D-"],["Ah7"],["D7b9"],["G-7"],["G-7"],["Gh7"],["C7b9"],["F^7"],["Eh7","A7b9"],["Eb7"],["D-"],["Eb7"],["D-"],["Eb7"],["D-"],["Eh7","A7b9"],["D-"],["Eh7"],["Eh7"],["Eb7#11"],["Eb7#11"],["D-7"],["D-7"],["G7#11"],["G7#11"],["G-^7"],["G-7"],["Gb7#9"],["Gb7#9"],["F^7"],["F^7"],["Eh7"],["A7b9"]],"timeSignature":"44","raw":"*A{T44Eb7XyQ|D-XyQ|Eb7XyQ|D-XyQ|Eb7XyQ|D-XyQ|Eh7 A7b9LZD-XyQ}*B[Ah7XyQ|D7b9XyQ|G-7XyQKcl LZGh7XyQ|C7b9XyQ|F^7XyQ|Eh7 A7b9 ]*A[Eb7XyQ|D-XyQ|Eb7XyQ|D-XyQ|Eb7XyQ|D-XyQ|Eh7 A7b9LZD-  Q ZYQ[Eh7XyQKcl LZEb7#11XyQKcl LZD-7XyQKcl LZG7#11XyQKcl LZG-^7XyQ|G-7XyQ|Gb7#9XyQKcl LZF^7XyQKcl LZEh7XyQ|A7b9   Z"},"bpm":0,"repeats":0},{"title":"Ruby, My Dear","composer":"Monk Thelonious","style":"Ballad","key":"Eb","transpose":null,"music":{"measures":[["F-9","Bb7b9"],["Eb^7","F-7","F#-7","G-7","Ab6","A6"],["G-7","C7b9"],["F^7","G-7","Ab-7","A-7"],["Bb-7","Eb7b9"],["Ab^7","Bb-7","B-7","C-7"],["Bb-7","E13"],["B-7","Bb7b5","Bb7#5"],["F-9","Bb7b9"],["Eb^7","F-7","F#-7","G-7","Ab6","A6"],["G-7","C7b9"],["F^7","G-7","Ab-7","A-7"],["Bb-7","Eb7b9"],["Ab^7","Bb-7","B-7","C-7"],["Bb-7","E13"],["B-11","Bb7b5"],["A^7"],["B-7","E13b9"],["A69"],["Bb6","Bo7"],["C-7","C-^7","C-7"],["C-^7","D-7"],["Eb-7"],["Ab7b5","Eb7#9"],["F-9","Bb7b9"],["Eb^7","F-7","F#-7","G-7","Ab6","A6"],["G-7","C7b9"],["F^7","G-7","Ab-7","A-7"],["Bb-7","Eb7b9"],["Ab^7","Bb-7","B-7","C-7"],["Bb-7","E13"],["Gb69","B7b9","Bb7b9"],["Gb69","B7b9","Bb7b9"],["A7b5"],["Ab7b5"],["Db69"]],"timeSignature":"44","raw":"Y{*AT44F-9 Bb7b9LZEb^7  (F-7) (F#-7) (G-7) (Ab6) (A6)|G-7 C7b9 LZ|F^7, (G-7) (Ab-7) (A-7)|Bb-7 Eb7b9,LZAb^7 (Bb-7) (B-7) (C-7)|Bb-7 E13LZN1B-7,XyQBb7b5, Bb7#5 }N2B-11 Bb7b5  ]XyQ[*BA^7XyQ|B-7 E13b9LZA69XyQ|sBb6,Bo7,pp|C-7,C-^7 C-7,|lC-^7 D-7LZEb-7XyQ|Ab7b5 Eb7#9, ][*AF-9 Bb7b9LZEb^7  (F-7) (F#-7) (G-7) (Ab6) (A6)|G-7 C7b9 LZ|F^7, (G-7) (Ab-7) (A-7)|Bb-7 Eb7b9,LZAb^7 (Bb-7) (B-7) (C-7)|Bb-7 E13,QLZ|Gb69 B7b9 Bb7b9 p ZXyQXyQ  Y[Q</>Gb69  </>B7b9, </>Bb7b9LZA7b5 LZAb7b5 LZDb69  Z "},"bpm":0,"repeats":0},{"title":"So What","composer":"Davis Miles","style":"Up Tempo Swing","key":"D-","transpose":null,"music":{"measures":[["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["Eb-11"],["Eb-11"],["Eb-11"],["Eb-11"],["Eb-11"],["Eb-11"],["Eb-11"],["Eb-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"],["D-11"]],"timeSignature":"44","raw":"*A[T44D-11XyQKcl LZ x LZ x LZD-11XyQKcl LZ x LZ x  ]*A[D-11XyQKcl LZ x LZ x LZD-11XyQKcl LZ x LZ x  ]*B[Eb-11XyQKcl LZ x LZ x LZEb-11XyQKcl LZ x LZ x  ]*A[D-11XyQKcl LZ x LZ x LZD-11XyQKcl LZ x LZ x  Z"},"bpm":0,"repeats":0},{"title":"St. Thomas","composer":"Rollins Sonny","style":"Latin","key":"C","transpose":null,"music":{"measures":[["C^7","F7"],["E-7","A7"],["D-7","G7"],["C6"],["C^7","F7"],["E-7","A7"],["D-7","G7"],["C6"],["Eh7"],["A7b9"],["D-7"],["G7"],["C^7","C7/E"],["F^7","F#o7"],["G7"],["C6"]],"timeSignature":"44","raw":"[T44C^7 F7LZE-7 A7LZD-7 G7LZC6XyQ|C^7 F7LZE-7 A7LZD-7 G7LZC6XyQ|Eh7XyQ|A7b9XyQ|D-7XyQ|G7XyQ|C^7 C7/ELZF^7 F#o7LZG7XyQ|C6   Z"},"bpm":0,"repeats":0},{"title":"Take The A Train","composer":"Strayhorn Billy","style":"Medium Up Swing","key":"C","transpose":null,"music":{"measures":[["C6"],["C6"],["D7#11"],["D7#11"],["D-7"],["G7"],["C6"],["D-7","G7"],["C6"],["C6"],["D7#11"],["D7#11"],["D-7"],["G7"],["C6"],["G-7","C7"],["F^7"],["F^7"],["F^7"],["F^7"],["D7"],["D7"],["D-7"],["G7","G7b9"],["C6"],["C6"],["D7#11"],["D7#11"],["D-7"],["G7"],["C6"],["D-7","G7"]],"timeSignature":"44","raw":"*A{T44C6XyQKcl LZD7#11XyQKcl LZD-7XyQ|G7XyQ|N1C6XyQ|D-7 G7 }XyQXyQ LZN2C6XyQ|G-7 C7 ]*B[F^7XyQKcl LZ x LZ x LZD7XyQKcl LZD-7XyQ|G7 G7b9 ]*A[C6XyQKcl LZD7#11XyQKcl LZD-7XyQ|G7XyQ|C6XyQ|D-7 G7 Z"},"compStyle":"Jazz-Medium Up Swing","bpm":100,"repeats":10},{"title":"Waltz For Debby","composer":"Evans Bill","style":"Waltz","key":"F","transpose":null,"music":{"measures":[["F^7/A"],["D-7"],["G-7"],["C7"],["A7/G"],["D7/F#"],["G7/F"],["C7/E"],["F7/Eb"],["Bb6/D"],["Gh7/Db"],["C7"],["A-7"],["D-7"],["G-7"],["C7"],["F^7/A"],["D-7"],["G-7"],["C7"],["A7/C#"],["D7/C"],["G7/B"],["C7/Bb"],["A7"],["D-7"],["B7"],["E7"],["A^7/C#"],["A^7/B"],["A^7"],["A^7/G#"],["G-7"],["C7"],["A-7"],["D7"],["G-7"],["A7"],["D-7"],["C-7"],["Bb^7"],["A7"],["D-7"],["G7"],["Ab^7"],["Db^7"],["G-7"],["C7"],["F^7/A"],["D-7"],["G-7"],["C7"],["A7/G"],["D7/F#"],["G7/F"],["C7/E"],["F7/Eb"],["Bb6/D"],["Gh7/Db"],["C7"],["A-7"],["D-7"],["B-7"],["E7"],["A-7"],["F7"],["Bb^7"],["A7alt"],["D-7"],["D-7"],["G7"],["G#o7"],["A-7/C"],["Abo7/C"],["G-7/C"],["C7"],["F6"],["D-7"],["G-7"],["C7"]],"timeSignature":"34","raw":"*A[T34F^7/ALZD-7LZG-7LZC7LZA7/GLZD7/F#LZG7/FLZC7/ELZF7/EbLZBb6/DLZGh7/DbLZC7LZA-7LZD-7LZG-7LZC7LZF^7/ALZD-7LZG-7LZC7LZA7/C#LZD7/CLZG7/BLZC7/BbLZA7LZD-7LZB7LZE7LZA^7/C#LZA^7/BLZA^7LZA^7/G# ]*B[G-7LZC7LZA-7LZD7LZG-7LZA7LZD-7LZC-7LZBb^7LZA7LZD-7LZG7LZAb^7LZDb^7LZG-7LZC7 ]*A[F^7/ALZD-7LZG-7LZC7LZA7/GLZD7/F#LZG7/FLZC7/ELZF7/EbLZBb6/DLZGh7/DbLZC7LZA-7LZD-7LZB-7LZE7LZA-7LZF7LZBb^7LZA7altLZD-7LZxLZG7LZG#o7LZA-7/CLZAbo7/CLZG-7/CLZC7LZF6LZD-7LZG-7LZC7 Z"},"bpm":0,"repeats":0}]
},{}],4:[function(require,module,exports){
//Model
let title
let composer
let style
let key
let bpm
let timeSignature
let chords = []
let currentMeasure
let connectChords

//Dom elements
const chordPanel = document.getElementById("chords")
const titleDiv = document.getElementById("songTitle")
const composerDiv = document.getElementById("composer")
const styleAndKeyDiv = document.getElementById("styleAndKey")
//Grid generation
for (let i = 0; i < 24; i++) {
    let div = document.createElement("div");
    div.id = "cell" + i
    div.classList.add("cell")
    chordPanel.appendChild(div)
}

exports.changeState = function (song, subMeasure, currentMeas) {
    title = song.title
    composer = song.composer
    style = song.style
    key = song.key
    bpm = song.bpm
    timeSignature = song.music.timeSignature
    currentMeasure = currentMeas
    //Copy all measures
    for (let i = 0; i < 24; i++)
        chords.pop()
    for (let i = 0; i < 24; i++) {
        let temp = subMeasure[i]
        chords.push(temp)
    }
    render()
}



function render() {
    //Render chords
    for (let i = 0; i < chordPanel.children.length; i++) {
        chordPanel.children[i].textContent = chords[i]
        if (i == currentMeasure)
            chordPanel.children[i].classList.add("selectedCell")
        else 
            chordPanel.children[i].classList.remove("selectedCell")
    }

    //Render sidebar panel
    titleDiv.textContent = title
    composerDiv.textContent = composer
    styleAndKeyDiv.textContent = style + " in " + key

}
},{}]},{},[1]);
