import {Preloader12345} from './assets/js/preloader.js';
import {SVGLoader12345} from './assets/js/svgloader.js';
import {Language12345} from './assets/js/language.js';
import {PageLayer12345} from './assets/js/pagelayer.js';
import {Audio12345} from './assets/js/sound/audio.js';

//Preloader가 사리 만드는 역할
const preloader = new Preloader12345(
	document.querySelector('#preloader'), 
	'white', true, true);

//SVGLOADER는 메뉴 등에 있는 아이콘 로딩하는 역할
const svgloader = new SVGLoader12345('span[svg-src]','svg-src');

//언어 바꿔주는 역할. 영어는 KR라는 css Classname을, 한글은 KR라는 classname으로 지정 
const language = new Language12345(
	document.querySelector('#KR-btn'),
	document.querySelector('#EN-btn'));


// mainpopup_controller의 역할은 어바웃, 리서치, 그리고 사리 아카이브 페이지 열고, 닫기, 언어 관리
const mainpopup_controller = new PageLayer12345(
	document.getElementById("main-popup-layer"),
	document.getElementById("main-popup-container"),
	document.getElementById("popup-preloader"), 'black', true);
mainpopup_controller.assign(document.getElementById("nav-about-btn"),language);
mainpopup_controller.assign(document.getElementById("nav-plastic-btn"),language);
mainpopup_controller.assign(document.getElementById("nav-sarira-btn"),language)

// mainpopup_controller의 역할은 홈, 생태계, 그리고 제목 버튼의 열고, 닫기, 언어 관리
const background_controller = new PageLayer12345(
	document.getElementById("background-container"),
	document.getElementById("bck-container"),
	document.getElementById("bck-preloader"), 'white', false);
background_controller.assign(document.getElementById("nav-home-btn"),language);
background_controller.assign(document.getElementById("nav-world-btn"),language);
background_controller.assign(document.getElementById("plastic-sarira-title"),language,false);

background_controller.assign_hide(mainpopup_controller);
mainpopup_controller.assign_hide(background_controller);

//audio stuff 나중에 이 controller 클래스를 기반으로 확장하면 편할듯
const audio_btn = document.querySelector('#sound-btn');
const audio_viz = document.querySelector('#audio-visualizer');
const audio_controller = new Audio12345(audio_btn, audio_viz);

//mobile menu toggle
const mobile_menu_toggle_btn = document.querySelector('#show-m-navigation');

//홈페이지 전용 preloader(사리 애니메이션 스타트)
preloader.start();


////////////////////////////////////////////////////////////
window.addEventListener('load', ()=>{

	//hides the preloader after execution
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