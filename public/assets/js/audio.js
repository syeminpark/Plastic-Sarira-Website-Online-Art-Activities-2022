import {
	AudioVisualizer12345
} from './audio_visualizer.js';
import {
	unmute
} from './sound/unmute.js'

class Audio12345 {
	constructor(_button, _visualizer) {
		this.button = _button;
		this.analyserNode;
		this.backgroundSource;
		this.bufferStartTime
		this.clickSoundVolume = 0.5

		this.is_audio_on = false;
		this.is_init = true;
		this.button.addEventListener('click', this.toggle.bind(this));

		this.visualizer = new AudioVisualizer12345(_visualizer);
		this.clickSoundDOM = document.getElementById("click")
		this.backgroundSoundDOM = document.getElementById("background")
		this.assignClickEvents();
		this.initAudio();
	
		

	}

	toggle() {
		if (this.is_audio_on) {
			this.off();
		} else {
			this.on();
		}
	}


	async initAudio() {
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		this.audioContext = new AudioContext()
		let unmuteHandle = unmute(this.audioContext, false, false);

		//click
		const click_audioElement = this.audioContext.createMediaElementSource(this.clickSoundDOM);
		const click_gain = this.audioContext.createGain();
		click_gain.gain.value = this.clickSoundVolume
		click_audioElement.connect(click_gain)
		click_gain.connect(this.audioContext.destination);


		//background
		this.backgroundSource = this.audioContext.createBufferSource()
		const background_gain = this.audioContext.createGain();
		this.analyserNode = this.audioContext.createAnalyser();
		this.analyserNode.fftSize = 32;
		this.visualizer.setAnalyzer(this.analyserNode);

		try {
			let response = await fetch("./assets/mp3/background.mp3")
			let arrayBuffer = await response.arrayBuffer()

			this.backgroundSource.buffer = await this.audioContext.decodeAudioData(arrayBuffer)
			this.backgroundSource.loop = true
			this.backgroundSource.connect(background_gain)
			background_gain.connect(this.analyserNode)
			this.backgroundSource.start(0)

			
			

		} catch (error) {
			console.error(error);
		}


	}

	on() {
		this.analyserNode.connect(this.audioContext.destination);
		this.bufferStartTime = this.audioContext.currentTime
		this.is_audio_on = true;
		//console.log("audio on!");
		this.button.classList.add("active");
		this.visualizer.show();
		if (this.gainNode)
			this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
	}

	off() {
		this.analyserNode.disconnect(this.audioContext.destination);
		this.is_audio_on = false;
		//console.log("audio off!");
		this.button.classList.remove("active");
		this.visualizer.hide();
		if (this.gainNode)
			this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
	}

	assignClickEvents() {
		const buttons = document.querySelectorAll(".btn");
		const title = document.getElementById("plastic-sarira-title")
		
		const array= [...buttons,title]
		console.log(buttons)
		for (let i = 0; i < array.length; i++) {
			if (array[i].id != "sound-btn") {
				array[i].addEventListener('mousedown', (event) => {
					console.log(this)
					document.getElementById("click").play()
					setTimeout(() => {
						document.getElementById("click").pause();
						document.getElementById("click").currentTime = 0
					}, 100);
				})
			}
		}
	}
}

export {
	Audio12345
};