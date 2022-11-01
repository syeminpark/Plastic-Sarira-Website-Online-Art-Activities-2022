import {Sarira12345} from "./sarira.js"; 

class Preloader12345{
	constructor(_container, _white_or_black, _animate, _favicon, _options, _nosarira){
		if(_container instanceof Element){
			this.preloader = _container;
			if(!_nosarira){
				this.sarira = new Sarira12345(this, this.preloader, _white_or_black, _animate, _favicon, _options);
			}else{
				this.sarira = false;
			}
		}else{
			console.error("Preloader12345 : container not a DOM element");
			return false;
		}

		this.onload_called = false;
		this.onanimationend_called = false;
		this.started = false;

		if(!this.sarira){
			this.onanimationend_called = true;
		}
	}

	start(){
		if(this.sarira)
		this.sarira.start();
		this.started = true;
	}

	reset(){
		if(this.sarira){
			this.sarira.resetPosition();
			this.onanimationend_called = false;
		}
		this.onload_called = false;
		this.preloader.classList.remove('inactive');
	}

	onLoad(){
		if(this.onanimationend_called){
			console.log("preloader inactive.");
			this.preloader.classList.add('inactive');
		}else{
			console.log("onload called but animation has not ended.");
			this.onload_called = true;
		}
	}

	onAnimationEnd(){
		console.log("preloader animation has ended.");
		this.onanimationend_called = true;
		if(this.onload_called){
			this.onLoad();
		}
	}
}

export {Preloader12345};