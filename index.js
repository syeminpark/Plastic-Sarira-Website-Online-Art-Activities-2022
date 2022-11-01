import {Preloader12345} from './assets/js/preloader.js';
import {SVGLoader12345} from './assets/js/svgloader.js';
import {Language12345} from './assets/js/language.js';
import {PageLayer12345} from './assets/js/pagelayer.js';
import {Audio12345} from './assets/js/audio.js';

console.log('indexjs initiated');

const preloader = new Preloader12345(
	document.querySelector('#preloader'), 
	'white', true, true);
const svgloader = new SVGLoader12345('span[svg-src]','svg-src');
const language = new Language12345(
	document.querySelector('#KR-btn'),
	document.querySelector('#EN-btn'));

const mainpopup_controller = new PageLayer12345(
	document.getElementById("main-popup-layer"),
	document.getElementById("main-popup-container"),
	document.getElementById("popup-preloader"), 'black', true);
mainpopup_controller.assign(document.getElementById("nav-about-btn"),language);
mainpopup_controller.assign(document.getElementById("nav-plastic-btn"),language);
mainpopup_controller.assign(document.getElementById("nav-sarira-btn"),language);


const background_controller = new PageLayer12345(
	document.getElementById("background-container"),
	document.getElementById("bck-container"),
	document.getElementById("bck-preloader"), 'white', false);
background_controller.assign(document.getElementById("nav-home-btn"),language);
background_controller.assign(document.getElementById("nav-world-btn"),language);
background_controller.assign(document.getElementById("plastic-sarira-title"),language);

background_controller.assign_hide(mainpopup_controller);
mainpopup_controller.assign_hide(background_controller);

const audio_btn = document.querySelector('#sound-btn');
const audio_viz = document.querySelector('#audio-visualizer');
const audio_controller = new Audio12345(audio_btn, audio_viz);

const mobile_menu_toggle_btn = document.querySelector('#show-m-navigation');

preloader.start();
window.addEventListener('load', ()=>{
	preloader.onLoad();

	mobile_menu_toggle_btn.addEventListener('click', ()=>{
		if(mobile_menu_toggle_btn.classList.contains('expanded')){
			mobile_menu_toggle_btn.classList.remove('expanded');
			document.getElementById("main-popup-layer").classList.remove('expanded');
			document.getElementById("navigation").classList.remove('expanded');
			document.body.classList.remove("expanded");
		}else{
			mobile_menu_toggle_btn.classList.add('expanded');
			document.getElementById("main-popup-layer").classList.add('expanded');
			document.getElementById("navigation").classList.add('expanded');
			document.body.classList.add("expanded");
		}
	});

	function SetVH(){
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	}

	SetVH();

	window.addEventListener('resize', SetVH);

	window.addEventListener('contextmenu', (e)=>{
		e.preventDefault();
		return false;
	});
	
	window.addEventListener('touchstart', (e)=>{
		if(e.touches.length > 1){
			e.preventDefault();
		}
	});
});