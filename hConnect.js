// MODULATIONS

// CYCLE OF FIFTHS

/*const cycleF = ["C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F",
    "C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F",
    "A-", "E-", "B-", "Gb-", "Db-", "Ab-", "Eb-", "Bb-", "F-", "C-", "G-", "D-",
    "A-", "E-", "B-", "Gb-", "Db-", "Ab-", "Eb-", "Bb-", "F-", "C-", "G-", "D-"
]*/
const cycleF = [
  'C',
  'G',
  'D',
  'A',
  'E',
  'B',
  'Gb',
  'Db',
  'Ab',
  'Eb',
  'Bb',
  'F',
];

const keys = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
  'A-',
  'Bb-',
  'B-',
  'C-',
  'C#-',
  'D-',
  'Eb-',
  'E-',
  'F-',
  'F#-',
  'G-',
  'G#-',
  'A-',
  'Bb-',
  'B-',
  'C-',
  'C#-',
  'D-',
  'Eb-',
  'E-',
  'F-',
  'F#-',
  'G-',
  'G#-',
];
const modes = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'];
// There are 4 comon chords for two keys next to each other, if I jump one key, only two are in common
// (1) first, third, 4th, fifth, (2) third, fifth
// Pre dom IV & ii (ii is the relative minor in the next key!)
// I start the modulation in the two chord, because it becomes the relative minor in the new key
// Pre dom are the common chords for modulation

// Scheletro diatonic (common chord) modulation

exports.diaMod = function (song1, song2) {
  currentFifthIndex = cycleF.indexOf(song1.key);
  currentKeyIndex = keys.indexOf(song1.key);
  n1 = cycleF.indexOf(song1.key);
  n2 = cycleF.indexOf(song2.key);
  n = cofDist(n1, n2);

  let chords = [];

  if (n >= 3 || song1.key.includes('-') || song2.key.includes('-')) {
    return { chords: chords, maxJump: 100 };
  }

  let nextFifthIndex;
  let firstChordModulation;
  let secondChordModulation;
  let thirdChordModulation;

  nextFifthIndex = currentFifthIndex + n;

  if (n == 1 || n == 2 || n == -11 || n == 12) {
    //nextFifthIndex = currentFifthIndex + n;
    firstChordModulation = keys[currentKeyIndex + 4]; //iii-
    secondChordModulation = keys[currentKeyIndex + 9]; //vi- which is ii- in next key
    currentKeyIndex = keys.indexOf(song2.key);
    thirdChordModulation = keys[currentKeyIndex + 7]; //V now you can tell the key is changed
    chords = [
      firstChordModulation + '-',
      secondChordModulation + '-',
      thirdChordModulation + '^',
    ];
  } else if (n == -1 || n == -2 || n == 11 || n == -12) {
    if (currentKeyIndex + n < 0) {
      currentKeyIndex = currentKeyIndex + 12;
    }
    //nextFifthIndex = currentFifthIndex + n;
    firstChordModulation = keys[currentKeyIndex + 7];
    currentKeyIndex = keys.indexOf(song2.key);
    secondChordModulation = keys[currentKeyIndex + 9];
    thirdChordModulation = keys[currentKeyIndex + 4];
    chords = [
      firstChordModulation + '^',
      secondChordModulation + '-',
      thirdChordModulation + '-',
    ];
  } else if (n == 0) {
    firstChordModulation = keys[currentKeyIndex + 2];
    secondChordModulation = keys[currentKeyIndex + 7];
    thirdChordModulation = keys[currentKeyIndex];
    chords = [
      firstChordModulation + '-',
      secondChordModulation + '^',
      thirdChordModulation + '^',
    ];
  } else if (n == 24) {
    // may an I IV V vi could be used before that
    currentKeyIndex = keys.indexOf(song2.key);
    firstChordModulation = keys[currentKeyIndex + 2];
    secondChordModulation = keys[currentKeyIndex + 7];
    thirdChordModulation = keys[currentKeyIndex];
    chords = [
      firstChordModulation + '-',
      secondChordModulation + '^',
      thirdChordModulation + '^',
    ];
  }

  return { chords: chords, maxJump: n };
};

