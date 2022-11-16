import {ReturnTouchPos, IsPointerAvailable, Length2D} from './util.js';

class Map12345{
	constructor(){
		
	}

	setup(_container){
		this.container = _container;
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.pixel_density = 1.5;

		this.container.style.position = "relative";
		this.canvas.style.position = "absolute";
		this.canvas.style.top = "0px";
		this.canvas.style.left = "0px";
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";

		this.animation = null;
		this.zoom = 1.0;
		this.curr_zoom = 1.0;

		this.pan_pos = {x: 0, y: 0};
		this.pan_tpos = {x: 0, y: 0};

		this.resize();

		this.container.appendChild(this.canvas);

		window.addEventListener('resize', this.resize.bind(this));

		this.is_pressed = false;
		this.is_dragged = false;

		this.mpos = {x: 0, y: 0};
		this.mpos_prev = {x: 0, y: 0};
		this.mpos_dt = {x: 0, y: 0};

		if(IsPointerAvailable()){
			this.canvas.addEventListener('mousedown', this.mapPressed.bind(this));
			this.canvas.addEventListener('mousemove', this.mapDragging.bind(this));
			window.addEventListener('mouseup', this.mapReleased.bind(this));
		}else{
			this.canvas.addEventListener('touchstart', this.mapPressed.bind(this));
			this.canvas.addEventListener('touchmove', this.mapDragging.bind(this));
			window.addEventListener('touchend', this.mapReleased.bind(this));
		}
	}

	mapPressed(e){
		this.is_pressed = true;
		this.mpos = ReturnTouchPos(e);
		this.mpos_prev.x = this.mpos.x;
		this.mpos_prev.y = this.mpos.y;

		if(!this.animation) this.animate();
	}

	mapDragging(e){
		e.preventDefault();
		if(this.is_pressed){
			this.is_dragged = true;
			this.mpos = ReturnTouchPos(e);
			this.mpos_dt.x = this.mpos_prev.x - this.mpos.x;
			this.mpos_dt.y = this.mpos_prev.y - this.mpos.y;
			this.mpos_prev.x = this.mpos.x;
			this.mpos_prev.y = this.mpos.y;

			this.pan_tpos.x += this.mpos_dt.x;
			this.pan_tpos.y += this.mpos_dt.y;
		}else{
			this.is_dragged = false;
		}
	}

	mapReleased(e){
		this.is_pressed = false;
		this.is_dragged = false;

		this.mpos = ReturnTouchPos(e);
		this.mpos_dt.x = 0;
		this.mpos_dt.y = 0;
		this.mpos_prev.x = this.mpos.x;
		this.mpos_prev.y = this.mpos.y;
	}

	setZoomInOutBtns(_zoom_in_btn, _zoom_out_btn){

		this.zoom_out_btn = _zoom_out_btn;
		this.zoom_in_btn = _zoom_in_btn;

		this.zoom_out_btn.addEventListener('click',this.zoomOut.bind(this));
		this.zoom_in_btn.addEventListener('click',this.zoomIn.bind(this));
	}

	zoomIn(){
		if(this.data){
			if(this.data.nogeo) return;
		}
		//console.log('map: zoom in!');
		this.zoom *= 1.5;
		this.zoom = Math.min(5.0,this.zoom);
		if(!this.animation) this.animate();
	}

	zoomOut(){
		if(this.data){
			if(this.data.nogeo) return;
		}
		//console.log('map: zoom out!');
		this.zoom *= 1.0/1.5;
		this.zoom = Math.max(1.0,this.zoom);
		if(!this.animation) this.animate();
	}

