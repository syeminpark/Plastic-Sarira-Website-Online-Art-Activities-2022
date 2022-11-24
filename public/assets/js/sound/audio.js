import {
	AudioVisualizer12345
} from './audio_visualizer.js';
import {
	unmute
} from './unmute.js'

class Audio12345 {
	constructor(_button, _visualizer) {
		this.assignClickEvents();

		this.button = _button;

		this.analyserNode;
		this.backgroundSource;
		this.bufferStartTime

		this.is_audio_on = false;
		this.hasBackgroundStarted = false
		this.is_init = true;
		this.button.addEventListener('click', this.toggle.bind(this));

		this.visualizer = new AudioVisualizer12345(_visualizer);

		this.clickSoundDOM = document.getElementById("click")
		this.zInteractionDOM = document.getElementById('zInteraction')
		this.deathDOM = document.getElementById('death')

		this.clickSoundVolume = 0.5
		this.backgroundVolume = 0.5
		this.deathVolume=0.7
		this.default = 1

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
		this.createAudioElement(this.clickSoundDOM, this.clickSoundVolume)
		//zInteratcion
		this.createAudioElement(this.zInteractionDOM, this.default)
		//death
		this.createAudioElement(this.deathDOM, this.deathVolume)

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
			background_gain.gain.value = this.backgroundVolume
			background_gain.connect(this.analyserNode)

		} catch (error) {
			console.error(error);
		}
	}

	on() {
		if (!this.hasBackgroundStarted) {
			this.backgroundSource.start(0)
			this.hasBackgroundStarted = true
		}
		this.analyserNode.connect(this.audioContext.destination);
		this.bufferStartTime = this.audioContext.currentTime
		this.is_audio_on = true;
		this.button.classList.add("active");
		this.visualizer.show();
	}

	off() {
		this.analyserNode.disconnect(this.audioContext.destination);
		this.is_audio_on = false;
		this.button.classList.remove("active");
		this.visualizer.hide();
		if (this.gainNode)
			this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
	}

	assignClickEvents() {
		//clicksound
		const buttons = document.querySelectorAll(".btn");
		const title = document.getElementById("plastic-sarira-title")
		const array = [...buttons, title]
		for (let i = 0; i < array.length; i++) {
			if (array[i].id != "sound-btn") {
				array[i].addEventListener('mousedown', (event) => {
					event.preventDefault()
					this.clickSoundDOM.currentTime = 0
					this.clickSoundDOM.play()
					setTimeout(() => {
						this.clickSoundDOM.pause();
					}, 150);
				})
			}
		}

		//zInteraction
		document.addEventListener('keydown', (event) => {
			if (event.key == 'z') {
				if (this.is_audio_on) {
					//if the game is playing
					if (!document.getElementById('world-navigation').classList.contains('m-inactive')) {
						this.zInteractionDOM.play()
					}
				}
			}
		})
	}

	//death
	//world.js에서 구현해놓음 


	createAudioElement(element, volume) {
		const audioElement = this.audioContext.createMediaElementSource(element);
		const gain = this.audioContext.createGain();
		gain.gain.value = volume
		audioElement.connect(gain)
		gain.connect(this.audioContext.destination);
	}
}

export {
	Audio12345
};