function cofDist(index1, index2) {
  let ris = Math.abs(index1 - index2);
  if (ris > 6) ris = 12 - ris;

  return ris;
}

// Chormatic Pivot CHORD
// From C to E minor
// Chromatic pivot chord is a chord not contained in the first key
// I vii vii (next chord) i

// I, II, iii, IV, V, vi, vii dim
// VI, vii, i, ii#, III, iv, v

exports.pivotChord = function (song1, song2) {
  let chords = [];

  n1 = cycleF.indexOf(song1.key);
  n2 = cycleF.indexOf(song2.key);
  n = cofDist(n1, n2);

  currentKeyIndex = keys.indexOf(song1.key);
  nextKeyIndex = keys.indexOf(song2.key);
  firstChordModulation = keys[currentKeyIndex + 11];
  currentKeyIndex = nextKeyIndex;
  secondChordModulation = keys[currentKeyIndex + 11];
  chords = [firstChordModulation + '-6', secondChordModulation + 'o7'];
  return { chords: chords, maxJump: 1.5 };
};

// Enharmonic dominant
// if the next key dominant equals the augmented sixth of the current key
// I just need this chord as modulation
// it should work only in the case that I'm changin of half-step (is that what sarti asked?)

// we re-spell an augmented sixth as a dominanth 7th and use that as a five chord to cadence to one chord.
//typically augmented sith resolve to 1-6-4 chord

exports.enharmonicDominant = function (song1, song2) {
  n1 = cycleF.indexOf(song1.key);
  n2 = cycleF.indexOf(song2.key);
  n = cofDist(n1, n2);

  let chords = [];

  if (n >= 2 || song1.key.includes('-') || song2.key.includes('-')) {
    return { chords: chords, maxJump: 100 };
  }

  currentKeyIndex = keys.indexOf(song1.key);
  nextKeyIndex = keys.indexOf(song2.key);
  firstChordModulation = keys[currentKeyIndex + 9];
  //secondChordModulation = keys[currentKeyIndex + 11]
  //secondChordModulation = keys[currentKeyIndex + 8]
  currentKeyIndex = nextKeyIndex;
  secondChordModulation = keys[currentKeyIndex + 7]; // +7?
  chords = [firstChordModulation + '+', secondChordModulation + '7'];
  return { chords: chords, maxJump: n };
};

//console.log(deceptiveCadence(s1))

// dominant chord goes to the sith chord

function deceptiveCadence(song1, song2, isMinor = false) {
  n1 = cycleF.indexOf(song1.key);
  n2 = cycleF.indexOf(song2.key);
  n = cofDist(n1, n2);

  if (n >= 3 || song1.key.includes('-') || song2.key.includes('-')) {
    return { chords: [], maxJump: 100 };
  }

  let currentKey = song.key;
  let keyIndex = keys.indexOf(currentKey);
  let chords = [];
  let chord1 = keys[keyIndex] + '^';
  let chord2 = keys[keyIndex + 5] + '^';
  let chord3 = keys[keyIndex + 7] + '7';
  let chord4 = keys[keyIndex + 9];
  let nextKeyIndex = keys.indexOf(chord4);
  chord4 = keys[keyIndex + 9] + '-'; //or -7?
  let chord5 = keys[nextKeyIndex + 3] + '-7b5';
  let chord6 = keys[nextKeyIndex + 7] + '7b9';
  let chord7 = keys[nextKeyIndex] + '-'; //or -7?

  if (isMinor) {
    chords = [chord4, chord5, chord6, chord7, chord1, chord2, chord3];
  } else {
    chords = [chord1, chord2, chord3, chord4, chord5, chord6, chord7];
  }
  return { chords: chords, maxJump: n };
}

// Deceptive Cadence
// Dominant chord in a major key goes to the sixth
// If from a major I wanto to go to relative minor I play IV, V, vi (that is our next key i)
// vii, iii (that is ii, v) and then (now I'm in the new key) i of relative minor

