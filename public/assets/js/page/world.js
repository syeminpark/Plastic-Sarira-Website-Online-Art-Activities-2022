import {
	Page12345
} from './page.js';
import {
	Preloader12345
} from './../preloader.js';
import {
	SVGLoader12345
} from './../svgloader.js';
//import {Audio12345} from './../audio.js';

import {
	ImageSlide12345
} from './../imageslide.js';
import {
	WorldSystem
} from '../world_source/WorldSystem.js';
import {
	UserController
} from '/assets/js/utils/UserController.js';
import SingleRenderer from '/assets/js/rendering/SingleRenderer.js'

import ServerClientCommunication from '../utils/serverClientCommunication.js';
import {
	miniSariraThree
} from '../rendering/SpecificThree.js';

import config from '../utils/config.js';

import SariraGenerationSound from '../sound/SariraGenerationSound.js';

class World12345 extends Page12345 {
	constructor(_pagelayer) {
		super();

		this.time = 0;
		this.time_limit = 500;
		this.pagelayer = _pagelayer;

		this.world = new WorldSystem(this.pagelayer);

		this.miniRenderer = new SingleRenderer()
		this.miniSariraThree = new miniSariraThree(this.miniRenderer, 'world', false)
		this.miniSariraThree.render()
		this.miniSariraThree.animate()

		this.userController = new UserController(this);
		this.ServerClientCommunication = new ServerClientCommunication()
		this.animate();
	}

	setup() {
		
		this.unload();
		this.loadsvg();

		const enter_btn = this.pagelayer.popup.querySelector('#world-enter-btn');
		this.enter_message = this.pagelayer.popup.querySelector('#world-enter');
		enter_btn.addEventListener('click', this.enter.bind(this));

		this.end_message = this.pagelayer.popup.querySelector('#world-end');
		const end_btn = this.pagelayer.popup.querySelector('#world-to-sarira');
		end_btn.addEventListener('click', () => {
			document.querySelector('#nav-sarira-btn[data-name="sarira"]').click();
		});

		const popup_closers = this.pagelayer.popup.querySelectorAll('.closer.btn');
		for (let i = 0; i < popup_closers.length; i++) {
			popup_closers[i].addEventListener('click', () => {
				this.closePopups();
			});
		}

		// this.l_joystick = new Joystick12345({
		// 	container: this.pagelayer.popup.querySelector('#world-joystick-left'),
		// 	stick: this.pagelayer.popup.querySelector('#world-joystick-left .joystick-thumb')

		// });
		// this.r_joystick = new Joystick12345({
		// 	container: this.pagelayer.popup.querySelector('#world-joystick-right'),
		// 	stick: this.pagelayer.popup.querySelector('#world-joystick-right .joystick-thumb')
		// });

		this.imageslider = new ImageSlide12345(
			this.pagelayer.popup.querySelector('#history-img-slide'),
			this.pagelayer.popup.querySelector('#history-img-slide-prev'),
			this.pagelayer.popup.querySelector('#history-img-slide-curr'),
			this.pagelayer.popup.querySelector('#history-img-slide-next'),
			this.pagelayer.popup.querySelector('#history-img-slide-prev-btn'),
			this.pagelayer.popup.querySelector('#history-img-slide-next-btn'),
			this.pagelayer.popup.querySelector('#img-caption-id'),
			//this.pagelayer.popup.querySelector('#img-caption-timestamp')
		);
		//console.log(this.imageslider);

		// for (let i = 0; i < test_img_srcs.length; i++) {
		// 	this.imageslider.add_data(test_img_srcs[i]);
		// }
		// this.imageslider.reposition();

		this.time = 0;
		this.world_ended = false;

		this.dom = document.getElementById('world-navigation');
		this.miniSariraThree.setup(document.getElementById('sari-profile-container'), document.getElementById("world-profile"))
		this.world.setup(document.getElementById('world-scene'), document.getElementById('world-navigation'), this.miniSariraThree);
		this.world.importPLY(this.imageslider.add_data, this.imageslider.reposition, config.initialMaxPlasticCount);	
		this.userController.setup(this.world);

	}

	unload() {
		if (this.lifecheck) {
			clearInterval(this.lifecheck);
		}

		this.world.unload()
	}

