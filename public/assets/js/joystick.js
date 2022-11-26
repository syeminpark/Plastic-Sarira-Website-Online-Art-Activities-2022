import {ReturnTouchPos, IsPointerAvailable, Length2D} from './util.js';

class Joystick12345{
	constructor(_params){
		if(_params){
			this.container = _params.container;
			this.stick = _params.stick;
			this.stick.style.position = "absolute";

			//console.log(this.stick);

			this.is_pressed = false;
			this.is_dragged = false;

			this.isAnimationOn = false;

			this.mpos = {x: 0, y: 0};
			this.pan_pos = {x: 0, y: 0};
			this.pan_tpos = {x: 0, y: 0};
			this.stick_pos = {x: 0, y: 0};

			this.animation = null;

			if(IsPointerAvailable()){
				this.container.addEventListener('mousedown', this.stickPressed.bind(this));
				this.container.addEventListener('mousemove', this.stickDragging.bind(this));
				window.addEventListener('mouseup', this.stickReleased.bind(this));
			}else{
				this.container.addEventListener('touchstart', this.stickPressed.bind(this));
				this.container.addEventListener('touchmove', this.stickDragging.bind(this));
				window.addEventListener('touchend', this.stickReleased.bind(this));
			}
		}
	}

	setPan(){
		this.container_bbox = this.container.getBoundingClientRect();

		this.pan_tpos.x = this.mpos.x - (this.container_bbox.left + this.container_bbox.width * 0.5);
		this.pan_tpos.y = this.mpos.y - (this.container_bbox.top + this.container_bbox.height * 0.5);
	
		// console.log(this.container_bbox, this.pan_tpos, this.mpos);
	}

	stickPressed(e){
		this.is_pressed = true;
		this.mpos = ReturnTouchPos(e);
		this.setPan();

		this.isAnimationOn = true;
		// if(!this.animation) this.animate();
	}

	stickDragging(e){
		e.preventDefault();
		if(this.is_pressed){
			this.is_dragged = true;
			this.mpos = ReturnTouchPos(e);
			this.setPan();
		}else{
			this.is_dragged = false;
		}
	}

	stickReleased(e){
		this.is_pressed = false;
		this.is_dragged = false;

		this.pan_tpos.x = 0;
		this.pan_tpos.y = 0;

		this.mpos = ReturnTouchPos(e);
	}

	animate(){
		// this.animation = requestAnimationFrame(this.animate.bind(this));

		this.container_bbox = this.container.getBoundingClientRect();

		this.pan_pos.x += (this.pan_tpos.x - this.pan_pos.x) * 0.2;
		this.pan_pos.y += (this.pan_tpos.y - this.pan_pos.y) * 0.2;

		let pan_length = Length2D(this.pan_pos);
		let norm_x = this.pan_pos.x / pan_length;
		let norm_y = this.pan_pos.y / pan_length;
		if(pan_length == 0){
			norm_x = 0;
			norm_y = 0;
		}
		//console.log("!", norm_x, norm_y, pan_length);
		pan_length = Math.min(this.container_bbox.width*0.5, pan_length);

		this.stick_pos.x = pan_length * norm_x;
		this.stick_pos.y = pan_length * norm_y;
		//console.log("!", this.stick_pos, pan_length);
		
		let sposx = 100 * this.stick_pos.x / this.container_bbox.width; 
		let sposy = 100 * this.stick_pos.y / this.container_bbox.height;

		this.stick.style.top = (50 + sposy) + '%';
		this.stick.style.left = (50 + sposx) + '%';

		// if(	!this.is_pressed && !this.is_dragged &&
		// 	Length2D({x: this.pan_tpos.x - this.pan_pos.x, y: this.pan_tpos.y - this.pan_pos.y})<0.01){
		// 	if(this.animation){
		// 		cancelAnimationFrame(this.animation);
		// 		this.animation = null;
		// 	}
		// }
	}

	checkAnimate(){
		if (this.isAnimationOn == false) return false;

		// 애니메이션 끝남
		if(	!this.is_pressed && !this.is_dragged &&
			Length2D({x: this.pan_tpos.x - this.pan_pos.x, y: this.pan_tpos.y - this.pan_pos.y})<0.01){
			this.isAnimationOn = false;
			return false;
		} 
		return true;	
	}
}

export {Joystick12345};