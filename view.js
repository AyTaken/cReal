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