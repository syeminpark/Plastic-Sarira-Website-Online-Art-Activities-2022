class Sarira12345{
	constructor(_parent, _container, _white_or_black, _animate, _favicon, _options){
		this.parent = _parent;
		this.animate = false;
		this.animation = null;
		this.white_or_black = (_white_or_black)? _white_or_black : "white";
		this.load_favicon = _favicon;

		this.position = [];
		this.target_position = [];
		this.current_position = [];

		this.sarira_num = 16;
		this.rad_scale = 0.015;

		if(_options){
			if(_options.radius) this.rad_scale = _options.radius;
		}

		this.container = _container;
		this.canvas = document.createElement('canvas');
		
		this.canvas.style.position = "absolute";
		this.canvas.style.top = "0px";
		this.canvas.style.left = "0px";
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";

		this.pixel_density = 1.5;
		this.ease = 0.1;

		this.container.appendChild(this.canvas);
		this.ctx = this.canvas.getContext('2d');

		this.resetPosition();

		if(_animate == true){
			this.animate = true;
		}

		//console.log(this.animate);

		window.addEventListener('resize', this.resize.bind(this));
	}

	start(){
		this.draw();
	}

	resetPosition(){
		this.position = [];
		this.target_position = [];
		for(let i=0; i<this.sarira_num; i++){
			let px = Math.random()*2-1;
			let py = Math.random()*2-1;
			let tpx = Math.random()*2-1;
			let tpy = Math.random()*2-1;

			this.position.push({x:px,y:py});
			this.target_position.push({x:tpx,y:tpy});
		}

		this.animation_finished = false;

		this.resize();
	}

	resize(){
		this.container_box = this.container.getBoundingClientRect();
		this.canvas.width = this.container_box.width*this.pixel_density;
		this.canvas.height = this.container_box.height*this.pixel_density;
		this.sarira_rad = Math.min(this.canvas.width, this.canvas.height)*this.rad_scale;
		this.padding = this.sarira_rad*4;
		this.cluster_rad = this.sarira_rad*5;

		this.current_position = [];
		if(this.animation_finished){
			for(let i=0; i<this.position.length; i++){
				let tx = (this.target_position[i].x*.5+.5)*(this.cluster_rad)+this.canvas.width*.5-this.cluster_rad*.5; 
				let ty = (this.target_position[i].y*.5+.5)*(this.cluster_rad)+this.canvas.height*.5-this.cluster_rad*.5;	
				this.current_position.push({x:tx,y:ty});
			}
		}else{
			for(let i=0; i<this.position.length; i++){
				let x = (this.position[i].x*.5+.5)*(this.canvas.width-this.padding*2)+this.padding; 
				let y = (this.position[i].y*.5+.5)*(this.canvas.height-this.padding*2)+this.padding; 	
				this.current_position.push({x:x,y:y});
			}
		}

		this.drawScene();
	}

	update(){
		let end_count = 0;
		for(let i=0; i<this.position.length; i++){
			let tx = (this.target_position[i].x*.5+.5)*(this.cluster_rad)+this.canvas.width*.5-this.cluster_rad*.5; 
			let ty = (this.target_position[i].y*.5+.5)*(this.cluster_rad)+this.canvas.height*.5-this.cluster_rad*.5; 	

			this.current_position[i].x += (tx - this.current_position[i].x)*this.ease;
			this.current_position[i].y += (ty - this.current_position[i].y)*this.ease;

			let distx = Math.abs(tx - this.current_position[i].x);
			let disty = Math.abs(ty - this.current_position[i].y);

			if(Math.sqrt(distx+disty)<1){
				end_count++;
			}
		}

		if(end_count>=this.position.length){
			this.stop();
		}
	}

	drawScene(){
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

		this.ctx.fillStyle = this.white_or_black;
		
		for(let i=0; i<this.position.length; i++){
			this.ctx.beginPath();
			this.ctx.arc(
				this.current_position[i].x, 
				this.current_position[i].y, 
				this.sarira_rad, 0, Math.PI * 2);
			this.ctx.fill();
		}
		
	}

	draw(){
		if(this.animate)
		this.animation = requestAnimationFrame(this.draw.bind(this));

		this.update();
		this.drawScene();
	}

	stop(){
		if(this.animation){
			cancelAnimationFrame(this.animation);
			console.log('loading animation ended');
			if(this.load_favicon)this.loadfavicon();
			this.parent.onAnimationEnd();
		}

		this.animation_finished = true;
	}

	loadfavicon(){
		if(this.canvas.width > 0 && this.canvas.height > 0){
			console.log('loading favicon');

			let favcanvas = document.createElement('canvas');
			favcanvas.width = 192;
			favcanvas.height = 192;

			let favctx = favcanvas.getContext('2d');
		
			favctx.drawImage(this.canvas,
				this.canvas.width*.5-this.cluster_rad*.5-this.sarira_rad,
				this.canvas.height*.5-this.cluster_rad*.5-this.sarira_rad,
				this.cluster_rad+this.sarira_rad*2,
				this.cluster_rad+this.sarira_rad*2,
				0,0,favcanvas.width,favcanvas.height);

			let favtag = document.querySelector('#favicon');
			if(favtag){
				favtag.href = favcanvas.toDataURL();
			}
		}
	}
}

export {Sarira12345};