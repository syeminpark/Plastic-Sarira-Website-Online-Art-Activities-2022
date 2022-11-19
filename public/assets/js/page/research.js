import {Page12345} from './page.js';
import {Preloader12345} from '../preloader.js';
import {SVGLoader12345} from '../svgloader.js';
import {Map12345} from '../map.js';
import {List12345} from '../list.js';
import PointThree from '../three/SpecificThree.js';

//리서치 페이지 
class Research12345 extends Page12345{
	constructor(_pagelayer){
		super();
		this.researchThree;
		this.pagelayer = _pagelayer
		this.map = new Map12345();
		this.list = new List12345();
	}

	setup(){
		this.researchThree= new PointThree(document.getElementById('plastic-detail-layer'),this.pagelayer.singleRenderer,"research",true);
		//preloads the map
		const mappreload_el = this.pagelayer.popup.querySelector('#map-preloader');
		if(mappreload_el)
		this.map_preloader = new Preloader12345(mappreload_el, "black", false, false, false, true);
		
		const beach_list = this.pagelayer.popup.querySelector('#beach-list');
		if(beach_list){
			//map에 이미지를 띄울 위치값을 담은 json 
			this.beach_list_items = beach_list.querySelectorAll('li[data-link]');
			if(this.beach_list_items.length){
				for(let i=0; i<this.beach_list_items.length; i++){
					const btn = this.beach_list_items[i];
					btn.addEventListener('click',()=>{
						this.onBeachSelect(btn);
					
						for(let j=0; j<this.beach_list_items.length; j++){
							if(this.beach_list_items[j] != btn)
							this.beach_list_items[j].classList.remove("selected");
						}
						btn.classList.add("selected");
					});
				}
			}
		}
	

		const map_container = this.pagelayer.popup.querySelector('#map-container');
		if(map_container)
		this.map.setup(map_container);

		const list_container = this.pagelayer.popup.querySelector('#map-list');
		if(list_container){
			const list_scroller = this.pagelayer.popup.querySelector('.scrollable');
			const detail_layer = this.pagelayer.popup.querySelector('#plastic-detail-wrapper');
			if(list_scroller)
			this.list.setup(list_container, list_scroller, detail_layer);
			this.map.setListTarget(this.list);
		}

		const map_zoom_in_btn = this.pagelayer.popup.querySelector('#zoom-in');
		const map_zoom_out_btn = this.pagelayer.popup.querySelector('#zoom-out');
		if(map_zoom_in_btn && map_zoom_out_btn){
			this.map.setZoomInOutBtns(map_zoom_in_btn, map_zoom_out_btn);
		}

		this.mobile_list_toggle_btn = this.pagelayer.popup.querySelector("#m-plastic-list-toggle");
		this.mobile_list_toggle_target = this.pagelayer.popup.querySelector("#m-list-toggle-target");
		this.mobile_list_toggle_btn.addEventListener('click', this.mobiletogglelist.bind(this));

		this.mobiletogglelist();
		
		if(beach_list){
			this.beach_list_items[0].click();
		}

		this.loadsvg();
	}

	reset_page(){
		super.reset_page()
	}

	mobiletogglelist(){
		if(this.mobile_list_toggle_target.classList.contains('m-inactive')){
			this.mobile_list_toggle_target.classList.remove('m-inactive');
		}else{
			this.mobile_list_toggle_target.classList.add('m-inactive');
		}
	}

	loadsvg(){
		this.svgloader = new SVGLoader12345(".plsvg[svg-src]","svg-src");
	}

	onBeachSelect(_btn){
		//console.log(_btn);
		this.map_preloader.reset();
		this.mobiletogglelist();
		setTimeout(()=>{
			this.loadData(_btn);
		},600);
	}

	async loadData(_btn){
		this.list.reset();
	

		const url = _btn.getAttribute('data-link');
		const response = await fetch(url);
		const json = await response.json();
		//console.log(json);

		if(_btn.getAttribute('data-nogeo')=="true"){
			json["nogeo"] = true;
		}

		this.loadMap(json);
		this.loadList(json);

		this.map_preloader.onLoad();

		this.set_scrolls(this.pagelayer);

	}

	loadMap(_data){
		this.map.load(_data);
	}

	degree2Decimal(_lon, _lat){
		let lon_deg = Math.floor(_lon);
		let lon_min = (_lon-lon_deg)*60;
		let lon_sec = Math.floor((lon_min-Math.floor(lon_min))*60);
		lon_min = Math.floor(lon_min);
		
		let lat_deg = Math.floor(_lat);
		let lat_min = (_lat-lat_deg)*60;
		let lat_sec = Math.floor((lat_min-Math.floor(lat_min))*60);
		lat_min = Math.floor(lat_min);

		return (lat_deg + "°" + lat_min + "'" + lat_sec + '"' + "N" + "," +
			lon_deg + "°" + lon_min + "'" + lon_sec + '"' + "W");
	}

	loadList(_data){
	
		this.list_data = _data["features"].filter((d)=>{
			return d.geometry.type === "Point";
		});

		for(let i=0; i<this.list_data.length; i++){
			this.list_data[i]["lon"] = this.list_data[i].geometry.coordinates[0];
			this.list_data[i]["lat"] = this.list_data[i].geometry.coordinates[1];
			this.list_data[i]["id"] = this.list_data[i].properties.id;
			this.list_data[i]["bot_caption"] = this.list_data[i].properties.id;
			this.list_data[i]["vert_caption"] = this.degree2Decimal(this.list_data[i]["lon"],this.list_data[i]["lat"]);
			this.list_data[i]["img-src"] = this.list_data[i].properties["img-src"];
		}
		
		this.list.load(this.list_data,this.researchThree.import)
	}
	
	
}

export {Research12345};