	animate(){
		this.animation = requestAnimationFrame(this.animate.bind(this));
		
		this.curr_zoom += (this.zoom - this.curr_zoom) * 0.1;

		this.pan_pos.x += (this.pan_tpos.x - this.pan_pos.x) * 0.2;
		this.pan_pos.y += (this.pan_tpos.y - this.pan_pos.y) * 0.2;

		if(	Math.abs(this.zoom - this.curr_zoom)<0.001 && !this.is_dragged && !this.is_pressed &&
			Length2D({x: this.pan_tpos.x - this.pan_pos.x, y: this.pan_tpos.y - this.pan_pos.y})<0.01){
			if(this.zoom == 1.0){
				this.pan_pos.x = 0;
				this.pan_pos.y = 0;

				this.pan_tpos.x = 0; 
				this.pan_tpos.y = 0;
			}

			if(this.animation){
				cancelAnimationFrame(this.animation);
				this.animation = null;
			}
		}

		this.draw();
	}

	resize(){
		this.container_bbox = this.container.getBoundingClientRect();
		
		this.canvas.width = this.container_bbox.width*this.pixel_density;
		this.canvas.height = this.container_bbox.height*this.pixel_density;

		this.setDataBbox();
		this.draw();
		//this.drawMarkers();
	}

	load(_data){
		this.data = _data;

		//console.log(this.data.nogeo);

		this.path_data = this.data["features"].filter((d)=>{
			return d.properties.name === "shape";
		});
		this.bbox_data = this.data["features"].filter((d)=>{
			return d.properties.name === "bbox";
		});
		this.mbbox_data = this.data["features"].filter((d)=>{
			return d.properties.name === "mbbox";
		});
		//this.marker_data = this.data["plastics"];

		this.marker_data = this.data["features"].filter((d)=>{
			return d.geometry.type === "Point";
		});

		for(let i=0; i<this.marker_data.length; i++){
			this.marker_data[i]["lon"] = this.marker_data[i].geometry.coordinates[0];
			this.marker_data[i]["lat"] = this.marker_data[i].geometry.coordinates[1];
			this.marker_data[i]["id"] = this.marker_data[i].properties.id;
			this.marker_data[i]["img-src"]  = this.marker_data[i].properties["img-src"];
			this.marker_data[i]["thumb-src"]  = this.marker_data[i].properties["thumb-src"];

		}

		if(this.data.name_KR && this.container.querySelector(".beach-name .KR")){
			this.container.querySelector(".beach-name .KR").innerHTML = this.data.name_KR;
		}

		if(this.data.name_EN && this.container.querySelector(".beach-name .EN")){
			this.container.querySelector(".beach-name .EN").innerHTML = this.data.name_EN;
		}

		if(this.data.address_KR && this.container.querySelector(".beach-address .KR")){
			this.container.querySelector(".beach-address .KR").innerHTML = this.data.address_KR;
		}

		if(this.data.address_EN && this.container.querySelector(".beach-address .EN")){
			this.container.querySelector(".beach-address .EN").innerHTML = this.data.address_EN;
		}

		this.zoom = 1.0;
		this.curr_zoom = 1.0;

		this.mpos = {x: 0, y: 0};
		this.mpos_prev = {x: 0, y: 0};
		this.mpos_dt = {x: 0, y: 0};

		this.pan_pos = {x: 0, y: 0};
		this.pan_tpos = {x: 0, y: 0};

		//console.log(this.path_data, this.bbox_data, this.marker_data);
		this.setDataBbox();
		
		this.drawMarkers();
		this.draw();
	}

