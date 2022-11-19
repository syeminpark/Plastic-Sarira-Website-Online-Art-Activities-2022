import {
	Page12345
} from './page.js';
import {
	Preloader12345
} from './../preloader.js';
import {
	SVGLoader12345
} from './../svgloader.js';
import {
	List12345
} from './../list.js';
import ServerClientCommunication from '../serverClientCommunication.js';

import SariraThreeController from '../three/SariraThreeController.js';


class SariArchive12345 extends Page12345 {
	constructor(_pagelayer) {
		super();

		this.pagelayer = _pagelayer
		this.list = new List12345(_pagelayer);
		this.loadedSariras = [];
		this.sariraThreeController = new SariraThreeController(this.pagelayer.singleRenderer,'sarira', false)
		this.serverClientCommunication = new ServerClientCommunication();
	}

	setup() {
		this.sariraThreeController.setCanvas(document.getElementById("full-container"))

		const list_container = this.pagelayer.popup.querySelector("#sari-list");
		const list_scroller = this.pagelayer.popup.querySelector(".scrollable");
		const detail_layer = this.pagelayer.popup.querySelector("#sari-detail-layer");
		if (list_container) {
			this.list.setup(list_container, list_scroller, detail_layer);
			this.loadData();
		}

		const load_more_btn = this.pagelayer.popup.querySelector('#load-more-btn');
		if (load_more_btn) {
			load_more_btn.addEventListener('click', () => {
				if (this.sliced_data.length - 1 > this.load_index) {
					this.load_index++;
					this.loadList(this.sliced_data[this.load_index]);
				} else {

				}
			});
		}

		this.load_index = 0;
		this.loadsvg();
	}

	loadsvg() {
		this.svgloader = new SVGLoader12345(".sari-svg[svg-src]", "svg-src");
	}

	sliceData(_data, _chunk_size) {
		this.sliced_data = [];
		for (let i = 0; i < _data.length; i += _chunk_size) {
			this.sliced_data.push(_data.slice(i, i + _chunk_size));
		}
	}

	async loadData() {


		let range = 20
		//current code 
		let res = await this.serverClientCommunication.getAllSarira()
		console.log(res)

		//dynamically creating a bot_caption by its id 
		for (let i = 0; i < res.allSariraData.length; i++) {
			res.allSariraData[i].bot_caption= res.allSariraData[i].name
		}
		//--> split data at intervals of 20, and load first part.
		this.sliceData(res.allSariraData, range);
		this.loadList(this.sliced_data[this.load_index])



		this.sariraThreeController.create(this.load_index,range, res.allSariraData, this.list.container.children)
		this.sariraThreeController.render();


		this.set_scrolls(this.pagelayer);
	}

	loadList(_data) {
		this.list.load(_data);
	}
}

export {
	SariArchive12345
};