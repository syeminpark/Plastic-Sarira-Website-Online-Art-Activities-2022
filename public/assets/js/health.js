class Health12345{
	constructor(_world, _container, _bar){
		this.value = 100;
		this.threeSystem = _world;
		this.container = _container;
		this.bar = _bar;


		this.bar.style.position = "absolute";
		this.bar.style.left = "calc(var(--border-width) * 2)";
		this.bar.style.top = "50%";
		this.bar.style.transform = "translate(0, -50%)";
		this.bar.style.width = "calc(100% - calc(var(--border-width) * 4))";
		this.bar.style.height = "calc(100% - calc(var(--border-width) * 4))";

		this.container.classList.add("health-container");
		this.bar.classList.add("health-bar");

		this.animation = null;
		this.curr_val = this.value;
		this.ease = 0.1;

		this.pos = {
			x: 50,
			y: 40
		};

		this.barSizeX = this.container.clientWidth;
		this.barSizeY = this.container.clientHeight;

		this.move(0,0);
	}

	move(_dx, _dy){
		this.pos.y+=_dy;
		this.pos.x+=_dx;
		this.container.style.top = (this.pos.y) + '%';
		this.container.style.left = (this.pos.x) + '%';
	}

	updatePos(d){
		const dx = d.x * this.threeSystem.canvas.clientWidth;
		// + this.threeSystem.canvas.getBoundingClientRect().left;
		const dy = d.y * this.threeSystem.canvas.clientHeight;
		// + this.threeSystem.canvas.getBoundingClientRect().top;
		const dyy = d.yy * this.threeSystem.canvas.clientHeight;

		this.container.style.left = dx + 'px';
        this.container.style.top = dy - dyy + 'px';

		this.container.style.width = d.w ;
		this.container.style.height = d.h ;
	}

	getPosition(){
		return this.container.style.top;
	}

	set(_normalized_value){
		this.value = 100*(_normalized_value);
		// console.log(this.value)
	}

	start(){
		this.container.classList.remove("inactive");
		this.update();

	}

	end(){
		this.container.classList.add("inactive");
		if(this.animation){
			cancelAnimationFrame(this.animation);
		}
	}

	update(){
		this.animation = requestAnimationFrame(this.update.bind(this));
		this.curr_val += (this.value - this.curr_val)*this.ease;
		this.bar.style.width = "calc("+ this.curr_val +"% - calc(var(--border-width) * 4))";
	}
}

export {Health12345};