/*exports.deceptiveCadence = function (song) {
    currentkey = song.key
    let isMinor = false

    if (currentKey.includes('-')) {
        minorKey = currentKey
        currentKey = currentKey.replace('-', '')
        console.log(currentKey)
        isMinor = true
    }
    keyIndex = keys.indexOf(currentKey)
    let chords = []
    chord1 = keys[keyIndex]
    chord2 = keys[keyIndex + 5]
    chord3 = keys[keyIndex + 7]
    chord4 = keys[keyIndex + 9]
    nextKeyIndex = keys.indexOf(chord4)
    chord5 = keys[nextKeyIndex + 3]
    chord6 = keys[nextKeyIndex + 7]
    chord7 = keys[nextKeyIndex]

    if (isMinor) {
        chords = [chord4, chord5, chord6, chord7, chord1, chord2, chord3]
    } else {
        chords = [chord1, chord2, chord3, chord4, chord5, chord6, chord7]
    }
    return chords
}*/

// Enhamronic dim7
// Major I, V, vii, I, then I go to relative minor vii dim, i (nexy key relative minor)

exports.enharmonicDimSeven = function (song1, song2) {
  n1 = cycleF.indexOf(song1.key);
  n2 = cycleF.indexOf(song2.key);
  n = cofDist(n1, n2);

  let chords = [];

  if (n != 3 || !song2.key.includes('-')) {
    return { chords: [], maxJump: 100 };
  }

  currentKeyIndex = keys.indexOf(song1.key);
  firstKeyIndex = currentKeyIndex;
  nextKeyIndex = keys.indexOf(song2.key);
  let firstChordModulation = keys[currentKeyIndex];
  let secondChordModulation = keys[currentKeyIndex + 7] + '7';
  let thirdChordModulation = keys[currentKeyIndex + 11] + 'o7';
  // now I'm in relative minor
  currentKeyIndex = nextKeyIndex;
  let chord_4 = keys[currentKeyIndex + 11] + 'o7/' + keys[firstKeyIndex + 11];

  chords = [
    firstChordModulation,
    secondChordModulation,
    thirdChordModulation,
    firstChordModulation,
    chord_4,
  ];

  return { chords: chords, maxJump: n };
};

// dim7 to Dom7
// if I take any dim7, I have just to low the root down of halfstep
// from Cmin to Eb: i, iv, i, vii (dim), V, I.
// In Bdim chord if I go down halfstep on the root (B) I get Bb chord (a V) of the next key

// metterei un bel if nextKeyIndex - currentKeyIndex = 3

exports.dimSevenDomSeven = function (song1, song2) {
  n1 = cycleF.indexOf(song1.key);
  n2 = cycleF.indexOf(song2.key);
  n = cofDist(n1, n2);

  let chords = [];

  if (n != 3 || !song1.key.includes('-') || song2.key.includes('-')) {
    return { chords: chords, maxJump: 100 };
  }

  currentKeyIndex = keys.indexOf(song1.key);
  nextKeyIndex = keys.indexOf(song2.key);
  let chord_1 = keys[currentKeyIndex];
  let chord_2 = keys[curentKeyIndex + 5];
  let chord_3 = keys[currentKeyIndex + 11] + 'o7';
  currentKeyIndex = nextKeyIndex;
  let chord_4 = keys[currentKeyIndex + 7] + '7';

  chords = [chord_1, chord_2, chord_3, chord_4];

  return { chords: chords, maxJump: n };
};

// Chromatic Mediant
// Mediant = iii, Submediant = vi (in Major)
// Mediant = III, Submediant = VI (in Minor)
// I think there is no use for harmonic connect
// Maybe I can use it to change from a I to iii or vi

// Common/Pivot NOTE
// Includes chromatic Mediant! The important is to have a common note between the two keys
// Emin = EGB, EbGC (Cmin) <- mediant relationship
// FAC#E (F), DbGbAbC (Db)

// Direct/Linear Modulation
// No common chords between the two. C, B

//if (Chord.getNotesChord(song1.key).filter(value => Chord.getNotesChord(song2.key).includes(value)) == [])

