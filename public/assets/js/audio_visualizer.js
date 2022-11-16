class AudioVisualizer12345{
	constructor(_container){
		this.container = _container;
		this.canvas = document.createElement('canvas');
		this.canvas.style.position = "absolute";
		this.canvas.style.top = "0px";
		this.canvas.style.left = "0px";
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
		this.ctx = this.canvas.getContext('2d');
		this.ctx.fillStyle = "rgb(0, 0, 0)";

		this.container.appendChild(this.canvas);

		this.animation = null;
		this.pixel_density = 1.5;

		this.resize();

		window.addEventListener('resize', this.resize.bind(this));
	}

	setAnalyzer(_analyser){
		this.analyser = _analyser;
		this.data = new Uint8Array(this.analyser.frequencyBinCount);
		this.data_pos = []; 
		for(let i=0; i<this.data.length; i++){
			this.data_pos[i] = 0;
		}
	}

	show(){
		this.container.classList.remove('inactive');
		this.resize();
		this.draw();
	}

	hide(){
		this.container.classList.add('inactive');
		if(this.animation){
			cancelAnimationFrame(this.animation);
		}
	}

	resize(){
		this.container_bbox = this.container.getBoundingClientRect();
		this.canvas.width = this.container_bbox.width*this.pixel_density;
		this.canvas.height = this.container_bbox.height*this.pixel_density;
		//console.log(this.container_bbox);
	}

	draw(){
		this.animation = requestAnimationFrame(this.draw.bind(this));
		if(this.analyser) this.analyser.getByteFrequencyData(this.data);
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.margin = this.container_bbox.width*0.15;
		this.interval = 0.5*(this.canvas.width-this.margin*2)/this.data.length;
		//console.log(this.interval * 0.6);
		for(let i=0; i<this.data.length; i++){
			this.data_pos[i] += (this.data[i] - this.data_pos[i])*0.1;
			let v = this.canvas.height*0.25*(this.data_pos[i]/256);
			let x = this.margin+this.interval+i*this.interval*2;
			let y = this.canvas.height*0.5-v;
			this.ctx.beginPath();
			this.ctx.arc(x, y, 
				this.interval*0.6, 0, Math.PI * 2);
			this.ctx.fill();
		}
	}
}

export {AudioVisualizer12345};