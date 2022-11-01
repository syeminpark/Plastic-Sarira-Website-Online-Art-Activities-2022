import {Scroll12345} from './../scroll.js';

class Page12345{
	constructor(){
		this.scroll_12345 = [];
	}

	set_scrolls(_pagelayer){
		if(_pagelayer.popup.querySelector('.scrollbar-track')) return false;
		const scrollables = _pagelayer.popup.querySelectorAll('.scrollable');
		console.log(scrollables);
		this.scroll_12345 = [];
		for(let i=0; i<scrollables.length; i++){
			this.scroll_12345[i] = new Scroll12345(scrollables[i]);
		}
	}

	reset_page(){
		for(let i=0; i<this.scroll_12345.length; i++){
			this.scroll_12345[i].close();
		}
	}
}

export {Page12345};