	enter() {
		// let i =0; 
		// let importPLY =setInterval( ()=>{
		// 	this.world.importPLY(this.imageslider.add_data, this.imageslider.reposition,1);	
		// 	i++ 
		// 	if( i >10){
				
		// 		clearInterval(this.lifecheck);
		// 	}
		
		// },5000)

		this.userController.resetKeyboardState();

		let inputs = (document.querySelectorAll('input'))
		for (let input of inputs) {
			if (!input.value == "") {
				if (!document.querySelector('#show-m-navigation').classList.contains('expanded')) {
					document.querySelector('#show-m-navigation').click();
				}
				this.enter_message.classList.add("inactive");
				document.getElementById('world-navigation').classList.remove('m-inactive');
				document.getElementById('world-joystick-left').classList.remove('m-inactive');
				document.getElementById('world-joystick-right').classList.remove('m-inactive');

				this.userController.start(input.value);
				this.ServerClientCommunication.createUser(input.value)
				this.world.setUserName(input.value)


				const world_btns = this.pagelayer.popup.querySelectorAll('.world-nav-btn');
				this.any_world_btn_clicked = false;

				for (let i = 0; i < world_btns.length; i++) {
					const world_btn = world_btns[i];
					world_btn.addEventListener('click', () => {
						this.any_world_btn_clicked = true;
						this.togglePopup(world_btn);
					});

					// setTimeout(() => {
					// 	if (!this.any_world_btn_clicked) {
					// 		this.togglePopup(world_btn);
					// 		if (i == world_btns.length - 1) {
					// 			setTimeout(() => {
					// 				if (!this.any_world_btn_clicked)
					// 					this.togglePopup(world_btn);
					// 			}, 6000 * i);
					// 		}
					// 	}
					// }, 3000 * i);
				}
				//only toggle controls 
				this.togglePopup( world_btns[2]);

				this.lifecheck = setInterval(() => {
					this.time += 2;
					if (this.world.life_user.isDead == true) {
						clearInterval(this.lifecheck);
						this.userController.end();
						this.worldEnd();

					} else {
						this.world.life_user.age ++;
						this.userController.healthbarActive();
					}
				}, 1000);

				// window.addEventListener('keyup', this.moveSari.bind(this));
			}
		}
	}

	animate = () => {
		requestAnimationFrame(this.animate);
		if (this.isWorldPage()) {
			this.world.animate();
		}
		if (this.hasEnetered()) {
			this.userController.update();
		}
	}

	isWorldPage() {
		if (document.getElementById("currentPage").innerHTML == "world") {
			return true
		}
	}
	hasEnetered() {
		if (document.getElementById("currentPage").innerHTML == "world") {
			if (document.getElementById('world-navigation') != null) {
				if (document.getElementById('world-navigation').classList.contains('m-inactive')) {
					return false
				} else {
					return true
				}
			}
		}
	}


	moveSari(e) {
		//console.log(e);
		if (e.code === 'KeyW') {
			//this.health.move(0,-0.1);
		} else if (e.code === 'KeyA') {
			//this.health.move(-0.1,0);
		} else if (e.code === 'KeyS') {
			//this.health.move(0,0.1);
		} else if (e.code === 'KeyD') {
			//this.health.move(0.1,0);
		} else if (e.code === 'KeyZ') {}
	}

	worldEnd() {
		//play death sound
		if (document.getElementById('sound-btn').classList.contains('active')) {
			document.getElementById('death').play()
		}


		if (document.querySelector('#show-m-navigation').classList.contains('expanded')) {
			document.querySelector('#show-m-navigation').click();
		}

		document.getElementById('world-navigation').classList.add('m-inactive');
		document.getElementById('world-joystick-left').classList.add('m-inactive');
		document.getElementById('world-joystick-right').classList.add('m-inactive');

		this.end_message.classList.remove("inactive");


		this.miniSariraThree.switchDom(document.getElementById('world-end-sarira'), this.end_message)
		this.closePopups();
		this.world_ended = true;
		window.removeEventListener('keyup', this.moveSari.bind(this));
		let data = this.world.getSariraData()
		this.ServerClientCommunication.postSariraById(data)


	}

	closePopups() {
		const popups = this.pagelayer.popup.querySelectorAll(".world-popup");
		const btns = this.pagelayer.popup.querySelectorAll(".world-nav-btn");
		for (let i = 0; i < popups.length; i++) {
			popups[i].classList.add('inactive');
			btns[i].classList.remove('active');
		}
	}

	togglePopup(_btn) {
		if (this.world_ended) return false;
		const target_popup = this.pagelayer.popup.querySelector('#' + _btn.getAttribute("tid"));
		const popups = this.pagelayer.popup.querySelectorAll(".world-popup");
		const btns = this.pagelayer.popup.querySelectorAll(".world-nav-btn");
		for (let i = 0; i < popups.length; i++) {
			if (popups[i] === target_popup) {
				if (!popups[i].classList.contains("inactive")) {
					popups[i].classList.add('inactive');
					btns[i].classList.remove('active');
				} else {
					setTimeout(() => {
						popups[i].classList.remove('inactive');
						btns[i].classList.add('active');
					}, 400);
				}
			} else {
				popups[i].classList.add('inactive');
				btns[i].classList.remove('active');
			}
		}
	}

	loadsvg() {
		this.svgloader = new SVGLoader12345(".world-svg[svg-src]", "svg-src");
	}
}

export {
	World12345
};