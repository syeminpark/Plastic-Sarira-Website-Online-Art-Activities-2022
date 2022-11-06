class Language12345{
	constructor(_KR_btn, _EN_btn){
		if(_KR_btn instanceof Element && _EN_btn instanceof Element){
			this.KR_btn = _KR_btn;
			this.EN_btn = _EN_btn;

			this.KR_btn.addEventListener('click',this.KR.bind(this));
			this.EN_btn.addEventListener('click',this.EN.bind(this));
		}else{
			console.error("Language: Button is not DOM.");
			return false;
		}

		this.language = window.navigator.userLanguage || window.navigator.language;
		console.log(this.language);


		if(this.language === 'ko-KR'){
			this.KR();
		}else{
			this.EN();
		}

	}

	EN(){
		this.KR_btn.classList.add('inactive');
		this.EN_btn.classList.remove('inactive');
		const KR_txts = document.getElementsByClassName('KR');
		const EN_txts = document.getElementsByClassName('EN');
		
		for(let i=0; i<KR_txts.length; i++){
			KR_txts[i].style.display = "none";
		}

		for(let i=0; i<EN_txts.length; i++){
			EN_txts[i].style.display = "";
		}

		this.current_lang = "EN";
	}

	KR(){
		this.KR_btn.classList.remove('inactive');
		this.EN_btn.classList.add('inactive');
		const KR_txts = document.getElementsByClassName('KR');
		const EN_txts = document.getElementsByClassName('EN');
		
		for(let i=0; i<KR_txts.length; i++){
			KR_txts[i].style.display = "";
		}

		for(let i=0; i<EN_txts.length; i++){
			EN_txts[i].style.display = "none";
		}

		this.current_lang = "KR";
	}
}

export {Language12345};