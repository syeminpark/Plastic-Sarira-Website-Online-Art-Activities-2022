class UserText{
    constructor(_world, _container, _label){
        this.threeSystem = _world;
		this.container = _container;
        this.userName = _label;

        this.userName.style.position = "absolute";
		// this.userName.style.left = "50%";
		this.userName.style.top = "-320%";

		this.userName.classList.add("user-name");
    }

    setText(text){
        this.userName.textContent = text;

        this.userName.style.left = (this.container.clientWidth * .5) - (this.userName.clientWidth * .5);
    }
}

export {UserText}