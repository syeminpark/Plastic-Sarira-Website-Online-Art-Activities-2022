class VirtualKeyboard {
    constructor() {

        createDomElement("div", false, "buttonInput", null, document.body);


        this.element = document.getElementById("buttonInput")
        this.element.innerHTML=null;

        const Keyboard = window.SimpleKeyboard.default;
        const myKeyboard = new Keyboard({
            onKeyPress: (function (button) {
                    this.element.innerHTML = button

            }).bind(this),
            onKeyReleased: (function () {
                    this.element.innerHTML = null;

            }).bind(this),
            theme: "hg-theme-default myTheme1",
            layout: {
                'default': [
                    ' W ',
                    'A S D',
                    ' Z '
                ]
            },
            preventMouseDownDefault: true,
            preventMouseUpDefault: true,
            stopMouseDownPropagation: true,
            stopMouseUpPropagation: true,
            disableButtonHold: true,
        });

    }

    getKeyValue() {
        return this.element.innerHTML
    }
    resetKeyValue(){
        this.element.innerHTML=null
    }
}

export {VirtualKeyboard}