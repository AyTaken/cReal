//Model
let title
let composer
let style
let key
let bpm
let timeSignature
let chords = []
let connectChords

//Dom elements
const chordPanel = document.getElementById("chords")
const titleDiv = document.getElementById("songTitle")
const composerDiv = document.getElementById("composer")
const styleAndKeyDiv = document.getElementById("styleAndKey")

exports.changeState = function (song) {
    title = song.title
    composer = song.composer
    style = song.style
    key = song.key
    bpm = song.bpm
    timeSignature = song.music.timeSignature
    //Copy all measures
    for (let i = 0; i < song.music.measures.length; i++) {
        let temp = song.music.measures[i]
        chords.push(temp)
    }
    render()
}



function render() {
    //Render chords
    for (let i = 0; i < chords.length; i++) {
        let div = document.createElement("div");
        div.id = "cell" + i
        div.classList.add("cell")
        div.textContent = chords[i]
        chordPanel.appendChild(div)
    }

    //Render sidebar panel
    titleDiv.textContent = title
    composerDiv.textContent = composer
    styleAndKeyDiv.textContent = style + " in " + key
    console.log(title)

}