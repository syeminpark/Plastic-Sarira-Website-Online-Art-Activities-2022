import {
	AudioVisualizer12345
} from './audio_visualizer.js';
import {
	unmute
} from './sound/unmute.js'

class Audio12345 {
	constructor(_button, _visualizer) {
		this.button = _button;

		this.is_audio_on = false;
		this.is_init = true;

		this.volume = 0.1;

		this.button.addEventListener('click', this.toggle.bind(this));

		this.visualizer = new AudioVisualizer12345(_visualizer);

		this.initAudio();

	}

	toggle() {
		if (this.is_audio_on) {
			this.off();
		} else {
			this.on();
		}
	}

	initAudio() {

		this.audioCtx = new AudioContext() 
		let unmuteHandle = unmute(this.audioCtx, false,false);


		this.oscillator = this.audioCtx.createOscillator();
		this.oscillator.type = 'square';
		//this.oscillator.frequency.setValueAtTime(140, this.audioCtx.currentTime);

		setInterval(() => {
			this.oscillator.frequency.setValueAtTime(
				(Math.sin(Math.floor(this.audioCtx.currentTime)) * 0.5 + 0.5) * 600 + 140, this.audioCtx.currentTime);
		}, 600);

		this.gainNode = this.audioCtx.createGain();
		this.oscillator.connect(this.gainNode);

		this.analyserNode = this.audioCtx.createAnalyser();
		this.analyserNode.fftSize = 64;
		this.gainNode.connect(this.analyserNode);


		this.visualizer.setAnalyzer(this.analyserNode);
		this.oscillator.start();
	}

	on() {
		this.analyserNode.connect(this.audioCtx.destination);
		this.is_audio_on = true;
		console.log("audio on!");
		this.button.classList.add("active");
		this.visualizer.show();
		if (this.gainNode)
			this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);

	}

	off() {
		this.analyserNode.disconnect(this.audioCtx.destination);
		this.is_audio_on = false;
		console.log("audio off!");
		this.button.classList.remove("active");
		this.visualizer.hide();
		if (this.gainNode)
			this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
	}
}

export {
	Audio12345
};