	setDataBbox(){
		if(!this.bbox_data || !this.mbbox_data) return;

		let minx = 1000;
		let maxx = -1000;
		let miny = 1000;
		let maxy = -1000;

		if(window.innerWidth > 800){
			for(let i=0; i<this.bbox_data.length; i++){
				for(let a=0; a<this.bbox_data[i].geometry.coordinates.length; a++){
					for(let b=0; b<this.bbox_data[i].geometry.coordinates[a].length; b++){
						let x = this.bbox_data[i].geometry.coordinates[a][b][0];
						let y = this.bbox_data[i].geometry.coordinates[a][b][1];
						minx = Math.min(minx,x);
						maxx = Math.max(maxx,x);
						miny = Math.min(miny,y);
						maxy = Math.max(maxy,y);
					}
				}
			}
		}else{
			for(let i=0; i<this.mbbox_data.length; i++){
				for(let a=0; a<this.mbbox_data[i].geometry.coordinates.length; a++){
					for(let b=0; b<this.mbbox_data[i].geometry.coordinates[a].length; b++){
						let x = this.mbbox_data[i].geometry.coordinates[a][b][0];
						let y = this.mbbox_data[i].geometry.coordinates[a][b][1];
						minx = Math.min(minx,x);
						maxx = Math.max(maxx,x);
						miny = Math.min(miny,y);
						maxy = Math.max(maxy,y);
					}
				}
			}
		}

		this.map_bbox = {
			top: miny,
			bottom: maxy,
			left: minx,
			right: maxx,
			width: Math.abs(maxx-minx),
			height: Math.abs(maxy-miny)
		};
	}

	projection(_lon,_lat,_marker){
		let x = _lon;
		let y = _lat;

		let ratio = Math.cos(Math.PI*36.9/180.0);		

		x = (x - this.map_bbox.left)/this.map_bbox.width;
		y = (y - this.map_bbox.top)/this.map_bbox.height;

		let xsc = (this.map_bbox.width / Math.max(this.map_bbox.width,this.map_bbox.height));
		let ysc = (this.map_bbox.height / Math.max(this.map_bbox.width,this.map_bbox.height));

		let offx = Math.abs(this.curr_zoom-1.)*this.pan_pos.x/this.canvas.width;
		let offy = Math.abs(this.curr_zoom-1.)*this.pan_pos.y/this.canvas.height;

		offx /= this.curr_zoom;
		offy /= this.curr_zoom;

		offx = Math.min(0.5,Math.max(offx,-0.5));
		offy = Math.min(0.5,Math.max(offy,-0.5));

		x -= offx;
		y += offy*ratio;

		x = (x - 0.5) * ratio * xsc;
		y = (y - 0.5) * -1.0 * ysc;

		if(window.innerWidth > 800){
			if(xsc * ratio < 1.0) {
				x *= 1/(xsc * ratio);
				y *= 1/(xsc * ratio);
				if(ysc * Math.max(this.canvas.width, this.canvas.height) / (xsc * ratio) < this.canvas.height){
					x *= this.canvas.height/(ysc * Math.max(this.canvas.width, this.canvas.height) / (xsc * ratio));
					y *= this.canvas.height/(ysc * Math.max(this.canvas.width, this.canvas.height) / (xsc * ratio));
				}
			}else{
				if(ysc * Math.max(this.canvas.width, this.canvas.height) < this.canvas.height){
					x *= this.canvas.height/(ysc * Math.max(this.canvas.width, this.canvas.height));
					y *= this.canvas.height/(ysc * Math.max(this.canvas.width, this.canvas.height));
				}
			}
		}

		x *= this.curr_zoom;
		y *= this.curr_zoom;

		return {x: x, y: y};
	}

	draw(){
		if(!this.path_data) return;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "beige";
		this.ctx.beginPath();
		for(let i=0; i<this.path_data.length; i++){
			for(let a=0; a<this.path_data[i].geometry.coordinates.length; a++){
				for(let b=0; b<this.path_data[i].geometry.coordinates[a].length; b++){
					let x = this.path_data[i].geometry.coordinates[a][b][0];
					let y = this.path_data[i].geometry.coordinates[a][b][1];
					let p = this.projection(x,y);
					p.x = p.x * Math.max(this.canvas.width, this.canvas.height) + this.canvas.width * 0.5;
					p.y = p.y * Math.max(this.canvas.width, this.canvas.height) + this.canvas.height  * 0.5;
					//console.log(x,y);
					if(b!=0){
						this.ctx.lineTo(p.x,p.y);
					}else{
						this.ctx.moveTo(p.x,p.y);
					}
				}
			}
		}
		this.ctx.closePath();
		this.ctx.fill();

		//console.log(this.data.nogeo)
		if(!this.marker_data || this.data.nogeo){ 
			//console.log("stop drawing markers");
			return;
		}

		let xsc = (this.canvas.width / Math.max(this.canvas.width,this.canvas.height));
		let ysc = (this.canvas.height / Math.max(this.canvas.width,this.canvas.height));

		for(let i=0; i<this.marker_data.length; i++){

			let x = this.marker_data[i].lon;
			let y = this.marker_data[i].lat;
			let p = this.projection(x,y);

			if(this.markers.length){
				this.markers[i].style.left = (50+p.x*100/xsc)+"%";
				this.markers[i].style.top = (50+p.y*100/ysc)+"%";
			}

		}
	}

