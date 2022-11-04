class ImageSlide12345{
	constructor(_slide_container, _prev_slide, _curr_slide, _next_slide, _prev_btn, _next_btn, _id, _timestamp){
		this.slide_container = _slide_container;

		this.prev_slide = _prev_slide;
		this.curr_slide = _curr_slide;
		this.next_slide = _next_slide;

		this.prev_btn = _prev_btn;
		this.next_btn = _next_btn;

		this.id = _id;
		//this.timestamp = _timestamp;

		this.data = [];
		this.index = 0;
		this.prev_index = 0;

		this.prev_btn.addEventListener('click',this.prev.bind(this));
		this.next_btn.addEventListener('click',this.next.bind(this));
	}

	add_data(_img_path){
		this.data.push(_img_path);
	}

	
	move_index(_dir){
		this.index = this.index + _dir;
		if(this.index>this.data.length-1){
			this.index = 0;
		}else if(this.index<0){
			this.index = this.data.length-1;
		}

		this.prev_index = this.index;
	}

	next(){
		if(this.index<this.data.length-1 && 
		(!this.slide_container.classList.contains("going-prev")&&
		!this.slide_container.classList.contains("going-next"))){
			this.move_index(1);
			this.slide_container.classList.add("going-next");
			setTimeout(()=>{
				this.reposition();
			},500);
		}
	}

	prev(){
		if(this.index>0 && 
		(!this.slide_container.classList.contains("going-prev")&&
		!this.slide_container.classList.contains("going-next"))){
			this.move_index(-1);
			this.slide_container.classList.add("going-prev");
			setTimeout(()=>{
				this.reposition();
			},500);
		}
	}

	reposition(){
		const prev_img = new Image();
		const curr_img = new Image();
		const next_img = new Image();

		let load_count = 0;

		prev_img.onload = () => {
			this.prev_slide.style.backgroundImage = "url(" + prev_img.src + ")";
			load_count++;
			if(load_count>=3)this.reposition_complete();

		};

		curr_img.onload = () => {
			this.curr_slide.style.backgroundImage = "url(" + curr_img.src + ")";
			load_count++;
			if(load_count>=3)this.reposition_complete();
		};

		next_img.onload = () => {
			this.next_slide.style.backgroundImage = "url(" + next_img.src + ")";
			load_count++;
			if(load_count>=3)this.reposition_complete();
		};

		let pind = (this.index>=1)? this.index-1 : this.data.length-1;
		let nind = (this.index<this.data.length-1)? this.index+1 : 0;
		prev_img.src = this.data[pind].img_src;
		curr_img.src = this.data[this.index].img_src;
		next_img.src = this.data[nind].img_src;

		if(pind == this.data.length-1){ 
			this.prev_btn.classList.add("end");
		}else{
			this.prev_btn.classList.remove("end");
		}

		if(nind == 0){ 
			this.next_btn.classList.add("end");
		}else{
			this.next_btn.classList.remove("end");
		}
	}

	reposition_complete(){
		this.id.innerHTML = this.data[this.index].id;
		//this.timestamp.innerHTML = this.data[this.index].timestamp;
		this.slide_container.classList.add("no-transition");
		this.slide_container.classList.remove("going-prev");
		this.slide_container.classList.remove("going-next");
		setTimeout(()=>{
			this.slide_container.classList.remove("no-transition");
		},100);
	}
}

export {ImageSlide12345};