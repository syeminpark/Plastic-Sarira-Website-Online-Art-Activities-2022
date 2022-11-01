import {AudioVisualizer12345} from './audio_visualizer.js';

class Audio12345{
	constructor(_button, _visualizer){
		this.button = _button;

		this.is_audio_on = false;
		this.is_init = true;

		this.volume = 0.1;

		this.button.addEventListener('click', this.toggle.bind(this));

		this.visualizer = new AudioVisualizer12345(_visualizer);
	}

	toggle(){
		if(this.is_audio_on){
			this.off();
		}else{
			this.on();
		}
	}

	initAudio(){
		this.audioCtx = new AudioContext();

		this.oscillator = this.audioCtx.createOscillator();
		this.oscillator.type = 'square';
		//this.oscillator.frequency.setValueAtTime(140, this.audioCtx.currentTime);
		
		setInterval(()=>{
			this.oscillator.frequency.setValueAtTime(
				(Math.sin(Math.floor(this.audioCtx.currentTime))*0.5+0.5)*600+140, this.audioCtx.currentTime);
		}, 600);

		this.gainNode = this.audioCtx.createGain();
		this.oscillator.connect(this.gainNode);
		this.gainNode.connect(this.audioCtx.destination);

		this.analyserNode = this.audioCtx.createAnalyser();
		this.analyserNode.fftSize = 64;
		this.gainNode.connect(this.analyserNode);
		this.analyserNode.connect(this.audioCtx.destination);
		
		this.visualizer.setAnalyzer(this.analyserNode);

		this.oscillator.start();
	}

	on(){
		if(this.is_init){
			this.initAudio();
			this.is_init = false;
		}

		this.is_audio_on = true;
		console.log("audio on!");
		this.button.classList.add("active");
		this.visualizer.show();
		if(this.gainNode)
		this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
	}

	off(){
		this.is_audio_on = false;
		console.log("audio off!");
		this.button.classList.remove("active");
		this.visualizer.hide();
		if(this.gainNode)
		this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
	}
}

export {Audio12345};