	drawMarkers(){
		const prev_markers = this.container.querySelectorAll('.map-marker');
		for(let i=0; i<prev_markers.length; i++){
			this.container.removeChild(prev_markers[i]);
		}

		this.markers = [];

		if(!this.path_data || !this.marker_data || this.data.nogeo) return;
		//console.log("draw markers");

		//let xsc = (this.canvas.width / Math.max(this.canvas.width,this.canvas.height));
		//let ysc = (this.canvas.height / Math.max(this.canvas.width,this.canvas.height));

		for(let i=0; i<this.marker_data.length; i++){

			//let x = this.marker_data[i].lon;
			//let y = this.marker_data[i].lat;
			//let p = this.projection(x,y);

			let marker_img = document.createElement('div');
			marker_img.classList.add('img');
			this.markers[i] = document.createElement('div');
			this.markers[i].appendChild(marker_img);
			this.markers[i].setAttribute("data-src",this.marker_data[i]["thumb-src"]);
			this.markers[i].setAttribute("data-id",this.marker_data[i]["id"]);
			this.markers[i].classList.add('map-marker');
			//this.markers[i].style.left = (50+p.x*100/xsc)+"%";
			//this.markers[i].style.top = (50+p.y*100/ysc)+"%";
			let map_marker_triangle = document.createElement('div');
			map_marker_triangle.classList.add('triangle');
			this.markers[i].appendChild(map_marker_triangle);
			this.markerLoad(this.markers[i]);

			this.container.appendChild(this.markers[i]);

			if(IsPointerAvailable()){
				this.markers[i].addEventListener("mouseenter", ()=>{
					this.onMarkerHover(this.markers[i]);
				});

				
				this.markers[i].addEventListener("mouseleave", ()=>{
					this.onMarkerLeave(this.markers[i]);
				});
				

				this.markers[i].addEventListener("click", ()=>{
					this.onMarkerClick(this.markers[i]);
				});
			}else{
				this.markers[i].addEventListener("touchstart", (e)=>{
					e.preventDefault();
					this.onMarkerHover(this.markers[i]);
				});
			}
		}
	}

	setListTarget(_list){
		this.list = _list;
		//console.log(this.list);
	}

	onMarkerClick(_marker){
		if(this.list.scroller){
			const target_id = _marker.getAttribute("data-id");
			console.log(this.list.scroller.querySelector('.list-item[data-id="NAE#1"]'))
			const list_target = this.list.scroller.querySelector(`.list-item[data-id="${target_id.replace(/ /g,'')}"]`);
			
			this.list.scroller.scrollTop = list_target.offsetTop;
		}
	}

	markerLoad(_marker){
		const Img = new Image();
		const Url = _marker.getAttribute('data-src');
		Img.onload = () => {
			_marker.querySelector('.img').style.backgroundImage = "url(" + Url + ")";
		};
		Img.src = Url;
	}

	onMarkerHover(_marker){
		_marker.classList.add('focus');
		//console.log(_marker.getAttribute('data-src'));

		for(let i=0; i<this.markers.length; i++){
			if(_marker != this.markers[i]){
				this.markers[i].classList.remove('focus');
			}
		}
	}

	onMarkerLeave(_marker){
		_marker.classList.remove('focus');
		//_marker.querySelector('.img').style.backgroundImage = "";
	}
}

export {Map12345};