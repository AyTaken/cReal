# cReal
cReal (pronounced as "*cereal*") is what we define as a continuous real book, a tool that can help to create a more linear and homogeneous jazz session, whether you use it to practise on your improvisation, as a guide for your live performance, or to simply expand your repertoire.

It displays and plays the chords for you so that you can follow along. The structure of the music it reproduces can be imagined as loops connected by chords, when you had enough of the current song, it moves on to the next song, which can be chosen only in terms of keys (to give the *important* randomness factor on a set of 1300 jazz standard).

### How to use it
Chords grid ( + harmonic Connect) on the left:
the moving highlighted cell indicates the current measure/chords, while the static highlighted cell indicates the end of the song. When the current measure hit the end of the song:

 1. if there are chords in the harmonic connect, it plays them, and load the next song
 2. if there aren't chords in the harmonic connect, it continues to the current song


Sidebar:

 - Name and key of the next song
 - Song commands (play, stop, pause)
 - Informations about the current song
 - Change song buttons:
	 - **Same key** button: select a random song of the same key of the current song
	 - **Similar key** button: select a random song of a similar key (near in distance on the circle of fifths)
	 - **Random key** button: select a random song of a random key
	 - **Key Selector**
	 - **Change key** button: transpose the current song in the key selected on the key selector
	 - **Target key** button: select a random song of the key selected in the key selector
- BPM and volume sliders


### What we used
[Tone.js](https://tonejs.github.io/), [ireal-reader](https://github.com/pianosnake/ireal-reader) ,[browserify](https://github.com/browserify/browserify), songs from iReal Pro community forum
 

