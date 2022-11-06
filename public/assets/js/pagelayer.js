import {Preloader12345} from './preloader.js';
import {About12345} from './page/about.js';
import {Research12345} from './page/research.js';
import {SariArchive12345} from './page/sari_archive.js';
import {World12345} from './page/world.js';
import {ReturnTouchPos, IsPointerAvailable, Length2D} from './util.js';

class PageLayer12345{
	constructor(_popup, _popup_container, _preloader, _preloader_color, _close_on_outside_click){
		if(_popup instanceof Element && _popup_container instanceof Element &&
			_preloader instanceof Element){
			this.popup = _popup;
			this.popup_container = _popup_container;
			this.popup.classList.add('pagelayer');
			this.preloader_el = _preloader;
			this.preloader = new Preloader12345(this.preloader_el,_preloader_color,true); 
		}else{
			console.error("Page Layer: Element not a DOM element.");
			return false;
		}

		this.closer = this.popup.querySelector('.closer');
		if(this.closer){
			this.closer.addEventListener('click', this.hide.bind(this));
		}

		this.btns = [];

		this.aboutpage = new About12345(this);
		this.researchpage = new Research12345(this);
		this.sarirapage = new SariArchive12345(this);
		this.worldpage = new World12345(this);

		this.is_hidden = true;
		this.is_loading = false;

		this.close_on_outside_click = _close_on_outside_click;
		if(this.close_on_outside_click){
			if(IsPointerAvailable()){
				window.addEventListener('mousedown',this.onclick.bind(this));
			}else{
				window.addEventListener('touchstart',this.onclick.bind(this));
			}
		}
	}

	onclick(e){
		console.log(e)
		if(!this.is_hidden){
			console.log(this.close_on_outside_click);
			const navbar = document.getElementById('navigation');
			if(navbar.contains(e.target)){
				console.log("popup layer : click on nav");
			}else{
				if(this.popup.contains(e.target)){
					console.log("popup layer : click inside popup");
				}else{
					console.log("popup layer : click outside popup");
					// if(window.innerWidth>800)this.hide();
				}
			}
		}
	}

	assign(_btn, _language){
		const lang = _language;
		this.btns.push(_btn);
		const btn = this.btns[this.btns.length-1];
		btn.addEventListener('click',()=>{
			this.triggerLoad(btn, lang);
		});

		if(btn.getAttribute("data-name") == 'home'){
			this.triggerLoad(btn, lang, true);
		}
	}

	unload(_pageLayer){
		if(_pageLayer){
			if(_pageLayer.popup_container){
				while(_pageLayer.popup_container.firstChild){
					_pageLayer.popup_container.removeChild(_pageLayer.popup_container.lastChild);
				}
			}
		}

		this.aboutpage.reset_page();
		this.researchpage.reset_page();
		this.sarirapage.reset_page();
		this.worldpage.unload();

		this.toggleBtns();
	}

	assign_hide(_pageLayer){
		if(_pageLayer.constructor === this.constructor){
			this.other_pagelayer = _pageLayer;
			
			for(let i=0; i<this.btns.length; i++){
				this.btns[i].addEventListener('click', ()=>{
					if(!this.other_pagelayer.is_loading){
						this.other_pagelayer.popup.classList.add("inactive");
						setTimeout(()=>{
							this.other_pagelayer.unload(this.other_pagelayer);
						},300);
					}else{
						console.log("the other pagelayer is loading unable to open page : " + this.btns[i].getAttribute("data-name"))
					}
				});
			}
			
		}else{
			console.error("Page Layer: Not a Page Layer object.");
			return false;
		}
	}

	hide(){
		this.is_hidden = true;
		this.popup.classList.add("inactive");
		this.unload(this);
		const nav_btns = document.getElementById("navigation").querySelectorAll(".btn");
		for(let i=0; i<nav_btns.length; i++){
			if(nav_btns[i].getAttribute("data-name") == 'home'){
				nav_btns[i].click();
			}
		}
	}

	triggerLoad(_btn, _lang, _no_preloader){
	
		if(this.other_pagelayer){
			if(this.other_pagelayer.is_loading){ 
				console.log("the other pagelayer is loading. exit loading : " + _btn.getAttribute("data-name"));
				return false;
			}
		}

		if(!_no_preloader)this.preloader.reset();
		setTimeout(()=>{
			this.is_loading = true;
			this.load(_btn, _lang, _no_preloader);
		},600);
	}

	toggleBtns(_btn){
		const nav_btns = document.getElementById("navigation").querySelectorAll(".btn");
		for(let i=0; i<nav_btns.length; i++){
			if(nav_btns[i] === _btn){
				nav_btns[i].classList.add("active");
			}else{
				nav_btns[i].classList.remove("active");
			}
		}
	}

	async load(_btn, _lang, _no_preloader){
		
		//console.log(_btn);
		const url = _btn.getAttribute('data-src');
		this.is_hidden = false;
		
		if(!_no_preloader)this.preloader.start();

		const title = this.popup.querySelector(".popup-title");
		if(title){
			title.querySelector(".KR").innerHTML = _btn.getAttribute("title-kr");
			title.querySelector(".EN").innerHTML = _btn.getAttribute("title-en");
		}
		let response;
		let text;
		try{
		response = await fetch(url);
		text = await response.text();
		}
		catch(error){

			console.error(error)
		}
		//console.log(text);

		this.popup_container.innerHTML = text;
		console.log(_lang);
		if(_lang){
			if(_lang.current_lang == "EN"){
				_lang.EN();
			}else if(_lang.current_lang == "KR"){
				_lang.KR();
			}
		}

		if(_btn.getAttribute("data-name") == "about"){
			this.aboutpage.setup();
		}else if(_btn.getAttribute("data-name") == "research"){
			this.researchpage.setup();
		}else if(_btn.getAttribute("data-name") == "sarira"){
			this.sarirapage.setup();
		}else if(_btn.getAttribute("data-name") == "world"){
			this.worldpage.setup();
		}

		this.toggleBtns(_btn);

		if(!_no_preloader)this.preloader.onLoad();
		
		this.popup.classList.remove('inactive');
		this.is_loading = false;
		setTimeout(()=>{
			this.is_loading = false;
		}, 300);
	}
}

export {PageLayer12345};