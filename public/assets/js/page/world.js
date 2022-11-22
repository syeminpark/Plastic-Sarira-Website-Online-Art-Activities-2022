import {Page12345} from './page.js';
import {Preloader12345} from './../preloader.js';
import {SVGLoader12345} from './../svgloader.js';
//import {Audio12345} from './../audio.js';
import {Health12345} from './../health.js';
import {ImageSlide12345} from './../imageslide.js';
import {Joystick12345} from './../joystick.js';

import { WorldSystem } from '../world_source/WorldSystem.js';

const test_img_srcs = [
{img_src : "./assets/img/Naechi/studio/1.jpg", id : "NAE#1", timestamp : "2006-09-07"},
{img_src : "./assets/img/Naechi/studio/2.jpg", id : "NAE#2", timestamp : "2007-11-10"},
{img_src : "./assets/img/Naechi/studio/3.jpg", id : "NAE#3", timestamp : "2012-01-17"}
];

class World12345 extends Page12345 {
	constructor(_pagelayer){
		super();

		this.time = 0;
		this.time_limit = 500;
		this.pagelayer = _pagelayer;
	}

	setup(){
		this.loadsvg();
		//const audio_btn = this.pagelayer.popup.querySelector('#world-sound-btn');
		//const audio_viz = this.pagelayer.popup.querySelector('#world-audio-visualizer');
		//this.audio_controller = new Audio12345(audio_btn, audio_viz);

		const enter_btn = this.pagelayer.popup.querySelector('#world-enter-btn');
		this.enter_message = this.pagelayer.popup.querySelector('#world-enter');
		enter_btn.addEventListener('click',this.enter.bind(this));

		const health_container = this.pagelayer.popup.querySelector('#world-health-container');
		const health_bar = this.pagelayer.popup.querySelector('#world-health-bar');
		this.health = new Health12345(this, health_container, health_bar);

		this.end_message = this.pagelayer.popup.querySelector('#world-end');
		const end_btn = this.pagelayer.popup.querySelector('#world-to-sarira');
		end_btn.addEventListener('click', ()=>{
			document.querySelector('#nav-sarira-btn[data-name="sarira"]').click();
		});

		const popup_closers = this.pagelayer.popup.querySelectorAll('.closer.btn');
		for(let i=0; i<popup_closers.length; i++){
			popup_closers[i].addEventListener('click', ()=>{
				this.closePopups();
			});
		}

		this.l_joystick = new Joystick12345({
			container: this.pagelayer.popup.querySelector('#world-joystick-left'),
			stick: this.pagelayer.popup.querySelector('#world-joystick-left .joystick-thumb')

		});
		this.r_joystick = new Joystick12345({
			container: this.pagelayer.popup.querySelector('#world-joystick-right'),
			stick: this.pagelayer.popup.querySelector('#world-joystick-right .joystick-thumb')
		});

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

		for(let i=0; i<test_img_srcs.length; i++){
			this.imageslider.add_data(test_img_srcs[i]);
		}
		this.imageslider.reposition();

		this.time = 0;
		this.world_ended = false;

		this.world = new WorldSystem(this.pagelayer.singleRenderer);
	}

	unload(){
		if(this.lifecheck){
			clearInterval(this.lifecheck);
		}
	}

	enter(){
		if(!document.querySelector('#show-m-navigation').classList.contains('expanded')){
			document.querySelector('#show-m-navigation').click();
		}
		this.enter_message.classList.add("inactive");
		document.getElementById('world-navigation').classList.remove('m-inactive');
		document.getElementById('world-joystick-left').classList.remove('m-inactive');
		document.getElementById('world-joystick-right').classList.remove('m-inactive');
		this.health.start();

		const world_btns = this.pagelayer.popup.querySelectorAll('.world-nav-btn');
		this.any_world_btn_clicked = false;
		for(let i=0; i<world_btns.length; i++){
			const world_btn = world_btns[i];
			world_btn.addEventListener('click',()=>{
				this.any_world_btn_clicked = true;
				this.togglePopup(world_btn);
			});

			setTimeout(()=>{
				if(!this.any_world_btn_clicked){
					this.togglePopup(world_btn);
					if(i==world_btns.length-1){
						setTimeout(()=>{
							if(!this.any_world_btn_clicked)
							this.togglePopup(world_btn);
						}, 6000*i);
					}
				}
			}, 3000*i);
		}
		
		this.lifecheck = setInterval(()=>{
			this.time+=2;
			if(this.time>this.time_limit){
				this.health.end();
				this.worldEnd();
				clearInterval(this.lifecheck);
			}else{
				this.health.set(1-this.time/this.time_limit);
			}
		},600);

		this.world.animate();
		
		window.addEventListener('keyup', this.moveSari.bind(this));
	}

	moveSari(e){
		//console.log(e);
		if(e.code === 'KeyW'){
			this.health.move(0,-0.1);
		}else if(e.code === 'KeyA'){
			this.health.move(-0.1,0);
		}else if(e.code === 'KeyS'){
			this.health.move(0,0.1);
		}else if(e.code === 'KeyD'){
			this.health.move(0.1,0);
		}else if(e.code === 'KeyZ'){

		}
	}

	worldEnd(){
		//play death sound
		if(document.getElementById('sound-btn').classList.contains('active')){
			document.getElementById('death').play()
		}

		if(document.querySelector('#show-m-navigation').classList.contains('expanded')){
			document.querySelector('#show-m-navigation').click();
		}
		document.getElementById('world-navigation').classList.add('m-inactive');
		document.getElementById('world-joystick-left').classList.add('m-inactive');
		document.getElementById('world-joystick-right').classList.add('m-inactive');
		this.end_message.classList.remove("inactive");
		this.closePopups();
		this.world_ended = true;
		window.removeEventListener('keyup', this.moveSari.bind(this));

		this.world.reset();
	}

	closePopups(){
		const popups = this.pagelayer.popup.querySelectorAll(".world-popup");
		const btns = this.pagelayer.popup.querySelectorAll(".world-nav-btn");
		for(let i=0; i<popups.length; i++){
			popups[i].classList.add('inactive');
			btns[i].classList.remove('active');
		}
	}

	togglePopup(_btn){
		if(this.world_ended) return false;
		const target_popup = this.pagelayer.popup.querySelector('#'+_btn.getAttribute("tid"));
		const popups = this.pagelayer.popup.querySelectorAll(".world-popup");
		const btns = this.pagelayer.popup.querySelectorAll(".world-nav-btn");
		for(let i=0; i<popups.length; i++){
			if(popups[i] === target_popup){
				if(!popups[i].classList.contains("inactive")){
					popups[i].classList.add('inactive');
					btns[i].classList.remove('active');
				}else{
					setTimeout(()=>{
						popups[i].classList.remove('inactive');
						btns[i].classList.add('active');
					},400);
				}
			}else{
				popups[i].classList.add('inactive');
				btns[i].classList.remove('active');
			}
		}
	}

	loadsvg(){
		this.svgloader = new SVGLoader12345(".world-svg[svg-src]","svg-src");
	}
}

export {World12345};