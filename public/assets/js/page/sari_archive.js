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
} from '../rendering/material.js';

import config from '../utils/config.js';
class SariArchive12345 extends Page12345 {
	constructor(_pagelayer) {
		super();
		this.range = config.sariraCountPerLoad
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

	async setup() {
		const list_container = this.pagelayer.popup.querySelector("#sari-list");
		const list_scroller = this.pagelayer.popup.querySelector(".scrollable");
		const detail_layer = this.pagelayer.popup.querySelector("#sari-detail-layer");
		const load_more_btn = this.pagelayer.popup.querySelector('#load-more-btn');



		this.load_index = 0;
		let res;
		this.totalSariraCount = await this.serverClientCommunication.getTotalSariraCount()
		this.sariraThreeController.setup(document.getElementById("full-container"),	this.totalSariraCount)
		console.log('sariraTotalCount', this.totalSariraCount)


		if (list_container) {
			this.list.setup(list_container, list_scroller, detail_layer);
			res = await this.loadData()
			document.getElementById('archive-loading').classList.add('inactive')
			if (load_more_btn) {
				load_more_btn.classList.remove('inactive')
			}
		}
		if (load_more_btn) {
			load_more_btn.addEventListener('click', async () => {
				this.availableIndexLength = this.totalSariraCount / this.range - this.load_index-1
				if (this.availableIndexLength > 0) {
					this.load_index++;
					this.loadData();
					// this.loadList(this.sliced_data[this.load_index]);
					// this.sariraThreeController.create(this.load_index, this.range, res.allSariraData, this.list.container.children)
					
					if(this.totalSariraCount / this.range - this.load_index- 1< 1){
						load_more_btn.innerHTML = "END OF LIST"
					}
					
				} 
			});
		}
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
		let res = await this.serverClientCommunication.getSariraByRange(this.load_index, this.range)
		console.log(res.sariraData)
		if (res.sariraData.length > 0) {
			//dynamically creating a bot_caption by its id 
			for (let i = 0; i < res.sariraData.length; i++) {
				res.sariraData[i].bot_caption = res.sariraData[i].name
				res.sariraData[i].vert_caption = res.sariraData[i].createdAt.split('T')[0]
			}
			//--> split data at intervals of 20, and load first part.
			// this.sliceData(res.sariraData, this.range);
			// this.loadList(this.sliced_data[this.load_index])
			this.list.load(res.sariraData, this.sariraThree, );
			// this.set_scrolls(this.pagelayer);
			this.sariraThreeController.create(this.load_index, this.range, res.sariraData, this.list.container.children)
			return res
		}
	}

	// loadList(_data) {
	// 	this.list.load(_data, this.sariraThree);
	// }
}

export {
	SariArchive12345
};