const HarmonicConnect = require('./hConnect.js');

exports.connect = function (song1, song2) {
  //RATIO num chords/max jump --> hight ratio is smooth, low is bold
  let boldSmoothValue = document.getElementById('boldSmooth').value;

  //Run each modulation --> matrix, each row are the chords of the modulation
  //Create 2 vectors with index realtive to a modulation: # of chords, max jump in key
  let modMatrix = [];
  modMatrix.push(HarmonicConnect.diaMod(song1, song2));
  modMatrix.push(HarmonicConnect.pivotChord(song1, song2));
  //modMatrix.push(HarmonicConnect.noChordModulation(song1, song2));
  //modMatrix.push(HarmonicConnect.deceptiveCadence(song1));
  //modMatrix.push(HarmonicConnect.chainModulation(song1, song2));
  //modMatrix.push(HarmonicConnect.parallelMod(song1));

  console.log('modMatrix:', modMatrix);

  let ratios = modMatrix.map((mod) => mod.maxJump);
  let distances = ratios.map((ratio) => Math.abs(ratio - boldSmoothValue));
  let minIndex = distances.indexOf(Math.min(...distances));
  let harmonicConnectChords = [];
  modMatrix[minIndex].chords.forEach((chord) => {
    let temp = [];
    temp.push(chord);
    harmonicConnectChords.push(temp);
  });

  return harmonicConnectChords;
};
