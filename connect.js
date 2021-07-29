exports.connect = function (song1, song2) {
    let bold = document.querySelector("#harmonicChoice1")
    let smooth = document.querySelector("#harmonicChoice2")

    //Run each modulation --> matrix, each row are the chords of the modulation
    //Create 2 vectors with index realtive to a modulation: # of chords, max jump in key

    if(smooth.checked) {
        //Select the modulation with min jump in key, if equal select the one with more chords, if equal randomize 

    }
    else {
        //Select the one with min # of chords and max jump in key
    }
}