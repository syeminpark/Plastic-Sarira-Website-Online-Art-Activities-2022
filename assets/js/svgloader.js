class SVGLoader12345{
	constructor(_query, _attribute){
		this.svg_targets = document.querySelectorAll(_query);
		this.parser = new DOMParser();
		this.attribute = _attribute;

		if(this.svg_targets.length){
			console.log(this.svg_targets);
			this.load();
		}else{
			console.error("SVG loader: no svg targets found.");
			return false;
		}
	}

	async load(){
		for(let i=0; i<this.svg_targets.length; i++){
			const url = this.svg_targets[i].getAttribute(this.attribute);
			const response = await fetch(url);
			const text = await response.text();
			this.svg_targets[i].innerHTML = text;
		}
	}
}

export {SVGLoader12345};