function directModulation(song1, song2) {
  n1 = cycleF.indexOf(song1.key);
  n2 = cycleF.indexOf(song2.key);
  n = cofDist(n1, n2);

  let chords = [];

  if (n < 3 || song1.key.includes('-') || song2.key.includes('-')) {
    return { chords: [], maxJump: 100 };
  }

  currentKey = song1.key;
  keyIndex = keys.indexOf(currentKey);
  nextKey = song2.key;
  nextKeyIndex = keys.indexOf(nextKey);
  chord1 = keys[keyIndex + 7];
  chord2 = keys[nextKeyIndex + 7];
  chords = [chord1, chord2];
  return { chords: chords, maxJump: n };
}
// IV = vii and vicevaersa, two common notes (if Major)
// II = VI and vicevarsa, two common notes (if minor)
// I first need to do a triton substitution
// potrei provare dall'ultimo accord della prima canzone, il suo tritono e poi la quinta della prossima chiave
// e cosi tornare nella prima della prossima chiave. Senno: ii-V, poi ii-V del tritono e poi ii-V-I della nuova chiave

// preceduto da un if (song1.key == Mayor && (song2.key == song1.key + 5 || song2.key == song1.key + 11)
// || song1.key = minor && (song2.key == song1.key + 2 || song2.key == song1.key + 8))
function tritonModulation(song1, song2) {
  n1 = cycleF.indexOf(song1.key);
  n2 = cycleF.indexOf(song2.key);
  n = cofDist(n1, n2);

  let chords = [];

  if (
    (!song1.key.includes('-') && (n == 5 || n == 11)) ||
    (song1.key.includes('-') && (n == 2 || n == 8))
  ) {
    return { chords: [], maxJump: 100 };
  }

  currentKey = song1.key;
  nexyKey = song2.key;
  keyIndex = keys.indexOf(currentKey);
  tritonKeyIndex = keys.indexOf(currentKey) + 6;
  nextKeyIndex = keys.indexOf(nextKey);
  nextKey = song2.key;
  chord1 = keys[currentKey];
  chord2 = keys[currentKey + 2];
  chord3 = keys[currentKey + 7];
  chord4 = keys[tritonKey + 2];
  chord5 = keys[tritonKey + 7];
  chord6 = keys[nextKey + 2];
  chord7 = keys[nextKey + 7];
  chord8 = keys[nextKey];
  chords = [chord1, chord2, chord3, chord4, chord5, chord6, chord7, chord8];
  return { chords: chords, maxJump: n };
}

// la noChordModulation means that there are no chord in commono between the two keys, which means that
// there are at least three stepes in the cycle of fiths.
// So also here I would put something like if abs(song_1.key - song_2.key) ≥ 3

exports.noChordModulation = function (song1, song2) {
  let chords;
  n = Math.ceil(Math.random() * 2);
  if (n == 1) {
    chords = directModulation(song1, song2);
  } else if (n == 2) {
    chords = tritonModulation(song1, song2);
  }
  return chords;
};

