const HarmonicConnect = require('./hConnect.js');

exports.connect = function (song1, song2) {
  //RATIO num chords/max jump --> hight ratio is smooth, low is bold
  let boldSmoothValue = document.getElementById('boldSmooth').value;

  //Run each modulation --> matrix, each row are the chords of the modulation
  //Create 2 vectors with index realtive to a modulation: # of chords, max jump in key
  let modMatrix = [];
  modMatrix.push(HarmonicConnect.diaMod(song1, song2));
  modMatrix.push(HarmonicConnect.pivotChord(song1, song2));
  modMatrix.push(HarmonicConnect.noChordModulation(song1, song2));
  modMatrix.push(HarmonicConnect.deceptiveCadenceEx(song1, song2));
  modMatrix.push(HarmonicConnect.chainModulation(song1, song2));
  modMatrix.push(HarmonicConnect.parallelMod(song1, song2));
  modMatrix.push(HarmonicConnect.dimSevenDomSeven(song1, song2));
  modMatrix.push(HarmonicConnect.enharmonicDominant(song1, song2));
  modMatrix.push(HarmonicConnect.enharmonicDimSeven(song1, song2));

  console.log('modMatrix:', modMatrix);

  let doableMods = modMatrix.filter((mod) => mod.maxJump != 100);
  let ratios = doableMods.map((mod) => mod.maxJump / mod.chords.length);

  let maxNorm = Math.max(...ratios);
  let ratiosNorm;
  if (maxNorm != 0) ratiosNorm = ratios.map((ratio) => ratio / maxNorm);
  else {
    ratiosNorm = ratios.map((ratio) => ratio);
  }
  let distances = ratiosNorm.map((ratio) => Math.abs(ratio - boldSmoothValue));
  let minIndex = distances.indexOf(Math.min(...distances));
  let harmonicConnectChords = [];
  doableMods[minIndex].chords.forEach((chord) => {
    let temp = [];
    temp.push(chord);
    harmonicConnectChords.push(temp);
  });

  let spanCurrMod = document.getElementById('currentMod');
  spanCurrMod.textContent = doableMods[minIndex].name;

  return harmonicConnectChords;
};
