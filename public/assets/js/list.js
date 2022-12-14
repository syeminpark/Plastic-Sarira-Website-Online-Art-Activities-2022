

import forcedD3 from "./forceD3.js"

class List12345 {
	constructor(_pagelayer) {
		this.pagelayer = _pagelayer

	}

	setup(_container, _scroller, _detail) {
		this.container = _container;
		this.scroller = _scroller;
		this.detail_layer = _detail;
		this.list_items = [];
		this.total_marker_data=[]

		if (this.scroller) {
			this.scroller.addEventListener('scroll', this.onListScroll.bind(this));
		}

		if (this.detail_layer) {

			const detail_closer = this.detail_layer.querySelector('.closer');
			detail_closer.addEventListener('click', () => {
				this.detail_layer.classList.add('inactive');
				document.getElementById('currentPage').classList.add('detail_inactive');
			
			});
		}
	}

	reset() {
		this.scroller.scrollTop = 0;
		this.list_items = [];
		this.total_marker_data=[]
		if (this.container) {
			while (this.container.firstChild) {
				this.container.removeChild(this.container.lastChild);
			}
		}
	}

	load(_data, param) {

		this.marker_data = _data;
		let range =  this.marker_data.length
		let index= this.list_items.length /range 
		//this.reset();
		for (let i = 0; i < this.marker_data.length; i++) {
			let item = document.createElement('div');
			item.classList.add("list-item");

			if (this.marker_data[i].bot_caption) {
				let bot_caption = document.createElement('span');
				bot_caption.classList.add("list-bot-caption");
				bot_caption.innerHTML = this.marker_data[i].bot_caption;
				item.appendChild(bot_caption);
			}

			if (this.marker_data[i].vert_caption) {
				let vert_caption = document.createElement('span');
				vert_caption.classList.add("list-vert-caption");
				vert_caption.innerHTML = this.marker_data[i].vert_caption;
				item.appendChild(vert_caption);
			}

			if (this.marker_data[i].id) {
				item.setAttribute('data-id', this.marker_data[i].id.replace(/ /g, ''));
			}

			if (this.marker_data[i]["img-src"]) {
				item.setAttribute('img-src', this.marker_data[i]["img-src"]);
			}

		
			this.list_items.push(item);
			this.total_marker_data.push(this.marker_data[i])
			this.container.appendChild(item);
			if (this.detail_layer)
				item.addEventListener('click', () => {
					if (this.marker_data[i].properties != undefined) {
					this.detailLoad(this.total_marker_data[ index*range+i ], param);
				}
				});
		}

		if (this.scroller)
			this.onListScroll();
	}

	detailLoad(_item, param) {
		
		this.detail_layer.classList.remove('inactive');
		document.getElementById('currentPage').classList.remove('detail_inactive');
		if (_item.vert_caption) {
			if (this.detail_layer.querySelector('.detail-layer-caption-1')) {
				this.detail_layer.querySelector('.detail-layer-caption-1').innerHTML = _item.vert_caption;
			}
		}

		if (_item.bot_caption) {
			if (this.detail_layer.querySelector('.detail-layer-caption-2')) {
				this.detail_layer.querySelector('.detail-layer-caption-2').innerHTML = _item.bot_caption;
			}
		}
		// Research page detail
		if (_item.properties != undefined) {
			if (param) {
				param.setup(document.getElementById('plastic-detail-layer'))
				param.import(`./assets/3dmodel/${_item.properties.beach}/${_item.properties.index}.ply`)
			}
		} else {
			param.setup(document.getElementById("sari"))
			param.import(JSON.parse(_item.message).vertices)
			//forceD3(JSON.parse(_item.message).metadata)
			forcedD3()


		}
	}



	listItemImgLoad(_list_item) {
		const list_item = _list_item;
		this.item_bbox = list_item.getBoundingClientRect();
		if (this.item_bbox.top <= this.container_bbox.top + this.container_bbox.height * 1.5) {
			if (!list_item.classList.contains('loading')) {
				let img = new Image();
				list_item.classList.add('loading');
				img.onload = () => {
					list_item.classList.add('loaded');
					list_item.style.backgroundImage =
						"url(" + list_item.getAttribute('img-src') + ")";
					list_item.style.backgroundPosition = 'center';
					list_item.style.backgroundSize = 'contain';
					list_item.style.backgroundRepeat = 'no-repeat';
				};
				img.src = list_item.getAttribute('img-src');
			}
		}
	}

	onListScroll() {
		this.container_bbox = this.container.getBoundingClientRect();
		const items = this.container.querySelectorAll('.list-item');
		for (let i = 0; i < items.length; i++) {
			if (items[i].getAttribute('img-src')) {
				this.listItemImgLoad(items[i]);
			}
		}
	}
}

export {
	List12345
};