// Chain modulation I go around the circleof fifths clock or counterclockwise and I do V, V7 in each step
// till I get to play the next song key tonal
exports.chainModulation = function (song1, song2) {
  n1 = cycleF.indexOf(song1.key);
  n2 = cycleF.indexOf(song2.key);
  n = cofDist(n1, n2);

  let firstIsMinor = false;
  let secondIsMinor = false;
  let firstRelMaj;
  let secondRelMaj;
  let root1;
  let root2;
  if (song1.key.includes('-')) {
    root1 = song1.key;
    root1 = root1.replace('-', '');
    root1 = chromaSharpNormalization(root1);
    firstIsMinor = true;
    firstRelMaj = mod(chromaSharp, chromaSharp.indexOf(root1), 3);
  }
  if (song2.key.includes('-')) {
    root2 = song2.key;
    root2 = root2.replace('-', '');
    root2 = chromaSharpNormalization(root2);
    secondIsMinor = true;
    secondRelMaj = mod(chromaSharp, chromaSharp.indexOf(root2), 3);
  }
  let chords = [];
  let firstKey = song1.key;
  let firstFifthIndex = cycleF.indexOf(firstKey.replace('-', ''));
  let secondKey = song2.key;
  let secondFifthIndex = cycleF.indexOf(secondKey.replace('-', ''));
  let n = secondFifthIndex - firstFifthIndex;

  if (
    (firstIsMinor == true && secondIsMinor == true) ||
    (firstIsMinor == false && secondIsMinor == false)
  ) {
    if (n > 0) {
      if (n <= 6) {
        for (let i = 0; i <= n; i++) {
          chords.push(mod(cycleF, firstFifthIndex, i) + '^');
          if (i != n) {
            chords.push(mod(cycleF, firstFifthIndex, i) + '7');
          }
        }
      } else {
        for (let i = 0; i <= cycleF.length - n; i++) {
          chords.push(mod(cycleF, firstFifthIndex, -i) + '^');
          if (i != n) {
            chords.push(mod(cycleF, firstFifthIndex, -i) + '7');
          }
        }
      }
    } else {
      n = -n;
      if (n <= 6) {
        for (let i = 0; i <= n; i++) {
          chords.push(mod(cycleF, firstFifthIndex, -i) + '^');
          if (i != n) {
            chords.push(mod(cycleF, firstFifthIndex, -i) + '7');
          }
        }
      } else {
        for (let i = 0; i <= cycleF.length - n; i++) {
          chords.push(mod(cycleF, firstFifthIndex, i) + '^');
          if (i != n) {
            chords.push(mod(cycleF, firstFifthIndex, i) + '7');
          }
        }
      }
    }
    if (firstIsMinor == true && secondIsMinor == true) {
      for (let i = 0; i < chords.length; i++) {
        chords[i] = chords[i].replace('^', '-');
        chords[i] = chords[i].replace('7', '-7');
      }
    }
  } else {
    if (firstIsMinor == true) {
      let st1 = {};
      st1.key = firstRelMaj;
      chords = deceptiveCadence(st1, true);
      firstKey = firstRelMaj;
      firstFifthIndex = cycleF.indexOf(firstKey);
      n = secondFifthIndex - firstFifthIndex;
      if (n > 0) {
        if (n <= 6) {
          for (let i = 0; i <= n; i++) {
            chords.push(mod(cycleF, firstFifthIndex, i) + '^');
            if (i != n) {
              chords.push(mod(cycleF, firstFifthIndex, i) + '7');
            }
          }
        } else {
          for (let i = 0; i <= cycleF.length - n; i++) {
            chords.push(mod(cycleF, firstFifthIndex, -i) + '^');
            if (i != n) {
              chords.push(mod(cycleF, firstFifthIndex, -i) + '7');
            }
          }
        }
      } else {
        n = -n;
        if (n <= 6) {
          for (let i = 0; i <= n; i++) {
            chords.push(mod(cycleF, firstFifthIndex, -i) + '^');
            if (i != n) {
              chords.push(mod(cycleF, firstFifthIndex, -i) + '7');
            }
          }
        } else {
          for (let i = 0; i <= cycleF.length - n; i++) {
            chords.push(mod(cycleF, firstFifthIndex, i) + '^');
            if (i != n) {
              chords.push(mod(cycleF, firstFifthIndex, i) + '7');
            }
          }
        }
      }
    } else if (secondIsMinor == true) {
      secondKey = secondRelMaj;
      secondFifthIndex = cycleF.indexOf(secondKey); //perche' qui c'era firstKey??
      n = secondFifthIndex - firstFifthIndex;
      if (n > 0) {
        if (n <= 6) {
          for (let i = 0; i <= n; i++) {
            chords.push(mod(cycleF, firstFifthIndex, i) + '^');
            if (i != n) {
              chords.push(mod(cycleF, firstFifthIndex, i) + '7');
            }
          }
        } else {
          for (let i = 0; i <= cycleF.length - n; i++) {
            chords.push(mod(cycleF, firstFifthIndex, -i) + '^');
            if (i != n) {
              chords.push(mod(cycleF, firstFifthIndex, -i) + '7');
            }
          }
        }
      } else {
        n = -n;
        if (n <= 6) {
          for (let i = 0; i <= n; i++) {
            chords.push(mod(cycleF, firstFifthIndex, -i) + '^');
            if (i != n) {
              chords.push(mod(cycleF, firstFifthIndex, -i) + '7');
            }
          }
        } else {
          for (let i = 0; i <= cycleF.length - n; i++) {
            chords.push(mod(cycleF, firstFifthIndex, i) + '^');
            if (i != n) {
              chords.push(mod(cycleF, firstFifthIndex, i) + '7');
            }
          }
        }
      }
      console.log(chords);
      console.log(secondRelMaj);
      let st2 = {};
      st2.key = secondRelMaj;
      let temp = deceptiveCadence(st2);
      for (let i = 0; i < temp.length; i++) {
        chords.push(temp[i]);
      }
    }
  }
  let final = chunkArray(chords, 2);
  return { final: final, maxJump: n };
};

