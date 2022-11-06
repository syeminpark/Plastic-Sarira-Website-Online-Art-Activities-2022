import {Page12345} from './page.js';
import {Preloader12345} from './../preloader.js';
import {SVGLoader12345} from './../svgloader.js';
import {List12345} from './../list.js';

class SariArchive12345 extends Page12345{
	constructor(_pagelayer){
		super();

		this.pagelayer = _pagelayer
		this.list = new List12345();
	}

	setup(){
		const list_container = this.pagelayer.popup.querySelector("#sari-list");
		const list_scroller = this.pagelayer.popup.querySelector(".scrollable");
		const detail_layer = this.pagelayer.popup.querySelector("#sari-detail-layer");
		if(list_container){
			this.list.setup(list_container, list_scroller, detail_layer);
			this.loadData();
		}

		const load_more_btn = this.pagelayer.popup.querySelector('#load-more-btn');
		if(load_more_btn){
			load_more_btn.addEventListener('click',()=>{
				if(this.sliced_data.length-1>this.load_index){
					this.load_index++;
					this.loadList(this.sliced_data[this.load_index]);
				}else{

				}
			});
		}

		this.load_index = 0;

		this.loadsvg();
	}

	loadsvg(){
		this.svgloader = new SVGLoader12345(".sari-svg[svg-src]","svg-src");
	}

	sliceData(_data, _chunk_size){
		this.sliced_data = [];
		for(let i=0; i<_data.length; i+=_chunk_size){
			this.sliced_data.push(_data.slice(i, i+_chunk_size));
		}
	}

	async loadData(){
		const url = "./assets/json/sarira/sarira.json";
		const response = await fetch(url);
		const json = await response.json();
		//console.log(json["sariras"]);

		for(let i=0; i<json["sariras"].length; i++){
			json["sariras"][i]["bot_caption"] = json["sariras"][i]["id"];
		}

		//--> split data at intervals of 20, and load first part.
		this.sliceData(json["sariras"],20);
		this.loadList(this.sliced_data[this.load_index]);

		this.set_scrolls(this.pagelayer);
	}

	loadList(_data){
		this.list.load(_data);
	}
}

export {SariArchive12345};