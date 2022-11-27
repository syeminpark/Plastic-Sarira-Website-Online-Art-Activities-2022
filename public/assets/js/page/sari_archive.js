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

import {
    SariraThree
} from '../rendering/SpecificThree.js';
import ServerClientCommunication from '../utils/serverClientCommunication.js';

import SariraThreeController from '../rendering/SariraThreeController.js';


import {
    createConvexMaterial,
    createPointMaterial
} from'../rendering/material.js';

class SariArchive12345 extends Page12345 {
	constructor(_pagelayer) {
		super();
		this.range = 8
		this.pagelayer = _pagelayer
		this.list = new List12345(_pagelayer);

		
        this.pointMaterial = createPointMaterial()
        this.convexMaterial = createConvexMaterial()
	
		this.sariraThree = new SariraThree(this.pagelayer.singleRenderer, 'sarira', true)
		this.sariraThree.setMaterial(this.pointMaterial, this.convexMaterial)
		this.sariraThree.animate()
		this.sariraThree.render();



		this.sariraThreeController = new SariraThreeController(this.pagelayer.singleRenderer, 'sarira', false)
		this.sariraThreeController.setMaterial(this.pointMaterial, this.convexMaterial)
		this.sariraThreeController.render();
		this.serverClientCommunication = new ServerClientCommunication();
	}

	setup() {
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
				console.log((this.load_index+1)*this.range,this.sariraThreeController.max)
				if (this.sliced_data.length - 1 > this.load_index ) {
					this.load_index++;
					this.loadList(this.sliced_data[this.load_index]);
					this.sariraThreeController.create(this.load_index, this.range, this.res.allSariraData,this.list.container.children)

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

		//current code 
		this.res = await this.serverClientCommunication.getSariraByRange(this.sariraThreeController.max)
		console.log(this.res)

		//dynamically creating a bot_caption by its id 
		for (let i = 0; i < this.res.allSariraData.length; i++) {
			this.res.allSariraData[i].bot_caption = this.res.allSariraData[i].name
			this.res.allSariraData[i].vert_caption = this.res.allSariraData[i].createdAt.split('T')[0]		}
		//--> split data at intervals of 20, and load first part.
		this.sliceData(this.res.allSariraData, this.range);
		this.loadList(this.sliced_data[this.load_index])
		this.set_scrolls(this.pagelayer);

		this.sariraThreeController.setup(document.getElementById("full-container"))
		this.sariraThreeController.create(this.load_index, this.range, this.res.allSariraData,this.list.container.children)
		
		// this.set_scrolls(this.pagelayer);
	}

	loadList(_data) {
		this.list.load(_data,this.sariraThree);
	}
}

export {
	SariArchive12345
};