//TEST

let chromaSharp = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
];

function chromaSharpNormalization(note) {
  switch (note) {
    case 'C#':
      return 'Db';
    case 'D#':
      return 'Eb';
    case 'F#':
      return 'Gb';
    case 'G#':
      return 'Ab';
    case 'A#':
      return 'Bb';
  }

  return note;
}

function mod(arr, num, index) {
  let sum = index + num;
  if (sum >= arr.length) return arr[sum % arr.length];
  else if (sum < 0) {
    sum = sum + arr.length;
    return arr[sum];
  }
  return arr[sum];
}

//TEST
let s1 = { key: 'C-' };
let s2 = { key: 'C-' };

//console.log(chainModulation(s1,s2))
/* function chainModulation(song1, song2) {
    let firstIsMinor = false
    let secondIsMinor = false
    let firstRelMaj
    let secondRelMaj
    let root1
    let root2
    if (song1.key.includes('-')) {
        root1 = song1.key
        root1 = root1.replace('-', '')
        root1 = chromaSharpNormalization(root1)
        firstIsMinor = true
        firstRelMaj = mod(chromaSharp, chromaSharp.indexOf(root1), 3)
    }
    if (song2.key.includes('-')) {
        root2 = song2.key
        root2 = root2.replace('-', '')
        root2 = chromaSharpNormalization(root2)
        secondIsMinor = true
        secondRelMaj = mod(chromaSharp, chromaSharp.indexOf(root2), 3)
    }
    let chords = []
    let firstKey = song1.key
    let firstFifthIndex = cycleF.indexOf(firstKey.replace("-", ""))
    let secondKey = song2.key
    let secondFifthIndex = cycleF.indexOf(secondKey.replace("-", ""))
    let n = secondFifthIndex - firstFifthIndex


    if ((firstIsMinor == true && secondIsMinor == true) || (firstIsMinor == false && secondIsMinor == false)) {
        if (n > 0) {
            if (n <= 6) {
                for (let i = 0; i <= n; i++) {
                    chords.push(mod(cycleF, firstFifthIndex, i) + '^')
                    if (i != n) {
                        chords.push(mod(cycleF, firstFifthIndex, i) + '7')
                    }
                }
            } else {
                for (let i = 0; i <= cycleF.length - n; i++) {
                    chords.push(mod(cycleF, firstFifthIndex, -i) + '^')
                    if (i != n) {
                        chords.push(mod(cycleF, firstFifthIndex, -i) + '7')
                    }
                }
            }
        } else {
            n = -n
            if (n <= 6) {
                for (let i = 0; i <= n; i++) {
                    chords.push(mod(cycleF, firstFifthIndex, -i) + '^')
                    if (i != n) {
                        chords.push(mod(cycleF, firstFifthIndex, -i) + '7')
                    }
                }
            } else {
                for (let i = 0; i <= cycleF.length - n; i++) {
                    chords.push(mod(cycleF, firstFifthIndex, i) + '^')
                    if (i != n) {
                        chords.push(mod(cycleF, firstFifthIndex, i) + '7')
                    }
                }
            }
        }
        if (firstIsMinor == true && secondIsMinor == true) {
            for (let i = 0; i < chords.length; i++) {
                chords[i] = chords[i].replace("^", "-")
                chords[i] = chords[i].replace("7", "-7")
            }
        }

    } else {
        if (firstIsMinor == true) {
            let st1 = {}
            st1.key = firstRelMaj
            chords = deceptiveCadence(st1, true)
            firstKey = firstRelMaj
            firstFifthIndex = cycleF.indexOf(firstKey)
            n = secondFifthIndex - firstFifthIndex
            if (n > 0) {
                if (n <= 6) {
                    for (let i = 0; i <= n; i++) {
                        chords.push(mod(cycleF, firstFifthIndex, i) + '^')
                        if (i != n) {
                            chords.push(mod(cycleF, firstFifthIndex, i) + '7')
                        }
                    }
                } else {
                    for (let i = 0; i <= cycleF.length - n; i++) {
                        chords.push(mod(cycleF, firstFifthIndex, -i) + '^')
                        if (i != n) {
                            chords.push(mod(cycleF, firstFifthIndex, -i) + '7')
                        }
                    }
                }
            } else {
                n = -n
                if (n <= 6) {
                    for (let i = 0; i <= n; i++) {
                        chords.push(mod(cycleF, firstFifthIndex, -i) + '^')
                        if (i != n) {
                            chords.push(mod(cycleF, firstFifthIndex, -i) + '7')
                        }
                    }
                } else {
                    for (let i = 0; i <= cycleF.length - n; i++) {
                        chords.push(mod(cycleF, firstFifthIndex, i) + '^')
                        if (i != n) {
                            chords.push(mod(cycleF, firstFifthIndex, i) + '7')
                        }
                    }
                }
            }
        } else if (secondIsMinor == true) {
            secondKey = secondRelMaj
            secondFifthIndex = cycleF.indexOf(secondKey) //perche' qui c'era firstKey??
            n = secondFifthIndex - firstFifthIndex
            if (n > 0) {
                if (n <= 6) {
                    for (let i = 0; i <= n; i++) {
                        chords.push(mod(cycleF, firstFifthIndex, i) + '^')
                        if (i != n) {
                            chords.push(mod(cycleF, firstFifthIndex, i) + '7')
                        }
                    }
                } else {
                    for (let i = 0; i <= cycleF.length - n; i++) {
                        chords.push(mod(cycleF, firstFifthIndex, -i) + '^')
                        if (i != n) {
                            chords.push(mod(cycleF, firstFifthIndex, -i) + '7')
                        }
                    }
                }
            } else {
                n = -n
                if (n <= 6) {
                    for (let i = 0; i <= n; i++) {
                        chords.push(mod(cycleF, firstFifthIndex, -i) + '^')
                        if (i != n) {
                            chords.push(mod(cycleF, firstFifthIndex, -i) + '7')
                        }
                    }
                } else {
                    for (let i = 0; i <= cycleF.length - n; i++) {
                        chords.push(mod(cycleF, firstFifthIndex, i) + '^')
                        if (i != n) {
                            chords.push(mod(cycleF, firstFifthIndex, i) + '7')
                        }
                    }
                }
            }
            console.log(chords)
            console.log(secondRelMaj)
            let st2 = {}
            st2.key = secondRelMaj
            let temp = deceptiveCadence(st2)
            for (let i = 0; i < temp.length; i++) {
                chords.push(temp[i])
            }
        }
    }
    let final = chunkArray(chords, 2)
    return final
    
}
 */
function chunkArray(myArray, chunk_size) {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }

  return tempArray;
}

exports.parallelMod = function (song1, song2) {
  n1 = cycleF.indexOf(song1.key);
  n2 = cycleF.indexOf(song2.key);
  n = cofDist(n1, n2);

  let chords = [];

  if (
    n != 0 ||
    (!song1.key.includes('-') && !song2.key.includes('-')) ||
    (song1.key.includes('-') && song2.key.includes('-'))
  ) {
    return { chords: chords, maxJump: 100 };
  }

  key = song1.key;
  keyIndex = keys.indexOf(key);
  chord1 = key;
  if (chord1.includes('-')) chord2 = chord1.replace('-', '^');
  else if (chord1.includes('^')) chord2 = chord1.replace('^', '-');
  chords = [chord1, chord2];
  return { chords: chords, maxJump: n };
};

// || (or)
