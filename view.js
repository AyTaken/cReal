//Model
let title
let composer
let style
let key
let bpm
let timeSignature
let chords = []
let currentMeasure
let connectChords = []
let connectChordsIndex
let lastChord

//Dom elements
const chordPanel = document.getElementById("chords")
const chordPanelConnect = document.getElementById("connectChords")
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


exports.changeState = function (song, subMeasure, currentMeas, harmonicConnectChords, harmonicConnectIndex, ls) {
    title = song.title
    composer = song.composer
    style = song.style
    key = song.key
    bpm = song.bpm
    timeSignature = song.music.timeSignature
    currentMeasure = currentMeas
    connectChords = harmonicConnectChords
    connectChordsIndex = harmonicConnectIndex
    lastChord = ls
    //Copy all measures
    for (let i = 0; i < 24; i++)
        chords.pop()
    for (let i = 0; i < 24; i++) {
        let temp = subMeasure[i]
        if (temp == undefined) {
            chords.push([[]])
        } else {
            chords.push(temp)
        }

    }

    render()
}



function render() {
    //REMOVE PREVIOUS CHORDS
    for (let i = 0; i < chordPanel.children.length; i++) {
        let idCell = "cell" + i
        let divMeasures = document.getElementById(idCell)
        while (divMeasures.firstChild) {
            divMeasures.removeChild(divMeasures.lastChild);
        }
    }

    //Render chords
    for (let i = 0; i < chordPanel.children.length; i++) {

        for (let j = 0; j < chords[i].length; j++) {
            let divMea = document.createElement("div")
            divMea.classList.add("measure")
            divMea.textContent = chords[i][j]
            chordPanel.children[i].appendChild(divMea)
        }

        if (i == currentMeasure)
            chordPanel.children[i].classList.add("selectedCell")
        else
            chordPanel.children[i].classList.remove("selectedCell")



    }


    //REMOVE PREVIOUS CHORDS
    for (let i = 0; i < chordPanelConnect.children.length; i++) {
        let idCell = "cellHarmonic" + i
        let divMeasures = document.getElementById(idCell)
        while (divMeasures.firstChild) {
            divMeasures.removeChild(divMeasures.lastChild);
        }
    }

    //Render harmonic connect
    for (let i = 0; i < chordPanelConnect.children.length; i++) {
        for (let j = 0; j < connectChords[i].length; j++) {
            let divMea = document.createElement("div")
            divMea.classList.add("measure")
            divMea.textContent = connectChords[i][j]
            chordPanelConnect.children[i].appendChild(divMea)
        }
        //chordPanelConnect.children[i].textContent = connectChords[i]
        if (i == connectChordsIndex)
            chordPanelConnect.children[i].classList.add("selectedCellHarm")
        else
            chordPanelConnect.children[i].classList.remove("selectedCellHarm")
    }

    //Render sidebar panel
    titleDiv.textContent = title
    composerDiv.textContent = composer
    styleAndKeyDiv.textContent = style + " in " + key

}