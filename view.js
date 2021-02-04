//Model
let title
let composer
let style
let key
let bpm
let timeSignature
let chords
let connectChords

exports.changeState = function (song) {
    this.title = song.title
    this.composer = song.composer
    this.style = song.style
    this.key = song.key
    this.bpm = song.bpm
    this.timeSignature = song.music.timeSignature
    this.chords = song.music.measures
    console.log(this.composer)
}



function render() {

}