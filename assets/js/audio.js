var audioVoice = {
	voice: null,
	voice1: "./assets/img/attack.wav",
	reproducir: function(rootTrack){
		if (audioVoice.voice != null) {
			audioVoice.voice.pause();
			audioVoice.voice.src = "";
		}
		audioVoice.voice = new AudioVoice(rootTrack);
		audioVoice.voice.play();
	}
}