import {Page12345} from './page.js';
import {Preloader12345} from './../preloader.js';
import {SVGLoader12345} from './../svgloader.js';

class About12345 extends Page12345{
	constructor(_pagelayer){
		super();


		this.pagelayer = _pagelayer
		//console.log(this.pagelayer.popup);
	}

	setup(){

		this.setprofile();
		this.loadsvg();
		this.set_scrolls(this.pagelayer);
	}

	loadsvg(){
		this.svgloader = new SVGLoader12345(".logo[svg-src]","svg-src");
	}

	setprofile(){
		this.profiles = document.querySelectorAll('.profile');
		this.profile_imgs = [];
		if(this.profiles.length){
			for(let i=0; i<this.profiles.length; i++){
				this.profile_imgs[i] = new Preloader12345(
					this.profiles[i], 'white', true, false, {
						radius: 0.05
					}
				);
			}

			/*
			for(let i=0; i<this.profile_imgs.length; i++){
				this.profile_imgs[i].sarira.animation_finished = true;
				this.profile_imgs[i].sarira.resize();
			}
			*/
		}

		this.scroll_el = this.pagelayer.popup.querySelector(".scrollable");
		//console.log(this.scroll_el);
		if(this.scroll_el){
			this.scroll_el.addEventListener('scroll',this.onScroll.bind(this));
		}
	}

	onScroll(){
		//console.log("!");
		let popupbox = this.pagelayer.popup.getBoundingClientRect();
		for(let i=0; i<this.profiles.length; i++){
			let elbox = this.profiles[i].getBoundingClientRect();
			if(elbox.top < popupbox.top + popupbox.height){
				//console.log(this.profile_imgs[i].started);
				if(!this.profile_imgs[i].started)
				this.profile_imgs[i].start();
			}
		}
	}
}

export {About12345};