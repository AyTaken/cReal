const { Tone } = require("tone/build/esm/core/Tone")

let button = document.getElementById("btn")
button.onclick = function() {
    state = "play"
    play(currentSong)
}

// seconda prova con sequence
function play(song) {
    song = currentSong
    Tone.Transport.bpm.value = song.bpm
    Tone.Transport.start();
    let chords = song.music.measures
    let temp = []
    for (let i = 0; i < chords.length; i++) {
        temp.push(i)
    }
    //firstMeasure = song.music.measures[measureNumber]
    pausedMeasure = 0;
    //paused = false;
    const seq = new Tone.Sequence((time, index) => {
        let duration = 4 / chords[index].length
        let durString = duration + "n"
        let temp2 = []
        for (let i = 0; i < chords[index].length; i++) {
            temp2.push(i)
        }
        const seq2 = new Tone.Sequence((time2, id2) => {
            if (state == "play") {
                if (pausedMeasure != 0)
                    index = pausedMeasure
                sampler.triggerAttackRelease(chords[index][id2], durString);
                console.log(time, time2)
                measureNumber = chords[index]
                App.setCurrentMeasure(measureNumber)
                    // subdivisions are given as subarrays
            } else if (state = "pause") {
                paused = true
                pausedMeasure = measureNumber
                Tone.Transport.stop()
            }
            if (state = "stop") {
                pausedMeasure = 0
                measureNumber = 0
                Tone.Transport.stop()
            }
            if (measureNumber == song.music.measures.length) {
                measureNumber = 0
                if (loop == false) {
                    if (connectSong)
                        playConnectSong() -- > "setCurrentMeasureConnect()"
                    currentSong = nextSong
                }
            }
        }, temp2, "4n").start(0)
    }, temp, "1m").start(0);

    // prima prova con for    
    for (i = 0; i < song.music.measures.length && paused == false && state != "stop"; i++) {
        if (pausedMeasure != 0)
            measureNumber = pausedMeasure
        App.setCurrentMeasure(measureNumber)
        measureNumber++
        if (state = "pause") {
            paused = true
            pausedMeasure = measureNumber - 1
        }
        if (state = "stop") {
            pausedMeasure = 0
            measureNumber = 0
        }
        if (measureNumber == song.music.measures.length) {
            measureNumber = 0
            if (loop == false) {
                if (connectSong)
                    playConnectSong() -- > "setCurrentMeasureConnect()"
                currentSong = nextSong
            }
        }
    }
}