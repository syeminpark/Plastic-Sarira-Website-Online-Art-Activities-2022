class Scroll12345{
	constructor(_scrollable){
		if(_scrollable instanceof Element){
			this.scrollable = _scrollable;
		}else{
			console.error("Scroll: scroll is not a DOM element.");
			return false;
		}

		this.mutation_observer = new MutationObserver((mutations) => {
			//console.log("!");
			this.onResize();
		    this.onScroll();
		});

		this.mutation_config = { 
			attributes: false, 
			childList: true, 
			subtree: true, 
			characterData: false 
		};

		this.mutation_observer.observe(this.scrollable, this.mutation_config);

		this.scrollable.addEventListener('scroll', this.onScroll.bind(this));
		this.scrollable.addEventListener('resize', this.onResize.bind(this));

		this.scrollbar_track = document.createElement('div');
		this.scrollbar_track.classList.add('scrollbar-track');

		this.scrollbar_thumb = document.createElement('div');
		this.scrollbar_thumb.classList.add('scrollbar-thumb');
		this.scrollbar_track.appendChild(this.scrollbar_thumb);

		this.scrollable.appendChild(this.scrollbar_track);

		this.onResize();
	}

	close(){
		this.scrollable.remove(this.scrollbar_track);
		this.mutation_observer.disconnect();
		//console.log("scroll close");
	}

	onResize(){
		this.scrollable_bbox = this.scrollable.getBoundingClientRect();
		this.scrollbar_track.style.height = this.scrollable_bbox.height + "px";
		this.thumbsize = 100 * this.scrollable_bbox.height / this.scrollable.scrollHeight;
		this.scrollbar_thumb.style.height = (this.thumbsize) + '%';
		//console.log(this.scrollable.scrollHeight);
	}

	onScroll(){
		this.scrollbar_track.style.top = this.scrollable.scrollTop + "px";
		this.scroll_progress = this.scrollable.scrollTop / this.scrollable.scrollHeight;
		this.thumb_position = 100*this.scroll_progress;
		this.thumb_position = Math.min(this.thumb_position, 100 - this.thumbsize);
		this.thumb_position = Math.max(this.thumb_position, 0);
		this.scrollbar_thumb.style.top = 
		'min(calc(var(--scrollbar-thumb-bottom) - '+ (this.thumbsize) +'%), max(' + this.thumb_position + '%, ' + 'var(--scrollbar-thumb-top)' + '))';
	}
}

export {Scroll12345};