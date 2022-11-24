class UserText{
    constructor(_world, _container, _label){
        this.threeSystem = _world;
		this.container = _container;
        this.userName = _label;

        this.userName.style.position = "absolute";
		this.userName.style.left = "calc(var(--border-width) * 2)";
		this.userName.style.top = "0%";
		this.userName.style.width = "calc(100% - calc(var(--border-width) * 4))";
		this.userName.style.height = "calc(100% - calc(var(--border-width) * 4))";

		this.userName.classList.add("user-name");

        this.userName.textContent = "user name test"
        console.log(_label.textContent)
    }

    setText(text){

    }

    updatePos(){

    }
}

export {UserText}